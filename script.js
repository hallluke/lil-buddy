'use strict';

const pools= {
  "leftArms": ["⎝", "ᚒ", "⥖", "⬐", "┗", "╰", "╭", "ᕙ", "ᕦ", "⤥", "へ", "ᜠ", "ﾉ", "⟍", "↖", "↙", "⬉", "⬋", "↼", "↽", "⥚", "⇠", "↜", "⤙", "٩"],
 "rightArms": ["┓", "┛", "╯", "╮", "⥗", "⬏", "⬸", "⍻", "ノ", "ヽ", "ᕗ", "ᕥ", "⟋", "↗", "↘", "⬈", "⬊", "⇀", "⇁", "⥛", "⇢", "↝", "⤚", "࿓"],
 "bodies": [["(", ")"], ["[", "]"], ["{", "}"], ["<", ">"], ["⎛", "⎞"], ["⎝", "⎠"], ["⎡", "⎤"], ["⎨", "⎬"], ["〈", "〉"], ["❪", "❫"], ["❬", "❭"], ["❮", "❯"], ["❰", "❱"], ["❲", "❳"], ["❴", "❵"], ["⟦", "⟧"], ["⟨", "⟩"], ["⟪", "⟫"], ["⟮", "⟯"], ["⦃", "⦄"], ["⦅", "⦆"], ["⦇", "⦈"], ["⦉", "⦊"], ["⦋", "⦌"], ["⦍", "⦎"], ["⦏", "⦐"], ["⦗", "⦘"], ["⧼", "⧽"], ["⌈", "⌉"], ["⌊", "⌋"], ["「", "」"], ["〈", "〉"], ["【", "】"], ["〔", "〕"], ["〖", "〗"], ["〚", "〛"], ["⁅", "⁆"], ["﹙", "﹚"], ["﹛", "﹜"], ["﹝", "﹞"], ["|", "|"], ["⎜", "⎟"], ["⎢", "⎥"], ["⎣", "⎦"], ["⎰", "⎱"], ["⎪", "⎪"], ["⎩", "⎭"], ["⎧", "⎫"], ["﴾", "﴿"]],
 "singleFaces": ["ᐖ", "ᐛ", "ᐇ", "ᑸ", "ᑹ", "ᓏ", "ᓎ", "ᐵ", "⏕", "Ö"],
 "eyes": ["•", "·", "°", "o", "O", "0", "×", "x", "^", "¬", "⚈", "◕", "◔", "◉", "●", "ᴖ", "˘", "ʘ", "Ѳ"],
 "mouths": ["ᴗ", "‿", "ω", "﹏", "︶", "︵", "⁔", "っ", "▽", "△", "﹃", "_", "-", "ᴥ", "ᗜ", "ᗣ", "ᗤ", "ᗧ", "ᗨ", "ᗩ", "ᗢ", "﹁"]
};

// Curated mirrored/visually related arm pairs, only using approved characters.
// Not every arm has a suitable counterpart; those remain in the independent pools.
const matchingArms=[
['⥖','⥗'],['⬐','⬏'],['┗','┛'],['╰','╯'],['╭','╮'],['ᕙ','ᕗ'],['ᕦ','ᕥ'],['⤥','⤚'],['ﾉ','ノ'],['⟍','⟋'],['↖','↗'],['↙','↘'],['⬉','⬈'],['⬋','⬊'],['↼','⇀'],['↽','⇁'],['⥚','⥛'],['⇠','⇢'],['↜','↝']
].filter(([l,r])=>pools.leftArms.includes(l)&&pools.rightArms.includes(r));

/* Build a tiny ink texture in memory: no network request or extra image file.
Broad uneven ink patches are mixed with smaller areas where the ink didn't take.
Adjust PATCHES and DROP_OUT to tune the effect without changing the HTML layout. */

function makeInkTexture() {
  const W=96,H=48,PATCHES=34,DROP_OUT=42;
  const canvas=document.createElement('canvas');
  canvas.width=W;
  canvas.height=H;
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  // Base ink colour, with gentle low-frequency tonal variation.
  ctx.fillStyle='#3e5367';
  ctx.fillRect(0,0,W,H);
  const seed=(x,y,r,alpha,color)=> {
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,`rgba(${color},${alpha})`);
    g.addColorStop(.55,`rgba(${color},${alpha*.62})`);
    g.addColorStop(1,`rgba(${color},0)`);
    ctx.fillStyle=g;
    ctx.fillRect(x-r,y-r,r*2,r*2);
  };
  
 // Larger patches: visibly lighter areas across a whole friend, not pixel noise.
  for(let i=0;i<PATCHES;i++) {
    const x=Math.random()*W,y=Math.random()*H,r=3+Math.random()*9;
    seed(x,y,r,.16+Math.random()*.37,'245,247,246');
  }
  
 // Small, sporadic ink skips, softened to avoid sharp white pinholes.
  for(let i=0;i<DROP_OUT;i++) {
    const x=Math.random()*W,y=Math.random()*H,r=.8+Math.random()*2.2;
    seed(x,y,r,.22+Math.random()*.32,'250,249,243');
  }
  
 // A few darker, heavier deposits keep the surface from looking washed out.
  for(let i=0;i<19;i++)seed(Math.random()*W,Math.random()*H,2+Math.random()*6,.12+Math.random()*.19,'19,37,55');
  document.documentElement.style.setProperty('--ink-texture',`url("${canvas.toDataURL('image/png')}")`);
}
makeInkTexture();

const choose=a=>a[Math.floor(Math.random()*a.length)];
function generate() {
  const body=choose(pools.bodies);
  const face=Math.random()<.5?choose(pools.singleFaces):(()=> {
    const eye=choose(pools.eyes);
    return eye+choose(pools.mouths)+eye
  }
  )();
  const arms=Math.random()<.3?choose(matchingArms):[choose(pools.leftArms),choose(pools.rightArms)];
  return arms[0]+body[0]+' '+face+' '+body[1]+arms[1];
}
let current='',crowd=[];
const specialNumbers=['0042','0069','1337','0007','0001','0420','0777','8008','7718','3571'];
const redactionMarks=['X','-','█'];

function nextSerial() {
  const r=Math.random();
  if(r<.11)return choose(specialNumbers);
  let id=String(Math.floor(Math.random()*10000)).padStart(4,'0');
  // Redactions are rare, and never affect the guaranteed low-number specimen.
  if(r>=.11&&r<.19) {
    const at=Math.floor(Math.random()*4);
    id=id.slice(0,at)+choose(redactionMarks)+id.slice(at+1);
  }
  return id;
}
function smallSerial() {
  return String(1+Math.floor(Math.random()*99)).padStart(4,'0');
}
const single=document.getElementById('single'),gallery=document.getElementById('gallery');
function newSingle() {
  current=generate();
  single.textContent=current;
  document.getElementById('single-number').textContent='NO. '+nextSerial();
  document.getElementById('copy-status').textContent='';
}
function newGallery() {
  const count=Number(document.getElementById('count').value);
  crowd=Array.from( {
    length:count
  }
  ,generate);
  const smallIndex=Math.floor(Math.random()*count);
  // Exactly one off-register impression on a nine-person sheet;
  // otherwise a one-in-nine chance of one misprint per sheet.
  const misprintIndex=(count===9||Math.random()<1/9)?Math.floor(Math.random()*count):-1;
  gallery.replaceChildren(...crowd.map((f,i)=> {
    const el=document.createElement('div');
    el.className='tile';
    const n=document.createElement('span');
    n.className='specimen-label';
    n.textContent='NO. '+(i===smallIndex?smallSerial():nextSerial());
    const glyph=document.createElement('span');
    glyph.className='fren specimen-glyph';
    glyph.textContent=f;
    if(i===misprintIndex) {
      el.classList.add('misprint');
      // Most errors are small; occasional larger offsets, rarely cropped.
      const r=Math.random();
      const distance=r<.66?3+Math.random()*7:r<.94?12+Math.random()*13:28+Math.random()*20;
      const theta=Math.random()*Math.PI*2;
      const angle=(Math.random()<.5?-1:1)*(r<.66?3+Math.random()*8:r<.94?9+Math.random()*14:18+Math.random()*17);
      glyph.style.setProperty('--misprint-x',(Math.cos(theta)*distance).toFixed(1)+'px');
      glyph.style.setProperty('--misprint-y',(Math.sin(theta)*distance*.75).toFixed(1)+'px');
      glyph.style.setProperty('--misprint-angle',angle.toFixed(1)+'deg');
      const area=document.createElement('span');
      area.className='misprint-area';
      area.append(glyph);
      el.append(n,area);
    }else el.append(n,glyph);
    return el;
  }
  ));
  document.getElementById('gallery-status').textContent='';
}
async function copy(text,status) {
  try {
    await navigator.clipboard.writeText(text);
    status.textContent='Copied!'
  }catch {
    status.textContent='Copy unavailable here — select the text instead.'
  }
}
document.getElementById('new-single').addEventListener('click',newSingle);
document.getElementById('new-gallery').addEventListener('click',newGallery);
document.getElementById('count').addEventListener('change',newGallery);
document.getElementById('copy-single').addEventListener('click',()=>copy(current,document.getElementById('copy-status')));
document.getElementById('copy-gallery').addEventListener('click',()=>copy(crowd.join('\n'),document.getElementById('gallery-status')));
let walkPair=[],podium=[];
function newWalk() {
  walkPair=[generate(),generate()];
  document.getElementById('walker-one').textContent=walkPair[0];
  document.getElementById('walker-two').textContent=walkPair[1];
  document.getElementById('walker-number-one').textContent='NO. '+nextSerial();
  document.getElementById('walker-number-two').textContent='NO. '+nextSerial();
  document.getElementById('walk-status').textContent='';
  requestAnimationFrame(updateWalkDistance);
}
function newPodium() {
  podium=[generate(),generate(),generate()];
  document.getElementById('gold').textContent=podium[0];
  document.getElementById('silver').textContent=podium[1];
  document.getElementById('bronze').textContent=podium[2];
  ['gold','silver','bronze'].forEach(id=> {
    document.getElementById(id+'-number').textContent='NO. '+nextSerial();
    document.getElementById(id).style.transform='rotate('+((Math.random()*4)-2).toFixed(2)+'deg)';
  }
  );
  document.getElementById('podium-status').textContent='';
}
const walkStage=document.querySelector('.walk-stage');
function updateWalkDistance() {
  const walkers=document.getElementById('walkers');
  const distance=Math.max(0,walkStage.clientWidth-walkers.offsetWidth-12);
  walkers.style.setProperty('--walk-distance',distance+'px');
}
if(typeof ResizeObserver!=='undefined')new ResizeObserver(updateWalkDistance).observe(walkStage);
window.addEventListener('load',updateWalkDistance);
document.fonts?.ready.then(updateWalkDistance);
document.getElementById('new-walk').addEventListener('click',newWalk);
document.getElementById('new-podium').addEventListener('click',newPodium);
document.getElementById('copy-walk').addEventListener('click',()=>copy(walkPair.join('  '),document.getElementById('walk-status')));
document.getElementById('copy-podium').addEventListener('click',()=>copy('1 '+podium[0]+'\n2 '+podium[1]+'\n3 '+podium[2],document.getElementById('podium-status')));
newSingle();
newGallery();
newWalk();
newPodium();
