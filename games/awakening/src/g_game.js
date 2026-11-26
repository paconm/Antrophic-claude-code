/* ================= game: player, combat, husks, orbs, story ================= */
const S={state:'title',hero:'ren',nick:'',pl:null,npcs:[],en:[],proj:[],parts:[],fx:[],timers:[],orbs:[],got:0,kills:0,time:0,cine:null,boss:null,tr:0,cdA:0,cdS:0,hp:100,max:100,lastHit:0,inv:0,dead:0,paused:false,stage:0,waveT:0,camT:null,arcs:[],spawned:0,ended:false};
const IN={mx:0,mz:0,jump:false,jumpP:false,atk:false,skill:false,sprint:false,keys:{},camYaw:Math.PI,camPitch:.2,camDist:6.2};
const ELL={};for(const k in ELC)ELL[k]=hexL(ELC[k]);
const angLerp=(a,b,t)=>{let d=(b-a)%(Math.PI*2);if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;return a+d*t};
const dmgMul=()=>(S.got>=1?1.25:1)*(S.tr?2:1);
const NATORBS=n=>Object.values(ORBS).filter(o=>o.nat===n).sort((a,b)=>a.tier-b.tier);
function part(p,v,life,size,c,flag,grav,drag,a){if(S.parts.length>1600)return;S.parts.push({p:[p[0],p[1],p[2]],v,life,max:life,size,c,flag:flag||0,grav:grav||0,drag:drag||0,a:a==null?1:a})}
function burst(p,n,c,sp,size,life,grav,up){for(let i=0;i<n;i++){let d;do{d=[Math.random()*2-1,Math.random()*2-1,Math.random()*2-1]}while(dot(d,d)>1);const k=sp*(.4+.6*Math.random());part(p,[d[0]*k,d[1]*k+(up||0),d[2]*k],life*(.5+.5*Math.random()),size*(.5+Math.random()),c,0,grav==null?6:grav,1.5)}}
function ring(p,c,r0,r1,life){S.fx.push({t:'ring',p:[p[0],p[1]+.12,p[2]],c,r0,r1,life,max:life})}
function lightning(a,b,c,life){const pts=[a],n=Math.max(3,Math.round(vlen(sub(b,a))/1.6));for(let i=1;i<n;i++){const t=i/n,j=.55;pts.push([lerp(a[0],b[0],t)+(Math.random()-.5)*j*2,lerp(a[1],b[1],t)+(Math.random()-.5)*j*2,lerp(a[2],b[2],t)+(Math.random()-.5)*j*2])}pts.push(b);S.arcs.push({pts,c,life:life||.16,max:life||.16})}
function shake(a){C.shake=Math.max(C.shake,a)}
function startHero(id){if(S.pl&&S.pl.cloak)freeCloak(S.pl);S.hero=id;const H=HERO[id];S.pl=mkChar(id);S.pl.pos=W.spawn.slice();S.pl.yaw=Math.PI;S.max=S.hp=H.hp}
function freeCloak(c){if(c.cloak){gl.deleteBuffer(c.cloak.m.vb);gl.deleteBuffer(c.cloak.m.ib);gl.deleteBuffer(c.cloak.m.ibuf);gl.deleteVertexArray(c.cloak.m.vao);c.cloak=null}}
function resetRun(){S.en.forEach(freeCloak);S.en=[];S.proj=[];S.parts=[];S.fx=[];S.timers=[];S.arcs=[];S.got=0;S.kills=0;S.time=0;S.boss=null;S.tr=0;S.asc=null;S.pick=null;E.rate=1;E.gust=0;if(S.pl)S.pl.float=0;if($('asc'))$('asc').hidden=true;S.cdA=S.cdS=0;S.stage=0;S.dead=0;S.spawned=0;S.ended=false;S.inv=0;E.ecl=E.eclT=0;E.dawn=E.dawnT=0;
 S.orbs=W.sites.map((p,i)=>({p:p.slice(),i,got:false,locked:i===4,vis:i<4}));S.pl.pos=W.spawn.slice();S.pl.vel=[0,0,0];S.pl.yaw=Math.PI;IN.camYaw=Math.PI;IN.camPitch=.2;S.hp=S.max=HERO[S.hero].hp;}
function makeNpcs(){if(S.npcs.length)return;const a=mkChar('seraphine');a.pos=[3.4,2,9.5];a.yaw=.25;const b=mkChar('kael');b.pos=[-6.5,2,8.5];b.yaw=-.5;S.npcs=[a,b]}
/* ---- aim ---- */
function aim(range){const p=S.pl,cf=[Math.sin(IN.camYaw),0,Math.cos(IN.camYaw)];let best=null,bs=.82;for(const e of S.en){if(e.dead||e.rise>0)continue;const d=sub(e.pos,p.pos),l=Math.hypot(d[0],d[2]);if(l>(range||32)||l<.01)continue;const cs=(d[0]*cf[0]+d[2]*cf[2])/l+(l<5?.25:0)-l*.002;if(cs>bs){bs=cs;best=e}}
 if(best){const o=[p.pos[0],p.pos[1]+1.2*p.sc,p.pos[2]],t=[best.pos[0],best.pos[1]+1.05*best.sc,best.pos[2]];return[norm(sub(t,o)),best]}
 const m=Math.hypot(IN.mx,IN.mz);return[m>.3&&S.state==='play'?[Math.sin(p.yaw),0,Math.cos(p.yaw)]:cf,null]}
function hurt(e,d,dir,kb,stun){if(e.dead||e.rise>0)return;d=Math.round(d*(.9+Math.random()*.2));e.hp-=d;e.hit=.2;if(kb&&e.husk!==2){e.kb=[dir[0]*kb,0,dir[2]*kb]}if(stun)e.stun=Math.max(e.stun||0,e.husk===2?stun*.3:stun);
 ftext([e.pos[0],e.pos[1]+2*e.sc,e.pos[2]],d,d>45?'big':'');sfx('hit');burst([e.pos[0],e.pos[1]+1.1*e.sc,e.pos[2]],6,[1.6,.8,2.6],4,.09,.4);
 if(e.hp<=0){e.dead=true;e.dis=.02;S.kills++;burst([e.pos[0],e.pos[1]+1*e.sc,e.pos[2]],26,[1.2,.5,2.4],5,.12,.9,2,2);if(e===S.boss)bossDown()}}
function hurtPlayer(d){if(S.inv>0||S.dead||S.state!=='play')return;S.hp-=d;S.lastHit=S.time;E.flash=.35;E.tint=[.9,.05,.05];shake(.25);sfx('hurt');S.pl.hit=.3;if(S.hp<=0){S.hp=0;S.dead=1.8;say('system','The Resonance Crystal pulls you back.',2.5);fade(1)}}
/* ---- attacks and skills ---- */
function doAttack(){const p=S.pl,H=HERO[S.hero],A=H.atk;if(S.cdA>0||S.dead)return;S.cdA=A.cd;p.atk=1;const[dir,tg]=aim(A.t==='melee'?6:A.r>5?A.r:36);p.yaw=Math.atan2(dir[0],dir[2]);const c=ELL[H.el],dm=A.dmg*dmgMul();sfx('atk');Net.seq++;
 const o=p.tip?p.tip.slice():[p.pos[0],p.pos[1]+1.2*p.sc,p.pos[2]];
 if(A.t==='proj'){const n=A.count||1,cr=[-dir[2],0,dir[0]];for(let i=0;i<n;i++){const s2=n>1?(i-(n-1)/2)*.2:0;const d=norm([dir[0]+cr[0]*s2,dir[1]+(n>1?.12:0),dir[2]+cr[2]*s2]);S.proj.push({p:o.slice(),pp:o.slice(),v:mul(d,A.sp),r:A.r,dmg:dm,c,life:1.5,pierce:A.pierce?3:0,hom:A.homing?tg:null,el:H.el,hitSet:[]})}}
 else if(A.t==='melee'){S.timers.push({t:.16,fn:()=>{const f=[Math.sin(p.yaw),0,Math.cos(p.yaw)],hp=[p.pos[0]+f[0]*1.6,p.pos[1]+.3,p.pos[2]+f[2]*1.6];let any=false;for(const e of S.en){const d=sub(e.pos,p.pos),l=Math.hypot(d[0],d[2]);if(l<A.r+e.sc*.4&&(l<1.2||(d[0]*f[0]+d[2]*f[2])/l>.25)){hurt(e,dm,norm([d[0],0,d[2]]),9,.35);any=true}}
    ring(hp,c,.4,A.r*.9,.35);burst(hp,any?22:10,mul(c,2.2),6,.1,.5,9,3);shake(any?.28:.12);sfx('slam')}})}
 else if(A.t==='bolt'){if(tg){const t=[tg.pos[0],tg.pos[1]+1.05*tg.sc,tg.pos[2]];lightning(o,t,c);hurt(tg,dm,dir,2,.12);dynLight(t,mul(c,9),8)}else lightning(o,add(o,mul(dir,13)),c)}}
function doSkill(){const p=S.pl,H=HERO[S.hero],K=H.skill;if(S.cdS>0||S.dead)return;S.cdS=K.cd*(S.got>=3?.65:1)*(S.tr?.6:1);p.cast=1;const[dir,tg]=aim(26);const fd=norm([dir[0],0,dir[2]]);p.yaw=Math.atan2(fd[0],fd[2]);const c=ELL[H.el],m=dmgMul(),big=S.tr?1.35:1;sfx('skill');Net.sseq++;
 if(K.t==='well'){const q=tg?[tg.pos[0],tg.pos[1],tg.pos[2]]:[p.pos[0]+fd[0]*9,p.pos[1],p.pos[2]+fd[2]*9];const gy=hAt(q[0],q[2]);S.fx.push({t:'well',p:[q[0],(gy>-999?gy:q[1])+1.7,q[2]],life:2.7,max:2.7,c,m,big})}
 else if(K.t==='dash'){p.dashT=.24;p.dashD=fd;S.inv=Math.max(S.inv,.4);p.dashHit=[];p.dashM=m*36}
 else if(K.t==='slam'){p.vel[1]=9.5;p.air=true;p.slam=1}
 else if(K.t==='chain'){let cur=tg,from=p.tip||p.pos,seen=[];for(let i=0;i<(S.tr?8:5)&&cur;i++){const t=[cur.pos[0],cur.pos[1]+1.05*cur.sc,cur.pos[2]];lightning(from,t,c,.3);lightning(from,t,c,.22);hurt(cur,30*m,fd,3,.5);dynLight(t,mul(c,12),9);seen.push(cur);from=t;let nb=null,nd=10;for(const e of S.en){if(e.dead||e.rise>0||seen.includes(e))continue;const d=vlen(sub(e.pos,cur.pos));if(d<nd){nd=d;nb=e}}cur=nb}
  if(!tg)for(let i=0;i<4;i++)lightning(p.tip||p.pos,add(p.pos,[fd[0]*14+(Math.random()-.5)*6,1+Math.random()*3,fd[2]*14+(Math.random()-.5)*6]),c,.25);shake(.2)}
 else if(K.t==='wave'){S.fx.push({t:'wave',p:[p.pos[0],p.pos[1],p.pos[2]],d:fd,life:1.1,max:1.1,c,m,hit:[],big})}
 else if(K.t==='burst'){const rad=9*big;S.hp=Math.min(S.max,S.hp+S.max*.4);for(const e of S.en){if(vlen(sub(e.pos,p.pos))<rad)hurt(e,22*m,norm(sub(e.pos,p.pos)),6,2.2)}ring(p.pos,mul(c,1.4),.5,rad,.6);ring(p.pos,[2,2,2],.3,rad*.7,.45);S.fx.push({t:'pillar',p:p.pos.slice(),c,life:.9,max:.9});burst([p.pos[0],p.pos[1]+1,p.pos[2]],50,mul(c,2.5),9,.12,1,-1,3);E.flash=.25;E.tint=c;shake(.2)}}
function slamLand(p){const H=HERO[S.hero],c=ELL[H.el],m=dmgMul(),rad=9*(S.tr?1.35:1);for(const e of S.en){const d=sub(e.pos,p.pos),l=vlen(d);if(l<rad)hurt(e,48*m*(1-l/rad*.5),norm([d[0],0,d[2]]),11,1.2)}
 ring(p.pos,mul(c,1.6),.5,rad,.55);ring(p.pos,[1.5,1.2,.8],.2,rad*.6,.4);burst([p.pos[0],p.pos[1]+.3,p.pos[2]],46,[.5,.36,.2],9,.16,1,14,6);for(let i=0;i<14;i++){const a=Math.random()*6.283,r=Math.random()*rad*.7;part([p.pos[0]+Math.cos(a)*r,p.pos[1]+.2,p.pos[2]+Math.sin(a)*r],[0,1.5+Math.random()*2,0],1.4,1.3,[.16,.13,.1],3,-1,.8,.35)}shake(.6);sfx('slam')}
/* ---- husks ---- */
function spawnHusk(x,z,boss){const e=mkChar('husk',{husk:boss?2:1,sc:boss?1.9:.95+Math.random()*.18,w:boss?1.3:1});const y=hAt(x,z);if(y<-999)return null;e.pos=[x,y,z];e.hp=e.max=boss?(820+S.got*40):52+S.got*9;e.rise=1;e.dis=1;e.vmax=boss?3.3:2.7+Math.random()*1.1;e.stun=0;e.atkT=0;e.cdw=0;e.kb=[0,0,0];e.slamT=5;
 S.en.push(e);burst([x,y+.5,z],18,[.8,.35,1.8],3,.14,1,-2,1);return e}
function spawnWave(n){const p=S.pl.pos;let k=0;for(let i=0;i<60&&k<n;i++){const a=Math.random()*6.283,r=13+Math.random()*10,x=p[0]+Math.cos(a)*r,z=p[2]+Math.sin(a)*r;if(Math.hypot(x,z)>islandR(Math.atan2(z,x))-9||hAt(x,z)<-999)continue;if(spawnHusk(x,z))k++}}
function stepEnemies(dt){const p=S.pl;for(let i=S.en.length-1;i>=0;i--){const e=S.en[i];e.hit=Math.max(0,(e.hit||0)-dt);
  if(e.dead){e.dis+=dt/.85;e.spd=0;if(e.dis>=1){freeCloak(e);S.en.splice(i,1)}continue}
  if(e.rise>0){e.rise-=dt/.9;e.dis=Math.max(0,e.rise);continue}
  const d=sub(p.pos,e.pos),l=Math.hypot(d[0],d[2])||1e-3,dir=[d[0]/l,0,d[2]/l];e.kb[0]*=Math.exp(-6*dt);e.kb[2]*=Math.exp(-6*dt);let mv=[e.kb[0]*dt,e.kb[2]*dt];e.spd=0;
  if(e.stun>0){e.stun-=dt;if(Math.random()<dt*14)part([e.pos[0],e.pos[1]+2*e.sc,e.pos[2]],[Math.random()-.5,.6,Math.random()-.5],.5,.08,[2,2,.8],0)}
  else if(S.dead||S.state!=='play'){}
  else if(e.atkT>0){const was=e.atkT;e.atkT-=dt;e.atk=clamp(e.atkT/.62,0,1);if(was>.26&&e.atkT<=.26&&l<2.4*e.sc&&Math.abs(d[1])<2.5)hurtPlayer(e.husk===2?24:9+S.got)}
  else if(e.husk===2&&e.slamAt){e.slamAt-=dt;if(e.slamAt<=0){e.slamAt=0;const q=e.slamP;ring(q,[2.5,.8,4],.5,7,.5);burst(q,40,[1.4,.5,2.6],8,.16,.9,8,5);shake(.5);sfx('slam');if(vlen(sub(p.pos,q))<7&&!p.air)hurtPlayer(30)}}
  else{e.cdw-=dt;e.yaw=angLerp(e.yaw,Math.atan2(dir[0],dir[2]),1-Math.exp(-7*dt));
   if(e.husk===2){e.slamT-=dt;if(e.slamT<=0&&l<13){e.slamT=6.5;e.slamAt=1.15;e.slamP=[p.pos[0],groundAt(p.pos[0],p.pos[1],p.pos[2])+.1,p.pos[2]];e.cast=1;S.fx.push({t:'tele',p:e.slamP.slice(),r:7,life:1.15,max:1.15});continue}}
   if(l<1.75*e.sc&&e.cdw<=0){e.atkT=.62;e.cdw=1.3}else if(l>1.5*e.sc){mv[0]+=dir[0]*e.vmax*dt;mv[1]+=dir[2]*e.vmax*dt;e.spd=e.vmax}}
  for(const o of S.en){if(o===e||o.dead)continue;const dx=e.pos[0]-o.pos[0],dz=e.pos[2]-o.pos[2],q=dx*dx+dz*dz,m=.75*(e.sc+o.sc)*.5;if(q<m*m&&q>1e-5){const s=Math.sqrt(q);mv[0]+=dx/s*(m-s)*.5;mv[1]+=dz/s*(m-s)*.5}}
  const nx=e.pos[0]+mv[0],nz=e.pos[2]+mv[1],gy=hAt(nx,nz);if(gy>-999&&Math.hypot(nx,nz)<islandR(Math.atan2(nz,nx))-3){e.pos[0]=nx;e.pos[2]=nz;collide(e.pos,.35*e.sc);e.pos[1]=lerp(e.pos[1],hAt(e.pos[0],e.pos[2]),1-Math.exp(-18*dt))}
  e.ph+=e.spd*dt*1.75/e.sc;e.cast=Math.max(0,(e.cast||0)-dt);if(Math.random()<dt*5)part([e.pos[0]+(Math.random()-.5)*.5,e.pos[1]+Math.random()*1.6*e.sc,e.pos[2]+(Math.random()-.5)*.5],[0,.5,0],1.1,.34*e.sc,[.03,.02,.05],3,-.4,.5,.5)}}
/* ---- player ---- */
function stepPlayer(dt){const p=S.pl,H=HERO[S.hero];let ix=IN.mx,iz=IN.mz;const l=Math.hypot(ix,iz);if(l>1){ix/=l;iz/=l}const cf=[Math.sin(IN.camYaw),0,Math.cos(IN.camYaw)],cr=[-Math.cos(IN.camYaw),0,Math.sin(IN.camYaw)];
 const sp=(IN.sprint?9.6:6.4)*(S.got>=2?1.15:1)*(S.tr?1.15:1);let wx=(cf[0]*iz+cr[0]*ix)*sp,wz=(cf[2]*iz+cr[2]*ix)*sp;if(S.dead||S.cine||S.asc||S.pick){wx=wz=0}
 if(p.dashT>0){p.dashT-=dt;p.vel[0]=p.dashD[0]*40;p.vel[2]=p.dashD[2]*40;p.vel[1]=0;const c=ELL[H.el];for(let i=0;i<3;i++)part([p.pos[0]+(Math.random()-.5)*.6,p.pos[1]+.3+Math.random()*1.3,p.pos[2]+(Math.random()-.5)*.6],[0,0,0],.4,.16,mul(c,2),0);
  for(const e of S.en){if(!p.dashHit.includes(e)&&vlen(sub(e.pos,p.pos))<2.6){p.dashHit.push(e);hurt(e,p.dashM,p.dashD,7,.5)}}if(p.dashT<=0){p.vel[0]*=.2;p.vel[2]*=.2}}
 else{const acc=p.air?10:42;p.vel[0]+=clamp(wx-p.vel[0],-acc*dt,acc*dt);p.vel[2]+=clamp(wz-p.vel[2],-acc*dt,acc*dt);if(l>.1&&p.atk<.35&&p.cast<.35&&!S.dead&&!S.cine)p.yaw=angLerp(p.yaw,Math.atan2(wx,wz),1-Math.exp(-13*dt));
  const glide=H.air==='glide'&&IN.jump&&p.air&&p.vel[1]<0&&!p.slam;p.vel[1]-=(p.slam&&p.vel[1]<2?60:glide?4:23)*dt;if(glide&&p.vel[1]<-2)p.vel[1]=-2;
  if(glide&&Math.random()<dt*30)part([p.pos[0],p.pos[1]+.2,p.pos[2]],[(Math.random()-.5)*.5,-.5,(Math.random()-.5)*.5],.6,.08,mul(ELL[H.el],1.6),0)}
 if(IN.jumpP&&!S.dead&&!S.cine&&!S.asc&&!S.pick){if(!p.air||p.coy>0){p.vel[1]=8.7;p.air=true;p.coy=0;p.jumps=1;sfx('jump')}else if((H.air==='double'||S.got>=2)&&(p.jumps||0)<2){p.vel[1]=8.2;p.jumps=2;ring([p.pos[0],p.pos[1]-.1,p.pos[2]],mul(ELL[H.el],1.2),.2,1.6,.3);sfx('jump')}}IN.jumpP=false;
 if(S.asc){p.atk=0;p.hit=0;return}
 p.pos[0]+=p.vel[0]*dt;p.pos[2]+=p.vel[2]*dt;collide(p.pos,.3*p.w);p.pos[1]+=p.vel[1]*dt;const g=groundAt(p.pos[0],p.pos[1],p.pos[2]);
 if(p.pos[1]<=g){if(p.slam){p.slam=0;slamLand(p)}else if(p.air&&p.vel[1]<-11)burst([p.pos[0],g+.1,p.pos[2]],8,[.3,.25,.18],2,.12,.5,3);p.pos[1]=g;p.vel[1]=0;p.air=false;p.coy=.12;p.jumps=0}
 else if(!p.air&&p.pos[1]-g<.4&&p.vel[1]<=0){p.pos[1]=g;p.vel[1]=0}else{p.air=true;p.coy=(p.coy||0)-dt}
 if(p.pos[1]<RIM_Y-50&&!S.dead){S.dead=1.6;say('system','The wind carries you back to the Circle.',2.5);fade(1)}
 p.spd=p.air?Math.min(p.spd,3):Math.hypot(p.vel[0],p.vel[2]);p.ph+=p.spd*dt*1.72/p.sc;p.atk=Math.max(0,p.atk-dt*2.6);p.cast=Math.max(0,p.cast-dt*1.6);p.hit=Math.max(0,p.hit-dt)}
function respawn(){const p=S.pl;p.pos=[0,2.1,13.5];p.vel=[0,0,0];p.air=false;p.slam=0;p.dashT=0;S.hp=S.max;S.inv=2.5;S.dead=0;IN.camYaw=Math.PI;fade(0)}
function updateCam(dt){const p=S.pl;if(S.asc){const t=S.asc.t,ang=S.asc.a0+1.25*Math.min(t,2.6)+.35*Math.max(t-2.6,0),k=clamp((t-2.6)/.7,0,1),r=t<2.6?lerp(6,3.3,sstep(0,2.6,t)):lerp(lerp(3.3,11.5,1-(1-k)*(1-k)),7.5,sstep(4.6,7.4,t)),ch=p.chest||p.pos;
  C.tgt=[ch[0],ch[1]+.1,ch[2]];C.pos=[ch[0]+Math.sin(ang)*r,ch[1]+.45+(t>2.6?1.3*k:0)-.9*sstep(5,7.4,t),ch[2]+Math.cos(ang)*r];const gy=hAt(C.pos[0],C.pos[2]);if(gy>-999&&C.pos[1]<gy+.5)C.pos[1]=gy+.5;C.fov=t<2.6?lerp(.95,.7,sstep(0,2.6,t)):lerp(1.22,.95,sstep(2.6,5,t));return}
 const tg=[p.pos[0],p.pos[1]+1.42*p.sc+.18,p.pos[2]];S.camT=S.camT?lerp3(S.camT,tg,1-Math.exp(-16*dt)):tg;const cp=Math.cos(IN.camPitch),dir=[Math.sin(IN.camYaw)*cp,-Math.sin(IN.camPitch),Math.cos(IN.camYaw)*cp],cr=[-Math.cos(IN.camYaw),0,Math.sin(IN.camYaw)];
 const d=IN.camDist*(S.tr?1.12:1);let pos=sub(S.camT,mul(dir,d));pos=add(pos,mul(cr,.5));const gy=hAt(pos[0],pos[2]);if(gy>-999&&pos[1]<gy+.45)pos[1]=gy+.45;C.pos=pos;C.tgt=add(S.camT,mul(cr,.5));C.fov=lerp(C.fov,.95+(IN.sprint&&p.spd>7?.07:0)+(p.dashT>0?.14:0),1-Math.exp(-6*dt))}
/* ---- orbs ---- */
function collectOrb(o){o.got=true;S.got++;const O=NATORBS(HERO[S.hero].nat)[S.got-1];S.pick={t:0,O,from:o.p.slice(),done:false};S.inv=Math.max(S.inv,4);sfx('skill');if(AU.ctx&&CFG.sound)try{tone(220,1,'sine',.1,1320)}catch(e){}}
function pickBlast(k){const O=k.O,c=hexL(O.c[0]),T=O.tier,p=S.pl,ch=p.chest||p.pos;sfx('orb');if(T>=3)sfx('slam');E.flash=.4+.12*T;E.tint=c;shake(.2+.09*T);ring(p.pos,mul(c,2),.3,6+3*T,.6+.1*T);if(T>=2)ring(p.pos,[1.5,1.5,1.5],.2,4+2*T,.45);
 S.fx.push({t:'pillar',p:p.pos.slice(),c,life:.9+.2*T,max:.9+.2*T,big:T>=4?1:0});burst(ch,50+35*T,mul(c,3),7+2.5*T,.13,1+.15*T,2,2);E.gust=1+.5*T;
 for(let i=0;i<4+3*T;i++){const a=Math.random()*6.283,r=2+Math.random()*(3+2*T),x=p.pos[0]+Math.cos(a)*r,z=p.pos[2]+Math.sin(a)*r,g=hAt(x,z);lightning(ch,[x,g>-999?g:p.pos[1],z],c,.3)}
 if(S.got>=4){S.max=HERO[S.hero].hp+50;S.hp=S.max}}
function startEclipse(){S.stage=1;E.eclT=1;mood(1);say('narrator','The black moon swallowed the sun, and the hollow things woke.',5);say('seraphine','Husks! Do not let them reach the Circle. Find the orbs, child. I will hold the light.',6);S.waveT=8.5}
function startBoss(){S.stage=2;say('kael','Hey, new blood! Still breathing? Good. The last orb is at the Circle... and so is something big.',6);S.timers.push({t:4,fn:()=>{const b=spawnHusk(0,-6.5,true);S.boss=b;S.orbs[4].vis=true;sfx('boss');shake(.5);say('hollow','The Crowns... are chains. Give... it... back.',4.5);$('bossbar').hidden=false;spawnWave(3)}})}
function bossDown(){$('bossbar').hidden=true;S.orbs[4].locked=false;E.flash=.6;E.tint=[.7,.4,1];shake(.7);sfx('boss');say('seraphine','It is done. Take the last orb. Quickly!',4);setObjective()}
function transcend(){const p=S.pl;S.tr=1;S.stage=3;S.asc={t:0,a0:IN.camYaw+Math.PI,blast:false,y0:p.pos[1]};S.inv=99;p.vel=[0,0,0];mood(2);SUB.q.length=0;if(AU.ctx&&CFG.sound)try{tone(82,2.7,'sawtooth',.12,660);tone(123,2.7,'sine',.14,990)}catch(e){}}
function ascBlast(){const p=S.pl,H=HERO[S.hero],c=ELL[H.el],ch=p.chest||p.pos,gp=[p.pos[0],S.asc.y0,p.pos[2]];E.flash=1.15;E.tint=lerp3(c,[1,1,1],.6);shake(1.2);sfx('trans');sfx('slam');E.eclT=2;E.dawnT=1;E.rate=7;E.gust=4;
 for(const[d,r1,l]of[[0,36,1.3],[.2,62,1.9],[.45,95,2.6]])S.timers.push({t:d,fn:()=>{ring(gp,mul(c,1.7),1,r1,l);ring(gp,[1.6,1.6,1.6],.5,r1*.72,l*.8);sfx('slam');shake(.5)}});
 S.fx.push({t:'pillar',p:gp,c,life:4.4,max:4.4,big:2});burst(ch,240,mul(c,3),22,.17,2.2,3,4);burst(ch,110,[3,3,3],32,.1,1.3,0);for(let i=0;i<36;i++){const a=i/36*6.283;part([gp[0]+Math.cos(a)*2,gp[1]+.4,gp[2]+Math.sin(a)*2],[Math.cos(a)*16,2.5,Math.sin(a)*16],2.2,2.2,[.2,.17,.15],3,-1,1.1,.4)}
 for(let i=0;i<30;i++){const a=Math.random()*6.283,r=5+Math.random()*24,x=gp[0]+Math.cos(a)*r,z=gp[2]+Math.sin(a)*r,g=hAt(x,z);S.timers.push({t:Math.random()*.9,fn:()=>lightning(S.pl.chest||gp,[x,g>-999?g:gp[1],z],c,.36)})}
 for(const e of S.en)if(!e.dead)S.timers.push({t:vlen(sub(e.pos,gp))/42,fn:()=>{if(!e.dead){e.dead=true;e.dis=.02;burst([e.pos[0],e.pos[1]+1,e.pos[2]],30,mul(c,2.5),7,.13,1,2,3)}}});
 const O=NATORBS(H.nat)[4],n=S.nick||H.n,o=$('asc');o.hidden=false;o.style.setProperty('--ac',ELC[H.el]);o.innerHTML='<div class="a0"></div><div class="a1">Transcendence</div><div class="a2"></div><div class="a3"></div><div class="a4">Sealed elements sensed · <b>VOID</b> · <b>DIVINE</b></div>';
 o.querySelector('.a2').textContent=n+' · Bearer of the '+O.n.replace(/ Orb$/,'');o.querySelector('.a3').textContent='Ascension path unlocked · God of '+H.el[0].toUpperCase()+H.el.slice(1)}
function stepAsc(dt){const A=S.asc,p=S.pl;A.t+=dt;p.cast=1;p.float=1;p.pos[1]=A.y0+2.5*sstep(0,2.4,A.t)*(1-sstep(5.2,7.3,A.t));p.vel=[0,0,0];p.air=false;p.spd=0;if(!A.blast&&A.t>=2.6){A.blast=true;ascBlast()}
 if(A.t>=7.5){const ang=A.a0+1.25*2.6+.35*(A.t-2.6);S.asc=null;p.float=0;p.pos[1]=A.y0;S.inv=3;E.rate=1;IN.camYaw=ang-Math.PI;IN.camPitch=.16;S.camT=null;$('asc').hidden=true;const n=S.nick||HERO[S.hero].n;
  say('narrator',`For one breath, ${n} stood where only the Crown-bearers had ever stood. Beyond human.`,6.5);say('seraphine','Three hundred years... and it begins again. Rest, child. Tomorrow, your real training starts.',7);
  say('narrator','And far beyond the seven elements, two older powers stirred: the Void, and the Divine.',6);S.timers.push({t:20,fn:()=>{if(!S.ended){S.ended=true;showEnd()}}});setObjective()}}
function setObjective(){let t;if(S.got<4)t=`Find the orbs of ${NATION[HERO[S.hero].nat][0]} · ${S.got} / 5`+(S.stage===1?' · Survive the Husks':'');else if(S.got===4)t=S.boss&&!S.boss.dead?'Defeat the Hollow Knight at the Resonance Circle':S.orbs[4].locked?'Return to the Resonance Circle':'Take the Transcendent orb';else t='Transcended · Explore freely';$('obj').textContent=t;
 $('orbc').textContent=`${S.got} / 5`}
/* ---- simulation ---- */
function update(rdt){S.time+=rdt;const p=S.pl;C.shake=Math.max(0,C.shake-rdt*1.4);S.inv=Math.max(0,S.inv-rdt);S.cdA=Math.max(0,S.cdA-rdt);S.cdS=Math.max(0,S.cdS-rdt);
 for(let i=S.timers.length-1;i>=0;i--){const t=S.timers[i];t.t-=rdt;if(t.t<=0){S.timers.splice(i,1);t.fn()}}
 if(S.pick){const k=S.pick;k.t+=rdt;if(!k.done&&k.t>=.95){k.done=true;pickBlast(k)}if(k.t>=1.6){S.pick=null;showOrb(k.O,()=>{if(S.got===2)startEclipse();else if(S.got===4)startBoss();else if(S.got===5)transcend();setObjective()})}}
 if(S.asc)stepAsc(rdt);const busy=S.cine||S.asc||S.pick,dt=rdt*(S.asc&&S.asc.t<2.6?.25:S.pick?.35:1);
 if(S.state==='play'&&!busy){if(IN.atk)doAttack();if(IN.skill){doSkill();IN.skill=false}}else IN.skill=false;
 const n=Math.max(1,Math.ceil(rdt/(1/110)));for(let i=0;i<n;i++)stepPlayer(rdt/n);
 if(S.dead>0){S.dead-=dt;if(S.dead<=0)respawn()}
 if(S.state==='play'){stepEnemies(dt);if(S.time-S.lastHit>5&&S.hp<S.max&&!S.dead)S.hp=Math.min(S.max,S.hp+dt*(S.got>=4?9:5));
  if(S.stage===1||S.stage===2){S.waveT-=dt;const alive=S.en.filter(e=>!e.dead).length;if(S.waveT<=0&&alive<(S.stage===2?4:6)){spawnWave(S.stage===2?2:alive<2?4:2);S.waveT=S.stage===2?9:5.5}}
  for(const o of S.orbs){if(o.got||!o.vis||o.locked||busy)continue;if(vlen(sub([p.pos[0],p.pos[1]+1,p.pos[2]],o.p))<1.7){collectOrb(o);break}}}
 /* projectiles */
 for(let i=S.proj.length-1;i>=0;i--){const q=S.proj[i];q.life-=dt;q.pp=q.p.slice();if(q.hom&&!q.hom.dead){const t=[q.hom.pos[0],q.hom.pos[1]+1*q.hom.sc,q.hom.pos[2]],sp=vlen(q.v),d=norm(sub(t,q.p));q.v=mul(norm(lerp3(norm(q.v),d,1-Math.exp(-9*dt))),sp)}
  q.p=add(q.p,mul(q.v,dt));let dead=q.life<=0;const gy=hAt(q.p[0],q.p[2]);if(gy>-999&&q.p[1]<gy+.05)dead=true;
  for(const e of S.en){if(e.dead||e.rise>0||q.hitSet.includes(e))continue;const c=[e.pos[0],e.pos[1]+1*e.sc,e.pos[2]];const dx=q.p[0]-c[0],dy=(q.p[1]-c[1])*.6,dz=q.p[2]-c[2];if(dx*dx+dy*dy+dz*dz<Math.pow(q.r+.55*e.sc,2)){hurt(e,q.dmg,norm(q.v),q.el==='gravity'?-3:4,.1);q.hitSet.push(e);if(q.pierce-->0)continue;dead=true;break}}
  if(dead){burst(q.p,14,mul(q.c,2.4),5,.1,.5,2);ring([q.p[0],q.p[1]-.1,q.p[2]],q.c,.1,1.5,.25);S.proj.splice(i,1)}}
 /* fx objects */
 for(let i=S.fx.length-1;i>=0;i--){const f=S.fx[i];f.life-=rdt;
  if(f.t==='well'){const R0=9*f.big;for(const e of S.en){if(e.dead||e.rise>0)continue;const d=sub(f.p,e.pos),l=Math.hypot(d[0],d[2]);if(l<R0&&l>.4&&e.husk!==2){e.pos[0]+=d[0]/l*Math.min(l,7*dt);e.pos[2]+=d[2]/l*Math.min(l,7*dt)}if(l<R0&&Math.random()<dt*3)hurt(e,5.5*f.m,[0,0,0],0,.2)}
   for(let k=0;k<3;k++){const a=Math.random()*6.283,r=R0*(.3+.7*Math.random());part([f.p[0]+Math.cos(a)*r,f.p[1]+(Math.random()-.5)*2.5,f.p[2]+Math.sin(a)*r],[-Math.cos(a)*r*1.6-Math.sin(a)*4,0,-Math.sin(a)*r*1.6+Math.cos(a)*4],.55,.09,mul(f.c,2.2),0)}
   if(f.life<=0){for(const e of S.en){const d=sub(e.pos,f.p),l=Math.hypot(d[0],d[2]);if(l<6.5*f.big)hurt(e,42*f.m,norm([d[0],0,d[2]]),10,.8)}burst(f.p,60,mul(f.c,3),11,.14,.9,0);ring([f.p[0],f.p[1]-1.5,f.p[2]],mul(f.c,2),.4,8*f.big,.5);E.flash=.3;E.tint=f.c;shake(.5);sfx('slam')}}
  else if(f.t==='wave'){const sp=19,w=4.2*f.big;f.p=add(f.p,mul(f.d,sp*dt));const cr=[-f.d[2],0,f.d[0]];for(const e of S.en){if(f.hit.includes(e)||e.dead)continue;const d=sub(e.pos,f.p),al=d[0]*f.d[0]+d[2]*f.d[2],ac=d[0]*cr[0]+d[2]*cr[2];if(Math.abs(al)<1.6&&Math.abs(ac)<w){f.hit.push(e);hurt(e,36*f.m,f.d,13,.7)}}
   const gy=hAt(f.p[0],f.p[2]),y=gy>-999?gy:f.p[1];for(let k=0;k<8;k++){const u=(Math.random()*2-1),h=(1-u*u)*2.2*Math.random();part([f.p[0]+cr[0]*u*w-f.d[0]*u*u*1.5,y+h,f.p[2]+cr[2]*u*w-f.d[2]*u*u*1.5],[f.d[0]*5+(Math.random()-.5),2+Math.random()*2,f.d[2]*5+(Math.random()-.5)],.5,.16,mul(f.c,1.8),0,9)}}
  if(f.life<=0)S.fx.splice(i,1)}
 for(let i=S.arcs.length-1;i>=0;i--){S.arcs[i].life-=rdt;if(S.arcs[i].life<=0)S.arcs.splice(i,1)}
 for(let i=S.parts.length-1;i>=0;i--){const q=S.parts[i],dt=rdt;q.life-=dt;if(q.life<=0){S.parts[i]=S.parts[S.parts.length-1];S.parts.pop();continue}q.v[1]-=q.grav*dt;if(q.drag){const k=Math.exp(-q.drag*dt);q.v[0]*=k;q.v[1]*=k;q.v[2]*=k}q.p[0]+=q.v[0]*dt;q.p[1]+=q.v[1]*dt;q.p[2]+=q.v[2]*dt}
 for(const c of S.npcs){c.spd=0;const d=sub(p.pos,c.pos);if(Math.hypot(d[0],d[2])<16)c.yaw=angLerp(c.yaw,Math.atan2(d[0],d[2]),1-Math.exp(-3*dt))}}
