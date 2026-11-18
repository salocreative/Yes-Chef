/* Yes Chef x Salo: motion v4. Light by design: no blur filters, no per-frame document styles, canvases pause off screen. */
(function(){
const FX=window.FX={};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
FX.reduce=reduce;FX.fine=fine;
const M=FX.mouse={x:-9999,y:-9999,on:false,t:0};
addEventListener('pointermove',e=>{M.x=e.clientX;M.y=e.clientY;M.on=true;M.t=performance.now()},{passive:true});
document.addEventListener('pointerleave',()=>{M.on=false});

/* ---------- icons: kitchen set, single colour ---------- */
FX.ICONS={
 toque:'<path d="M7 13.5c-2.2-.3-3.5-2-3.5-3.9 0-2.2 1.8-3.9 3.9-3.7C8 4.2 9.8 3 12 3s4 1.2 4.6 2.9c2.1-.2 3.9 1.5 3.9 3.7 0 1.9-1.3 3.6-3.5 3.9"/><path d="M7 13.5h10V20a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1Z"/><path d="M7 17h10"/>',
 cloche:'<path d="M3.5 17a8.5 8.5 0 0 1 17 0Z"/><circle cx="12" cy="6.9" r="1.3"/><path d="M2 20h20"/><path d="M7.6 13.2a5 5 0 0 1 2.9-3"/>',
 saucepan:'<path d="M3 10h13v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M2 10h15"/><path d="M16 12.5h5.5"/><path d="M7.5 6.8c0-1.1 1-1.3 1-2.4M11.5 6.8c0-1.1 1-1.3 1-2.4"/>',
 skillet:'<circle cx="9" cy="14" r="6"/><circle cx="9" cy="14" r="3.2" stroke-dasharray="2 2.2"/><path d="m13.4 9.9 7.1-6.4"/>',
 whisk:'<path d="M12 21.5V16"/><path d="M12 16C8.5 13 8 3 12 3s3.5 10 0 13Z"/><path d="M12 16c-1.5-3-1.6-9.5 0-13M12 16c1.5-3 1.6-9.5 0-13"/>',
 timer:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5 15 10.5"/><path d="M10 2.5h4M12 2.5V6"/><path d="M18.4 7.1 19.6 5.9"/>',
 probe:'<circle cx="12" cy="7.5" r="4.5"/><path d="m12 7.5 2.1-2.1"/><path d="M12 12v9.5"/><path d="M10.5 12h3"/>',
 pin:'<path d="M5 15.5 15.5 5a2.1 2.1 0 0 1 3 3L8 18.5a2.1 2.1 0 0 1-3-3Z"/><path d="m2.8 21.2 2.4-2.4M18.8 5.2l2.4-2.4"/>',
 bowl:'<path d="M3 11h18a9 9 0 0 1-18 0Z"/><path d="M9 21h6"/><path d="m14.5 11 4-7"/>',
 bell:'<path d="M5 17a7 7 0 0 1 14 0Z"/><path d="M3 20h18"/><path d="M12 10V7.8M10.5 7.8h3"/>',
 spatula:'<path d="M8.5 3h7v8a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1Z"/><path d="M10.8 5.2v4.3M13.2 5.2v4.3"/><path d="M12 12v9.5"/>',
 shaker:'<path d="M8 10h8l-1 10.5H9Z"/><path d="M8 10a4 4 0 0 1 8 0"/><path d="M11 6.5h.01M13 6.5h.01M12 5h.01"/>',
 kept:'<circle cx="12" cy="12" r="9"/><path d="m8 12.4 2.7 2.7L16.2 9.6"/>',
 sharp:'<path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2Z"/>',
 added:'<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>'
};
FX.icon=n=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${FX.ICONS[n]||''}</svg>`;
FX.mountIcons=(root=document)=>root.querySelectorAll('[data-ico]').forEach(el=>{if(!el.dataset.icoOn){el.insertAdjacentHTML('afterbegin',FX.icon(el.dataset.ico));el.dataset.icoOn=1}});

/* ---------- no widows ---------- */
FX.widows=(root=document)=>{root.querySelectorAll('h1,h2,h3,h4,p,li,dd,blockquote,.nw').forEach(el=>{
 if(el.dataset.nw||el.closest('.btn'))return;el.dataset.nw=1;const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let last=null,n;
 while(n=w.nextNode()){if(n.nodeValue.trim())last=n}if(!last)return;const v=last.nodeValue.replace(/\s+$/,'');const i=v.lastIndexOf(' ');
 if(i>0&&v.length-i<16)last.nodeValue=v.slice(0,i)+' '+v.slice(i+1)+last.nodeValue.slice(v.length)})};

/* ---------- words: opacity and lift only (nothing is masked, so nothing clips) ---------- */
FX.split=(root=document)=>{root.querySelectorAll('[data-split]').forEach(el=>{if(el.dataset.splitOn)return;el.dataset.splitOn=1;let i=0;
 const walk=node=>{[...node.childNodes].forEach(c=>{
  if(c.nodeType===3){const f=document.createDocumentFragment();c.nodeValue.split(/( +)/).forEach(p=>{if(!p)return;if(/^ +$/.test(p)){f.append(' ');return}const w=document.createElement('span');w.className='w';w.textContent=p;w.style.setProperty('--i',i++);f.append(w)});c.replaceWith(f)}
  else if(c.nodeType===1&&c.tagName!=='BR'&&!c.classList.contains('w'))walk(c)})};walk(el)})};

/* ---------- scramble + count ---------- */
FX.scramble=el=>{if(reduce)return;const fin=el.dataset.text||(el.dataset.text=el.textContent);const ch='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';let f=0;
 clearInterval(el._sc);el._sc=setInterval(()=>{f++;el.textContent=[...fin].map((c,k)=>c===' '||k<f*1.5?c:ch[(Math.random()*ch.length)|0]).join('');if(f*1.5>=fin.length){clearInterval(el._sc);el.textContent=fin}},30)};
FX.count=el=>{const n=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length;const t0=performance.now(),d=+el.dataset.dur||1300;cancelAnimationFrame(el._ca);
 const f=t=>{const p=Math.min(1,(t-t0)/d);el.textContent=(n*(1-Math.pow(1-p,4))).toFixed(dec);if(p<1)el._ca=requestAnimationFrame(f)};el._ca=requestAnimationFrame(f)};

/* ---------- reveal: plays on the way in, resets on the way out, in both directions ---------- */
FX.reveal=(root=document)=>{
 const io=new IntersectionObserver(es=>es.forEach(e=>{const el=e.target;
  if(e.isIntersecting){el.classList.add('vis');if(el.dataset.count!==undefined)FX.count(el);if(el.dataset.scramble!==undefined)FX.scramble(el)}
  else{el.classList.remove('vis');if(el.dataset.count!==undefined)el.textContent='0'}}),{rootMargin:'-6% 0px -6% 0px'});
 root.querySelectorAll('.rv,[data-split],[data-count],[data-scramble]').forEach(el=>io.observe(el));
};

/* ---------- tilt with a heat sheen that moves against the tilt ---------- */
FX.tilt=(root=document)=>{if(reduce||!fine)return;
 root.querySelectorAll('[data-tilt]').forEach(el=>{if(el.dataset.tiltOn)return;el.dataset.tiltOn=1;const m=+el.dataset.tilt||8;let raf=0,ev=null;
  el.addEventListener('pointermove',e=>{ev=e;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const r=el.getBoundingClientRect();const px=(ev.clientX-r.left)/r.width-.5,py=(ev.clientY-r.top)/r.height-.5;
   el.style.transform=`perspective(900px) rotateY(${(px*m).toFixed(2)}deg) rotateX(${(-py*m).toFixed(2)}deg)`;el.style.setProperty('--sx',((.5-px)*100).toFixed(1)+'%');el.style.setProperty('--tx',px.toFixed(3));el.style.setProperty('--ty',py.toFixed(3));el.style.setProperty('--sy',((.5-py)*100).toFixed(1)+'%');el.classList.add('tilting')})});
  el.addEventListener('pointerleave',()=>{el.style.transform='';el.classList.remove('tilting');el.style.setProperty('--tx',0);el.style.setProperty('--ty',0)});
 })};

/* ---------- heat field: low-res canvas, scaled up. Slow orbiting heat; the cursor pushes it away with a ripple ---------- */
const PAL=(()=>{const stops=[[0,10,8,10,0],[.2,70,10,34,.3],[.42,190,44,92,.6],[.6,226,52,80,.78],[.74,255,58,36,.9],[.88,255,98,20,1],[1,255,150,110,1]];const lut=new Uint8ClampedArray(256*4);
 for(let i=0;i<256;i++){const v=i/255;let k=0;while(k<stops.length-2&&v>stops[k+1][0])k++;const a=stops[k],b=stops[k+1],t=(v-a[0])/(b[0]-a[0]);for(let c=0;c<4;c++)lut[i*4+c]=(a[c+1]+(b[c+1]-a[c+1])*t)*(c===3?255:1)}return lut})();
/* scroll energy: heat bursts out as you scroll, then settles */
const E=FX.E={v:0,t:0,y:scrollY};
addEventListener('scroll',()=>{const now=performance.now(),dy=Math.abs(scrollY-E.y);E.y=scrollY;E.v=Math.min(1,FX.energy(now)+dy/700);E.t=now},{passive:true});
FX.energy=t=>E.v*Math.exp(-(t-E.t)/900);
FX.field=(cv,o={})=>{
 const ctx=cv.getContext('2d');const res=o.res||110;let W=res,H=60,rect=null,vis=false,last=0,img,data;
 const blobs=(o.blobs||[[.3,.4,.42,1],[.7,.3,.38,.9],[.55,.75,.34,.8],[.15,.8,.3,.6]]).map(b=>({cx:b[0],cy:b[1],s:b[2],a:b[3],ph:Math.random()*6.28,x:b[0],y:b[1]}));
 let text=null;
 function size(){rect=cv.getBoundingClientRect();if(!rect.width)return;H=Math.max(8,Math.round(res*rect.height/rect.width));
  if(o.text){text=document.createElement('canvas');text.width=W;text.height=H;const dpr=Math.min(2,devicePixelRatio||1);cv.width=rect.width*dpr;cv.height=rect.height*dpr}
  else{cv.width=W;cv.height=H}
  const c=o.text?text.getContext('2d'):ctx;img=c.createImageData(W,H);data=img.data}
 size();addEventListener('resize',size);
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){size();requestAnimationFrame(frame)}},{rootMargin:'100px'}).observe(cv);
 const I=o.intensity??1,AL=o.alpha??1,SP=o.speed??1,R=o.radius||.22,mode=o.mode||'repel';
 function frame(t){if(!vis)return;requestAnimationFrame(frame);if(t-last<(o.fps?1000/o.fps:33))return;if(o.active&&!o.active())return;last=t;
  rect=cv.getBoundingClientRect();const mx=(M.x-rect.left)/rect.width,my=(M.y-rect.top)/rect.height;const near=M.on&&mx>-.4&&mx<1.4&&my>-.4&&my<1.4;
  const en=FX.energy(t);const act=near?Math.exp(-(t-M.t)/650):0;
  const rot=t*.00003*SP;
  for(const b of blobs){const ax=b.cx-.5,ay=b.cy-.5;const cs=Math.cos(rot),sn=Math.sin(rot);
   let tx=.5+ax*cs-ay*sn+Math.sin(t*.00015*SP+b.ph)*.05,ty=.5+ax*sn+ay*cs+Math.cos(t*.00012*SP+b.ph)*.05;
   if(mode==='repel'&&act>0){const dx=tx-mx,dy=(ty-my)*H/W,d=Math.hypot(dx,dy)+.001,pw=Math.max(0,1-d/.5)*act;tx+=dx/d*pw*.22;ty+=dy/d*pw*.22*W/H}
   b.x+=(tx-b.x)*.05;b.y+=(ty-b.y)*.05}
  const asp=H/W,r2=R*R,burst=1+en*.45,grow=1+en*.4;
  for(let j=0;j<H;j++){const v=j/H;for(let i=0;i<W;i++){const u=i/W;let s=o.base||0;
    for(const b of blobs){const dx=u-b.x,dy=(v-b.y)*asp,ss=b.s*grow;s+=b.a*Math.exp(-(dx*dx+dy*dy)/(ss*ss*asp))}
    if(near){const dx=u-mx,dy=(v-my)*asp,d2=dx*dx+dy*dy;const g=Math.exp(-d2/r2);
     if(mode==='repel')s*=1-.75*g*act;else s+=g*(o.attract||1.1)}
    s*=I*burst;const k=Math.max(0,Math.min(255,s*190))|0;const p=(j*W+i)*4;data[p]=PAL[k*4];data[p+1]=PAL[k*4+1];data[p+2]=PAL[k*4+2];data[p+3]=PAL[k*4+3]*AL}}
  if(o.text){text.getContext('2d').putImageData(img,0,0);const w=cv.width,h=cv.height;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,w,h);
   ctx.globalAlpha=1;ctx.drawImage(text,0,0,w,h);ctx.globalCompositeOperation='destination-in';ctx.fillStyle='#000';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=o.text.font.replace('{s}',Math.round(h*o.text.size));ctx.fillText(o.text.str,w/2,h*.52);
   ctx.globalCompositeOperation='destination-over';ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillText(o.text.str,w/2,h*.52);ctx.globalCompositeOperation='source-over'}
  else ctx.putImageData(img,0,0)}
 return {size};
};

/* ---------- scroll pins: --p 0..1 across a tall wrapper, only on scroll ---------- */
const pins=[];let qd=false;FX.pin=(el,fn)=>{pins.push({el,fn});run()};
function run(){qd=false;const vh=innerHeight;for(const p of pins){const r=p.el.getBoundingClientRect();if(r.bottom<-vh||r.top>vh*2)continue;const span=r.height-vh;const v=span>0?Math.min(1,Math.max(0,-r.top/span)):(r.top<0?1:0);if(v!==p.v){p.v=v;p.el.style.setProperty('--p',v.toFixed(4));p.fn&&p.fn(v,r)}}}
addEventListener('scroll',()=>{if(!qd){qd=true;requestAnimationFrame(run)}},{passive:true});addEventListener('resize',run);

document.addEventListener('pointermove',e=>{const b=e.target.closest&&e.target.closest('.btn');if(!b)return;const r=b.getBoundingClientRect();b.style.setProperty('--bx',(e.clientX-r.left)+'px');b.style.setProperty('--by',(e.clientY-r.top)+'px')},{passive:true});
FX.boot=(root=document)=>{FX.mountIcons(root);FX.widows(root);FX.split(root);FX.tilt(root)};
})();
