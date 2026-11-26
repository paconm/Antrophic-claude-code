/* ================= shaders ================= */
const GL_HEAD=`#version 300 es
precision highp float;precision highp int;precision highp sampler2DShadow;
`;
const G_SKY=`
uniform vec3 uSun,uSunCol,uZen,uHor,uGnd,uMoon,uCam,uAmbS,uAmbG;uniform float uEcl,uTime,uSunVis,uFogD,uDawn;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*vn(p);p=p*2.03+vec2(17.1,9.2);a*=.5;}return s;}
float fbm2(vec2 p){float s=0.,a=.5;for(int i=0;i<3;i++){s+=a*vn(p);p=p*2.03+vec2(17.1,9.2);a*=.5;}return s;}
vec3 skyBase(vec3 d){float h=d.y;vec3 c=mix(uHor,uZen,pow(clamp(h,0.,1.),.42));c=mix(c,uGnd,smoothstep(.02,-.2,h));
 float sd=max(dot(d,uSun),0.);c+=uSunCol*uSunVis*(pow(sd,5.)*.03+pow(sd,40.)*.075)*smoothstep(-.3,.05,h);return c;}
vec3 skyFull(vec3 d){vec3 c=skyBase(d);float h=d.y;
 if(h>0.&&uEcl>.03){vec3 q=d*190.;vec3 id=floor(q);float s=h21(id.xy+id.z*31.7);vec3 f=fract(q)-.5;c+=vec3(.85,.9,1.)*step(.992,s)*smoothstep(.3,0.,length(f))*uEcl*2.2*(.6+.4*sin(uTime*2.+s*40.))*smoothstep(0.,.25,h);}
 if(h>.012){vec2 p=d.xz/(h+.14)*1.2+uTime*vec2(.005,.002);float dn=fbm(p);float cov=smoothstep(.47,.8,dn)*smoothstep(.012,.2,h);
  float dn2=fbm2(p+normalize(uSun.xz+1e-4)*.22);float lit=clamp(.55+(dn-dn2)*2.6,0.,1.);float sd=max(dot(d,uSun),0.);
  vec3 cl=mix(uZen*.6+uHor*.22,uHor*1.2+uSunCol*uSunVis*.2,lit);cl+=uSunCol*uSunVis*pow(sd,10.)*.45*(1.-cov*.6);c=mix(c,cl,cov*.92);}
 float cs=dot(d,uSun),cm=dot(d,uMoon);float disc=smoothstep(.99952,.9997,cs),moon=smoothstep(.99938,.99952,cm);
 c=mix(c,vec3(.003,.002,.006),moon);c+=uSunCol*disc*26.*(1.-moon);
 float md=acos(clamp(cm,-1.,1.));vec3 mx=normalize(cross(uMoon,vec3(0.,1.,0.))),my=cross(mx,uMoon);float ang=atan(dot(d,my),dot(d,mx));
 float ring=exp(-max(md-.034,0.)*34.)*(1.-moon)*(.5+1.1*pow(vn(vec2(ang*4.5,2.)),2.));c+=mix(vec3(1.,.8,.6),vec3(.7,.55,1.),.65)*ring*uEcl*uEcl*uEcl*9.;
 return c;}
vec3 applyFog(vec3 c,vec3 wp){vec3 d=wp-uCam;float dist=length(d);vec3 dir=d/dist;float hf=exp(-max(wp.y+20.,0.)*.012);
 float f=1.-exp(-dist*uFogD*(.3+.7*hf));return mix(c,skyBase(normalize(vec3(dir.x,max(dir.y,.0)*.5+.03,dir.z))),clamp(f,0.,1.));}
float fogAmt(vec3 wp){float dist=length(wp-uCam);float hf=exp(-max(wp.y+20.,0.)*.012);return clamp(1.-exp(-dist*uFogD*(.3+.7*hf)),0.,1.);}
`;
const G_LIGHT=`
uniform sampler2DShadow uShadow;uniform mat4 uLVP;uniform float uShOn;uniform vec3 uPL[8];uniform vec4 uPLc[8];
float shadow(vec3 wp,vec3 n){if(uShOn<.5)return 1.;vec4 lp=uLVP*vec4(wp+n*.07,1.);vec3 s=lp.xyz*.5+.5;if(s.x<0.||s.x>1.||s.y<0.||s.y>1.||s.z>1.)return 1.;
 float t=1.3/float(textureSize(uShadow,0).x);float sum=0.;for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)sum+=texture(uShadow,vec3(s.xy+vec2(x,y)*t,s.z-.0009));
 float fade=smoothstep(.82,1.,max(abs(s.x-.5),abs(s.y-.5))*2.);return mix(sum/9.,1.,fade);}
vec3 pointLights(vec3 wp,vec3 n,vec3 alb){vec3 s=vec3(0.);for(int i=0;i<8;i++){float r=uPLc[i].w;if(r<=0.)continue;vec3 L=uPL[i]-wp;float d2=dot(L,L);if(d2<r*r){float d=sqrt(d2);float a=1.-d/r;a*=a;s+=uPLc[i].rgb*a*(max(dot(n,L/d),0.)*.85+.15)/(1.+d2*.06);}}return s*alb;}
vec3 shade(vec3 wp,vec3 n,vec3 v,vec3 alb,float rough,float metal,float ao,float sss){float sh=shadow(wp,n);float ndl=dot(n,uSun);float wrap=clamp((ndl+sss)/(1.+sss),0.,1.);float nl=max(ndl,0.);
 vec3 h=normalize(uSun+v);float ndh=max(dot(n,h),0.),ndv=max(dot(n,v),1e-3),vdh=max(dot(v,h),0.);float a=rough*rough,a2=a*a;float dd=ndh*ndh*(a2-1.)+1.;float D=a2/(3.14159*dd*dd);
 float k=(rough+1.);k=k*k/8.;float G=1./((nl*(1.-k)+k)*(ndv*(1.-k)+k));vec3 F0=mix(vec3(.04),alb,metal);vec3 F=F0+(1.-F0)*pow(1.-vdh,5.);
 vec3 spec=min(D*G*.25,24.)*F*nl;vec3 dif=alb*(1.-metal)*.318;vec3 c=(dif*wrap+spec)*uSunCol*sh;
 c+=mix(uAmbG,uAmbS,n.y*.5+.5)*alb*(1.-metal*.6)*ao;
 vec3 R=reflect(-v,n);c+=skyBase(R)*(F0+(1.-F0)*pow(1.-ndv,5.))*(1.-rough)*(1.-rough)*ao*mix(.6,1.,sh);
 c+=pointLights(wp,n,alb*(1.-metal*.5)+F0*metal);return c;}
`;
const OUTM=h=>h?'#define OUT(c,a) o=vec4(c,a)\n':'#define OUT(c,a) o=vec4(sqrt(min((c)*.125,vec3(1.))),a)\n';
const VS_UBER=`#version 300 es
layout(location=0) in vec3 aP;layout(location=1) in vec3 aN;layout(location=2) in vec4 aE;layout(location=3) in mat4 iM;layout(location=7) in vec3 iC;layout(location=8) in vec4 iPar;layout(location=9) in float iX;
uniform mat4 uVP;out vec3 vWP,vN,vLP,vC;out vec4 vPar,vE;out float vX;
void main(){vec4 w=iM*vec4(aP,1.);vWP=w.xyz;vec3 X=iM[0].xyz,Y=iM[1].xyz,Z=iM[2].xyz;vN=normalize(X*(aN.x/dot(X,X))+Y*(aN.y/dot(Y,Y))+Z*(aN.z/dot(Z,Z)));
 vLP=aP*vec3(length(X),length(Y),length(Z));vC=iC;vPar=iPar;vE=aE;vX=iX;gl_Position=uVP*w;}`;
const VS_SKIN=`#version 300 es
layout(location=0) in vec3 aP;layout(location=1) in vec3 aN;layout(location=2) in vec3 aC;layout(location=3) in vec3 aM;layout(location=4) in vec3 aB;
uniform mat4 uVP,uM;uniform mat4 uB[17];uniform float uX,uEm;out vec3 vWP,vN,vLP,vC;out vec4 vPar,vE;out float vX;
void main(){mat4 b=uB[int(aB.x+.5)]*aB.z+uB[int(aB.y+.5)]*(1.-aB.z);vec4 w=uM*(b*vec4(aP,1.));vWP=w.xyz;vN=normalize(mat3(uM)*(mat3(b)*aN));vLP=aP;vC=aC;vPar=vec4(aM.x,aM.y,uEm,aM.z);vE=vec4(0.);vX=uX;gl_Position=uVP*w;}`;
const VS_SKIND=`#version 300 es
layout(location=0) in vec3 aP;layout(location=4) in vec3 aB;uniform mat4 uVP,uM;uniform mat4 uB[17];
void main(){mat4 b=uB[int(aB.x+.5)]*aB.z+uB[int(aB.y+.5)]*(1.-aB.z);gl_Position=uVP*(uM*(b*vec4(aP,1.)));}`;
const VS_DEPTH=`#version 300 es
layout(location=0) in vec3 aP;layout(location=3) in mat4 iM;uniform mat4 uVP;void main(){gl_Position=uVP*iM*vec4(aP,1.);}`;
const FS_DEPTH=`#version 300 es
precision highp float;void main(){}`;
const FS_UBER=h=>GL_HEAD+OUTM(h)+G_SKY+G_LIGHT+`
in vec3 vWP,vN,vLP,vC;in vec4 vPar,vE;in float vX;out vec4 o;
float n3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);vec2 a=i.xy+i.z*37.13,b=a+37.13;
 return mix(mix(mix(h21(a),h21(a+vec2(1,0)),f.x),mix(h21(a+vec2(0,1)),h21(a+vec2(1,1)),f.x),f.y),mix(mix(h21(b),h21(b+vec2(1,0)),f.x),mix(h21(b+vec2(0,1)),h21(b+vec2(1,1)),f.x),f.y),f.z);}
float fb3(vec3 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*n3(p);p=p*2.02+vec3(11.3,5.7,3.1);a*=.5;}return s;}
float bn(vec3 p){return n3(p)+.5*n3(p*2.3+4.);}
void main(){int m=int(vPar.w+.5);vec3 n=normalize(vN);vec3 v=normalize(uCam-vWP);float lod=clamp(1.25-length(vWP-uCam)/65.,0.,1.);vec3 alb=vC;float rough=vPar.x,metal=vPar.y,emis=vPar.z,ao=1.,sss=0.;vec3 em=vec3(0.);
 if(m==5){OUT(mix(vC*emis,skyBase(-v),fogAmt(vWP)*.8),1.);return;}
 if(m==1){vec2 q=vWP.xz;float slope=1.-n.y;float n1=fbm(q*.07),n2=fbm(q*.9+3.),n4=vn(q*7.);
  vec3 grass=mix(vec3(.04,.095,.016),vec3(.115,.17,.03),n1);grass=mix(grass,vec3(.19,.17,.05),smoothstep(.5,.8,n2)*.55);grass*=mix(1.,.75+.5*n4,lod);
  vec3 rock=mix(vec3(.085,.08,.085),vec3(.27,.25,.23),fb3(vWP*vec3(.3,.8,.3)));rock*=mix(1.,.8+.4*n4,lod);
  vec3 dirt=mix(vec3(.10,.07,.04),vec3(.19,.14,.09),n2)*mix(1.,.8+.4*n4,lod)*(.85+.3*vn(q*2.3));
  float rw=clamp(smoothstep(.2,.4,slope+(n2-.5)*.25)+smoothstep(.9,.99,vE.w)*.9,0.,1.);alb=mix(grass,rock,rw);rough=mix(.93,.78,rw);
  float pth=vE.y*(1.-vE.x);alb=mix(alb,dirt*(1.+smoothstep(.7,.78,vn(q*11.))*(.3+.7*vn(q*3.1))*.9*lod),pth*(1.-rw));
  if(vE.x>.01){float r=length(q),a=atan(q.y,q.x);float ring=r/1.55,ri=floor(ring);float cnt=ri*6.+6.;float seg=(a/6.2832+.5)*cnt+ri*.37;vec2 tuv=vec2(fract(ring),fract(seg));
   float tv=h21(vec2(ri,floor(seg)));vec3 stone=mix(vec3(.2,.185,.17),vec3(.36,.33,.3),tv)*(.8+.4*n2);
   float edge=min(min(tuv.x,1.-tuv.x)*1.55,min(tuv.y,1.-tuv.y)*(6.2832*max(r,.5)/cnt));float grout=smoothstep(.05,.012,edge);stone=mix(stone,vec3(.035,.03,.028),grout);
   float gold=clamp(smoothstep(.13,.06,abs(r-12.4))+smoothstep(.1,.05,abs(r-4.5))+smoothstep(.1,.05,abs(r-8.2))*step(.5,fract(a*3.5/3.14159)),0.,1.)*(1.-grout);
   alb=mix(alb,mix(stone,vec3(.95,.6,.18),gold),vE.x);rough=mix(rough,mix(.38+.3*tv+grout*.4,.28,gold),vE.x);metal=gold*vE.x;
   n=normalize(n+vec3(tuv.x-.5,0.,tuv.y-.5)*smoothstep(.16,.02,edge)*.25*vE.x);}
  ao=vE.z;vec2 gq=q*3.;vec2 gr=vec2(vn(gq+vec2(.2,0.))-vn(gq-vec2(.2,0.)),vn(gq+vec2(0.,.2))-vn(gq-vec2(0.,.2)));n=normalize(n+vec3(-gr.x,0.,-gr.y)*.4*lod*(1.-vE.x*.85));}
 else if(m==2||m==14){float f=mix(n3(vLP*.8+vX*7.)*.7+.15,fb3(vLP*1.3+vX*7.),lod);alb*=.5+.85*f;if(lod>0.){alb*=mix(1.,.82+.36*n3(vLP*9.),lod);float b0=bn(vLP*3.2);vec3 g=vec3(bn(vLP*3.2+vec3(.12,0.,0.))-b0,bn(vLP*3.2+vec3(0.,.12,0.))-b0,bn(vLP*3.2+vec3(0.,0.,.12))-b0);n=normalize(n-g*1.6*lod);}
  alb=mix(alb,vec3(.06,.1,.03),smoothstep(.55,.9,n.y)*smoothstep(.45,.62,fb3(vLP*.9+3.))*.7);ao=.75+.25*smoothstep(.3,.6,f);
  if(m==14){float rr=max(length(vLP.xz),1.),vv=vLP.y/.58,row=floor(vv),u=atan(vLP.z,vLP.x)*rr/1.15+mod(row,2.)*.5;vec2 fb=fract(vec2(u,vv));float edge=min(min(fb.x,1.-fb.x)*1.15,min(fb.y,1.-fb.y)*.58);float mw=.022+.0011*length(vWP-uCam);float mo=smoothstep(mw*2.,mw*.6,edge);alb*=mix(1.,.42,mo)*(.8+.4*h21(vec2(floor(u),row)));rough=mix(rough,.95,mo);}}
 else if(m==3){sss=.5;rough=.46;alb*=.93+.14*n3(vLP*60.);if(lod>0.)n=normalize(n+(vec3(n3(vLP*330.),n3(vLP*330.+9.),n3(vLP*330.+17.))-.5)*.14*lod);float fr=pow(1.-max(dot(n,v),0.),3.);em=alb*(uSunCol*.035+mix(uAmbG,uAmbS,.6)*.5)*fr;
  if(vX>.5&&vX<1.5){vec2 q2=vec2(atan(vLP.x,vLP.z)*8.,vLP.y*50.);q2.x+=step(1.,mod(floor(q2.y),2.))*.5;vec2 fc=fract(q2)-.5;alb*=.9+.14*smoothstep(.55,.15,length(fc));em+=vec3(.05,.35,.45)*fr*.35;rough=.36;}}
 else if(m==12){vec3 tg=normalize(vec3(0.,-1.,0.)-n*dot(vec3(0.,-1.,0.),n)+vec3(1e-4,0.,0.));float s1=n3(vec3(vLP.x*150.,vLP.y*10.,vLP.z*150.)),s2=n3(vec3(vLP.x*38.,vLP.y*5.,vLP.z*38.));alb*=.5+.8*s2;
  n=normalize(n+cross(tg,n)*(s1-.5)*.8*lod);vec3 hh=normalize(uSun+v);float t1=dot(normalize(tg+n*(s1-.5)*.6),hh),t2=dot(normalize(tg+n*.3),hh);float shh=shadow(vWP,n)*max(dot(n,uSun)*.6+.4,0.);
  em=(vec3(.9)*pow(max(1.-t1*t1,0.),70.)*.22+alb*pow(max(1.-t2*t2,0.),14.)*1.2)*uSunCol*shh*.3;rough=.75;sss=.35;}
 else if(m==13){vec3 q3=normalize(vLP);float a=acos(clamp(q3.z,-1.,1.));float ang=atan(q3.y,q3.x);vec3 scl=vec3(.62,.6,.58)*(1.-.4*smoothstep(.8,1.5,a));float fib=.7+.6*vn(vec2(ang*10.,a*16.));
  vec3 iris=vC*fib*(1.-.75*smoothstep(.34,.5,a))*1.25;alb=mix(scl,iris,smoothstep(.52,.47,a));alb=mix(alb,vec3(.004),smoothstep(.2,.165,a));alb*=.5+.5*smoothstep(.5,-.15,q3.y);rough=.06;sss=.3;
  em=vec3(1.)*pow(max(dot(n,normalize(v+vec3(.25,.6,.1))),0.),260.)*(.6+length(mix(uAmbG,uAmbS,.6))*3.);}
 else if(m==4){if(dot(n,v)<0.)n=-n;alb*=.95+.1*n3(vLP*170.)*lod;if(lod>0.&&vX<.5){float w1=n3(vLP*vec3(46.,11.,46.)),w2=n3(vLP*vec3(11.,46.,11.)+5.),w3=n3(vLP*420.);n=normalize(n+(vec3(w1-.5,w2-.5,w1*w2-.25)*.3+vec3(w3-.5)*.12)*lod);alb*=.9+.2*w1;}if(vX>.5){float fd=sin(vE.x*25.+sin(vE.y*6.)*1.3)*smoothstep(0.,.35,vE.y);vec3 tg=normalize(cross(n,vec3(0.,1.,0.))+1e-4);n=normalize(n+tg*fd*.55);alb*=.8+.2*fd;alb*=mix(1.,1.5,smoothstep(.965,.985,vE.y));}sss=.25;em=alb*mix(uAmbG,uAmbS,.7)*pow(1.-max(dot(n,v),0.),2.5)*.9;}
 else if(m==6){float R=length(vLP)+1e-5;float ndv=max(dot(n,v),0.);float fr=.04+.96*pow(1.-ndv,5.);vec3 rd=refract(-v,n,.74);if(dot(rd,rd)<.01)rd=-v;rd=normalize(rd);vec3 ro=vLP/R;float tm=max(-2.*dot(ro,rd),0.),st=tm/10.,tt=uTime*.35+vX*7.;vec3 acc=vec3(0.);float tr=1.;
  for(int i=0;i<10;i++){vec3 p=ro+rd*(st*(float(i)+.5));float r=length(p);vec3 q=p*2.1+vec3(0.,tt,0.);q+=1.3*vec3(n3(q*1.3+tt),n3(q*1.3+7.-tt),n3(q*1.3+13.));float d=fb3(q);float neb=smoothstep(.4,.78,d);float core=exp(-r*r*9.)*2.+exp(-r*r*70.)*9.;float fil=pow(max(0.,1.-abs(d-.5)*9.),3.)*1.5;
   vec3 col=mix(vC,vec3(1.),clamp(core*.22+fil*.35,0.,1.));float dens=(neb*1.2+fil+core)*(1.-smoothstep(.82,1.,r));acc+=tr*col*dens*st*2.4;tr*=exp(-dens*st*1.2);}
  vec3 c=acc*emis*(1.-fr)+skyFull(reflect(-v,n))*fr*1.1+vC*emis*.3*pow(1.-ndv,2.5)+uSunCol*pow(max(dot(n,normalize(uSun+v)),0.),400.)*4.+vec3(1.)*pow(max(dot(n,normalize(v+vec3(.3,.7,.2))),0.),120.)*.5*min(emis,1.5);OUT(c,1.);return;}
 else if(m==15){float ndv=max(dot(n,v),0.);float fr=pow(1.-ndv,3.);float pul=.55+.45*n3(vLP*5.+vec3(0.,uTime*.4,0.));vec3 c=vC*emis*(.3+.7*pul)*(.45+.55*ndv)+skyFull(reflect(-v,n))*fr*.9+vec3(1.)*fr*emis*.25+uSunCol*pow(max(dot(n,normalize(uSun+v)),0.),80.)*2.;OUT(mix(c,skyBase(-v),fogAmt(vWP)*.6),1.);return;}
 else if(m==7){float cr=fb3(vLP*5.);float crack=smoothstep(.03,0.,abs(cr-.5));alb=vC*(.5+.9*fb3(vLP*11.));em=vec3(.5,.22,1.)*crack*(1.5+sin(uTime*3.+vLP.y*4.))*emis;
  float dn=fb3(vLP*3.5+7.),th=vX*1.15-.08;if(dn<th)discard;em+=vec3(.8,.4,1.)*smoothstep(.07,0.,dn-th)*7.*step(.001,vX);}
 else if(m==8){float bk=fbm(vec2(atan(vLP.z,vLP.x)*5.,vLP.y*.7+vX));alb*=.45+.9*bk;float r1=fbm(vec2(atan(vLP.z,vLP.x)*5.+.1,vLP.y*.7+vX));n=normalize(n+cross(n,vec3(0.,1.,0.))*(r1-bk)*6.*lod);ao=.8;}
 else if(m==11){float bz=vWP.z/.36;float id=floor(bz),fz=fract(bz);float gap=smoothstep(0.,.04,fz)*smoothstep(1.,.96,fz);alb*=(.6+.6*h21(vec2(id,3.)))*(.75+.5*fbm(vec2(vWP.x*.7+id*7.,vWP.z*1.7)));alb*=mix(.2,1.,gap);rough=.8;n=normalize(n+vec3(0.,0.,(fz-.5)*(1.-gap)*1.6));}
 else if(m==10){float hg=vWP.y-(${LAKE_Y.toFixed(1)});float f=fbm(vWP.xz*.012);float snow=smoothstep(300.,420.,hg+(f-.5)*200.)*smoothstep(.3,.6,n.y+.15);
  alb=mix(vec3(.05,.047,.05),vec3(.12,.11,.1),fbm(vWP.xz*.03));alb=mix(alb,vec3(.018,.04,.02),smoothstep(240.,90.,hg)*smoothstep(.45,.75,n.y));alb=mix(alb,vec3(.7,.74,.82),snow);rough=.9;}
 vec3 c=shade(vWP,n,v,alb,rough,metal,ao,sss)+em+alb*emis;OUT(applyFog(c,vWP),1.);}`;
/* grass */
const VS_GRASS=`#version 300 es
layout(location=0) in vec3 aB;layout(location=1) in vec4 iA;layout(location=2) in vec4 iB;uniform mat4 uVP;uniform float uTime,uWind;uniform vec3 uPl;
out vec3 vWP,vN;out float vT,vTint;
void main(){float b=aB.z;float yaw=iA.w+b*1.9;float t=aB.y;float h=iB.x*(1.-b*.13);float w=iB.y*(1.-t*t*.94);vec2 dir=vec2(cos(yaw),sin(yaw)),perp=vec2(-dir.y,dir.x);
 vec3 root=iA.xyz+vec3(dir.x,0.,dir.y)*.05*b;float ph=iB.z+root.x*.31+root.z*.23;float wind=(sin(uTime*1.6+ph)*.6+sin(uTime*2.9+ph*1.7)*.25+sin(uTime*.7+root.x*.05+root.z*.04)*.6)*uWind;
 vec2 wd=vec2(.8,.6);float bend=t*t;vec3 p=root+vec3(perp.x,0.,perp.y)*aB.x*w+vec3(0.,h*t*(1.-.2*bend),0.)+vec3(dir.x,0.,dir.y)*bend*h*.32+vec3(wd.x,0.,wd.y)*bend*h*(.28*wind+.1);
 vec2 aw=root.xz-uPl.xz;float d=length(aw);float push=(1.-smoothstep(.2,1.4,d))*step(abs(root.y-uPl.y),1.6);p.xz+=aw/max(d,.05)*push*bend*.8*h;p.y-=push*bend*h*.4;
 vWP=p;vT=t;vTint=iB.w;vN=normalize(vec3(0.,1.,0.)*.8+vec3(dir.x,0.,dir.y)*.35*(1.-t)+vec3(wd.x,0.,wd.y)*.12*wind);gl_Position=uVP*vec4(p,1.);}`;
const FS_GRASS=h=>GL_HEAD+OUTM(h)+G_SKY+G_LIGHT+`
in vec3 vWP,vN;in float vT,vTint;out vec4 o;
void main(){vec3 v=normalize(uCam-vWP);vec3 n=normalize(vN);vec3 tip=mix(vec3(.045,.105,.018),vec3(.12,.16,.035),vTint);vec3 alb=mix(tip*.42,tip,vT)*(.8+.4*vTint);
 float sh=shadow(vWP,vec3(0.,1.,0.));float ndl=clamp(dot(n,uSun)*.6+.4,0.,1.);vec3 c=alb*(uSunCol*ndl*sh*.318+mix(uAmbG,uAmbS,.85)*(.55+.45*vT));
 c+=alb*uSunCol*pow(max(dot(-v,uSun),0.),3.)*vT*sh*.55;c+=uSunCol*pow(max(dot(n,normalize(uSun+v)),0.),22.)*vT*.05*sh;c+=pointLights(vWP,vec3(0.,1.,0.),alb)*(.5+.5*vT);OUT(applyFog(c,vWP),1.);}`;
/* leaves */
const VS_LEAF=`#version 300 es
layout(location=0) in vec2 aQ;layout(location=1) in vec4 iA;layout(location=2) in vec4 iB;layout(location=3) in vec4 iC;uniform mat4 uVP;uniform float uTime,uWind;
out vec3 vWP,vN,vC;out vec2 vQ;out float vE;
void main(){vec3 n=normalize(iB.xyz);float ph=iB.w;vec3 r=normalize(vec3(sin(ph*12.9),cos(ph*7.3)*.6,sin(ph*4.1+1.)));vec3 cn=normalize(n+r*.9);vec3 u=normalize(cross(cn,vec3(.21,1.,.13)));vec3 w=cross(cn,u);
 float sw=sin(uTime*1.3+ph*6.+iA.x*.2)*uWind;vec3 p=iA.xyz+(u*aQ.x+w*aQ.y)*iA.w+vec3(.8,0.,.6)*sw*.09*iA.w+u*sin(uTime*3.1+ph*20.)*.03*uWind;
 vWP=p;vN=n;vC=iC.rgb;vE=iC.a;vQ=aQ;gl_Position=uVP*vec4(p,1.);}`;
const G_LEAFMASK=`float lf(vec2 p){return length(vec2(abs(p.x)+.5,p.y))-.78;}
float leafMask(vec2 q){float m=1.;for(int i=0;i<3;i++){float a=(float(i)-1.)*1.15;float c=cos(a),s=sin(a);vec2 p=mat2(c,-s,s,c)*(q-vec2(0.,-.35))-vec2(0.,.62);m=min(m,lf(p*1.05));}return m;}`;
const FS_LEAF=h=>GL_HEAD+OUTM(h)+G_SKY+G_LIGHT+G_LEAFMASK+`
in vec3 vWP,vN,vC;in vec2 vQ;in float vE;out vec4 o;
void main(){float m=leafMask(vQ);if(m>0.)discard;vec3 v=normalize(uCam-vWP);vec3 n=normalize(vN);vec3 alb=vC*(.75+.5*smoothstep(-.3,0.,m));float sh=shadow(vWP,n);
 float ndl=clamp(dot(n,uSun)*.55+.45,0.,1.);vec3 c=alb*(uSunCol*ndl*sh*.318+mix(uAmbG,uAmbS,n.y*.5+.5));c+=alb*uSunCol*pow(max(dot(-v,uSun),0.),2.)*sh*.7;
 c+=pointLights(vWP,n,alb)+alb*vE;OUT(applyFog(c,vWP),1.);}`;
const VS_LEAFD=`#version 300 es
layout(location=0) in vec2 aQ;layout(location=1) in vec4 iA;layout(location=2) in vec4 iB;uniform mat4 uVP;out vec2 vQ;
void main(){vec3 n=normalize(iB.xyz);float ph=iB.w;vec3 r=normalize(vec3(sin(ph*12.9),cos(ph*7.3)*.6,sin(ph*4.1+1.)));vec3 cn=normalize(n+r*.9);vec3 u=normalize(cross(cn,vec3(.21,1.,.13)));vec3 w=cross(cn,u);
 vQ=aQ;gl_Position=uVP*vec4(iA.xyz+(u*aQ.x+w*aQ.y)*iA.w,1.);}`;
const FS_LEAFD=GL_HEAD+G_LEAFMASK+`in vec2 vQ;void main(){if(leafMask(vQ)>0.)discard;}`;
/* water + sky */
const VS_WATER=`#version 300 es
layout(location=0) in vec3 aP;uniform mat4 uVP;uniform vec3 uCam;out vec3 vWP;void main(){vWP=vec3(aP.x+uCam.x,${LAKE_Y.toFixed(1)},aP.z+uCam.z);gl_Position=uVP*vec4(vWP,1.);}`;
const FS_WATER=h=>GL_HEAD+OUTM(h)+G_SKY+`
in vec3 vWP;out vec4 o;float wav(vec2 q,float t){return fbm(q*6.+vec2(t,t*.6))+.5*fbm2(q*17.-vec2(t*1.3,t));}
void main(){vec3 rd=normalize(vWP-uCam);float dist=length(vWP-uCam);vec2 q=vWP.xz*.012;float t=uTime*.22;float f0=wav(q,t),fx=wav(q+vec2(.04,0.),t),fz=wav(q+vec2(0.,.04),t);
 float att=1./(1.+dist*.0011);vec3 n=normalize(vec3(-(fx-f0)*1.1*att,1.,-(fz-f0)*1.1*att));vec3 r=reflect(rd,n);r.y=abs(r.y)+.002;r=normalize(r);
 float fr=.02+.98*pow(1.-max(dot(-rd,n),0.),5.);vec3 c=mix(vec3(.003,.012,.018)+uZen*.07,skyFull(r),fr);c*=1.-.4*smoothstep(170.,50.,length(vWP.xz));OUT(applyFog(c,vWP),1.);}`;
const VS_FST=`#version 300 es
out vec2 vUV;void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));vUV=p;gl_Position=vec4(p*2.-1.,1.,1.);}`;
const FS_SKY=h=>GL_HEAD+OUTM(h)+G_SKY+`
in vec2 vUV;out vec4 o;uniform mat4 uIVP;void main(){vec4 w=uIVP*vec4(vUV*2.-1.,1.,1.);vec3 d=normalize(w.xyz/w.w-uCam);OUT(skyFull(d),1.);}`;
/* sprites and beams */
const VS_SPR=`#version 300 es
layout(location=0) in vec2 aQ;layout(location=1) in vec4 iA;layout(location=2) in vec4 iC;layout(location=3) in vec2 iF;uniform mat4 uVP;uniform vec3 uCR,uCU,uCam;uniform float uFogD;
out vec2 vQ;out vec4 vC;out float vF;
void main(){vec3 p=iF.x>.5&&iF.x<2.5?iA.xyz+vec3(aQ.x,0.,aQ.y)*iA.w:iA.xyz+(uCR*aQ.x+uCU*aQ.y)*iA.w;vQ=aQ;vC=iC;vF=iF.x;float dist=length(p-uCam);vC.rgb*=exp(-dist*uFogD*.6)*smoothstep(.25,1.5,length(iA.xyz-uCam)+iA.w*.35);gl_Position=uVP*vec4(p,1.);}`;
const FS_SPR=h=>GL_HEAD+OUTM(h)+`
in vec2 vQ;in vec4 vC;in float vF;out vec4 o;
void main(){float r=length(vQ);if(r>1.)discard;vec3 c;float a=0.;
 if(vF<.5){float g=1.-r;c=vC.rgb*g*g*vC.a;}
 else if(vF<1.5){float g=smoothstep(1.,.93,r)*smoothstep(.72,.9,r);c=vC.rgb*g*vC.a;}
 else if(vF<2.5){c=vC.rgb*(.22+.78*smoothstep(.8,.98,r))*smoothstep(1.,.97,r)*vC.a;}
 else{a=vC.a*smoothstep(1.,.15,r);c=vC.rgb*a;}
 OUT(c,a);}`;
const VS_BEAM=`#version 300 es
layout(location=0) in vec2 aQ;layout(location=1) in vec4 iA;layout(location=2) in vec4 iB;layout(location=3) in vec3 iC;uniform mat4 uVP;uniform vec3 uCam;out vec2 vQ;out vec4 vC;
void main(){vec3 a=iA.xyz,b=iB.xyz;vec3 mid=mix(a,b,aQ.x*.5+.5);vec3 side=normalize(cross(b-a,uCam-mid));vQ=aQ;vec3 wp=mid+side*aQ.y*iA.w;vC=vec4(iC,iB.w*smoothstep(.7,3.,length(wp-uCam)));gl_Position=uVP*vec4(wp,1.);}`;
const FS_BEAM=h=>GL_HEAD+OUTM(h)+`
in vec2 vQ;in vec4 vC;out vec4 o;void main(){float w=1.-abs(vQ.y);float e=smoothstep(1.,.8,abs(vQ.x));vec3 c=(vC.rgb*pow(w,1.6)*.7+vec3(1.)*pow(w,7.)*1.3)*vC.a*e;OUT(c,0.);}`;
/* post */
const FS_DOWN=GL_HEAD+`in vec2 vUV;out vec4 o;uniform sampler2D uT;uniform vec2 uPx;uniform float uFirst;
void main(){vec3 s=texture(uT,vUV).rgb*4.;s+=texture(uT,vUV-uPx).rgb+texture(uT,vUV+uPx).rgb+texture(uT,vUV+vec2(uPx.x,-uPx.y)).rgb+texture(uT,vUV-vec2(uPx.x,-uPx.y)).rgb;s*=.125;
 if(uFirst>.5){s=min(s,vec3(48.));float l=max(s.r,max(s.g,s.b));s*=smoothstep(.6,2.2,l)*.85+.15;}o=vec4(s,1.);}`;
const FS_UP=GL_HEAD+`in vec2 vUV;out vec4 o;uniform sampler2D uT;uniform vec2 uPx;
void main(){vec3 s=texture(uT,vUV+vec2(-uPx.x*2.,0.)).rgb+texture(uT,vUV+vec2(0.,uPx.y*2.)).rgb+texture(uT,vUV+vec2(uPx.x*2.,0.)).rgb+texture(uT,vUV+vec2(0.,-uPx.y*2.)).rgb;
 s+=(texture(uT,vUV+vec2(-uPx.x,uPx.y)).rgb+texture(uT,vUV+uPx).rgb+texture(uT,vUV+vec2(uPx.x,-uPx.y)).rgb+texture(uT,vUV-uPx).rgb)*2.;o=vec4(s/12.,1.);}`;
const FS_RAYS=GL_HEAD+`in vec2 vUV;out vec4 o;uniform sampler2D uT,uD;uniform vec2 uSunUV;uniform float uGR;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
void main(){vec2 st=(uSunUV-vUV)/36.*.92;vec2 uv=vUV+st*fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))));vec3 s=vec3(0.);float w=1.;for(int i=0;i<36;i++){float dp=texture(uD,uv).r;s+=min(texture(uT,uv).rgb,vec3(22.))*step(.999999,dp)*w;w*=.955;uv+=st;}o=vec4(s/36.*uGR,1.);}`;
const FS_COMP=h=>GL_HEAD+`in vec2 vUV;out vec4 o;uniform sampler2D uT,uB,uR,uD;uniform float uExp,uBloom,uRaysOn,uFlash,uSat,uAO;uniform vec3 uTint;uniform vec2 uNF;
float lz(float d){return uNF.x*uNF.y/(uNF.y-d*(uNF.y-uNF.x));}float hsh(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
void main(){vec3 c=texture(uT,vUV).rgb;${h?'':'c=c*c*8.;'}float d0=texture(uD,vUV).r;if(uAO>0.&&d0<.99995){float z0=lz(d0);vec2 ts=vec2(textureSize(uD,0));float rad=clamp(.42/z0,3./ts.y,.05);float a0=hsh(gl_FragCoord.xy)*6.283,occ=0.;for(int i=0;i<5;i++){float a=a0+float(i)*2.4,r=rad*(.3+.7*float(i+1)/5.);vec2 o=vec2(cos(a),sin(a))*r*vec2(ts.y/ts.x,1.);
   float zp=lz(texture(uD,vUV+o).r),zm=lz(texture(uD,vUV-o).r);occ+=clamp((z0-.5*(zp+zm))/(.1+.025*z0),0.,1.)*(1.-smoothstep(1.,2.5,abs(zp-zm)));}c*=1.-uAO*.62*occ/5.*(1.-smoothstep(60.,140.,z0));}
 vec3 b=texture(uB,vUV).rgb;c=mix(c,b,uBloom*.5)+b*uBloom*.35;vec2 rp=1.5/vec2(textureSize(uR,0));c+=(texture(uR,vUV).rgb*2.+texture(uR,vUV+rp).rgb+texture(uR,vUV-rp).rgb+texture(uR,vUV+vec2(rp.x,-rp.y)).rgb+texture(uR,vUV-vec2(rp.x,-rp.y)).rgb)*(uRaysOn/6.);c*=uExp;c+=uTint*uFlash;
 c=aces(c);c=pow(c,vec3(.4545));float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,uSat);c=mix(c,c*c*(3.-2.*c),.3);c*=mix(vec3(1.),vec3(.9,.96,1.1),(1.-l)*.45);c*=mix(vec3(1.),vec3(1.07,1.,.93),l*.4);o=vec4(c,1.);}`;
const FS_FINAL=GL_HEAD+`in vec2 vUV;out vec4 o;uniform sampler2D uT;uniform vec2 uPx;uniform float uGrain,uCA,uTime,uFxaa,uSharp,uVig;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec3 fxaa(vec2 uv){vec3 nw=texture(uT,uv+vec2(-1.,-1.)*uPx).rgb,ne=texture(uT,uv+vec2(1.,-1.)*uPx).rgb,sw=texture(uT,uv+vec2(-1.,1.)*uPx).rgb,se=texture(uT,uv+vec2(1.,1.)*uPx).rgb,m=texture(uT,uv).rgb;
 vec3 L=vec3(.299,.587,.114);float lnw=dot(nw,L),lne=dot(ne,L),lsw=dot(sw,L),lse=dot(se,L),lm=dot(m,L);float lmin=min(lm,min(min(lnw,lne),min(lsw,lse))),lmax=max(lm,max(max(lnw,lne),max(lsw,lse)));
 vec2 dir=vec2(-((lnw+lne)-(lsw+lse)),((lnw+lsw)-(lne+lse)));float red=max((lnw+lne+lsw+lse)*.03125,.0078125);float rcp=1./(min(abs(dir.x),abs(dir.y))+red);dir=clamp(dir*rcp,vec2(-8.),vec2(8.))*uPx;
 vec3 a=.5*(texture(uT,uv+dir*(1./3.-.5)).rgb+texture(uT,uv+dir*(2./3.-.5)).rgb);vec3 b=a*.5+.25*(texture(uT,uv+dir*-.5).rgb+texture(uT,uv+dir*.5).rgb);float lb=dot(b,L);return(lb<lmin||lb>lmax)?a:b;}
void main(){vec3 c=uFxaa>.5?fxaa(vUV):texture(uT,vUV).rgb;
 if(uSharp>0.){vec3 bl=(texture(uT,vUV+vec2(uPx.x,0.)).rgb+texture(uT,vUV-vec2(uPx.x,0.)).rgb+texture(uT,vUV+vec2(0.,uPx.y)).rgb+texture(uT,vUV-vec2(0.,uPx.y)).rgb)*.25;c=clamp(c+(c-bl)*uSharp,0.,1.);}
 if(uCA>0.){vec2 d=vUV-.5;float k=dot(d,d)*uCA;c.r=mix(c.r,texture(uT,vUV-d*k).r,.85);c.b=mix(c.b,texture(uT,vUV+d*k).b,.85);}
 float vg=smoothstep(1.3,.3,length((vUV-.5)*vec2(1.,.8))*1.6);c*=mix(1.-uVig,1.,vg);c+=(h21(gl_FragCoord.xy+fract(uTime)*91.7)-.5)*uGrain;o=vec4(c,1.);}`;
