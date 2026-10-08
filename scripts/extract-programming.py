#!/usr/bin/env python3
"""Extract the supplied Elvir Čajić book, preserving code fonts/continuations.

This is an optional source-import tool, not part of the normal application build.
Requires PyMuPDF; the checked-in catalog and solution files are the app inputs.
"""
import argparse, hashlib, json, re, unicodedata
from pathlib import Path
import fitz

REPO = Path(__file__).resolve().parents[1]
LANGUAGE = re.compile(r'^(PYTHON 3|C\+\+17)\s*[·/]')

def slug(text):
    text = text.replace('đ', 'dj').replace('Đ', 'dj')
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')

def repair_glyphs(text, page, notes):
    if '\x00' not in text:
        return text
    original = text
    if text.startswith('Ograničenja.') or page in (78, 79, 80, 130, 134):
        symbol = '≤'
    elif page in (74, 86, 136, 173, 457):
        symbol = '≥'
    elif page in (13, 27, 33, 43, 62, 111, 117, 123, 293, 455):
        symbol = '−'
    elif page == 253:
        symbol = '≡'
    elif page in (8,):
        symbol = '≤'
    elif page in (15,):
        symbol = '≥'
    elif page in (22, 55, 58):
        symbol = '→'
    elif page == 36:
        text = text.replace('prvi element \x00x', 'prvi element ≥x').replace('posljednji \x00x', 'posljednji ≤x')
        symbol = '[nedostaje znak u PDF-u]'
    elif page == 400:
        symbol = '≥' if 'ako x' in text else '≤'
    else:
        symbol = '[nedostaje znak u PDF-u]'
    notes.append({'page': page, 'original': original.replace('\x00', '[missing glyph]'), 'restored': text.replace('\x00', symbol), 'reason': 'Nedostajući PDF znak rekonstruisan iz jasnog konteksta i pratećeg koda.' if symbol[0] != '[' or '\x00' not in text else 'PDF ne sadrži čitljiv znak; nije nagađan.'})
    return text.replace('\x00', symbol)

def get_lines(doc):
    lines = []
    notes = []
    for page_no, page in enumerate(doc, 1):
        page_lines = []
        for block_no, block in enumerate(page.get_text('dict')['blocks']):
            if block['type'] != 0:
                continue
            for line_no, line in enumerate(block['lines']):
                spans = line['spans']
                if not spans:
                    continue
                y = spans[0]['bbox'][1]
                if y < 40 or y > 790:
                    continue
                text = ''.join(span['text'] for span in spans)
                text = repair_glyphs(text, page_no, notes)
                page_lines.append({'text': text, 'page': page_no, 'y': round(y, 2), 'x': spans[0]['bbox'][0], 'font': spans[0]['font'], 'size': spans[0]['size'], 'mono': all('Mono' in span['font'] for span in spans), 'block': block_no, 'line': line_no})
        lines.extend(sorted(page_lines, key=lambda x: (x['y'], x['x'])))
    return lines, notes

def prose(rows):
    out = []
    previous = None
    for row in rows:
        t = row['text'].strip()
        if not t:
            continue
        if previous is not None and (row['page'] != previous['page'] or row['y'] - previous['y'] > 20):
            out.append('\n\n')
        elif out:
            out.append(' ')
        out.append(t)
        previous = row
    return ''.join(out).strip()

def heading(row):
    return row['size'] >= 18 and 'Lato-Bold' in row['font']

def extract_task(rows, chapter, notes):
    first = rows[0]
    number = int(re.search(r'ZADATAK (\d+)', first['text']).group(1))
    title_rows = []
    pos = 1
    while pos < len(rows) and heading(rows[pos]):
        title_rows.append(rows[pos])
        pos += 1
    title = ' '.join(r['text'] for r in title_rows)
    if not title:
        raise ValueError(f'No title for task {number}')
    fields = {k: [] for k in ('goal', 'statement', 'input', 'output', 'limits', 'help', 'complexity', 'checks', 'subtasks')}
    source = []
    steps = []
    mode = 'statement'
    last_step_row = None
    active_lang = None
    codes = {'python': [], 'cpp': []}
    code_pages = {'python': [], 'cpp': []}
    sample = {'input': [], 'output': [], 'explanation': []}
    for row in rows[pos:]:
        t = row['text']
        if row['size'] >= 18 and re.match(r'^\d+\.', t):
            # A following chapter introduction/table belongs to the chapter, not this task.
            break
        lang = LANGUAGE.match(t)
        if lang:
            active_lang = 'python' if lang.group(1) == 'PYTHON 3' else 'cpp'
            if row['page'] not in code_pages[active_lang]:
                code_pages[active_lang].append(row['page'])
            mode = 'code'
            continue
        if row['mono']:
            if mode == 'code' and active_lang:
                # Leading spaces belong to the program, unlike the page's left margin.
                codes[active_lang].append(t)
            elif mode in ('sample-input', 'sample-output'):
                sample['input' if mode == 'sample-input' else 'output'].append(t)
            continue
        active_lang = None
        if t.startswith('Cilj:'):
            mode = 'goal'; fields[mode].append({**row, 'text': t[5:].strip()}); continue
        if mode == 'goal' and row['size'] > 10:
            mode = 'statement'
        if 'PDF str.' in t and ('[A' in t or 'takmičenja' in t):
            source.append(t); continue
        markers = {'Ulaz.': 'input', 'Izlaz.': 'output', 'Ograničenja.': 'limits', 'Složenost.': 'complexity'}
        matched = False
        for prefix, key in markers.items():
            if t.startswith(prefix):
                mode = key; fields[key].append({**row, 'text': t[len(prefix):].strip()}); matched = True; break
        if matched:
            continue
        if mode == 'output' and row['font'] == 'Lato-Regular' and 9.4 < row['size'] < 9.6:
            mode = 'limits'
        if t == 'Primjer':
            mode = 'sample-title'; continue
        if t == 'ULAZ':
            mode = 'sample-input'; continue
        if t == 'IZLAZ':
            mode = 'sample-output'; continue
        if t == 'Razumijevanje i postupak':
            mode = 'help'; continue
        if t == 'Važne provjere':
            mode = 'checks'; continue
        if t == 'Podzadaci za trening':
            mode = 'subtasks'; continue
        if mode in ('sample-input', 'sample-output'):
            sample['explanation'].append(row); continue
        if mode == 'help' and re.match(r'^\d+\.\s', t):
            steps.append(re.sub(r'^\d+\.\s*', '', t)); last_step_row = row; continue
        if mode == 'help' and last_step_row and row['page'] == last_step_row['page'] and row['y'] - last_step_row['y'] < 20:
            steps[-1] += ' ' + t; last_step_row = row; continue
        last_step_row = None
        if mode == 'help' and steps and fields['help'] and t.startswith('Zašto postupak'):
            fields['help'].append(row); continue
        if mode == 'code':
            # Prose after code can only be a checked subsection. Headers are filtered already.
            continue
        if mode in fields:
            fields[mode].append(row)
    directory = f'content/solutions/programming/{number:03d}-{slug(title)}'
    samples = [{'input': '\n'.join(sample['input']) + '\n', 'output': '\n'.join(sample['output']) + '\n', 'explanation': prose(sample['explanation'])}]
    if not sample['input'] or not sample['output']:
        raise ValueError(f'Missing example for task {number}: {title}')
    task = {
        'id': f'program-{number:03d}', 'number': number, 'title': title,
        'chapter': chapter['number'], 'topic': chapter['title'],
        'sourcePage': first['page'], 'pages': sorted({r['page'] for r in rows if r['page'] < 462}),
        'sourceAttribution': ' '.join(source) if source else 'Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.',
        'archive': '/ UPINITK ARHIVA' in first['text'],
        **{k: prose(v) for k, v in fields.items()},
        'steps': steps, 'examples': samples,
        'solutions': {key: {'language': 'Python 3' if key == 'python' else 'C++17', 'code': '\n'.join(codes[key]).rstrip() + '\n', 'path': directory + ('/solution.py' if key == 'python' else '/solution.cpp'), 'sourcePages': code_pages[key], 'status': 'pending-verification', 'verification': {}} for key in ('python', 'cpp')},
        'notes': [n for n in notes if n['page'] in {r['page'] for r in rows}],
    }
    for key in ('python', 'cpp'):
        if not codes[key]:
            raise ValueError(f'Missing {key} for task {number}')
    return task

def extract_theory(rows, chapter):
    sections = []
    start = 0
    for i, row in enumerate(rows):
        if re.match(r'^\d+\.\d+\. ', row['text']) and row['size'] >= 12:
            if i > start:
                sections.append(rows[start:i])
            start = i
    if start < len(rows):
        sections.append(rows[start:])
    result = []
    for i, section in enumerate(sections):
        code = []; body = []; active = None
        for row in section:
            match = LANGUAGE.match(row['text'])
            if match:
                active = {'language': 'Python 3' if match.group(1) == 'PYTHON 3' else 'C++17', 'kind': 'complete' if 'potpuni program' in row['text'] else 'guided-example' if 'vođeni primjer' in row['text'] else 'snippet', 'label': row['text'], 'code': [], 'page': row['page']}
                code.append(active); continue
            if row['mono'] and active is not None:
                active['code'].append(row['text']); continue
            active = None
            body.append(row)
        for item in code:
            item['code'] = '\n'.join(item['code']) + '\n'
            item['runnable'] = item['kind'] == 'complete'
        first = section[0]
        result.append({'id': f"theory-{chapter['number']:02d}-{i:02d}", 'chapter': chapter['number'], 'title': first['text'] if re.match(r'^\d+\.\d+\.', first['text']) else chapter['title'], 'sourcePage': first['page'], 'pages': sorted({r['page'] for r in section}), 'body': prose(body), 'codeExamples': code, 'note': 'Isječci i vođeni primjeri mogu pretpostavljati ranije varijable; nisu zadaci s potpunim programom.'})
    return result

def write_tasks(book):
    for task in book['tasks']:
        for item in task['solutions'].values():
            p = REPO / item['path']; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(item['code'], encoding='utf-8')
        directory = (REPO / task['solutions']['python']['path']).parent
        for i, sample in enumerate(task['examples'], 1):
            (directory / f'example-{i}.in').write_text(sample['input'], encoding='utf-8')
            (directory / f'example-{i}.out').write_text(sample['output'], encoding='utf-8')
        text = f"# {task['number']:03d}. {task['title']}\n\nIzvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. {task['sourcePage']}.\n\n{task['sourceAttribution']}\n\n"
        for label, key in [('Cilj', 'goal'), ('Zadatak', 'statement'), ('Ulaz', 'input'), ('Izlaz', 'output'), ('Ograničenja', 'limits'), ('Razumijevanje i postupak', 'help')]:
            if task[key]: text += f'## {label}\n\n{task[key]}\n\n'
        if task['steps']:
            text += '## Koraci\n\n' + '\n'.join(f'{i}. {s}' for i, s in enumerate(task['steps'], 1)) + '\n\n'
        if task['complexity']: text += '## Složenost\n\n' + task['complexity'] + '\n\n'
        if task['checks']: text += '## Važne provjere\n\n' + task['checks'] + '\n\n'
        for i, sample in enumerate(task['examples'], 1):
            text += f"## Primjer {i}\n\nUlaz:\n\n```text\n{sample['input']}```\n\nIzlaz:\n\n```text\n{sample['output']}```\n\n{sample['explanation']}\n\n"
        text += '## Pokretanje\n\n```sh\npython solution.py < example-1.in\ng++ -std=c++17 -O2 solution.cpp -o solution\n./solution < example-1.in\n```\n\nProvjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.\n'
        (directory / 'README.md').write_text(text, encoding='utf-8')

def main():
    parser = argparse.ArgumentParser(); parser.add_argument('pdf'); parser.add_argument('--output', default=str(REPO / 'content/book-programming.json')); args = parser.parse_args()
    source = Path(args.pdf); doc = fitz.open(source)
    lines, notes = get_lines(doc)
    starts = []
    for i, row in enumerate(lines):
        if heading(row) and re.match(r'^\d+\. ', row['text']) and row['page'] >= 7:
            match = re.match(r'^(\d+)\. (.*)', row['text'])
            number = int(match.group(1)); title = [match.group(2)]; j = i+1
            while j < len(lines) and heading(lines[j]) and not re.match(r'^\d+\. ', lines[j]['text']):
                title.append(lines[j]['text']); j += 1
            starts.append({'number': number, 'title': ' '.join(title), 'pageFrom': row['page'], 'lineStart': i, 'lineBody': j})
    for i, ch in enumerate(starts):
        ch['pageTo'] = starts[i+1]['pageFrom']-1 if i+1 < len(starts) else len(doc)
        ch['kind'] = 'theory' if ch['number'] <= 13 else 'tasks' if ch['number'] <= 23 else 'guide'
    tasks = []; theory = []
    for i, chapter in enumerate(starts):
        section = [r for r in lines[chapter['lineBody']: starts[i+1]['lineStart'] if i+1 < len(starts) else len(lines)] if r['page'] <= chapter['pageTo']]
        if chapter['kind'] == 'theory':
            theory.extend(extract_theory(section, chapter)); continue
        if chapter['kind'] != 'tasks': continue
        indices = [j for j, row in enumerate(section) if re.match(r'^ZADATAK \d+', row['text'])]
        for k, at in enumerate(indices):
            segment = section[at: indices[k+1] if k+1 < len(indices) else len(section)]
            tasks.append(extract_task(segment, chapter, notes))
    if [t['number'] for t in tasks] != list(range(1, 163)):
        raise ValueError(f'Unexpected task numbering: {[t["number"] for t in tasks]}')
    book = {'id': 'programiranje-elvir-cajic', 'title': 'Programiranje — Python 3 i C++17', 'subtitle': 'Teorija i zbirka zadataka za osnovne škole', 'author': 'Elvir Čajić', 'year': 2026, 'subject': 'informatics', 'sourceFile': 'content/books/programiranje.pdf', 'uploadedFileName': source.name, 'sourcePages': len(doc), 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'description': '162 numerisana zadatka, puna rješenja u Pythonu 3 i C++17, teorijska pomoć i arhivski izazovi uz navedeno porijeklo.', 'chapters': [{k:v for k,v in ch.items() if not k.startswith('line')} for ch in starts], 'tasks': tasks, 'theory': theory, 'extractionNotes': notes, 'verification': {'status': 'pending', 'scope': 'Sintaksa/kompilacija i objavljeni primjeri; nisu službeni skriveni testovi.'}}
    write_tasks(book)
    Path(args.output).write_text(json.dumps(book, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'tasks':len(tasks), 'theorySections':len(theory), 'codeFiles':len(tasks)*2, 'chapters':len(starts), 'sourcePages':len(doc), 'output':args.output}, ensure_ascii=False))
if __name__ == '__main__': main()
