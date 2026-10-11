#!/usr/bin/env python3
"""Original ELDI 3 x 10 arithmetic programming contests; deterministic PHP bank."""
from pathlib import Path
import json,hashlib,random,math
ROOT=Path(__file__).resolve().parents[1]
P=[[7,5],[9,4],[0,0],[-3,8],[12,-5],[-4,-7],[100,25],[1,9],[50,50],[999,1]]
R=[[2.5,1.25],[-3.5,2],[0,0],[0.1,0.2],[12.5,-4],[-1.25,-2.75],[100,0.5],[1,1],[-8,8],[999.9,0.1]]
D=[[9,2],[1,4],[0,5],[-7,2],[8,-4],[-9,-3],[1,3],[0.5,2],[100,0.25],[7.5,1.5]]
N=[[4],[0],[1],[2],[5],[10],[20],[50],[99],[100]]
read2='a = int(input())\nb = int(input())\n'
real2='a = float(input())\nb = float(input())\n'
def q(key,mode,title,prompt,source,ins,fn,**extra):
 cases=[]
 for row in ins:
  out=fn(row)
  cases.append({'input':[str(v) for v in row],'output':[str(v) for v in (out if isinstance(out,list) else [out])]})
 item={'id':key,'mode':mode,'title':title,'prompt':prompt,'points':10,'reference':source.rstrip()+'\n','cases':cases,'explanation':extra.pop('explanation','Prati redoslijed ulaza, izračunaj traženi izraz i ispiši samo tražene brojeve.'),**extra}
 if mode=='output':item.update(code=source.rstrip(),input=cases[0]['input'],answer='\n'.join(cases[0]['output']))
 if mode=='order':
  pieces=[{'id':hashlib.sha256((key+str(i)).encode()).hexdigest()[:10],'code':line} for i,line in enumerate(source.rstrip().splitlines())]
  item['solution']=[p['id'] for p in pieces];random.Random(key).shuffle(pieces)
  if [p['id'] for p in pieces]==item['solution']:pieces.reverse()
  item['pieces']=pieces
 if mode=='program':item['starter']='\n'.join(line for line in source.splitlines() if not line.startswith(' ') and 'input()' in line)+'\n# Napiši računanje i ispis.\n'
 return item
L1=[
 q('l1-zbir','output','Varijable i zbir','Koji broj ispisuje program? Ovdje ne treba unositi brojeve.','a = 7\nb = 5\nprint(a + b)',[[]],lambda x:12,explanation='Varijable a i b čuvaju 7 i 5. Njihov zbir je 12.'),
 q('l1-ulaz','output','Od ulaza do ispisa','Zamisli da su uneseni brojevi 9 i 4, tim redom. Napiši ispis programa.',read2+'print(a - b)',[[9,4]],lambda x:5,explanation='Prvi input() čita a = 9, drugi b = 4. Program ispisuje 9 − 4 = 5.'),
 q('l1-dopuni-zbir','fill','Dopuni zbir','Učitaj dva cijela broja a i b. Dopuni prazninu da program ispisuje njihov zbir.',read2+'print(a + b)',P,lambda x:x[0]+x[1],template=read2+'print(a + __1__)\n',blanks=['Drugi sabirak'],solution=['b']),
 q('l1-dopuni-proizvod','fill','Dopuni operator','Učitaj dva cijela broja. U prazninu upiši operator za njihov proizvod.',read2+'print(a * b)',P,lambda x:x[0]*x[1],template=read2+'print(a __1__ b)\n',blanks=['Operator množenja'],solution=['*']),
 q('l1-slozi-duplo','order','Složi: dvostruki broj','Složi sve naredbe u program koji učitava cijeli broj i ispisuje njegovu dvostruku vrijednost.','n = int(input())\nd = n * 2\nprint(d)',N,lambda x:2*x[0]),
 q('l1-slozi-razliku','order','Složi: razlika','Prvi ulaz je a, drugi b. Složi naredbe da ispišu a − b.',read2+'r = a - b\nprint(r)',P,lambda x:x[0]-x[1]),
 q('l1-realni-zbir','program','Saberi realne brojeve','Učitaj realne brojeve a i b, svaki u svom redu. Ispiši a + b. Dozvoljeni su i negativni brojevi; apsolutne vrijednosti su do 1000.',real2+'print(a + b)',R,lambda x:x[0]+x[1]),
 q('l1-mnozenje','program','Pomnoži dva broja','Učitaj dva cijela broja a i b (−1000 do 1000) i ispiši njihov proizvod.',read2+'print(a * b)',P,lambda x:x[0]*x[1]),
 q('l1-dijeljenje','program','Razlomak kao decimalni broj','Zamisli da prvi uneseni broj a predstavlja brojnik, a drugi broj b nazivnik razlomka. Napiši program koji ih učitava i ispisuje razlomak kao decimalni broj. Naprimjer, 3/4 = 0.75. Nazivnik nije nula. Koristi dijeljenje /.',real2+'print(a / b)',[[3,4],[1,2],[5,2],[1,4],[-3,4],[0,5],[7,2],[2,5],[1,3],[10,4]],lambda x:x[0]/x[1],fraction_inputs=True,explanation='Razlomak a/b predstavlja dijeljenje brojnika nazivnikom. Operator / daje decimalni zapis: 3/4 = 0.75, 1/2 = 0.5. Float čuva decimalni dio, a // ovdje ne treba koristiti.'),
 q('l1-dva-ispisa','program','Zbir pa razlika','Učitaj cijele brojeve a i b. U prvom redu ispiši a + b, a u drugom a − b. Ne dodaj tekstualne poruke.',read2+'print(a + b)\nprint(a - b)',P,lambda x:[x[0]+x[1],x[0]-x[1]])
]
maxsrc=real2+'if a > b:\n    print(a)\nelse:\n    print(b)'
safesrc=real2+'if b != 0:\n    print(a / b)\nelse:\n    print(0)'
T=[[3,4,5],[0,0,0],[1,2,3],[-3,0,3],[2.5,3.5,6],[100,0,50],[-1,-2,-3],[0.1,0.2,0.3],[7,7,7],[1,1,2]]
CALC=[[5,3,1],[10,4,2],[2.5,4,3],[7,2,4],[1,0,4],[-5,2,1],[-3,-2,3],[0,4,4],[2,8,2],[1,3,4]]
tri=[[3,4,5],[1,2,3],[5,5,5],[0,2,2],[-1,4,4],[2.5,3,4],[10,1,1],[7,10,5],[1,1,1],[2,3,4]]
L2=[
 q('l2-prioritet','output','Redoslijed računanja','Napiši broj koji program ispisuje. Obrati pažnju na zagrade, množenje i dijeljenje.','a = 8\nb = 4\nprint((a + b) * 2 - 6 / 3)',[[]],lambda x:22,explanation='Zagrada daje 12, zatim 12 · 2 − 6 / 3 = 24 − 2 = 22.'),
 q('l2-grana','output','Koja grana se izvršava?','Zamisli da su uneseni brojevi 6 i 10, tim redom. Koji broj će se pojaviti na ekranu?',real2+'if a > b:\n    print(a / b)\nelse:\n    print(b - a)',[[6,10]],lambda x:4,explanation='Uslov 6 > 10 nije tačan. Izvršava se else i ispisuje 10 − 6 = 4.'),
 q('l2-dopuni-uslov','fill','Dopuni poređenje','Dopuni uslov da se ispiše veći od dva realna broja. Kada su jednaki, ispisuje se taj broj.',maxsrc,R,lambda x:max(x),template=real2+'if a __1__ b:\n    print(a)\nelse:\n    print(b)\n',blanks=['Operator poređenja'],solution=['>']),
 q('l2-dopuni-nulu','fill','Zaštiti dijeljenje','Ako je b različit od nule, ispiši a / b. Ako je b nula, ispiši 0. Dopuni provjeru.',safesrc,[[8,2],[7,0],[0,0],[-9,3],[1,4],[5,-2],[0,5],[12.5,2.5],[10,0],[1,3]],lambda x:x[0]/x[1] if x[1] else 0,template=real2+'if b __1__ 0:\n    print(a / b)\nelse:\n    print(0)\n',blanks=['Operator za različito'],solution=['!=']),
 q('l2-slozi-prosjek','order','Složi: prosjek','Složi naredbe za prosjek tri realna broja. Svaki broj se učitava u zasebnom redu.',real2+'c = float(input())\ns = a + b + c\nprint(s / 3)',T,lambda x:sum(x)/3),
 q('l2-slozi-aps','order','Složi: ukloni minus','Učitaj cijeli broj. Ako je negativan, promijeni mu predznak. Ispiši nenegativan rezultat. Uvučeni blok pripada uslovu.','n = int(input())\nif n < 0:\n    n = -n\nprint(n)',[[-5],[3],[0],[-1],[1],[-100],[250],[-999],[50],[-7]],lambda x:abs(x[0])),
 q('l2-veci','program','Veći od dva broja','Učitaj dva realna broja (apsolutna vrijednost do 1000). Pomoću uslova ispiši veći. Ako su jednaki, ispiši taj broj.',maxsrc,R,lambda x:max(x),requires='if'),
 q('l2-popust','program','Popust prema cijeni','Učitaj nenegativnu cijenu do 10000. Ako je cijena najmanje 100, umanji je za 10%. Inače ostaje ista. Ispiši konačnu cijenu bez zaokruživanja.','c = float(input())\nif c >= 100:\n    print(c * 0.9)\nelse:\n    print(c)',[[100],[50],[0],[99.99],[100.01],[250],[1000],[12.5],[10000],[150.5]],lambda x:x[0]*.9 if x[0]>=100 else x[0],requires='if'),
 q('l2-kalkulator','program','Mali kalkulator','Učitaj realne brojeve a i b, zatim cijeli broj op. Za op = 1 ispiši a + b; za 2 a − b; za 3 a · b; za 4 a / b. Kod dijeljenja nulom ispiši 0. U testovima je op od 1 do 4.',real2+'op = int(input())\nif op == 1:\n    print(a + b)\nelif op == 2:\n    print(a - b)\nelif op == 3:\n    print(a * b)\nelse:\n    if b != 0:\n        print(a / b)\n    else:\n        print(0)',CALC,lambda x:x[0]+x[1] if x[2]==1 else x[0]-x[1] if x[2]==2 else x[0]*x[1] if x[2]==3 else x[0]/x[1] if x[1] else 0,requires='if'),
 q('l2-trougao','program','Obim mogućeg trougla','Učitaj tri realne dužine a, b i c. Ako su pozitivne i zbir svake dvije veći je od treće, ispiši obim. U suprotnom ispiši 0.',real2+'c = float(input())\nif a > 0 and b > 0 and c > 0 and a + b > c and a + c > b and b + c > a:\n    print(a + b + c)\nelse:\n    print(0)',tri,lambda x:sum(x) if min(x)>0 and sum(x)>2*max(x) else 0,requires='if')
]
sumsrc='n = int(input())\ns = 0\nfor i in range(1, n + 1):\n    s += i\nprint(s)'
prodsrc='n = int(input())\np = 1\nfor i in range(1, n + 1):\n    p = p * i\nprint(p)'
STREAM=[[3,2.5,1.5,4],[0],[1,-3],[4,1,2,3,4],[2,-5,5],[3,.1,.2,.3],[1,0],[5,10,-1,-2,-3,-4],[2,100,250],[3,-1,-2,-3]]
L3=[
 q('l3-broj-ispisa','output','Koliko puta: volim školu?','Koliko će se puta na ekranu ispisati tekst „Volim školu“? Upiši samo broj ponavljanja.','for i in range(5):\n    print("Volim školu")',[[]],lambda x:5,response_kind='count',answer_label='Broj ponavljanja',execution_output=['Volim školu']*5,explanation='Range(5) daje vrijednosti 0, 1, 2, 3 i 4. To je pet ponavljanja, pa se tekst ispisuje 5 puta.'),
 q('l3-broj-od-do','output','Koliko puta: volim informatiku?','Koliko će se puta ispisati tekst „Volim informatiku“? Range(2, 5) počinje od 2, a broj 5 nije uključen.','for i in range(2, 5):\n    print("Volim informatiku")',[[]],lambda x:3,response_kind='count',answer_label='Broj ponavljanja',execution_output=['Volim informatiku']*3,explanation='Petlja prolazi kroz 2, 3 i 4. To su tri ponavljanja. Broj 5 nije uključen.'),
 q('l3-neparni-do5','output','Neparni brojevi do 5','Koji će se brojevi ispisati, redom? Napiši ih odvojene razmakom ili svaki u svom redu. Kraj range nije uključen.','for i in range(1, 6, 2):\n    print(i)',[[]],lambda x:[1,3,5],answer_label='Brojevi koji će se ispisati',explanation='Počinjemo od 1 i povećavamo za 2: 1, 3, 5. Granica 6 nije uključena, tako da je posljednji ispisani broj 5.'),
 q('l3-dopuni-parne','fill','Dopuni početak: parni brojevi','Šta treba upisati umjesto X da program ispiše tačno 2, 4, 6 i 8? Dopuni početak petlje. Broj 10 nije uključen.','for i in range(2, 10, 2):\n    print(i)',[[]],lambda x:[2,4,6,8],template='for i in range(__1__, 10, 2):\n    print(i)\n',blanks=['Početna vrijednost X'],solution=['2'],explanation='X treba biti 2. Korak 2 zatim daje 4, 6 i 8. Ako bismo počeli od 0, ispisao bi se i 0, što nije traženi ispis.'),
 q('l3-slozi-for','order','Složi FOR petlju: zbir','Složi blokove tako da program sabere brojeve od 1 do n i ispiše zbir. Zamisli da je unesen n = 4: sabiraju se 1 + 2 + 3 + 4. Broj n je od 0 do 100.',sumsrc,N,lambda x:x[0]*(x[0]+1)//2,explanation='Prvo učitaj n i postavi s na 0. U petlji dodaj svaki i u s. Ispis mora biti poslije petlje. Range(1, n + 1) uključuje i n.'),
 q('l3-dopuni-range','fill','Uključi i posljednji broj','Dopuni kraj range tako da se saberu brojevi 1 do n, uključujući n. Za n = 0 zbir je 0; n je do 100.',sumsrc,N,lambda x:x[0]*(x[0]+1)//2,template=sumsrc.replace('n + 1','__1__'),blanks=['Gornja granica range (ne ulazi u petlju)'],solution=['n + 1']),
 q('l3-prati-for','output','Prati zbir u petlji','Sada malo izazovniji primjer: napiši završni ispis. Range(1, 5) daje brojeve 1, 2, 3 i 4.','s = 0\nfor i in range(1, 5):\n    s += i * 2\nprint(s)',[[]],lambda x:20,explanation='Sabira se 2 + 4 + 6 + 8 = 20. Dosadašnji prvi zadatak sada je kasnije, nakon jednostavnijih primjera.'),
 q('l3-dopuni-proizvod','fill','Proizvod pomoću FOR petlje','Dopuni operator da p računa proizvod 1 · 2 · ... · n. Za n = 0 rezultat je 1. Broj n je od 0 do 10.',prodsrc,[[4],[0],[1],[2],[3],[5],[6],[7],[9],[10]],lambda x:math.factorial(x[0]),template=prodsrc.replace('p * i','p __1__ i'),blanks=['Operator u akumulatoru proizvoda'],solution=['*']),
 q('l3-slozi-ulaze','order','Složi: saberi unesene brojeve','Zamisli da prvi uneseni broj n govori koliko brojeva slijedi. Složi program koji te brojeve učitava FOR petljom i ispisuje njihov zbir. Broj n je od 0 do 20; za n = 0 ispis je 0.','n = int(input())\ns = 0\nfor i in range(n):\n    x = float(input())\n    s += x\nprint(s)',STREAM,lambda x:sum(x[1:])),
 q('l3-ponovljeno','program','Množenje ponovljenim sabiranjem','Napiši program koji učitava realni broj a, zatim cijeli broj n (0–30). FOR petljom saberi a tačno n puta i ispiši rezultat. Zamisli da su uneseni 2.5 i 4: rezultat je 10. Za n = 0 ispiši 0.','a = float(input())\nn = int(input())\ns = 0\nfor i in range(n):\n    s += a\nprint(s)',[[2.5,4],[7,0],[-3,5],[0,10],[.1,3],[1,30],[-.5,8],[100,2],[3.25,1],[12.5,6]],lambda x:x[0]*x[1],requires='for')
]
# Earlier Parsons exercises provide a gentle entry to linear structure and conditions.
L2=[L2[i] for i in [4,1,5,0,2,3,6,7,8,9]]
banks={}
for level,(name,intro,questions) in enumerate([
 ('Ulaz, varijable i ispis','Početni nivo: čitanje i ispis brojeva, zbir, razlika, proizvod i količnik.',L1),
 ('Linijska struktura i uslovi','Srednji nivo: redoslijed računanja, poređenja, grananje i mali kalkulator.',L2),
 ('FOR petlje korak po korak','Od brojanja ponavljanja i neparnih brojeva do dopunjavanja, slaganja i pisanja FOR petlje.',L3)],1):
 assert len(questions)==10
 for item in questions:item['for_only']=True
 assert all('while' not in item['reference'] for item in questions)
 banks[f'competition-{level}']={'title':f'Takmičenje · Nivo {level} · {name}','intro':intro,'grade':0,'subject':'informatika','featured':False,'competition':True,'revision':2,'level':level,'questions':questions}
text=json.dumps(banks,ensure_ascii=False,indent=2)
(ROOT/'website/eldi-edu/online/competition-bank.php').write_text("<?php\ndeclare(strict_types=1);\n// Generated by scripts/build-competition-bank.py. Original ELDI tasks.\nreturn json_decode(<<<'ELDI_COMPETITION_JSON'\n"+text+"\nELDI_COMPETITION_JSON, true, 512, JSON_THROW_ON_ERROR);\n")
print('Competition bank: 3 levels, 30 tasks,',sum(len(q['cases']) for b in banks.values() for q in b['questions']),'grading cases; FOR only')
