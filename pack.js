/* Salo x Yes Chef pack v4 */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),lerp=(a,b,t)=>a+(b-a)*t;
const raf1=fn=>{let q=0,ev;return e=>{ev=e;if(q)return;q=requestAnimationFrame(()=>{q=0;fn(ev)})}};

/* icons grid */
const ICN=[['toque','Toque'],['cloche','Cloche'],['saucepan','Saucepan'],['skillet','Skillet'],['whisk','Whisk'],['timer','Timer'],['probe','Probe'],['pin','Rolling pin'],['bowl','Bowl'],['bell','Order bell'],['spatula','Spatula'],['shaker','Shaker']];
$('#icogrid').innerHTML=ICN.map(([k,n])=>`<div data-ico="${k}" title="${n}"><small>${n}</small></div>`).join('');
FX.boot(document);

/* heat fields */
const P={
 bg:{res:72,fps:24,intensity:.26,speed:.5,radius:.28,blobs:[[.25,.3,.55,1],[.75,.25,.5,.9],[.6,.8,.5,.8],[.1,.85,.45,.6]]},
 gate:{res:90,intensity:.5,speed:.6,radius:.25},
 now:{res:80,intensity:.42,speed:.7,radius:.25},
 pass:{res:72,fps:30,intensity:.78,speed:.9,radius:.2},
 hot:{res:32,fps:24,intensity:.95,speed:1.2,radius:.35},warm:{res:32,fps:24,intensity:.62,speed:.9,radius:.35},cool:{res:32,fps:24,intensity:.32,speed:.6,radius:.35},
 type:{res:56,fps:24,mode:'attract',attract:1.3,intensity:.55,speed:.8,radius:.22,text:{str:'Heat',font:'800 {s}px "Inter Tight", sans-serif',size:.5}},
 photo:{res:56,fps:24,mode:'attract',attract:1.2,intensity:.5,base:.05,alpha:.75,speed:.6,radius:.26,blobs:[[.2,.2,.25,.5],[.8,.8,.25,.4]]},photo2:{res:48,fps:24,intensity:.62,base:.5,alpha:.72,speed:.6,radius:.22},
 menu:{res:72,intensity:.4,speed:.5,radius:.25},deck:{res:72,intensity:.42,speed:.6,radius:.25},close:{res:72,intensity:.72,speed:.7,radius:.25},
 chat:{res:60,intensity:.5,speed:.7,radius:.25},loop:{res:90,intensity:.45,speed:.5,radius:.25}
};
P.bg.active=()=>!top.classList.contains('light');FX.field($('#bgf'),P.bg);FX.field($('#gatef'),P.gate);FX.field($('#nowf'),P.now);
$$('canvas[data-field]').forEach(c=>{const o={...P[c.dataset.field]};const sl=c.closest('.sl');if(sl)o.active=()=>sl.classList.contains('on');FX.field(c,o)});
document.fonts&&document.fonts.ready.then(()=>dispatchEvent(new Event('resize')));

/* ---------- gate ---------- */
const gate=$('#gate');let unlocked=false;try{unlocked=sessionStorage.getItem('yc-pack')==='1'}catch(_){}
FX.reveal(gate);
function start(){gate.classList.add('gone');document.body.classList.remove('locked');scrollTo(0,0);setTimeout(()=>FX.reveal(document.querySelector('main')),200)}
gate.classList.add('ok');
$('#begin').onclick=start;

/* ---------- scroll: progress, top bar, overview fade, nav ---------- */
const top=$('#top'),secs=$$('main>section[id]'),navA=$$('#nav a'),ov=$('#overview');
const onScroll=()=>{const y=scrollY,H=document.documentElement.scrollHeight-innerHeight;
 document.querySelector('.progress').style.setProperty('--sp',(y/H).toFixed(4));
 ov.style.setProperty('--ov',clamp(y/innerHeight).toFixed(3));
 top.classList.toggle('scrolled',y>40);
 let cur=secs[0];for(const s of secs){if(s.getBoundingClientRect().top<=innerHeight*.35)cur=s}
 top.classList.toggle('light',cur.dataset.tone==='light');
 const id=cur.id==='loop'?'work':cur.id;navA.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+id));};
addEventListener('scroll',raf1(onScroll),{passive:true});onScroll();
$('#again').addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'})});

/* ---------- compare: drag, and a sweep each time it comes into view ---------- */
(function(){const cmp=$('#cmp'),img=$('#nowm');let drag=false,anim=0;
 const set=v=>cmp.style.setProperty('--cut',clamp(v,0,100)+'%');set(50);
 const from=e=>{const r=cmp.getBoundingClientRect();set((e.clientX-r.left)/r.width*100)};
 cmp.addEventListener('pointerdown',e=>{drag=true;cancelAnimationFrame(anim);cmp.setPointerCapture(e.pointerId);from(e)});
 let hov=false;cmp.addEventListener('pointerenter',()=>{hov=true;cancelAnimationFrame(anim)});cmp.addEventListener('pointerleave',()=>{hov=false});
 cmp.addEventListener('pointermove',raf1(e=>{cancelAnimationFrame(anim);from(e);const r=cmp.getBoundingClientRect();img.style.setProperty('--dx',(((e.clientX-r.left)/r.width-.5)*2).toFixed(3));img.style.setProperty('--dy',(((e.clientY-r.top)/r.height-.5)*2).toFixed(3))}));
 cmp.addEventListener('pointerup',()=>drag=false);
 new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting||drag||hov)return;const t0=performance.now();const f=t=>{const p=clamp((t-t0)/2600);const k=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;set(p<.5?lerp(50,100,k*2):lerp(100,0,(k-.5)*2)*1+0);if(p<1&&!drag&&!hov)anim=requestAnimationFrame(f)};anim=requestAnimationFrame(f)}),{threshold:.6}).observe(cmp);
})();

/* ---------- heat over type: only the serif warms ---------- */
(function(){const t=$('#t-over'),its=[...t.querySelectorAll('.it')];
 const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));const C0=[125,120,113],C1=[222,56,96],C2=[255,92,20],C3=[255,190,150];
 t.addEventListener('pointermove',raf1(e=>its.forEach(el=>{const r=el.getBoundingClientRect();const d=Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2));const k=clamp(1-d/360);const c=k<.4?mix(C0,C1,k/.4):k<.8?mix(C1,C2,(k-.4)/.4):mix(C2,C3,(k-.8)/.2);el.style.color=`rgb(${c})`;el.style.textShadow=k>.5?`0 0 ${Math.round((k-.5)*60)}px rgba(255,80,30,${(k-.5).toFixed(2)})`:'none'})));
 t.addEventListener('pointerleave',()=>its.forEach(el=>{el.style.color='';el.style.textShadow=''}));})();

/* ---------- type specimen weight ---------- */
(function(){const spec=$('#spec');const walk=n=>[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();[...c.nodeValue].forEach(ch=>{if(/\s/.test(ch)){f.append(ch);return}const s=document.createElement('span');s.className='l';s.textContent=ch;f.append(s)});c.replaceWith(f)}else if(c.nodeType===1&&!c.classList.contains('it'))walk(c)});
 walk(spec);const ls=[...spec.querySelectorAll('.l')];
 spec.parentElement.addEventListener('pointermove',raf1(e=>ls.forEach(l=>{const r=l.getBoundingClientRect();const d=Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2));l.style.setProperty('--wg',Math.round(700-400*Math.max(0,1-d/160)))})));
 spec.parentElement.addEventListener('pointerleave',()=>ls.forEach(l=>l.style.setProperty('--wg',700)));})();

/* ---------- UI pieces ---------- */
(function(){const tabs=$('#tabsx'),pill=tabs.querySelector('.pill'),bs=[...tabs.querySelectorAll('button')];
 const place=b=>{pill.style.left=b.offsetLeft+'px';pill.style.width=b.offsetWidth+'px'};
 bs.forEach(b=>b.onclick=()=>{bs.forEach(x=>x.classList.toggle('on',x===b));place(b)});setTimeout(()=>place(bs[0]),300);addEventListener('resize',()=>place(tabs.querySelector('.on')));
 const tg=$('#tgl');tg.onclick=()=>tg.setAttribute('aria-pressed',tg.getAttribute('aria-pressed')!=='true');
 const tp=$('#temp'),inp=tp.querySelector('input'),out=$('#tempv');const upd=()=>{const v=+inp.value;out.textContent=v+'°';const k=(v-40)/220;tp.style.setProperty('--tc',k<.33?'#de3860':k<.66?'#ff3121':'#ff5c00');tp.closest('.uib').style.setProperty('--hv',k.toFixed(3))};inp.oninput=upd;upd();})();

/* ---------- ticket story: prints from the slot, gets stamped, tears halfway and drops ---------- */
(function(){const story=$('#tstory'),pr=$('#printer'),tk=$('#tk'),tk2=$('#tk2'),stamp=$('#tstamp'),st=$('#tstatus'),steps=$$('#tsteps li');
 FX.pin(story,p=>{const k=clamp(p/.34);const stepped=Math.round(k*22)/22;tk.style.setProperty('--ty2',((stepped-1)*101).toFixed(1)+'%');
  const step=p<.34?0:p<.52?1:p<.7?2:3;steps.forEach((li,i)=>li.classList.toggle('on',i<=step));st.textContent=['Printing','Heard','On the pass','Served'][step];
  const on=p>=.38;stamp.textContent=p>=.72?'Served':'Heard';stamp.style.setProperty('--so',on?1:0);stamp.style.setProperty('--ss',on?1:2.2);
  pr.classList.toggle('torn',p>=.72);const t=clamp((p-.72)/.24),e=t*t;
  tk2.style.setProperty('--bx',(e*70)+'px');tk2.style.setProperty('--by',(e*190+(p>=.72?14:0))+'px');tk2.style.opacity=(1-clamp((p-.86)/.12)).toFixed(3);tk2.style.setProperty('--br',(e*12+(p>=.72?2.5:0))+'deg')});})();

/* ---------- rail: tickets flutter as the cursor passes ---------- */
(function(){const work=[['Aikido','Security','Retainer'],['Beautiful.ai','SaaS','2× conv.'],['Ebury','Fintech','39 locales'],['Daddy Yankee','Music','5 weeks'],['Float','Fintech','Retainer'],['Cybrary','EdTech','Migration'],['Wiza','Sales tech','Rebuild']];
 const box=$('#railtk');box.innerHTML=work.map((w,k)=>`<div class="tk" style="left:${9+k*13.6}%"><div class="clip"></div><div class="sh"><div class="slip bot"><div class="hd"><span>No. ${String(k+1).padStart(2,'0')}</span><span>${w[1]}</span></div><h5>${w[0]}</h5><div class="ln"><span>Status</span><i></i><b>${w[2]}</b></div></div></div></div>`).join('');
 const tks=[...box.children].map(el=>({el,a:0,v:0}));let lx=null,run=false;
 const loop=()=>{let moving=false;tks.forEach(t=>{t.v+=-t.a*.05;t.v*=.9;t.a=clamp(t.a+t.v,-12,12);if(Math.abs(t.a)>.05||Math.abs(t.v)>.05)moving=true;t.el.style.setProperty('--sw',t.a.toFixed(2)+'deg')});if(moving)requestAnimationFrame(loop);else run=false};
 $('#rail').addEventListener('pointermove',e=>{if(lx===null){lx=e.clientX;return}const dx=e.clientX-lx;lx=e.clientX;tks.forEach(t=>{const r=t.el.getBoundingClientRect();if(e.clientX>r.left-24&&e.clientX<r.right+24&&e.clientY>r.top-30&&e.clientY<r.bottom)t.v+=dx*.035+(Math.random()-.5)*.4});if(!run){run=true;requestAnimationFrame(loop)}});
 $('#rail').addEventListener('pointerleave',()=>lx=null);})();

/* ---------- scroll-linked tiles: paper sun, pass windows ---------- */
(function(){const els=$$('.t-paper,.t-win');let run=false;
 const upd=()=>{const now=performance.now(),en=FX.energy(now);els.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;el.style.setProperty('--sp',clamp((r.top+r.height/2)/innerHeight).toFixed(3));el.style.setProperty('--en',en.toFixed(3))});if(en>.01)requestAnimationFrame(upd);else run=false};
 addEventListener('scroll',()=>{if(!run){run=true;requestAnimationFrame(upd)}},{passive:true});})();
/* ---------- kinetic type + odometer ---------- */
(function(){const roll=$('#roll'),n=roll.children.length;let i=0,tm=0;
 const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){if(!tm)tm=setInterval(()=>{i++;roll.style.setProperty('--ri',i);[...roll.children].forEach(c=>c.style.setProperty('--ri',i));if(i===n-1)setTimeout(()=>{[...roll.children].forEach(c=>{c.style.transition='none';c.style.setProperty('--ri',0)});i=0;void roll.offsetWidth;[...roll.children].forEach(c=>c.style.transition='')},950)},1800);
  const o=$('#odo');let v=0;clearInterval(o._t);o._t=setInterval(()=>{v++;o.textContent=String(v).padStart(2,'0');if(v>=24)clearInterval(o._t)},60)}else{clearInterval(tm);tm=0}});io.observe(roll);})();
/* ---------- type on scroll: words light up as you read down ---------- */
(function(){const el=$('#sline');const ws=[...el.querySelectorAll('.w')];
 addEventListener('scroll',raf1(()=>{const r=el.getBoundingClientRect();const p=clamp((innerHeight*1.02-r.top)/(innerHeight*.62));const n=Math.round(p*ws.length);ws.forEach((w,k)=>w.classList.toggle('lit',k<n))}),{passive:true});})();

/* ---------- switch ---------- */
(function(){const sec=$('#switch'),mock=$('#mock'),toks=$$('#toks li'),n=toks.length;let last=-1;
 FX.pin(sec,p=>{const k=Math.min(n,Math.floor(clamp((p-.05)/.82)*(n+.999)));if(k===last)return;last=k;
  for(let i=1;i<=n;i++)mock.classList.toggle('s'+i,k>=i);toks.forEach((li,i)=>li.classList.toggle('on',i<k));
  $('#m-t').classList.toggle('on',k<n);$('#m-e').classList.toggle('on',k>=n)});})();

/* ---------- deck: grows, holds while slides change, zooms back out ---------- */
(function(){const sec=$('#deck'),shell=$('#dkshell'),win=$('#dkwin'),fit=$('#dkfit'),slides=$$('.sl'),dots=document.createElement('div'),ttl=document.createElement('div');
 const titles=['Cover','The kitchen','Daddy Yankee','Selected work','The menu','Word of mouth','Yes, Chef.'];const N=slides.length;let cur=0;
 dots.innerHTML=titles.map((_,k)=>`<i class="${k?'':'on'}"></i>`).join('');
 const sizeFit=()=>fit.style.setProperty('--fs',Math.min(innerWidth/1600,innerHeight/900).toFixed(4));sizeFit();addEventListener('resize',sizeFit);
 const G=.07,E=.9;
 const big=$('.d6 .big');let st6=0;
 const go=i=>{if(i===cur)return;clearTimeout(st6);big.classList.remove('settled');if(i===5)st6=setTimeout(()=>big.classList.add('settled'),1800);slides[cur].classList.remove('on');cur=i;slides[i].classList.add('on');[...dots.children].forEach((d,k)=>d.classList.toggle('on',k===i));ttl.textContent=String(i+1).padStart(2,'0')+' '+titles[i];
  slides[i].querySelectorAll('[data-dc]').forEach(el=>{el.dataset.count=el.dataset.dc;FX.count(el)})};
 FX.pin(sec,(p,r)=>{const g=p<G?p/G:p>E?1-(p-E)/(1-E):1;const e=g<1?1-Math.pow(1-clamp(g),3):1;
  const s0=Math.min(.62,(innerHeight*.58)/innerHeight);const s=lerp(s0,1,e);
  win.style.setProperty('--ws',s.toFixed(4));win.style.setProperty('--wy',(lerp(innerHeight*.11,0,e)).toFixed(1)+'px');win.style.setProperty('--wr',(lerp(30,0,e)/s).toFixed(1)+'px');
  shell.style.setProperty('--ho',(1-e).toFixed(3));win.style.setProperty('--uo',e>.97?1:0);
  top.classList.toggle('hide',e>.97&&r.top<=0&&r.bottom>=innerHeight);
  const i=Math.min(N-1,Math.max(0,Math.floor((p-G)/(E-G)*N)));go(i)});
 const pm=raf1(e=>{const r=win.getBoundingClientRect();fit.style.setProperty('--dx',(((e.clientX-r.left)/r.width-.5)*2).toFixed(3));fit.style.setProperty('--dy',(((e.clientY-r.top)/r.height-.5)*2).toFixed(3))});
 win.addEventListener('pointermove',pm);
})();

/* ---------- audit ---------- */
(function(){const A=window.AUDIT;const col=c=>`var(--c-${c})`;const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
 const SHORT={ux:'UX',journey:'Journey',content:'Content',ui:'Visual',a11y:'Access',perf:'Speed',dev:'Code',seo:'SEO'};
 const order=[...A.notes.filter(n=>!n.lock&&n.d),...A.notes.filter(n=>n.lock&&n.d)];order.forEach((n,k)=>n.no=k+1);
 const open=order.filter(n=>!n.lock).length;$('#a-open').textContent=open+' notes you can open';$('#a-count').textContent=`${order.length} notes · ${open} open`;
 const cats=Object.keys(A.cats).filter(c=>A.notes.some(n=>n.cat===c));
 const area=c=>Math.max(0,10-A.notes.filter(n=>n.cat===c).reduce((s,n)=>s+A.rating[n.sev],0));
 const scores=cats.map(c=>[c,area(c)]);const avg=(scores.reduce((s,x)=>s+x[1],0)/scores.length).toFixed(1);
 const rate=$('#a-rate');rate.dataset.count=avg;rate.dataset.dur=1600;$('#as-r').textContent=avg;
 FX.reveal($('#ax'));const io=new IntersectionObserver(es=>{if(es[0].isIntersecting)FX.count(rate)});io.observe(rate);
 const sev=s=>A.notes.filter(n=>n.sev===s).length;const sc={high:'hi',medium:'md',low:'lo'};
 $('#a-leg').innerHTML=['high','medium','low'].map(s=>`<li><span><i style="background:var(--${sc[s]})"></i>${s[0].toUpperCase()+s.slice(1)}</span><b>${sev(s)}</b></li>`).join('');
 $('#as-s').innerHTML=['high','medium','low'].map(s=>`<span><i style="background:var(--${sc[s]})"></i>${sev(s)} ${s}</span>`).join('');
 $('#a-areas').innerHTML=scores.map(([c,v],k)=>`<div class="ax-ar"><span>${A.cats[c]}</span><b>${v.toFixed(1)}</b><div class="ax-bar"><i style="--v:${v/10};--c:${col(c)};--i:${k}"></i></div></div>`).join('');
 $('#a-method').textContent='Each area starts at 10 and loses 1.5 for a high note, 0.8 for medium and 0.4 for low. The rating is the average across areas.';
 const ring=(s,k)=>{const c=s.v>=90?'var(--lo)':s.v>=50?'var(--md)':'var(--hi)';return `<div class="ax-ring"><svg viewBox="0 0 100 100"><circle class="t" cx="50" cy="50" r="40" pathLength="100"/><circle class="f" cx="50" cy="50" r="40" pathLength="100" style="--v:${s.v};--c:${c};--i:${k}"/><text x="50" y="62" text-anchor="middle">${s.v}</text></svg><span class="ax-rl">${s.k}</span></div>`};
 $('#a-rings').innerHTML=A.scores.map(ring).join('');$('#as-l').innerHTML=A.scores.map(ring).join('');
 $('#a-vit').innerHTML=A.vitals.map(v=>`<div class="${v.bad?'bad':'ok'}"><span class="ax-vk">${v.k}</span><b>${v.v}</b><em><i></i>Target ${v.target}</em></div>`).join('');
 $('#a-weight').innerHTML=A.weight.map(w=>`<span><b>${w[0]}</b> ${w[1]}</span>`).join('');
 $('#a-works').innerHTML=A.works.map(w=>`<li><i>✓</i>${esc(w)}</li>`).join('');
 const Pg=A.pages.desktop;$('#a-shot').innerHTML=Pg.tiles.map((t,k)=>`<img src="assets/audit/desktop-${k}.webp" width="${t[0]}" height="${t[1]}" alt="" loading="lazy">`).join('');
 $('#a-note').textContent=`Screenshot of the live homepage, ${A.captured}. Click any note for the detail.`;
 const L=$('#a-layer');
 order.forEach(n=>{const [x,y]=n.d;
  const d=document.createElement('button');d.type='button';d.className='dot'+(n.lock?' lock':'');d.style.setProperty('--c',col(n.cat));d.style.left=(x/Pg.w*100)+'%';d.style.top=(y/Pg.h*100)+'%';d.dataset.no=n.no;d.textContent=n.lock?'':n.no;d.setAttribute('aria-label',n.lock?`Note ${n.no}, in the full audit`:`Note ${n.no}: ${n.title}`);
  const c=document.createElement('button');c.type='button';c.className='ncard'+(n.lock?' lock':'');c.style.setProperty('--c',col(n.cat));c.dataset.no=n.no;c.dataset.y=y/Pg.h;c.dataset.x=x/Pg.w;
  c.innerHTML=n.lock?`<span class="n">${n.no}</span><span class="sk"><i style="width:92%"></i><i style="width:64%"></i></span><span class="meta"><span class="tag">Full audit</span><span class="sv2 ${n.sev}">${n.sev[0].toUpperCase()+n.sev.slice(1)}</span></span>`
   :`<span class="n">${n.no}</span><span class="t">${esc(n.title)}</span><span class="meta"><span class="tag"><i></i>${SHORT[n.cat]}</span><span class="sv2 ${n.sev}">${n.sev[0].toUpperCase()+n.sev.slice(1)}</span></span>`;
  [d,c].forEach(el=>{el.onclick=()=>openNote(n.no);el.onmouseenter=()=>hover(n.no,true);el.onmouseleave=()=>hover(n.no,false)});L.append(d,c)});
 function layout(){const st=$('#a-stage');const H=$('#a-shot').offsetHeight;if(!H)return;const bot={l:-1e9,r:-1e9};
  [...st.querySelectorAll('.ncard')].sort((a,b)=>a.dataset.y-b.dataset.y).forEach(c=>{const x=+c.dataset.x;const want=c.dataset.y*H-22;
   const side=x<.38?'l':x>.62?'r':(Math.max(want,bot.l+10)<=Math.max(want,bot.r+10)?'l':'r');c.classList.remove('l','r');c.classList.add(side);const t=Math.max(want,bot[side]+10);c.style.top=t+'px';bot[side]=t+c.offsetHeight})}
 $$('#a-shot img').forEach(im=>im.addEventListener('load',layout));addEventListener('resize',layout);setTimeout(layout,400);
 new IntersectionObserver(es=>{if(es[0].isIntersecting)layout()}).observe($('#a-stage'));
 const asum=$('#asum'),ax=$('#ax'),wk=$('.wk');addEventListener('scroll',raf1(()=>{const a=ax.getBoundingClientRect(),w=wk.getBoundingClientRect();asum.classList.toggle('on',a.bottom<90&&w.top>innerHeight*.4)}),{passive:true});
 function hover(no,on){$(`.dot[data-no="${no}"]`)?.classList.toggle('hov',on);$(`.ncard[data-no="${no}"]`)?.classList.toggle('hov',on);lead(on?no:$('.ncard.on')?.dataset.no)}
 function lead(no){const p=$('#lead');if(!no){p.classList.remove('on');return}const d=$(`.dot[data-no="${no}"]`),c=$(`.ncard[data-no="${no}"]`);if(!d||!c||getComputedStyle(c).display==='none'){p.classList.remove('on');return}
  const Lr=L.getBoundingClientRect(),dr=d.getBoundingClientRect(),cr=c.getBoundingClientRect();const x1=dr.left+dr.width/2-Lr.left,y1=dr.top+dr.height/2-Lr.top;const isL=c.classList.contains('l');const x2=(isL?cr.right:cr.left)-Lr.left,y2=cr.top+18-Lr.top;const mx=(x1+x2)/2;
  p.setAttribute('d',`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);p.style.stroke=getComputedStyle(c).getPropertyValue('--c');p.classList.add('on')}
 const dr=$('#drawer');
 function close(){dr.classList.remove('open');dr.setAttribute('aria-hidden','true');$$('.dot.on,.ncard.on').forEach(x=>x.classList.remove('on'));$('#a-stage').classList.remove('focus');lead(null)}
 addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 function openNote(no){const n=order.find(x=>x.no===no);if(!n)return;
  $$('.dot.on,.ncard.on').forEach(x=>x.classList.remove('on'));$(`.dot[data-no="${no}"]`)?.classList.add('on');$(`.ncard[data-no="${no}"]`)?.classList.add('on');$('#a-stage').classList.add('focus');lead(no);
  const pv=order[no-2],nx=order[no];
  dr.innerHTML=`<button class="x" aria-label="Close">✕</button><div class="head"><div class="chips"><span class="n" style="background:${col(n.cat)}">${n.no}</span><span class="tg"><i style="width:7px;height:7px;border-radius:50%;background:${col(n.cat)}"></i>${A.cats[n.cat]}</span><span class="sv2 ${n.sev}">${n.sev[0].toUpperCase()+n.sev.slice(1)} priority</span></div><h3>${n.lock?'This note is in the full audit':esc(n.title)}</h3></div>`+
   (n.lock?`<div class="lockmsg"><b>${order.filter(x=>x.lock).length} more notes in the full audit.</b><p>Each one opened and prioritised, with the fix.</p></div>`
   :`<dl><div><dt>What we saw</dt><dd>${esc(n.saw)}</dd></div><div><dt>Why it matters</dt><dd>${esc(n.why)}</dd></div><div><dt>The fix</dt><dd>${esc(n.fix)}</dd></div></dl>${n.code?`<pre>${esc(n.code)}</pre>`:''}<p class="src">Source: ${esc(n.src)}</p>`)+
   `<div class="nv"><button ${pv?'':'disabled'} data-go="${pv?pv.no:''}">← ${pv?pv.no:''}</button><button ${nx?'':'disabled'} data-go="${nx?nx.no:''}">${nx?nx.no:''} →</button></div>`;
  dr.classList.add('open');dr.setAttribute('aria-hidden','false');dr.querySelector('.x').onclick=close;
  dr.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{if(b.dataset.go){openNote(+b.dataset.go);$(`.dot[data-no="${b.dataset.go}"]`)?.scrollIntoView({behavior:'smooth',block:'center'})}});
  FX.widows(dr)}
})();
})();
