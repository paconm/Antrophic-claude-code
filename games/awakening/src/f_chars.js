/* ================= characters: heroes, posing, cloth cloaks ================= */
const HERO={
 ren:{n:'Ren',el:'gravity',nat:'gravemont',race:'Human · Emberfall',sc:1,wp:'stones',air:'glide',hp:110,melee:0,atk:{t:'proj',dmg:17,sp:30,r:.42,cd:.42,n:'Gravity Bolt'},skill:{t:'well',n:'Event Horizon',cd:7},cloak:[.07,.05,.13],clen:.9},
 lyra:{n:'Lyra',el:'wind',nat:'sylvaris',race:'Elf · Silverwood',sc:1,wp:'bow',air:'double',hp:95,melee:0,atk:{t:'proj',dmg:23,sp:62,r:.25,cd:.5,pierce:1,n:'Gale Arrow'},skill:{t:'dash',n:'Gale Step',cd:5},cloak:[.05,.14,.1],clen:1.05},
 torvin:{n:'Torvin',el:'earth',nat:'kharak',race:'Dwarf · Deepforge',sc:.8,msc:1,wp:'hammer',air:'none',hp:150,melee:1,atk:{t:'melee',dmg:32,r:3.2,cd:.55,n:'Forge Hammer'},skill:{t:'slam',n:'Worldbreaker',cd:7},cloak:[.16,.07,.03],clen:.7},
 kaida:{n:'Kaida',el:'lightning',nat:'voltara',race:'Human · Sparkhaven',sc:.97,wp:'daggers',air:'double',hp:95,melee:0,atk:{t:'bolt',dmg:15,r:17,cd:.32,n:'Arc Dagger'},skill:{t:'chain',n:'Chain Storm',cd:6},cloak:[.03,.05,.12],clen:.6},
 nerissa:{n:'Nerissa',el:'water',nat:'thalassa',race:'Merfolk · Tide Courts',sc:1,wp:'trident',air:'glide',hp:105,melee:0,atk:{t:'proj',dmg:19,sp:36,r:.4,cd:.45,n:'Tide Lance'},skill:{t:'wave',n:'Tidal Surge',cd:6.5},cloak:[.03,.12,.17],clen:.9},
 pip:{n:'Pip',el:'light',nat:'lumeria',race:'Fairy · Lumeria',sc:.72,wp:'wand',air:'glide',hp:85,melee:0,atk:{t:'proj',dmg:9,sp:34,r:.28,cd:.5,count:3,homing:1,n:'Prism Shot'},skill:{t:'burst',n:'Dawnburst',cd:7},cloak:null}};
const NPCS={seraphine:{sc:1.02,cloak:[.5,.5,.56],clen:1.1,wp:'staff'},kael:{sc:1.02,cloak:[.3,.03,.02],clen:.95,wp:'none'}};
const CW=9,CH=11,HUSKC=[.05,.045,.065],LEATH=[.13,.075,.038];
function mkCloak(col,len){const n=CW*CH,v=new Float32Array(n*VSZ),ix=[];for(let j=0;j<CH-1;j++)for(let i=0;i<CW-1;i++){const a=j*CW+i,b=a+CW;ix.push(a,b,a+1,b,b+1,a+1)}
 const m=mesh(v,new Uint32Array(ix),1,true);m.verts=v;inst(m,[0,0,0],X1,Y1,Z1,col,.85,0,0,4,1);m.base=1;return{m,p:new Float32Array(n*3),q:new Float32Array(n*3),init:false,len,acc:0}}
function mkChar(id,o){const H=HERO[id]||NPCS[id]||{};const c=Object.assign({id,pos:[0,0,0],vel:[0,0,0],yaw:0,ph:0,spd:0,air:false,atk:0,cast:0,hit:0,sc:H.sc||1,seed:Math.random()*9,husk:0,dis:0,wp:H.wp||'none',melee:H.melee||0,w:1,
  bones:new Float32Array(17*16),mm:new Float32Array(16)},o||{});c.model=getModel(c.husk===2?'boss':c.husk?'husk':id);c.msc=H.msc||c.sc;c.col={aura:hexL((LOOKS[id]||LOOKS.ren).aura)};c.L=LOOKS[id]||LOOKS.ren;
 if(!c.husk&&H.cloak)c.cloak=mkCloak(H.cloak,H.clen);if(c.husk===2)c.cloak=mkCloak([.02,.015,.03],1);return c}
function stepCloak(c,dt,pin,f,wid){const k=c.cloak,P=k.p,Q=k.q,rv=k.len*c.msc/(CH-1),rh0=wid/(CW-1);
 {const t=pin(4),dx=t[0]-P[12],dy=t[1]-P[13],dz=t[2]-P[14];if(dx*dx+dy*dy+dz*dz>4)k.init=false}
 if(!k.init){for(let j=0;j<CH;j++)for(let i=0;i<CW;i++){const t=pin(i),o=(j*CW+i)*3;P[o]=Q[o]=t[0]-f[0]*j*.02;P[o+1]=Q[o+1]=t[1]-j*rv;P[o+2]=Q[o+2]=t[2]-f[2]*j*.02}k.init=true}
 k.acc=Math.min(k.acc+dt,.05);const h=1/90;while(k.acc>=h){k.acc-=h;
  for(let j=1;j<CH;j++)for(let i=0;i<CW;i++){const o=(j*CW+i)*3,g=.5+.5*Math.sin(E.t*2.3+i*.9+j*.6+c.seed)*Math.sin(E.t*.9+j*.3);const wx=.8*E.wind*(1.6+1.6*g),wz=.6*E.wind*(1.6+1.6*g);
   for(let a=0;a<3;a++){const x=P[o+a],v=(x-Q[o+a])*.985;Q[o+a]=x;P[o+a]=x+v+(a===1?-7.5:a===0?wx:wz)*h*h}}
  for(let it=0;it<3;it++){for(let i=0;i<CW;i++){const t=pin(i);P[i*3]=t[0];P[i*3+1]=t[1];P[i*3+2]=t[2]}
   for(let j=0;j<CH;j++)for(let i=0;i<CW;i++){const o=(j*CW+i)*3;const fix=(o2,rest,w1)=>{const dx=P[o2]-P[o],dy=P[o2+1]-P[o+1],dz=P[o2+2]-P[o+2],d=Math.hypot(dx,dy,dz)||1e-5,e=(d-rest)/d*.5;const a=j===0&&w1?0:1;
      if(a){P[o]+=dx*e;P[o+1]+=dy*e;P[o+2]+=dz*e;P[o2]-=dx*e;P[o2+1]-=dy*e;P[o2+2]-=dz*e}else{P[o2]-=dx*e*2;P[o2+1]-=dy*e*2;P[o2+2]-=dz*e*2}};
    if(j<CH-1)fix(o+CW*3,rv,1);if(i<CW-1&&j>0)fix(o+3,rh0*(1+j*.085),0)}
   for(let j=1;j<CH;j++)for(let i=0;i<CW;i++){const o=(j*CW+i)*3;const dx=P[o]-c.pos[0],dz=P[o+2]-c.pos[2],z=dx*f[0]+dz*f[2],lim=(-.115-.014*j)*c.msc*c.model.K.bulk;if(z>lim){P[o]+=f[0]*(lim-z);P[o+2]+=f[2]*(lim-z)}
    if(P[o+1]<c.pos[1]+.04)P[o+1]=c.pos[1]+.04}}}
 const v=k.m.verts;for(let j=0;j<CH;j++)for(let i=0;i<CW;i++){const o=(j*CW+i)*3,vo=(j*CW+i)*VSZ;const il=Math.max(0,i-1),ir=Math.min(CW-1,i+1),ju=Math.max(0,j-1),jd=Math.min(CH-1,j+1);
  const a=(j*CW+il)*3,b=(j*CW+ir)*3,cc=(ju*CW+i)*3,d=(jd*CW+i)*3;const ex=P[b]-P[a],ey=P[b+1]-P[a+1],ez=P[b+2]-P[a+2],gx=P[d]-P[cc],gy=P[d+1]-P[cc+1],gz=P[d+2]-P[cc+2];
  let nx=ey*gz-ez*gy,ny=ez*gx-ex*gz,nz=ex*gy-ey*gx;const l=Math.hypot(nx,ny,nz)||1;v[vo]=P[o];v[vo+1]=P[o+1];v[vo+2]=P[o+2];v[vo+3]=nx/l;v[vo+4]=ny/l;v[vo+5]=nz/l;v[vo+6]=i/(CW-1);v[vo+7]=j/(CH-1)}
 gl.bindBuffer(gl.ARRAY_BUFFER,k.m.vb);gl.bufferSubData(gl.ARRAY_BUFFER,0,v);k.m.count=1}
const _mc=new Float32Array(16);
function setBone(c,b,o,X,Y,Z){const m=_mc;m[0]=X[0];m[1]=X[1];m[2]=X[2];m[3]=0;m[4]=Y[0];m[5]=Y[1];m[6]=Y[2];m[7]=0;m[8]=Z[0];m[9]=Z[1];m[10]=Z[2];m[11]=0;m[12]=o[0];m[13]=o[1];m[14]=o[2];m[15]=1;m4mul(m,c.model.inv[b],c.bones.subarray(b*16,b*16+16))}
/* pose the skeleton in character space (x left, y up, z forward), write skin matrices, then place gear in the world */
function poseChar(c,dt){const Mo=c.model,J=Mo.J,t=E.t,H=c.husk,run=clamp(c.spd/6.5,0,1.4),ph=c.ph,ms=c.msc,cy=Math.cos(c.yaw),sy=Math.sin(c.yaw);
 const lean=(H?.3:.035)+run*.13+(c.atk>0&&c.melee?.12:0),ax=a=>[[0,Math.cos(a),Math.sin(a)],[0,-Math.sin(a),Math.cos(a)]];const[uL,fL]=ax(lean),[u2,f2]=ax(lean*.5),[uN,fN]=ax(lean*.75);
 const bob=c.air?0:Math.abs(Math.sin(ph))*.045*run+Math.sin(t*1.7+c.seed)*.006,X=[1,0,0],hip=[0,J.hip[1]-bob-(H?.05:0),0];
 const V=(o,a,k)=>[o[0]+a[0]*k,o[1]+a[1]*k,o[2]+a[2]*k],fr=(y)=>{const x=norm(sub(X,mul(y,y[0])));return[x,cross(x,y)]};
 setBone(c,0,hip,X,[0,1,0],[0,0,1]);const sp=V(hip,u2,J.spine[1]-J.hip[1]);setBone(c,1,sp,X,u2,f2);const ch=V(sp,uL,J.chest[1]-J.spine[1]);setBone(c,2,ch,X,uL,fL);
 const nk=V(V(ch,uL,J.neck[1]-J.chest[1]),fL,J.neck[2]);setBone(c,3,nk,X,uN,fN);const hy=Math.sin(t*.45+c.seed*3)*.16*(H?0:1)*(1-clamp(run,0,1)),hl=lean*.35,chy=Math.cos(hy),shy=Math.sin(hy);
 const uH=[0,Math.cos(hl),Math.sin(hl)],fH0=[0,-Math.sin(hl),Math.cos(hl)],xH=[chy,shy*fH0[1],shy*fH0[2]],fH=[-shy,chy*fH0[1],chy*fH0[2]],hd=V(nk,uN,J.head[1]-J.neck[1]);setBone(c,4,hd,xH,uH,fH);
 const hands=[];for(const sg of[1,-1]){const s=sg>0?'L':'R',o3=sg>0?0:3,pl=ph+(sg>0?0:Math.PI),wpn=sg<0;
  let as=.07-Math.sin(pl)*.62*run*(H?.3:1),eb=.24+.75*run,out=.17;if(c.air&&!H){as=-.5;eb=.9;out=.3}
  if(H){as=1.05+Math.sin(t*2.1+c.seed+sg)*.12;eb=.45;if(c.atk>0){as=lerp(.7,2.3,c.atk);eb=.2}}
  else{if(c.cast>0){const k2=sstep(0,.3,c.cast);as=lerp(as,2.5,k2);eb=lerp(eb,.25,k2);out=lerp(out,.5,k2)}
   if(c.atk>0&&(wpn||c.wp==='bow'||c.wp==='daggers')){const k2=sstep(0,.25,c.atk),tg=c.melee?lerp(.5,2.8,Math.pow(c.atk,.6)):1.5;as=lerp(as,tg,k2);eb=lerp(eb,c.melee?.35:.08,k2)}
   else if(!wpn&&c.wp==='bow'){as=lerp(as,.7,.6);eb=.5}else if(wpn&&(c.wp==='trident'||c.wp==='staff')){as=lerp(as,.55,.7);eb=.9}}
  const sh=V(V(V(ch,X,sg*Mo.sk.shX),uL,Mo.sk.shY-Mo.sk.chestY),fL,J.shL[2]),d1=norm([sg*out,uL[1]*-Math.cos(as)+fL[1]*Math.sin(as),uL[2]*-Math.cos(as)+fL[2]*Math.sin(as)]),el=V(sh,d1,Mo.sk.ua),af=as+eb;
  const d2=norm([sg*out*.4,uL[1]*-Math.cos(af)+fL[1]*Math.sin(af),uL[2]*-Math.cos(af)+fL[2]*Math.sin(af)]),wr=V(el,d2,Mo.sk.fa);let[x1,z1]=fr(d1);setBone(c,5+o3,sh,x1,d1,z1);[x1,z1]=fr(d2);setBone(c,6+o3,el,x1,d2,z1);setBone(c,7+o3,wr,x1,d2,z1);hands.push([V(wr,d2,Mo.sk.hl*.45),d2]);
  let a=Math.sin(pl)*.78*run,kb=(.1+1.0*Math.max(0,Math.sin(pl-1.15)))*run;if(c.air){a=.35+sg*.25;kb=.8}if(c.float){a=.12+sg*.1;kb=.42}if(H){a*=.6;kb=kb*.6+.15}
  const hj=[sg*Mo.sk.hipX,hip[1]-.03*Mo.h,0],t1=[sg*.012,-Math.cos(a),Math.sin(a)],kn=V(hj,norm(t1),Mo.sk.thigh),a2=a-kb,t2=norm([0,-Math.cos(a2),Math.sin(a2)]),an=V(kn,t2,Mo.sk.shin);
  [x1,z1]=fr(norm(t1));setBone(c,11+o3,hj,x1,norm(t1),z1);[x1,z1]=fr(t2);setBone(c,12+o3,kn,x1,t2,z1);const fp=-clamp(kb*.55-a*.2,-.2,.7);setBone(c,13+o3,an,X,[0,Math.cos(fp),-Math.sin(fp)],[0,Math.sin(fp),Math.cos(fp)])}
 const m=c.mm;m[0]=cy*ms;m[1]=0;m[2]=-sy*ms;m[3]=0;m[4]=0;m[5]=ms;m[6]=0;m[7]=0;m[8]=sy*ms;m[9]=0;m[10]=cy*ms;m[11]=0;m[12]=c.pos[0];m[13]=c.pos[1];m[14]=c.pos[2];m[15]=1;
 const TW=p=>[c.pos[0]+(p[0]*cy+p[2]*sy)*ms,c.pos[1]+p[1]*ms,c.pos[2]+(-p[0]*sy+p[2]*cy)*ms],DW=p=>[p[0]*cy+p[2]*sy,p[1],-p[0]*sy+p[2]*cy];
 const f=[sy,0,cy],r=[-cy,0,sy],uLw=DW(uL),fLw=DW(fL),s=ms;c.chest=TW(V(ch,uL,.1));c.head=TW(V(hd,uH,.09*Mo.hk));
 /* eyes */
 const xHw=DW(xH),uHw=DW(uH),fHw=DW(fH),er=Mo.eyeR*ms;for(const e of Mo.eyes){const q=sub(e,J.head),p=TW([hd[0]+xH[0]*q[0]+uH[0]*q[1]+fH[0]*q[2],hd[1]+xH[1]*q[0]+uH[1]*q[1]+fH[1]*q[2],hd[2]+xH[2]*q[0]+uH[2]*q[1]+fH[2]*q[2]]);
  if(H)inst(M.sph,add(p,mul(fHw,-.006*ms)),mul(xHw,er*1.1),mul(uHw,er*1.1),mul(fHw,er*1.1),[.6,.3,1],1,0,H===2?9:5,5);else inst(M.sph,p,mul(xHw,er),mul(uHw,er),mul(fHw,er),Mo.eyeC,.07,0,0,13)}
 const HW=(x,y,z)=>{const q=sub(Mo.HP(x,y,z),J.head);return TW([hd[0]+xH[0]*q[0]+uH[0]*q[1]+fH[0]*q[2],hd[1]+xH[1]*q[0]+uH[1]*q[1]+fH[1]*q[2],hd[2]+xH[2]*q[0]+uH[2]*q[1]+fH[2]*q[2]])},hk=Mo.hk*ms;
 if(!H){if(c.L.extra==='goggles')for(const sg of[1,-1]){seg(M.cyl,HW(sg*.036,.058,.088),HW(sg*.036,.064,.112),.024*hk,[.25,.16,.07],.4,.9,0,0);inst(M.sph,HW(sg*.036,.064,.113),mul(xHw,.019*hk),mul(uHw,.019*hk),mul(fHw,.006*hk),[.3,.7,.9],1,0,1.1,5)}
  if(c.L.extra==='wings'){const fl=Math.sin(t*(c.air?22:9)+c.seed)*.4;for(const sg of[1,-1])for(const up of[1,0]){const a=norm(add(add(mul(r,-sg*(.75+.2*Math.cos(fl))),mul(uLw,up?.75:-.35)),mul(fLw,-.35-.45*Math.sin(fl)*(up?1:.6))));const th=norm(cross(a,uLw)),wd=cross(a,th),L2=(up?.36:.24)*s;
    inst(M.sph,add(TW(V(V(ch,X,sg*.05),fL,-.13)),add(mul(a,L2),mul(uLw,.12*s))),mul(th,.006*s),mul(a,L2),mul(wd,(up?.16:.11)*s),c.col.aura,1,0,.95,5)}}
  /* weapons, held in the right hand */
  const[lh0,ld0]=hands[0],[rh0,rd0]=hands[1],lh=TW(lh0),rh=TW(rh0),ld=DW(ld0),rd=DW(rd0),metal=[.18,.18,.2],gold=[.9,.62,.2];
  if(c.wp==='hammer'){const tip=add(rh,mul(norm(add(rd,mul(uLw,.9))),.7*s));seg(M.cyl,add(rh,mul(sub(rh,tip),.3)),tip,.028*s,[.16,.1,.05],.8,0,0,8,1);const d=norm(sub(tip,rh));let x=norm(cross(d,r)),z=cross(x,d);inst(M.box,tip,mul(z,.15*s),mul(d,.17*s),mul(x,.3*s),metal,.35,1,0,0);inst(M.box,tip,mul(z,.158*s),mul(d,.05*s),mul(x,.31*s),gold,.3,1,0,0);c.tip=tip}
  else if(c.wp==='bow'){const up=norm(add(uLw,mul(ld,.25))),a=add(lh,mul(up,.62*s)),b=add(lh,mul(up,-.62*s)),mid=add(lh,mul(fLw,.1*s));seg(M.tap,mid,a,.016*s,[.2,.12,.05],.6,0,0,8,1);seg(M.tap,mid,b,.016*s,[.2,.12,.05],.6,0,0,8,1);seg(M.cyl,a,b,.004*s,[.8,.85,.8],.5,0,.4,0);c.tip=mid}
  else if(c.wp==='daggers'){for(const[h2,d2]of[[lh,ld],[rh,rd]]){let x=norm(cross(d2,r)),z=cross(x,d2);inst(M.cone,h2,mul(x,.01*s),mul(d2,.25*s),mul(z,.026*s),[.55,.7,.8],.22,1,.12,0);seg(M.cyl,add(h2,mul(d2,-.09*s)),h2,.014*s,[.1,.08,.07],.6,0,0,0)}c.tip=add(rh,mul(rd,.3*s))}
  else if(c.wp==='trident'){const d=norm(add(mul(rd,.25),[0,1,0])),b=add(rh,mul(d,-.75*s)),tp=add(rh,mul(d,1.0*s));seg(M.cyl,b,tp,.016*s,gold,.3,1,0,0);for(const q of[-1,0,1]){const o=add(tp,mul(r,q*.07*s));let x=norm(cross(d,r)),z=cross(x,d);inst(M.cone,o,mul(x,.015*s),mul(d,(q?.22:.3)*s),mul(z,.015*s),[.35,.75,1],.25,1,.9,0)}
   seg(M.cyl,add(tp,mul(r,-.07*s)),add(tp,mul(r,.07*s)),.013*s,gold,.3,1,0,0);c.tip=add(tp,mul(d,.25*s))}
  else if(c.wp==='wand'){const tp=add(rh,mul(rd,.32*s));seg(M.tap,rh,tp,.012*s,[.85,.8,.7],.4,0,0,0);inst(M.sph,tp,[.035*s,0,0],[0,.035*s,0],[0,0,.035*s],[1,.9,.6],1,0,4,5);c.tip=tp}
  else if(c.wp==='staff'){const d=norm(add(mul(rd,.15),[0,1,0])),b=add(rh,mul(d,-1.05*s)),tp=add(rh,mul(d,.85*s));seg(M.cyl,b,tp,.018*s,[.8,.8,.85],.4,.6,0,0);inst(M.crys,add(tp,mul(d,.12*s)),[.07*s,0,0],mul(d,.1*s),[0,0,.07*s],[.6,.85,1],1,0,3.5,5);c.tip=tp}
  else if(c.wp==='stones'){for(let i=0;i<3;i++){const a=t*1.7+i*2.094,p=[c.chest[0]+Math.cos(a)*.6*s,c.chest[1]+Math.sin(t*2.3+i*2)*.1*s,c.chest[2]+Math.sin(a)*.6*s];put(M.rock[i],p,.06*s,.06*s,.06*s,[.3,.26,.4],.6,0,.25,2,i,a*2)}c.tip=add(rh,mul(rd,.1))}
  else c.tip=rh;c.hand=rh}
 else{const rh=TW(hands[1][0]),rd=DW(hands[1][1]);c.hand=rh;c.tip=rh;if(H===2){const d=norm(add(rd,mul(uLw,.6))),tp=add(rh,mul(d,1.5*s));let x=norm(cross(d,r)),z=cross(x,d);inst(M.box,add(rh,mul(d,.8*s)),mul(z,.03*s),mul(d,1.5*s),mul(x,.16*s),HUSKC,.3,1,1.6,7,c.dis);inst(M.box,add(rh,mul(d,.8*s)),mul(z,.036*s),mul(d,1.46*s),mul(x,.03*s),[.6,.3,1],1,0,5,5);c.tip=tp}}
 if(c.cloak){const hw=Mo.sk.shX*1.12,up=Mo.sk.shY-Mo.sk.chestY+.03*Mo.h,bk=Mo.b;stepCloak(c,dt||0,i=>{const x=i/(CW-1)*2-1;return TW(V(V(V(ch,X,x*hw),uL,up-.02*Math.abs(x)),fL,-(.078+.05*(1-x*x))*bk))},f,hw*2.15*ms)}}
