/* ================= renderer ================= */
const QP={perf:{name:'Performance',dpr:1.5,ss:0,dyn:1,shadow:1024,grass:.2,leaf:.6,bloom:5,rays:1,ca:0,grain:.012,cap:0,shr:52},
 bal:{name:'Balanced',dpr:2,ss:0,dyn:1,shadow:2048,grass:.4,leaf:1,bloom:6,rays:1,ca:0,grain:.018,cap:60,shr:60},
 cine:{name:'Cinematic 4K',dpr:3,ss:2,dyn:0,shadow:4096,grass:.75,leaf:1,bloom:6,rays:1,ca:.014,grain:.022,cap:0,shr:64}};
const R={scale:1,rw:0,rh:0,ow:0,oh:0,mode:'bal',Q:QP.bal,P:{},T:{},fps:60,hz:60,frame:0,toggles:{bloom:1,rays:1,shadows:1,grass:1,grain:1,ao:1}};
const C={pos:[0,8,96],tgt:[0,4,60],fov:.95,near:.25,far:9000,vp:new Float32Array(16),ivp:null,right:[1,0,0],up:[0,1,0],fwd:[0,0,-1],shake:0};
const PAL={dusk:{sun:[7.6,4.5,2.2],zen:[.03,.065,.19],hor:[.78,.36,.15],gnd:[.11,.08,.09],aS:[.17,.19,.27],aG:[.1,.075,.06],fog:.0008,exp:.85},
 ecl:{sun:[.3,.22,.5],zen:[.004,.005,.018],hor:[.075,.04,.115],gnd:[.012,.01,.02],aS:[.04,.04,.08],aG:[.013,.011,.018],fog:.0016,exp:1.75},
 dawn:{sun:[8.6,6.6,4.4],zen:[.05,.12,.3],hor:[.9,.58,.32],gnd:[.14,.11,.11],aS:[.26,.3,.4],aG:[.12,.09,.07],fog:.0009,exp:.8}};
const E={t:0,ecl:0,eclT:0,dawn:0,dawnT:0,k:0,sun:norm([-.48,.19,-.86]),moon:[0,1,0],sunCol:[1,1,1],zen:[0,0,0],hor:[0,0,0],gnd:[0,0,0],aS:[0,0,0],aG:[0,0,0],sunVis:1,fog:.001,exp:1,wind:1,flash:0,tint:[1,1,1],sat:1.04,
 lp:new Float32Array(24),lc:new Float32Array(32),lvp:new Float32Array(16),dyn:[]};
function updateEnv(dt){const rt=E.rate||1;E.gust=Math.max(0,(E.gust||0)-dt*1.6);E.t+=dt;E.ecl+=clamp(E.eclT-E.ecl,-dt/11*rt,dt/11*rt);E.dawn+=clamp(E.dawnT-E.dawn,-dt/6*rt,dt/6*rt);E.flash=Math.max(0,E.flash-dt*1.6);
 const s=E.sun,mx=norm(cross(s,[0,1,0])),my=cross(mx,s),off=norm(add(mul(mx,.55),mul(my,.83))),sep0=.36,q=(1-E.ecl)*sep0;E.moon=norm(add(s,mul(off,Math.tan(q))));
 const sep=Math.abs(q),rs=.0245,rm=.0338;const vis=clamp((sep-(rm-rs))/(2*rs),.012,1);E.sunVis=vis;const k=E.k=clamp((1-vis)*.82+sstep(.15,.9,1-Math.abs(1-E.ecl))*.18,0,1);
 const L=(a)=>{const d=lerp3(PAL.dusk[a],PAL.dawn[a],E.dawn);return lerp3(d,PAL.ecl[a],k)};E.sunCol=L('sun');E.zen=L('zen');E.hor=L('hor');E.gnd=L('gnd');E.aS=L('aS');E.aG=L('aG');
 E.fog=lerp(lerp(PAL.dusk.fog,PAL.dawn.fog,E.dawn),PAL.ecl.fog,k);E.exp=lerp(lerp(PAL.dusk.exp,PAL.dawn.exp,E.dawn),PAL.ecl.exp,k);E.wind=1+k*.8+E.gust}
function makePrograms(){const h=EXT.hdr,P=R.P;P.uber=program(VS_UBER,FS_UBER(h));P.depth=program(VS_DEPTH,FS_DEPTH);P.skin=program(VS_SKIN,FS_UBER(h));P.skind=program(VS_SKIND,FS_DEPTH);P.grass=program(VS_GRASS,FS_GRASS(h));P.leaf=program(VS_LEAF,FS_LEAF(h));P.leafd=program(VS_LEAFD,FS_LEAFD);
 P.water=program(VS_WATER,FS_WATER(h));P.sky=program(VS_FST,FS_SKY(h));P.spr=program(VS_SPR,FS_SPR(h));P.beam=program(VS_BEAM,FS_BEAM(h));P.down=program(VS_FST,FS_DOWN);P.up=program(VS_FST,FS_UP);P.rays=program(VS_FST,FS_RAYS);
 P.comp=program(VS_FST,FS_COMP(h));P.fin=program(VS_FST,FS_FINAL);R.emptyVAO=gl.createVertexArray()}
function allocTargets(){const T=R.T,h=EXT.hdr,w=R.rw,ht=R.rh;freeFbo(T.scene);freeFbo(T.ldr);freeFbo(T.rays);(T.bloom||[]).forEach(freeFbo);
 T.scene=fbo(w,ht,h,true);if(!T.scene.ok&&h){EXT.hdr=false;freeFbo(T.scene);makePrograms();T.scene=fbo(w,ht,false,true)}
 T.ldr=fbo(w,ht,false,false);T.rays=fbo(Math.max(8,w>>2),Math.max(8,ht>>2),EXT.hdr,false);T.bloom=[];if(EXT.hdr)for(let i=0;i<R.Q.bloom;i++){const bw=w>>(i+1),bh=ht>>(i+1);if(bw<4||bh<4)break;T.bloom.push(fbo(bw,bh,true,false))}}
function setMode(m){R.mode=m;R.Q=QP[m];R.scale=1;if(R.T.shadow){gl.deleteFramebuffer(R.T.shadow.fb);gl.deleteTexture(R.T.shadow.depth)}R.T.shadow=shadowFbo(Math.min(R.Q.shadow,EXT.maxTex));R.rw=0;setupRes()}
function setupRes(){const dpr=window.devicePixelRatio||1,Q=R.Q,cw=cv.clientWidth||innerWidth,ch=cv.clientHeight||innerHeight;let ow=Math.round(cw*Math.min(dpr,Q.dpr)),oh=Math.round(ch*Math.min(dpr,Q.dpr));
 const k=Math.min(1,3840/Math.max(ow,oh));ow=Math.max(16,Math.round(ow*k));oh=Math.max(16,Math.round(oh*k));let s=R.scale;if(Q.ss)s=clamp(3840/Math.max(ow,oh),1,Q.ss);
 const mx=Math.min(EXT.maxTex,4096);let rw=Math.round(ow*s),rh=Math.round(oh*s);const k2=Math.min(1,mx/Math.max(rw,rh));rw=Math.max(16,Math.round(rw*k2)&~1);rh=Math.max(16,Math.round(rh*k2)&~1);
 if(cv.width!==ow||cv.height!==oh){cv.width=ow;cv.height=oh}R.ow=ow;R.oh=oh;if(rw!==R.rw||rh!==R.rh){R.rw=rw;R.rh=rh;allocTargets()}}
/* fx buffers */
function spr(x,y,z,size,r,g,b,a,flag){const o=G.spr;if(o.count>=o.cap)return;const d=o.data,i=o.count++*10;d[i]=x;d[i+1]=y;d[i+2]=z;d[i+3]=size;d[i+4]=r;d[i+5]=g;d[i+6]=b;d[i+7]=a==null?1:a;d[i+8]=flag||0;d[i+9]=0}
function beam(a,b,w,c,k){const o=G.beam;if(o.count>=o.cap)return;const d=o.data,i=o.count++*11;d[i]=a[0];d[i+1]=a[1];d[i+2]=a[2];d[i+3]=w;d[i+4]=b[0];d[i+5]=b[1];d[i+6]=b[2];d[i+7]=k==null?1:k;d[i+8]=c[0];d[i+9]=c[1];d[i+10]=c[2]}
function dynLight(p,c,r){E.dyn.push({p,c,r})}
function setCam(){const up=[0,1,0];let pos=C.pos;if(C.shake>0){pos=[pos[0]+(Math.random()-.5)*C.shake,pos[1]+(Math.random()-.5)*C.shake,pos[2]+(Math.random()-.5)*C.shake]}
 const V=m4look(pos,C.tgt,up),Pm=m4persp(C.fov,R.rw/R.rh,C.near,C.far);m4mul(Pm,V,C.vp);C.ivp=m4inv(C.vp);C.fwd=norm(sub(C.tgt,pos));C.right=norm(cross(C.fwd,up));C.up=cross(C.right,C.fwd);C.rp=pos}
function pickLights(focus){const all=[];for(const l of W.lights)if(l.r>0){const fl=.82+.18*Math.sin(E.t*7+l.fl*3.7)*Math.sin(E.t*2.3+l.fl);all.push({p:l.p,c:mul(l.c,fl),r:l.r,d:Math.hypot(l.p[0]-focus[0],l.p[2]-focus[2])-l.r*.6})}
 for(const l of E.dyn)all.push({p:l.p,c:l.c,r:l.r,d:Math.hypot(l.p[0]-focus[0],l.p[2]-focus[2])-l.r*1.5});all.sort((a,b)=>a.d-b.d);
 for(let i=0;i<8;i++){const l=all[i];if(l){E.lp.set(l.p,i*3);E.lc[i*4]=l.c[0];E.lc[i*4+1]=l.c[1];E.lc[i*4+2]=l.c[2];E.lc[i*4+3]=l.r}else E.lc[i*4+3]=0}E.dyn.length=0}
function shadowMatrix(c){const s=E.sun,r=R.Q.shr,size=R.T.shadow.w,rt=norm(cross([0,1,0],s)),up=cross(s,rt),tx=2*r/size;const a=dot(c,rt),b=dot(c,up);const cc=add(c,add(mul(rt,Math.round(a/tx)*tx-a),mul(up,Math.round(b/tx)*tx-b)));
 const V=m4look(add(cc,mul(s,170)),cc,[0,1,0]);m4mul(m4ortho(-r,r,-r,r,1,360),V,E.lvp)}
function common(P,vp,focus){const u=P.u;gl.uniformMatrix4fv(u('uVP'),false,vp||C.vp);gl.uniform3fv(u('uCam'),C.rp);gl.uniform3fv(u('uSun'),E.sun);gl.uniform3fv(u('uSunCol'),E.sunCol);gl.uniform3fv(u('uZen'),E.zen);gl.uniform3fv(u('uHor'),E.hor);gl.uniform3fv(u('uGnd'),E.gnd);
 gl.uniform3fv(u('uMoon'),E.moon);gl.uniform3fv(u('uAmbS'),E.aS);gl.uniform3fv(u('uAmbG'),E.aG);gl.uniform1f(u('uEcl'),E.k);gl.uniform1f(u('uTime'),E.t);gl.uniform1f(u('uSunVis'),E.sunVis);gl.uniform1f(u('uFogD'),E.fog);
 gl.uniformMatrix4fv(u('uLVP'),false,E.lvp);gl.uniform1f(u('uShOn'),R.toggles.shadows?1:0);gl.uniform3fv(u('uPL'),E.lp);gl.uniform4fv(u('uPLc'),E.lc);gl.uniform1i(u('uShadow'),5);gl.uniform1f(u('uWind'),E.wind);gl.uniform3fv(u('uPl'),focus||[0,-999,0]);
 gl.uniform3fv(u('uCR'),C.right);gl.uniform3fv(u('uCU'),C.up)}
function allMeshes(f){for(const k in M){if(k==='water')continue;const a=M[k];if(Array.isArray(a))a.forEach(f);else f(a)}}
function post(src,dst,P,w,h){gl.bindFramebuffer(gl.FRAMEBUFFER,dst?dst.fb:null);gl.viewport(0,0,w,h);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,src);gl.uniform1i(P.u('uT'),0);gl.drawArrays(gl.TRIANGLES,0,3)}
function drawSkinned(P,list){const u=P.u;for(const c of list){gl.uniformMatrix4fv(u('uM'),false,c.mm);gl.uniformMatrix4fv(u('uB'),false,c.bones);gl.uniform1f(u('uX'),c.husk?c.dis:c.id==='nerissa'?1:0);gl.uniform1f(u('uEm'),c.husk===2?1.6:c.husk?1:0);
  for(const m of c.model.parts){gl.bindVertexArray(m.vao);gl.drawElements(gl.TRIANGLES,m.n,gl.UNSIGNED_INT,0)}}}
function renderFrame(focus,cloaks,skinned){skinned=skinned||[];const P=R.P,T=R.T,Q=R.Q;setCam();pickLights(focus);shadowMatrix(focus);
 allMeshes(upload);(cloaks||[]).forEach(upload);upload(M.water);qUpload(G.spr);qUpload(G.beam);
 gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.depthMask(true);
 /* shadow pass */
 gl.bindFramebuffer(gl.FRAMEBUFFER,T.shadow.fb);gl.viewport(0,0,T.shadow.w,T.shadow.h);gl.clear(gl.DEPTH_BUFFER_BIT);
 if(R.toggles.shadows){gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1.6,3);gl.useProgram(P.depth.p);gl.uniformMatrix4fv(P.depth.u('uVP'),false,E.lvp);allMeshes(m=>{if(m!==M.mount&&m!==M.under)drawM(m)});(cloaks||[]).forEach(drawM);gl.useProgram(P.skind.p);gl.uniformMatrix4fv(P.skind.u('uVP'),false,E.lvp);drawSkinned(P.skind,skinned);
  gl.useProgram(P.leafd.p);gl.uniformMatrix4fv(P.leafd.u('uVP'),false,E.lvp);qDraw(G.leaf,G.leaf.count*Q.leaf|0);gl.disable(gl.POLYGON_OFFSET_FILL)}
 /* scene */
 gl.bindFramebuffer(gl.FRAMEBUFFER,T.scene.fb);gl.viewport(0,0,R.rw,R.rh);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.activeTexture(gl.TEXTURE5);gl.bindTexture(gl.TEXTURE_2D,T.shadow.depth);gl.activeTexture(gl.TEXTURE0);
 gl.useProgram(P.uber.p);common(P.uber,null,focus);allMeshes(drawM);(cloaks||[]).forEach(drawM);gl.useProgram(P.skin.p);common(P.skin,null,focus);drawSkinned(P.skin,skinned);
 gl.useProgram(P.leaf.p);common(P.leaf,null,focus);qDraw(G.leaf,G.leaf.count*Q.leaf|0);
 if(R.toggles.grass){gl.useProgram(P.grass.p);common(P.grass,null,focus);qDraw(G.grass,G.grass.count*Q.grass|0)}
 gl.useProgram(P.water.p);common(P.water,null,focus);drawM(M.water);
 gl.depthFunc(gl.LEQUAL);gl.depthMask(false);gl.useProgram(P.sky.p);common(P.sky);gl.uniformMatrix4fv(P.sky.u('uIVP'),false,C.ivp);gl.bindVertexArray(R.emptyVAO);gl.drawArrays(gl.TRIANGLES,0,3);
 gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(P.beam.p);common(P.beam);qDraw(G.beam);gl.useProgram(P.spr.p);common(P.spr);qDraw(G.spr);
 gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);gl.depthMask(true);gl.bindVertexArray(R.emptyVAO);
 /* god rays */
 let raysOn=0;const sp=tfm(C.vp,add(C.rp,mul(E.sun,1000)));if(EXT.hdr&&R.toggles.rays&&Q.rays&&sp[3]>0){const su=[sp[0]*.5+.5,sp[1]*.5+.5],off=Math.max(Math.abs(sp[0]),Math.abs(sp[1]));raysOn=sstep(1.9,1,off)*(.25+.75*E.sunVis);
  if(raysOn>.01){gl.useProgram(P.rays.p);gl.uniform2f(P.rays.u('uSunUV'),su[0],su[1]);gl.uniform1f(P.rays.u('uGR'),.15);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,T.scene.depth);gl.uniform1i(P.rays.u('uD'),1);post(T.scene.tex,T.rays,P.rays,T.rays.w,T.rays.h)}}
 /* bloom */
 const B=T.bloom,bloomOn=EXT.hdr&&R.toggles.bloom&&B.length>1;
 if(bloomOn){gl.useProgram(P.down.p);let src=T.scene;for(let i=0;i<B.length;i++){gl.uniform2f(P.down.u('uPx'),1/src.w,1/src.h);gl.uniform1f(P.down.u('uFirst'),i===0?1:0);post(src.tex,B[i],P.down,B[i].w,B[i].h);src=B[i]}
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.useProgram(P.up.p);for(let i=B.length-1;i>0;i--){gl.uniform2f(P.up.u('uPx'),1/B[i].w,1/B[i].h);post(B[i].tex,B[i-1],P.up,B[i-1].w,B[i-1].h)}gl.disable(gl.BLEND)}
 /* tone map and grade */
 gl.useProgram(P.comp.p);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,bloomOn?B[0].tex:T.scene.tex);gl.uniform1i(P.comp.u('uB'),1);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,T.rays.tex);gl.uniform1i(P.comp.u('uR'),2);
 gl.uniform1f(P.comp.u('uExp'),E.exp*(E.expMul||1));gl.uniform1f(P.comp.u('uBloom'),bloomOn?.55/B.length:0);gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,T.scene.depth);gl.uniform1i(P.comp.u('uD'),3);gl.uniform2f(P.comp.u('uNF'),C.near,C.far);gl.uniform1f(P.comp.u('uAO'),R.toggles.ao?1:0);gl.uniform1f(P.comp.u('uRaysOn'),raysOn);gl.uniform1f(P.comp.u('uFlash'),E.flash);gl.uniform3fv(P.comp.u('uTint'),E.tint);gl.uniform1f(P.comp.u('uSat'),E.sat);
 post(T.scene.tex,T.ldr,P.comp,R.rw,R.rh);
 gl.useProgram(P.fin.p);const f=P.fin.u;gl.uniform2f(f('uPx'),1/R.rw,1/R.rh);gl.uniform1f(f('uGrain'),R.toggles.grain?Q.grain:0);gl.uniform1f(f('uCA'),Q.ca);gl.uniform1f(f('uTime'),E.t);gl.uniform1f(f('uFxaa'),1);
 gl.uniform1f(f('uSharp'),R.rw<R.ow?.35:.12);gl.uniform1f(f('uVig'),.3);post(T.ldr.tex,null,P.fin,R.ow,R.oh);R.frame++}
