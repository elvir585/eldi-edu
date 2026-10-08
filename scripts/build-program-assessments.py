# Original task definitions and independent expected-result generators.
# Build public metadata separately from private desktop tests.
import json, math, itertools, collections, heapq
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
tasks=[]; private={}
extras={
 'zbir':['-1 0\n','999999999 -1000000000\n'],
 'razlika':['-1 0\n','100 100\n'],
 'proizvod':['1 1000000\n','73 91\n'],
 'podjela':['1 1\n','999999999 1000000\n'],
 'max-tri':['-1000000000 -1000000000 -1000000000\n','-1 0 -1\n'],
 'sort-tri':['3 2 1\n','5 -5 5\n'],
 'pravougaonik':['12345 67890\n','2 1\n'],
 'trajanje':['59\n','60\n'],
 'racun':['7 9 63\n','1 1000000 999999\n'],
 'zadnja-cifra':['-1000000000000\n','999999999999\n'],
 'zbir-cifara':['10\n','-1000000000000\n'],
 'parnost':['1\n','-1000000000\n'],
 'djeljivost':[],
 'nzd':['999999937 1000000000\n','1 1000000000\n'],
 'nzs':['999983 999979\n','1 1000000\n'],
 'prost':['999950884\n','1000000000\n'],
 'broj-djelilaca':['36\n','999950884\n'],
 'skrati-razlomak':['-1000000000 2\n','999983 999979\n'],
 'prestupna':['2100\n','9996\n'],
 'zbir-do-n':['2\n','1234567\n'],
 'zbir-interval':['-1000000 -1\n','-5 5\n'],
 'zbir-umnozaka':['1000000 -1000000\n','1000000 1\n'],
 'niz-zbir':['3\n-1 -1 -1\n','4\n1000000000 1000000000 1000000000 1000000000\n'],
 'prvi-maksimum':['3\n9 1 9\n','4\n-9 -9 -9 -8\n'],
 'iznad-prosjeka':['3\n-3 -2 -1\n','3\n1 1 2\n'],
 'predznaci':['3\n-1 -2 -3\n','4\n0 0 0 0\n'],
 'obrni-niz':['3\n-1 -1 -2\n','2\n9 0\n'],
 'razliciti':['5\n8 2 8 2 8\n','4\n-9 -9 0 -8\n'],
 'prefiks':['2 3\n5 -5\n1 2\n1 1\n2 2\n','5 2\n9 8 7 6 5\n2 5\n4 4\n'],
 'rastuci-segment':['6\n1 2 2 3 4 5\n','5\n5 4 3 2 1\n'],
 'dijagonale':['3\n1000000 0 0\n0 1000000 0\n0 0 1000000\n','2\n-1 8\n9 -2\n'],
 'transponuj':['2 4\n1 2 3 4\n5 6 7 8\n','4 1\n0\n-2\n0\n5\n'],
 'rotacija':['4 5\n1 2 3 4\n','3 2\n9 9 1\n'],
 'palindrom':['abcdefghihgfedcba\n','abca\n'],
 'frekvencija':['aaaabbbb\n','azzzyyy\n'],
 'rijeci':[' a \n','   a  b   c\n'],
 'rle':['a'*100+'\n','abcddddeeefffg\n'],
 'binarni-decimalni':['000000000000000000000000000001\n','101010101010101010101010101010\n'],
 'decimalni-baza':['15 16\n','1000000000000 16\n'],
 'zagrade':['(()\n','('*100+')'*100+'\n'],
 'anagram':['abc\ncba\n','aabbcc\nabcccd\n'],
 'spajanje':['2 3\n1 1\n1 1 1\n','2 2\n1000000000 1000000000\n-1000000000 -1000000000\n'],
 'binarna-pretraga':['4 3\n1 1 1 2\n1 2 0\n','2 2\n-1000000000 1000000000\n1000000000 -1000000000\n'],
 'dubina-zagrada':['())\n','('*100+')'*100+'\n'],
 'bfs':['3 1 1 2\n1 1\n','6 6 1 6\n1 2\n2 3\n3 6\n1 4\n4 6\n4 5\n'],
 'komponente':['3 3\n1 1\n2 2\n3 3\n','6 4\n1 2\n2 3\n4 5\n5 6\n'],
 'dijkstra':['3 3 1 3\n1 2 100\n1 2 1\n2 3 2\n','2 1 1 2\n1 2 10000000000\n'],
 'raspored':['4\n1 4\n2 3\n3 4\n4 5\n','2\n-1000000000 0\n0 1000000000\n'],
 'kovanice':['2 8\n3 5\n','3 10000\n1 7 10\n'],
 'lis':['5\n1 2 3 4 5\n','7\n10 1 9 2 8 3 7\n'],
 'ruksak':['1 6\n3 5\n','2 10000\n5000 1000000\n5000 1000000\n'],
 'sito':['49\n','10000\n'],
 'segment-zbir':['3 1\n2 3 4\n','5 3\n1 1 1 1 1\n'],
 'putanje-mreza':['2 2\n..\n.#\n','20 20\n'+('....................\n'*20)],
 'topoloski':['2 1\n1 1\n','5 4\n1 5\n2 5\n3 5\n4 5\n'],
}
def add(slug,g,title,cat,diff,statement,fmt,outcome,py,cpp,cases,answer,hints):
    tid='pa-'+slug
    cases=cases+extras[slug]
    checked=[{'input':s,'output':str(answer(s)).strip()+'\n'} for s in cases]
    t={'id':tid,'grade':g,'title':title,'category':cat,'difficulty':diff,'statement':statement,'inputFormat':fmt,'outputFormat':outcome,'constraints':outcome.split('Ograničenja: ')[1] if 'Ograničenja: ' in outcome else 'Svi ulazni podaci poštuju opis zadatka.','concepts':hints,'sampleTests':checked[:2],'testCount':len(checked),'lessonKeys':[f'informatics-{g}',cat],'enrichment':g==9}
    t['starters']={
      'python':'import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n',
      'c':'#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n',
      'cpp':'#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n',
      'java':'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n'
    }
    tasks.append(t)
    cpp=cpp.replace('"\n"','"\\n"')
    private[tid]={'tests':checked,'solutions':{'python':'import sys, math\nfrom collections import deque, Counter\nimport heapq\n'+py.strip()+'\n','cpp':'#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\n'+cpp.strip()+'\nreturn 0;}\n'}}
def nums(s):return list(map(int,s.split()))
def linearr(a):return str(len(a))+'\n'+' '.join(map(str,a))+'\n'
def ar(s):return nums(s)[1:]

add('zbir',5,'Zbir velikih cijelih brojeva','Brojevi i izrazi',1,'Učitaj dva cijela broja i ispiši njihov zbir.','Jedan red: a b.','Jedan cijeli broj. Ograničenja: −10⁹ ≤ a,b ≤ 10⁹.', 'a,b=map(int,input().split()); print(a+b)', 'long long a,b;cin>>a>>b;cout<<a+b;', ['7 5\n','-4 9\n','0 0\n','1000000000 1000000000\n','-1000000000 -1000000000\n','83 -83\n'],lambda s:sum(nums(s)),['Sabiranje','Cijeli brojevi','Provjeri nulu i negativne vrijednosti.'])
add('razlika',5,'Promjena temperature','Brojevi i izrazi',1,'Prvi broj je jutarnja, a drugi večernja temperatura. Ispiši večernju minus jutarnju temperaturu.','Jedan red: jutarnja večernja.','Cijeli broj promjene. Ograničenja: temperature od −100 do 100.', 'a,b=map(int,input().split()); print(b-a)', 'long long a,b;cin>>a>>b;cout<<b-a;', ['8 17\n','5 -3\n','0 0\n','-100 100\n','100 -100\n','-8 -2\n'],lambda s:nums(s)[1]-nums(s)[0],['Oduzimanje','Predznak','Redoslijed oduzimanja je važan.'])
add('proizvod',5,'Redovi i sjedišta','Brojevi i izrazi',1,'Sala ima r redova i s sjedišta u svakom redu. Koliko ukupno ima sjedišta?','Jedan red: r s.','Broj sjedišta. Ograničenja: 0 ≤ r,s ≤ 10⁶.', 'r,s=map(int,input().split()); print(r*s)', 'long long r,s;cin>>r>>s;cout<<r*s;', ['12 24\n','1 8\n','0 7\n','1000000 1000000\n','7 0\n','999 999\n'],lambda s:math.prod(nums(s)),['Množenje','Veliki rezultat','Rezultat može biti veći od 32-bitnog cijelog broja.'])
add('podjela',5,'Podjela paketa s ostatkom','Brojevi i izrazi',1,'Podijeli n predmeta u pakete od k predmeta. Ispiši broj punih paketa i preostalih predmeta.','Jedan red: n k.','Dva broja: količnik ostatak. Ograničenja: 0 ≤ n ≤ 10⁹; 1 ≤ k ≤ 10⁶.', 'n,k=map(int,input().split()); print(n//k,n%k)', 'long long n,k;cin>>n>>k;cout<<n/k<<" "<<n%k;', ['23 5\n','24 6\n','0 3\n','7 20\n','1000000000 1\n','1000000000 999999\n'],lambda s:' '.join(map(str,divmod(*nums(s)))),['Cjelobrojno dijeljenje','Ostatak','Pun paket zahtijeva k predmeta.'])
add('max-tri',5,'Najveći od tri broja','Grananje',1,'Učitaj tri cijela broja i ispiši najveći.','Jedan red: a b c.','Najveći broj. Ograničenja: −10⁹ ≤ a,b,c ≤ 10⁹.', 'print(max(map(int,input().split())))', 'long long a,b,c;cin>>a>>b>>c;cout<<max(a,max(b,c));', ['3 9 5\n','8 8 1\n','-7 -2 -9\n','0 0 0\n','1000000000 -1000000000 2\n','4 4 4\n'],lambda s:max(nums(s)),['Uslovi','Poređenje','Najveći broj može biti ponovljen.'])
add('sort-tri',5,'Poredaj tri rezultata','Grananje',2,'Ispiši tri broja u neopadajućem poretku. Jednake vrijednosti zadrži.','Jedan red s tri cijela broja.','Tri broja od najmanjeg do najvećeg. Ograničenja: apsolutna vrijednost do 10⁹.', 'print(*sorted(map(int,input().split())))', 'vector<long long>a(3);for(auto&x:a)cin>>x;sort(a.begin(),a.end());for(auto x:a)cout<<x<<" ";', ['8 2 5\n','4 4 1\n','-1 -9 -3\n','0 0 0\n','1000000000 -1000000000 0\n','1 2 3\n'],lambda s:' '.join(map(str,sorted(nums(s)))),['Poredak','Zamjena','Uporedi i zamijeni pogrešno poredane parove.'])
add('pravougaonik',5,'Obim i površina pravougaonika','Geometrija u kodu',1,'Za stranice a i b ispiši obim, a zatim površinu pravougaonika.','Jedan red: a b.','Dva cijela broja: obim površina. Ograničenja: 1 ≤ a,b ≤ 10⁶.', 'a,b=map(int,input().split()); print(2*(a+b),a*b)', 'long long a,b;cin>>a>>b;cout<<2*(a+b)<<" "<<a*b;', ['3 5\n','4 4\n','1 1\n','1000000 1000000\n','1 1000000\n','27 13\n'],lambda s:f'{2*sum(nums(s))} {math.prod(nums(s))}',['Formule','Obim','Površina'])
add('trajanje',5,'Sekunde u sate, minute i sekunde','Brojevi i izrazi',2,'Pretvori trajanje n sekundi u pune sate, preostale minute i preostale sekunde. Sati mogu biti veći od 23.','Jedan cijeli broj n.','Tri broja: sati minute sekunde. Ograničenja: 0 ≤ n ≤ 10⁹.', 'n=int(input()); print(n//3600,n%3600//60,n%60)', 'long long n;cin>>n;cout<<n/3600<<" "<<(n%3600)/60<<" "<<n%60;', ['3661\n','125\n','0\n','3600\n','1000000000\n','86399\n'],lambda s:f'{int(s)//3600} {int(s)%3600//60} {int(s)%60}',['Jedinice vremena','Dijeljenje','Ostatak'])
add('racun',5,'Račun u feningima','Brojevi i izrazi',2,'Cijena jednog proizvoda je c feninga, količina je k, a kupac plaća p feninga. Ako je p dovoljan, ispiši kusur; inače ispiši NEDOVOLJNO.','Jedan red: c k p.','Kusur ili NEDOVOLJNO. Ograničenja: 0 ≤ c,k ≤ 10⁶; 0 ≤ p ≤ 10¹².', 'c,k,p=map(int,input().split()); print(p-c*k if p>=c*k else "NEDOVOLJNO")', 'long long c,k,p;cin>>c>>k>>p;if(p>=c*k)cout<<p-c*k;else cout<<"NEDOVOLJNO";', ['250 3 1000\n','150 2 200\n','0 0 0\n','1000000 1000000 1000000000000\n','5 0 7\n','9 8 71\n'],lambda s:nums(s)[2]-nums(s)[0]*nums(s)[1] if nums(s)[2]>=nums(s)[0]*nums(s)[1] else 'NEDOVOLJNO',['Cijena','Uslov','Računaj u cijelim feningima.'])
add('zadnja-cifra',5,'Zadnja cifra broja','Cifre',1,'Ispiši zadnju decimalnu cifru apsolutne vrijednosti broja n.','Jedan cijeli broj n.','Jedna cifra od 0 do 9. Ograničenja: −10¹² ≤ n ≤ 10¹².', 'print(abs(int(input()))%10)', 'long long n;cin>>n;cout<<llabs(n)%10;', ['1234\n','-567\n','0\n','1000000000000\n','-1\n','890\n'],lambda s:abs(int(s))%10,['Ostatak','Apsolutna vrijednost','Negativan predznak nije cifra.'])
add('zbir-cifara',5,'Zbir svih cifara','Cifre',2,'Ispiši zbir decimalnih cifara apsolutne vrijednosti n.','Jedan cijeli broj n.','Zbir cifara. Ograničenja: −10¹² ≤ n ≤ 10¹².', 'n=abs(int(input())); print(sum(map(int,str(n))))', 'long long n;cin>>n;n=llabs(n);int s=0;while(n){s+=n%10;n/=10;}cout<<s;', ['5092\n','-123\n','0\n','999999999999\n','1000000000000\n','-909090\n'],lambda s:sum(map(int,str(abs(int(s))))),['Petlja','Cifre','Nakon ostatka podijeli broj sa 10.'])

add('parnost',6,'Paran ili neparan','Djeljivost',1,'Ispiši PARAN ako je n paran, inače NEPARAN.','Jedan cijeli broj n.','PARAN ili NEPARAN. Ograničenja: −10⁹ ≤ n ≤ 10⁹.', 'print("PARAN" if int(input())%2==0 else "NEPARAN")', 'long long n;cin>>n;cout<<(n%2==0?"PARAN":"NEPARAN");', ['12\n','7\n','0\n','-8\n','-9\n','1000000000\n'],lambda s:'PARAN' if int(s)%2==0 else 'NEPARAN',['Djeljivost sa 2','Nula je parna.'])
add('djeljivost',6,'Pravilo djeljivosti u programu','Djeljivost',1,'Za n i d ispiši DA ako je n djeljiv sa d, inače NE.','Jedan red: n d; d je iz skupa 2,4,5,6,9,10,15,25.','DA ili NE. Ograničenja: 0 ≤ n ≤ 10¹².', 'n,d=map(int,input().split()); print("DA" if n%d==0 else "NE")', 'long long n,d;cin>>n>>d;cout<<(n%d==0?"DA":"NE");', ['144 9\n','26 25\n','0 15\n','1000000000000 25\n','78 6\n','19 4\n','105 15\n','1230 10\n'],lambda s:'DA' if nums(s)[0]%nums(s)[1]==0 else 'NE',['Ostatak','Zadati djelilac','Ostatak nula znači djeljivost.'])
add('nzd',6,'Najveći zajednički djelilac','Teorija brojeva',2,'Izračunaj NZD(a,b). Važi NZD(0,b)=b i NZD(a,0)=a; oba broja nisu istovremeno nula.','Jedan red: a b.','NZD. Ograničenja: 0 ≤ a,b ≤ 10⁹.', 'a,b=map(int,input().split()); print(math.gcd(a,b))', 'long long a,b;cin>>a>>b;cout<<gcd(a,b);', ['18 24\n','17 13\n','0 19\n','21 0\n','1000000000 250000000\n','81 81\n'],lambda s:math.gcd(*nums(s)),['Euklidov algoritam','Ostatak','Ponavljaj zamjenu (a,b) sa (b,a%b).'])
add('nzs',6,'Najmanji zajednički sadržalac','Teorija brojeva',2,'Izračunaj NZS dva pozitivna broja.','Jedan red: a b.','NZS. Ograničenja: 1 ≤ a,b ≤ 10⁶.', 'a,b=map(int,input().split()); print(a//math.gcd(a,b)*b)', 'long long a,b;cin>>a>>b;cout<<a/gcd(a,b)*b;', ['6 8\n','5 7\n','1 1\n','1000000 999999\n','81 27\n','14 14\n'],lambda s:math.lcm(*nums(s)),['NZD','Dijeli prije množenja.'])
add('prost',6,'Prost ili složen broj','Teorija brojeva',2,'Ispiši PROST ako n ima tačno dva pozitivna djelioca, inače NIJE PROST. Brojevi 0 i 1 nisu prosti.','Jedan cijeli broj n.','PROST ili NIJE PROST. Ograničenja: 0 ≤ n ≤ 10⁹.', 'n=int(input()); ok=n>=2\nfor d in range(2,math.isqrt(n)+1):\n    if n%d==0: ok=False; break\nprint("PROST" if ok else "NIJE PROST")', 'long long n;cin>>n;bool ok=n>=2;for(long long d=2;d*d<=n;d++)if(n%d==0){ok=false;break;}cout<<(ok?"PROST":"NIJE PROST");', ['17\n','25\n','0\n','1\n','2\n','999983\n','999966000289\n'][:6],lambda s:'PROST' if int(s)>=2 and all(int(s)%d for d in range(2,math.isqrt(int(s))+1)) else 'NIJE PROST',['Definicija prostog broja','Provjeri do korijena.'])
add('broj-djelilaca',6,'Koliko broj ima djelilaca?','Teorija brojeva',3,'Izbroj sve pozitivne djelioce n, uključujući 1 i n.','Jedan pozitivan cijeli broj n.','Broj djelilaca. Ograničenja: 1 ≤ n ≤ 10⁹.', 'n=int(input()); total=0\nfor d in range(1,math.isqrt(n)+1):\n    if n%d==0: total+=1 if d*d==n else 2\nprint(total)', 'long long n;cin>>n;int ans=0;for(long long d=1;d*d<=n;d++)if(n%d==0)ans+=(d*d==n?1:2);cout<<ans;', ['12\n','16\n','1\n','999983\n','1000000000\n','49\n'],lambda s:sum(1 if d*d==int(s) else 2 for d in range(1,math.isqrt(int(s))+1) if int(s)%d==0),['Parovi djelilaca','Kvadrat ima srednji djelilac samo jednom.'])
add('skrati-razlomak',6,'Skrati razlomak','Teorija brojeva',2,'Razlomak a/b skrati do neskrativog oblika. Nazivnik ostaje pozitivan; za nulti brojnik rezultat je 0 1.','Jedan red: a b.','Dva broja: skraćeni brojnik nazivnik. Ograničenja: |a| ≤ 10⁹; 1 ≤ b ≤ 10⁹.', 'a,b=map(int,input().split()); g=math.gcd(a,b); print(a//g,b//g)', 'long long a,b;cin>>a>>b;long long g=gcd(llabs(a),b);cout<<a/g<<" "<<b/g;', ['18 24\n','-6 9\n','0 17\n','1 999983\n','1000000000 1000000000\n','-21 7\n'],lambda s:f'{nums(s)[0]//math.gcd(*nums(s))} {nums(s)[1]//math.gcd(*nums(s))}',['NZD','Brojnik','Nazivnik'])
add('prestupna',6,'Prestupna godina','Grananje',2,'Godina je prestupna ako je djeljiva sa 400, ili je djeljiva sa 4 a nije sa 100. Ispiši DA ili NE.','Jedna godina g.','DA ili NE. Ograničenja: 1 ≤ g ≤ 9999.', 'g=int(input()); print("DA" if g%400==0 or (g%4==0 and g%100!=0) else "NE")', 'int g;cin>>g;cout<<((g%400==0||(g%4==0&&g%100!=0))?"DA":"NE");', ['2024\n','2023\n','1900\n','2000\n','1\n','2400\n'],lambda s:'DA' if int(s)%400==0 or(int(s)%4==0 and int(s)%100!=0) else 'NE',['Logički operatori','Izuzetak za stoljeća'])
add('zbir-do-n',6,'Zbir od 1 do n','Petlje',1,'Izračunaj 1+2+…+n. Za n=0 zbir je 0.','Jedan nenegativan cijeli broj n.','Zbir. Ograničenja: 0 ≤ n ≤ 10⁹.', 'n=int(input()); print(n*(n+1)//2)', 'long long n;cin>>n;cout<<n*(n+1)/2;', ['5\n','10\n','0\n','1\n','1000000000\n','999999999\n'],lambda s:int(s)*(int(s)+1)//2,['Aritmetički zbir','Formula','Koristi 64-bitni tip u C/C++/Javi.'])
add('zbir-interval',6,'Zbir cijelog intervala','Petlje',2,'Saberi sve cijele brojeve od a do b, uključujući granice.','Jedan red: a b, gdje je a ≤ b.','Zbir. Ograničenja: −10⁶ ≤ a ≤ b ≤ 10⁶.', 'a,b=map(int,input().split()); print((a+b)*(b-a+1)//2)', 'long long a,b;cin>>a>>b;cout<<(a+b)*(b-a+1)/2;', ['3 7\n','-3 2\n','0 0\n','-1000000 1000000\n','-9 -9\n','1 1000000\n'],lambda s:sum(range(nums(s)[0],nums(s)[1]+1)),['Interval','Broj članova','Granice su uključene.'])
add('zbir-umnozaka',6,'Zbir prvih višekratnika','Petlje',2,'Izračunaj k+2k+…+nk. Za n=0 ispiši 0.','Jedan red: n k.','Zbir. Ograničenja: 0 ≤ n ≤ 10⁶; −10⁶ ≤ k ≤ 10⁶.', 'n,k=map(int,input().split()); print(k*n*(n+1)//2)', 'long long n,k;cin>>n>>k;cout<<k*n*(n+1)/2;', ['4 3\n','3 -2\n','0 7\n','1000000 1000000\n','9 0\n','1 -1000000\n'],lambda s:nums(s)[1]*nums(s)[0]*(nums(s)[0]+1)//2,['Višekratnici','Zbir','Predznak k mijenja predznak zbira.'])

arrsets=[[4,1,7],[-5,9,-2,0],[0],[-1000000000,1000000000], [2,2,2,2],list(range(1,101))]
add('niz-zbir',7,'Zbir elemenata niza','Nizovi',1,'Izračunaj zbir svih elemenata niza.','Prvi red n, drugi red n cijelih brojeva.','Zbir. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.', 'n=int(input()); a=list(map(int,sys.stdin.read().split())); print(sum(a))', 'int n;cin>>n;long long s=0,x;while(n--){cin>>x;s+=x;}cout<<s;',list(map(linearr,arrsets)),lambda s:sum(ar(s)),['Niz','Akumulator','Počni zbir od nule.'])
add('prvi-maksimum',7,'Položaj prvog maksimuma','Nizovi',2,'Ispiši najveću vrijednost i položaj njenog prvog pojavljivanja. Položaji počinju od 1.','Prvi red n, drugi red n cijelih brojeva.','Maksimum i prvi položaj. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.', 'n=int(input()); a=list(map(int,sys.stdin.read().split())); m=max(a); print(m,a.index(m)+1)', 'int n;cin>>n;long long x,m;int p=1;cin>>m;for(int i=2;i<=n;i++){cin>>x;if(x>m){m=x;p=i;}}cout<<m<<" "<<p;',list(map(linearr,arrsets)),lambda s:f'{max(ar(s))} {ar(s).index(max(ar(s)))+1}',['Indeksiranje','Jednake vrijednosti','Mijenjaj položaj samo za strogo veću vrijednost.'])
add('iznad-prosjeka',7,'Koliko vrijednosti je iznad prosjeka?','Nizovi',2,'Izbroj elemente strogo veće od aritmetičke sredine cijelog niza.','Prvi red n, drugi red n brojeva.','Broj elemenata. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.', 'n=int(input()); a=list(map(int,sys.stdin.read().split())); s=sum(a); print(sum(x*n>s for x in a))', 'int n;cin>>n;vector<long long>a(n);long long s=0;for(auto&x:a){cin>>x;s+=x;}int c=0;for(auto x:a)if(x*n>s)c++;cout<<c;',list(map(linearr,arrsets)),lambda s:sum(x*len(ar(s))>sum(ar(s)) for x in ar(s)),['Prosjek','Preciznost','Poredi x·n sa zbirom da izbjegneš decimalnu grešku.'])
add('predznaci',7,'Negativni, nule i pozitivni','Nizovi',1,'Izbroj negativne elemente, nule i pozitivne elemente.','Prvi red n, drugi red n brojeva.','Tri broja: negativni nule pozitivni. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.', 'n=int(input()); a=list(map(int,sys.stdin.read().split())); print(sum(x<0 for x in a),a.count(0),sum(x>0 for x in a))', 'int n;cin>>n;int neg=0,z=0,pos=0;long long x;while(n--){cin>>x;if(x<0)neg++;else if(x==0)z++;else pos++;}cout<<neg<<" "<<z<<" "<<pos;',list(map(linearr,arrsets)),lambda s:f'{sum(x<0 for x in ar(s))} {ar(s).count(0)} {sum(x>0 for x in ar(s))}',['Tri grane','Brojači','Nula pripada svojoj grupi.'])
add('obrni-niz',7,'Obrni redoslijed niza','Nizovi',1,'Ispiši sve elemente niza od posljednjeg prema prvom.','Prvi red n, drugi red n brojeva.','Obrnuti niz. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.', 'n=int(input()); a=list(map(int,sys.stdin.read().split())); print(*a[::-1])', 'int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;for(int i=n-1;i>=0;i--)cout<<a[i]<<" ";',list(map(linearr,arrsets)),lambda s:' '.join(map(str,ar(s)[::-1])),['Indeksi','Obrnuta petlja','Posljednji indeks je n−1.'])
add('razliciti',7,'Različite vrijednosti u poretku','Nizovi',2,'Ispiši broj različitih vrijednosti, a u narednom redu same različite vrijednosti u rastućem poretku.','Prvi red n, drugi red n brojeva.','Broj različitih vrijednosti i poredane vrijednosti. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.', 'n=int(input()); a=sorted(set(map(int,sys.stdin.read().split()))); print(len(a)); print(*a)', 'int n;cin>>n;set<long long>s;long long x;while(n--){cin>>x;s.insert(x);}cout<<s.size()<<"\n";for(auto x:s)cout<<x<<" ";',list(map(linearr,arrsets)),lambda s:f'{len(set(ar(s)))}\n'+ ' '.join(map(str,sorted(set(ar(s))))),['Skup','Sortiranje','Svaku vrijednost ispiši jednom.'])
prefixcases=['5 3\n2 -1 4 0 3\n1 5\n2 4\n3 3\n','1 2\n7\n1 1\n1 1\n','4 2\n-4 -3 -2 -1\n1 4\n2 3\n','3 2\n0 0 0\n1 3\n2 2\n','4 2\n1000000000 1000000000 -1000000000 5\n1 2\n1 4\n','6 3\n1 2 3 4 5 6\n6 6\n1 1\n2 5\n']
def prefix(s):
 v=nums(s);n,q=v[:2];a=v[2:2+n];p=v[2+n:];return '\n'.join(str(sum(a[p[2*i]-1:p[2*i+1]]))for i in range(q))
add('prefiks',7,'Zbir intervala pomoću prefiksa','Nizovi',3,'Odgovori na q upita: koliki je zbir elemenata od položaja l do r, uključujući oba?','Prvi red n q, drugi red niz; zatim q redova l r.','Za svaki upit jedan zbir. Ograničenja: 1 ≤ n,q ≤ 10⁴; 1 ≤ l ≤ r ≤ n; |aᵢ| ≤ 10⁹.', 'v=list(map(int,sys.stdin.read().split())); n,q=v[:2]; p=[0]\nfor x in v[2:2+n]: p.append(p[-1]+x)\nfor i in range(q):\n    l,r=v[2+n+2*i:4+n+2*i]; print(p[r]-p[l-1])', 'int n,q;cin>>n>>q;vector<long long>p(n+1);for(int i=1;i<=n;i++){long long x;cin>>x;p[i]=p[i-1]+x;}while(q--){int l,r;cin>>l>>r;cout<<p[r]-p[l-1]<<"\n";}',prefixcases,prefix,['Prefiksni zbir','Interval','Prazan prefiks na položaju 0 ima zbir 0.'])
def incr(s):
 a=ar(s);best=cur=1
 for i in range(1,len(a)):cur=cur+1 if a[i]>a[i-1] else 1;best=max(best,cur)
 return best
add('rastuci-segment',7,'Najduži rastući uzastopni segment','Nizovi',3,'Nađi dužinu najdužeg uzastopnog dijela niza u kojem je svaki naredni broj strogo veći od prethodnog.','Prvi red n; drugi red niz.','Dužina segmenta. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.', 'n=int(input()); a=list(map(int,sys.stdin.read().split())); best=cur=1\nfor i in range(1,n):\n    cur=cur+1 if a[i]>a[i-1] else 1; best=max(best,cur)\nprint(best)', 'int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int best=1,cur=1;for(int i=1;i<n;i++){cur=a[i]>a[i-1]?cur+1:1;best=max(best,cur);}cout<<best;',list(map(linearr,[[1,2,3,1,2], [5,4,3], [7],[2,2,2],[-3,-2,-1,0,1],[4,5,1,2,3,4,0]])),incr,['Uzastopni segment','Strogo rastuće','Prekid segmenta vraća tekuću dužinu na 1.'])
matcases=['2\n1 2\n3 4\n','3\n1 2 3\n4 5 6\n7 8 9\n','1\n-8\n','2\n0 0\n0 0\n','3\n-5 0 2\n4 -6 8\n1 2 -7\n','4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16\n']
def diag(s):
 v=nums(s);n=v[0];a=v[1:];return f'{sum(a[i*n+i]for i in range(n))} {sum(a[i*n+n-1-i]for i in range(n))}'
add('dijagonale',7,'Dvije dijagonale matrice','Matrice',2,'Odvojeno izračunaj zbir glavne i sporedne dijagonale kvadratne matrice. Srednji element, ako postoji, ulazi u oba zbira.','Prvi red n; zatim n redova od po n brojeva.','Zbir glavne i zbir sporedne dijagonale. Ograničenja: 1 ≤ n ≤ 100; |element| ≤ 10⁶.', 'n=int(input()); a=[list(map(int,input().split())) for _ in range(n)]; print(sum(a[i][i] for i in range(n)),sum(a[i][n-1-i] for i in range(n)))', 'int n;cin>>n;long long d=0,s=0,x;for(int i=0;i<n;i++)for(int j=0;j<n;j++){cin>>x;if(i==j)d+=x;if(i+j==n-1)s+=x;}cout<<d<<" "<<s;',matcases,diag,['Matrica','Indeksi','Glavna: i=j; sporedna: i+j=n−1.'])
transcases=['2 3\n1 2 3\n4 5 6\n','3 1\n7\n8\n9\n','1 1\n0\n','1 4\n-1 -2 -3 -4\n','2 2\n5 5\n5 5\n','3 2\n1 -2\n3 -4\n5 -6\n']
def trans(s):
 v=nums(s);r,c=v[:2];a=v[2:];return '\n'.join(' '.join(str(a[i*c+j]) for i in range(r))for j in range(c))
add('transponuj',7,'Transponuj pravougaonu matricu','Matrice',3,'Zamijeni redove i kolone matrice.','Prvi red r c; zatim r redova s po c elemenata.','c redova s po r elemenata. Ograničenja: 1 ≤ r,c ≤ 100; |element| ≤ 10⁶.', 'r,c=map(int,input().split()); a=[list(map(int,input().split()))for _ in range(r)]\nfor j in range(c): print(*(a[i][j]for i in range(r)))', 'int r,c;cin>>r>>c;vector<vector<long long>>a(r,vector<long long>(c));for(auto&row:a)for(auto&x:row)cin>>x;for(int j=0;j<c;j++){for(int i=0;i<r;i++)cout<<a[i][j]<<" ";cout<<"\n";}',transcases,trans,['Redovi','Kolone','Izlazna matrica ima c redova.'])
rotcases=['5 2\n1 2 3 4 5\n','3 1\n7 8 9\n','1 999\n-4\n','4 0\n1 2 3 4\n','4 8\n4 3 2 1\n','5 1000000000\n-5 0 2 2 8\n']
def rot(s):
 v=nums(s);n,k=v[:2];a=v[2:];k%=n;return ' '.join(map(str,a[-k:]+a[:-k] if k else a))
add('rotacija',7,'Kružna rotacija niza udesno','Nizovi',3,'Rotiraj niz k položaja udesno: posljednji elementi prelaze na početak.','Prvi red n k; drugi red n brojeva.','Rotirani niz. Ograničenja: 1 ≤ n ≤ 10⁴; 0 ≤ k ≤ 10⁹; |aᵢ| ≤ 10⁹.', 'n,k=map(int,input().split()); a=list(map(int,sys.stdin.read().split())); k%=n; print(*(a[-k:]+a[:-k] if k else a))', 'int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;k%=n;for(int i=0;i<n;i++)cout<<a[(i+n-k)%n]<<" ";',rotcases,rot,['Modulo','Rotacija','Prvo svedi k na ostatak pri dijeljenju sa n.'])

add('palindrom',8,'Palindromski zapis','Stringovi',2,'Riječ sastavljena od malih slova a–z je palindrom ako se jednako čita s obje strane. Ispiši DA ili NE.','Jedna neprazna riječ, bez razmaka.','DA ili NE. Ograničenja: do 10⁴ znakova.', 's=input().strip(); print("DA" if s==s[::-1] else "NE")', 'string s;cin>>s;string r=s;reverse(r.begin(),r.end());cout<<(s==r?"DA":"NE");', ['radar\n','skola\n','a\n','aa\n','ab\n','abccba\n'],lambda s:'DA' if s.strip()==s.strip()[::-1] else 'NE',['Dva pokazivača','Simetrija'])
add('frekvencija',8,'Najčešće slovo','Stringovi',2,'Nađi najčešće slovo riječi. Ako više slova ima isti najveći broj pojavljivanja, izaberi abecedno najmanje.','Jedna neprazna riječ od slova a–z.','Slovo i broj pojavljivanja. Ograničenja: dužina do 10⁴.', 's=input().strip(); c=Counter(s); m=max(c.values()); ch=min(k for k in c if c[k]==m); print(ch,m)', 'string s;cin>>s;int c[26]={};for(char x:s)c[x-\'a\']++;int p=0;for(int i=1;i<26;i++)if(c[i]>c[p])p=i;cout<<char(\'a\'+p)<<" "<<c[p];', ['banana\n','cabb\n','z\n','zyx\n','aaaaa\n','abccba\n'],lambda s:f'{min(k for k,v in collections.Counter(s.strip()).items()if v==max(collections.Counter(s.strip()).values()))} {max(collections.Counter(s.strip()).values())}',['Brojanje','Pravilo izjednačenja','Prođi slova od a prema z.'])
add('rijeci',8,'Brojanje riječi u redu','Stringovi',2,'Riječ je maksimalan niz slova između razmaka. Izbroj riječi; red može imati višestruke, vodeće i završne razmake ili biti prazan.','Jedan red malih slova a–z i običnih razmaka.','Broj riječi. Ograničenja: red do 10⁴ znakova.', 'print(len(sys.stdin.readline().split()))', 'string s;getline(cin,s);stringstream ss(s);string w;int n=0;while(ss>>w)n++;cout<<n;', ['ucimo programiranje danas\n','  jedan   dva  \n','\n','       \n','rijec\n','a b c d e\n'],lambda s:len(s.split()),['Cijeli red','Razmaci','Prazan red ima nula riječi.'])
def runs(s):return ' '.join(f'{k}:{len(list(g))}'for k,g in itertools.groupby(s.strip()))
add('rle',8,'Sažimanje uzastopnih slova','Stringovi',3,'Svaki uzastopni blok jednakih slova zamijeni zapisom slovo:broj. Blokove odvoji razmakom.','Jedna neprazna riječ od slova a–z.','Blokovi, npr. a:3 b:2. Ograničenja: do 10⁴ slova.', 's=input().strip(); parts=[]; i=0\nwhile i<len(s):\n    j=i+1\n    while j<len(s) and s[j]==s[i]: j+=1\n    parts.append(s[i]+":"+str(j-i)); i=j\nprint(" ".join(parts))', 'string s;cin>>s;for(int i=0;i<(int)s.size();){int j=i+1;while(j<(int)s.size()&&s[j]==s[i])j++;cout<<s[i]<<":"<<j-i<<" ";i=j;}', ['aaabbc\n','ababa\n','a\n','zzzzzzzzzz\n','aabbbaa\n','xyzzzyx\n'],runs,['Uzastopni blokovi','Petlja','Isto slovo kasnije može činiti novi blok.'])
add('binarni-decimalni',8,'Iz binarnog u decimalni sistem','Brojevni sistemi',2,'Pretvori binarni zapis u decimalni broj. Vodeće nule su dozvoljene.','Jedan niz znakova 0 i 1.','Decimalni broj. Ograničenja: od 1 do 30 binarnih cifara.', 'print(int(input().strip(),2))', 'string s;cin>>s;long long n=0;for(char c:s)n=n*2+(c-\'0\');cout<<n;', ['1011\n','00101\n','0\n','1\n','111111111111111111111111111111\n','100000000000000000000000000000\n'],lambda s:int(s.strip(),2),['Pozicioni sistem','Hornerov postupak','Svaki novi bit: n=2n+bit.'])
def base(s):
 n,b=nums(s);d='0123456789ABCDEF';r=''
 while n:r=d[n%b]+r;n//=b
 return r or '0'
add('decimalni-baza',8,'Decimalni broj u bazu 2–16','Brojevni sistemi',3,'Pretvori n u bazu b. Za cifre veće od 9 koristi velika slova A–F. Nula se zapisuje kao 0.','Jedan red: n b.','Zapis bez vodećih nula. Ograničenja: 0 ≤ n ≤ 10¹²; 2 ≤ b ≤ 16.', 'n,b=map(int,input().split()); d="0123456789ABCDEF"; s=""\nwhile n: s=d[n%b]+s; n//=b\nprint(s or "0")', 'long long n;int b;cin>>n>>b;string d="0123456789ABCDEF",s;do{s+=d[n%b];n/=b;}while(n);reverse(s.begin(),s.end());cout<<s;', ['255 16\n','83 8\n','0 2\n','1 16\n','1000000000000 2\n','123456789 7\n'],base,['Dijeljenje s ostatkom','Baze','Ostatke pročitaj obrnutim redom.'])
def brackets(s):
 bal=0
 for c in s.strip():
  bal+=1 if c=='(' else -1
  if bal<0:return 'NE'
 return 'DA' if bal==0 else 'NE'
add('zagrade',8,'Ispravno uparene zagrade','Stringovi',3,'Niz se sastoji samo od ( i ). Ispiši DA ako je svaka otvorena zagrada ispravno zatvorena, inače NE. Prazan niz je ispravan.','Jedan red zagrada, koji može biti prazan.','DA ili NE. Ograničenja: do 10⁴ zagrada.', 's=sys.stdin.readline().strip(); bal=0; ok=True\nfor c in s:\n    bal+=1 if c=="(" else -1\n    if bal<0: ok=False\nprint("DA" if ok and bal==0 else "NE")', 'string s;getline(cin,s);int bal=0;bool ok=true;for(char c:s){bal+=c==\'(\'?1:-1;if(bal<0)ok=false;}cout<<(ok&&bal==0?"DA":"NE");', ['(())()\n','())(\n','\n',')(()\n','((((\n','()()()\n'],brackets,['Bilans','Redoslijed','Bilans ne smije postati negativan.'])
add('anagram',8,'Dvije riječi — isti skup slova?','Stringovi',2,'Riječi su anagrami ako svako slovo imaju isti broj puta. Ispiši DA ili NE.','Dva reda, svaki jedna neprazna riječ od slova a–z.','DA ili NE. Ograničenja: svaka riječ do 10⁴ znakova.', 'a=input().strip(); b=input().strip(); print("DA" if Counter(a)==Counter(b) else "NE")', 'string a,b;cin>>a>>b;sort(a.begin(),a.end());sort(b.begin(),b.end());cout<<(a==b?"DA":"NE");', ['slika\nklisa\n','ana\nan\n','a\na\n','ab\nac\n','aabb\nbbaa\n','aaa\naaab\n'],lambda s:'DA' if collections.Counter(s.split()[0])==collections.Counter(s.split()[1]) else 'NE',['Brojanje slova','Sortiranje','Broj ponavljanja je važan.'])
mergecases=['3 4\n1 4 8\n2 4 6 9\n','1 1\n5\n5\n','0 3\n\n-2 0 7\n','3 0\n1 2 3\n\n','0 0\n\n\n','4 3\n-5 -3 0 9\n-8 0 10\n']
add('spajanje',8,'Spoji dva uređena niza','Pretraga i sortiranje',3,'Spoji dva neopadajuće uređena niza u jedan neopadajući niz. Zadrži sva ponavljanja.','Prvi red n m; drugi red n brojeva; treći red m brojeva. Prazan niz ima prazan red.','Uređeni spojeni niz; ako su oba prazna, prazan red. Ograničenja: 0 ≤ n,m ≤ 10⁴; |element| ≤ 10⁹.', 'v=list(map(int,sys.stdin.read().split())); n,m=v[:2]; a=v[2:2+n]; b=v[2+n:]; i=j=0; out=[]\nwhile i<n and j<m:\n    if a[i]<=b[j]: out.append(a[i]); i+=1\n    else: out.append(b[j]); j+=1\nprint(*(out+a[i:]+b[j:]))', 'int n,m;cin>>n>>m;vector<long long>a(n),b(m);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;int i=0,j=0;while(i<n&&j<m){if(a[i]<=b[j])cout<<a[i++]<<" ";else cout<<b[j++]<<" ";}while(i<n)cout<<a[i++]<<" ";while(j<m)cout<<b[j++]<<" ";cout<<"\n";',mergecases,lambda s:' '.join(map(str,sorted(nums(s)[2:]))),['Dva pokazivača','Prazni nizovi','Manji sljedeći element prelazi u izlaz.'])
searchcases=['5 4\n1 3 3 7 9\n3 4 1 9\n','1 3\n0\n0 -1 1\n','4 3\n-8 -5 -5 -2\n-5 -9 0\n','3 2\n2 2 2\n2 3\n','0 2\n\n1 0\n','6 4\n1 2 3 4 5 6\n6 7 1 4\n']
def search(s):
 v=nums(s);n,q=v[:2];a=v[2:2+n];return '\n'.join(str(a.index(x)+1 if x in a else 0)for x in v[2+n:])
add('binarna-pretraga',8,'Prvi položaj u uređenom nizu','Pretraga i sortiranje',3,'Za svaki upit x ispiši položaj prvog pojavljivanja x u uređenom nizu, ili 0 ako ga nema. Položaji počinju od 1.','Prvi red n q; drugi red n uređenih brojeva; treći red q upita.','Za svaki upit položaj u posebnom redu. Ograničenja: 0 ≤ n ≤ 10⁴; 1 ≤ q ≤ 10⁴; |broj| ≤ 10⁹.', 'import bisect\nv=list(map(int,sys.stdin.read().split())); n,q=v[:2]; a=v[2:2+n]\nfor x in v[2+n:]:\n    p=bisect.bisect_left(a,x); print(p+1 if p<n and a[p]==x else 0)', 'int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){long long x;cin>>x;auto it=lower_bound(a.begin(),a.end(),x);cout<<(it!=a.end()&&*it==x?it-a.begin()+1:0)<<"\n";}',searchcases,search,['Binarna pretraga','Prvi položaj','Koristi lijevu granicu.'])
def depth(s):
 if brackets(s)!='DA':return -1
 bal=best=0
 for c in s.strip():bal+=1 if c=='(' else -1;best=max(best,bal)
 return best
add('dubina-zagrada',8,'Dubina ugniježđenih zagrada','Stringovi',3,'Za ispravan niz zagrada ispiši najveći broj istovremeno otvorenih zagrada. Za neispravan niz ispiši −1. Prazan niz ima dubinu 0.','Jedan red znakova ( i ), koji može biti prazan.','Dubina ili −1. Ograničenja: do 10⁴ znakova.', 's=sys.stdin.readline().strip(); bal=best=0; ok=True\nfor c in s:\n    bal+=1 if c=="(" else -1; best=max(best,bal)\n    if bal<0: ok=False\nprint(best if ok and bal==0 else -1)', 'string s;getline(cin,s);int bal=0,best=0;bool ok=true;for(char c:s){bal+=c==\'(\'?1:-1;best=max(best,bal);if(bal<0)ok=false;}cout<<(ok&&bal==0?best:-1);', ['(()(()))\n','()()\n','\n',')(()\n','(((\n','(((())))\n'],depth,['Bilans','Maksimum','Provjeri ispravnost prije konačnog rezultata.'])

graphcases=['4 4 1 4\n1 2\n2 4\n1 3\n3 4\n','4 2 1 4\n1 2\n3 4\n','1 0 1 1\n','3 3 2 3\n1 2\n2 3\n1 3\n','5 4 1 5\n1 2\n2 3\n3 4\n4 5\n','4 4 1 3\n1 2\n1 2\n2 3\n3 4\n']
def bfs(s):
 v=nums(s);n,m,st,t=v[:4];a=[[]for _ in range(n+1)]
 for i in range(m):u,w=v[4+2*i:6+2*i];a[u].append(w);a[w].append(u)
 d=[-1]*(n+1);d[st]=0;q=collections.deque([st])
 while q:
  u=q.popleft()
  for w in a[u]:
   if d[w]<0:d[w]=d[u]+1;q.append(w)
 return d[t]
add('bfs',9,'Najkraći put bez težina','Grafovi',4,'U neusmjerenom grafu nađi najmanji broj grana od s do t. Ako put ne postoji, ispiši −1. Vrhovi su 1…n.','Prvi red n m s t; zatim m redova u v.','Dužina najkraćeg puta ili −1. Ograničenja: 1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000; 1 ≤ u,v,s,t ≤ n.', 'v=list(map(int,sys.stdin.read().split())); n,m,s,t=v[:4]; a=[[]for _ in range(n+1)]\nfor i in range(m):\n    u,w=v[4+2*i:6+2*i]; a[u].append(w); a[w].append(u)\nd=[-1]*(n+1); d[s]=0; q=deque([s])\nwhile q:\n    u=q.popleft()\n    for w in a[u]:\n        if d[w]<0: d[w]=d[u]+1; q.append(w)\nprint(d[t])', 'int n,m,s,t;cin>>n>>m>>s>>t;vector<vector<int>>a(n+1);while(m--){int u,v;cin>>u>>v;a[u].push_back(v);a[v].push_back(u);}vector<int>d(n+1,-1);queue<int>q;q.push(s);d[s]=0;while(!q.empty()){int u=q.front();q.pop();for(int v:a[u])if(d[v]<0){d[v]=d[u]+1;q.push(v);}}cout<<d[t];',graphcases,bfs,['Graf','BFS','Red održava redoslijed udaljenosti.'])
componentcases=['5 2\n1 2\n3 4\n','3 2\n1 2\n2 3\n','1 0\n','5 0\n','4 4\n1 2\n2 3\n3 4\n4 1\n','4 3\n1 1\n2 3\n2 3\n']
def components(s):
 v=nums(s);n,m=v[:2];a=[[]for _ in range(n+1)]
 for i in range(m):u,w=v[2+2*i:4+2*i];a[u].append(w);a[w].append(u)
 seen=set();c=0
 for st in range(1,n+1):
  if st in seen:continue
  c+=1;seen.add(st);q=[st]
  while q:
   u=q.pop()
   for w in a[u]:
    if w not in seen:seen.add(w);q.append(w)
 return c
add('komponente',9,'Povezane komponente grafa','Grafovi',4,'Izbroj povezane komponente neusmjerenog grafa. Izolovan vrh čini jednu komponentu.','Prvi red n m; zatim m redova u v.','Broj komponenti. Ograničenja: 1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000.', 'v=list(map(int,sys.stdin.read().split())); n,m=v[:2]; a=[[]for _ in range(n+1)]\nfor i in range(m):\n    u,w=v[2+2*i:4+2*i]; a[u].append(w); a[w].append(u)\nseen=set(); count=0\nfor s in range(1,n+1):\n    if s in seen: continue\n    count+=1; seen.add(s); stack=[s]\n    while stack:\n        u=stack.pop()\n        for w in a[u]:\n            if w not in seen: seen.add(w); stack.append(w)\nprint(count)', 'int n,m;cin>>n>>m;vector<vector<int>>a(n+1);while(m--){int u,v;cin>>u>>v;a[u].push_back(v);a[v].push_back(u);}vector<bool>seen(n+1);int c=0;for(int s=1;s<=n;s++)if(!seen[s]){c++;vector<int>q{s};seen[s]=true;while(!q.empty()){int u=q.back();q.pop_back();for(int v:a[u])if(!seen[v]){seen[v]=true;q.push_back(v);}}}cout<<c;',componentcases,components,['DFS ili BFS','Posjećenost','Pokreni obilazak iz svakog neposjećenog vrha.'])
weightcases=['4 4 1 4\n1 2 3\n2 4 4\n1 3 10\n3 4 1\n','3 1 1 3\n1 2 5\n','1 0 1 1\n','3 3 1 3\n1 2 0\n2 3 0\n1 3 9\n','3 3 1 3\n1 2 1000000000\n2 3 1000000000\n1 3 3000000000\n','4 5 1 4\n1 2 20\n1 3 1\n3 2 1\n2 4 1\n3 4 50\n']
def dijkstra(s):
 v=nums(s);n,m,st,t=v[:4];a=[[]for _ in range(n+1)]
 for i in range(m):u,w,z=v[4+3*i:7+3*i];a[u].append((w,z));a[w].append((u,z))
 d=[math.inf]*(n+1);d[st]=0;q=[(0,st)]
 while q:
  val,u=heapq.heappop(q)
  if val!=d[u]:continue
  for w,z in a[u]:
   if val+z<d[w]:d[w]=val+z;heapq.heappush(q,(d[w],w))
 return -1 if d[t]==math.inf else d[t]
add('dijkstra',9,'Najjeftinija ruta','Grafovi',5,'U neusmjerenom grafu s nenegativnim težinama nađi najmanji zbir težina od s do t. Za nedostižan cilj ispiši −1.','Prvi red n m s t; zatim m redova u v težina.','Minimalna cijena ili −1. Ograničenja: 1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000; 0 ≤ težina ≤ 10¹⁰.', 'v=list(map(int,sys.stdin.read().split())); n,m,s,t=v[:4]; a=[[]for _ in range(n+1)]\nfor i in range(m):\n    u,w,z=v[4+3*i:7+3*i]; a[u].append((w,z)); a[w].append((u,z))\nd=[math.inf]*(n+1); d[s]=0; pq=[(0,s)]\nwhile pq:\n    val,u=heapq.heappop(pq)\n    if val!=d[u]: continue\n    for w,z in a[u]:\n        if val+z<d[w]: d[w]=val+z; heapq.heappush(pq,(d[w],w))\nprint(-1 if d[t]==math.inf else d[t])', 'int n,m,s,t;cin>>n>>m>>s>>t;vector<vector<pair<int,long long>>>a(n+1);while(m--){int u,v;long long w;cin>>u>>v>>w;a[u].push_back({v,w});a[v].push_back({u,w});}const long long INF=LLONG_MAX/4;vector<long long>d(n+1,INF);priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<pair<long long,int>>>q;d[s]=0;q.push({0,s});while(!q.empty()){auto [val,u]=q.top();q.pop();if(val!=d[u])continue;for(auto [v,w]:a[u])if(val+w<d[v]){d[v]=val+w;q.push({d[v],v});}}cout<<(d[t]==INF?-1:d[t]);',weightcases,dijkstra,['Prioritetni red','Nenegativne težine','Preskoči zastarjeli zapis udaljenosti.'])
intervalcases=['4\n1 3\n2 4\n3 5\n5 8\n','3\n0 2\n2 4\n4 6\n','0\n','3\n1 10\n2 9\n3 8\n','4\n-5 -3\n-3 -1\n0 2\n-4 1\n','5\n1 2\n1 2\n2 3\n3 4\n1 5\n']
def intervals(s):
 v=nums(s);p=sorted(zip(v[1::2],v[2::2]),key=lambda p:(p[1],p[0]));last=-math.inf;n=0
 for st,en in p:
  if st>=last:n+=1;last=en
 return n
add('raspored',9,'Najviše termina bez preklapanja','Pohlepni algoritmi',4,'Izaberi najveći broj termina koji se ne preklapaju. Termin koji počinje tačno kad prethodni završava je dozvoljen.','Prvi red n; zatim n redova početak kraj, početak < kraj.','Najveći broj izabranih termina. Ograničenja: 0 ≤ n ≤ 10⁴; vremena od −10⁹ do 10⁹.', 'v=list(map(int,sys.stdin.read().split())); p=sorted(zip(v[1::2],v[2::2]),key=lambda x:(x[1],x[0])); last=-math.inf; count=0\nfor start,end in p:\n    if start>=last: count+=1; last=end\nprint(count)', 'int n;cin>>n;vector<pair<long long,long long>>a;while(n--){long long s,e;cin>>s>>e;a.push_back({e,s});}sort(a.begin(),a.end());long long last=LLONG_MIN;int c=0;for(auto [e,s]:a)if(s>=last){c++;last=e;}cout<<c;',intervalcases,intervals,['Sortiraj po završetku','Pohlepni izbor','Granica završetka može biti jednaka novom početku.'])
coincases=['3 11\n1 5 7\n','2 3\n2 4\n','1 0\n5\n','2 6\n1 3\n','3 6\n1 3 4\n','3 27\n2 7 10\n']
def coins(s):
 v=nums(s);n,target=v[:2];c=v[2:];dp=[0]+[10**9]*target
 for x in range(1,target+1):dp[x]=min([dp[x-z]+1 for z in c if z<=x]+[10**9])
 return -1 if dp[target]>=10**9 else dp[target]
add('kovanice',9,'Najmanje kovanica za iznos','Dinamičko programiranje',4,'Za zadate vrijednosti kovanica nađi najmanji broj kovanica za tačan iznos S. Svaka vrijednost dostupna je neograničeno. Ako nije moguće, ispiši −1.','Prvi red n S; drugi red n vrijednosti.','Najmanji broj kovanica ili −1. Ograničenja: 1 ≤ n ≤ 30; 0 ≤ S ≤ 10000; 1 ≤ vrijednost ≤ 10000.', 'v=list(map(int,sys.stdin.read().split())); n,S=v[:2]; c=v[2:]; inf=S+1; dp=[0]+[inf]*S\nfor x in range(1,S+1):\n    for z in c:\n        if z<=x: dp[x]=min(dp[x],dp[x-z]+1)\nprint(-1 if dp[S]>=inf else dp[S])', 'int n,S;cin>>n>>S;vector<int>c(n);for(auto&x:c)cin>>x;vector<int>dp(S+1,S+1);dp[0]=0;for(int x=1;x<=S;x++)for(int z:c)if(z<=x)dp[x]=min(dp[x],dp[x-z]+1);cout<<(dp[S]>S?-1:dp[S]);',coincases,coins,['Stanje dp[x]','Pohlepni izbor nije uvijek dovoljan.'])
def lis(s):
 a=ar(s);dp=[1]*len(a)
 for i in range(len(a)):
  for j in range(i):
   if a[j]<a[i]:dp[i]=max(dp[i],dp[j]+1)
 return max(dp,default=0)
add('lis',9,'Najduži rastući podniz','Dinamičko programiranje',5,'Izaberi što više elemenata u izvornom redoslijedu tako da vrijednosti strogo rastu. Izabrani elementi ne moraju biti susjedni.','Prvi red n; drugi red n brojeva.','Dužina najdužeg strogo rastućeg podniza. Ograničenja: 0 ≤ n ≤ 2000; |aᵢ| ≤ 10⁹.', 'import bisect\nn=int(input()); a=list(map(int,sys.stdin.read().split())); tail=[]\nfor x in a:\n    p=bisect.bisect_left(tail,x)\n    if p==len(tail): tail.append(x)\n    else: tail[p]=x\nprint(len(tail))', 'int n;cin>>n;vector<long long>t;while(n--){long long x;cin>>x;auto it=lower_bound(t.begin(),t.end(),x);if(it==t.end())t.push_back(x);else *it=x;}cout<<t.size();',list(map(linearr,[[3,1,2,5,4], [5,4,3,2],[],[7],[2,2,2,2],[-5,0,-2,1,8]])),lis,['Podniz','Strogo rastuće','Jednak broj ne produžava podniz.'])
bagcases=['3 5\n2 3\n3 4\n4 5\n','2 1\n2 9\n3 10\n','0 8\n','3 0\n1 3\n2 5\n3 7\n','3 4\n2 6\n2 6\n4 10\n','4 7\n3 4\n4 5\n2 3\n5 8\n']
def bag(s):
 v=nums(s);n,W=v[:2];dp=[0]*(W+1)
 for i in range(n):
  w,val=v[2+2*i:4+2*i]
  for cap in range(W,w-1,-1):dp[cap]=max(dp[cap],dp[cap-w]+val)
 return dp[W]
add('ruksak',9,'Ruksak — svaki predmet jednom','Dinamičko programiranje',5,'Odaberi predmete ukupne težine najviše W tako da zbir vrijednosti bude najveći. Svaki predmet možeš uzeti najviše jednom.','Prvi red n W; zatim n redova težina vrijednost.','Najveća vrijednost. Ograničenja: 0 ≤ n ≤ 100; 0 ≤ W ≤ 10000; 1 ≤ težina ≤ 10000; 0 ≤ vrijednost ≤ 10⁶.', 'v=list(map(int,sys.stdin.read().split())); n,W=v[:2]; dp=[0]*(W+1)\nfor i in range(n):\n    w,val=v[2+2*i:4+2*i]\n    for c in range(W,w-1,-1): dp[c]=max(dp[c],dp[c-w]+val)\nprint(dp[W])', 'int n,W;cin>>n>>W;vector<long long>dp(W+1);while(n--){int w;long long v;cin>>w>>v;for(int c=W;c>=w;c--)dp[c]=max(dp[c],dp[c-w]+v);}cout<<dp[W];',bagcases,bag,['0/1 ruksak','Obrnuta petlja','Kapacitet prolazi unazad da ne ponoviš predmet.'])
def primes(s):
 n=int(s);return ' '.join(str(x)for x in range(2,n+1)if all(x%d for d in range(2,math.isqrt(x)+1)))or '-'
add('sito',9,'Eratostenovo sito','Teorija brojeva',3,'Ispiši sve proste brojeve od 2 do n u rastućem poretku. Ako nema nijednog, ispiši znak -.','Jedan cijeli broj n.','Prosti brojevi ili -. Ograničenja: 0 ≤ n ≤ 100000.', 'n=int(input()); p=[True]*(n+1)\nif n>=0: p[0]=False\nif n>=1: p[1]=False\nfor d in range(2,math.isqrt(n)+1):\n    if p[d]:\n        for x in range(d*d,n+1,d): p[x]=False\na=[str(x)for x in range(2,n+1)if p[x]]; print(" ".join(a) or "-")', 'int n;cin>>n;vector<bool>p(n+1,true);p[0]=false;if(n>=1)p[1]=false;for(int d=2;d*d<=n;d++)if(p[d])for(int x=d*d;x<=n;x+=d)p[x]=false;bool any=false;for(int x=2;x<=n;x++)if(p[x]){cout<<x<<" ";any=true;}if(!any)cout<<"-";', ['20\n','5\n','0\n','1\n','2\n','1000\n'],primes,['Sito','Višekratnici','Počni označavanje od d².'])
sumcases=['5 5\n1 2 3 2 3\n','3 7\n1 1 1\n','1 8\n8\n','4 2\n1 1 1 1\n','5 6\n6 1 2 3 6\n','6 10\n2 3 5 4 6 10\n']
def subarray(s):
 v=nums(s);n,t=v[:2];a=v[2:];return sum(sum(a[i:j])==t for i in range(n)for j in range(i+1,n+1))
add('segment-zbir',9,'Koliko segmenata ima zadati zbir?','Dva pokazivača',4,'Niz sadrži samo pozitivne brojeve. Izbroj neprazne uzastopne segmente čiji je zbir tačno S.','Prvi red n S; drugi red n pozitivnih brojeva.','Broj segmenata. Ograničenja: 1 ≤ n ≤ 10⁴; 1 ≤ S ≤ 10⁹; 1 ≤ aᵢ ≤ 10⁹.', 'v=list(map(int,sys.stdin.read().split())); n,S=v[:2]; a=v[2:]; left=total=ans=0\nfor right,x in enumerate(a):\n    total+=x\n    while left<=right and total>S: total-=a[left]; left+=1\n    if total==S: ans+=1\nprint(ans)', 'int n;long long S;cin>>n>>S;vector<long long>a(n);for(auto&x:a)cin>>x;int l=0,ans=0;long long sum=0;for(int r=0;r<n;r++){sum+=a[r];while(l<=r&&sum>S)sum-=a[l++];if(sum==S)ans++;}cout<<ans;',sumcases,subarray,['Klizni prozor','Pozitivni brojevi','Povećanje lijeve granice smanjuje zbir.'])
gridcases=['3 3\n...\n.#.\n...\n','2 2\n..\n..\n','1 1\n.\n','1 1\n#\n','2 3\n#..\n...\n','3 3\n...\n###\n...\n']
def grid(s):
 rows=s.splitlines();r,c=map(int,rows[0].split());a=rows[1:];dp=[[0]*c for _ in range(r)]
 for i in range(r):
  for j in range(c):
   if a[i][j]=='#':continue
   dp[i][j]=1 if i==j==0 else ((dp[i-1][j] if i else 0)+(dp[i][j-1]if j else 0))%1000000007
 return dp[-1][-1]
add('putanje-mreza',9,'Putanje kroz mrežu s preprekama','Dinamičko programiranje',4,'Iz gornjeg lijevog polja do donjeg desnog kreći se samo desno ili dolje. Tačka je slobodno polje, # prepreka. Prebroj putanje modulo 1000000007.','Prvi red r c; zatim r redova od po c znakova . ili #.','Broj putanja modulo 1000000007. Ograničenja: 1 ≤ r,c ≤ 200.', 'r,c=map(int,input().split()); a=[input().strip()for _ in range(r)]; dp=[0]*c\nfor i in range(r):\n    for j in range(c):\n        if a[i][j]=="#": dp[j]=0\n        elif i==0 and j==0: dp[j]=1\n        else: dp[j]=(dp[j]+(dp[j-1]if j else 0))%1000000007\nprint(dp[-1])', 'int r,c;cin>>r>>c;vector<long long>dp(c);for(int i=0;i<r;i++){string s;cin>>s;for(int j=0;j<c;j++){if(s[j]==\'#\')dp[j]=0;else if(i==0&&j==0)dp[j]=1;else dp[j]=(dp[j]+(j?dp[j-1]:0))%1000000007;}}cout<<dp.back();',gridcases,grid,['Brojanje putanja','Prepreke','Prepreka ima nula dolaznih putanja.'])
topocases=['4 3\n1 3\n2 3\n3 4\n','3 3\n1 2\n2 3\n3 1\n','1 0\n','4 0\n','4 3\n4 2\n2 1\n4 3\n','3 3\n1 2\n1 2\n2 3\n']
def topo(s):
 v=nums(s);n,m=v[:2];a=[[]for _ in range(n+1)];deg=[0]*(n+1)
 for i in range(m):u,w=v[2+2*i:4+2*i];a[u].append(w);deg[w]+=1
 q=[x for x in range(1,n+1)if deg[x]==0];heapq.heapify(q);out=[]
 while q:
  u=heapq.heappop(q);out.append(u)
  for w in a[u]:
   deg[w]-=1
   if deg[w]==0:heapq.heappush(q,w)
 return ' '.join(map(str,out)) if len(out)==n else 'CIKLUS'
add('topoloski',9,'Redoslijed poslova s preduslovima','Grafovi',5,'Usmjerena grana u→v znači da posao u mora prethoditi poslu v. Ispiši leksikografski najmanji topološki poredak: svaki put izaberi najmanji raspoloživi broj. Ako postoji ciklus, ispiši CIKLUS.','Prvi red n m; zatim m redova u v.','Poredak svih vrhova ili CIKLUS. Ograničenja: 1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000.', 'v=list(map(int,sys.stdin.read().split())); n,m=v[:2]; a=[[]for _ in range(n+1)]; deg=[0]*(n+1)\nfor i in range(m):\n    u,w=v[2+2*i:4+2*i]; a[u].append(w); deg[w]+=1\nq=[x for x in range(1,n+1)if deg[x]==0]; heapq.heapify(q); out=[]\nwhile q:\n    u=heapq.heappop(q); out.append(u)\n    for w in a[u]:\n        deg[w]-=1\n        if deg[w]==0: heapq.heappush(q,w)\nprint(" ".join(map(str,out)) if len(out)==n else "CIKLUS")', 'int n,m;cin>>n>>m;vector<vector<int>>a(n+1);vector<int>deg(n+1);while(m--){int u,v;cin>>u>>v;a[u].push_back(v);deg[v]++;}priority_queue<int,vector<int>,greater<int>>q;for(int i=1;i<=n;i++)if(!deg[i])q.push(i);vector<int>out;while(!q.empty()){int u=q.top();q.pop();out.push_back(u);for(int v:a[u])if(--deg[v]==0)q.push(v);}if((int)out.size()!=n)cout<<"CIKLUS";else for(int x:out)cout<<x<<" ";',topocases,topo,['Usmjereni graf','Ulazni stepen','Prioritetni red daje jedinstven najmanji poredak.'])

assert len(tasks)==55
# Hidden cases deliberately remain in desktop code, never in public browser data.
pub=json.dumps(tasks,ensure_ascii=False,indent=2)
ROOT.joinpath('content/program-assessments.js').write_text("/* ELDI EDU: 55 originalnih praktičnih zadataka. Javni primjeri, bez skrivenih testova. */\n(function(root){'use strict';const tasks="+pub+";if(typeof module==='object'&&module.exports)module.exports=tasks;else root.ELDI_PROGRAM_ASSESSMENTS=tasks;})(typeof globalThis!=='undefined'?globalThis:this);\n")
ROOT.joinpath('desktop/program-assessment-data.cjs').write_text("'use strict';\n/* Privatni testovi i izvorna referentna rješenja; ne učitava se u renderer. */\nmodule.exports="+json.dumps(private,ensure_ascii=False,indent=2)+";\n")
print('Built',len(tasks),'tasks;',sum(len(x['tests'])for x in private.values()),'test cases')
