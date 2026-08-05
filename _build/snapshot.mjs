#!/usr/bin/env node
// Timestamped, read-only snapshot of the design work.
// Interim protection until `git` is usable (blocked by the Xcode licence prompt).
//   node _build/snapshot.mjs "why I am snapshotting"
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const KEEP = ['main-hero','entry-gates','full-design','liquid-hero-concept','_build',
              'STRUCTURE.md','safari-check.html'];
const SKIP = new Set(['.DS_Store','snapshots']);

const stamp = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
const label = (process.argv[2]||'snapshot').replace(/[^\w -]/g,'').trim().slice(0,60);
const dest  = path.join(ROOT,'snapshots',`${stamp}__${label.replace(/\s+/g,'-')}`);

let files=0, bytes=0; const manifest=[];
function walk(src,rel){
  for (const e of fs.readdirSync(src,{withFileTypes:true})){
    if (SKIP.has(e.name)) continue;
    const s=path.join(src,e.name), r=rel?path.join(rel,e.name):e.name;
    if (e.isDirectory()) walk(s,r);
    else {
      const buf=fs.readFileSync(s);
      const out=path.join(dest,r);
      fs.mkdirSync(path.dirname(out),{recursive:true});
      fs.writeFileSync(out,buf);
      fs.chmodSync(out,0o444);                     // read-only: cannot be overwritten in place
      manifest.push({file:r,bytes:buf.length,
        sha256:crypto.createHash('sha256').update(buf).digest('hex').slice(0,16)});
      files++; bytes+=buf.length;
    }
  }
}
for (const k of KEEP){
  const s=path.join(ROOT,k);
  if (!fs.existsSync(s)) continue;
  fs.statSync(s).isDirectory() ? walk(s,k)
    : (fs.mkdirSync(dest,{recursive:true}),
       fs.writeFileSync(path.join(dest,k),fs.readFileSync(s)),
       fs.chmodSync(path.join(dest,k),0o444),
       manifest.push({file:k,bytes:fs.statSync(s).size,
         sha256:crypto.createHash('sha256').update(fs.readFileSync(s)).digest('hex').slice(0,16)}),
       files++, bytes+=fs.statSync(s).size);
}
fs.writeFileSync(path.join(dest,'MANIFEST.json'),
  JSON.stringify({takenAt:new Date().toISOString(),label,files,bytes,manifest},null,1));
console.log(`snapshot -> snapshots/${path.basename(dest)}`);
console.log(`  ${files} files, ${(bytes/1024/1024).toFixed(2)} MB, all read-only`);
