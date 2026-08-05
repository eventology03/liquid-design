import fs from 'fs';
const p='site.template.html'; let s=fs.readFileSync(p,'utf8');
const must=(c,m)=>{ if(!c){ console.error('FAIL: '+m); process.exit(1);} };

// ---------- 1. rename the GATE plate so it stops colliding with the Work plate ----------
const pairs=[
 ['/* THE SURFACE THE LENS BENDS. without this there is nothing to refract. */\n.plate{',
  '/* THE SURFACE THE LENS BENDS. without this there is nothing to refract.\n   NOTE: named .g-plate, NOT .plate -- the Work section already owns .plate and\n   its later rules were collapsing this to 0x0. */\n.g-plate{'],
 ['.choice:hover .plate{opacity:.9}', '.choice:hover .g-plate{opacity:.9}'],
 ['.plate.lit{filter:url(#lensFilter)}', '.g-plate.lit{filter:url(#lensFilter)}'],
 ['  .plate.lit{filter:none}.gpanel.enter{animation:none}.choice:hover{transform:none}',
  '  .g-plate.lit{filter:none}.gpanel.enter{animation:none}.choice:hover{transform:none}'],
 ['var plate=btn.querySelector(".plate");', 'var plate=btn.querySelector(".g-plate");'],
];
for (const [a,b] of pairs){ must(s.includes(a),'missing: '+a.slice(0,60)); s=s.replace(a,b); }
// the four markup spans
const before=(s.match(/<span class="plate" aria-hidden="true"><\/span>/g)||[]).length;
must(before===4,'expected 4 gate plate spans, found '+before);
s=s.replaceAll('<span class="plate" aria-hidden="true"></span>','<span class="g-plate" aria-hidden="true"></span>');

// ---------- 2. corporate: drop the two background glows in the hero only ----------
const anchor='.vignette{position:absolute;inset:0;pointer-events:none;\n  background:radial-gradient(120% 80% at 50% 50%,transparent 45%,var(--stage-0) 100%)}';
must(s.includes(anchor),'vignette rule not found');
s=s.replace(anchor, anchor+`
/* Corporate drops the ember/azure blobs behind the mark. Scoped to .stage-fix so the
   gate keeps its own glows -- the visitor type is not known while the gate is up. */
:root[data-type="corporate"] .stage-fix .glow{display:none}`);

// ---------- 3. record the chosen type on <html> ----------
const a1='      try{ localStorage.setItem(STORE,JSON.stringify(state)); }catch(e){}';
must(s.includes(a1),'gate store line not found');
s=s.replace(a1, a1+'\n      document.documentElement.dataset.type=state.type;');

const a2='    gate.style.display="none";                   // but keep it for Preferences';
must(s.includes(a2),'remembered-path line not found');
s=s.replace(a2, a2+'\n    document.documentElement.dataset.type=saved.type;');

// Preferences reopens the gate -> clear the type again
const a3='    state={lang:null,type:null};\n    g2.classList.remove("active","enter");';
must(s.includes(a3),'openGate reset not found');
s=s.replace(a3,'    state={lang:null,type:null};\n    delete document.documentElement.dataset.type;\n    g2.classList.remove("active","enter");');

fs.writeFileSync(p,s);
console.log('fixed');
for (const k of ['.g-plate{','.g-plate.lit{','class="g-plate"',':root[data-type="corporate"] .stage-fix .glow','dataset.type=state.type'])
  console.log((s.includes(k)?'  ok   ':'  MISS '),k);
console.log('  gate .plate spans left:', (s.match(/<span class="plate"/g)||[]).length);
