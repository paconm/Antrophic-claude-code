/* ================= sculpted characters: signed-distance bodies, surface nets, skinning ================= */
function rcone(a,b,r1,r2){const bx=b[0]-a[0],by=b[1]-a[1],bz=b[2]-a[2],l2=bx*bx+by*by+bz*bz||1e-9,rr=r1-r2,a2=l2-rr*rr,il2=1/l2,ax=a[0],ay=a[1],az=a[2];
 const f=(x,y,z)=>{const px=x-ax,py=y-ay,pz=z-az,yy=px*bx+py*by+pz*bz,zz=yy-l2,qx=px*l2-bx*yy,qy=py*l2-by*yy,qz=pz*l2-bz*yy,x2=qx*qx+qy*qy+qz*qz,y2=yy*yy*l2,z2=zz*zz*l2,k=Math.sign(rr)*rr*rr*x2;
  if(Math.sign(zz)*a2*z2>k)return Math.sqrt(x2+z2)*il2-r2;if(Math.sign(yy)*a2*y2<k)return Math.sqrt(x2+y2)*il2-r1;return(Math.sqrt(x2*a2*il2)+yy*rr)*il2-r1};
 f.c=[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];f.br=Math.sqrt(l2)/2+Math.max(r1,r2);return f}
function ell(c,r,R){const cx=c[0],cy=c[1],cz=c[2],r0=r[0],r1=r[1],r2=r[2],mn=Math.min(r0,r1,r2);
 const f=(x,y,z)=>{let px=x-cx,py=y-cy,pz=z-cz;if(R){const a=px*R[0][0]+py*R[0][1]+pz*R[0][2],b=px*R[1][0]+py*R[1][1]+pz*R[1][2],d=px*R[2][0]+py*R[2][1]+pz*R[2][2];px=a;py=b;pz=d}
  const ax=px/r0,ay=py/r1,az=pz/r2,k0=Math.sqrt(ax*ax+ay*ay+az*az),bx=ax/r0,by=ay/r1,bz=az/r2,k1=Math.sqrt(bx*bx+by*by+bz*bz);return k1<1e-7?-mn:k0*(k0-1)/k1};
 f.c=c;f.br=Math.max(r0,r1,r2);return f}
function torus2(c,rx,rz,r){const f=(x,y,z)=>{const l=Math.hypot((x-c[0])/rx,(z-c[2])/rz);return Math.hypot((l-1)*Math.min(rx,rz),y-c[1])-r};f.c=c;f.br=Math.max(rx,rz)+r;return f}
function sdf(Mo,x,y,z){let best=1e9,bl=0;const Ls=Mo.layers,hd=Mo.mode;for(let li=0;li<Ls.length;li++){const L=Ls[li],pr=hd?L.hp:L.bp;if(!pr.length)continue;let d=1e9;const k=hd&&L.kh?L.kh:L.k;
  for(let i=0;i<pr.length;i++){const f=pr[i],c=f.c,dx=x-c[0],dy=y-c[1],dz=z-c[2];if(Math.sqrt(dx*dx+dy*dy+dz*dz)-f.br>d+k)continue;const q=f(x,y,z)+(hd?f.shr||0:0),hh=Math.max(k-Math.abs(d-q),0)/k;d=Math.min(d,q)-hh*hh*k*.25}
  const sb=hd?L.hs:L.bs;for(let i=0;i<sb.length;i++){const f=sb[i],q=-f(x,y,z),kk=f.k,hh=Math.max(kk-Math.abs(d-q),0)/kk;d=Math.max(d,q)+hh*hh*kk*.25}
  if(L.noise&&d<.02)d+=(vnoise3(x*L.noise[1],y*L.noise[2],z*L.noise[3])-.5)*L.noise[0];if(d<best){best=d;bl=li}}Mo.hit=bl;return best}
function surfNets(ev,mn,mx,h){const C=4,nx=C*Math.ceil((mx[0]-mn[0])/h/C)+1,ny=C*Math.ceil((mx[1]-mn[1])/h/C)+1,nz=C*Math.ceil((mx[2]-mn[2])/h/C)+1,N=nx*ny*nz,V=new Float32Array(N).fill(NaN),sy=nx,sz=nx*ny;
 for(let k=0;k<nz;k+=C)for(let j=0;j<ny;j+=C)for(let i=0;i<nx;i+=C)V[i+j*sy+k*sz]=ev(mn[0]+i*h,mn[1]+j*h,mn[2]+k*h);
 const lim=C*h*1.85,act=[];for(let k=0;k<nz-1;k+=C)for(let j=0;j<ny-1;j+=C)for(let i=0;i<nx-1;i+=C){let m=1e9;const o=i+j*sy+k*sz;for(let c=0;c<8;c++){const a=Math.abs(V[o+(c&1?C:0)+(c&2?C*sy:0)+(c&4?C*sz:0)]);if(a<m)m=a}if(m<lim)act.push(i,j,k)}
 for(let q=0;q<act.length;q+=3){const i=act[q],j=act[q+1],k=act[q+2];for(let kk=k;kk<=k+C;kk++)for(let jj=j;jj<=j+C;jj++)for(let ii=i;ii<=i+C;ii++){const o=ii+jj*sy+kk*sz;if(V[o]!==V[o])V[o]=ev(mn[0]+ii*h,mn[1]+jj*h,mn[2]+kk*h)}}
 for(let k=0;k<nz;k++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const o=i+j*sy+k*sz;if(V[o]!==V[o])V[o]=V[Math.min(i-i%C,nx-1-C)+Math.min(j-j%C,ny-1-C)*sy+Math.min(k-k%C,nz-1-C)*sz]}
 const vid=new Int32Array(N).fill(-1),P=[],ED=[0,1,2,3,4,5,6,7,0,2,1,3,4,6,5,7,0,4,1,5,2,6,3,7],v=new Float32Array(8),OF=[0,1,sy,sy+1,sz,sz+1,sz+sy,sz+sy+1];
 for(let q=0;q<act.length;q+=3)for(let k=act[q+2];k<act[q+2]+C;k++)for(let j=act[q+1];j<act[q+1]+C;j++)for(let i=act[q];i<act[q]+C;i++){const o=i+j*sy+k*sz;let neg=0;for(let c=0;c<8;c++){v[c]=V[o+OF[c]];if(v[c]<0)neg++}if(neg===0||neg===8)continue;
  let sx=0,sy2=0,sz2=0,n=0;for(let e=0;e<24;e+=2){const a=ED[e],b=ED[e+1];if((v[a]<0)!==(v[b]<0)){const t=v[a]/(v[a]-v[b]);sx+=(a&1)+((b&1)-(a&1))*t;sy2+=(a>>1&1)+((b>>1&1)-(a>>1&1))*t;sz2+=(a>>2&1)+((b>>2&1)-(a>>2&1))*t;n++}}
  vid[o]=P.length/3;P.push(mn[0]+(i+sx/n)*h,mn[1]+(j+sy2/n)*h,mn[2]+(k+sz2/n)*h)}
 const I=[];const quad=(a,b,c,d)=>{if(a>=0&&b>=0&&c>=0&&d>=0)I.push(a,b,c,a,c,d)};
 for(let k=1;k<nz-1;k++)for(let j=1;j<ny-1;j++)for(let i=1;i<nx-1;i++){const o=i+j*sy+k*sz,s=V[o]<0;if((V[o+1]<0)!==s)quad(vid[o-sy-sz],vid[o-sz],vid[o],vid[o-sy]);if((V[o+sy]<0)!==s)quad(vid[o-1-sz],vid[o-sz],vid[o],vid[o-1]);if((V[o+sz]<0)!==s)quad(vid[o-1-sy],vid[o-sy],vid[o],vid[o-1])}
 return[P,I]}
/* project vertices to the surface, take normals from the field, and assign colour, material and two bone weights */
function finishMesh(Mo,P,I,h,sig){const n=P.length/3,out=new Float32Array(n*15),e=h*.4,wB=new Float32Array(17),col=[0,0,0,0,0,0];
 for(let i=0;i<n;i++){let x=P[i*3],y=P[i*3+1],z=P[i*3+2];for(let it=0;it<2;it++){const d=sdf(Mo,x,y,z);let gx=sdf(Mo,x+e,y,z)-d,gy=sdf(Mo,x,y+e,z)-d,gz=sdf(Mo,x,y,z+e)-d;const l=Math.hypot(gx,gy,gz)||1;gx/=l;gy/=l;gz/=l;const s=clamp(d,-h,h);x-=gx*s;y-=gy*s;z-=gz*s;if(it){out[i*15+3]=gx;out[i*15+4]=gy;out[i*15+5]=gz}}
  sdf(Mo,x,y,z);const L=Mo.layers[Mo.hit];col[0]=L.col[0];col[1]=L.col[1];col[2]=L.col[2];col[3]=L.rough;col[4]=L.metal;col[5]=L.mat;if(L.paint)L.paint(x,y,z,col,Mo);if(Mo.paint)Mo.paint(x,y,z,col,L);
  let b0=4,b1=4,w0=1;if(!Mo.mode){wB.fill(0);const pr=L.bp;let dm=1e9;for(let q=0;q<pr.length;q++){const dq=pr[q](x,y,z);pr[q]._d=dq;if(dq<dm)dm=dq}for(let q=0;q<pr.length;q++)wB[pr[q].bone]+=Math.exp(-Math.max(pr[q]._d-dm,0)/sig);
   let m0=-1,m1=-1;for(let b=0;b<17;b++){if(m0<0||wB[b]>wB[m0]){m1=m0;m0=b}else if(m1<0||wB[b]>wB[m1])m1=b}b0=m0;b1=m1<0?m0:m1;w0=wB[b0]/(wB[b0]+wB[b1]||1)}
  const o=i*15;out[o]=x;out[o+1]=y;out[o+2]=z;out[o+6]=col[0];out[o+7]=col[1];out[o+8]=col[2];out[o+9]=col[3];out[o+10]=col[4];out[o+11]=col[5];out[o+12]=b0;out[o+13]=b1;out[o+14]=w0}
 return out}
function skinMesh(v,ix){const m={n:ix.length,nv:v.length/15,vao:gl.createVertexArray()};gl.bindVertexArray(m.vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,v,gl.STATIC_DRAW);
 for(let l=0;l<5;l++){gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,3,gl.FLOAT,false,60,l*12)}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(ix),gl.STATIC_DRAW);gl.bindVertexArray(null);return m}
const BODY={ren:{race:'human',fem:0,kit:'tunic'},lyra:{race:'elf',fem:1,kit:'robe'},torvin:{race:'dwarf',fem:0,kit:'apron'},kaida:{race:'human',fem:1,kit:'jacket'},nerissa:{race:'mer',fem:1,kit:'scale'},pip:{race:'fairy',fem:1,kit:'dress'},
 kael:{race:'human',fem:0,kit:'coat'},seraphine:{race:'elf',fem:1,kit:'robe'},husk:{race:'husk',fem:0,kit:'none'},boss:{race:'husk',fem:0,kit:'boss'}};
const RACEK={human:[{},{sw:.87,bulk:.84,hipw:1.06,neck:.88}],elf:[{h:1.02,sw:.95,bulk:.88,neck:1.08},{h:1.02,leg:1.03,sw:.84,bulk:.79,hipw:1.03,neck:1.05,head:.97}],dwarf:[{leg:.62,torso:.9,arm:.86,sw:1.2,bulk:1.36,head:1.12,neck:.8,hipw:1.22,belly:0}],
 mer:[{},{sw:.87,bulk:.84,hipw:1.06,neck:.9}],fairy:[{},{sw:.85,bulk:.78,hipw:1.02,neck:.9,head:1.07}],husk:[{leg:1.02,arm:1.2,sw:.94,bulk:.66,neck:1.1,head:.96}]};
const KITS={tunic:{sl:0,sk:1,boots:1,belt:1,brac:1,pau:1,col:1},coat:{sl:1,sk:2,boots:1,belt:1,brac:0,pau:0,col:1},jacket:{sl:1,sk:0,boots:1,belt:1,brac:1,pau:0,col:1},robe:{sl:2,sk:3,boots:1,belt:1,brac:0,pau:0,col:1},
 dress:{sl:0,sk:4,boots:0,belt:1,brac:0,pau:0,col:1},apron:{sl:0,sk:1,boots:1,belt:1,brac:2,pau:2,col:0},scale:{sl:0,sk:1,boots:1,belt:1,brac:1,pau:1,col:1,metal:1}};
const MODELS={};
function getModel(id){return MODELS[id]||(MODELS[id]=buildModel(id))}
function buildModel(id){const t0=performance.now(),B=BODY[id]||BODY.ren,Lk=LOOKS[id]||LOOKS.ren,husk=B.race==='husk',boss=B.kit==='boss',fem=B.fem;
 const K=Object.assign({h:1,leg:1,torso:1,arm:1,sw:1,bulk:1,head:1,neck:1,hipw:1,belly:0},RACEK[B.race][fem]||RACEK[B.race][0]),h=K.h,b=K.bulk*h;
 const ank=.085*h,shin=.42*h*K.leg,thigh=.44*h*K.leg,hipY=ank+shin+thigh,hipX=.09*K.hipw*h,chestY=hipY+.34*h*K.torso,neckB=chestY+.2*h*K.torso,headP=neckB+.085*h*K.neck,hk=K.head*h,headC=headP+.088*hk;
 const shY=chestY+.15*h*K.torso,shX=.178*h*K.sw,ua=.285*h*K.arm,fa=.255*h*K.arm,hl=.17*h*K.arm,J={hip:[0,hipY,0],spine:[0,hipY+.07*h,0],chest:[0,chestY,0],neck:[0,neckB,-.008*h],head:[0,headP,0]};
 for(const sg of[1,-1]){const s=sg>0?'L':'R',ad=[sg*Math.sin(.44),-Math.cos(.44),0];J['ad'+s]=ad;J['sh'+s]=[sg*shX,shY,-.01*h];J['el'+s]=add(J['sh'+s],mul(ad,ua));J['wr'+s]=add(J['el'+s],mul(ad,fa));J['ht'+s]=add(J['wr'+s],mul(ad,hl));
  J['hj'+s]=[sg*hipX,hipY-.03*h,0];J['kn'+s]=[sg*hipX*1.05,ank+shin,.01*h];J['an'+s]=[sg*hipX*1.05,ank,-.015*h]}
 const Mo={id,J,K,h,b,hk,headC,layers:[],mode:0,hit:0,sk:{hipY,hipX,chestY,neckB,headP,shY,shX,ua,fa,hl,thigh:vlen(sub(J.knL,J.hjL)),shin:vlen(sub(J.anL,J.knL)),ank}};
 const layer=(col,rough,metal,mat,k,ex)=>{const L=Object.assign({col,rough,metal,mat,k,bp:[],hp:[],bs:[],hs:[]},ex);Mo.layers.push(L);return L};
 const A=(L,bone,f,sub,k)=>{f.bone=bone;if(sub){f.k=k||.006;(bone===4?L.hs:L.bs).push(f)}else(bone===4?L.hp:L.bp).push(f);return f};
 const skc=husk?(boss?[.04,.035,.055]:HUSKC):mul(hexL(Lk.skin),.86),hrc=hexL(Lk.hairC),outc=hexL(Lk.outC),trc=hexL(Lk.trim),SM=husk?7:3;
 const SK=layer(skc,husk?.75:.5,0,SM,.022*h);
 const body=(L,g,parts,bo)=>{const has=p=>parts.includes(p);
  if(has('pelvis'))A(L,0,ell([0,hipY+.01*h,0],[.156*K.hipw*h*Math.max(1,K.bulk*.82)+g,.118*h+g,.118*b+g]));
  if(has('torso')){A(L,1,rcone([0,hipY+.04*h,.004*h],[0,chestY-.05*h,0],.128*b*(fem?.9:1)+g,.12*b*(fem?.82:1)+g));A(L,2,ell([0,chestY+.03*h,0],[.156*K.sw*(fem?.93:1)*h*Math.max(1,K.bulk*.86)+g,.155*h*K.torso+g,.112*b+g]));
   A(L,2,rcone([-shX*.86,shY-.005*h,-.012*h],[shX*.86,shY-.005*h,-.012*h],.056*b+g,.056*b+g));if(fem&&!husk)for(const sg of[1,-1])A(L,2,ell([sg*.06*h,chestY+.062*h,.08*b],[.05*h+g,.048*h+g,.044*h+g]));
   if(K.belly)A(L,1,ell([0,hipY+.15*h,.05*b],[.14*b+g,.14*h+g,.125*b+g]))}
  for(const sg of[1,-1]){const s=sg>0?'L':'R',o3=sg>0?0:3;
   if(has('uarm')){A(L,5+o3,ell(J['sh'+s],[.055*b+g,.054*b+g,.054*b+g]));A(L,5+o3,rcone(J['sh'+s],J['el'+s],.05*b+g*.8,.041*b+g*.8))}
   if(has('farm'))A(L,6+o3,rcone(J['el'+s],lerp3(J['el'+s],J['wr'+s],bo||1),.043*b+g*.8,(bo?.038:.03)*b+g*.8));
   if(has('thigh'))A(L,11+o3,rcone(J['hj'+s],J['kn'+s],(fem?.09:.086)*b+g,.056*b+g));
   if(has('shin')){A(L,12+o3,rcone(J['kn'+s],J['an'+s],.056*b+g,.036*b+g));A(L,12+o3,ell([J['kn'+s][0],ank+shin*.68,-.022*b],[.046*b+g,.11*h*K.leg+g,.05*b+g]))}}};
 /* head */
 const HP=(x,y,z)=>[x*hk,headC+y*hk,(z+.012)*hk],S3=(a,b2,c)=>[a*hk,b2*hk,c*hk];Mo.HP=HP;
 SK.kh=.011*hk;A(SK,4,ell(HP(0,.03,-.012),S3(.079,.09,.096)));A(SK,4,ell(HP(0,-.038,.016),S3(.062,.084,.074)));A(SK,4,ell(HP(0,-.1,.05),S3(fem?.021:.027,.02,.022)));
 for(const sg of[1,-1]){A(SK,4,ell(HP(sg*.045,-.066,.004),S3(fem?.016:.022,.026,.028)));A(SK,4,ell(HP(sg*.046,-.02,.05),S3(.02,.016,.016)));
  if(husk)A(SK,4,ell(HP(sg*.032,.006,.082),S3(.024,.02,.02)),1,.006*hk);else{A(SK,4,ell(HP(sg*.031,.014,.068),S3(.019,.0075,.011)));A(SK,4,ell(HP(sg*.031,.004,.074),S3(.0145,.0056,.013)),1,.0035*hk);A(SK,4,ell(HP(sg*.0115,-.04,.088),S3(.0075,.007,.008)))}
  const er=husk?'none':Lk.ears;if(!husk)A(SK,4,ell(HP(sg*.079,-.006,-.004),S3(.008,.03,.018)));
  if(er==='elf'||er==='pointy')A(SK,4,rcone(HP(sg*.08,.002,-.006),er==='elf'?HP(sg*.118,.085,-.075):HP(sg*.105,.055,-.045),.015*hk,.003*hk));
  if(er==='fin')for(const q of[0,1,2])A(SK,4,rcone(HP(sg*.08,-.005,-.006),HP(sg*(.13-q*.01),.07-q*.055,-.05-q*.02),.011*hk,.003*hk))}
 A(SK,4,rcone(HP(-.04,.03,.071),HP(.04,.03,.071),(fem?.008:.011)*hk,(fem?.008:.011)*hk));
 if(husk){A(SK,4,ell(HP(0,-.03,.095),S3(.012,.02,.02)),1,.006*hk);for(const sg of[1,-1])A(SK,4,ell(HP(sg*.05,-.05,.065),S3(.014,.03,.02)),1,.012*hk);A(SK,4,ell(HP(0,-.074,.088),S3(.024,.006,.02)),1,.004*hk)}
 else{A(SK,4,rcone(HP(0,.02,.07),HP(0,-.03,.095),.007*hk,.0095*hk));A(SK,4,ell(HP(0,-.035,.097),S3(.011,.0095,.0105)));A(SK,4,ell(HP(0,-.066,.079),S3(.019,.0065,.011)));A(SK,4,ell(HP(0,-.077,.077),S3(.016,.0075,.011)))}
 const nk=A(SK,3,rcone(J.neck,[0,headP+.03*hk,-.004*h],.052*b*(fem?.84:1),.047*b*(fem?.84:1)));const nk2=rcone(J.neck,[0,headP+.03*hk,-.004*h],.05*b*(fem?.84:1),.045*b*(fem?.84:1));nk2.bone=4;SK.hp.push(nk2);
 /* hands and, when bare, the body */
 for(const sg of[1,-1]){const s=sg>0?'L':'R',o3=sg>0?0:3,ad=J['ad'+s],Za=[0,0,1],Xa=norm(cross(ad,Za)),R=[Xa,ad,Za],w=J['wr'+s],hs=husk?1.25:(fem?.88:1)*Math.max(1,K.bulk*.8);
  A(SK,7+o3,ell(add(w,mul(ad,.045*h*hs)),[.017*h*hs,.046*h*hs,.039*h*hs],R));A(SK,7+o3,ell(add(w,mul(ad,.1*h*hs)),[.0145*h*hs,.04*h*hs,.035*h*hs],R));A(SK,7+o3,rcone(add(w,add(mul(ad,.03*h),[0,0,.03*h*hs])),add(w,add(mul(ad,.09*h*hs),[0,0,.055*h*hs])),.012*h*hs,.009*h*hs));
  if(husk)for(const q of[-1,0,1])A(SK,7+o3,rcone(add(w,add(mul(ad,.13*h),[0,0,q*.022*h])),add(w,add(mul(ad,.27*h),[0,0,q*.04*h])),.011*h,.002*h))}
 const kit=KITS[B.kit];
 if(!kit){body(SK,0,['pelvis','torso','uarm','farm','thigh','shin']);for(const sg of[1,-1]){const s=sg>0?'L':'R',a=J['an'+s];A(SK,sg>0?13:16,rcone([a[0],.04*h,-.03*h],[a[0],.03*h,.14*h],.042*b,.03*b))}
  if(boss){const AR=layer([.03,.028,.045],.3,1,7,.012);for(const sg of[1,-1]){const s=sg>0?'L':'R',o3=sg>0?0:3;A(AR,5+o3,ell(add(J['sh'+s],[sg*.02,.03,0]),[.1*b,.07*b,.1*b]));A(AR,5+o3,rcone(add(J['sh'+s],[sg*.03,.06,0]),add(J['sh'+s],[sg*.15,.2,0]),.03,.004));
    A(AR,6+o3,rcone(lerp3(J['el'+s],J['wr'+s],.2),lerp3(J['el'+s],J['wr'+s],.95),.05*b,.042*b));A(AR,12+o3,rcone(lerp3(J['kn'+s],J['an'+s],.1),lerp3(J['kn'+s],J['an'+s],.9),.066*b,.05*b))}
   A(AR,2,ell([0,chestY+.03*h,.02],[.17*h,.16*h,.13*b]));A(AR,0,torus2([0,hipY+.08*h,0],.15*b,.13*b,.03));for(let q=0;q<5;q++){const a=q/5*6.283+.3;A(AR,4,rcone(HP(Math.cos(a)*.07,.085,Math.sin(a)*.075-.01),HP(Math.cos(a)*.1,.2,Math.sin(a)*.1-.01),.014*hk,.002*hk))}}}
 else{const g=.011*h,CL=layer(outc,kit.metal?.4:.85,kit.metal?.55:0,4,.02*h),PA=layer(lerp3(mul(outc,.6),[.05,.045,.045],.3),.85,0,4,.02*h),LE=layer(LEATH,.5,0,0,.012*h),ME=layer(lerp3([.5,.45,.38],trc,.6),.32,1,0,.008*h),TR=layer(trc,.6,.3,4,.01*h);
  body(CL,g,kit.sl?['torso','uarm','farm']:['torso','uarm'],kit.sl?.97:0);if(kit.sl===2)for(const sg of[1,-1]){const s=sg>0?'L':'R';A(CL,sg>0?6:9,rcone(lerp3(J['el'+s],J['wr'+s],.4),lerp3(J['el'+s],J['wr'+s],1),.043*b+g,.058*b+g))}
  const skL=[0,.3,.44,0,0][kit.sk]*h*K.leg;let hem=hipY;for(const sg of[1,-1]){const s=sg>0?'L':'R',o3=sg>0?0:3,top=[sg*hipX*.55,hipY+.03*h,0];
   if(kit.sk===1||kit.sk===2){A(CL,11+o3,rcone(top,[sg*hipX*1.0,hipY-skL-.06*h,.005],.114*b+g,.135*b+g));hem=hipY-skL}
   if(kit.sk>=3){const lo=kit.sk===3?ank+.03*h:ank+shin*.45;A(CL,11+o3,rcone(top,[sg*hipX*.95,ank+shin+.02*h,.005],.118*b+g,.115*b+g));A(CL,12+o3,rcone([sg*hipX*.95,ank+shin+.02*h,.005],[sg*hipX*1.3,lo-.05*h,0],.115*b+g,.16*b+g));hem=lo}
   const kn=J['kn'+s],an=J['an'+s];
   if(kit.boots){const bg=.006*b+.003;A(LE,12+o3,rcone(lerp3(kn,an,.5),an,.047*b+bg,.039*b+bg));A(LE,12+o3,rcone(lerp3(kn,an,.48),lerp3(kn,an,.55),.052*b+bg,.05*b+bg));A(LE,13+o3,rcone([an[0],.047*b+.004,-.035*h],[an[0],.04*b,.135*h*Math.max(1,K.bulk*.8)],.046*b+.004,.04*b));}
   else A(SK,13+o3,rcone([an[0],.036*h,-.03*h],[an[0],.026*h,.13*h],.036*b,.026*b));
   if(kit.brac){const L2=kit.brac===2?ME:LE;A(L2,6+o3,rcone(lerp3(J['el'+s],J['wr'+s],.38),lerp3(J['el'+s],J['wr'+s],.94),.038*b+.009,.03*b+.009))}
   if(kit.pau===2||(kit.pau===1&&sg>0)){A(kit.pau===2?ME:LE,5+o3,ell(add(J['sh'+s],[sg*.012*h,.022*h,0]),[.082*b,.052*b,.084*b]))}}
  if(kit.sk>=3)A(CL,0,rcone([0,hipY,0],[0,hem-.05*h,0],.125*b+g,.2*b+g));if(kit.sk){const cut=(x,y,z)=>y-hem;cut.k=.004;cut.bone=0;CL.bs.push(cut)}
  if(kit.sk<3){body(PA,.006*h,['thigh','shin']);body(PA,.007*h,['pelvis'])}if(!kit.boots)body(SK,0,['shin']);if(!kit.sl)body(SK,0,['farm']);
  Mo.hem=hem;CL.paint=(x,y,z,c)=>{if(y<hem+.035*h&&y<hipY){c[0]=trc[0];c[1]=trc[1];c[2]=trc[2];c[3]=.45;c[4]=.6}if(kit.metal){const u=Math.atan2(x,z)*9,v2=y*52,q=Math.abs(((u+Math.floor(v2)*.5)%1+1)%1-.5)+Math.abs((v2%1+1)%1-.5);const k2=.7+.5*q;c[0]*=k2;c[1]*=k2;c[2]*=k2}};
  if(kit.belt){A(LE,1,torus2([0,hipY+.1*h,0],.128*b+g+.004,.118*b+g+.004,.018*h));A(ME,1,ell([0,hipY+.1*h,.118*b+g+.018],[.024*h,.028*h,.01*h]))}
  if(kit.col)A(TR,2,torus2([0,neckB-.014*h,-.006*h],.07*b,.062*b,.021*h));
  if(kit.apron)A(LE,1,ell([0,hipY+.08*h,.118*b+g],[.125*b,.3*h,.022*h]))}
 /* hair, brows, beard */
 if(!husk){const HA=layer(hrc,.45,0,12,.012*hk,{noise:[.013*hk,30/hk,5/hk,30/hk]}),hs=Lk.hair;const cap=(g)=>{A(HA,4,ell(HP(0,.04,-.018),S3(.086+g,.094+g,.104+g)))};
  const BR=layer(mul(hrc,.85),.5,0,12,.006*hk,{noise:[.005*hk,60/hk,12/hk,60/hk]});
  if(hs!=='shaved'){cap(hs==='short'?.003:.007);A(HA,4,ell(HP(0,-.035,.082),S3(.07,.092,.07)),1,.012*hk);for(const sg of[1,-1])A(HA,4,ell(HP(sg*.085,-.03,.0),S3(.02,.05,.035)),1,.01*hk)}
  if(hs==='messy'||hs==='spiky'||hs==='mohawk'){const n=hs==='mohawk'?6:13;for(let i=0;i<n;i++){const a=hs==='mohawk'?0:i*2.4+.5,e=hs==='mohawk'?(i-2.5)*.33:.35+.75*((i*.618)%1),d=hs==='mohawk'?[0,Math.cos(e),Math.sin(e)-.1]:[Math.cos(a)*Math.sin(e),Math.cos(e)*.9+.1,Math.sin(a)*Math.sin(e)-.12];
    const L2=(hs==='messy'?.03:.075)+.03*((i*.37)%1);A(HA,4,rcone(HP(d[0]*.075,.04+d[1]*.075,-.018+d[2]*.085),HP(d[0]*(.085+L2),.04+d[1]*(.085+L2),-.018+d[2]*(.095+L2)),.03*hk,.008*hk))}
   for(const q of[-1,0,1])A(HA,4,rcone(HP(q*.035,.1,.06),HP(q*.045+.008,.045,.095),.02*hk,.006*hk))}
  if(hs==='swept'){A(HA,4,ell(HP(0,.085,-.03),S3(.082,.045,.11)));A(HA,4,rcone(HP(0,.1,.05),HP(.01,.09,-.12),.035*hk,.02*hk))}
  if(hs==='long'||hs==='wavy'||hs==='braid'){A(HA,4,rcone(HP(0,.02,-.06),HP(0,-.3,-.095),.078*hk,.055*hk));for(const sg of[1,-1])A(HA,4,rcone(HP(sg*.074,.04,.03),HP(sg*.078,-.22,.035),.02*hk,.012*hk));if(hs==='wavy')HA.noise=[.012*hk,26/hk,16/hk,26/hk]}
  if(hs==='ponytail'||hs==='braid'){A(HA,4,ell(HP(0,.07,-.115),S3(.03,.03,.03)));A(HA,4,rcone(HP(0,.07,-.125),HP(0,-.2,-.175),.03*hk,.011*hk))}
  if(hs==='bun')A(HA,4,ell(HP(0,.105,-.075),S3(.045,.043,.045)));if(hs==='bob'){A(HA,4,ell(HP(0,-.015,-.022),S3(.094,.1,.102)));for(const q of[-1,0,1])A(HA,4,rcone(HP(q*.04,.1,.06),HP(q*.045,.04,.094),.022*hk,.008*hk))}
  if(Lk.beard!=='none'){BR.k=.014*hk;A(BR,4,ell(HP(0,-.088,.04),S3(.064,.052,.054)));A(BR,4,rcone(HP(-.03,-.055,.094),HP(.03,-.055,.094),.008*hk,.008*hk));A(BR,4,ell(HP(0,-.07,.1),S3(.02,.004,.012)),1,.004*hk);
   if(Lk.beard==='braided'){A(BR,4,rcone(HP(0,-.11,.06),HP(0,-.3,.08),.046*hk,.02*hk));for(const sg of[1,-1])A(BR,4,rcone(HP(sg*.04,-.1,.05),HP(sg*.05,-.26,.07),.022*hk,.01*hk))}}}
 Mo.paint=(x,y,z,c,L)=>{if(L!==SK||husk)return;const hx=x/hk,hy=(y-headC)/hk,hz=z/hk-.012,bx=Math.abs(hx);if(hz<.03||hy<-.13)return;const mulc=(r,g,b2,m)=>{c[0]*=lerp(1,r,m);c[1]*=lerp(1,g,m);c[2]*=lerp(1,b2,m)};
  mulc(.86,.5,.5,sstep(.021,.012,bx)*sstep(.0145,.006,Math.abs(hy+.0715))*sstep(.062,.072,hz)*.85);mulc(.4,.4,.4,sstep(.003,.0008,Math.abs(hy+.0712))*sstep(.019,.013,bx)*(hz>.068?1:0));
  const by=hy-(.035-(bx>.032?(bx-.032)*.3:0)),bm=sstep(.0065,.0028,Math.abs(by))*sstep(.009,.015,bx)*sstep(.057,.049,bx)*sstep(.045,.056,hz)*.92;c[0]=lerp(c[0],hrc[0]*.8,bm);c[1]=lerp(c[1],hrc[1]*.8,bm);c[2]=lerp(c[2],hrc[2]*.8,bm);
  const cm=Math.exp(-((bx-.044)*(bx-.044)+(hy+.03)*(hy+.03))/.0006)*.13;c[1]*=1-cm;c[2]*=1-cm;const e=Math.pow((bx-.031)/.017,2)+Math.pow((hy-.004)/.008,2);if(e<1.7&&hz>.05)mulc(.5,.42,.42,sstep(1.7,.95,e)*.8)};
 /* polygonise body and head */
 const hb=husk?.017:.0138,hh=(husk?.0058:.0042)*hk,arm=shX+(ua+fa+hl)*.45+.12,parts=[];
 Mo.mode=0;let[P,I]=surfNets((x,y,z)=>sdf(Mo,x,y,z),[-arm,-.03,-.24*Math.max(1,K.bulk*.8)],[arm,neckB+.14,.3*Math.max(1,K.bulk*.8)],hb);parts.push(skinMesh(finishMesh(Mo,P,I,hb,.02*h),I));let nv=P.length/3;
 const long=!husk&&(['long','wavy','braid','ponytail'].includes(Lk.hair)||Lk.beard==='braided');
 Mo.mode=1;[P,I]=surfNets((x,y,z)=>sdf(Mo,x,y,z),[-.16*hk,headC-(long?.36:.17)*hk,-.24*hk],[.16*hk,headC+(boss?.26:.2)*hk,.17*hk],hh);parts.push(skinMesh(finishMesh(Mo,P,I,hh,.02),I));nv+=P.length/3;Mo.mode=0;
 Mo.parts=parts;Mo.eyes=[HP(.031,.003,.0575),HP(-.031,.003,.0575)];Mo.eyeR=.0125*hk;Mo.eyeC=hexL(Lk.eyes);Mo.husk=husk;Mo.nv=nv;Mo.ms=Math.round(performance.now()-t0);
 /* bind frames, inverted */
 const fr=(o,y)=>{const Y=norm(y),X=norm(sub([1,0,0],mul(Y,Y[0]))),Z=cross(X,Y);return[o,X,Y,Z]},I3=o=>[o,[1,0,0],[0,1,0],[0,0,1]];
 const BF=[I3(J.hip),I3(J.spine),I3(J.chest),I3(J.neck),I3(J.head)];for(const s of['L','R']){BF.push(fr(J['sh'+s],sub(J['el'+s],J['sh'+s])),fr(J['el'+s],sub(J['wr'+s],J['el'+s])),fr(J['wr'+s],sub(J['wr'+s],J['el'+s])))}
 for(const s of['L','R']){BF.push(fr(J['hj'+s],sub(J['kn'+s],J['hj'+s])),fr(J['kn'+s],sub(J['an'+s],J['kn'+s])),I3(J['an'+s]))}
 Mo.inv=BF.map(([o,X,Y,Z])=>{const m=new Float32Array(16);m[0]=X[0];m[4]=X[1];m[8]=X[2];m[1]=Y[0];m[5]=Y[1];m[9]=Y[2];m[2]=Z[0];m[6]=Z[1];m[10]=Z[2];m[12]=-dot(X,o);m[13]=-dot(Y,o);m[14]=-dot(Z,o);m[15]=1;return m});
 for(const L of Mo.layers){L.bp=L.hp=L.bs=L.hs=null;L.paint=null}Mo.paint=null;return Mo}
