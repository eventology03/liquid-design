import fs from 'fs';
const p='site.template.html'; let s=fs.readFileSync(p,'utf8');
const must=(c,m)=>{ if(!c){ console.error('FAIL: '+m); process.exit(1);} };

// 1. CSS
const oldCss='.hero-core{position:relative;z-index:3;display:grid;justify-items:center;gap:0}';
must(s.includes(oldCss),'hero-core css not found');
s=s.replace(oldCss, oldCss+`
/* The lens filter lives on .rig (a ~320px box) and NEVER on the hero or viewport:
   a full-viewport filter region exceeds the browser's filter-surface limit and the
   effect is then silently dropped. */
.rig.lit{filter:url(#lensFilter)}
@media (prefers-reduced-motion:reduce){ .rig.lit{filter:none} }`);

// 2. gate must set its own lens size, since the hero now changes it
const gateOld='      if(cur){ lens.setAttribute("x",(sx-SIZE/2).toFixed(1));';
must(s.includes(gateOld),'gate lens line not found');
s=s.replace(gateOld,'      if(cur){ lens.setAttribute("width",SIZE); lens.setAttribute("height",SIZE);\n               lens.setAttribute("x",(sx-SIZE/2).toFixed(1));');

// 3. hero lens script
const HERO=`
<script>
(function(){
  "use strict";
  // Same glass lens as main-hero, same constants -- this is the approved feel.
  // It shares #lensFilter with the gate; they never run at the same time, and the
  // guard below stops the hero touching it while the gate is open.
  var stage=document.querySelector(".stage-fix"),
      rig=document.getElementById("rig"),
      lens=document.getElementById("lens"),
      disp=document.getElementById("disp");
  if(!stage||!rig||!lens||!disp) return;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var SIZE=330, MAX=56, REACH=150, LAG=0.065, EASE=0.07;
  var tx=0,ty=0,sx=0,sy=0,scale=0,target=0,raf=0,primed=false;
  function gateOpen(){ return document.body.dataset.gate==="open"; }

  function onMove(e){
    if(gateOpen()) return;
    var r=rig.getBoundingClientRect();
    tx=e.clientX-r.left; ty=e.clientY-r.top;
    var dx=Math.max(r.left-e.clientX,0,e.clientX-r.right);
    var dy=Math.max(r.top-e.clientY,0,e.clientY-r.bottom);
    target=MAX*Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/REACH);
    if(!primed){ sx=tx; sy=ty; primed=true; }
    if(!raf) raf=requestAnimationFrame(tick);
  }
  stage.addEventListener("pointermove",onMove,{passive:true});
  stage.addEventListener("pointerdown",onMove,{passive:true});
  stage.addEventListener("touchmove",function(e){ if(e.touches[0]) onMove(e.touches[0]); },{passive:true});
  stage.addEventListener("pointerleave",function(){ target=0; if(!raf) raf=requestAnimationFrame(tick); });

  function tick(){
    // First-order lag: the lens trails the cursor and never overshoots. A spring
    // would bounce, which reads as rubber rather than thick liquid.
    sx+=(tx-sx)*LAG; sy+=(ty-sy)*LAG;
    scale+=(target-scale)*EASE;
    if(scale>0.4){
      rig.classList.add("lit");
      lens.setAttribute("width",SIZE); lens.setAttribute("height",SIZE);
      lens.setAttribute("x",(sx-SIZE/2).toFixed(1));
      lens.setAttribute("y",(sy-SIZE/2).toFixed(1));
      disp.setAttribute("scale",scale.toFixed(2));
    }
    var settled=Math.abs(target-scale)<0.05&&Math.abs(tx-sx)<0.5&&Math.abs(ty-sy)<0.5;
    if(settled&&target===0){
      rig.classList.remove("lit");
      disp.setAttribute("scale","0"); scale=0; primed=false; raf=0; return;
    }
    raf=requestAnimationFrame(tick);
  }
})();
<\/script>
`;
const i=s.lastIndexOf('<\/script>')+('<\/script>').length;
s=s.slice(0,i)+HERO+s.slice(i);
fs.writeFileSync(p,s);
console.log('hero lens added');
for (const k of ['.rig.lit{filter:url(#lensFilter)}','SIZE=330','function gateOpen'])
  console.log((s.includes(k)?'  ok   ':'  MISS '),k);
