/* ================= drawing the frame ================= */
function shade(h,a){const n=parseInt(h.slice(1),16);const f=v=>Math.max(0,Math.min(255,Math.round(v+(a>0?(255-v)*a:v*a))));return`rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`}
const CFG={mode:'bal',sound:true,voice:true,nick:'',hero:'ren'};
try{Object.assign(CFG,JSON.parse(localStorage.getItem('sc3d_cfg')||'{}'))}catch(e){}
const saveCfg=()=>{try{localStorage.setItem('sc3d_cfg',JSON.stringify(CFG))}catch(e){}};
function beginFrame(){for(const k in M){const a=M[k];for(const m of(Array.isArray(a)?a:[a]))if(m.count!==m.base){m.count=m.base;m.dirty=true}}G.spr.count=0;G.beam.count=0}
function torus(p,a,tilt,r,c,em){const ct=Math.cos(tilt),st=Math.sin(tilt),u=[Math.cos(a),0,Math.sin(a)],v=norm([-Math.sin(a)*ct,st,Math.cos(a)*ct]),n=cross(u,v);inst(M.ring,p,mul(u,r),mul(n,r),mul(v,r),c,1,0,em,5)}
function drawScene(dt){const t=E.t,p=S.pl,nat=HERO[S.hero].nat,hc=ELL[HERO[S.hero].el];
 for(const c of W.crystals){const y=c.p[1]+Math.sin(t*1.1+c.ph)*.25,s=c.s,k=c.main?(1.6+E.k*2.6+(S.tr?3:0)):(3+1.2*Math.sin(t*2.3+c.ph));put(M.crys,[c.p[0],y,c.p[2]],s,s*(c.main?1.5:1.25),s,c.c,1,0,k,15,0,t*.7+c.ph);
  spr(c.p[0],y,c.p[2],s*(c.main?4:6),c.c[0],c.c[1],c.c[2],.32+E.k*.2,0);if(!c.main&&Math.random()<dt*7)part([c.p[0]+(Math.random()-.5)*.3,y-.3,c.p[2]+(Math.random()-.5)*.3],[(Math.random()-.5)*.4,1.1,(Math.random()-.5)*.4],1.5,.07,mul(c.c,2.6),0,-.4,.4)}
 for(const l of W.lights){if(l.glow)spr(l.p[0],l.p[1]+34.5*l.glow/8,l.p[2],l.glow*.8,3.2,2,.8,.5,0);else if(l.r&&l.r<14)spr(l.p[0],l.p[1],l.p[2],1.25,l.c[0]*.3,l.c[1]*.3,l.c[2]*.3,1,0)}
 for(const d of W.drift)put(M.rock[d.m],[d.p[0],d.p[1]+Math.sin(t*d.sp+d.ph)*1.6,d.p[2]],d.s,d.s*.8,d.s*1.1,[.3,.29,.28],.85,0,0,2,d.ph,d.ph+t*.03);
 /* drifting motes and falling golden leaves */
 const mc=lerp3([2.4,1.6,.6],[1.1,.7,2.6],E.k);for(let i=0;i<110;i++){const hx=hash2(i,1),hy=hash2(i,2),hz=hash2(i,3),w=(v,c)=>((v-c)%44+66)%44-22+c;
  const x=w(hx*44+t*(hz-.5)*.5,C.pos[0]),y=w(hy*24+t*(.1+hx*.15),C.pos[1]+4),z=w(hz*44+t*(hx-.5)*.5,C.pos[2]);spr(x,y,z,.035+.04*hy,mc[0],mc[1],mc[2],.5+.5*Math.sin(t*2+i),0)}
 if(Math.random()<dt*9){const g=W.gtree;part([g[0]+(Math.random()-.5)*20,g[1]+12+Math.random()*7,g[2]+(Math.random()-.5)*20],[.8+Math.random(),-1-Math.random(),.6+Math.random()*.6],7,.07,[2.6,1.5,.3],0,0,0)}
 /* orbs */
 const NO=NATORBS(nat);for(const o of S.orbs){if(o.got||!o.vis)continue;const O=NO[Math.min(S.got,4)],c=hexL(O.c[0]),y=o.p[1]+Math.sin(t*1.6+o.i)*.16,sc=.33+.035*S.got,P=[o.p[0],y,o.p[2]];
  put(M.sph,P,sc,sc,sc,c,.1,0,o.locked?.5:2.3,6);torus(P,t*1.3,.5,sc*1.7,c,o.locked?.6:3);torus(P,-t*.9+2,1.1,sc*2.1,c,o.locked?.4:2.2);if(S.got>=3)torus(P,t*.6+4,1.45,sc*2.5,c,2);
  if(o.locked){spr(P[0],P[1],P[2],1.6,.5,.1,.9,.5+.3*Math.sin(t*5),1);spr(P[0],P[1],P[2],1.9,.02,.01,.04,.55,3)}
  else{beam([P[0],P[1]+.5,P[2]],[P[0],P[1]+52,P[2]],.8,c,.2);spr(P[0],P[1],P[2],2.2,c[0],c[1],c[2],.45,0);dynLight(P,mul(c,6),11);const gy=hAt(P[0],P[2]);if(gy>-999&&P[1]-gy<4){spr(P[0],gy+.06,P[2],1.5+.2*Math.sin(t*3),c[0]*1.3,c[1]*1.3,c[2]*1.3,.5,2);spr(P[0],gy+.07,P[2],.9,c[0]*2,c[1]*2,c[2]*2,.5,1)}
   for(let q=0;q<6;q++){const a=t*(1.5+q*.2)+q*1.05,rr2=sc*(1.9+.5*Math.sin(t+q));spr(P[0]+Math.cos(a)*rr2,P[1]+Math.sin(a*1.3+q)*sc*.9,P[2]+Math.sin(a)*rr2,.07,c[0]*3,c[1]*3,c[2]*3,1,0)}if(Math.random()<dt*10)part([P[0]+(Math.random()-.5),P[1]+(Math.random()-.5),P[2]+(Math.random()-.5)],[0,.6,0],1,.05,mul(c,3),0,-.3,.5)}}
 /* characters */
 const cloaks=[],chars=[p];if(S.state!=='title')for(const c of S.npcs)chars.push(c);for(const e of S.en)chars.push(e);for(const k in Net.chars)chars.push(Net.chars[k].c);
 for(const c of chars){poseChar(c,dt);if(c.cloak)cloaks.push(c.cloak.m)}S.drawn=chars;
 {const fl=norm([C.pos[0]-p.pos[0],0,C.pos[2]-p.pos[2]]),tt=S.state==='title';dynLight([p.pos[0]+fl[0]*1.5,p.pos[1]+2*p.sc,p.pos[2]+fl[2]*1.5],tt?[.95,.8,.66]:add([.4,.34,.3],mul(hc,S.tr?5:.4)),tt?7:S.tr?13:6.5)}
 if(S.pick){const k=S.pick,c=hexL(k.O.c[0]),ch=p.chest||p.pos,g=sstep(0,.85,k.t),a=k.t*9,to=[ch[0],ch[1]+.25,ch[2]],P=k.done?to:[lerp(k.from[0],to[0],g)+Math.cos(a)*(1-g)*1.2,lerp(k.from[1],to[1]+1.2*Math.sin(g*3.14),g),lerp(k.from[2],to[2],g)+Math.sin(a)*(1-g)*1.2];
  if(!k.done){const sc=.36*(1-.6*g);put(M.sph,P,sc,sc,sc,c,.1,0,3,6);torus(P,a,.5,sc*2,c,4);torus(P,-a*.7,1.2,sc*2.6,c,3);spr(P[0],P[1],P[2],2.2+2*g,c[0]*1.5,c[1]*1.5,c[2]*1.5,1,0);
   for(let q=0;q<8;q++){let d;do{d=[Math.random()*2-1,Math.random()*2-1,Math.random()*2-1]}while(dot(d,d)>1);d=norm(d);const r=4+Math.random()*4;part([ch[0]+d[0]*r,ch[1]+d[1]*r,ch[2]+d[2]*r],mul(d,-r/.4),.4,.07,mul(c,2.6),0)}
   spr(p.pos[0],p.pos[1]+.1,p.pos[2],5*(1-g)+1,c[0]*2,c[1]*2,c[2]*2,.6,1);for(let q=0;q<3;q++)torus(ch,k.t*(4+q)+q*2,.5+q*.6,(2.4-q*.5)*(1-g)+.5,c,2+4*g)}dynLight(P,mul(c,6+14*g),12)}
 if(S.asc){const A=S.asc,t2=A.t,ch=p.chest||p.pos,gy=A.y0,g=clamp(t2/2.6,0,1),W1=[2.2,2.2,2.2];
  if(t2<2.6){for(let q=0;q<12;q++){let d;do{d=[Math.random()*2-1,Math.random()*2-1,Math.random()*2-1]}while(dot(d,d)>1);d=norm(d);const r=8+Math.random()*7;part([ch[0]+d[0]*r,ch[1]+d[1]*r,ch[2]+d[2]*r],mul(d,-r/.5),.5,.07+.06*Math.random(),lerp3(mul(hc,2.6),W1,Math.random()*.5),0)}
   E.expMul=1-.42*g;for(const cr of W.crystals){const d=sub(ch,cr.p),L=vlen(d),tt=.55;for(let q=0;q<2;q++)part([cr.p[0]+(Math.random()-.5)*.3,cr.p[1]+(Math.random()-.5)*.3,cr.p[2]+(Math.random()-.5)*.3],mul(d,1/tt),tt*(.9+.1*Math.random()),.1+.1*g,mul(cr.c,2.2+2*g),0)}
   for(let i=0;i<5;i++){const a=t2*(3+g*7)+i*1.2566,r=(1-g)*6+.45,P=[ch[0]+Math.cos(a)*r,ch[1]+(1-g)*2.6*Math.sin(i*2+t2*2),ch[2]+Math.sin(a)*r],P2=[ch[0]+Math.cos(a-.7)*r,P[1],ch[2]+Math.sin(a-.7)*r],c=hexL(NO[i].c[0]);put(M.sph,P,.17,.17,.17,c,.1,0,3.2,6);spr(P[0],P[1],P[2],.7,c[0],c[1],c[2],.8,0);beam(P2,P,.16,c,1)}
   for(let k=0;k<3;k++)torus(ch,t2*(2+k)+k*2,.45+k*.5,(1.2+k*.7)*(.35+.65*g),hc,1+1.4*g);
   spr(p.pos[0],gy+.12,p.pos[2],3+5.5*g,hc[0]*1.1,hc[1]*1.1,hc[2]*1.1,.6,1);spr(p.pos[0],gy+.14,p.pos[2],1.6+3*g,1,1,1,.4,1);for(let q=0;q<14;q++){const a=q*.449+t2*.8,r=5.2*g+1.4;spr(p.pos[0]+Math.cos(a)*r,gy+.2,p.pos[2]+Math.sin(a)*r,.22,hc[0]*3,hc[1]*3,hc[2]*3,1,0)}
   for(let i=0;i<16;i++){const a=i*2.4+1,r=2.6+(i%5)*1.5,s=.12+(i%4)*.07;put(M.rock[i%3],[p.pos[0]+Math.cos(a+t2*.25)*r,gy+g*g*(1.2+(i%4)*.9)+Math.sin(t*2+i)*.08,p.pos[2]+Math.sin(a+t2*.25)*r],s,s,s,[.3,.28,.3],.8,0,.1+g*.4,2,i,t2*1.5+i)}
   dynLight(ch,mul(hc,3+10*g),15)}
  else{const k=clamp((t2-2.6)/4.2,0,1),e=1-k,ee=Math.exp(-(t2-2.6)*2.4);E.expMul=lerp(1.3,1,sstep(2.6,4.2,t2));beam([p.pos[0],gy,p.pos[2]],[p.pos[0],gy+110,p.pos[2]],5*e*e+1,hc,1.5*e+.3);spr(ch[0],ch[1],ch[2],8+46*Math.min(1,(t2-2.6)*1.3),hc[0]*1.6*ee,hc[1]*1.6*ee,hc[2]*1.6*ee,1,0);dynLight(ch,mul(hc,16*e+4),28);
   for(let q=0;q<6;q++)part([ch[0]+(Math.random()-.5)*2,ch[1]-1+Math.random()*2,ch[2]+(Math.random()-.5)*2],[(Math.random()-.5)*2,3+Math.random()*4,(Math.random()-.5)*2],1.6,.07,mul(hc,3),0,-1,.2)}}
 if(!S.asc)E.expMul=1;
 if(S.tr&&(!S.asc||S.asc.blast)){const u=S.asc?sstep(2.6,4,S.asc.t):1,it=S.asc?1.1:.34,f=[Math.sin(p.yaw),0,Math.cos(p.yaw)],r=[-Math.cos(p.yaw),0,Math.sin(p.yaw)],ch=p.chest||p.pos,base=add(ch,mul(f,-.2)),hd=p.head||ch,els=Object.keys(ELL);
  for(const sg of[-1,1])for(let i=0;i<7;i++){const el=lerp(1.2,-.8,i/6)+Math.sin(t*2.1+i*.5)*.05,dir=norm(add(add(mul(r,sg*Math.cos(el)*(.35+.65*u)),[0,Math.sin(el),0]),mul(f,-.38))),L=(2.5-Math.abs(i-2)*.27)*u*p.sc,b0=add(base,mul(r,sg*.13)),tip=add(b0,mul(dir,L));
   beam(b0,tip,.3*u,hc,it);beam(b0,add(b0,mul(dir,L*.55)),.11*u,[1.7,1.7,1.7],it*.7);if(Math.random()<dt*4)part(tip,[0,-.4,0],1.2,.05,mul(hc,3),0,.5,.5)}
  for(let i=0;i<7;i++){const a=t*.9+i*.8976,P=[hd[0]+Math.cos(a)*.26*p.sc,hd[1]+(.2+Math.sin(t*2+i)*.02)*p.sc,hd[2]+Math.sin(a)*.26*p.sc],c=ELL[els[i]];inst(M.crys,P,[.028*u,0,0],[0,.075*u,0],[0,0,.028*u],c,1,0,4.5,5);spr(P[0],P[1],P[2],.2,c[0],c[1],c[2],.9,0)}}
 if(S.tr){for(let i=0;i<5;i++){const a=t*1.5+i*1.2566,c=hexL(NO[i].c[0]),q=[p.pos[0]+Math.cos(a)*.95,p.pos[1]+1.25+Math.sin(t*2+i)*.22,p.pos[2]+Math.sin(a)*.95];put(M.sph,q,.1,.1,.1,c,.1,0,3,6);spr(q[0],q[1],q[2],.5,c[0],c[1],c[2],.9,0)}
  spr(p.pos[0],p.pos[1]+.08,p.pos[2],2.2,hc[0]*1.2,hc[1]*1.2,hc[2]*1.2,.6,1);spr(p.pos[0],p.pos[1]+1.1,p.pos[2],2.4,hc[0],hc[1],hc[2],.16,0);
  if(Math.random()<dt*40)part([p.pos[0]+(Math.random()-.5)*.9,p.pos[1]+Math.random()*.4,p.pos[2]+(Math.random()-.5)*.9],[0,1.6+Math.random(),0],1.1,.06,mul(hc,3),0,-.6,.3)}
 if(S.boss&&!S.boss.dead)dynLight([S.boss.pos[0],S.boss.pos[1]+2.4,S.boss.pos[2]],[4,1.4,8],10);
 /* projectiles, lightning, effects, particles */
 for(const q of S.proj){const d=norm(q.v);beam(sub(q.p,mul(d,2.3)),q.p,q.r*.9,q.c,1);spr(q.p[0],q.p[1],q.p[2],q.r*3.4,q.c[0]*1.3,q.c[1]*1.3,q.c[2]*1.3,1,0);
  if(q.el==='gravity'){spr(q.p[0],q.p[1],q.p[2],q.r*1.25,0,0,0,.96,3);spr(q.p[0],q.p[1],q.p[2],q.r*1.5,3,2.4,5,1,0)}else spr(q.p[0],q.p[1],q.p[2],q.r*1.2,4,4,4,1,0);dynLight(q.p,mul(q.c,7),7)}
 for(const a of S.arcs){const k=a.life/a.max;for(let i=0;i<a.pts.length-1;i++)beam(a.pts[i],a.pts[i+1],.2,a.c,3*k);const e=a.pts[a.pts.length-1];spr(e[0],e[1],e[2],1.4,a.c[0]*3*k,a.c[1]*3*k,a.c[2]*3*k,1,0)}
 for(const f of S.fx){const k=f.life/f.max;
  if(f.t==='ring'){const r=lerp(f.r0,f.r1,1-k*k);spr(f.p[0],f.p[1],f.p[2],r,f.c[0]*2.5,f.c[1]*2.5,f.c[2]*2.5,k,1)}
  else if(f.t==='well'){const g=Math.min(1,(f.max-f.life)*3),r=(1+.12*Math.sin(t*9))*g*f.big;inst(M.sph,f.p,[r,0,0],[0,r,0],[0,0,r],[0,0,0],1,0,0,5);torus(f.p,t*3,.42,r*2.1,f.c,5);torus(f.p,-t*2.2,.28,r*2.8,f.c,3);torus(f.p,t*1.4,.6,r*3.4,f.c,1.6);
   spr(f.p[0],f.p[1],f.p[2],r*4.5,f.c[0],f.c[1],f.c[2],.45,0);spr(f.p[0],f.p[1]-1.55,f.p[2],9*f.big,f.c[0]*1.2,f.c[1]*1.2,f.c[2]*1.2,.35+.2*Math.sin(t*6),1);dynLight(f.p,mul(f.c,11),15)}
  else if(f.t==='wave'){const cr=[-f.d[2],0,f.d[0]],w=4.2*f.big,gy=hAt(f.p[0],f.p[2]),y=(gy>-999?gy:f.p[1])+.7;beam([f.p[0]-cr[0]*w,y,f.p[2]-cr[2]*w],[f.p[0]+cr[0]*w,y,f.p[2]+cr[2]*w],1.7,f.c,1.2*k+.3);dynLight([f.p[0],y+1,f.p[2]],mul(f.c,8),10)}
  else if(f.t==='pillar'){const w=(f.big===2?9:f.big?4.5:2)*k;beam([f.p[0],f.p[1],f.p[2]],[f.p[0],f.p[1]+70,f.p[2]],w,f.c,2.2*k);beam([f.p[0],f.p[1],f.p[2]],[f.p[0],f.p[1]+70,f.p[2]],w*.35,[2,2,2],2*k);spr(f.p[0],f.p[1]+1,f.p[2],w*3,f.c[0]*2,f.c[1]*2,f.c[2]*2,k,0);dynLight([f.p[0],f.p[1]+2,f.p[2]],mul(f.c,16*k),20)}
  else if(f.t==='tele'){spr(f.p[0],f.p[1]+.1,f.p[2],f.r,3.5,.5,1.2,.55+.45*Math.sin(t*22),2)}}
 for(const q of S.parts){const k=q.life/q.max;if(q.flag===3)spr(q.p[0],q.p[1],q.p[2],q.size*(1.7-k*.7),q.c[0],q.c[1],q.c[2],q.a*k,3);else spr(q.p[0],q.p[1],q.p[2],q.size,q.c[0]*k,q.c[1]*k,q.c[2]*k,q.a,0)}
 renderFrame(p.pos,cloaks,chars)}

/* ================= audio and narrator ================= */
const AU={ctx:null,m:null,pad:[],f:null};
function audioInit(){if(AU.ctx||!CFG.sound)return;try{const A=window.AudioContext||window.webkitAudioContext;const c=AU.ctx=new A();AU.m=c.createGain();AU.m.gain.value=.5;AU.m.connect(c.destination);
  const f=AU.f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=700;const g=c.createGain();g.gain.value=.085;f.connect(g);g.connect(AU.m);
  for(const fr of[110,164.81,220,261.63]){const o=c.createOscillator();o.type='sawtooth';o.frequency.value=fr;const d=c.createOscillator();d.type='sawtooth';d.frequency.value=fr*1.004;const lg=c.createGain();lg.gain.value=.25;o.connect(lg);d.connect(lg);lg.connect(f);o.start();d.start();AU.pad.push(o,d)}
  const n=c.createBufferSource(),b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),ch=b.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;n.buffer=b;n.loop=true;const bf=c.createBiquadFilter();bf.type='bandpass';bf.frequency.value=420;bf.Q.value=.6;const ng=c.createGain();ng.gain.value=.05;
  const lfo=c.createOscillator();lfo.frequency.value=.13;const lg2=c.createGain();lg2.gain.value=.03;lfo.connect(lg2);lg2.connect(ng.gain);lfo.start();n.connect(bf);bf.connect(ng);ng.connect(AU.m);n.start();AU.noise=b}catch(e){AU.ctx=null}}
function mood(k){if(!AU.ctx)return;const t=AU.ctx.currentTime,sets=[[110,164.81,220,261.63],[103.83,155.56,207.65,246.94],[110,164.81,220,277.18]][k];AU.pad.forEach((o,i)=>o.frequency.linearRampToValueAtTime(sets[i>>1]*(i&1?1.004:1),t+4));AU.f.frequency.linearRampToValueAtTime([700,380,1300][k],t+4)}
function tone(fr,d,type,vol,slide){const c=AU.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(fr,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);g.gain.setValueAtTime(vol||.2,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AU.m);o.start(t);o.stop(t+d+.02)}
function noiseHit(d,fr,vol){const c=AU.ctx,t=c.currentTime,n=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();n.buffer=AU.noise;f.type='lowpass';f.frequency.setValueAtTime(fr,t);f.frequency.exponentialRampToValueAtTime(80,t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);n.connect(f);f.connect(g);g.connect(AU.m);n.start(t);n.stop(t+d)}
let lastHitS=0;function sfx(n){if(!AU.ctx||!CFG.sound)return;try{if(AU.ctx.state==='suspended')AU.ctx.resume();
  if(n==='atk'){tone(520,.16,'triangle',.12,180);noiseHit(.12,3000,.08)}else if(n==='hit'){const t=performance.now();if(t-lastHitS<50)return;lastHitS=t;noiseHit(.14,1400,.2);tone(150,.12,'sine',.2,60)}
  else if(n==='skill'){tone(220,.5,'sawtooth',.1,880);noiseHit(.4,5000,.12)}else if(n==='slam'){noiseHit(.6,700,.5);tone(70,.5,'sine',.5,30)}else if(n==='jump'){tone(300,.12,'sine',.07,520)}
  else if(n==='hurt'){tone(200,.25,'square',.1,70)}else if(n==='orb'){[523.25,659.25,783.99,1046.5,1318.5].forEach((f,i)=>setTimeout(()=>AU.ctx&&tone(f,.9,'sine',.16),i*110))}
  else if(n==='boss'){tone(55,1.6,'sawtooth',.3,36);noiseHit(1.2,400,.35)}else if(n==='trans'){[220,277.18,329.63,440,554.37,659.25,880].forEach((f,i)=>setTimeout(()=>AU.ctx&&tone(f,2.4,'triangle',.14),i*140));noiseHit(2,6000,.15)}}catch(e){}}
const TTS={ok:typeof speechSynthesis!=='undefined'&&typeof SpeechSynthesisUtterance!=='undefined',v:null,
 pick(){if(!this.ok)return;try{const vs=speechSynthesis.getVoices().filter(v=>/^en([-_]|$)/i.test(v.lang));const sc=v=>{const n=v.name.toLowerCase(),l=v.lang.toLowerCase().replace('_','-');let s=l==='en-gb'?20:2;if(/arthur/.test(n))s+=30;if(/daniel/.test(n))s+=26;if(/uk english male/.test(n))s+=25;if(/ryan|thomas|george|oliver|malcolm/.test(n))s+=16;if(/enhanced|premium|natural|neural/.test(n))s+=8;
   if(/female|woman|kate|serena|martha|stephanie|fiona|moira|tessa|karen|samantha|hazel|susan|libby|sonia|maisie|victoria|allison|ava|zira/.test(n))s-=40;return s};this.v=vs.sort((a,b)=>sc(b)-sc(a))[0]||null}catch(e){}},
 say(t,pitch){if(!this.ok||!CFG.voice)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);if(this.v){u.voice=this.v;u.lang=this.v.lang}else u.lang='en-GB';u.rate=.9;u.pitch=pitch;speechSynthesis.speak(u)}catch(e){}},stop(){if(this.ok)try{speechSynthesis.cancel()}catch(e){}}};
if(TTS.ok){TTS.pick();try{speechSynthesis.addEventListener('voiceschanged',()=>TTS.pick())}catch(e){}}

/* ================= subtitles, floating text, windows ================= */
const WHO={narrator:['Narrator',null,.72],seraphine:['Headmistress Seraphine','seraphine',1.05],kael:['Kael Ashford','kael',.95],hollow:['The Hollow Knight',null,.35],system:['System',null,.85]};
const SUB={q:[],cur:null,t:0};
function say(who,text,dur){SUB.q.push({who,text,dur:Math.max(dur||3,2+text.length*.055)})}
function stepSubs(dt){const b=$('subs');if(SUB.cur){SUB.t-=dt;if(SUB.t<=0){SUB.cur=null;b.hidden=true}}
 if(!SUB.cur&&SUB.q.length&&!S.paused){const s=SUB.cur=SUB.q.shift();SUB.t=s.dur;const w=WHO[s.who];$('subWho').textContent=w[0];$('subTxt').textContent=s.text;const im=$('subPic');if(w[1]){im.src=portrait(w[1],null,null,44);im.hidden=false}else im.hidden=true;b.className=s.who==='narrator'?'narr':'';b.hidden=false;TTS.say(s.text,w[2])}}
const FT=[];function ftext(p,str,cls){let f=FT.find(x=>x.life<=0);if(!f){if(FT.length>=16)return;const el=document.createElement('div');$('fl').appendChild(el);f={el};FT.push(f)}f.p=p;f.life=.8;f.el.className='ft '+(cls||'');f.el.textContent=str;f.vx=(Math.random()-.5)*40}
function proj2(p){const c=tfm(C.vp,p);if(c[3]<=0)return null;return[(c[0]*.5+.5)*innerWidth,(1-(c[1]*.5+.5))*innerHeight,c[3]]}
const NT={};function stepOverlay(dt){for(const f of FT){if(f.life<=0){f.el.style.opacity=0;continue}f.life-=dt;const s=proj2(f.p);if(!s){f.el.style.opacity=0;continue}const k=1-f.life/.8;f.el.style.opacity=f.life<.25?f.life*4:1;f.el.style.transform=`translate(${(s[0]+f.vx*k).toFixed(1)}px,${(s[1]-50*k).toFixed(1)}px) translate(-50%,-50%)`}
 const want={};if(S.state==='play'&&!S.cine){for(const k in Net.chars){const o=Net.chars[k];want[k]=[o.c.pos,o.name,o.c.sc]}if(S.npcs[0]&&S.stage<3){want.s=[S.npcs[0].pos,'Seraphine',1.06];want.k=[S.npcs[1].pos,'Kael',1.02]}}
 for(const k in NT)if(!want[k]){NT[k].remove();delete NT[k]}
 for(const k in want){const[p,name,sc]=want[k];let el=NT[k];if(!el){el=NT[k]=document.createElement('div');el.className='nt';$('fl').appendChild(el)}if(el.textContent!==name)el.textContent=name;const s=proj2([p[0],p[1]+2.05*sc,p[2]]);
  if(!s||s[2]>46){el.style.opacity=0}else{el.style.opacity=clamp(2-s[2]/23,0,1);el.style.transform=`translate(${s[0].toFixed(1)}px,${s[1].toFixed(1)}px) translate(-50%,-100%)`}}}
let toastT;function toast(m){const e=$('toast');e.textContent=m;e.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove('on'),2800)}
function fade(v){$('fade').style.opacity=v}
const PERK=['+25% damage','+15% speed and an air jump for every hero','Your skill recharges 35% faster','+50 max HP and faster healing','TRANSCENDENCE: damage ×2, skill ×1.35 and recharge 40% faster'];
let orbRAF=0;function showOrb(O,done){S.paused=true;TTS.stop();const o=$('orbwin'),col=O.c[0];o.hidden=false;
 o.innerHTML=`<div class="win rw" style="--rc:${col}" role="dialog" aria-label="Legendary orb"><div class="rays"></div><div class="hd">◆ SYSTEM · LEGENDARY ORB</div><div class="tier">${ORBT[O.tier-1]} · ${NATION[O.nat][0]}</div><canvas id="orbcv" width="420" height="420"></canvas>
 <div class="nm"></div><div class="li" id="oli1"></div><div class="li" id="oli2"></div><div class="pow"><b id="opw"></b><span id="opd"></span></div><button class="btn" id="orbok">${S.got>=5?'Transcend':'Continue'}</button></div>`;
 o.querySelector('.nm').textContent=O.n;$('oli1').textContent='Sub-element: '+O.sub+' · '+O.bd;$('oli2').textContent='In this demo: '+PERK[S.got-1];$('opw').textContent='◈ Orb Art · '+O.art.n;$('opd').textContent=O.d;
 const cx=$('orbcv').getContext('2d');const tick=t=>{cx.clearRect(0,0,420,420);drawOrbArt(cx,O,420,t);orbRAF=requestAnimationFrame(tick)};tick(0);
 $('orbok').onclick=()=>{cancelAnimationFrame(orbRAF);o.hidden=true;o.innerHTML='';S.paused=false;done()};$('orbok').focus()}
function showEnd(){const o=$('endc'),m=Math.floor(S.time/60),s=Math.floor(S.time%60);o.hidden=false;S.paused=true;
 o.innerHTML=`<div class="win" role="dialog" aria-label="Demo complete"><h4>END OF THE DEMO</h4><h3>You transcended.</h3><p>This was one evening on one island. The full game would carry every chapter, bond and orb of The Seven Crowns into this world.</p>
 <div class="stat"><div><small>Time</small><b>${m}:${String(s).padStart(2,'0')}</b></div><div><small>Husks</small><b>${S.kills}</b></div><div><small>Orbs</small><b>5 / 5</b></div></div>
 <button class="btn" id="eMore">Keep exploring</button><button class="btn ghost" id="eAgain">Play another hero</button><button class="btn ghost" id="eFb">Approve or adjust (NL)</button></div>`;
 $('eMore').onclick=()=>{o.hidden=true;S.paused=false};$('eAgain').onclick=()=>{o.hidden=true;S.paused=false;toTitle()};$('eFb').onclick=()=>{o.hidden=true;showConcept()}}

/* ================= multiplayer presence ================= */
const Net={room:null,chars:{},seq:0,sseq:0,last:0,n:0};
function netInit(){try{if(!(window.claude&&claude.use))return;claude.use('room').then(r=>{if(!r)return;Net.room=r;r.onPeers(()=>{},()=>{})}).catch(()=>{})}catch(e){}}
function netStep(dt,now){const r=Net.room;if(!r)return;const p=S.pl;if(now-Net.last>85){Net.last=now;const r2=v=>Math.round(v*100)/100;
  r.presence({h:S.hero,n:(S.nick||'').slice(0,14),p:[r2(p.pos[0]),r2(p.pos[1]),r2(p.pos[2])],y:r2(p.yaw),s:r2(p.spd),a:p.air?1:0,k:Net.seq,q:Net.sseq,t:S.tr,st:S.state==='play'?1:0}).catch(()=>{})}
 let peers=[];try{peers=r.peers()}catch(e){}const seen={};let n=0,here=0;
 for(const pr of peers){if(pr.isMe||pr.kind!=='viewer')continue;here++;const d=pr.presence||{};if(d.st!==1||!HERO[d.h]||!Array.isArray(d.p)||d.p.length!==3||!d.p.every(Number.isFinite)||n>=8)continue;n++;seen[pr.peer]=1;let o=Net.chars[pr.peer];
  if(!o||o.h!==d.h){if(o)freeCloak(o.c);o=Net.chars[pr.peer]={h:d.h,c:mkChar(d.h),k:d.k,q:d.q};o.c.pos=d.p.slice()}
  o.name=String(d.n||HERO[d.h].n).slice(0,14);const c=o.c,tp=d.p.map(v=>clamp(v,-400,400));const k=1-Math.exp(-10*dt);if(vlen(sub(tp,c.pos))>25)c.pos=tp.slice();else c.pos=lerp3(c.pos,tp,k);
  c.yaw=angLerp(c.yaw,Number.isFinite(d.y)?d.y:0,k);c.spd=clamp(Number.isFinite(d.s)?d.s:0,0,12);c.air=d.a===1;c.ph+=c.spd*dt*1.72/c.sc;c.atk=Math.max(0,c.atk-dt*2.6);c.cast=Math.max(0,c.cast-dt*1.6);
  if(d.k!==o.k){o.k=d.k;c.atk=1;const f=[Math.sin(c.yaw),0,Math.cos(c.yaw)],a=[c.pos[0],c.pos[1]+1.2*c.sc,c.pos[2]];beam(a,add(a,mul(f,9)),.3,ELL[HERO[d.h].el],1.5)}if(d.q!==o.q){o.q=d.q;c.cast=1;ring(c.pos,ELL[HERO[d.h].el],.4,6,.5)}}
 for(const k in Net.chars)if(!seen[k]){freeCloak(Net.chars[k].c);delete Net.chars[k]}Net.n=here}

/* ================= input ================= */
function bindInput(){const K=IN.keys;addEventListener('keydown',e=>{if(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName))return;if(e.code==='Space'){if(!e.repeat)IN.jumpP=true;IN.jump=true;e.preventDefault()}else if(e.code==='KeyJ'||e.code==='KeyF')IN.atk=true;else if((e.code==='KeyQ'||e.code==='KeyE'||e.code==='KeyK')&&!e.repeat)IN.skill=true;
  else if(e.code==='Escape'||e.code==='KeyP'){if(S.state==='play')toggleMenu()}K[e.code]=true});
 addEventListener('keyup',e=>{K[e.code]=false;if(e.code==='Space')IN.jump=false;if(e.code==='KeyJ'||e.code==='KeyF')IN.atk=false});addEventListener('blur',()=>{for(const k in K)K[k]=false;IN.atk=false;IN.jump=false});
 const c=cv,P={};let stick=null;c.addEventListener('contextmenu',e=>e.preventDefault());
 c.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){document.body.classList.add('touch');if(e.clientX<innerWidth*.45&&!stick){stick={id:e.pointerId,x:e.clientX,y:e.clientY};const s=$('stick');s.style.left=(e.clientX-60)+'px';s.style.top=(e.clientY-60)+'px';s.style.bottom='auto'}else P[e.pointerId]={x:e.clientX,y:e.clientY}}
   else{P[e.pointerId]={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,t:performance.now(),b:e.button};if(e.button===2&&S.state==='play')IN.skill=true}try{c.setPointerCapture(e.pointerId)}catch(_){}c.focus({preventScroll:true})});
 c.addEventListener('pointermove',e=>{if(stick&&e.pointerId===stick.id){let dx=(e.clientX-stick.x)/52,dy=(e.clientY-stick.y)/52;const l=Math.hypot(dx,dy);if(l>1){dx/=l;dy/=l}IN.mx=dx;IN.mz=-dy;IN.sprint=l>1.25;$('knob').style.transform=`translate(${dx*34}px,${dy*34}px)`;return}
  const p=P[e.pointerId];if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;if(S.state!=='play'||S.cine)return;const k=e.pointerType==='touch'?.0062:.0044;IN.camYaw-=dx*k;IN.camPitch=clamp(IN.camPitch+dy*k*.8,-.4,1.25)});
 const up=e=>{if(stick&&e.pointerId===stick.id){stick=null;IN.mx=IN.mz=0;IN.sprint=false;$('knob').style.transform='';const s=$('stick');s.style.left='';s.style.top='';s.style.bottom='';return}const p=P[e.pointerId];delete P[e.pointerId];
  if(p&&e.pointerType!=='touch'&&p.b===0&&Math.hypot(e.clientX-p.sx,e.clientY-p.sy)<7&&performance.now()-p.t<350&&S.state==='play'&&!S.cine)doAttack()};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
 c.addEventListener('wheel',e=>{IN.camDist=clamp(IN.camDist+Math.sign(e.deltaY)*.6,3,13);e.preventDefault()},{passive:false});
 const hold=(id,dn,upf)=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();b.classList.add('act');dn();try{b.setPointerCapture(e.pointerId)}catch(_){}});const u=()=>{b.classList.remove('act');upf&&upf()};b.addEventListener('pointerup',u);b.addEventListener('pointercancel',u)};
 hold('btnA',()=>{IN.atk=true},()=>{IN.atk=false});hold('btnS',()=>{IN.skill=true});hold('btnJ',()=>{IN.jumpP=true;IN.jump=true},()=>{IN.jump=false})}
function pollKeys(){const K=IN.keys;if(document.body.classList.contains('touch')&&!(K.KeyW||K.KeyA||K.KeyS||K.KeyD||K.ArrowUp||K.ArrowDown||K.ArrowLeft||K.ArrowRight))return;
 IN.mx=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0);IN.mz=(K.KeyW||K.ArrowUp?1:0)-(K.KeyS||K.ArrowDown?1:0);IN.sprint=!!(K.ShiftLeft||K.ShiftRight)}
