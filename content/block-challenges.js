'use strict';
// Izazovi koriste stvarni Blockly format i izvršive blokove, bez pseudokoda.
window.ELDI_BLOCK_CHALLENGES = (() => {
  const wrap = block => ({ block });
  const block = (type, fields = {}, inputs = {}, extraState) => {
    const result = { type };
    if (Object.keys(fields).length) result.fields = fields;
    if (Object.keys(inputs).length) result.inputs = Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, wrap(value)]));
    if (extraState) result.extraState = extraState;
    return result;
  };
  const num = NUM => block('math_number', { NUM });
  const text = TEXT => block('text', { TEXT });
  const truth = value => block('logic_boolean', { BOOL: value ? 'TRUE' : 'FALSE' });
  const variable = name => block('variables_get', { VAR: { id: 'var-' + name } });
  const set = (name, VALUE) => block('variables_set', { VAR: { id: 'var-' + name } }, { VALUE });
  const change = (name, DELTA) => block('math_change', { VAR: { id: 'var-' + name } }, { DELTA });
  const arithmetic = (OP, A, B) => block('math_arithmetic', { OP }, { A, B });
  const add = (a, b) => arithmetic('ADD', a, b);
  const subtract = (a, b) => arithmetic('MINUS', a, b);
  const multiply = (a, b) => arithmetic('MULTIPLY', a, b);
  const divide = (a, b) => arithmetic('DIVIDE', a, b);
  const power = (a, b) => arithmetic('POWER', a, b);
  const modulo = (DIVIDEND, DIVISOR) => block('math_modulo', {}, { DIVIDEND, DIVISOR });
  const round = (OP, NUM) => block('math_round', { OP }, { NUM });
  const compare = (OP, A, B) => block('logic_compare', { OP }, { A, B });
  const and = (A, B) => block('logic_operation', { OP: 'AND' }, { A, B });
  const or = (A, B) => block('logic_operation', { OP: 'OR' }, { A, B });
  const not = BOOL => block('logic_negate', {}, { BOOL });
  const join = (...parts) => block('text_join', {}, Object.fromEntries(parts.map((part, i) => ['ADD' + i, part])), { itemCount: parts.length });
  const list = (...parts) => block('lists_create_with', {}, Object.fromEntries(parts.map((part, i) => ['ADD' + i, part])), { itemCount: parts.length });
  const numericList = values => list(...values.map(num));
  const length = VALUE => block('text_length', {}, { VALUE });
  const listLength = VALUE => block('lists_length', {}, { VALUE });
  const charAt = (VALUE, AT) => block('text_charAt', { WHERE: 'FROM_START' }, { VALUE, AT });
  const indexOf = (VALUE, FIND) => block('text_indexOf', { END: 'FIRST' }, { VALUE, FIND });
  const listAt = (VALUE, AT) => block('lists_getIndex', { MODE: 'GET', WHERE: 'FROM_START' }, { VALUE, AT });
  const listSet = (LIST, AT, TO) => block('lists_setIndex', { MODE: 'SET', WHERE: 'FROM_START' }, { LIST, AT, TO });
  const print = TEXT => block('edu_print', {}, { TEXT });
  const say = TEXT => block('edu_say', {}, { TEXT });
  const input = PROMPT => block('edu_input', {}, { PROMPT: text(PROMPT) });
  const numberInput = PROMPT => block('edu_number_input', {}, { PROMPT: text(PROMPT) });
  const move = N => block('edu_move', {}, { N });
  const turn = N => block('edu_turn', {}, { N });
  const pen = value => block('edu_pen', { STATE: value ? '1' : '0' });
  const chain = (...steps) => {
    const copy = steps.flat().filter(Boolean).map(step => JSON.parse(JSON.stringify(step)));
    for (let i = 0; i + 1 < copy.length; i++) copy[i].next = wrap(copy[i + 1]);
    return copy[0];
  };
  const repeat = (TIMES, ...body) => block('controls_repeat_ext', {}, { TIMES, DO: chain(...body) });
  const loop = (name, FROM, TO, BY, ...body) => block('controls_for', { VAR: { id: 'var-' + name } }, { FROM, TO, BY, DO: chain(...body) });
  const each = (name, LIST, ...body) => block('controls_forEach', { VAR: { id: 'var-' + name } }, { LIST, DO: chain(...body) });
  const whileDo = (BOOL, ...body) => block('controls_whileUntil', { MODE: 'WHILE' }, { BOOL, DO: chain(...body) });
  const branch = (condition, yes, no) => block('controls_if', {}, { IF0: condition, DO0: yes, ...(no ? { ELSE: no } : {}) }, no ? { hasElse: true } : undefined);
  const project = roots => {
    const blocks = Array.isArray(roots) ? roots : [roots];
    const names = new Set();
    const visit = value => {
      if (!value || typeof value !== 'object') return;
      if (value.fields?.VAR?.id) names.add(value.fields.VAR.id);
      Object.values(value).forEach(visit);
    };
    visit(blocks);
    const workspace = { blocks: { languageVersion: 0, blocks: blocks.map((value, i) => ({ ...value, x: 30 + i * 330, y: 30 })) } };
    if (names.size) workspace.variables = [...names].map(id => ({ name: id.slice(4), id }));
    return { format: 'ELDI-BLOCKS-1', workspace };
  };
  const partial = solution => {
    const copy = JSON.parse(JSON.stringify(solution));
    for (const root of copy.workspace.blocks.blocks) {
      delete root.next;
      if (['controls_repeat_ext', 'controls_for', 'controls_forEach', 'controls_whileUntil'].includes(root.type)) delete root.inputs.DO;
      if (root.type === 'edu_received') delete root.inputs.DO;
      if (root.type === 'edu_print' || root.type === 'edu_say') root.inputs.TEXT = wrap(text(''));
    }
    return copy;
  };
  const output = expected => ({ type: 'output', expected, trim: true });
  const stage = (x, y, heading, trailCount, shape = {}) => ({ type: 'stage', x, y, heading, trailCount, tolerance: 0.001, ...shape });
  const challenges = [];
  const addChallenge = (grade, suffix, title, category, description, hints, roots, check, inputText, starterRoots) => {
    const solution = project(roots);
    const challenge = { id: `blocks-${grade}-${suffix}`, grade, title, category, description, hints, starter: starterRoots ? project(starterRoots) : partial(solution), solution, check };
    if (inputText !== undefined) challenge.input = inputText;
    if (typeof inputText === 'string' && inputText.length) {
      const lines=inputText.replace(/\r\n/g,'\n').split('\n');
      if(lines.at(-1)==='')lines.pop();
      check.inputCount=lines.length;
    }
    challenges.push(challenge);
  };
  const gcdLoop = () => whileDo(compare('NEQ', variable('b'), num(0)), set('ostatak', modulo(variable('a'), variable('b'))), set('a', variable('b')), set('b', variable('ostatak')));

  // 5. razred: niz naredbi, ulaz, izrazi, osnovne petlje i pozornica.
  addChallenge(5, 'pozdrav', 'Lični pozdrav', 'Ulaz i tekst',
    'Učitaj ime iz jednog reda i ispiši pozdrav u obliku „Zdravo, IME!“. Ime nemoj unaprijed upisati u blok.',
    ['Sačuvaj ulaz u varijablu ime.', 'Spoji tri dijela: Zdravo, zatim ime, zatim uzvičnik.'],
    chain(set('ime', input('Kako se zoveš?')), print(join(text('Zdravo, '), variable('ime'), text('!')))), output('Zdravo, Amina!'), 'Amina');
  addChallenge(5, 'zbir', 'Zbir dva unesena broja', 'Računanje',
    'Učitaj dva prirodna broja, svaki iz zasebnog reda. Izračunaj i ispiši njihov zbir.',
    ['Upotrijebi dva bloka za unos broja.', 'Blok za sabiranje možeš priključiti direktno na ispis.'],
    chain(set('a', numberInput('Prvi broj')), set('b', numberInput('Drugi broj')), print(add(variable('a'), variable('b')))), output('500'), '125\n375');
  addChallenge(5, 'kupovina', 'Račun u knjižari', 'Računanje',
    'Tri sveske koštaju po 7 KM, a dvije olovke po 4 KM. Koristi množenje i sabiranje da program ispiše ukupnu cijenu.',
    ['Odvojeno izračunaj cijenu sveski i olovaka.', 'Sastavi izraz 3 × 7 + 2 × 4.'],
    print(add(multiply(num(3), num(7)), multiply(num(2), num(4)))), output('29'));
  addChallenge(5, 'kvadrat', 'Kvadrat jednom petljom', 'Crtanje',
    'Nacrtaj kvadrat stranice 80 koraka. Upotrijebi jednu petlju sa četiri ponavljanja. Lik treba završiti u početnoj tački.',
    ['U tijelu petlje idi 80 koraka pa se okreni desno za 90°.', 'Olovka je na početku spuštena.'],
    repeat(num(4), move(num(80)), turn(num(90))), stage(0, 0, 360, 4, {width:80,height:80,closed:true,segmentLengths:[80,80,80,80],segmentAngles:[0,-90,180,90]}));
  addChallenge(5, 'pravougaonik', 'Pravougaonik 120 × 60', 'Crtanje',
    'Nacrtaj pravougaonik čije su susjedne stranice 120 i 60 koraka. U petlji ponovi par susjednih stranica dva puta.',
    ['Poslije svake stranice okreni se za 90°.', 'Jedno ponavljanje treba sadržati dvije naredbe za kretanje.'],
    repeat(num(2), move(num(120)), turn(num(90)), move(num(60)), turn(num(90))), stage(0, 0, 360, 4, {width:120,height:60,closed:true,segmentLengths:[120,60,120,60],segmentAngles:[0,-90,180,90]}));
  addChallenge(5, 'trougao', 'Jednakostranični trougao', 'Crtanje',
    'Nacrtaj jednakostranični trougao stranice 80 koraka. Program treba imati tri kretanja i vratiti lik u početnu tačku.',
    ['Spoljašnji ugao za okretanje je 120°, a unutrašnji ugao trougla je 60°.', 'Ponovi kretanje i okretanje tri puta.'],
    repeat(num(3), move(num(80)), turn(num(120))), stage(0, 0, 360, 3, {width:80,height:40*Math.sqrt(3),closed:true,segmentLengths:[80,80,80],segmentAngles:[0,-120,120]}));
  addChallenge(5, 'odbrojavanje', 'Odbrojavanje do polaska', 'Varijable i petlje',
    'Ispiši brojeve od 5 do 1, svaki u novom redu, pa riječ „Kreni!“. Koristi varijablu i petlju umjesto pet zasebnih brojeva.',
    ['Na početku postavi brojač na 5.', 'Poslije ispisa smanji brojač za 1.'],
    chain(set('brojac', num(5)), repeat(num(5), print(variable('brojac')), change('brojac', num(-1))), print(text('Kreni!'))), output('5\n4\n3\n2\n1\nKreni!'));
  addChallenge(5, 'olovka', 'Premještanje bez traga', 'Olovka i kretanje',
    'Pomjeri lik 80 koraka desno bez crtanja. Zatim spusti olovku, okreni se desno za 90° i nacrtaj samo duž dužine 40.',
    ['Prije prvog pomjeranja podigni olovku.', 'Konačna koordinata y je −40 jer se lik kreće prema dolje.'],
    chain(pen(false), move(num(80)), pen(true), turn(num(90)), move(num(40))), stage(80, -40, 90, 1, {width:0,height:40,segmentLengths:[40],segmentAngles:[-90]}));
  addChallenge(5, 'poruka', 'Program koji reaguje na poruku', 'Događaji',
    'Pošalji poruku „pozdrav“. U odvojenom bloku za primanje te poruke ispiši „Spreman za učenje!“.',
    ['Naziv poruke u oba bloka mora biti potpuno isti.', 'Ispis priključi unutar bloka „kada primim“.'],
    [block('edu_message', {}, { TEXT: text('pozdrav') }), block('edu_received', { MESSAGE: 'pozdrav' }, { DO: say(text('Spreman za učenje!')) })], output('Spreman za učenje!'));
  addChallenge(5, 'duzina-rijeci', 'Koliko slova ima riječ?', 'Obrada teksta',
    'Učitaj jednu riječ i ispiši broj njenih znakova. Program mora računati dužinu unesene riječi.',
    ['Unos sačuvaj kao tekst, a ne kao broj.', 'Upotrijebi blok za dužinu teksta.'],
    chain(set('rijec', input('Unesi riječ')), print(length(variable('rijec')))), output('11'), 'informatika');
  addChallenge(5, 'stepenice', 'Četiri stepenice', 'Crtanje i ponavljanje',
    'Nacrtaj četiri stepenice prema desno i gore. Svaka stepenica ima vodoravni dio 30 i uspravni dio 20 koraka. Lik na kraju ponovo treba gledati desno.',
    ['Za kretanje prema gore okreni se desno za −90°.', 'Na kraju svakog ponavljanja vrati smjer okretanjem za 90°.'],
    repeat(num(4), move(num(30)), turn(num(-90)), move(num(20)), turn(num(90))), stage(120, 80, 0, 8, {width:120,height:80,segmentLengths:[30,20,30,20,30,20,30,20],segmentAngles:[0,90,0,90,0,90,0,90]}));
  addChallenge(5, 'obim', 'Obim unesenog kvadrata', 'Ulaz i geometrija',
    'Učitaj dužinu stranice kvadrata i ispiši njegov obim. Koristi formulu O = 4a.',
    ['Stranicu učitaj kao broj.', 'Nemoj unaprijed upisati obim u ispis.'],
    chain(set('stranica', numberInput('Stranica kvadrata')), print(multiply(num(4), variable('stranica')))), output('148'), '37');

  // 6. razred: grananje, djeljivost, akumulacija i liste.
  addChallenge(6, 'parnost', 'Paran ili neparan?', 'Djeljivost i grananje',
    'Učitaj cijeli broj. Ispiši „paran“ kada je djeljiv sa 2, a „neparan“ u drugom slučaju.',
    ['Provjeri ostatak dijeljenja broja sa 2.', 'Koristi grananje sa dijelovima ako i inače.'],
    chain(set('n', numberInput('Cijeli broj')), branch(compare('EQ', modulo(variable('n'), num(2)), num(0)), print(text('paran')), print(text('neparan')))), output('paran'), '36');
  addChallenge(6, 'djeljivost15', 'Djeljivost sa 15', 'Složeni uslovi',
    'Učitaj prirodan broj. Ispiši „djeljiv sa 15“ ako je djeljiv i sa 3 i sa 5, inače „nije djeljiv sa 15“.',
    ['Sastavi dvije provjere ostatka dijeljenja.', 'Poveži ih logičkim blokom I.'],
    chain(set('n', numberInput('Prirodan broj')), branch(and(compare('EQ', modulo(variable('n'), num(3)), num(0)), compare('EQ', modulo(variable('n'), num(5)), num(0))), print(text('djeljiv sa 15')), print(text('nije djeljiv sa 15')))), output('djeljiv sa 15'), '45');
  addChallenge(6, 'suma20', 'Zbir brojeva od 1 do 20', 'Akumulacija',
    'Petljom saberi sve prirodne brojeve od 1 do 20 i ispiši zbir. Ispis treba biti poslije petlje.',
    ['Varijablu zbir postavi na 0 prije petlje.', 'U svakom prolazu uvećaj zbir za trenutni broj.'],
    chain(set('zbir', num(0)), loop('i', num(1), num(20), num(1), change('zbir', variable('i'))), print(variable('zbir'))), output('210'));
  addChallenge(6, 'proizvod5', 'Proizvod prvih pet prirodnih brojeva', 'Akumulacija',
    'Izračunaj proizvod 1 · 2 · 3 · 4 · 5 koristeći petlju i varijablu, zatim ispiši rezultat.',
    ['Početna vrijednost proizvoda treba biti 1.', 'U tijelu petlje postavi proizvod na proizvod × i.'],
    chain(set('proizvod', num(1)), loop('i', num(1), num(5), num(1), set('proizvod', multiply(variable('proizvod'), variable('i')))), print(variable('proizvod'))), output('120'));
  addChallenge(6, 'tablica6', 'Tablica množenja brojem 6', 'Petlje i tekst',
    'Ispiši deset redova tablice množenja brojem 6, od „6 × 1 = 6“ do „6 × 10 = 60“.',
    ['Brojač prolazi od 1 do 10.', 'Tekstualni red spoji iz fiksnog teksta, brojača i proizvoda.'],
    loop('i', num(1), num(10), num(1), print(join(text('6 × '), variable('i'), text(' = '), multiply(num(6), variable('i'))))), output(Array.from({ length: 10 }, (_, i) => `6 × ${i + 1} = ${6 * (i + 1)}`).join('\n')));
  addChallenge(6, 'veci-broj', 'Veći od dva broja', 'Poređenje',
    'Učitaj dva cijela broja iz dva reda i ispiši veći. Ako su jednaki, ispiši tu zajedničku vrijednost.',
    ['Koristi uslov a > b.', 'Za jednaka a i b dovoljno je ispisati bilo koji od njih.'],
    chain(set('a', numberInput('Prvi broj')), set('b', numberInput('Drugi broj')), branch(compare('GT', variable('a'), variable('b')), print(variable('a')), print(variable('b')))), output('12'), '-8\n12');
  addChallenge(6, 'prosjek3', 'Prosjek tri ocjene', 'Brojevni izrazi',
    'Učitaj tri ocjene iz tri reda, izračunaj njihov aritmetički prosjek i ispiši ga.',
    ['Prvo saberi sve tri ocjene.', 'Zbir podijeli sa 3.'],
    chain(set('a', numberInput('Prva ocjena')), set('b', numberInput('Druga ocjena')), set('c', numberInput('Treća ocjena')), print(divide(add(add(variable('a'), variable('b')), variable('c')), num(3)))), output('4'), '4\n5\n3');
  addChallenge(6, 'visekratnici4', 'Višekratnici broja 4', 'Korak petlje',
    'Ispiši pozitivne višekratnike broja 4 koji nisu veći od 40, svaki u novom redu.',
    ['Početak petlje postavi na 4, kraj na 40.', 'Korak petlje je 4.'],
    loop('i', num(4), num(40), num(4), print(variable('i'))), output('4\n8\n12\n16\n20\n24\n28\n32\n36\n40'), undefined,
    loop('i', num(4), num(40), num(1), print(variable('i'))));
  addChallenge(6, 'sestougao', 'Pravilni šestougao', 'Poligoni',
    'Nacrtaj pravilni šestougao stranice 50 koraka. Izračunaj ugao okretanja dijeljenjem 360 sa brojem stranica.',
    ['Upotrijebi šest ponavljanja.', 'Spoljašnji ugao je 360° / 6.'],
    repeat(num(6), move(num(50)), turn(divide(num(360), num(6)))), stage(0, 0, 360, 6, {width:100,height:50*Math.sqrt(3),closed:true,segmentLengths:[50,50,50,50,50,50],segmentAngles:[0,-60,-120,180,120,60]}));
  addChallenge(6, 'zbir-liste', 'Zbir elemenata liste', 'Liste',
    'Napravi listu [3, 7, 4, 6]. Prođi kroz svaki njen element, saberi ih i ispiši zbir.',
    ['Koristi petlju „za svaki element u listi“.', 'Zbir inicijalizuj na 0.'],
    chain(set('brojevi', numericList([3, 7, 4, 6])), set('zbir', num(0)), each('broj', variable('brojevi'), change('zbir', variable('broj'))), print(variable('zbir'))), output('20'));
  addChallenge(6, 'predznak', 'Predznak cijelog broja', 'Višestruko grananje',
    'Učitaj cijeli broj i ispiši jednu od riječi: „pozitivan“, „nula“ ili „negativan“.',
    ['Prvo provjeri da li je broj veći od 0.', 'U grani inače provjeri da li je jednak 0.'],
    chain(set('n', numberInput('Cijeli broj')), branch(compare('GT', variable('n'), num(0)), print(text('pozitivan')), branch(compare('EQ', variable('n'), num(0)), print(text('nula')), print(text('negativan'))))), output('negativan'), '-7');
  addChallenge(6, 'nenulti', 'Koliko brojeva nije nula?', 'Liste i uslovi',
    'U listi [0, 7, 0, −2, 5, 0, 1] prebroj sve elemente različite od nule i ispiši njihov broj.',
    ['Brojač povećaj samo kada trenutni element nije 0.', 'Negativan broj se također računa kao nenulti element.'],
    chain(set('brojevi', numericList([0, 7, 0, -2, 5, 0, 1])), set('brojac', num(0)), each('n', variable('brojevi'), branch(compare('NEQ', variable('n'), num(0)), change('brojac', num(1)))), print(variable('brojac'))), output('4'));

  // 7. razred: uslovne petlje, algoritmi i sistemi brojeva.
  addChallenge(7, 'nzd', 'NZD Euklidovim algoritmom', 'Brojevni algoritmi',
    'Učitaj dva pozitivna cijela broja i izračunaj njihov NZD Euklidovim algoritmom sa ostatkom dijeljenja.',
    ['Dok b nije 0, sačuvaj ostatak a mod b.', 'Zatim a postaje staro b, a b postaje ostatak.'],
    chain(set('a', numberInput('Prvi broj')), set('b', numberInput('Drugi broj')), gcdLoop(), print(variable('a'))), output('6'), '84\n30');
  addChallenge(7, 'nzs', 'NZS pomoću NZD-a', 'Brojevni algoritmi',
    'Učitaj dva pozitivna cijela broja. Pronađi njihov NZD, pa ispiši NZS koristeći formulu a · b / NZD(a, b).',
    ['Prije Euklidove petlje sačuvaj proizvod početnih brojeva.', 'Nakon petlje NZD je u varijabli a.'],
    chain(set('a', numberInput('Prvi broj')), set('b', numberInput('Drugi broj')), set('proizvod', multiply(variable('a'), variable('b'))), gcdLoop(), print(divide(variable('proizvod'), variable('a')))), output('72'), '18\n24');
  addChallenge(7, 'prost', 'Provjera prostog broja', 'Petlje i djeljivost',
    'Učitaj prirodan broj n ≥ 2. Provjeri ima li djelilac između 2 i n − 1, pa ispiši „prost“ ili „složen“. Broj 2 obradi kao prost.',
    ['Brojač pronađenih djelilaca postavi na 0.', 'Petlju pokreni samo kada je n veće od 2.'],
    chain(set('n', numberInput('Broj najmanje 2')), set('djelioci', num(0)), branch(compare('GT', variable('n'), num(2)), loop('i', num(2), subtract(variable('n'), num(1)), num(1), branch(compare('EQ', modulo(variable('n'), variable('i')), num(0)), change('djelioci', num(1))))), branch(compare('EQ', variable('djelioci'), num(0)), print(text('prost')), print(text('složen')))), output('prost'), '29');
  addChallenge(7, 'binarni-u-dekadni', 'Binarni zapis u dekadni broj', 'Brojevni sistemi',
    'Učitaj tekst sastavljen od cifara 0 i 1. Čitaj cifre slijeva nadesno i izračunaj dekadnu vrijednost binarnog broja.',
    ['Za svaku novu cifru prvo pomnoži dosadašnju vrijednost sa 2.', 'Ako je cifra „1“, zatim dodaj 1.'],
    chain(set('zapis', input('Binarni zapis')), set('vrijednost', num(0)), loop('i', num(1), length(variable('zapis')), num(1), set('vrijednost', multiply(variable('vrijednost'), num(2))), branch(compare('EQ', charAt(variable('zapis'), variable('i')), text('1')), change('vrijednost', num(1)))), print(variable('vrijednost'))), output('45'), '101101');
  addChallenge(7, 'dekadni-u-binarni', 'Dekadni broj u binarni zapis', 'Brojevni sistemi',
    'Učitaj pozitivan cijeli broj. Ponovljenim dijeljenjem sa 2 napravi njegov binarni zapis i ispiši ga.',
    ['Ostatak pri dijeljenju sa 2 dodaj ispred prethodnog zapisa.', 'Količnik zaokruži prema dolje.'],
    chain(set('n', numberInput('Pozitivan broj')), set('zapis', text('')), whileDo(compare('GT', variable('n'), num(0)), set('zapis', join(modulo(variable('n'), num(2)), variable('zapis'))), set('n', round('ROUNDDOWN', divide(variable('n'), num(2))))), print(variable('zapis'))), output('1101'), '13');
  addChallenge(7, 'minimum', 'Najmanji element liste', 'Pretraživanje',
    'Nađi i ispiši najmanji element liste [7, −2, 4, −9, 1]. Ne sortiraj listu: prođi kroz njene elemente jednom.',
    ['Početni minimum je prvi element liste.', 'Minimum zamijeni kada nađeš manji element.'],
    chain(set('brojevi', numericList([7, -2, 4, -9, 1])), set('minimum', listAt(variable('brojevi'), num(1))), each('n', variable('brojevi'), branch(compare('LT', variable('n'), variable('minimum')), set('minimum', variable('n')))), print(variable('minimum'))), output('-9'));
  addChallenge(7, 'samoglasnici', 'Brojanje samoglasnika', 'Obrada teksta',
    'Učitaj riječ napisanu malim slovima. Prebroj slova a, e, i, o, u i ispiši ukupan broj samoglasnika.',
    ['Pregledaj svaki znak riječi.', 'Provjeri pojavljuje li se znak u tekstu „aeiou“.'],
    chain(set('rijec', input('Riječ malim slovima')), set('brojac', num(0)), loop('i', num(1), length(variable('rijec')), num(1), branch(compare('GT', indexOf(text('aeiou'), charAt(variable('rijec'), variable('i'))), num(0)), change('brojac', num(1)))), print(variable('brojac'))), output('5'), 'informatika');
  addChallenge(7, 'velika-slova', 'Pretvaranje u velika slova', 'Tekst i kodiranje',
    'Učitaj ime i prezime iz jednog reda, pretvori cijeli tekst u velika slova i ispiši rezultat, uključujući slova č i ć.',
    ['Sačuvaj cijeli red kao tekst.', 'Upotrijebi blok za promjenu veličine slova.'],
    chain(set('ime', input('Ime i prezime')), print(block('text_changeCase', { CASE: 'UPPERCASE' }, { TEXT: variable('ime') }))), output('ELVIR ČAJIĆ'), 'Elvir čajić');
  addChallenge(7, 'zbir-parnih', 'Zbir parnih brojeva do 30', 'Uslovi u petlji',
    'Prođi kroz brojeve od 1 do 30. Saberi samo parne brojeve i ispiši zbir nakon petlje.',
    ['Parnost provjeri ostatkom pri dijeljenju sa 2.', 'Zbir mijenjaj samo u grani ako je broj paran.'],
    chain(set('zbir', num(0)), loop('i', num(1), num(30), num(1), branch(compare('EQ', modulo(variable('i'), num(2)), num(0)), change('zbir', variable('i')))), print(variable('zbir'))), output('240'));
  addChallenge(7, 'povrsina-trougla', 'Površina trougla iz ulaza', 'Matematičko modeliranje',
    'Učitaj osnovicu i pripadnu visinu trougla, svaku iz posebnog reda. Izračunaj i ispiši površinu.',
    ['Pomnoži osnovicu i visinu.', 'Proizvod podijeli sa 2.'],
    chain(set('osnovica', numberInput('Osnovica')), set('visina', numberInput('Visina')), print(divide(multiply(variable('osnovica'), variable('visina')), num(2)))), output('42'), '12\n7');
  addChallenge(7, 'spirala', 'Kvadratna spirala', 'Crtanje sa varijablom',
    'Nacrtaj šest uzastopnih duži. Prva ima 40 koraka, svaka sljedeća je duža za 10. Nakon svake duži okreni se desno za 90°.',
    ['Dužinu čuvaj u varijabli korak.', 'U petlji nacrtaj duž, okreni se i povećaj korak.'],
    chain(set('korak', num(40)), repeat(num(6), move(variable('korak')), turn(num(90)), change('korak', num(10)))), stage(60, -70, 540, 6, {width:80,height:90,segmentLengths:[40,50,60,70,80,90],segmentAngles:[0,-90,180,90,0,-90]}));
  addChallenge(7, 'događaj-crtanje', 'Poruka pokreće crtanje', 'Događaji i petlje',
    'Pošalji poruku „nacrtaj“. Kada lik primi poruku, neka nacrta kvadrat stranice 50 i zatim ispiše „Kvadrat je nacrtan.“.',
    ['Petlja za crtanje mora biti u tijelu primaoca poruke.', 'Ispis dodaj poslije petlje, unutar istog primaoca.'],
    [block('edu_message', {}, { TEXT: text('nacrtaj') }), block('edu_received', { MESSAGE: 'nacrtaj' }, { DO: chain(repeat(num(4), move(num(50)), turn(num(90))), say(text('Kvadrat je nacrtan.'))) })], output('Kvadrat je nacrtan.'));

  // 8. razred: ugniježđene petlje, pretraživanje, sortiranje i stringovi.
  addChallenge(8, 'suma-kvadrata', 'Zbir kvadrata prvih deset brojeva', 'Izrazi i akumulacija',
    'Petljom izračunaj 1² + 2² + … + 10² i ispiši zbir.',
    ['U svakom prolazu dodaj kvadrat brojača.', 'Koristi blok stepenovanja ili pomnoži broj samim sobom.'],
    chain(set('zbir', num(0)), loop('i', num(1), num(10), num(1), change('zbir', power(variable('i'), num(2)))), print(variable('zbir'))), output('385'));
  addChallenge(8, 'fibonacci', 'Prvih deset Fibonacci brojeva', 'Rekurentni niz',
    'Ispiši deset članova Fibonacci niza počevši od 0 i 1, svaki u novom redu. Sljedeći član je zbir prethodna dva.',
    ['Početne varijable a i b postavi na 0 i 1.', 'Privremeno sačuvaj a + b prije promjene a i b.'],
    chain(set('a', num(0)), set('b', num(1)), repeat(num(10), print(variable('a')), set('sljedeci', add(variable('a'), variable('b'))), set('a', variable('b')), set('b', variable('sljedeci')))), output('0\n1\n1\n2\n3\n5\n8\n13\n21\n34'));
  addChallenge(8, 'bubble-sort', 'Sortiranje zamjenom susjeda', 'Sortiranje lista',
    'Sortiraj listu [8, 3, 6, 1, 5] od najmanjeg do najvećeg poređenjem i zamjenom susjednih elemenata. Ispiši svaki element sortirane liste u novom redu.',
    ['Četiri prolaza kroz četiri susjedna para dovoljna su za pet elemenata.', 'Prvi element para sačuvaj u privremenu varijablu prije zamjene.'],
    chain(set('brojevi', numericList([8, 3, 6, 1, 5])), repeat(num(4), loop('j', num(1), num(4), num(1), branch(compare('GT', listAt(variable('brojevi'), variable('j')), listAt(variable('brojevi'), add(variable('j'), num(1)))), chain(set('privremeni', listAt(variable('brojevi'), variable('j'))), listSet(variable('brojevi'), variable('j'), listAt(variable('brojevi'), add(variable('j'), num(1)))), listSet(variable('brojevi'), add(variable('j'), num(1)), variable('privremeni')))))), each('n', variable('brojevi'), print(variable('n')))), output('1\n3\n5\n6\n8'));
  addChallenge(8, 'linearno-pretrazivanje', 'Prva pozicija traženog broja', 'Pretraživanje lista',
    'U listi [4, 9, 2, 9, 7] nađi prvu poziciju broja 9. Pozicije počinju od 1. Ispiši 0 ako broj nije pronađen.',
    ['Varijablu pozicija inicijalizuj na 0.', 'Poziciju promijeni samo ako je element jednak cilju i pozicija je još 0.'],
    chain(set('brojevi', numericList([4, 9, 2, 9, 7])), set('cilj', num(9)), set('pozicija', num(0)), loop('i', num(1), listLength(variable('brojevi')), num(1), branch(and(compare('EQ', listAt(variable('brojevi'), variable('i')), variable('cilj')), compare('EQ', variable('pozicija'), num(0))), set('pozicija', variable('i')))), print(variable('pozicija'))), output('2'));
  addChallenge(8, 'prosjek-liste', 'Prosjek elemenata liste', 'Statistika',
    'Izračunaj aritmetički prosjek liste [12, 16, 8, 20]. Program treba koristiti stvarnu dužinu liste pri dijeljenju.',
    ['Saberi sve elemente petljom.', 'Zbir podijeli blokom koji računa dužinu liste.'],
    chain(set('brojevi', numericList([12, 16, 8, 20])), set('zbir', num(0)), each('n', variable('brojevi'), change('zbir', variable('n'))), print(divide(variable('zbir'), listLength(variable('brojevi'))))), output('14'));
  addChallenge(8, 'binarno-pretrazivanje', 'Binarno pretraživanje uređene liste', 'Efikasni algoritmi',
    'U uređenoj listi [2, 4, 7, 10, 13, 18] nađi poziciju broja 13 binarnim pretraživanjem. Pozicije počinju od 1; rezultat je 0 ako cilja nema.',
    ['Čuvaj lijevu i desnu granicu pretrage.', 'Sredinu zaokruži prema dolje. Nakon poređenja odbaci polovinu liste.'],
    chain(set('brojevi', numericList([2, 4, 7, 10, 13, 18])), set('cilj', num(13)), set('lijevo', num(1)), set('desno', listLength(variable('brojevi'))), set('pozicija', num(0)), whileDo(and(compare('LTE', variable('lijevo'), variable('desno')), compare('EQ', variable('pozicija'), num(0))), set('sredina', round('ROUNDDOWN', divide(add(variable('lijevo'), variable('desno')), num(2)))), branch(compare('EQ', listAt(variable('brojevi'), variable('sredina')), variable('cilj')), set('pozicija', variable('sredina')), branch(compare('LT', listAt(variable('brojevi'), variable('sredina')), variable('cilj')), set('lijevo', add(variable('sredina'), num(1))), set('desno', subtract(variable('sredina'), num(1)))))), print(variable('pozicija'))), output('5'));
  addChallenge(8, 'stepeni-dvojke', 'Prvih osam stepena dvojke', 'Nizovi i memorija',
    'Ispiši vrijednosti 2⁰, 2¹, …, 2⁷. Koristi ponavljanje i udvostručavanje prethodne vrijednosti.',
    ['Početna vrijednost je 1.', 'Poslije svakog ispisa pomnoži vrijednost sa 2.'],
    chain(set('vrijednost', num(1)), repeat(num(8), print(variable('vrijednost')), set('vrijednost', multiply(variable('vrijednost'), num(2))))), output('1\n2\n4\n8\n16\n32\n64\n128'));
  addChallenge(8, 'heksadecimalni', 'Dekadni broj u heksadecimalni zapis', 'Brojevni sistemi',
    'Učitaj pozitivan cijeli broj. Pretvori ga u heksadecimalni zapis, koristeći cifre 0123456789ABCDEF.',
    ['Ostatak pri dijeljenju sa 16 određuje sljedeću cifru.', 'Pozicije u bloku za znak počinju od 1: zato ostatku dodaj 1.'],
    chain(set('n', numberInput('Pozitivan broj')), set('cifre', text('0123456789ABCDEF')), set('zapis', text('')), whileDo(compare('GT', variable('n'), num(0)), set('zapis', join(charAt(variable('cifre'), add(modulo(variable('n'), num(16)), num(1))), variable('zapis'))), set('n', round('ROUNDDOWN', divide(variable('n'), num(16))))), print(variable('zapis'))), output('1A'), '26');
  addChallenge(8, 'klasifikacija-liste', 'Pozitivni, negativni i nule', 'Klasifikacija podataka',
    'U listi [−3, 0, 2, −1, 5, 0] prebroj pozitivne brojeve, negativne brojeve i nule. Ispiši tri reda u zadanom obliku.',
    ['Koristi tri odvojena brojača.', 'Nulu nemoj ubrojiti među pozitivne ni među negativne brojeve.'],
    chain(set('brojevi', numericList([-3, 0, 2, -1, 5, 0])), set('pozitivni', num(0)), set('negativni', num(0)), set('nule', num(0)), each('n', variable('brojevi'), branch(compare('GT', variable('n'), num(0)), change('pozitivni', num(1)), branch(compare('LT', variable('n'), num(0)), change('negativni', num(1)), change('nule', num(1))))), print(join(text('pozitivni: '), variable('pozitivni'))), print(join(text('negativni: '), variable('negativni'))), print(join(text('nule: '), variable('nule')))), output('pozitivni: 2\nnegativni: 2\nnule: 2'));
  addChallenge(8, 'obrnuti-redoslijed', 'Ispis liste unazad', 'Indeksiranje',
    'Napravi listu [2, 5, 8, 11] i ispiši njene elemente od posljednjeg do prvog bez mijenjanja liste.',
    ['Počni od dužine liste, a završi na poziciji 1.', 'Petlja sa početkom većim od kraja smanjuje brojač.'],
    chain(set('brojevi', numericList([2, 5, 8, 11])), loop('i', listLength(variable('brojevi')), num(1), num(1), print(listAt(variable('brojevi'), variable('i'))))), output('11\n8\n5\n2'));
  addChallenge(8, 'palindrom', 'Je li riječ palindrom?', 'Obrada teksta',
    'Učitaj riječ malim slovima. Poredi znakove jednako udaljene od početka i kraja i ispiši „palindrom“ ili „nije palindrom“.',
    ['Naspram pozicije i stoji pozicija dužina + 1 − i.', 'Jedan nejednak par dovoljan je da riječ nije palindrom.'],
    chain(set('rijec', input('Riječ')), set('jednako', truth(true)), loop('i', num(1), round('ROUNDDOWN', divide(length(variable('rijec')), num(2))), num(1), branch(compare('NEQ', charAt(variable('rijec'), variable('i')), charAt(variable('rijec'), subtract(add(length(variable('rijec')), num(1)), variable('i')))), set('jednako', truth(false)))), branch(variable('jednako'), print(text('palindrom')), print(text('nije palindrom')))), output('palindrom'), 'radar');
  addChallenge(8, 'ugnjezdene-petlje', 'Mala tablica množenja', 'Ugniježđene petlje',
    'Pomoću dvije ugniježđene petlje ispiši sve proizvode i × j za i i j od 1 do 3. Svaki red ima oblik „1×1=1“.',
    ['Vanjska petlja određuje i, a unutrašnja j.', 'U svakom prolazu unutrašnje petlje ispiši jedan cijeli red.'],
    loop('i', num(1), num(3), num(1), loop('j', num(1), num(3), num(1), print(join(variable('i'), text('×'), variable('j'), text('='), multiply(variable('i'), variable('j')))))), output('1×1=1\n1×2=2\n1×3=3\n2×1=2\n2×2=4\n2×3=6\n3×1=3\n3×2=6\n3×3=9'));

  // 9. razred: složeniji numerički algoritmi i povezivanje više koncepata.
  addChallenge(9, 'kvadratna-jednacina', 'Dva korijena kvadratne jednačine', 'Matematičko programiranje',
    'Učitaj a, b i c za jednačinu ax² + bx + c = 0, uz a ≠ 0 i diskriminantu veću od 0. Izračunaj diskriminantu i ispiši prvo korijen sa +√D, zatim korijen sa −√D.',
    ['D = b² − 4ac.', 'Svaki korijen dobija se dijeljenjem brojioca sa 2a.'],
    chain(set('a', numberInput('Koeficijent a')), set('b', numberInput('Koeficijent b')), set('c', numberInput('Koeficijent c')), set('d', subtract(power(variable('b'), num(2)), multiply(multiply(num(4), variable('a')), variable('c')))), set('korijen', block('math_single', { OP: 'ROOT' }, { NUM: variable('d') })), print(divide(add(multiply(num(-1), variable('b')), variable('korijen')), multiply(num(2), variable('a')))), print(divide(subtract(multiply(num(-1), variable('b')), variable('korijen')), multiply(num(2), variable('a'))))), output('3\n2'), '1\n-5\n6');
  addChallenge(9, 'zbir-cifara', 'Zbir cifara prirodnog broja', 'Cifre i uslovne petlje',
    'Učitaj pozitivan cijeli broj i izračunaj zbir njegovih dekadnih cifara, bez pretvaranja broja u tekst.',
    ['Posljednja cifra dobija se ostatkom pri dijeljenju sa 10.', 'Ukloni posljednju cifru cjelobrojnim dijeljenjem sa 10.'],
    chain(set('n', numberInput('Pozitivan broj')), set('zbir', num(0)), whileDo(compare('GT', variable('n'), num(0)), change('zbir', modulo(variable('n'), num(10))), set('n', round('ROUNDDOWN', divide(variable('n'), num(10))))), print(variable('zbir'))), output('24'), '70926');
  addChallenge(9, 'armstrong', 'Armstrongov trocifreni broj', 'Cifre i stepenovanje',
    'Učitaj pozitivan trocifreni broj. Ako je jednak zbiru kubova svojih cifara, ispiši „Armstrongov broj“, inače „nije Armstrongov broj“.',
    ['Sačuvaj početni broj prije izdvajanja cifara.', 'Saberi treće stepene tri cifre.'],
    chain(set('n', numberInput('Trocifreni broj')), set('pocetni', variable('n')), set('zbir', num(0)), whileDo(compare('GT', variable('n'), num(0)), change('zbir', power(modulo(variable('n'), num(10)), num(3))), set('n', round('ROUNDDOWN', divide(variable('n'), num(10))))), branch(compare('EQ', variable('zbir'), variable('pocetni')), print(text('Armstrongov broj')), print(text('nije Armstrongov broj')))), output('Armstrongov broj'), '153');
  addChallenge(9, 'prosti-faktori', 'Rastavljanje na proste faktore', 'Brojevni algoritmi',
    'Učitaj prirodan broj veći od 1. Ispiši njegove proste faktore od najmanjeg ka najvećem, svaki u novom redu, sa ponavljanjem.',
    ['Počni sa djeliteljem 2.', 'Dok je n djeljiv djeliteljem, ispiši djelitelj i podijeli n njime; tek zatim povećaj djelitelj.'],
    chain(set('n', numberInput('Broj veći od 1')), set('djelitelj', num(2)), whileDo(compare('GT', variable('n'), num(1)), whileDo(compare('EQ', modulo(variable('n'), variable('djelitelj')), num(0)), print(variable('djelitelj')), set('n', divide(variable('n'), variable('djelitelj')))), change('djelitelj', num(1)))), output('2\n2\n3\n7'), '84');
  addChallenge(9, 'zbir-razlomaka', 'Zbir razlomaka u skraćenom obliku', 'Razlomci i NZD',
    'Učitaj brojilac i imenilac prvog razlomka, zatim brojilac i imenilac drugog, svaki iz svog reda. Svi su pozitivni. Izračunaj zbir, skrati ga NZD-om i ispiši u obliku brojilac/imenilac.',
    ['Novi brojilac je p · s + r · q, a imenilac q · s.', 'NZD izračunaj na kopijama novog brojioca i imenioca.'],
    chain(set('p', numberInput('Prvi brojilac')), set('q', numberInput('Prvi imenilac')), set('r', numberInput('Drugi brojilac')), set('s', numberInput('Drugi imenilac')), set('brojilac', add(multiply(variable('p'), variable('s')), multiply(variable('r'), variable('q')))), set('imenilac', multiply(variable('q'), variable('s'))), set('a', variable('brojilac')), set('b', variable('imenilac')), gcdLoop(), print(join(divide(variable('brojilac'), variable('a')), text('/'), divide(variable('imenilac'), variable('a'))))), output('19/12'), '3\n4\n5\n6');
  addChallenge(9, 'broj-rijeci', 'Broj riječi u rečenici', 'Tekst i liste',
    'Učitaj rečenicu u kojoj je između riječi tačno jedan razmak, bez razmaka na početku i kraju. Podijeli je u listu riječi i ispiši broj riječi.',
    ['Blok za dijeljenje teksta koristi razmak kao separator.', 'Rezultat je lista čiju dužinu treba ispisati.'],
    chain(set('recenica', input('Rečenica')), set('rijeci', block('lists_split', { MODE: 'SPLIT' }, { INPUT: variable('recenica'), DELIM: text(' ') }, { mode: 'SPLIT' })), print(listLength(variable('rijeci')))), output('3'), 'Učimo Python zajedno');
  addChallenge(9, 'caesar', 'Cezarova šifra sa pomakom 3', 'Kodiranje teksta',
    'Učitaj tekst sastavljen samo od velikih engleskih slova A–Z. Zamijeni svako slovo slovom tri mjesta dalje, pri čemu se poslije Z vraća na A.',
    ['Pronađi poziciju slova u tekstu ABCDEFGHIJKLMNOPQRSTUVWXYZ.', 'Indeks pretvori u raspon 0–25, dodaj 3 i uzmi ostatak pri dijeljenju sa 26.'],
    chain(set('tekst', input('Velika slova A-Z')), set('abeceda', text('ABCDEFGHIJKLMNOPQRSTUVWXYZ')), set('sifra', text('')), loop('i', num(1), length(variable('tekst')), num(1), set('pozicija', indexOf(variable('abeceda'), charAt(variable('tekst'), variable('i')))), set('nova', add(modulo(add(subtract(variable('pozicija'), num(1)), num(3)), num(26)), num(1))), set('sifra', join(variable('sifra'), charAt(variable('abeceda'), variable('nova'))))), print(variable('sifra'))), output('HOGL'), 'ELDI');
  addChallenge(9, 'sito', 'Eratostenovo sito do 30', 'Liste i ugniježđene petlje',
    'Pomoću liste logičkih oznaka pronađi i ispiši sve proste brojeve od 2 do 30. Za svaki prost broj označi njegove višekratnike kao složene.',
    ['Napravi listu od 30 oznaka tačno; pozicija odgovara samom broju.', 'Precrtavanje počni od i²; petlju pokreni samo ako i² ≤ 30.'],
    chain(set('prost', block('lists_repeat', {}, { ITEM: truth(true), NUM: num(30) })), loop('i', num(2), num(30), num(1), branch(listAt(variable('prost'), variable('i')), chain(print(variable('i')), branch(compare('LTE', multiply(variable('i'), variable('i')), num(30)), loop('j', multiply(variable('i'), variable('i')), num(30), variable('i'), listSet(variable('prost'), variable('j'), truth(false)))))))), output('2\n3\n5\n7\n11\n13\n17\n19\n23\n29'));
  addChallenge(9, 'collatz', 'Collatzov niz', 'Uslovno ponavljanje',
    'Učitaj prirodan broj n. Ispiši ga, pa ponavljaj: paran broj prepolovi, neparan zamijeni sa 3n + 1. Poslije svake promjene ispiši broj i stani kada dobiješ 1.',
    ['Početni broj ispiši prije petlje.', 'Petlja se izvršava dok je n veći od 1.'],
    chain(set('n', numberInput('Početni broj')), print(variable('n')), whileDo(compare('GT', variable('n'), num(1)), branch(compare('EQ', modulo(variable('n'), num(2)), num(0)), set('n', divide(variable('n'), num(2))), set('n', add(multiply(num(3), variable('n')), num(1)))), print(variable('n')))), output('13\n40\n20\n10\n5\n16\n8\n4\n2\n1'), '13');
  addChallenge(9, 'budzet', 'Analiza kućnog budžeta', 'Modeliranje podataka',
    'Prihod je 1200 KM, a troškovi su u listi [350, 180, 95, 120]. Saberi troškove, izračunaj preostali iznos i ispiši „Preostalo: IZNOS“. Zatim ispiši „Budžet je pozitivan“ ako je iznos ≥ 0, inače „Budžet je u minusu“.',
    ['Troškove saberi petljom kroz listu.', 'Prihod umanji za zbir troškova, zatim provjeri predznak rezultata.'],
    chain(set('prihod', num(1200)), set('troskovi', numericList([350, 180, 95, 120])), set('ukupno', num(0)), each('trosak', variable('troskovi'), change('ukupno', variable('trosak'))), set('preostalo', subtract(variable('prihod'), variable('ukupno'))), print(join(text('Preostalo: '), variable('preostalo'))), branch(compare('GTE', variable('preostalo'), num(0)), print(text('Budžet je pozitivan')), print(text('Budžet je u minusu')))), output('Preostalo: 455\nBudžet je pozitivan'));
  addChallenge(9, 'kamata', 'Godišnji rast ušteđevine', 'Simulacija',
    'Ušteđevina je 100 KM i svake godine raste za 5%. Simuliraj tri godine i ispiši konačni iznos zaokružen na dvije decimale.',
    ['U svakoj godini pomnoži iznos sa 1,05.', 'Zaokruži iznos × 100 na cijeli broj, pa podijeli sa 100.'],
    chain(set('iznos', num(100)), repeat(num(3), set('iznos', multiply(variable('iznos'), num(1.05)))), print(divide(round('ROUND', multiply(variable('iznos'), num(100))), num(100)))), output('115.76'));
  addChallenge(9, 'medijan', 'Medijan uređene liste', 'Statistika i indeksiranje',
    'Napravi uređenu listu [2, 5, 7, 10, 12]. Izračunaj središnju poziciju iz dužine liste, pa ispiši medijan. Zadatak pretpostavlja neparan broj elemenata.',
    ['Središnja pozicija je (dužina + 1) / 2.', 'Vrijednost na toj poziciji predstavlja medijan.'],
    chain(set('brojevi', numericList([2, 5, 7, 10, 12])), set('sredina', divide(add(listLength(variable('brojevi')), num(1)), num(2))), print(listAt(variable('brojevi'), variable('sredina')))), output('7'));

  return challenges;
})();
