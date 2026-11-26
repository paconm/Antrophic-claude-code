/* ================= PAINTED SCENES ================= */
const SC={
 title:{sky:['#05030c','#1c0f38','#3a1b52'],stars:1,moon:[.88,.08,.035,'#d9c9ff'],layers:[{k:'mount',c:'#1a1030',b:.72,a:.25,s:3},{k:'ruins',c:'#0e0820',b:.86,float:1},{k:'hills',c:'#07040f',b:.95,a:.05,s:9}],p:['rise',40,'#b9a3ff']},
 village:{sky:['#2a1638','#c4563f','#f2a65a'],sun:[.5,.62,.09,'#ffd08a'],layers:[{k:'mount',c:'#5b2f45',b:.66,a:.18,s:2},{k:'hills',c:'#3a1d2f',b:.76,a:.06,s:5},{k:'houses',c:'#1f1020',b:.86},{k:'crystal',b:.8}],p:['rise',36,'#2a1a2a']},
 road:{sky:['#060914','#1b2547','#3e4f7c'],stars:1,moon:[.25,.22,.05,'#f1ecd8'],layers:[{k:'mount',c:'#25304f',b:.7,a:.2,s:7},{k:'hills',c:'#151c33',b:.82,a:.07,s:4},{k:'pines',c:'#0a0f1e',b:.93}],p:['fly',18,'#9fd1ff']},
 forest:{sky:['#03070a','#0d2226','#1d3c3a'],stars:1,moon:[.8,.16,.045,'#e6f2e6'],layers:[{k:'pines',c:'#0f2a28',b:.72},{k:'pines',c:'#081a19',b:.85},{k:'pines',c:'#030b0b',b:1}],p:['fly',30,'#c6ff9a']},
 academy:{sky:['#04030e','#141038','#2a2160'],stars:1,aurora:1,layers:[{k:'mount',c:'#1b1840',b:.74,a:.16,s:11},{k:'castle',c:'#0d0b22',b:.82},{k:'lake',b:.84}],p:['fly',26,'#ffe39a']},
 hall:{sky:['#130a06','#3a1e10','#6a3a1c'],layers:[{k:'arches',c:'#1d0f08'},{k:'banners'}],p:['ember',24,'#ffbf6a']},
 vault:{sky:['#020205','#0d0718','#1a0d2c'],layers:[{k:'arches',c:'#07040e'},{k:'door'}],p:['void',40,'#8a5cff']},
 arena:{sky:['#1c2a5a','#e07a4a','#ffcf87'],sun:[.5,.5,.07,'#fff0c4'],layers:[{k:'arena',c:'#4a2a2a'},{k:'flames'}],p:['ember',30,'#ffb36a']},
 rift:{sky:['#05010a','#260a33','#5e1240'],stars:1,layers:[{k:'rift'},{k:'castle',c:'#120818',b:.92}],p:['void',60,'#b06cff']},
 sylvaris:{sky:['#071610','#1e4a34','#5fa07a'],layers:[{k:'bigtrees',c:'#123526',b:.8},{k:'bigtrees',c:'#06170f',b:1.02}],p:['fly',50,'#eaffb0']},
 kharak:{sky:['#1c2c4a','#e08a5a','#ffd9a0'],sun:[.3,.6,.08,'#fff0c8'],layers:[{k:'mount',c:'#5a3a3a',b:.62,a:.42,s:6,snow:1},{k:'mount',c:'#2a1a1a',b:.9,a:.2,s:9}],p:['fall',30,'#ffffff']},
 hollow:{sky:['#000','#0a0412','#1a0830'],layers:[{k:'hole'}],p:['void',90,'#c39bff']},
 dawn:{sky:['#2b2a6a','#e8869a','#ffd9a0'],sun:[.5,.66,.1,'#fff5d6'],layers:[{k:'castle',c:'#3a2450',b:.86},{k:'hills',c:'#24163a',b:.95,a:.04,s:8}],p:['rise',30,'#fff2c8']},
 silverwood:{sky:['#0b1a1e','#2c5450','#a8d4c8'],moon:[.7,.18,.05,'#ffffff'],layers:[{k:'whitetrees',c:'#cfe3dd',b:.95,far:1},{k:'whitetrees',c:'#e8f4f0',b:1.02}],p:['fly',44,'#f6ffd8']},
 scar:{sky:['#101012','#26262a','#48484e'],layers:[{k:'deadtrees',c:'#1a1a1e',b:1},{k:'stones'}],p:['rise',30,'#77778a']},
 sky:{sky:['#1b2a5a','#5c7fc4','#f2c9a0'],sun:[.78,.66,.07,'#fff2d0'],layers:[{k:'clouds'},{k:'ship'}]},
 underhold:{sky:['#0a0503','#1e0d06','#3a1a0a'],layers:[{k:'arches',c:'#120804'},{k:'forge',c:'#0a0503',b:.95}],p:['ember',40,'#ffa04a']},
 cavern:{sky:['#030305','#0c0a14','#191426'],layers:[{k:'stalac',c:'#07060c'},{k:'door'}],p:['void',30,'#9a7aff']},
 city:{sky:['#05040e','#1a1040','#3a1d5a'],stars:1,layers:[{k:'city',c:'#120f2a',b:1},{k:'city',c:'#06050f',b:1,near:1},{k:'bolts'}],p:['fly',20,'#86d6ff']},
 tower:{sky:['#020806','#06201a','#0d3a2c'],layers:[{k:'tanks'}],p:['void',30,'#6affc4']}
};
const cv=document.getElementById('bg');let cx=cv.getContext('2d');
let W=0,H=0,scene=SC.title,parts=[];const t0=performance.now();
const GFX={dpr:2,pm:1,fps:0};let fpsM=0;
function setGfx(q,fps){GFX.dpr=q==='low'?1:q==='ultra'?3:2;GFX.pm=q==='low'?.45:q==='ultra'?1.6:1;GFX.fps=fps||0;resize()}
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function rnd(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function resize(){const d=Math.min(devicePixelRatio||1,GFX.dpr);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);initParts();if(RM)draw(0)}
function initParts(){const p=scene.p;parts=[];if(!p)return;const r=rnd(7);const n=Math.round(p[1]*GFX.pm);for(let i=0;i<n;i++)parts.push({x:r()*W,y:r()*H,s:.3+r()*1,z:r(),ph:r()*6.28})}
function setScene(k){const n=SC[k]||SC.title;if(n===scene)return;scene=n;initParts();if(RM)draw(0)}
const stars=[];{const r=rnd(42);for(let i=0;i<160;i++)stars.push([r(),r()*.7,r()*1.4+.3,r()*6])}
function ridge(x,s,f){return .5+.5*(Math.sin(x*f+s)*.55+Math.sin(x*f*2.3+s*1.7)*.3+Math.sin(x*f*5.9+s*.3)*.15)}
function shade(h,a){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(v+(a>0?(255-v)*a:v*a))));return`rgb(${f(r)},${f(g)},${f(b)})`}
function draw(t){
 const c=scene;cx.clearRect(0,0,W,H);
 const g=cx.createLinearGradient(0,0,0,H);c.sky.forEach((col,i)=>g.addColorStop(i/(c.sky.length-1),col));cx.fillStyle=g;cx.fillRect(0,0,W,H);
 if(c.stars){for(const s of stars){cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*.0008+s[3]));cx.fillStyle='#fff';cx.fillRect(s[0]*W,s[1]*H,s[2],s[2])}cx.globalAlpha=1}
 if(c.aurora){const cols=['#ff6a4a','#4aa8ff','#c08a4a','#7dffb0','#ffe94a','#fff6c8','#9b7bff'];cx.globalCompositeOperation='lighter';
  cols.forEach((col,i)=>{cx.beginPath();cx.moveTo(0,H*.1+i*10);for(let x=0;x<=W;x+=12)cx.lineTo(x,H*(.12+i*.025)+Math.sin(x*.01+t*.0005+i)*18);cx.lineTo(W,0);cx.lineTo(0,0);cx.fillStyle=col;cx.globalAlpha=.06;cx.fill()});cx.globalAlpha=1;cx.globalCompositeOperation='source-over'}
 const orb=c.moon||c.sun;if(orb){const[x,y,r,col]=orb,R=r*Math.min(W,H)*2.2,ox=x*W,oy=y*H;const gl=cx.createRadialGradient(ox,oy,0,ox,oy,R*3);gl.addColorStop(0,col);gl.addColorStop(.25,col+'55');gl.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gl;cx.fillRect(0,0,W,H);cx.beginPath();cx.arc(ox,oy,R,0,7);cx.fillStyle=col;cx.fill()}
 for(const L of c.layers)layer(L,t);
 particles(t);
 const v=cx.createRadialGradient(W/2,H*.45,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.8);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.55)');cx.fillStyle=v;cx.fillRect(0,0,W,H);
}
function layer(L,t){
 const k=L.k;cx.fillStyle=L.c||'#000';
 if(k==='mount'||k==='hills'){const step=k==='mount'?W/26:8;cx.beginPath();cx.moveTo(0,H);for(let x=0;x<=W+step;x+=step)cx.lineTo(x,H*L.b-H*L.a*ridge(x/W*10,L.s,k==='mount'?.9:.35));cx.lineTo(W,H);cx.fill();
  if(L.snow){cx.save();cx.clip();cx.fillStyle='rgba(255,255,255,.5)';cx.beginPath();cx.moveTo(0,0);for(let x=0;x<=W+step;x+=step)cx.lineTo(x,H*L.b-H*L.a*ridge(x/W*10,L.s,.9)+H*.06);cx.lineTo(W,0);cx.fill();cx.restore()}}
 else if(k==='pines'){const r=rnd(L.b*100|0),y=H*L.b;for(let x=-20;x<W+20;x+=14+r()*22){const h=H*(.12+r()*.14),w=h*.32;cx.beginPath();cx.moveTo(x,y-h);cx.lineTo(x-w,y);cx.lineTo(x+w,y);cx.fill()}cx.fillRect(0,y-2,W,H-y+2)}
 else if(k==='bigtrees'){const r=rnd(L.b*77|0),y=H*L.b;for(let x=-30;x<W+40;x+=60+r()*70){const h=H*(.3+r()*.3),w=12+r()*10;cx.fillRect(x-w/2,y-h,w,h);for(let j=0;j<4;j++){cx.beginPath();cx.arc(x+(r()-.5)*90,y-h-(r()*.15*H),40+r()*50,0,7);cx.fill()}}cx.fillRect(0,y-4,W,H)}
 else if(k==='whitetrees'){const r=rnd(L.far?11:23),y=H*L.b;cx.globalAlpha=L.far?.35:.9;for(let x=-20;x<W+40;x+=(L.far?40:80)+r()*60){const h=H*(.55+r()*.4),w=(L.far?6:14)+r()*8;cx.fillStyle=L.c;cx.fillRect(x-w/2,y-h,w,h);cx.strokeStyle=L.c;cx.lineWidth=w*.4;for(let j=0;j<3;j++){const by=y-h*(.5+j*.15);cx.beginPath();cx.moveTo(x,by);cx.quadraticCurveTo(x+(j%2?40:-40),by-30,x+(j%2?70:-70),by-70);cx.stroke()}
  const gl=cx.createRadialGradient(x,y-h,0,x,y-h,90);gl.addColorStop(0,'rgba(220,255,240,.35)');gl.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gl;cx.fillRect(x-90,y-h-90,180,180)}cx.globalAlpha=1}
 else if(k==='deadtrees'){const r=rnd(5),y=H*L.b;for(let x=0;x<W+30;x+=50+r()*50){const h=H*(.4+r()*.4);cx.strokeStyle=L.c;cx.lineWidth=6+r()*6;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+(r()-.5)*20,y-h);cx.stroke();cx.lineWidth=3;for(let j=0;j<4;j++){const by=y-h*(.4+j*.15);cx.beginPath();cx.moveTo(x,by);cx.lineTo(x+(r()-.5)*90,by-30-r()*30);cx.stroke()}}cx.fillRect(0,y-6,W,H)}
 else if(k==='stones'){const r=rnd(19);for(let i=0;i<14;i++){const x=W*(.25+r()*.5),y=H*(.45+r()*.3)+Math.sin(t*.0012+i)*8,s=6+r()*16;cx.save();cx.translate(x,y);cx.rotate(t*.0003*(i%2?1:-1)+i);cx.fillStyle='#5a5a66';cx.fillRect(-s/2,-s/2,s,s*.75);cx.restore()}
  const gl=cx.createRadialGradient(W/2,H*.6,0,W/2,H*.6,W*.3);gl.addColorStop(0,'rgba(150,120,255,.25)');gl.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gl;cx.fillRect(0,0,W,H)}
 else if(k==='houses'){const r=rnd(5),y=H*L.b;for(let x=0;x<W;x+=44+r()*40){const w=30+r()*26,h=22+r()*20;cx.fillRect(x,y-h,w,h+2);cx.beginPath();cx.moveTo(x-5,y-h);cx.lineTo(x+w/2,y-h-18-r()*8);cx.lineTo(x+w+5,y-h);cx.fill();cx.fillStyle=`rgba(255,190,110,${.5+.4*Math.sin(t*.003+x)})`;cx.fillRect(x+w*.35,y-h*.6,6,7);cx.fillStyle=L.c}cx.fillRect(0,y,W,H-y)}
 else if(k==='crystal'){const x=W/2,y=H*L.b-H*.12,s=Math.min(W,H)*.06,p=.6+.4*Math.sin(t*.003);const gl=cx.createRadialGradient(x,y,0,x,y,s*5);gl.addColorStop(0,`rgba(30,10,60,${.9*p})`);gl.addColorStop(.3,`rgba(155,123,255,${.45*p})`);gl.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gl;cx.fillRect(x-s*5,y-s*5,s*10,s*10);cx.beginPath();cx.moveTo(x,y-s*1.6);cx.lineTo(x+s*.7,y);cx.lineTo(x,y+s*1.2);cx.lineTo(x-s*.7,y);cx.closePath();cx.fillStyle='#120724';cx.fill();cx.strokeStyle='#c8b4ff';cx.lineWidth=1.5;cx.stroke();cx.fillStyle='#2a1320';cx.fillRect(x-s*.9,y+s*1.1,s*1.8,s*.5)}
 else if(k==='castle'){const y=H*L.b,cxm=W/2,u=Math.min(W*.9,520)/20;const tw=[[-8,6,1],[-5,9,1.2],[-2,13,1.4],[0,17,1.8],[2,12,1.3],[5,9,1.1],[8,6,1]];
  cx.save();cx.translate(0,Math.sin(t*.0008)*4);for(const[o,h,w]of tw){const x=cxm+o*u,ww=u*w,hh=h*u;cx.fillStyle=L.c;cx.fillRect(x-ww/2,y-hh,ww,hh);cx.beginPath();cx.moveTo(x-ww/2-3,y-hh);cx.lineTo(x,y-hh-ww*1.4);cx.lineTo(x+ww/2+3,y-hh);cx.fill();for(let j=1;j<h/2;j++){cx.fillStyle=`rgba(255,220,140,${.35+.35*Math.sin(t*.002+o+j)})`;cx.fillRect(x-2,y-hh+j*u*1.6,4,6)}}
  cx.fillStyle=L.c;cx.beginPath();cx.moveTo(cxm-10*u,y);cx.quadraticCurveTo(cxm,y+5*u,cxm+10*u,y);cx.fill();cx.restore()}
 else if(k==='waves'){const y=H*L.b;const g=cx.createLinearGradient(0,y,0,H);g.addColorStop(0,'#16365a');g.addColorStop(1,'#040c18');cx.fillStyle=g;cx.fillRect(0,y,W,H-y);cx.strokeStyle='rgba(255,200,160,.25)';cx.lineWidth=1.5;for(let i=0;i<14;i++){const yy=y+6+i*i*3.2;cx.beginPath();for(let x=0;x<=W;x+=16)cx.lineTo(x,yy+Math.sin(x*.02+t*.0015+i)*2.5);cx.stroke()}}
 else if(k==='hull'){const x=W*.62,y=H*.665+Math.sin(t*.0012)*3,s=Math.min(W,H)*.0045;cx.save();cx.translate(x,y);cx.scale(s,s);cx.rotate(Math.sin(t*.001)*.03);cx.fillStyle='#0a0f1c';cx.beginPath();cx.moveTo(-70,0);cx.lineTo(70,0);cx.lineTo(54,18);cx.lineTo(-58,18);cx.closePath();cx.fill();cx.fillRect(-3,-90,6,90);cx.beginPath();cx.moveTo(4,-86);cx.quadraticCurveTo(46,-50,4,-14);cx.fill();cx.beginPath();cx.moveTo(-4,-80);cx.quadraticCurveTo(-40,-50,-4,-20);cx.fill();cx.fillStyle='rgba(255,210,140,.9)';cx.fillRect(-40,6,5,4);cx.fillRect(20,6,5,4);cx.restore()}
 else if(k==='rays'){cx.save();cx.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const x=W*(.1+i*.17)+Math.sin(t*.0004+i)*30;const g=cx.createLinearGradient(0,0,0,H*.8);g.addColorStop(0,'rgba(170,240,255,.16)');g.addColorStop(1,'rgba(170,240,255,0)');cx.fillStyle=g;cx.beginPath();cx.moveTo(x-20,0);cx.lineTo(x+20,0);cx.lineTo(x+90,H*.8);cx.lineTo(x-10,H*.8);cx.closePath();cx.fill()}cx.restore()}
 else if(k==='coral'){const r=rnd(12),y=H*L.b;cx.fillStyle=L.c;for(let x=-20;x<W+30;x+=40+r()*50){const h=H*(.08+r()*.2);cx.beginPath();cx.ellipse(x,y,26+r()*20,h,0,Math.PI,0);cx.fill();cx.strokeStyle=L.c;cx.lineWidth=5;for(let j=0;j<3;j++){cx.beginPath();cx.moveTo(x+(r()-.5)*30,y-h*.6);cx.quadraticCurveTo(x+(r()-.5)*60+Math.sin(t*.001+j)*8,y-h-30,x+(r()-.5)*40,y-h-50-r()*40);cx.stroke()}}cx.fillRect(0,y-3,W,H)}
 else if(k==='spires'){const r=rnd(33);for(let i=0;i<11;i++){const x=W*(.2+r()*.6),h=H*(.18+r()*.32),w=10+r()*18,y=H*.78;const g=cx.createLinearGradient(0,y-h,0,y);g.addColorStop(0,'rgba(255,250,235,.95)');g.addColorStop(1,'rgba(255,214,160,.5)');cx.fillStyle=g;cx.beginPath();cx.moveTo(x,y-h);cx.lineTo(x+w,y);cx.lineTo(x-w,y);cx.closePath();cx.fill();cx.fillStyle=`rgba(255,240,200,${.5+.4*Math.sin(t*.003+i)})`;cx.beginPath();cx.arc(x,y-h*.55,2.5,0,7);cx.fill()}}
 else if(k==='cloudsea'){const y=H*L.b;for(let j=0;j<3;j++){cx.fillStyle=['rgba(255,236,240,.75)','rgba(255,220,230,.85)','rgba(255,246,236,.95)'][j];const r=rnd(50+j);for(let x=-60;x<W+80;x+=70+r()*50){const yy=y+j*H*.07+Math.sin(t*.0005+x)*4;cx.beginPath();cx.ellipse(x+((t*.006*(j+1))%70),yy,70+r()*40,26+r()*10,0,0,7);cx.fill()}}cx.fillStyle='rgba(255,246,236,.95)';cx.fillRect(0,y+H*.18,W,H)}
 else if(k==='ice'){const y=H*L.b;const g=cx.createLinearGradient(0,y,0,H);g.addColorStop(0,'#a9c9ec');g.addColorStop(.4,'#4d73a6');g.addColorStop(1,'#101d38');cx.fillStyle=g;cx.fillRect(0,y,W,H-y);const r=rnd(77);cx.strokeStyle='rgba(235,245,255,.45)';cx.lineWidth=1;for(let i=0;i<9;i++){let px=r()*W,py=y+r()*(H-y);cx.beginPath();cx.moveTo(px,py);for(let j=0;j<5;j++){px+=(r()-.5)*90;py+=(r()-.5)*40;cx.lineTo(px,Math.max(y,py))}cx.stroke()}cx.fillStyle=`rgba(255,255,255,${.25+.15*Math.sin(t*.002)})`;cx.fillRect(W*.2,y+4,W*.6,2)}
 else if(k==='lake'){const y=H*L.b;const g=cx.createLinearGradient(0,y,0,H);g.addColorStop(0,'#1a1548');g.addColorStop(1,'#05040f');cx.fillStyle=g;cx.fillRect(0,y,W,H-y);cx.strokeStyle='rgba(200,180,255,.15)';for(let i=0;i<8;i++){const yy=y+10+i*i*4;cx.beginPath();cx.moveTo(W*.3+Math.sin(t*.001+i)*20,yy);cx.lineTo(W*.7+Math.sin(t*.001+i)*20,yy);cx.stroke()}}
 else if(k==='arches'){const n=Math.max(3,Math.round(W/160)),aw=W/n;cx.fillRect(0,0,W,H*.08);for(let i=0;i<=n;i++)cx.fillRect(i*aw-14,0,28,H);cx.beginPath();for(let i=0;i<n;i++){cx.moveTo(i*aw,H*.08);cx.quadraticCurveTo(i*aw+aw/2,H*.35,(i+1)*aw,H*.08)}cx.fill();cx.fillRect(0,H*.86,W,H)}
 else if(k==='banners'){const cols=['#c43a2a','#2a6ac4','#8a6a3a','#3ac48a','#e8c34a','#f4ecd0','#6a4ad4'];const aw=W/7;cols.forEach((col,i)=>{const x=i*aw+aw/2,sw=Math.sin(t*.0015+i)*3;cx.fillStyle=col;cx.beginPath();cx.moveTo(x-14,H*.12);cx.lineTo(x+14,H*.12);cx.lineTo(x+14+sw,H*.34);cx.lineTo(x+sw,H*.3);cx.lineTo(x-14+sw,H*.34);cx.fill()})}
 else if(k==='door'){const x=W/2,y=H*.5,r=Math.min(W,H)*.2,p=.5+.5*Math.sin(t*.002);cx.fillStyle='#120a1e';cx.fillRect(x-r*.8,y-r*.9,r*1.6,H);cx.beginPath();cx.arc(x,y-r*.9,r*.8,Math.PI,0);cx.fill();cx.strokeStyle=`rgba(155,123,255,${.4+.5*p})`;cx.lineWidth=2;for(let i=1;i<=7;i++){cx.beginPath();cx.arc(x,y,r*.09*i,0,7);cx.stroke()}cx.fillStyle='#000';cx.beginPath();cx.arc(x,y,r*.12,0,7);cx.fill()}
 else if(k==='stalac'){const r=rnd(8);for(let x=0;x<W;x+=18+r()*30){const h=H*(.05+r()*.2);cx.beginPath();cx.moveTo(x-10,0);cx.lineTo(x,h);cx.lineTo(x+10,0);cx.fill();const h2=H*(.03+r()*.12);cx.beginPath();cx.moveTo(x-12,H);cx.lineTo(x+4,H-h2);cx.lineTo(x+14,H);cx.fill()}cx.fillRect(0,0,W,H*.03)}
 else if(k==='arena'){const y=H*.72;for(let i=0;i<5;i++){cx.beginPath();cx.ellipse(W/2,y+i*H*.05,W*(.7-i*.05),H*(.14-i*.012),0,Math.PI,0);cx.lineTo(W*1.2,H);cx.lineTo(-W*.2,H);cx.fillStyle=i%2?L.c:shade(L.c,-.2);cx.fill()}cx.fillStyle=shade(L.c,.25);cx.beginPath();cx.ellipse(W/2,H*.9,W*.45,H*.08,0,0,7);cx.fill()}
 else if(k==='flames'){for(let i=0;i<3;i++){const x=W*(.3+i*.2),y=H*.86;const f=cx.createRadialGradient(x,y,0,x,y,30+Math.sin(t*.01+i)*6);f.addColorStop(0,'rgba(255,220,150,.9)');f.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=f;cx.fillRect(x-40,y-40,80,80)}}
 else if(k==='rift'){const p=Math.sin(t*.002);cx.save();cx.translate(W/2,H*.3);cx.beginPath();cx.moveTo(0,-H*.22);for(let i=0;i<8;i++)cx.lineTo((i%2?1:-1)*(10+p*4+i*3),-H*.22+i*H*.055);cx.lineTo(0,H*.22);for(let i=7;i>=0;i--)cx.lineTo((i%2?-1:1)*(18+i*2),-H*.22+i*H*.055);cx.closePath();cx.fillStyle='#000';cx.shadowColor='#c06aff';cx.shadowBlur=40;cx.fill();cx.restore()}
 else if(k==='ruins'){const r=rnd(31),y=H*L.b;for(let x=0;x<W;x+=50+r()*50){const h=H*(.08+r()*.22),w=16+r()*12;const bob=L.float?Math.sin(t*.001+x)*6:0;cx.fillRect(x,y-h+bob,w,h);cx.fillRect(x-4,y-h-6+bob,w+8,6)}
  if(L.float){for(let i=0;i<9;i++){const x=r()*W,yy=H*(.2+r()*.4)+Math.sin(t*.0012+i*2)*10,s=8+r()*22;cx.save();cx.translate(x,yy);cx.rotate(t*.0002*(i%2?1:-1)+i);cx.fillRect(-s/2,-s/2,s,s*.7);cx.restore()}}cx.fillRect(0,y,W,H-y)}
 else if(k==='hole'){const x=W/2,y=H*.4,R=Math.min(W,H)*.22*(1+.03*Math.sin(t*.002));for(let i=0;i<5;i++){cx.strokeStyle=`rgba(180,120,255,${.25-i*.04})`;cx.lineWidth=2;cx.beginPath();cx.ellipse(x,y,R*(1.5+i*.4),R*(.35+i*.1),t*.0003*(i%2?1:-1),0,7);cx.stroke()}const g=cx.createRadialGradient(x,y,R*.6,x,y,R*1.4);g.addColorStop(0,'#000');g.addColorStop(.6,'rgba(90,30,140,.5)');g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.beginPath();cx.arc(x,y,R*1.4,0,7);cx.fill();cx.fillStyle='#000';cx.beginPath();cx.arc(x,y,R*.75,0,7);cx.fill()}
 else if(k==='forge'){const y=H*L.b,r=rnd(3);cx.fillRect(0,y,W,H);for(let x=20;x<W;x+=90+r()*60){const h=H*(.1+r()*.1);cx.fillStyle=L.c;cx.fillRect(x,y-h,40,h);const fg=cx.createRadialGradient(x+20,y-h*.4,0,x+20,y-h*.4,34);fg.addColorStop(0,`rgba(255,150,60,${.6+.3*Math.sin(t*.006+x)})`);fg.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=fg;cx.fillRect(x-20,y-h-20,80,80)}}
 else if(k==='clouds'){const r=rnd(4);for(let i=0;i<14;i++){const sp=.004+r()*.01,y=H*(.25+r()*.7),x=((r()*W*1.6+t*sp)%(W*1.6))-W*.3,s=60+r()*120;cx.fillStyle=`rgba(255,${235+r()*20|0},${225+r()*30|0},${.35+r()*.4})`;for(let j=0;j<4;j++){cx.beginPath();cx.arc(x+j*s*.5,y-(j%2)*s*.2,s*.45,0,7);cx.fill()}}}
 else if(k==='ship'){const x=W*.38,y=H*.44+Math.sin(t*.001)*6,s=Math.min(W,H)*.004;cx.save();cx.translate(x,y);cx.scale(s,s);cx.fillStyle='#2a1a2a';cx.beginPath();cx.ellipse(0,-30,60,18,0,0,7);cx.fill();cx.fillRect(-4,-14,8,14);cx.beginPath();cx.moveTo(-40,0);cx.quadraticCurveTo(0,18,40,0);cx.closePath();cx.fill();cx.restore()}
 else if(k==='city'){const r=rnd(L.near?71:29),y=H*L.b;for(let x=-10;x<W+20;x+=(L.near?50:30)+r()*30){const h=H*(L.near?.15+r()*.2:.3+r()*.35),w=(L.near?36:22)+r()*20;cx.fillStyle=L.c;cx.fillRect(x,y-h,w,h);if(!L.near){cx.fillRect(x+w/2-1,y-h-20,2,20)}for(let yy=y-h+8;yy<y-6;yy+=12)for(let xx=x+4;xx<x+w-6;xx+=9){if(r()>.55){cx.fillStyle=`rgba(${L.near?'255,200,120':'130,210,255'},${.4+.4*Math.sin(t*.002+xx+yy)})`;cx.fillRect(xx,yy,3,4)}}}}
 else if(k==='bolts'){const ph=(t*.001)%4;if(ph<.15){const r=rnd(Math.floor(t*.001)),x=W*(.2+r()*.6);cx.strokeStyle=`rgba(180,230,255,${1-ph/.15})`;cx.lineWidth=2;cx.shadowColor='#86d6ff';cx.shadowBlur=20;cx.beginPath();let px=x,py=0;cx.moveTo(px,py);while(py<H*.5){px+=(r()-.5)*40;py+=20+r()*20;cx.lineTo(px,py)}cx.stroke();cx.shadowBlur=0}}
 else if(k==='tanks'){const n=Math.max(3,Math.round(W/130)),aw=W/n;for(let i=0;i<n;i++){const x=i*aw+aw*.2,w=aw*.6,y=H*.2,h=H*.6;cx.fillStyle='rgba(60,255,180,.12)';cx.fillRect(x,y,w,h);cx.strokeStyle='rgba(120,255,200,.5)';cx.lineWidth=2;cx.strokeRect(x,y,w,h);cx.fillStyle='rgba(10,30,25,.85)';const bx=x+w/2,by=y+h*.5+Math.sin(t*.001+i)*6;cx.beginPath();cx.arc(bx,by-h*.18,w*.14,0,7);cx.fill();cx.fillRect(bx-w*.16,by-h*.12,w*.32,h*.35);cx.fillStyle='#0a1210';cx.fillRect(x-6,y-14,w+12,14);cx.fillRect(x-6,y+h,w+12,H)}}
}
function particles(t){const p=scene.p;if(!p)return;const[kind,,col]=p;cx.fillStyle=col;
 for(const q of parts){let x=q.x,y=q.y;
  if(kind==='rise'){y=(q.y-t*.02*q.s)%H;if(y<0)y+=H;x=q.x+Math.sin(t*.001+q.ph)*6;const s=2+q.z*5;cx.globalAlpha=.35+q.z*.5;cx.save();cx.translate(x,y);cx.rotate(t*.0005*q.s+q.ph);cx.fillRect(-s/2,-s/2,s,s*.8);cx.restore()}
  else if(kind==='bub'){y=(q.y-t*.04*q.s)%H;if(y<0)y+=H;x=q.x+Math.sin(t*.002+q.ph)*8;cx.globalAlpha=.25+q.z*.45;cx.strokeStyle=col;cx.lineWidth=1.2;cx.beginPath();cx.arc(x,y,2+q.z*4,0,7);cx.stroke()}
  else if(kind==='rain'){y=(q.y+t*.6*q.s)%H;x=(q.x+t*.12*q.s)%W;cx.globalAlpha=.25+q.z*.35;cx.strokeStyle=col;cx.lineWidth=1;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+4,y+14);cx.stroke()}
  else if(kind==='fall'){y=(q.y+t*.04*q.s)%H;x=(q.x+Math.sin(t*.001+q.ph)*20+t*.01*q.s)%W;cx.globalAlpha=.4+q.z*.6;cx.beginPath();cx.arc(x,y,1+q.z*2,0,7);cx.fill()}
  else if(kind==='ember'){y=(q.y-t*.05*q.s)%H;if(y<0)y+=H;x=q.x+Math.sin(t*.002+q.ph)*14;cx.globalAlpha=.3+.6*Math.abs(Math.sin(t*.003+q.ph));cx.fillRect(x,y,2+q.z*2,2+q.z*2)}
  else if(kind==='fly'){x=q.x+Math.sin(t*.0006*q.s+q.ph)*40;y=q.y*.6+H*.35+Math.cos(t*.0008*q.s+q.ph)*30;cx.globalAlpha=Math.max(0,Math.sin(t*.002+q.ph))*.9;cx.beginPath();cx.arc(x,y,1.6+q.z,0,7);cx.fill()}
  else if(kind==='void'){const a=t*.0002*q.s+q.ph,R=(q.y/H)*Math.max(W,H)*.6;x=W/2+Math.cos(a)*R;y=H*.4+Math.sin(a)*R*.5;cx.globalAlpha=.2+q.z*.5;cx.beginPath();cx.arc(x,y,1+q.z*2.5,0,7);cx.fill()}
 }cx.globalAlpha=1}
function thumb(canvas,key){const d=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth||300,h=canvas.clientHeight||120;canvas.width=w*d;canvas.height=h*d;const c2=canvas.getContext('2d');c2.setTransform(d,0,0,d,0,0);
 const sv=[cx,W,H,scene,parts];cx=c2;W=w;H=h;scene=SC[key];parts=[];initParts();draw(4000);[cx,W,H,scene,parts]=sv}
let lastF=0,fc=0,ft=0;
function loop(now){if(!RM)requestAnimationFrame(loop);now=now||performance.now();fc++;if(now-ft>=1000){fpsM=Math.round(fc*1000/(now-ft));fc=0;ft=now}
 if(GFX.fps&&now-lastF<1000/GFX.fps-2)return;lastF=now;draw(now-t0)}
addEventListener('resize',resize);resize();loop();

Object.assign(SC,{
 frozen:{sky:['#050816','#16244a','#3b5a8a'],stars:1,moon:[.78,.14,.04,'#eef4ff'],layers:[{k:'mount',c:'#2c3d63',b:.6,a:.28,s:21,snow:1},{k:'castle',c:'#0c1230',b:.66},{k:'ice',b:.72}],p:['fall',60,'#ffffff']},
 storm:{sky:['#05060c','#1a1d33','#3a3f5c'],layers:[{k:'castle',c:'#06070f',b:.95},{k:'bolts'}],p:['rain',120,'#b8c8ff']},
 arenaN:{sky:['#04030a','#1a0d22','#3a1626'],stars:1,layers:[{k:'arena',c:'#2a1418'},{k:'flames'}],p:['ember',40,'#ff9a5a']}
});

Object.assign(SC,{
 sea:{sky:['#0b1530','#2a3a6a','#c46a5a'],sun:[.3,.62,.05,'#ffd9a0'],layers:[{k:'waves',b:.66},{k:'hull'}],p:['fly',16,'#ffd9a0']},
 tide:{sky:['#020b1a','#06304a','#0f5a74'],layers:[{k:'rays'},{k:'coral',c:'#03121c',b:1}],p:['bub',50,'#bfefff']},
 lumeria:{sky:['#2a2a6a','#d98aa8','#ffe7b0'],sun:[.5,.3,.05,'#fff6d4'],layers:[{k:'spires'},{k:'cloudsea',b:.74}],p:['fly',50,'#fff2c8']}
});
