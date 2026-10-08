#!/usr/bin/env python3
"""Compile the book's complete programs and check every published sample.

The default comparison ignores whitespace only.  A task may opt in to numeric
comparison with ``comparison: {"mode": "numeric", "tolerance": 1e-6}``.
Different valid constructive answers need a separate problem-specific checker;
they are deliberately reported as mismatches rather than accepted here.
"""

from __future__ import annotations

import argparse
import concurrent.futures
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
import hashlib
import json
import os
from pathlib import Path
import py_compile
import re
import subprocess
import sys
import tempfile
import time


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def command_run(command: list[str], timeout: float, input_text: str | None = None) -> dict:
    started = time.monotonic()
    environment = dict(os.environ, PYTHONIOENCODING="utf-8")
    try:
        result = subprocess.run(
            command, input=input_text, stdout=subprocess.PIPE,
            stderr=subprocess.PIPE, text=True, encoding="utf-8", errors="replace",
            timeout=timeout, env=environment,
        )
        return {
            "command": command, "returncode": result.returncode,
            "stdout": result.stdout, "stderr": result.stderr,
            "seconds": round(time.monotonic() - started, 4), "timedOut": False,
        }
    except subprocess.TimeoutExpired as error:
        def as_text(value):
            return value.decode("utf-8", errors="replace") if isinstance(value, bytes) else (value or "")
        return {
            "command": command, "returncode": None,
            "stdout": as_text(error.stdout), "stderr": as_text(error.stderr),
            "seconds": round(time.monotonic() - started, 4), "timedOut": True,
        }
    except OSError as error:
        return {
            "command": command, "returncode": None, "stdout": "", "stderr": str(error),
            "seconds": round(time.monotonic() - started, 4), "timedOut": False,
        }


def decimal_equivalent(expected: list[str], actual: list[str], tolerance: str) -> bool:
    if len(expected) != len(actual):
        return False
    limit = Decimal(tolerance)
    if limit < 0 or not limit.is_finite():
        raise ValueError("numeric tolerance must be finite and nonnegative")
    for wanted, received in zip(expected, actual):
        if wanted == received:
            continue
        try:
            target, value = Decimal(wanted), Decimal(received)
        except InvalidOperation:
            return False
        if not target.is_finite() or not value.is_finite():
            return False
        if abs(target - value) > max(limit, limit * abs(target)):
            return False
    return True


def compare_output(expected: str, actual: str, task: dict, example: dict) -> dict:
    comparison = example.get("comparison", task.get("comparison", "tokens"))
    if isinstance(comparison, str):
        comparison = {"mode": comparison}
    mode = comparison.get("mode", "tokens")
    wanted, received = expected.split(), actual.split()
    result = {"mode": mode, "expectedTokens": len(wanted), "actualTokens": len(received)}
    if mode == "exact":
        result["matched"] = expected.replace("\r\n", "\n") == actual.replace("\r\n", "\n")
    elif mode == "numeric":
        tolerance = str(comparison.get("tolerance", "0.000001"))
        result["tolerance"] = tolerance
        result["matched"] = decimal_equivalent(wanted, received, tolerance)
    elif mode == "tokens":
        result["matched"] = wanted == received
    else:
        raise ValueError(f"Unsupported comparison mode {mode!r}")
    if not result["matched"]:
        result["numericEquivalentAt1e6"] = decimal_equivalent(wanted, received, "0.000001")
        mismatch = next((i for i, pair in enumerate(zip(wanted, received)) if pair[0] != pair[1]), min(len(wanted), len(received)))
        result["firstDifferentToken"] = mismatch + 1
    return result


def resolve_source(solution: dict, repo_root: Path, build_root: Path, stem: str, language: str) -> tuple[Path, str, dict]:
    path_text = solution.get("path")
    source = (repo_root / path_text).resolve() if path_text else None
    embedded = solution.get("code")
    metadata = {}
    if source is not None and source.is_file():
        content = source.read_text(encoding="utf-8")
        if embedded is not None and content.replace("\r\n", "\n").rstrip() != str(embedded).replace("\r\n", "\n").rstrip():
            metadata["embeddedSourceMismatch"] = True
        metadata["sourcePath"] = path_text
    elif embedded is not None:
        suffix = ".py" if language == "python" else ".cpp"
        source = build_root / (stem + suffix)
        content = str(embedded)
        source.write_text(content, encoding="utf-8")
        metadata["sourcePath"] = path_text
        metadata["sourceFromEmbeddedCode"] = True
    else:
        raise ValueError("Neither an existing source path nor embedded program code was provided")
    metadata["sha256"] = sha256(content.encode("utf-8"))
    return source, content, metadata


def verify_one(task: dict, language: str, repo_root: Path, build_root: Path, args) -> dict:
    task_id = str(task.get("id", task.get("number", "unknown")))
    result = {"id": task_id, "number": task.get("number"), "title": task.get("title"), "language": language, "samples": []}
    stem = re.sub(r"[^a-zA-Z0-9_-]", "_", task_id) + "-" + language
    try:
        solution = task.get("solutions", {}).get(language)
        if not solution:
            result["status"] = "missingSolution"
            return result
        source, _, metadata = resolve_source(solution, repo_root, build_root, stem, language)
        result.update(metadata)
        if language == "python":
            try:
                py_compile.compile(str(source), cfile=str(build_root / (stem + ".pyc")), doraise=True)
            except py_compile.PyCompileError as error:
                result.update(status="syntaxError", error=str(error))
                return result
            result["compile"] = {"returncode": 0, "syntaxChecked": True}
            execution = [args.python, str(source)]
        else:
            executable = build_root / (stem + (".exe" if sys.platform == "win32" else ".bin"))
            compiled = command_run([args.cpp, *args.cpp_flags, "-std=c++17", "-O2", "-pipe", str(source), "-o", str(executable)], args.compile_timeout)
            result["compile"] = compiled
            if compiled["returncode"] != 0:
                result["status"] = "compileTimeout" if compiled["timedOut"] else "compileError"
                return result
            execution = [str(executable)]
        examples = task.get("examples", [])
        if not examples:
            result["status"] = "noSamples"
            return result
        for index, example in enumerate(examples, 1):
            input_text, expected = str(example.get("input", "")), str(example.get("output", ""))
            executed = command_run(execution, args.runtime_timeout, input_text)
            sample = {"number": index, "input": input_text, "expected": expected, **executed}
            sample["comparison"] = compare_output(expected, executed["stdout"], task, example)
            if executed["timedOut"]:
                sample["status"] = "runtimeTimeout"
            elif executed["returncode"] != 0:
                sample["status"] = "runtimeError"
            elif not sample["comparison"]["matched"]:
                sample["status"] = "outputMismatch"
            else:
                sample["status"] = "passed"
            result["samples"].append(sample)
        result["status"] = "passed" if all(sample["status"] == "passed" for sample in result["samples"]) else "sampleFailure"
        if result.get("embeddedSourceMismatch"):
            result["status"] = "sourceMismatch"
        return result
    except Exception as error:
        result.update(status="verificationError", error=f"{type(error).__name__}: {error}")
        return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--catalog", type=Path, default=Path("content/book-programming.json"))
    parser.add_argument("--output", type=Path, default=Path("/tmp/eldi-program-verification.json"))
    parser.add_argument("--jobs", type=int, default=4)
    parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument("--python", default=sys.executable)
    parser.add_argument("--cpp", default="g++")
    parser.add_argument("--compile-timeout", type=float, default=45)
    parser.add_argument("--runtime-timeout", type=float, default=5)
    args = parser.parse_args()
    try:
        args.cpp_flags = json.loads(os.environ.get("ELDI_BOOK_CPP_FLAGS", "[]"))
        if not isinstance(args.cpp_flags, list) or not all(isinstance(flag, str) for flag in args.cpp_flags):
            raise ValueError("must be a JSON array of strings")
    except (ValueError, TypeError) as error:
        parser.error(f"ELDI_BOOK_CPP_FLAGS: {error}")
    if args.jobs < 1:
        parser.error("--jobs must be positive")
    catalog_path = args.catalog.resolve()
    raw = catalog_path.read_bytes()
    catalog = json.loads(raw)
    tasks = catalog if isinstance(catalog, list) else catalog["tasks"]
    report = {
        "generatedAt": datetime.now(timezone.utc).isoformat(), "catalog": str(catalog_path),
        "catalogSha256": sha256(raw), "taskCount": len(tasks), "comparison": "whitespace tokens unless explicitly configured",
        "limitations": "Published sample checks do not prove full correctness. Constructive alternative answers require a problem-specific checker.",
        "python": command_run([args.python, "--version"], 5), "cpp": command_run([args.cpp, "--version"], 5),
        "results": [],
    }
    started = time.monotonic()
    with tempfile.TemporaryDirectory(prefix="eldi-book-verify-") as temporary:
        build_root = Path(temporary)
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.jobs) as executor:
            futures = [executor.submit(verify_one, task, language, args.repo_root.resolve(), build_root, args) for task in tasks for language in ("python", "cpp")]
            for future in concurrent.futures.as_completed(futures):
                result = future.result()
                report["results"].append(result)
                if result["status"] != "passed":
                    print(f"{result['id']} {result['language']}: {result['status']}", flush=True)
                elif len(report["results"]) % 20 == 0:
                    print(f"Checked {len(report['results'])}/{len(futures)} programs", flush=True)
    report["results"].sort(key=lambda record: (record.get("number") or 0, record["id"], record["language"]))
    report["seconds"] = round(time.monotonic() - started, 3)
    counts = {}
    for language in ("python", "cpp"):
        records = [record for record in report["results"] if record["language"] == language]
        status_counts = {}
        for record in records:
            status_counts[record["status"]] = status_counts.get(record["status"], 0) + 1
        counts[language] = {
            "programs": len(records), "statuses": status_counts,
            "samples": sum(len(record["samples"]) for record in records),
            "passedSamples": sum(sample["status"] == "passed" for record in records for sample in record["samples"]),
        }
    report["counts"] = counts
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(args.output), "seconds": report["seconds"], "counts": counts}, ensure_ascii=False))
    return 0 if all(record["status"] == "passed" for record in report["results"]) else 1


if __name__ == "__main__":
    raise SystemExit(main())
