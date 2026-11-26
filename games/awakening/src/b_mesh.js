/* ================= procedural meshes ================= */
function pushV(a,p,n,e){a.push(p[0],p[1],p[2],n[0],n[1],n[2],e?e[0]:0,e?e[1]:0,e?e[2]:0,e?e[3]:0)}
function sphereGeo(segs,rings){const v=[],ix=[];for(let i=0;i<=rings;i++){const t=i/rings*Math.PI;for(let j=0;j<=segs;j++){const p=j/segs*Math.PI*2,n=[Math.sin(t)*Math.cos(p),Math.cos(t),Math.sin(t)*Math.sin(p)];pushV(v,n,n,[j/segs,i/rings,0,0])}}
 for(let i=0;i<rings;i++)for(let j=0;j<segs;j++){const a=i*(segs+1)+j,b=a+segs+1;ix.push(a,b,a+1,b,b+1,a+1)}return[new Float32Array(v),new Uint32Array(ix)]}
/* lathe: profile [[r,y]...] bottom to top; flat=true gives faceted shading */
function latheGeo(prof,segs,flat){const v=[],ix=[];const P=(k,j)=>{const a=j/segs*Math.PI*2;return[prof[k][0]*Math.cos(a),prof[k][1],prof[k][0]*Math.sin(a)]};
 if(flat){for(let k=0;k<prof.length-1;k++)for(let j=0;j<segs;j++){const a=P(k,j),b=P(k,j+1),c=P(k+1,j+1),d=P(k+1,j);const tx=prof[k+1][0]-prof[k][0],ty=prof[k+1][1]-prof[k][1],l=Math.hypot(tx,ty)||1,am=(j+.5)/segs*Math.PI*2;
   const ex=[ty/l*Math.cos(am),-tx/l,ty/l*Math.sin(am)];let n=cross(sub(c,a),sub(b,a));if(vlen(n)<1e-9)n=cross(sub(d,a),sub(c,a));n=norm(n);if(dot(n,ex)<0)n=mul(n,-1);
   const o=v.length/VSZ;for(const q of[a,b,c,d])pushV(v,q,n,[0,q[1],0,0]);ix.push(o,o+1,o+2,o,o+2,o+3)}}
 else{for(let k=0;k<prof.length;k++){const p0=prof[Math.max(0,k-1)],p1=prof[Math.min(prof.length-1,k+1)];let tx=p1[0]-p0[0],ty=p1[1]-p0[1];const l=Math.hypot(tx,ty)||1;const nr=ty/l,ny=-tx/l;
   for(let j=0;j<=segs;j++){const a=j/segs*Math.PI*2;pushV(v,[prof[k][0]*Math.cos(a),prof[k][1],prof[k][0]*Math.sin(a)],[nr*Math.cos(a),ny,nr*Math.sin(a)],[j/segs,k/(prof.length-1),0,0])}}
  for(let k=0;k<prof.length-1;k++)for(let j=0;j<segs;j++){const a=k*(segs+1)+j,b=a+segs+1;ix.push(a,b,a+1,b,b+1,a+1)}}
 return[new Float32Array(v),new Uint32Array(ix)]}
function boxGeo(){const v=[],ix=[];const F=[[[1,0,0],[0,1,0],[0,0,1]],[[-1,0,0],[0,1,0],[0,0,-1]],[[0,1,0],[0,0,1],[1,0,0]],[[0,-1,0],[0,0,1],[-1,0,0]],[[0,0,1],[1,0,0],[0,1,0]],[[0,0,-1],[1,0,0],[0,-1,0]]];
 for(const[n,u,w]of F){const o=v.length/VSZ;for(const[a,b]of[[-1,-1],[1,-1],[1,1],[-1,1]])pushV(v,[(n[0]+u[0]*a+w[0]*b)/2,(n[1]+u[1]*a+w[1]*b)/2,(n[2]+u[2]*a+w[2]*b)/2],n,[a,b,0,0]);ix.push(o,o+1,o+2,o,o+2,o+3)}return[new Float32Array(v),new Uint32Array(ix)]}
function torusGeo(R,r,segs,sides){const v=[],ix=[];for(let i=0;i<=segs;i++){const a=i/segs*Math.PI*2;for(let j=0;j<=sides;j++){const b=j/sides*Math.PI*2,n=[Math.cos(a)*Math.cos(b),Math.sin(b),Math.sin(a)*Math.cos(b)];pushV(v,[Math.cos(a)*(R+r*Math.cos(b)),r*Math.sin(b),Math.sin(a)*(R+r*Math.cos(b))],n)}}
 for(let i=0;i<segs;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j,b=a+sides+1;ix.push(a,b,a+1,b,b+1,a+1)}return[new Float32Array(v),new Uint32Array(ix)]}
function icoGeo(sub){const t=(1+Math.sqrt(5))/2;let P=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(norm);
 let T=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
 for(let s=0;s<sub;s++){const c={},T2=[];const mid=(a,b)=>{const k=a<b?a+'_'+b:b+'_'+a;if(c[k]==null){P.push(norm([(P[a][0]+P[b][0])/2,(P[a][1]+P[b][1])/2,(P[a][2]+P[b][2])/2]));c[k]=P.length-1}return c[k]};
  for(const[a,b,d]of T){const ab=mid(a,b),bd=mid(b,d),da=mid(d,a);T2.push([a,ab,da],[b,bd,ab],[d,da,bd],[ab,bd,da])}T=T2}return[P,T]}
function geoFromPT(P,T){const N=P.map(()=>[0,0,0]);for(const[a,b,c]of T){const n=cross(sub(P[b],P[a]),sub(P[c],P[a]));for(const i of[a,b,c]){N[i][0]+=n[0];N[i][1]+=n[1];N[i][2]+=n[2]}}
 const v=[];P.forEach((p,i)=>{let n=norm(N[i]);if(dot(n,p)<0)n=mul(n,-1);pushV(v,p,n)});return[new Float32Array(v),new Uint32Array(T.flat())]}
function rockGeo(seed,flatTop){const[P0,T]=icoGeo(3);const P=P0.map(p=>{const r=.72+fbm3(p[0]*1.3+seed,p[1]*1.3+seed*.7,p[2]*1.3-seed,4)*.62+Math.pow(vnoise3(p[0]*3+seed,p[1]*3,p[2]*3),2)*.18;let q=[p[0]*r,p[1]*r*.82,p[2]*r];
  if(flatTop){if(q[1]>0)q[1]=q[1]*.05+(vnoise3(q[0]*2,seed,q[2]*2)-.5)*.03;else q[1]*=1.5}return q});return geoFromPT(P,T)}

/* ---------------- island height field ---------------- */
const RIM_Y=-5,LAKE_Y=-150;
function islandR(th){return 80+9*Math.sin(3*th+1)+5*Math.sin(5*th+2.3)+12*(fbm(Math.cos(th)*2+4,Math.sin(th)*2+9,3)-.5)}
function hRaw(x,z){let h=fbm(x*.016+5.2,z*.016+1.7,5)*18-7;h+=9*Math.exp(-((x+14)*(x+14)+(z+50)*(z+50))/676);h+=7*Math.exp(-((x-54)*(x-54)+(z+10)*(z+10))/324);
 h+=11*Math.exp(-((x+46)*(x+46)+(z+22)*(z+22))/400);h+=(fbm(x*.09,z*.09,3)-.5)*1.6;return h}
const PATHS=[[[0,66],[2,44],[0,24],[0,12]],[[-3,-12],[-9,-30],[-13,-44]],[[12,-2],[32,-8],[48,-10]],[[-12,4],[-38,10],[-64,11]]];
function pathD(x,z){let m=1e9;for(const pl of PATHS)for(let i=0;i<pl.length-1;i++){const ax=pl[i][0],az=pl[i][1],bx=pl[i+1][0]-ax,bz=pl[i+1][1]-az;const t=clamp(((x-ax)*bx+(z-az)*bz)/(bx*bx+bz*bz),0,1);const d=Math.hypot(x-ax-bx*t,z-az-bz*t);if(d<m)m=d}return m}
function hTopF(x,z){const r=Math.hypot(x,z),R=islandR(Math.atan2(z,x)),e=sstep(0,1,(R-r)/16);let h=hRaw(x,z);h=lerp(h,2,sstep(26,14,r));
 const pd=pathD(x,z);if(pd<5)h=lerp(h,h-.12,sstep(3,1.2,pd));return lerp(RIM_Y,h,e)}
function hBotF(x,z){const r=Math.hypot(x,z),R=islandR(Math.atan2(z,x)),eb=clamp((R-r)/R,0,1);return RIM_Y-Math.pow(eb,.55)*(30+40*fbm(x*.02+3,z*.02+8,4))-18*Math.pow(vnoise(x*.12+1,z*.12+2),3)*sstep(0,.15,eb)}
/* cached height grid for physics and placement */
const HCN=560,HCS=112,HC=new Float32Array(HCN*HCN);
function buildHC(){for(let j=0;j<HCN;j++)for(let i=0;i<HCN;i++){const x=(i/(HCN-1)*2-1)*HCS,z=(j/(HCN-1)*2-1)*HCS;const r=Math.hypot(x,z);HC[j*HCN+i]=r<islandR(Math.atan2(z,x))?hTopF(x,z):-1e4}}
function hAt(x,z){const fx=(x/HCS*.5+.5)*(HCN-1),fz=(z/HCS*.5+.5)*(HCN-1);if(fx<0||fz<0||fx>=HCN-1||fz>=HCN-1)return-1e4;const i=fx|0,j=fz|0,u=fx-i,v=fz-j,a=HC[j*HCN+i],b=HC[j*HCN+i+1],c=HC[(j+1)*HCN+i],d=HC[(j+1)*HCN+i+1];
 if(a<-999||b<-999||c<-999||d<-999)return-1e4;return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function nAt(x,z){const e=.5,hx=hAt(x+e,z)-hAt(x-e,z),hz=hAt(x,z+e)-hAt(x,z-e);if(Math.abs(hx)>50||Math.abs(hz)>50)return[0,1,0];return norm([-hx,2*e,-hz])}
function terrainGeo(bottom){const NR=150,NS=340,v=[],ix=[];
 for(let k=0;k<=NR;k++)for(let j=0;j<=NS;j++){const th=j/NS*Math.PI*2,R=islandR(th),r=Math.pow(k/NR,.92)*R,x=r*Math.cos(th),z=r*Math.sin(th);const f=bottom?hBotF:hTopF,y=f(x,z),e=.35;
  let n=norm([-(f(x+e,z)-f(x-e,z)),2*e,-(f(x,z+e)-f(x,z-e))]);if(bottom)n=[-n[0],-n[1],-n[2]];
  let ao=1;if(!bottom){let s=0;for(let q=0;q<6;q++){const a=q/6*6.283;s+=Math.max(0,hTopF(x+Math.cos(a)*3.5,z+Math.sin(a)*3.5)-y)}ao=clamp(1-s/6*.16,.45,1)}
  pushV(v,[x,y,z],n,[sstep(18,13,r),sstep(2.9,1.5,pathD(x,z)),ao,k/NR])}
 for(let k=0;k<NR;k++)for(let j=0;j<NS;j++){const a=k*(NS+1)+j,b=a+NS+1;ix.push(a,b,a+1,b,b+1,a+1)}return[new Float32Array(v),new Uint32Array(ix)]}
function mountainGeo(){const NR=14,NS=120,v=[],ix=[];const H=(x,z,t)=>{const rd=Math.pow(1-Math.abs(2*vnoise(x*.0016+3,z*.0016+7)-1),2.2);return LAKE_Y-6+(rd*560+fbm(x*.004,z*.004,4)*260)*Math.sin(Math.PI*clamp(t,0,1))**.7};
 for(let k=0;k<=NR;k++)for(let j=0;j<=NS;j++){const th=j/NS*Math.PI*2,t=k/NR,r=1500+t*1500,x=r*Math.cos(th),z=r*Math.sin(th),y=H(x,z,t),e=30;
  const n=norm([-(H(x+e,z,t)-H(x-e,z,t)),2*e,-(H(x,z+e,t)-H(x,z-e,t))]);pushV(v,[x,y,z],n,[0,0,1,t])}
 for(let k=0;k<NR;k++)for(let j=0;j<NS;j++){const a=k*(NS+1)+j,b=a+NS+1;ix.push(a,b,a+1,b,b+1,a+1)}return[new Float32Array(v),new Uint32Array(ix)]}
function discGeo(R,segs,rings){const v=[],ix=[];for(let k=0;k<=rings;k++)for(let j=0;j<=segs;j++){const a=j/segs*Math.PI*2,r=R*Math.pow(k/rings,2.2);pushV(v,[r*Math.cos(a),0,r*Math.sin(a)],[0,1,0])}
 for(let k=0;k<rings;k++)for(let j=0;j<segs;j++){const a=k*(segs+1)+j,b=a+segs+1;ix.push(a,b,a+1,b,b+1,a+1)}return[new Float32Array(v),new Uint32Array(ix)]}
