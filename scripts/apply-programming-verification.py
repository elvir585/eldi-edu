#!/usr/bin/env python3
"""Attach a verifier report to extracted content without upgrading its scope."""
import argparse, hashlib, json
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('report')
    parser.add_argument('--catalog', default='content/book-programming.json')
    args = parser.parse_args()
    source = REPO / args.catalog
    book = json.loads(source.read_text(encoding='utf-8'))
    report = json.loads(Path(args.report).read_text(encoding='utf-8'))
    if len(book['tasks']) != report['taskCount']:
        raise ValueError('Report task count does not match catalog')
    results = {(r['id'], r['language']): r for r in report['results']}
    summary = []
    for task in book['tasks']:
        for language, solution in task['solutions'].items():
            result = results[(task['id'], language)]
            digest = hashlib.sha256(solution['code'].encode()).hexdigest()
            if digest != result['sha256']:
                raise ValueError(f"Source hash changed: {task['id']} {language}")
            if result['status'] != 'passed':
                raise ValueError(f"Cannot mark a failed program verified: {task['id']} {language}")
            passed = sum(s['status'] == 'passed' for s in result['samples'])
            verification = {
                'syntaxChecked': True,
                'compiled': language == 'cpp',
                'examplesPassed': passed,
                'examplesTotal': len(result['samples']),
                'comparison': 'whitespace-tokens',
                'sourceSha256': digest,
                'checkedAt': report['generatedAt'],
                'environment': report['python']['stdout'].splitlines()[0] if language == 'python' else report['cpp']['stdout'].splitlines()[0],
                'scope': 'Objavljeni primjer iz knjige; nisu službeni skriveni testovi niti dokaz za sve ulaze.',
            }
            solution['status'] = 'sample-verified'
            solution['verification'] = verification
            summary.append({'id':task['id'], 'number':task['number'], 'language':language, 'path':solution['path'], 'status':'sample-verified', **verification})
    book['verification'] = {
        'status': 'samples-verified', 'checkedAt': report['generatedAt'],
        'pythonPrograms': report['counts']['python']['programs'],
        'cppPrograms': report['counts']['cpp']['programs'],
        'sampleExecutions': sum(c['samples'] for c in report['counts'].values()),
        'passedExecutions': sum(c['passedSamples'] for c in report['counts'].values()),
        'scope': '162 Python sintaksne provjere, 162 C++17 kompilacije i 324 izvršavanja objavljenih primjera. Ne predstavlja provjeru svih mogućih ulaza.',
        'reportFile': 'content/programming-verification.json',
    }
    source.write_text(json.dumps(book, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (REPO / 'content/programming-verification.json').write_text(json.dumps({'bookId': book['id'], **book['verification'], 'programs':summary}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(book['verification'],ensure_ascii=False))

if __name__ == '__main__': main()
