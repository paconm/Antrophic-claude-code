/* ================= math, noise, GL helpers ================= */
const $=id=>document.getElementById(id);
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(x,a,b)=>x<a?a:x>b?b:x,sstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const vlen=a=>Math.hypot(a[0],a[1],a[2]),norm=a=>{const l=vlen(a)||1;return[a[0]/l,a[1]/l,a[2]/l]};
const lerp3=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
const hex3=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)/255,(n>>8&255)/255,(n&255)/255]};
const lin=c=>[Math.pow(c[0],2.2),Math.pow(c[1],2.2),Math.pow(c[2],2.2)];
const hexL=h=>lin(hex3(h));
let _seed=12345;function srand(s){_seed=s>>>0}function rnd(){_seed=(Math.imul(_seed,1664525)+1013904223)>>>0;return _seed/4294967296}
const rr=(a,b)=>a+(b-a)*rnd();
function hash2(x,y){let n=Math.imul(x|0,374761393)+Math.imul(y|0,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
function hash3(x,y,z){let n=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(z|0,2147483647);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
 const a=hash2(xi,yi),b=hash2(xi+1,yi),c=hash2(xi,yi+1),d=hash2(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function fbm(x,y,o=5){let s=0,a=.5;for(let i=0;i<o;i++){s+=a*vnoise(x,y);x=x*2.03+17.1;y=y*2.03+9.2;a*=.5}return s}
function vnoise3(x,y,z){const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=zf*zf*(3-2*zf);
 const L=(a,b,t)=>a+(b-a)*t;return L(L(L(hash3(xi,yi,zi),hash3(xi+1,yi,zi),u),L(hash3(xi,yi+1,zi),hash3(xi+1,yi+1,zi),u),v),L(L(hash3(xi,yi,zi+1),hash3(xi+1,yi,zi+1),u),L(hash3(xi,yi+1,zi+1),hash3(xi+1,yi+1,zi+1),u),v),w)}
function fbm3(x,y,z,o=4){let s=0,a=.5;for(let i=0;i<o;i++){s+=a*vnoise3(x,y,z);x=x*2.02+11.3;y=y*2.02+5.7;z=z*2.02+3.1;a*=.5}return s}
/* mat4, column-major */
function m4mul(a,b,o){o=o||new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o}
function m4persp(fov,asp,n,f){const t=1/Math.tan(fov/2),o=new Float32Array(16);o[0]=t/asp;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f);return o}
function m4ortho(l,r,b,t,n,f){const o=new Float32Array(16);o[0]=2/(r-l);o[5]=2/(t-b);o[10]=-2/(f-n);o[12]=-(r+l)/(r-l);o[13]=-(t+b)/(t-b);o[14]=-(f+n)/(f-n);o[15]=1;return o}
function m4look(e,t,up){const z=norm(sub(e,t)),x=norm(cross(up,z)),y=cross(z,x),o=new Float32Array(16);
 o[0]=x[0];o[4]=x[1];o[8]=x[2];o[1]=y[0];o[5]=y[1];o[9]=y[2];o[2]=z[0];o[6]=z[1];o[10]=z[2];o[12]=-dot(x,e);o[13]=-dot(y,e);o[14]=-dot(z,e);o[15]=1;return o}
function m4inv(m){const o=new Float32Array(16),a=m;const b00=a[0]*a[5]-a[1]*a[4],b01=a[0]*a[6]-a[2]*a[4],b02=a[0]*a[7]-a[3]*a[4],b03=a[1]*a[6]-a[2]*a[5],b04=a[1]*a[7]-a[3]*a[5],b05=a[2]*a[7]-a[3]*a[6],
 b06=a[8]*a[13]-a[9]*a[12],b07=a[8]*a[14]-a[10]*a[12],b08=a[8]*a[15]-a[11]*a[12],b09=a[9]*a[14]-a[10]*a[13],b10=a[9]*a[15]-a[11]*a[13],b11=a[10]*a[15]-a[11]*a[14];
 let d=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;d=1/d;
 o[0]=(a[5]*b11-a[6]*b10+a[7]*b09)*d;o[1]=(a[2]*b10-a[1]*b11-a[3]*b09)*d;o[2]=(a[13]*b05-a[14]*b04+a[15]*b03)*d;o[3]=(a[10]*b04-a[9]*b05-a[11]*b03)*d;
 o[4]=(a[6]*b08-a[4]*b11-a[7]*b07)*d;o[5]=(a[0]*b11-a[2]*b08+a[3]*b07)*d;o[6]=(a[14]*b02-a[12]*b05-a[15]*b01)*d;o[7]=(a[8]*b05-a[10]*b02+a[11]*b01)*d;
 o[8]=(a[4]*b10-a[5]*b08+a[7]*b06)*d;o[9]=(a[1]*b08-a[0]*b10-a[3]*b06)*d;o[10]=(a[12]*b04-a[13]*b02+a[15]*b00)*d;o[11]=(a[9]*b02-a[8]*b04-a[11]*b00)*d;
 o[12]=(a[5]*b07-a[4]*b09-a[6]*b06)*d;o[13]=(a[0]*b09-a[1]*b07+a[2]*b06)*d;o[14]=(a[13]*b01-a[12]*b03-a[14]*b00)*d;o[15]=(a[8]*b03-a[9]*b01+a[10]*b00)*d;return o}
const tfm=(m,p)=>{const w=m[3]*p[0]+m[7]*p[1]+m[11]*p[2]+m[15];return[(m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12])/w,(m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13])/w,(m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14])/w,w]};

/* ---- GL ---- */
let gl=null,cv=null;const EXT={};
function initGL(){cv=$('gl');const o={antialias:false,alpha:false,depth:false,stencil:false,powerPreference:'high-performance',preserveDrawingBuffer:false};
 gl=cv.getContext('webgl2',o);if(!gl)return false;
 EXT.hdr=!!(gl.getExtension('EXT_color_buffer_float')||gl.getExtension('EXT_color_buffer_half_float'))&&!window.FORCE_LDR;gl.getExtension('OES_texture_float_linear');
 const d=gl.getExtension('WEBGL_debug_renderer_info');EXT.gpu=d?gl.getParameter(d.UNMASKED_RENDERER_WEBGL):'';EXT.maxTex=gl.getParameter(gl.MAX_TEXTURE_SIZE);return true}
function shader(t,src){const s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const log=gl.getShaderInfoLog(s);console.error(log+'\n'+src.split('\n').map((l,i)=>(i+1)+': '+l).join('\n'));throw new Error('shader: '+log)}return s}
function program(vs,fs){const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);
 if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('link: '+gl.getProgramInfoLog(p));const c={};return{p,u:n=>n in c?c[n]:(c[n]=gl.getUniformLocation(p,n))}}
const VSZ=10,ISZ=24;
/* mesh: verts = Float32Array [pos3,nrm3,ext4]*, idx = Uint32Array; instanced with ISZ floats */
function mesh(verts,idx,cap,dyn){const m={n:idx.length,cap:cap||1,count:0,inst:new Float32Array((cap||1)*ISZ),dirty:true,nv:verts.length/VSZ};
 m.vao=gl.createVertexArray();gl.bindVertexArray(m.vao);
 m.vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,m.vb);gl.bufferData(gl.ARRAY_BUFFER,verts,dyn?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);
 gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,VSZ*4,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,VSZ*4,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,4,gl.FLOAT,false,VSZ*4,24);
 m.ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,idx,gl.STATIC_DRAW);
 m.ibuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,m.ibuf);gl.bufferData(gl.ARRAY_BUFFER,m.inst.byteLength,gl.DYNAMIC_DRAW);
 for(let i=0;i<4;i++){gl.enableVertexAttribArray(3+i);gl.vertexAttribPointer(3+i,4,gl.FLOAT,false,ISZ*4,i*16);gl.vertexAttribDivisor(3+i,1)}
 gl.enableVertexAttribArray(7);gl.vertexAttribPointer(7,3,gl.FLOAT,false,ISZ*4,64);gl.vertexAttribDivisor(7,1);
 gl.enableVertexAttribArray(8);gl.vertexAttribPointer(8,4,gl.FLOAT,false,ISZ*4,76);gl.vertexAttribDivisor(8,1);
 gl.enableVertexAttribArray(9);gl.vertexAttribPointer(9,1,gl.FLOAT,false,ISZ*4,92);gl.vertexAttribDivisor(9,1);
 gl.bindVertexArray(null);return m}
function upload(m){if(!m.dirty||!m.count)return;gl.bindBuffer(gl.ARRAY_BUFFER,m.ibuf);gl.bufferSubData(gl.ARRAY_BUFFER,0,m.inst,0,m.count*ISZ);m.dirty=false}
function drawM(m){if(!m.count)return;gl.bindVertexArray(m.vao);gl.drawElementsInstanced(gl.TRIANGLES,m.n,gl.UNSIGNED_INT,0,m.count)}
/* write one instance: P origin, X/Y/Z scaled axes, col (linear rgb), rough, metal, emis, mat, extra */
function inst(m,P,X,Y,Z,col,rough,metal,emis,mat,ex){if(m.count>=m.cap)return;const a=m.inst,o=m.count++*ISZ;
 a[o]=X[0];a[o+1]=X[1];a[o+2]=X[2];a[o+3]=0;a[o+4]=Y[0];a[o+5]=Y[1];a[o+6]=Y[2];a[o+7]=0;a[o+8]=Z[0];a[o+9]=Z[1];a[o+10]=Z[2];a[o+11]=0;a[o+12]=P[0];a[o+13]=P[1];a[o+14]=P[2];a[o+15]=1;
 a[o+16]=col[0];a[o+17]=col[1];a[o+18]=col[2];a[o+19]=rough;a[o+20]=metal;a[o+21]=emis;a[o+22]=mat;a[o+23]=ex||0;m.dirty=true}
function tex2D(w,h,ifmt,fmt,type,filter,wrap){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,ifmt,w,h,0,fmt,type,null);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,filter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,filter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,wrap||gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,wrap||gl.CLAMP_TO_EDGE);return t}
function fbo(w,h,hdr,depth){const f={w,h,fb:gl.createFramebuffer()};gl.bindFramebuffer(gl.FRAMEBUFFER,f.fb);
 f.tex=hdr?tex2D(w,h,gl.RGBA16F,gl.RGBA,gl.HALF_FLOAT,gl.LINEAR):tex2D(w,h,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,gl.LINEAR);
 gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,f.tex,0);
 if(depth){f.depth=tex2D(w,h,gl.DEPTH_COMPONENT24,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,gl.NEAREST);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,f.depth,0)}
 f.ok=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;gl.bindFramebuffer(gl.FRAMEBUFFER,null);return f}
function freeFbo(f){if(!f)return;gl.deleteFramebuffer(f.fb);gl.deleteTexture(f.tex);if(f.depth)gl.deleteTexture(f.depth)}
function shadowFbo(s){const f={w:s,h:s,fb:gl.createFramebuffer()};gl.bindFramebuffer(gl.FRAMEBUFFER,f.fb);f.depth=tex2D(s,s,gl.DEPTH_COMPONENT24,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_MODE,gl.COMPARE_REF_TO_TEXTURE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_FUNC,gl.LEQUAL);
 gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,f.depth,0);gl.drawBuffers([gl.NONE]);gl.readBuffer(gl.NONE);gl.bindFramebuffer(gl.FRAMEBUFFER,null);return f}
