'use strict';
const {inflateRawSync} = require('node:zlib');
const P = require('../app/content-pack.js');
const MAX_ZIP_FILES = 10000, MAX_RATIO = 1000;
const UTF8 = new TextDecoder('utf-8', {fatal: true});
const crcTable = Array.from({length: 256}, (_, n) => { for (let k = 0; k < 8; k++) n = (n & 1) ? (0xedb88320 ^ (n >>> 1)) : n >>> 1; return n >>> 0; });
function crc32(bytes) { let value = 0xffffffff; for (const byte of bytes) value = crcTable[(value ^ byte) & 255] ^ (value >>> 8); return (value ^ 0xffffffff) >>> 0; }
function fail(message) { throw new Error(message); }
function buffer(value) {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof ArrayBuffer) return Buffer.from(value);
  if (ArrayBuffer.isView(value)) return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  fail('Paket mora biti ZIP datoteka.');
}
function zipPath(name) {
  if (name.endsWith('/')) { P.safeRelativePath(name.slice(0, -1)); return name; }
  return P.safeRelativePath(name);
}
function readZip(value) {
  const zip = buffer(value);
  if (zip.length > P.MAX_PACK_BYTES || zip.length < 22) fail('ZIP paket smije imati do 30 MB.');
  let end = -1;
  for (let offset = zip.length - 22; offset >= Math.max(0, zip.length - 65557); offset--) {
    if (zip.readUInt32LE(offset) === 0x06054b50 && offset + 22 + zip.readUInt16LE(offset + 20) === zip.length) { end = offset; break; }
  }
  if (end < 0) fail('ZIP paket je nepotpun ili neispravan.');
  if (zip.readUInt16LE(end + 4) || zip.readUInt16LE(end + 6)) fail('Višedijelni ZIP nije podržan.');
  const count = zip.readUInt16LE(end + 10), centralSize = zip.readUInt32LE(end + 12), centralOffset = zip.readUInt32LE(end + 16);
  if (count === 0xffff || centralSize === 0xffffffff || centralOffset === 0xffffffff || count > MAX_ZIP_FILES || zip.readUInt16LE(end + 8) !== count) fail('ZIP paket ima previše datoteka ili nepodržan ZIP64 format.');
  if (centralOffset + centralSize !== end || centralOffset > end) fail('Neispravan ZIP sadržaj.');
  const entries = [], names = new Set(); let offset = centralOffset, expandedBytes = 0;
  for (let i = 0; i < count; i++) {
    if (offset + 46 > end || zip.readUInt32LE(offset) !== 0x02014b50) fail('Neispravan ZIP direktorij.');
    const flags = zip.readUInt16LE(offset + 8), method = zip.readUInt16LE(offset + 10), crc = zip.readUInt32LE(offset + 16), compressed = zip.readUInt32LE(offset + 20), expanded = zip.readUInt32LE(offset + 24);
    const nameLength = zip.readUInt16LE(offset + 28), extraLength = zip.readUInt16LE(offset + 30), commentLength = zip.readUInt16LE(offset + 32), externalAttributes = zip.readUInt32LE(offset + 38), localOffset = zip.readUInt32LE(offset + 42);
    if (offset + 46 + nameLength + extraLength + commentLength > end || !nameLength || nameLength > 960) fail('Neispravno ime ZIP datoteke.');
    if (flags & ~(0x0800 | 0x0008 | 0x0006) || (method !== 0 && method !== 8) || zip.readUInt16LE(offset + 34)) fail('Šifriran ili nepodržan ZIP nije dozvoljen.');
    if (compressed === 0xffffffff || expanded === 0xffffffff || localOffset === 0xffffffff) fail('ZIP64 format nije podržan.');
    const unixType = (externalAttributes >>> 16) & 0xf000;
    if (unixType !== 0 && unixType !== 0x8000 && unixType !== 0x4000) fail('ZIP ne smije sadržavati simboličke veze ili posebne datoteke.');
    let name; try { name = zipPath(UTF8.decode(zip.subarray(offset + 46, offset + 46 + nameLength))); } catch (error) { fail('Neispravno ili nedozvoljeno ime datoteke u ZIP paketu.'); }
    const key = name.toLocaleLowerCase('en-US'); if (names.has(key)) fail('ZIP paket sadrži ponovljenu datoteku.'); names.add(key);
    const directory = name.endsWith('/'); if (directory && (expanded || compressed)) fail('ZIP direktorij sadrži neispravne podatke.');
    if (!directory && unixType === 0x4000) fail('Neispravna ZIP datoteka.');
    expandedBytes += expanded;
    if (expandedBytes > P.MAX_PACK_BYTES || expanded > P.MAX_PACK_BYTES || (expanded > 1024 * 1024 && expanded > Math.max(1, compressed) * MAX_RATIO)) fail('Raspakovani paket prelazi dozvoljenu veličinu ili omjer kompresije.');
    entries.push({name, flags, method, crc, compressed, expanded, localOffset, directory});
    offset += 46 + nameLength + extraLength + commentLength;
  }
  if (offset !== centralOffset + centralSize) fail('Neispravna veličina ZIP direktorija.');
  const files = new Map(), ranges = [];
  for (const entry of entries) {
    const start = entry.localOffset;
    if (start + 30 > centralOffset || zip.readUInt32LE(start) !== 0x04034b50) fail('Neispravno zaglavlje ZIP datoteke.');
    const nameLength = zip.readUInt16LE(start + 26), extraLength = zip.readUInt16LE(start + 28), dataStart = start + 30 + nameLength + extraLength;
    if (dataStart > centralOffset || dataStart + entry.compressed > centralOffset || zip.readUInt16LE(start + 6) !== entry.flags || zip.readUInt16LE(start + 8) !== entry.method) fail('Neusaglašeni podaci ZIP datoteke.');
    let localName; try { localName = UTF8.decode(zip.subarray(start + 30, start + 30 + nameLength)); } catch { fail('Neispravno lokalno ime ZIP datoteke.'); }
    if (localName !== entry.name) fail('Ime ZIP datoteke nije usaglašeno.');
    const hasDescriptor = (entry.flags & 8) !== 0;
    if (!hasDescriptor && (zip.readUInt32LE(start + 14) !== entry.crc || zip.readUInt32LE(start + 18) !== entry.compressed || zip.readUInt32LE(start + 22) !== entry.expanded)) fail('Neispravne veličine ZIP datoteke.');
    let dataEnd = dataStart + entry.compressed;
    if (hasDescriptor) {
      const descriptor = dataEnd; const signed = descriptor + 4 <= centralOffset && zip.readUInt32LE(descriptor) === 0x08074b50; const values = descriptor + (signed ? 4 : 0);
      if (values + 12 > centralOffset || zip.readUInt32LE(values) !== entry.crc || zip.readUInt32LE(values + 4) !== entry.compressed || zip.readUInt32LE(values + 8) !== entry.expanded) fail('Neispravan ZIP opis podataka.');
      dataEnd = values + 12;
    }
    ranges.push([start, dataEnd]);
    let decoded;
    try { decoded = entry.method === 0 ? zip.subarray(dataStart, dataStart + entry.compressed) : inflateRawSync(zip.subarray(dataStart, dataStart + entry.compressed), {maxOutputLength: Math.max(1, entry.expanded)}); }
    catch { fail('ZIP datoteka je oštećena ili prevelika.'); }
    if (decoded.length !== entry.expanded || crc32(decoded) !== entry.crc) fail('ZIP kontrolni broj ili veličina nije ispravna.');
    if (!entry.directory) files.set(entry.name, decoded);
  }
  ranges.sort((a, b) => a[0] - b[0]); for (let i = 1; i < ranges.length; i++) if (ranges[i][0] < ranges[i - 1][1]) fail('ZIP datoteke se preklapaju.');
  return {files, expandedBytes};
}
function packReport(pack) {
  const tasks = pack.books.flatMap(book => book.tasks);
  return {books: pack.books.length, tasks: tasks.length, solutions: tasks.reduce((total, task) => total + Object.keys(task.solutions || {}).length, 0)};
}
function parseManifest(bytes) {
  let json; try { json = JSON.parse(UTF8.decode(bytes).trim()); } catch { fail('pack.json nije ispravan UTF-8 JSON dokument.'); }
  return P.validatePack(json);
}
function readPack(bytes) {
  const input = buffer(bytes);
  if (input.length > P.MAX_PACK_BYTES) fail('Paket smije imati do 30 MB.');
  let offset = 0;
  // Accept plain UTF-8 manifests as well as ZIPs. A BOM and surrounding JSON
  // whitespace are permitted, while decoding stays strict for malformed UTF-8.
  while (offset < input.length) {
    if ([9, 10, 13, 32].includes(input[offset])) { offset++; continue; }
    if (input[offset] === 0xef && input[offset + 1] === 0xbb && input[offset + 2] === 0xbf) { offset += 3; continue; }
    break;
  }
  if (input[offset] === 0x7b || input[offset] === 0x5b) {
    const pack = parseManifest(input);
    return {pack, report: {...packReport(pack), files: 1, filePaths: ['pack.json'], expandedBytes: input.length}};
  }
  const zip = readZip(input), manifest = zip.files.get('pack.json');
  if (!manifest) fail('ZIP paket mora sadržavati pack.json u glavnom direktoriju.');
  const pack = parseManifest(manifest);
  return {pack, report: {...packReport(pack), files: zip.files.size, filePaths: [...zip.files.keys()], expandedBytes: zip.expandedBytes}};
}
function createZip(entries) {
  if (!Array.isArray(entries) || entries.length > MAX_ZIP_FILES) fail('Previše datoteka u paketu.');
  const locals = [], central = [], names = new Set(); let localOffset = 0, expandedBytes = 0;
  for (const entry of entries) {
    const name = P.safeRelativePath(entry.name), folded = name.toLowerCase(); if (names.has(folded)) fail('Ponovljeno ime datoteke u paketu.'); names.add(folded);
    const filename = Buffer.from(name, 'utf8'), contents = typeof entry.bytes === 'string' ? Buffer.from(entry.bytes, 'utf8') : buffer(entry.bytes);
    expandedBytes += contents.length; if (expandedBytes > P.MAX_PACK_BYTES) fail('Paket smije imati do 30 MB.');
    const crc = crc32(contents), local = Buffer.alloc(30), record = Buffer.alloc(46);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(33, 12); local.writeUInt32LE(crc, 14); local.writeUInt32LE(contents.length, 18); local.writeUInt32LE(contents.length, 22); local.writeUInt16LE(filename.length, 26);
    record.writeUInt32LE(0x02014b50, 0); record.writeUInt16LE(20, 4); record.writeUInt16LE(20, 6); record.writeUInt16LE(0x0800, 8); record.writeUInt16LE(33, 14); record.writeUInt32LE(crc, 16); record.writeUInt32LE(contents.length, 20); record.writeUInt32LE(contents.length, 24); record.writeUInt16LE(filename.length, 28); record.writeUInt32LE(localOffset, 42);
    locals.push(local, filename, contents); central.push(record, filename); localOffset += local.length + filename.length + contents.length;
  }
  const centralBytes = Buffer.concat(central), end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(centralBytes.length, 12); end.writeUInt32LE(localOffset, 16);
  const zip = Buffer.concat([...locals, centralBytes, end]); if (zip.length > P.MAX_PACK_BYTES) fail('ZIP paket smije imati do 30 MB.'); return zip;
}
function createPackZip(value, options = {}) {
  const pack = P.validatePack(value), entries = [{name: 'pack.json', bytes: JSON.stringify(pack, null, 2) + '\n'}];
  const lines = ['ELDI EDU — paket zbirki i rješenja', '', 'U aplikaciji otvorite Zbirke i rješenja, zatim Uvezi JSON / ZIP.', 'Svaki programski zadatak ima zaseban izvorni kod u direktoriju solutions.', 'Import čuva kod kao tekst; program se pokreće samo kada ga sami otvorite i pokrenete u editoru.', 'Priloženi status provjere opisuje provjere autora paketa; ne zamjenjuje službene skrivene testove.', 'Bilješke i napredak učenika nisu uključeni u paket. Sačuvajte ih izvozom profila.', '', 'Zbirke:'];
  const extensions = {python: 'py', cpp: 'cpp', c: 'c', java: 'java'};
  for (const book of pack.books) {
    lines.push(`- ${book.title} (${book.tasks.length} zadataka)`);
    for (const task of book.tasks) for (const [language, solution] of Object.entries(task.solutions || {})) entries.push({name: `solutions/${book.id}/${task.id}.${extensions[language]}`, bytes: solution.code});
  }
  entries.push({name: 'README.txt', bytes: lines.join('\n') + '\n'});
  if (options.files !== undefined) {
    if (!options.files || typeof options.files !== 'object' || Array.isArray(options.files)) fail('Dodatne datoteke moraju biti mapa.');
    for (const [name, bytes] of Object.entries(options.files)) entries.push({name, bytes});
  }
  return createZip(entries);
}
module.exports = {MAX_PACK_BYTES: P.MAX_PACK_BYTES, MAX_ZIP_FILES, readPack, createPackZip, readZip, createZip, crc32, packReport};
