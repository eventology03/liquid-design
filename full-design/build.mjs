import fs from 'fs';
// Fonts/masks live in ../_build/ (shared across surfaces), the template and
// both outputs live here, named after this surface, not the old scratchpad
// names (site.template.html / site.html / site-standalone.html).
// lens.png is NOT read here any more: the lens is a CSS magnifier now (see
// __evtMakeLoupe in the template), not an SVG feImage filter, so there is no
// lens image to embed. See PROTECTING-THE-WORK.md, 2026-08-05, for why.
const fonts=JSON.parse(fs.readFileSync('../_build/fonts_subset.json','utf8'));
const masks=JSON.parse(fs.readFileSync('../_build/masks.json','utf8'));
let h=fs.readFileSync('full-design.template.html','utf8')
  .replaceAll('__FRAUNCES__',fonts['Fraunces'])
  .replaceAll('__INTER__',fonts['Inter Tight'])
  .replaceAll('__KUFI__',fonts['Noto Kufi Arabic'])
  .replaceAll('__MASKFILL__',masks['mask-fill'])
  .replaceAll('__MASKEDGE__',masks['mask-edge']);
for (const t of ['__FRAUNCES__','__INTER__','__KUFI__','__MASKFILL__','__MASKEDGE__'])
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
fs.writeFileSync('full-design.artifact.html',page);   // bare page content, no doctype -- for Artifact
const t=page.match(/<title>[\s\S]*?<\/title>/i)[0];
const doc='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'+
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n'+t+
  '\n</head>\n<body>\n'+page.replace(t,'').trimStart()+'\n</body>\n</html>\n';
fs.writeFileSync('full-design.html',doc);              // has a doctype -- for opening directly / the lab
console.log('built  artifact',Math.round(page.length/1024),'KB   standalone',Math.round(doc.length/1024),'KB');
