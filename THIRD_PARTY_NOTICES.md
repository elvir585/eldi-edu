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
