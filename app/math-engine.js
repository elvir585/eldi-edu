/* ELDI EDU 10.0 — offline mathematics, without eval or external dependencies.
 * Browser: window.EduMath. Node: require('./math-engine.js').
 *
 * parse(expression) -> Rational; evaluate(expression) -> {exact, decimal}.
 * Rational stores reduced BigInt n/d; add/sub/mul/div/pow/neg/abs/equals,
 * toString(), toDecimal(precision=12), toNumber(). Decimal comma is accepted.
 * Expressions: + - * / ^ ( ), × ÷ − :; exponent is an integer [-100,100].
 * gcd/lcm -> BigInt. divisibility -> [{divisor,divisible}].
 * isPrime: deterministic integer test up to 2^64-1; factorize up to 10^12.
 * convertBase(text, from, to) -> string; bases 2,8,10,16; signed integers.
 * solveLinear(a,b,c): ax+b=c -> {type:'unique',x,decimal}|{type:'none'|'infinite'}.
 * solveSystem(a,b,c,d,e,f): ax+by=c, dx+ey=f -> {type,x,y,determinant}.
 * percentOf(percent,total), percentage(part,whole) -> {exact,decimal}.
 * linearPoints(slope,intercept,[x,...]) -> [{x,y,decimalX,decimalY}].
 * geometry(shape,dimensions) -> {shape,results:[{label,value,unit,formula}]}.
 * Shapes / dimension keys: rectangle{a,b}; square{a}; triangle{a,h,b?,c?};
 * circle{r}; cuboid{a,b,c}; cube{a}; prism{baseArea,basePerimeter,h};
 * pyramid{baseArea,h,lateralArea?}; cylinder{r,h}; cone{r,h}; sphere{r}.
 * Geometric lengths/areas must be positive and finite. Numeric geometry uses π.
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EduMath = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const MAX_EXPRESSION_LENGTH = 4096;
  const MAX_LITERAL_DIGITS = 1000;
  const MAX_PRIME = (1n << 64n) - 1n;
  const MAX_FACTOR = 1000000000000n;
  const absBig = n => n < 0n ? -n : n;

  function integer(value, label = 'Broj') {
    if (typeof value === 'bigint') return value;
    if (value instanceof Rational) {
      if (value.d !== 1n) throw new Error(label + ' mora biti cijeli broj.');
      return value.n;
    }
    if (typeof value === 'number') {
      if (!Number.isSafeInteger(value)) throw new Error(label + ' unesite kao tekst ako prelazi siguran raspon cijelih brojeva.');
      return BigInt(value);
    }
    const text = String(value).trim();
    if (!/^[+-]?\d+$/.test(text)) throw new Error(label + ' mora biti cijeli broj.');
    if (text.replace(/^[+-]/, '').length > MAX_LITERAL_DIGITS) throw new Error('Broj je predug.');
    return BigInt(text);
  }

  function gcd(a, b) {
    a = absBig(integer(a)); b = absBig(integer(b));
    while (b) { const remainder = a % b; a = b; b = remainder; }
    return a;
  }

  function lcm(a, b) {
    a = integer(a); b = integer(b);
    return a === 0n || b === 0n ? 0n : absBig((a / gcd(a, b)) * b);
  }

  class Rational {
    constructor(n, d = 1n) {
      n = integer(n); d = integer(d, 'Nazivnik');
      if (d === 0n) throw new Error('Dijeljenje nulom nije definisano.');
      if (d < 0n) { n = -n; d = -d; }
      const common = gcd(n, d);
      this.n = n / common; this.d = d / common;
      Object.freeze(this);
    }
    add(other) { other = rational(other); return new Rational(this.n * other.d + other.n * this.d, this.d * other.d); }
    sub(other) { other = rational(other); return new Rational(this.n * other.d - other.n * this.d, this.d * other.d); }
    mul(other) {
      other = rational(other);
      const left = gcd(this.n, other.d), right = gcd(other.n, this.d);
      return new Rational((this.n / left) * (other.n / right), (this.d / right) * (other.d / left));
    }
    div(other) {
      other = rational(other);
      if (other.n === 0n) throw new Error('Dijeljenje nulom nije definisano.');
      return this.mul(new Rational(other.d, other.n));
    }
    neg() { return new Rational(-this.n, this.d); }
    abs() { return new Rational(absBig(this.n), this.d); }
    pow(exponent) {
      exponent = integer(exponent, 'Eksponent');
      if (absBig(exponent) > 100n) throw new Error('Eksponent mora biti između −100 i 100.');
      if (this.n === 0n && exponent <= 0n) throw new Error(exponent === 0n ? 'Izraz 0⁰ nije definisan u ovom alatu.' : 'Nula se ne može stepenovati negativnim eksponentom.');
      const power = absBig(exponent);
      if (BigInt(Math.max(absBig(this.n).toString().length, this.d.toString().length)) * power > 10000n) throw new Error('Rezultat stepenovanja je prevelik.');
      return exponent < 0n ? new Rational(this.d ** power, this.n ** power) : new Rational(this.n ** power, this.d ** power);
    }
    equals(other) { other = rational(other); return this.n === other.n && this.d === other.d; }
    toString() { return this.d === 1n ? String(this.n) : String(this.n) + '/' + String(this.d); }
    toDecimal(precision = 12) {
      if (!Number.isInteger(precision) || precision < 0 || precision > 100) throw new Error('Broj decimalnih mjesta mora biti između 0 i 100.');
      const negative = this.n < 0n;
      const scale = 10n ** BigInt(precision);
      let scaled = absBig(this.n) * scale / this.d;
      const remainder = absBig(this.n) * scale % this.d;
      if (remainder * 2n >= this.d) scaled += 1n;
      let result;
      if (precision === 0) result = String(scaled);
      else {
        const digits = String(scaled).padStart(precision + 1, '0');
        const fraction = digits.slice(-precision).replace(/0+$/, '');
        result = digits.slice(0, -precision) + (fraction ? '.' + fraction : '');
      }
      return negative && scaled !== 0n ? '-' + result : result;
    }
    toNumber() { return Number(this.n) / Number(this.d); }
    toJSON() { return {exact: this.toString(), decimal: this.toDecimal()}; }
  }

  function decimalRational(text) {
    text = text.replace(',', '.');
    const pieces = text.split('.');
    const digits = (pieces[0] || '0') + (pieces[1] || '');
    if (digits.length > MAX_LITERAL_DIGITS) throw new Error('Broj je predug.');
    return new Rational(BigInt(digits), 10n ** BigInt((pieces[1] || '').length));
  }

  function rational(value) {
    if (value instanceof Rational) return value;
    if (typeof value === 'bigint') return new Rational(value);
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) throw new Error('Broj mora biti konačan.');
      if (Number.isInteger(value) && !Number.isSafeInteger(value)) throw new Error('Veliki cijeli broj unesite kao tekst.');
      if (/e/i.test(String(value))) throw new Error('Unesite broj bez eksponencijalnog zapisa.');
    }
    return parse(String(value));
  }

  function parse(source) {
    if (typeof source !== 'string') source = String(source);
    if (!source.trim()) throw new Error('Unesite matematički izraz.');
    if (source.length > MAX_EXPRESSION_LENGTH) throw new Error('Izraz je predug.');
    source = source.replace(/×/g, '*').replace(/[÷:]/g, '/').replace(/−/g, '-');
    let index = 0, token, depth = 0;
    function next() {
      while (/\s/.test(source[index] || '') && index < source.length) index++;
      if (index >= source.length) { token = {type:'end'}; return; }
      const number = /^(?:\d+(?:[.,]\d*)?|[.,]\d+)/.exec(source.slice(index));
      if (number) { index += number[0].length; token = {type:'number', text:number[0]}; return; }
      const symbol = source[index++];
      if (!'+-*/^()'.includes(symbol)) throw new Error('Nedozvoljen znak u izrazu: ' + symbol);
      token = {type:symbol};
    }
    function primary() {
      if (token.type === 'number') { const result = decimalRational(token.text); next(); return result; }
      if (token.type === '(') {
        if (++depth > 128) throw new Error('Previše ugniježđenih zagrada.');
        next(); const result = sum();
        if (token.type !== ')') throw new Error('Nedostaje zatvorena zagrada.');
        depth--; next(); return result;
      }
      throw new Error('Očekuje se broj ili otvorena zagrada.');
    }
    function power() {
      let result = primary();
      if (token.type === '^') { next(); const exponent = unary(); result = result.pow(exponent); }
      return result;
    }
    function unary() {
      if (token.type === '+' || token.type === '-') {
        if (++depth > 128) throw new Error('Previše uzastopnih predznaka.');
        const op = token.type; next(); const result = unary(); depth--;
        return op === '-' ? result.neg() : result;
      }
      return power();
    }
    function product() {
      let result = unary();
      while (token.type === '*' || token.type === '/') {
        const op = token.type; next(); const other = unary();
        result = op === '*' ? result.mul(other) : result.div(other);
      }
      return result;
    }
    function sum() {
      let result = product();
      while (token.type === '+' || token.type === '-') {
        const op = token.type; next(); const other = product();
        result = op === '+' ? result.add(other) : result.sub(other);
      }
      return result;
    }
    next(); const result = sum();
    if (token.type !== 'end') throw new Error('Nedostaje operacija između brojeva ili zagrada.');
    return result;
  }

  function formatted(value) { const result = rational(value); return {exact:result.toString(), decimal:result.toDecimal()}; }
  function evaluate(expression) { return formatted(parse(expression)); }

  function divisibility(n, divisors = [2,4,5,6,9,10,15,25]) {
    n = integer(n);
    return divisors.map(divisor => {
      const d = integer(divisor, 'Djelilac');
      if (d === 0n) throw new Error('Djelilac ne može biti nula.');
      return {divisor: String(d), divisible: n % d === 0n};
    });
  }

  function modularPower(base, exponent, modulus) {
    let result = 1n; base %= modulus;
    while (exponent > 0n) {
      if (exponent & 1n) result = result * base % modulus;
      base = base * base % modulus; exponent >>= 1n;
    }
    return result;
  }

  function isPrime(value) {
    const n = integer(value);
    if (n < 2n) return false;
    if (n > MAX_PRIME) throw new Error('Provjera prostog broja podržava brojeve do 18 446 744 073 709 551 615.');
    for (const p of [2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n]) {
      if (n === p) return true;
      if (n % p === 0n) return false;
    }
    let d = n - 1n, s = 0;
    while ((d & 1n) === 0n) { d >>= 1n; s++; }
    for (let a of [2n,325n,9375n,28178n,450775n,9780504n,1795265022n]) {
      a %= n;
      if (a === 0n) continue;
      let x = modularPower(a, d, n);
      if (x === 1n || x === n - 1n) continue;
      let witness = true;
      for (let r = 1; r < s; r++) {
        x = x * x % n;
        if (x === n - 1n) { witness = false; break; }
      }
      if (witness) return false;
    }
    return true;
  }

  function factorize(value) {
    const input = integer(value);
    let n = absBig(input);
    if (n === 0n) throw new Error('Nula nema konačan rastav na proste faktore.');
    if (n > MAX_FACTOR) throw new Error('Rastav na proste faktore podržava apsolutne vrijednosti do 1 000 000 000 000.');
    const factors = [];
    if (input < 0n) factors.push({prime:'-1',exponent:1});
    function extract(p) {
      let exponent = 0;
      while (n % p === 0n) { n /= p; exponent++; }
      if (exponent) factors.push({prime:String(p), exponent});
    }
    extract(2n); extract(3n);
    for (let p = 5n; p * p <= n; p += 6n) { extract(p); extract(p + 2n); }
    if (n > 1n) factors.push({prime:String(n), exponent:1});
    return {factors, expression: factors.length ? factors.map(f => f.prime + (f.exponent > 1 ? '^' + f.exponent : '')).join(' × ') : '1'};
  }

  function convertBase(text, from, to) {
    from = Number(from); to = Number(to);
    if (![2,8,10,16].includes(from) || ![2,8,10,16].includes(to)) throw new Error('Dozvoljene baze su 2, 8, 10 i 16.');
    text = String(text).trim().toUpperCase();
    if (!text || text.length > MAX_LITERAL_DIGITS) throw new Error('Unesite broj do 1 000 cifara.');
    let negative = false;
    if (text[0] === '-' || text[0] === '+') { negative = text[0] === '-'; text = text.slice(1); }
    if (!text) throw new Error('Unesite cifre broja.');
    const alphabet = '0123456789ABCDEF';
    let value = 0n;
    for (const digit of text) {
      const position = alphabet.indexOf(digit);
      if (position < 0 || position >= from) throw new Error('Cifra ' + digit + ' nije dozvoljena u bazi ' + from + '.');
      value = value * BigInt(from) + BigInt(position);
    }
    return (negative && value !== 0n ? '-' : '') + value.toString(to).toUpperCase();
  }

  function solveLinear(a, b, c) {
    a = rational(a); b = rational(b); c = rational(c);
    const difference = c.sub(b);
    if (a.n === 0n) return {type: difference.n === 0n ? 'infinite' : 'none'};
    const solution = difference.div(a);
    return {type:'unique',x:solution.toString(),decimal:solution.toDecimal()};
  }

  function solveSystem(a, b, c, d, e, f) {
    [a,b,c,d,e,f] = [a,b,c,d,e,f].map(rational);
    const determinant = a.mul(e).sub(b.mul(d));
    if (determinant.n !== 0n) {
      return {type:'unique',x:c.mul(e).sub(b.mul(f)).div(determinant).toString(),y:a.mul(f).sub(c.mul(d)).div(determinant).toString(),determinant:determinant.toString()};
    }
    const incompatibleZeroRow = (a.n === 0n && b.n === 0n && c.n !== 0n) || (d.n === 0n && e.n === 0n && f.n !== 0n);
    const consistent = a.mul(f).equals(c.mul(d)) && b.mul(f).equals(c.mul(e));
    return {type: !incompatibleZeroRow && consistent ? 'infinite' : 'none',determinant:'0'};
  }

  function percentOf(percent, total) { return formatted(rational(percent).mul(total).div(100n)); }
  function percentage(part, whole) { return formatted(rational(part).div(whole).mul(100n)); }

  function linearPoints(slope, intercept, xs = [-2,-1,0,1,2]) {
    slope = rational(slope); intercept = rational(intercept);
    if (!Array.isArray(xs) || xs.length > 1000) throw new Error('Unesite najviše 1 000 koordinata x.');
    return xs.map(x => {
      x = rational(x); const y = slope.mul(x).add(intercept);
      return {x:x.toString(),y:y.toString(),decimalX:x.toDecimal(),decimalY:y.toDecimal()};
    });
  }

  function geometry(shape, dimensions) {
    if (!dimensions || typeof dimensions !== 'object') throw new Error('Unesite dimenzije figure.');
    const aliases = {pravougaonik:'rectangle',kvadrat:'square',trougao:'triangle',trokut:'triangle',krug:'circle',kvadar:'cuboid',kocka:'cube',prizma:'prism',piramida:'pyramid',valjak:'cylinder',kupa:'cone',lopta:'sphere'};
    shape = aliases[shape] || shape;
    const results = [];
    function dimension(key) {
      const raw = dimensions[key];
      if (raw === undefined || raw === null || String(raw).trim() === '') throw new Error('Nedostaje dimenzija: ' + key + '.');
      const value = rational(raw).toNumber();
      if (!Number.isFinite(value) || value <= 0) throw new Error('Dimenzija ' + key + ' mora biti pozitivna i konačna.');
      return value;
    }
    function result(label, value, power, formula) {
      if (!Number.isFinite(value)) throw new Error('Dimenzije daju rezultat izvan podržanog numeričkog raspona.');
      results.push({label,value,unit:power === 1 ? 'jedinica' : power === 2 ? 'jedinica²' : 'jedinica³',formula});
    }
    switch (shape) {
      case 'rectangle': {
        const a = dimension('a'), b = dimension('b');
        result('Obim',2*(a+b),1,'O = 2(a + b)'); result('Površina',a*b,2,'P = a · b'); result('Dijagonala',Math.hypot(a,b),1,'d = √(a² + b²)'); break;
      }
      case 'square': {
        const a = dimension('a'); result('Obim',4*a,1,'O = 4a'); result('Površina',a*a,2,'P = a²'); result('Dijagonala',a*Math.SQRT2,1,'d = a√2'); break;
      }
      case 'triangle': {
        const a = dimension('a'), h = dimension('h');
        const hasB = dimensions.b !== undefined && String(dimensions.b).trim() !== '', hasC = dimensions.c !== undefined && String(dimensions.c).trim() !== '';
        if (hasB !== hasC) throw new Error('Za obim trougla unesite obje dodatne stranice b i c.');
        if (hasB) {
          const b = dimension('b'), c = dimension('c');
          if (a+b <= c || a+c <= b || b+c <= a) throw new Error('Stranice ne zadovoljavaju nejednakost trougla.');
          const s = (a+b+c)/2, heronArea = Math.sqrt(s*(s-a)*(s-b)*(s-c));
          if (Math.abs(heronArea - a*h/2) > 1e-8 * Math.max(1,heronArea)) throw new Error('Visina h uz stranicu a nije usklađena sa zadanim stranicama.');
          result('Obim',a+b+c,1,'O = a + b + c');
        }
        result('Površina',a*h/2,2,'P = a · hₐ / 2'); break;
      }
      case 'circle': {
        const r = dimension('r'); result('Obim',2*Math.PI*r,1,'O = 2πr'); result('Površina',Math.PI*r*r,2,'P = πr²'); break;
      }
      case 'cuboid': {
        const a = dimension('a'), b = dimension('b'), c = dimension('c'); result('Površina',2*(a*b+a*c+b*c),2,'P = 2(ab + ac + bc)'); result('Zapremina',a*b*c,3,'V = abc'); result('Prostorna dijagonala',Math.hypot(a,b,c),1,'d = √(a² + b² + c²)'); break;
      }
      case 'cube': {
        const a = dimension('a'); result('Površina',6*a*a,2,'P = 6a²'); result('Zapremina',a**3,3,'V = a³'); result('Prostorna dijagonala',a*Math.sqrt(3),1,'d = a√3'); break;
      }
      case 'prism': {
        const baseArea = dimension('baseArea'), basePerimeter = dimension('basePerimeter'), h = dimension('h'); result('Površina uspravne prizme',2*baseArea+basePerimeter*h,2,'P = 2B + Oₒ · h'); result('Zapremina',baseArea*h,3,'V = B · h'); break;
      }
      case 'pyramid': {
        const baseArea = dimension('baseArea'), h = dimension('h');
        result('Zapremina',baseArea*h/3,3,'V = B · h / 3');
        if (dimensions.lateralArea !== undefined && String(dimensions.lateralArea).trim() !== '') result('Površina',baseArea+dimension('lateralArea'),2,'P = B + M');
        break;
      }
      case 'cylinder': {
        const r = dimension('r'), h = dimension('h'); result('Površina',2*Math.PI*r*(r+h),2,'P = 2πr(r + h)'); result('Zapremina',Math.PI*r*r*h,3,'V = πr²h'); break;
      }
      case 'cone': {
        const r = dimension('r'), h = dimension('h'), s = Math.hypot(r,h); result('Izvodnica',s,1,'s = √(r² + h²)'); result('Površina',Math.PI*r*(r+s),2,'P = πr(r + s)'); result('Zapremina',Math.PI*r*r*h/3,3,'V = πr²h / 3'); break;
      }
      case 'sphere': {
        const r = dimension('r'); result('Površina',4*Math.PI*r*r,2,'P = 4πr²'); result('Zapremina',4*Math.PI*r**3/3,3,'V = 4πr³ / 3'); break;
      }
      default: throw new Error('Nepoznata geometrijska figura.');
    }
    return {shape,results};
  }

  return Object.freeze({Rational,rational,parse,evaluate,gcd,lcm,divisibility,isPrime,factorize,convertBase,solveLinear,solveSystem,percentOf,percentage,linearPoints,geometry});
});
