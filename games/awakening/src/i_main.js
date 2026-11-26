/* ================= screens, HUD, main loop ================= */
const BLURB={ren:'A farmer\'s son whose touch turned the Crystal of Seven black. Bends gravity: his bolts pull, his Event Horizon swallows.',lyra:'Envoy of the Silver Court. Her arrows ride the wind and pierce a whole line of Husks. Gale Step cuts through them.',
 torvin:'Apprentice smith of Deepforge. Slow, unbreakable, and his hammer shakes the whole Circle with Worldbreaker.',kaida:'Rooftop runner from Sparkhaven. Lightning leaps from her daggers and chains from Husk to Husk.',
 nerissa:'Heir of the Tide Courts. Her lances hit like a riptide, and Tidal Surge sweeps the field clean.',pip:'A fairy of the Oracle\'s Hall. Three homing prism shots, and a Dawnburst that heals her and blinds the dark.'};
const AIRN={glide:'Hold jump to glide',double:'Double jump',none:'Heaviest hitter, most HP'};
function selHero(id){CFG.hero=id;saveCfg();startHero(id);S.pl.yaw=titleYaw();const H=HERO[id],col=ELC[H.el];document.querySelectorAll('.hb').forEach(b=>{b.classList.toggle('on',b.dataset.h===id);b.setAttribute('aria-pressed',b.dataset.h===id)});
 $('hinfo').innerHTML=`<div class="rowx" style="justify-content:space-between"><b></b><span class="el" style="color:${col}">${H.el} · ${NATION[H.nat][0]}</span></div><p></p><div class="tiny" style="text-align:left;margin-top:4px">${H.atk.n} · ${H.skill.n} · ${AIRN[H.air]}</div>`;
 $('hinfo').querySelector('b').textContent=H.n;$('hinfo').querySelector('p').textContent=BLURB[id];$('nick').placeholder=H.n}
const titleYaw=()=>2.35;
function buildTitle(){$('heroes').innerHTML=Object.keys(HERO).map(id=>`<button class="hb" data-h="${id}" style="--hc:${ELC[HERO[id].el]}" aria-pressed="false"><img src="${portrait(id,null,null,54)}" alt=""><span>${HERO[id].n}</span></button>`).join('');
 document.querySelectorAll('.hb').forEach(b=>b.onclick=()=>selHero(b.dataset.h));
 const modes=()=>{$('modes').innerHTML=[['perf','Performance','up to 120 fps'],['bal','Balanced','sharp · 60 fps'],['cine','Cinematic 4K','max detail']].map(([k,n,d])=>`<button class="pill${R.mode===k?' on':''}" data-m="${k}" aria-pressed="${R.mode===k}">${n}<small>${d}</small></button>`).join('');
  document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{CFG.mode=b.dataset.m;saveCfg();setMode(CFG.mode);modes()})};modes();R.modesUI=modes;
 const tg=()=>{$('tSound').textContent=CFG.sound?'Sound on':'Sound off';$('tSound').classList.toggle('on',CFG.sound);$('tVoice').textContent=CFG.voice?'Narrator on':'Narrator off';$('tVoice').classList.toggle('on',CFG.voice);if(!TTS.ok)$('tVoice').hidden=true};tg();
 $('tSound').onclick=()=>{CFG.sound=!CFG.sound;saveCfg();if(AU.m)AU.m.gain.value=CFG.sound?.5:0;tg()};$('tVoice').onclick=()=>{CFG.voice=!CFG.voice;saveCfg();if(!CFG.voice)TTS.stop();tg()};
 $('nick').value=CFG.nick||'';$('nick').oninput=()=>{CFG.nick=$('nick').value.replace(/[<>&"']/g,'').slice(0,14);saveCfg()};
 $('begin').onclick=beginGame;$('openConcept').onclick=showConcept;$('bMenu').onclick=toggleMenu;$('skip').onclick=endCine;selHero(HERO[CFG.hero]?CFG.hero:'ren')}
function toTitle(){S.state='title';S.cine=null;document.body.classList.remove('cine');$('hud').hidden=true;$('title').hidden=false;$('skip').hidden=true;$('bossbar').hidden=true;SUB.q.length=0;SUB.cur=null;$('subs').hidden=true;TTS.stop();resetRun();S.pl.yaw=titleYaw();mood(0);fade(0)}
function beginGame(){S.nick=CFG.nick||'';audioInit();if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume();resetRun();S.state='play';$('title').hidden=true;$('hud').hidden=false;const H=HERO[S.hero];$('hname').textContent=S.nick||H.n;$('hel').textContent=H.el;$('nA').textContent=H.atk.n;$('nS').textContent=H.skill.n;
 $('btnA').querySelector('span').textContent=H.atk.n.split(' ').pop().toUpperCase();$('btnS').querySelector('span').textContent=H.skill.n.split(' ').pop().toUpperCase();setObjective();$('obj').textContent='';startCine()}
/* opening cinematic */
function startCine(){const py=W.pierY;document.body.classList.add('cine');$('skip').hidden=false;const n=S.nick||HERO[S.hero].n;
 S.cine={t:0,dur:21,keys:[[0,[250,-70,340],[0,6,0]],[6,[128,10,170],[-14,14,-6]],[11,[44,26,74],[-44,38,-22]],[15.5,[10,10,36],[0,6.5,0]],[21,[.5,py+2.35,78.1],[.5,py+1.6,72]]]};
 S.timers.push({t:.8,fn:makeNpcs},{t:3,fn:()=>getModel('husk')},{t:5,fn:()=>getModel('boss')});
 say('narrator','Three hundred years ago, the Sundering War tore Aethra apart.',4.6);say('narrator','Seven nations. Seven elements. Seven Crowns, scattered so that no one could ever hold them all.',5.6);
 say('narrator','Tonight, above the Lake of Seven, the black moon is rising again.',4.6);say('narrator',`And a new student has just arrived at Arcanum. ${n}.`,4.4)}
function endCine(){if(!S.cine)return;makeNpcs();S.cine=null;document.body.classList.remove('cine');$('skip').hidden=true;IN.camYaw=Math.PI;IN.camPitch=.2;S.camT=null;SUB.q.length=0;SUB.cur=null;$('subs').hidden=true;TTS.stop();setObjective();
 say('seraphine',`Welcome to Arcanum, ${S.nick||HERO[S.hero].n}. Five orbs of ${NATION[HERO[S.hero].nat][0]} are hidden on this island. Follow the lights. Find them, and your element will answer.`,7);
 toast(document.body.classList.contains('touch')?'Left side: move · Right side: look · Buttons: attack, skill, jump':'WASD move · drag to look · click attack · right-click skill · Space jump')}
function cineCam(dt){const c=S.cine;c.t+=dt;const K=c.keys;let i=0;while(i<K.length-2&&c.t>K[i+1][0])i++;const a=K[i],b=K[i+1],u=sstep(0,1,clamp((c.t-a[0])/(b[0]-a[0]),0,1));const p0=K[Math.max(0,i-1)],p3=K[Math.min(K.length-1,i+2)];
 const cr=(q0,q1,q2,q3,t)=>{const o=[];for(let k=0;k<3;k++)o[k]=.5*((2*q1[k])+(-q0[k]+q2[k])*t+(2*q0[k]-5*q1[k]+4*q2[k]-q3[k])*t*t+(-q0[k]+3*q1[k]-3*q2[k]+q3[k])*t*t*t);return o};
 C.pos=cr(p0[1],a[1],b[1],p3[1],u);C.tgt=cr(p0[2],a[2],b[2],p3[2],u);C.fov=lerp(.72,.95,sstep(15,21,c.t));if(c.t>=c.dur)endCine()}
/* menus */
function toggleMenu(){const o=$('menu');if(!o.hidden){o.hidden=true;S.paused=false;return}S.paused=true;o.hidden=false;const T=R.toggles,tb=(k,n)=>`<button class="${T[k]?'on':''}" data-tg="${k}" aria-pressed="${!!T[k]}">${n}</button>`;
 o.innerHTML=`<div class="win" role="dialog" aria-label="Menu"><div class="rowx"><h3>Paused</h3><button class="chip" id="mClose">Resume</button></div>
 <h4>Graphics mode</h4><div class="opt">${Object.entries(QP).map(([k,q])=>`<button class="${R.mode===k?'on':''}" data-mm="${k}">${q.name}</button>`).join('')}</div>
 <p style="font-size:13.5px">Now: <b>${R.rw} × ${R.rh}</b> at <b>${R.fps}</b> fps on a ${R.hz} Hz screen. Performance follows your screen up to 120 fps and lowers resolution when needed. Cinematic 4K renders up to 3840 pixels wide with every effect on.</p>
 <h4>Effects</h4><div class="opt">${tb('shadows','Shadows')}${tb('ao','Ambient occlusion')}${tb('bloom','Bloom')}${tb('rays','God rays')}${tb('grass','Grass')}${tb('grain','Film grain')}</div>
 <h4>Sound</h4><div class="opt"><button class="${CFG.sound?'on':''}" id="mSound">Sound</button><button class="${CFG.voice?'on':''}" id="mVoice" ${TTS.ok?'':'hidden'}>Narrator voice</button></div>
 <h4>Controls</h4><p style="font-size:13.5px">Keyboard: WASD move, Shift sprint, Space jump, click or J attack, right-click or Q skill, drag to look, wheel to zoom. Touch: left side moves, right side looks, buttons act.</p>
 <button class="btn ghost" id="mConcept">Concept, roadmap and feedback (NL)</button><button class="btn ghost" id="mTitle">Back to hero select</button></div>`;
 const re=()=>{o.hidden=true;toggleMenu()};$('mClose').onclick=()=>{o.hidden=true;S.paused=false};o.querySelectorAll('[data-mm]').forEach(b=>b.onclick=()=>{CFG.mode=b.dataset.mm;saveCfg();setMode(CFG.mode);R.modesUI&&R.modesUI();re()});
 o.querySelectorAll('[data-tg]').forEach(b=>b.onclick=()=>{T[b.dataset.tg]=T[b.dataset.tg]?0:1;re()});$('mSound').onclick=()=>{CFG.sound=!CFG.sound;saveCfg();if(CFG.sound)audioInit();if(AU.m)AU.m.gain.value=CFG.sound?.5:0;re()};
 $('mVoice').onclick=()=>{CFG.voice=!CFG.voice;saveCfg();if(!CFG.voice)TTS.stop();re()};$('mConcept').onclick=()=>{o.hidden=true;showConcept()};$('mTitle').onclick=()=>{o.hidden=true;S.paused=false;toTitle()}}
const FB={stijl:['Realistisch, zoals nu','Anime / cel-shaded','Donkerder en grimmiger'],camera:['Zoals nu','Dichter op de held','Verder weg'],gevechten:['Zoals nu','Sneller, meer combo\'s','Rustiger, tactischer'],samen:['Co-op 1 tot 4','Grote open hub','Alleen solo']},FBS={};
function showConcept(){const o=$('concept');o.hidden=false;const was=S.paused;S.paused=true;for(const k in FB)if(FBS[k]==null)FBS[k]=0;
 o.innerHTML=`<div class="win wide" role="dialog" aria-label="Concept en feedback" lang="nl"><div class="rowx"><h3>Van demo naar echte game</h3><button class="chip" id="cClose">Sluiten</button></div>
 <p>Dit is een speelbare proef van hoe The Seven Crowns eruit kan zien als 3D-game. Jij keurt goed of stuurt bij. Pas daarna pas ik het toe op de hele game.</p>
 <h4>Wat je nu test</h4><ul><li>Arcanum als vrij te verkennen eiland, met zes helden en hun eigen aanval, skill en beweging.</li><li>Vijf orbs van je land, de zonsverduistering, Husks, een eindbaas en Transcendence met een eigen filmische explosie.</li><li>Echte schaduwen, HDR-gloed, zonnestralen, wind in gras, bladeren en mantels.</li><li>Drie grafische standen: Performance (tot 120 fps), Balanced en Cinematic 4K.</li><li>Samen spelen: iedereen die deze pagina tegelijk open heeft, loopt bij jou rond.</li></ul>
 <h4>Eerlijk over 4K en realisme</h4><p>Deze demo is volledig met code getekend en draait in de browser. Fotorealistische personages en werelden op consoleniveau vragen een game-engine zoals Unreal Engine 5 of Unity, met 3D-modellen van artiesten. 4K en 120 fps tegelijk halen telefoons nog niet: daar kies je tussen het mooiste beeld of de hoogste snelheid. Op pc en console kan 4K wel.</p>
 <h4>Route naar de echte game</h4><ul><li>Stap 1: jij keurt stijl, camera en gevechten goed in deze demo.</li><li>Stap 2: een eerste level in Unreal Engine 5 of Unity: Arcanum, één land, één dungeon, co-op.</li><li>Stap 3: verhaal, bonds, locker en alle 35 orbs uit de story-game overzetten.</li><li>Daarna: het ascension-pad. Helden worden goden van hun element, met de verzegelde elementen Void en Divine als eindspel.</li><li>Stap 4: uitbrengen op iPhone, Android en pc.</li></ul>
 <h4>Jouw feedback</h4>${Object.entries(FB).map(([k,v])=>`<p style="font-size:13px;color:var(--muted);text-transform:capitalize">${k}</p><div class="opt">${v.map((n,i)=>`<button class="${FBS[k]===i?'on':''}" data-fk="${k}" data-fi="${i}" aria-pressed="${FBS[k]===i}">${n}</button>`).join('')}</div>`).join('')}
 <textarea id="fbText" placeholder="Wat moet er anders? Bijvoorbeeld: meer landen, andere helden, grotere wereld…" aria-label="Je opmerkingen"></textarea>
 <button class="btn" id="fbCopy">Kopieer mijn feedback</button><p class="tiny" id="fbHint" style="text-align:left">Plak de tekst daarna in je chat met Claude.</p></div>`;
 $('fbText').value=FBS.text||'';$('fbText').oninput=()=>{FBS.text=$('fbText').value};$('cClose').onclick=()=>{o.hidden=true;S.paused=was&&!$('menu').hidden?true:(S.ended&&!$('endc').hidden)};
 o.querySelectorAll('[data-fk]').forEach(b=>b.onclick=()=>{FBS[b.dataset.fk]=+b.dataset.fi;const sc=o.querySelector('.win').scrollTop;showConcept();$('concept').querySelector('.win').scrollTop=sc});
 $('fbCopy').onclick=()=>{const t=`Feedback op de 3D-demo Seven Crowns Awakening:\n`+Object.keys(FB).map(k=>`- ${k}: ${FB[k][FBS[k]]}`).join('\n')+`\n- opmerkingen: ${(FBS.text||'geen').trim()}\n- gespeeld als ${HERO[S.hero].n}, stand ${R.Q.name}, ${R.rw}x${R.rh} op ${R.fps} fps`;
  const done=()=>{$('fbHint').textContent='Gekopieerd. Plak de tekst in je chat met Claude.'};const fall=()=>{const ta=$('fbText');ta.value=t;ta.focus();ta.select();$('fbHint').textContent='Kopiëren lukte niet automatisch. De tekst staat nu in het vak: selecteer en kopieer hem.'};
  try{navigator.clipboard.writeText(t).then(done,fall)}catch(e){fall()}}}
/* HUD */
let hudT=0;function hud(dt){$('hpb').style.transform=`scaleX(${clamp(S.hp/S.max,0,1)})`;const H=HERO[S.hero],a=clamp(S.cdA/H.atk.cd,0,1)*100,s=clamp(S.cdS/H.skill.cd,0,1)*100;$('cdA').style.height=$('cdA2').style.height=a+'%';$('cdS').style.height=$('cdS2').style.height=s+'%';
 if(S.boss&&!S.boss.dead)$('bossb').style.transform=`scaleX(${clamp(S.boss.hp/S.boss.max,0,1)})`;hudT-=dt;if(hudT<=0){hudT=.5;$('fps').textContent=`${R.fps} fps · ${R.rw}×${R.rh}${R.hz>61?' · '+R.hz+' Hz':''}${Net.n?' · '+(Net.n+1)+' players':''}`;
  if(S.state==='title')$('peersLine').textContent=Net.room?(Net.n?`${Net.n} other ${Net.n>1?'players are':'player is'} here right now.`:'Share this page: everyone who opens it appears in your world.'):''}}
/* main loop */
let lastT=0,rafT=0,fAcc=0,fN=0,minDt=99,minN=0,slow=0,lastDrop=0;
function frame(now){requestAnimationFrame(frame);const raw=now-rafT;rafT=now;if(raw>2&&raw<minDt)minDt=raw;if(++minN>90){const hz=1000/minDt;R.hz=[60,72,75,90,120,144,165,240].reduce((a,b)=>Math.abs(b-hz)<Math.abs(a-hz)?b:a);minDt=99;minN=0}
 const Q=R.Q;if(Q.cap&&R.hz>Q.cap*1.3&&now-lastT<1000/Q.cap-3)return;let dt=Math.min(.05,(now-lastT)/1000);if(!lastT)dt=.016;lastT=now;
 fAcc+=dt;fN++;if(fAcc>=1){R.fps=Math.round(fN/fAcc);fAcc=0;fN=0;const tgt=Q.cap?Math.min(Q.cap,R.hz):R.hz;
  if(Q.dyn&&!window.NO_DYN){if(R.fps<tgt*.86&&R.scale>.5){R.scale=Math.max(.5,R.scale-.12);lastDrop=now;setupRes()}else if(R.fps>=tgt*.96&&R.scale<1&&now-lastDrop>7000){R.scale=Math.min(1,R.scale+.06);lastDrop=now-3500;setupRes()}}
  if(R.mode==='cine'&&!window.NO_DYN){slow=R.fps<17?slow+1:0;if(slow>=5){slow=0;CFG.mode='bal';saveCfg();setMode('bal');R.modesUI&&R.modesUI();toast('Cinematic 4K is too heavy for this device. Switched to Balanced.')}}}
 step(dt,now)}
function step(dt,now){if(cv.clientWidth*Math.min(devicePixelRatio||1,R.Q.dpr)!==R.lastCW){R.lastCW=cv.clientWidth*Math.min(devicePixelRatio||1,R.Q.dpr);setupRes()}
 if(!S.paused){updateEnv(dt);pollKeys();if(S.state==='play'){update(dt);if(S.cine)cineCam(dt);else updateCam(dt)}
  else{const p=S.pl,t=E.t*.07;p.spd=0;p.atk=Math.max(0,p.atk-dt*2);p.cast=Math.max(0,p.cast-dt);const a=titleYaw()+Math.sin(t)*.5,wide=innerWidth>=900,dd=wide?4.2:5.4;C.pos=[p.pos[0]+Math.sin(a)*dd,p.pos[1]+1.5,p.pos[2]+Math.cos(a)*dd];const cr=[-Math.cos(a+Math.PI),0,Math.sin(a+Math.PI)];
   C.tgt=add([p.pos[0],p.pos[1]+(wide?1.05*p.sc:.15),p.pos[2]],mul(cr,wide?-1.1:0));C.fov=.8;update(0)}
  stepSubs(dt);netStep(dt,now)}
 beginFrame();drawScene(S.paused?0:dt);stepOverlay(dt);if(S.state==='play')hud(dt);else hud(dt)}
function boot(){const fail=m=>{$('loadt').textContent=m};if(!initGL()){fail('This device or browser does not support WebGL 2, which the 3D demo needs. Try a recent phone or Chrome, Safari or Edge on a computer.');return}
 try{makePrograms();buildWorld();const coarse=matchMedia('(pointer:coarse)').matches;if(coarse)document.body.classList.add('touch');if(!QP[CFG.mode])CFG.mode='bal';setMode(CFG.mode);startHero('ren');resetRun();buildTitle();bindInput();netInit();updateEnv(0);
  cv.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('The graphics context was lost. Reload the page to continue.');$('load').hidden=false});
  addEventListener('resize',()=>setupRes());$('title').hidden=false;$('load').hidden=true;requestAnimationFrame(frame)}catch(e){console.error(e);fail('The 3D world could not start on this device: '+(e&&e.message?e.message:e))}}
setTimeout(boot,60);
