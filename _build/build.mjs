import fs from 'fs';
const fonts=JSON.parse(fs.readFileSync('fonts_subset.json','utf8'));
const masks=JSON.parse(fs.readFileSync('masks.json','utf8'));
const lens=fs.readFileSync('lens.png').toString('base64');
let h=fs.readFileSync('site.template.html','utf8')
  .replaceAll('__FRAUNCES__',fonts['Fraunces'])
  .replaceAll('__INTER__',fonts['Inter Tight'])
  .replaceAll('__KUFI__',fonts['Noto Kufi Arabic'])
  .replaceAll('__MASKFILL__',masks['mask-fill'])
  .replaceAll('__MASKEDGE__',masks['mask-edge'])
  .replaceAll('__LENS__',lens);
for (const t of ['__FRAUNCES__','__INTER__','__KUFI__','__MASKFILL__','__MASKEDGE__','__LENS__'])
  if (h.includes(t)) { console.error('unreplaced '+t); process.exit(1); }

const stA=h.indexOf('<style>'), stB=h.indexOf('</style>');
const scA=h.indexOf('<script>'), scB=h.lastIndexOf('</script>');
const ent=x=>[...x].map(c=>c.codePointAt(0)<128?c:'&#'+c.codePointAt(0)+';').join('');
let css=h.slice(stA,stB).replaceAll('—','--').replaceAll('–','-')
        .replaceAll('·','.').replaceAll('’',"'");
css=[...css].map(c=>c.codePointAt(0)<128?c:'?').join('');
const js=[...h.slice(scA,scB)].map(c=>{
  const n=c.codePointAt(0);
  return n<128?c:'\\u'+n.toString(16).padStart(4,'0');
}).join('');
const page=ent(h.slice(0,stA))+css+ent(h.slice(stB,scA))+js+ent(h.slice(scB));
if ([...page].some(c=>c.codePointAt(0)>127)) { console.error('non-ascii left'); process.exit(1); }
fs.writeFileSync('site.html',page);
const t=page.match(/<title>[\s\S]*?<\/title>/i)[0];
const doc='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'+
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n'+t+
  '\n</head>\n<body>\n'+page.replace(t,'').trimStart()+'\n</body>\n</html>\n';
fs.writeFileSync('site-standalone.html',doc);
console.log('built  artifact',Math.round(page.length/1024),'KB   standalone',Math.round(doc.length/1024),'KB');
