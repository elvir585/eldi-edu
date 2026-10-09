# Komponente trećih strana

- Blockly 13.3.0: Apache License 2.0. Priložena licenca: renderer/vendor/LICENSE. Izvor: https://github.com/google/blockly/tree/blockly-v13.3.0
- JS-Interpreter 6.0.2: Apache License 2.0, uključeni parser i zasebne obavijesti. Licence: renderer/vendor/INTERPRETER-LICENSE i INTERPRETER-NOTICES. Izvor: https://github.com/NeilFraser/JS-Interpreter
- Electron: MIT; Chromium i Node.js s vlastitim licencama, uključenim u distribuciju Electron. https://github.com/electron/electron
- Python embedded Windows: Python Software Foundation License; licenca se zadržava u ugrađenom paketu. Izvor i verzija: https://www.python.org/downloads/source/ i runtimes/manifest.json.
- GCC, G++, binutils i njihove biblioteke u MSYS2 UCRT64 distribuciji: GPL i pripadajuće runtime iznimke te licence pojedinačnih biblioteka. Potpuni MSYS2 prefiks sa licencama kopira se u paket. Odgovarajući izvori i recepti za pakete: https://github.com/msys2/MINGW-packages i https://packages.msys2.org/; verzije su navedene u runtimes/manifest.json.
- Eclipse Temurin OpenJDK: GPL v2 with Classpath Exception. Priloženi JDK legal/ i LICENSE ostaju u paketu. Izvori za odgovarajuće verzije: https://github.com/adoptium/temurin25-binaries/releases i https://github.com/openjdk/jdk25u.

Originalne knjige u sekciji „Zbirke i rješenja“ zadržavaju svoje autorstvo:

- „Zbirka zadataka iz matematike za osnovne škole“, Pedagoški zavod Tuzlanskog kantona, januar 2016. Urednici: Hariz Agić i Edis Ćatibušić; ostali autori navedeni su u izvornom PDF-u `content/books/matematika-pztk.pdf`.
- „Programiranje — Python 3 i C++17“, Elvir Čajić, Tuzla 2026. Izvorni PDF: `content/books/programiranje.pdf`.

Knjige su uključene iz dokumenata koje je dostavio korisnik, bez izmjena originalnih PDF datoteka. Digitalne obrade navode izvorne stranice i označavaju uredničke ispravke. Autorstvo aplikacije ne zamjenjuje autorstvo izvornih knjiga. Prije dalje distribucije zadržite pripadajuće licence, atribucije i obavijesti.

Razvojni testovi koriste @xmldom/xmldom 0.9.12 (MIT) za XML DOM u Blockly provjerama; ova razvojna zavisnost nije ugrađena u korisnički EXE.


## Official Codex app-server

OpenAI Codex0.161.0, Apache-2.0. Windows executable is obtained from the official pinned release and SHA256 verified. LICENSE and NOTICE are included alongside runtimes/codex/codex.exe. Source: https://github.com/openai/codex/tree/rust-v0.161.0 . No credentials are included in this distribution.

## Standalone Scratch editor component

The separate local iframe loads @scratch/scratch-gui15.2.0, a Scratch Foundation component under AGPL-3.0-only. Its runtime, paint, render and storage components retain their original licenses. Local file path relocation and the iframe adapter are documented in scratch-editor/SOURCE.json and docs/SCRATCH.md. Adapter source is AGPL-3.0-only. LICENSE/TRADEMARK and source metadata are included with the component. The release provides a matching Scratch-izvori.zip containing the pinned upstream source archive, adapter, exact dependency lock and build procedure.

Corresponding upstream commit: https://github.com/scratchfoundation/scratch-editor/tree/5fe823510f3ae0cc7291d49bc824cc5c54fe7723 . The original ELDI .sb3 examples retain ELDI application authorship; Scratch library media attribution is retained in the official distribution/source archive. This application is independently developed and does not imply endorsement by Scratch Foundation or OpenAI.

## Offline code editor

The optional enhanced editor uses CodeMirror 6 and its MIT-licensed dependencies.
Full dependency copyright notices and licenses are included in
`renderer/vendor/ELDI-EDITOR-NOTICES.txt`. The bundled source is generated from
`renderer/editor/source.js` with `npm run editor:bundle`. Python, C/C++ and Java
syntax packages are bundled locally; editing makes no network requests.
