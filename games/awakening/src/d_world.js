/* ================= world ================= */
const M={},W={coll:[],plats:[],lights:[],sites:[],crystals:[],spawn:[0,0,70],pierY:0,stones:[]};
const ELC={fire:'#ff8a5c',water:'#5cb8ff',earth:'#d4a86b',wind:'#8fe3b0',lightning:'#86d6ff',light:'#ffe7a0',gravity:'#a48bff'};
const X1=[1,0,0],Y1=[0,1,0],Z1=[0,0,1],STONE=[.4,.36,.31],DARKST=[.2,.19,.2];
function put(m,p,sx,sy,sz,col,rough,metal,emis,mat,ex,yaw){yaw=yaw||0;const c=Math.cos(yaw),s=Math.sin(yaw);inst(m,p,[c*sx,0,-s*sx],[0,sy,0],[s*sz,0,c*sz],col,rough,metal,emis,mat,ex)}
/* cylinder between two points (unit cylinder is y 0..1, radius 1) */
function seg(m,a,b,r,col,rough,metal,emis,mat,ex){const d=sub(b,a),L=vlen(d)||1e-4,y=[d[0]/L,d[1]/L,d[2]/L];let x=Math.abs(y[1])<.95?norm(cross([0,1,0],y)):norm(cross([1,0,0],y));const z=cross(x,y);
 inst(m,a,mul(x,r),d,mul(z,r),col,rough,metal,emis,mat,ex)}
const G={grass:null,leaf:null,spr:null,beam:null};
function quadVAO(isz,layout,cap,blade){const o={cap,count:0,isz,data:new Float32Array(cap*isz),vao:gl.createVertexArray()};gl.bindVertexArray(o.vao);
 let v,ix;if(blade){v=[];ix=[];for(let b=0;b<5;b++){const s=v.length/3;for(const t of[0,.34,.67]){v.push(-1,t,b,1,t,b)}v.push(0,1,b);ix.push(s,s+1,s+2,s+1,s+3,s+2,s+2,s+3,s+4,s+3,s+5,s+4,s+4,s+5,s+6)}}
 else{v=[-1,-1,1,-1,1,1,-1,1];ix=[0,1,2,0,2,3]}
 const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,blade?3:2,gl.FLOAT,false,0,0);
 const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(ix),gl.STATIC_DRAW);o.n=ix.length;
 o.buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,o.buf);gl.bufferData(gl.ARRAY_BUFFER,o.data.byteLength,gl.DYNAMIC_DRAW);let off=0;
 layout.forEach((n,i)=>{gl.enableVertexAttribArray(1+i);gl.vertexAttribPointer(1+i,n,gl.FLOAT,false,isz*4,off*4);gl.vertexAttribDivisor(1+i,1);off+=n});gl.bindVertexArray(null);return o}
function qUpload(o,n){gl.bindBuffer(gl.ARRAY_BUFFER,o.buf);gl.bufferSubData(gl.ARRAY_BUFFER,0,o.data,0,(n==null?o.count:n)*o.isz)}
function qDraw(o,n){n=n==null?o.count:Math.min(n,o.count);if(!n)return;gl.bindVertexArray(o.vao);gl.drawElementsInstanced(gl.TRIANGLES,o.n,gl.UNSIGNED_SHORT,0,n)}
function addLeaf(x,y,z,s,nx,ny,nz,ph,c,e){const o=G.leaf;if(o.count>=o.cap)return;const a=o.data,i=o.count++*12;a[i]=x;a[i+1]=y;a[i+2]=z;a[i+3]=s;a[i+4]=nx;a[i+5]=ny;a[i+6]=nz;a[i+7]=ph;a[i+8]=c[0];a[i+9]=c[1];a[i+10]=c[2];a[i+11]=e}
function tree(x,z,H,r,kind,big){const y=hAt(x,z)-.2;const bark=kind==='silver'?[.34,.34,.37]:kind==='gold'?[.16,.11,.06]:[.085,.06,.04];
 put(M.trunk,[x,y,z],r,H,r,bark,.9,0,0,8,rnd()*9,rnd()*6);W.coll.push({x,z,r:r*.75});
 const nC=big?10:3+(rnd()*2|0),top=[x,y+H*.94,z];
 for(let c=0;c<nC;c++){const a=c/nC*6.283+rnd(),sp=big?rr(4,9.5):rr(.8,2.1),cr=big?rr(3.6,5.6):rr(1.5,2.3),cc=[x+Math.cos(a)*sp,y+H+(big?rr(1,6.5):rr(.2,1.8)),z+Math.sin(a)*sp];
  seg(M.cyl,[x,y+H*(big?.7:.62),z],cc,big?.42:.09,bark,.9,0,0,8,rnd()*9);
  const nL=big?900:250;for(let i=0;i<nL;i++){let d;do{d=[rr(-1,1),rr(-1,1),rr(-1,1)]}while(dot(d,d)>1);const l=Math.pow(dot(d,d),.2);d=norm(d);const p=[cc[0]+d[0]*cr*l,cc[1]+d[1]*cr*l*.72,cc[2]+d[2]*cr*l];
   const n=norm([d[0],d[1]+.35,d[2]]);const t=rnd();const col=kind==='silver'?lerp3([.3,.38,.4],[.55,.62,.62],t):kind==='gold'?lerp3([.5,.27,.03],[.85,.6,.12],t):(rnd()<.12?lerp3([.3,.12,.02],[.42,.2,.03],t):lerp3([.035,.085,.014],[.12,.17,.028],t));
   addLeaf(p[0],p[1],p[2],(big?rr(.36,.6):rr(.21,.36)),n[0],n[1],n[2],rnd()*10,col,kind==='gold'?rr(.05,.3):0)}}
 return y}
function buildWorld(){srand(20261);buildHC();
 const mk=(g,cap)=>mesh(g[0],g[1],cap);
 M.terrain=mk(terrainGeo(false),1);M.under=mk(terrainGeo(true),1);M.mount=mk(mountainGeo(),1);M.water=mk(discGeo(5800,48,14),1);
 M.sph=mk(sphereGeo(24,16),2600);M.cyl=mk(latheGeo([[0,0],[1,0],[1,1],[0,1]],18),1500);M.tap=mk(latheGeo([[0,0],[1,0],[.72,1],[0,1]],16),900);M.cone=mk(latheGeo([[0,0],[1,0],[0,1]],16),400);M.box=mk(boxGeo(),900);M.tor=mk(torusGeo(1,.1,32,8),120);M.ring=mk(torusGeo(1,.03,56,6),160);
 M.skirt=mk(latheGeo([[1,0],[.92,.22],[.74,.58],[.6,.84],[.56,1]],20),60);M.crys=mk(latheGeo([[0,-1],[.42,-.12],[.36,.25],[0,1.1]],6,true),80);
 M.obel=mk(latheGeo([[0,0],[1,0],[.94,.07],[.62,.9],[.72,.93],[.72,1],[0,1]],4,true),40);M.rock=[0,1,2].map(i=>mk(rockGeo(i*7.3+1.5),120));M.stone=mk(rockGeo(31,true),60);
 M.tower=mk(latheGeo([[0,0],[7.4,0],[7.4,1.2],[6.4,1.6],[5.6,9],[6.3,9.4],[6.3,10.2],[5.2,10.6],[4.5,40],[5.9,41],[5.9,42.4],[4.6,42.8],[4.2,56],[5.2,57],[5.2,58],[0,58]],28),8);
 M.roof=mk(latheGeo([[0,58],[5.6,58],[5,59],[3.2,66],[1.4,74],[.25,82],[0,84]],28),8);M.trunk=mk(latheGeo([[0,0],[1.7,0],[1.15,.06],[.8,.2],[.62,.5],[.5,.8],[.42,1],[0,1]],12),60);
 const I=(m,mat,col,rough)=>inst(m,[0,0,0],X1,Y1,Z1,col||[1,1,1],rough||.9,0,0,mat);I(M.terrain,1);I(M.under,1);I(M.mount,10);I(M.water,0);
 G.leaf=quadVAO(12,[4,4,4],46000);G.grass=quadVAO(8,[4,4],210000,true);G.spr=quadVAO(10,[4,4,2],6000);G.beam=quadVAO(11,[4,4,3],900);
 /* plaza: seven element obelisks and the Resonance Crystal */
 const els=Object.keys(ELC);els.forEach((e,i)=>{const a=i/7*6.283-1.571,x=Math.cos(a)*11,z=Math.sin(a)*11;put(M.obel,[x,1.9,z],.75,3.3,.75,STONE,.7,0,0,2,i,a);W.coll.push({x,z,r:.85});
  const c=hexL(ELC[e]);W.crystals.push({p:[x,6.3,z],c,ph:i*1.3,s:.42});W.lights.push({p:[x,5.6,z],c:mul(c,7),r:15,fl:i})});
 W.crystals.push({p:[0,8.4,0],c:[.75,.65,1],ph:0,s:1.7,main:1});W.lights.push({p:[0,7,0],c:[2.6,2.2,4],r:22,fl:9});put(M.obel,[0,1.9,0],2,1.1,2,STONE,.6,0,0,2,3,.78);W.coll.push({x:0,z:0,r:2.1});
 /* Arcanum spire and lesser towers */
 const towers=[[-46,-22,1],[-64,-9,.55],[-35,-43,.5],[-60,-38,.42]];towers.forEach(([x,z,s],ti)=>{const y=hAt(x,z)-1.5*s;put(M.tower,[x,y,z],s,s,s,[.5,.46,.4],.75,0,0,14,ti);put(M.roof,[x,y,z],s,s,s,[.05,.06,.13],.45,.2,0,0);
  W.coll.push({x,z,r:7.6*s});put(M.sph,[x,y+84.5*s,z],.7*s,.7*s,.7*s,[1,.72,.25],.3,1,0,0);W.lights.push({p:[x,y+50*s,z],c:[9,5.5,2.2],r:0,glow:8*s});
  for(const[h,r]of[[14,5.12],[22,4.93],[30,4.74],[36,4.6],[48,4.45],[53,4.3]])for(let k=0;k<8;k++){if(hash2(k*7+ti,h)<.22)continue;const a=k/8*6.283+h*.21;
   put(M.box,[x+Math.cos(a)*r*s,y+h*s,z+Math.sin(a)*r*s],.75*s,1.7*s,.3*s,[1,.6,.22],1,0,3+2*hash2(k,h+ti),5,0,1.571-a)}});
 put(M.box,[-55,hAt(-55,-15)+2.5,-15.5],20,6,1.6,[.46,.42,.37],.8,0,0,2,5,.62);put(M.box,[-40.5,hAt(-40,-32)+2.5,-32.5],22,6,1.6,[.46,.42,.37],.8,0,0,2,6,-1.09);
 /* pier, lanterns, airship */
 const py=W.pierY=hAt(0,57)+.25;put(M.box,[0,py-.3,68.5],6.4,.6,25,[.34,.22,.13],.85,0,0,11,2);W.plats.push({rect:1,x0:-3.2,x1:3.2,z0:56,z1:81,y:py});
 for(const z of[60,67,74,80.6])for(const sx of[-3,3]){seg(M.cyl,[sx,py-7,z],[sx,py+1.1,z],.16,[.16,.1,.06],.9,0,0,8,z)}
 const lan=(x,z,y)=>{y=y==null?hAt(x,z):y;seg(M.cyl,[x,y-.2,z],[x,y+2.7,z],.06,[.03,.03,.035],.5,.8,0,0);put(M.box,[x,y+2.93,z],.2,.3,.2,[1,.6,.22],1,0,3.2,5);put(M.cone,[x,y+3.08,z],.24,.2,.24,[.03,.03,.035],.5,.8,0,0);put(M.box,[x,y+2.76,z],.24,.04,.24,[.03,.03,.035],.5,.8,0,0);
  W.lights.push({p:[x,y+2.9,z],c:[8,4.6,1.8],r:13,fl:x+z});W.coll.push({x,z,r:.18})};
 lan(-3,80.6,py);lan(3,80.6,py);lan(-3.4,54);lan(3.6,42);lan(-2.6,31);lan(3,21);lan(-8,-24);lan(-15.5,-38);lan(23,-3.5);lan(40,-11.5);lan(-26,5);lan(-50,13);
 const ay=py+1.2,ax=11.5,az=74;put(M.sph,[ax,ay,az],2.1,1.5,7.2,[.2,.12,.06],.8,0,0,8,4);put(M.box,[ax,ay+.75,az],3.3,.3,11,[.26,.17,.09],.85,0,0,8,7);put(M.sph,[ax,ay+8.2,az],3.7,3.3,9.4,[.62,.55,.4],.9,0,0,4);
 for(const[dx,dz]of[[-1.5,-4],[1.5,-4],[-1.5,4],[1.5,4]])seg(M.cyl,[ax+dx,ay+.8,az+dz],[ax+dx*1.4,ay+6.2,az+dz*1.2],.035,[.3,.24,.15],.9,0,0,0);
 for(const dz of[-3.6,3.6])inst(M.tor,[ax,ay+8.2,az+dz],[3.46,0,0],[0,0,2.6],[0,3.09,0],[.9,.62,.2],.35,1,0,0);put(M.box,[ax,ay+1.5,az+5.2],.3,.4,.3,[1,.62,.25],1,0,6,5);W.lights.push({p:[ax,ay+1.5,az+5.2],c:[7,4,1.6],r:11,fl:3});
 {const A=[3.1,py+.03,74],B=[9.9,ay+.86,74.5],d=sub(B,A),L=vlen(d),xd=mul(d,1/L),zd=norm(cross(xd,[0,1,0])),yd=cross(zd,xd);inst(M.box,[(A[0]+B[0])/2,(A[1]+B[1])/2,(A[2]+B[2])/2],mul(xd,L),mul(yd,.09),mul(zd,1),[.24,.16,.09],.85,0,0,8,5)}
 /* ruins on the east knoll, spiral of floating stones */
 const rx=54,rz=-10,ry=hAt(rx,rz);[5.5,2.2,6.4,3.1,1.4,6,4.2].forEach((h,i)=>{const a=i/7*6.283+.4,x=rx+Math.cos(a)*8.6,z=rz+Math.sin(a)*8.6,y=hAt(x,z)-.4;seg(M.cyl,[x,y,z],[x+rr(-.15,.15),y+h,z+rr(-.15,.15)],.62,STONE,.8,0,0,2,i);
  if(h>5)put(M.box,[x,y+h+.22,z],1.7,.45,1.7,STONE,.8,0,0,2,i+3,a);W.coll.push({x,z,r:.7})});
 seg(M.cyl,[rx-3,ry+.35,rz+6],[rx+3.4,ry+.5,rz+8.6],.6,STONE,.8,0,0,2,9);
 for(let i=0;i<9;i++){const a=i*.9+2.2,x=rx+Math.cos(a)*6.4,z=rz+Math.sin(a)*6.4,y=ry+1+i*.92;put(M.stone,[x,y,z],1.75,1.5,1.75,[.36,.34,.33],.8,0,0,2,i,i);W.plats.push({x,y:y+.06,z,r:1.6});W.stones.push([x,y,z,i])}
 const ty=ry+1+8*.92+.75;put(M.stone,[rx,ty,rz],2.9,2.4,2.9,[.4,.37,.34],.8,0,0,2,12,1);W.plats.push({x:rx,y:ty+.08,z:rz,r:2.7});
 /* west: stepping stones to a floating islet */
 const y0=hAt(-63,11)+.9;for(let i=0;i<7;i++){const x=-68.5-5.5*i,z=10.5+Math.sin(i*1.3)*1.7,y=y0+i*.86;put(M.stone,[x,y,z],2.3,2.2,2.3,[.36,.34,.33],.8,0,0,2,i+20,i*2.1);W.plats.push({x,y:y+.07,z,r:2.1});W.stones.push([x,y,z,i+9])}
 const iy=y0+6*.86+.7,ixp=-112.5,izp=9;put(M.stone,[ixp,iy,izp],9.6,9,9.6,[.34,.33,.31],.85,0,0,2,40,.5);W.plats.push({x:ixp,y:iy+.3,z:izp,r:8.6,grass:1});W.islet=[ixp,iy+.3,izp];
 /* trees */
 const gt=[-14,-50];const gy=tree(gt[0],gt[1],12.5,2.3,'gold',true);W.lights.push({p:[gt[0],gy+10,gt[1]],c:[5,3.2,.9],r:24,fl:5});W.gtree=[gt[0],gy,gt[1]];
 const T=[];for(let k=0;k<700&&T.length<24;k++){const a=rnd()*6.283,r=rr(27,72),x=Math.cos(a)*r,z=Math.sin(a)*r;if(r>islandR(a)-13||pathD(x,z)<4.5||Math.hypot(x+46,z+22)<17||Math.hypot(x-rx,z-rz)<14||Math.hypot(x+14,z+50)<19||Math.hypot(x+55,z+25)<26)continue;
  if(nAt(x,z)[1]<.9||T.some(t=>Math.hypot(t[0]-x,t[1]-z)<9))continue;T.push([x,z]);tree(x,z,rr(4.6,7.6),rr(.26,.4),rnd()<.3?'silver':'oak')}
 {const s=tree2islet();}
 /* boulders and drifting rocks */
 for(let k=0;k<64;k++){const a=rnd()*6.283,r=rr(17,78),x=Math.cos(a)*r,z=Math.sin(a)*r;if(r>islandR(a)-4||pathD(x,z)<2.6)continue;const s=Math.pow(rnd(),2.2)*2.3+.35,y=hAt(x,z);put(M.rock[k%3],[x,y+s*.15,z],s*rr(.8,1.3),s*rr(.6,1),s*rr(.8,1.3),[.36,.34,.32],.85,0,0,2,k,rnd()*6);if(s>1)W.coll.push({x,z,r:s*.78})}
 W.drift=[];for(let k=0;k<34;k++){const a=rnd()*6.283,r=rr(98,190);W.drift.push({p:[Math.cos(a)*r,rr(-46,44),Math.sin(a)*r],s:rr(1.2,6.5),m:k%3,ph:rnd()*6,sp:rr(.15,.4)})}
 /* orb sites: path, great tree, west islet, ruins top, plaza */
 W.sites=[[2.5,hAt(2.5,40)+1.5,40],[-9,hAt(-9,-45)+1.5,-45],[ixp+2,iy+1.9,izp-1],[rx,ty+1.7,rz],[0,3.55,6.5]];
 /* grass */
 const g=G.grass,a=g.data;let n=0;const addB=(x,y,z,d)=>{const i=n++*8;a[i]=x;a[i+1]=y-.04;a[i+2]=z;a[i+3]=rnd()*6.283;a[i+4]=rr(.22,.46)*(.7+.7*d);a[i+5]=rr(.017,.028);a[i+6]=rnd()*6.283;a[i+7]=clamp(fbm(x*.21,z*.21,2)+rr(-.2,.2),0,1)};
 for(let k=0;k<3000;k++){const aa=rnd()*6.283,r=Math.sqrt(rnd())*8.2,x=ixp+Math.cos(aa)*r,z=izp+Math.sin(aa)*r;addB(x,iy+.3,z,.6)}
 for(let k=0;k<g.cap*7&&n<g.cap;k++){const aa=rnd()*6.283,r=Math.sqrt(rnd())*94,x=Math.cos(aa)*r,z=Math.sin(aa)*r,R=islandR(aa);if(r>R-2.5||r<15.8||pathD(x,z)<1.75)continue;const y=hAt(x,z);if(y<-999||nAt(x,z)[1]<.87)continue;
  const d=fbm(x*.07+9,z*.07+4,3);if(rnd()>sstep(.28,.58,d)*.86+.14||rnd()>sstep(.06,.4,(R-r)/16))continue;if(rnd()>(pathD(x,z)<24||r<34?1:.5))continue;addB(x,y,z,d)}
 g.count=n;qUpload(g);qUpload(G.leaf);
 for(const k in M){const ms=Array.isArray(M[k])?M[k]:[M[k]];for(const m of ms){m.base=m.count;upload(m)}}
 W.spawn=[0,py,72]}
function tree2islet(){const[x,y,z]=W.islet;const bark=[.34,.34,.37],H=5.2,tx=x-3,tz=z+2;put(M.trunk,[tx,y-.2,tz],.33,H,.33,bark,.9,0,0,8,2,1);W.coll.push({x:tx,z:tz,r:.3});
 for(let c=0;c<4;c++){const a=c*1.6,cc=[tx+Math.cos(a)*1.6,y+H+rr(.3,1.5),tz+Math.sin(a)*1.6];seg(M.cyl,[tx,y+H*.62,tz],cc,.09,bark,.9,0,0,8,c);
  for(let i=0;i<150;i++){let d;do{d=[rr(-1,1),rr(-1,1),rr(-1,1)]}while(dot(d,d)>1);const l=Math.pow(dot(d,d),.2);d=norm(d);addLeaf(cc[0]+d[0]*2*l,cc[1]+d[1]*1.5*l,cc[2]+d[2]*2*l,rr(.3,.5),d[0],d[1]+.35,d[2],rnd()*10,lerp3([.3,.38,.4],[.55,.62,.62],rnd()),0)}}}
/* ground query: returns surface height under (x,z) at or below y+step */
function groundAt(x,y,z){let g=hAt(x,z);if(g<-999)g=-1e4;else if(g>y+.6)g=g; // terrain always blocks from below
 for(const p of W.plats){if(p.rect){if(x>p.x0&&x<p.x1&&z>p.z0&&z<p.z1&&p.y<=y+.55&&p.y>g)g=p.y}else{const dx=x-p.x,dz=z-p.z;if(dx*dx+dz*dz<p.r*p.r&&p.y<=y+.55&&p.y>g)g=p.y}}return g}
function collide(p,rad){for(const c of W.coll){const dx=p[0]-c.x,dz=p[2]-c.z,rr2=c.r+rad,d2=dx*dx+dz*dz;if(d2<rr2*rr2&&d2>1e-6){const d=Math.sqrt(d2);p[0]=c.x+dx/d*rr2;p[2]=c.z+dz/d*rr2}}}
