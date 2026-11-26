/* ================= UI ================= */
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const val=v=>typeof v==='function'?v():v;
const ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
let b=null,menuTab='status',sel=null,zoom=1,itemsOpen=false,lastLines=[],sceneCounter=0;

/* ---------- narrator (the device's own British voice, tuned deep and slow) ---------- */
const Narr={ok:typeof window!=='undefined'&&'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined',voices:[],voice:null,speaking:false,q:[],
 init(){if(!this.ok)return;const load=()=>{try{this.voices=speechSynthesis.getVoices().filter(v=>/^en([-_]|$)/i.test(v.lang));this.pick()}catch(e){}};load();
  try{speechSynthesis.addEventListener('voiceschanged',load)}catch(e){try{speechSynthesis.onvoiceschanged=load}catch(_){}}},
 score(v){const n=v.name.toLowerCase(),l=v.lang.toLowerCase().replace('_','-');let s=0;if(l==='en-gb')s+=20;else if(l.startsWith('en'))s+=2;
  if(/arthur/.test(n))s+=30;if(/daniel/.test(n))s+=26;if(/uk english male/.test(n))s+=25;if(/ryan|thomas|george|oliver|alfie|harry|malcolm|reed|rocko/.test(n))s+=16;if(/grandpa/.test(n))s+=12;
  if(/enhanced|premium|natural|neural/.test(n))s+=8;if(/female|woman|kate|serena|martha|stephanie|fiona|moira|tessa|karen|samantha|hazel|susan|libby|sonia|maisie|grandma|flo|sandy|shelley|victoria|allison|ava|zira/.test(n))s-=40;return s},
 pick(){const w=ACC&&ACC.narr.voice;this.voice=(w&&this.voices.find(v=>v.voiceURI===w))||[...this.voices].sort((a,b)=>this.score(b)-this.score(a))[0]||null},
 clean(t){return String(t).replace(/<[^>]+>/g,'').replace(/[♥✦❖◉●■▶「」]/g,'').replace(/\s+/g,' ').trim()},
 read(lines){if(!this.ok)return;this.stop();let prev=null;const out=[];
  for(const raw of lines){const l=this.clean(raw);if(!l||l.startsWith('#'))continue;const m=l.match(/^@([^:]+):\s*([\s\S]*)$/);
   if(m){const who=m[1]==='You'?pname().split(' ')[0]:m[1].replace(/\(.*\)/,'').trim();out.push(who!==prev?`${who}. ${m[2]}`:m[2]);prev=who}else{out.push(l);prev=null}}
  if(!out.length)return;const N=ACC.narr;this.speaking=true;this.q=out.map((c,i)=>{const u=new SpeechSynthesisUtterance(c);if(this.voice){u.voice=this.voice;u.lang=this.voice.lang}else u.lang='en-GB';
   u.rate=N.rate;u.pitch=N.pitch;u.volume=1;if(i===out.length-1){u.onend=()=>{this.speaking=false;refreshRead()};u.onerror=u.onend}return u});
  try{this.q.forEach(u=>speechSynthesis.speak(u))}catch(e){this.speaking=false}refreshRead()},
 stop(){if(!this.ok)return;try{if(speechSynthesis.speaking||speechSynthesis.pending)speechSynthesis.cancel()}catch(e){}this.speaking=false;refreshRead()}};
function refreshRead(){const r=$('readb');if(r)r.textContent=Narr.speaking?'■ Stop':'▶ Read aloud'}

/* ---------- HUD & scenes ---------- */
function hud(){const alert=st.pts>0||st.sp>0;
 $('hud').innerHTML=`<div class="hn"><b>${esc(pname().split(' ')[0])}</b><span class="rk r${rank()}">${rank()}</span><span class="lv">Lv ${st.lv}</span></div>
 <div class="hb">${Narr.ok?`<button class="hbtn" id="hnarr" aria-label="Narrator ${ACC.narr.on?'on':'off'}">${ACC.narr.on?'🔊':'🔈'}</button>`:''}<button class="hbtn gem" id="hgem" aria-label="Store">💎 ${ACC.crowns.toLocaleString('en')}</button><button class="stbtn${alert?' alert':''}" id="stb">Menu${alert?' ●':''}</button></div>
 <div class="xpb"><i style="width:${Math.round(st.xp/xpNeed(st.lv)*100)}%"></i></div>`;
 $('stb').onclick=()=>openMenu(st.pts>0?'status':st.sp>0?'tree':menuTab==='store'||menuTab==='settings'?'status':menuTab);
 $('hgem').onclick=()=>openMenu('store');
 const hn=$('hnarr');if(hn)hn.onclick=()=>{ACC.narr.on=!ACC.narr.on;saveAcc();if(ACC.narr.on&&!b)Narr.read(lastLines);else Narr.stop();hud()}}
const hudSafe=()=>{if(st&&!$('app').hidden)hud()};
const SPK={Lyra:'lyra',Torvin:'torvin',Kaida:'kaida',Kael:'kael','Kael Ashford':'kael',Maren:'maren',Seraphine:'seraphine','Professor Vale':'vale',Nerissa:'nerissa',Pip:'pip','Captain Ysolde':'ysolde',Bramble:'bramble'};
function spkImg(name,me){try{if(me)return portrait(st.char,st.gear.look,st.gear.eq,40);if(name===R())return portrait('ren',st.char==='ren'?st.gear.look:null,null,40);const id=SPK[name];return id&&id!==st.char?portrait(id,null,null,40):''}catch(e){return''}}
function line(l){
 if(l.startsWith('#'))return`<div class="sys">${esc(l.slice(1))}</div>`;
 const m=l.match(/^@([^:]+):\s*([\s\S]*)$/);
 if(m){const me=m[1]==='You';const who=me?pname().split(' ')[0]:m[1];const img=spkImg(m[1],me);return`<div class="dlg${me?' me':''}${img?' pic':''}">${img?`<img class="pf" src="${img}" alt="">`:''}<div><span class="who">${esc(who)}</span><p>${m[2]}</p></div></div>`}
 return`<p>${l}</p>`}
function go(id){
 const sc=SCN[id];if(!sc){console.error('missing scene',id);return}
 st.sc=id;if(sc.enter)sc.enter();if(sc.codex)codex(sc.codex);
 setScene(sc.bg);$('chapter').textContent=val(sc.ch);
 const msgs=MSG.splice(0);const lines=sc.txt().filter(x=>x!==''&&x!=null);lastLines=[val(sc.h),...lines];
 let h=`<div class="fade">`;
 if(msgs.length)h+=`<div class="sysbox"><div class="syshead">SYSTEM</div>${msgs.map(m=>`<div>${esc(m)}</div>`).join('')}</div>`;
 h+=`<div class="scenehead"><h2>${esc(val(sc.h))}</h2>${Narr.ok?`<button class="readbtn" id="readb">${Narr.speaking?'■ Stop':'▶ Read aloud'}</button>`:''}</div>${lines.map(line).join('')}`;
 if(sc.end){h+=`<div class="endgrid"><div><small>Level</small><b>${st.lv} · Rank ${rank()}</b></div><div><small>Class</small><b>${st.cls!=null?CHARS[st.char].classes[st.cls][0]:'—'}</b></div>
  <div><small>Romance</small><b>${st.romance?cnm(st.romance)+' ♥':'—'}</b></div><div><small>Skills</small><b>${st.skills.length}</b></div>
  <div><small>Codex</small><b>${st.codex.filter(c=>!c.startsWith('leg_')).length}/${Object.keys(CODEX).filter(c=>!c.startsWith('leg_')).length}</b></div><div><small>Titles</small><b>${st.titles.length}</b></div></div>
  <div class="choices"><button class="choice" id="endMenu">Return to your lives<small>Start a new life, or play another character's story</small></button></div></div>`;
  card(h);$('endMenu').onclick=()=>{Narr.stop();st=null;showTitle()};save();hud();if(ACC.narr.on)Narr.read(lastLines);showRewards();return}
 const cs=val(sc.c);
 h+=`<div class="choices">`+cs.map((c,i)=>{const ok=!c.req||c.req();const t=val(c.t),s=ok?val(c.s):(val(c.lock)||val(c.s));
  return`<button class="choice${c.fight?' fight':''}${c.heart?' heart':''}" data-i="${i}" ${ok?'':'disabled'}>${c.fight?'<span class="sw">⚔</span>':''}${esc(t)}${s?`<small>${ok?'':'🔒 '}${esc(s)}</small>`:''}</button>`}).join('')+`</div></div>`;
 card(h);save();hud();
 const rb=$('readb');if(rb)rb.onclick=()=>{if(Narr.speaking)Narr.stop();else Narr.read(lastLines)};
 if(ACC.narr.on)Narr.read(lastLines);
 showRewards();
 document.querySelectorAll('#card .choice').forEach(btn=>btn.onclick=async()=>{
  const c=cs[+btn.dataset.i];Narr.stop();c.fx&&c.fx();const to=()=>val(c.to);
  if(c.fight){startBattle(c.fight,()=>go(to()),c.with);return}
  sceneCounter++;if(!ACC.noAds&&sceneCounter%ADS.every===0)await Monet.interstitial();
  go(to())});
}
function card(h){const c=$('card');c.innerHTML=h;c.scrollTop=0}

/* ---------- battle ---------- */
const ASSIST={ren:'hurls a spinning stone',lyra:'looses a glowing arrow',torvin:'swings his clan hammer',kaida:'throws a bolt of lightning',kael:'blasts it with dragonfire',ember:'breathes a gout of flame',vex:'cuts in with a thunder rail',nerissa:'drives a spear of tidewater through it',pip:'flashes a blinding prism'};
function startBattle(eid,onWin,withAlly){const E=EN[eid],D=derived(),easy=st.diff==='story';Narr.stop();
 b={eid,onWin,D,aw:null,awUsed:false,orbUsed:{},drop:null,with:withAlly||null,e:{...E,max:Math.round(E.hp*(easy?.65:1)),atk:E.atk*(easy?.8:1),stun:0,weakT:0,weakA:0},hp:D.hp,mp:D.mp,sh:0,buff:0,evade:0,counter:0,turn:1,over:null,legendUsed:false,revived:false,adRevived:false,emberT:0,assisted:null,
  log:[`<b>${E.n}</b> blocks your path. <i>${E.d}</i>`]};b.e.hp=b.e.max;itemsOpen=false;renderBattle()}
const pct=(a,m)=>Math.max(0,Math.min(100,a/m*100));
function chips(e){return(e.weak||[]).map(x=>`<span class="tag wk">weak: ${ELEM[x].n}</span>`).join('')+(e.res||[]).map(x=>`<span class="tag rs">resists: ${ELEM[x].n}</span>`).join('')}
function helper(){if(b.with)return b.with;if(!b.e.allies)return null;const p=partnerId();if(EN[b.eid].teamOnly&&!others().includes(p))return F.first&&others().includes(F.first)?F.first:others()[0];return p}
function renderBattle(){const e=b.e,D=b.D,hp=helper();
 let h=`<div class="bt"><div class="foe"><div class="row"><b class="fname">${e.n}</b><span>${e.stun?'<span class="tag st">pinned</span> ':''}${e.weakT?'<span class="tag st">weakened</span>':''}</span></div>
 <div class="bar big"><i class="ehp" style="width:${pct(e.hp,e.max)}%"></i></div><div class="row sm"><span>${Math.max(0,e.hp)} / ${e.max} HP</span><span>${chips(e)}</span></div></div>
 ${hp?`<div class="ally">${st.romance===hp?'♥':'⚔'} ${esc(cnm(hp))} fights beside you${st.brank[hp]?` · Bond Rank ${ROMAN[st.brank[hp]-1]}`:''}</div>`:''}
 <div class="log">${b.log.slice(-5).map(l=>`<div>${l}</div>`).join('')}</div>
 <div class="mebars"><div><div class="row sm"><span>HP</span><span>${Math.max(0,Math.round(b.hp))} / ${D.hp}${b.sh?` · 🛡 ${Math.round(b.sh)}`:''}</span></div><div class="bar"><i class="php" style="width:${pct(b.hp,D.hp)}%"></i></div></div>
 <div><div class="row sm"><span>MP</span><span>${Math.round(b.mp)} / ${D.mp}${b.buff?' · ⚡':''}${b.emberT?' · 🔥':''}${b.evade?' · 💨':''}</span></div><div class="bar"><i class="pmp" style="width:${pct(b.mp,D.mp)}%"></i></div></div></div>`;
 if(b.over==='win'){const E=EN[b.eid];h+=`<div class="result win"><h3>Victory</h3><p>+${E.xp} XP · +${Math.round(E.xp*.6)} Gold${hp?` · ${esc(cnm(hp))} bond +1`:''}${b.drop?`<br><span style="color:${RAR[IT[b.drop].rar][1]}">Drop: ${IT[b.drop].n}</span>`:''}</p><button class="choice" id="bcont">Continue</button></div>`}
 else if(b.over==='lose')h+=`<div class="result lose"><h3>Defeated</h3><p>Spend your points in the Tree of Life, change your loadout, or Guard before the enemy's big attacks.</p>
  <button class="choice" id="bretry">Try again</button>${!b.adRevived&&adsLeftToday()>0?'<button class="choice" id="bad">▶ Watch an ad to get back up<small>Revive with 50% HP · test ad</small></button>':''}${st.diff!=='story'?'<button class="choice" id="beasy">Try again in Story mode<small>Weaker enemies for the rest of this life</small></button>':''}</div>`;
 else if(itemsOpen){h+=`<div class="acts">`+['draught','ether','ember'].map(k=>`<button class="act basic" data-a="use:${k}" ${(st.inv[k]||0)>0?'':'disabled'}><b>${STORE.items[k][0]}</b><small>${STORE.items[k][1]} · ×${st.inv[k]||0}</small></button>`).join('')+
  `<button class="act basic" data-a="items"><b>Back</b><small>${(st.inv.phoenix||0)?`Phoenix Feathers: ${st.inv.phoenix} (automatic)`:'Buy more in the Store'}</small></button></div>`}
 else{const leg=st.pact&&ACC.pacts.includes(st.pact)&&!b.legendUsed?LEG[st.pact]:null;
  h+=`<div class="acts">`+st.equip.map(id=>{const s=SK[id];const cost=s.mp||0;return`<button class="act" data-a="${id}" ${b.mp<cost?'disabled':''} style="--ec:${ELEM[s.el].c}"><b>${s.n}</b><small>${cost} MP · ${s.pow?(s.hits?s.pow+'×'+s.hits:s.pow)+' pow':s.heal?'heal '+s.heal:s.shield?'shield '+s.shield:'buff'}</small></button>`}).join('')+
  `<button class="act basic" data-a="strike"><b>Strike</b><small>Physical · 0 MP</small></button><button class="act basic" data-a="guard"><b>Guard</b><small>Shield + 5 MP</small></button><button class="act basic" data-a="focus"><b>Focus</b><small>Restore 30% MP</small></button>
  <button class="act basic" data-a="items"><b>Items</b><small>${['draught','ether','ember'].reduce((a,k)=>a+(st.inv[k]||0),0)} in your bag</small></button>
  ${leg?`<button class="act legend" data-a="legend" style="--ec:${ELEM[leg.el].c}"><b>✦ ${leg.sum.n}</b><small>${leg.n} · once per battle</small></button>`:''}${specials()}</div>`}
 card(h+`</div>`);
 if(b.over==='win')$('bcont').onclick=()=>{const E=EN[b.eid];xp(E.xp);gold(Math.round(E.xp*.6));if(b.drop)grant(b.drop);if(b.assisted){st.fought[b.assisted]=(st.fought[b.assisted]||0)+1;bond(b.assisted,1)}const f=b.onWin;b=null;f()};
 else if(b.over==='lose'){$('bretry').onclick=()=>startBattle(b.eid,b.onWin,b.with);const ez=$('beasy');if(ez)ez.onclick=()=>{st.diff='story';save();startBattle(b.eid,b.onWin,b.with)};
  const ad=$('bad');if(ad)ad.onclick=()=>Monet.rewarded().then(ok=>{if(!ok||!b)return;countAd();b.adRevived=true;b.over=null;b.hp=Math.round(b.D.hp*.5);b.log.push('<em>You get back up with half your HP.</em>');renderBattle()})}
 else document.querySelectorAll('.act').forEach(x=>x.onclick=()=>act(x.dataset.a));}
function hitCalc(s,pow){const D=b.D,B=D.B,e=b.e;let a,elb,els;const boost=(b.buff?1.4:1)*(b.emberT?1.5:1)*(1+(D.atk||0)/100)*(b.aw?1+(b.aw.dmg||0):1);const critC=D.crit+(b.aw&&b.aw.crit||0);
 if(s==='strike'){let d=(6+D.S.str*1.6+st.lv+(D.atk||0))*boost;const c=Math.random()*100<critC;if(c)d*=1.6;return[Math.max(1,Math.round(d-e.def)),c,1]}
 if(s.el==='fusion'){els=s.els;a=(st.aff[els[0]]+st.aff[els[1]])/2;elb=Math.max(...els.map(x=>B.el[x]||0))}
 else if(s.el==='class'||s.el==='bond'){els=[primary()];a=st.aff[els[0]];elb=B.el[els[0]]||0}
 else{els=[s.el];a=st.aff[s.el]??st.aff.gravity??40;elb=B.el[s.el]||0}
 let d=pow*(1+D.S.ctrl*.07+st.lv*.04)*(.4+.6*a/100)*(1+B.dmg+elb)*boost;
 let mult=1;if(els.some(x=>(e.weak||[]).includes(x)))mult=1.5;else if(els.some(x=>(e.res||[]).includes(x)))mult=.6;d*=mult;
 const c=Math.random()*100<critC;if(c)d*=1.6;if(!s.pierce)d-=e.def;return[Math.max(1,Math.round(d)),c,mult]}
function assist(L){const e=b.e,who=helper();if(!who||e.hp<=0)return;b.assisted=who;
 const r=st.brank[who]||0;const d=Math.round((8+st.lv*2.5)*(1+.12*r)*(st.romance===who?1.15:1)*(st.diff==='story'?1.3:1)*(.8+Math.random()*.4));
 e.hp-=d;L.push(`${esc(cnm(who))} ${ASSIST[who]}: <b>${d}</b>.`);
 if(e.allies&&!b.with&&e.hp>0&&Math.random()<.35){const pool=others().concat(F.kaelFriend?['kael']:[]).filter(x=>x!==who);if(F.ember&&b.eid==='horde'||F.ember&&b.eid==='vale')pool.push('ember');if(F.vexAlly&&b.eid==='horde')pool.push('vex');
  const w=pool[Math.floor(Math.random()*pool.length)];if(w){const d2=Math.round((6+st.lv*2)*(.8+Math.random()*.4));e.hp-=d2;L.push(`${w==='ember'?'Ember':w==='vex'?'Vex':esc(cnm(w))} ${ASSIST[w]}: <b>${d2}</b>.`)}}}
function act(a){if(b.over)return;const e=b.e,D=b.D,L=[];
 if(a==='items'){itemsOpen=!itemsOpen;renderBattle();return}
 if(a.startsWith('use:')){const k=a.slice(4);if(!((st.inv[k]||0)>0))return;st.inv[k]--;itemsOpen=false;
  if(k==='draught'){const hl=Math.round(D.hp*.5);b.hp=Math.min(D.hp,b.hp+hl);L.push(`You drink a Healing Draught: +${hl} HP.`)}
  else if(k==='ether'){const m=Math.round(D.mp*.6);b.mp=Math.min(D.mp,b.mp+m);L.push(`Mana Ether: +${m} MP.`)}
  else if(k==='ember'){b.emberT=3;L.push(`🔥 Dragon's Ember: +50% damage for 3 turns.`)}save()}
 else if(a==='legend'){const l=LEG[st.pact],sm=l.sum;b.legendUsed=true;L.push(`<span style="color:${ELEM.legend.c}">✦ ${l.n} answers your call: ${sm.n}!</span>`);
  if(sm.pow){let tot=0;for(let i=0;i<(sm.hits||1);i++){let d=sm.pow*(1+st.lv*.05)*(1+D.B.dmg)*(b.emberT?1.5:1);if((e.weak||[]).includes(l.el))d*=1.5;else if((e.res||[]).includes(l.el))d*=.6;if(!sm.pierce)d-=e.def;tot+=Math.max(1,Math.round(d))}
   e.hp-=tot;L.push(`It deals <b>${tot}</b>.`);if(sm.stun&&e.hp>0&&Math.random()<sm.stun){e.stun=1;L.push(`<em>${e.n} is pinned!</em>`)}}
  if(sm.healPct){const hl=Math.round(D.hp*sm.healPct);b.hp=Math.min(D.hp,b.hp+hl);L.push(`Healed <b>${hl}</b> HP.`)}
  if(sm.shield){b.sh+=sm.shield;L.push(`🛡 +${sm.shield} barrier.`)}if(sm.evade)b.evade=1}
 else if(a==='wawake'){const w=IT[st.gear.eq.weapon];if(!w||!w.pw||b.awUsed)return;b.awUsed=true;b.aw=Object.assign({t:3},w.pw);L.push(`<span style="color:${RAR[w.rar][1]}">⚡ ${w.n} awakens: ${w.pw.n}!</span> ${w.pw.d}`)}
 else if(a.startsWith('orb:')){const O=ORBS[a.slice(4)];if(!O||b.orbUsed[O.id]||!st.gear.orbEq.includes(O.id))return;const A=O.art;b.orbUsed[O.id]=true;L.push(`<span style="color:${O.c[0]}">◈ ${O.n}: ${A.n}!</span>`);
  if(A.pow){let tot=0;for(let i=0;i<(A.hits||1);i++){let d=A.pow*(1+st.lv*.05)*(1+D.B.dmg+(D.B.el[O.el]||0))*(1+(D.atk||0)/100)*(b.aw?1+(b.aw.dmg||0):1);if((e.weak||[]).includes(O.el))d*=1.5;else if((e.res||[]).includes(O.el))d*=.6;if(!A.pierce)d-=e.def;tot+=Math.max(1,Math.round(d))}e.hp-=tot;L.push(`It deals <b>${tot}</b>.`);
   if(A.drain){const hl=Math.round(tot*.6);b.hp=Math.min(D.hp,b.hp+hl);L.push(`You drain <b>${hl}</b> HP.`)}if(A.stun&&e.hp>0&&Math.random()<A.stun){e.stun=1;L.push(`<em>${e.n} is pinned!</em>`)}}
  if(A.healPct){const hl=Math.round(D.hp*A.healPct);b.hp=Math.min(D.hp,b.hp+hl);L.push(`Healed <b>${hl}</b> HP.`)}if(A.shield){b.sh+=A.shield;L.push(`🛡 +${A.shield} barrier.`)}
  if(A.buff){b.buff=3;L.push('⚡ Damage +40% for 2 turns.')}if(A.weaken){e.weakT=2;e.weakA=A.weaken;L.push(`${e.n}'s attack is weakened.`)}if(A.evade)b.evade=1}
 else if(a==='strike'){const[d,c]=hitCalc('strike');e.hp-=d;L.push(`You strike for <b>${d}</b>${c?' <em>CRIT!</em>':''}.`);if(b.aw&&b.aw.drain){const hl=Math.round(d*b.aw.drain);b.hp=Math.min(D.hp,b.hp+hl)}}
 else if(a==='guard'){const s=Math.round(10+D.S.spi*2);b.sh+=s;b.mp=Math.min(D.mp,b.mp+5);L.push(`You brace yourself. 🛡 +${s}.`)}
 else if(a==='focus'){const m=Math.round(D.mp*.3);b.mp=Math.min(D.mp,b.mp+m);L.push(`You focus your core. +${m} MP.`)}
 else{const s=SK[a];if(!s)return;b.mp-=s.mp||0;let total=0,crit=false,mult=1;
  if(s.pow){for(let i=0;i<(s.hits||1);i++){const[d,c,m]=hitCalc(s,s.pow);total+=d;crit=crit||c;mult=m}e.hp-=total;
   L.push(`<span style="color:${ELEM[s.el].c}">${s.n}</span> deals <b>${total}</b>${s.hits?` (${s.hits} hits)`:''}${crit?' <em>CRIT!</em>':''}${mult>1?' · <em>super effective</em>':mult<1?' · resisted':''}.`);
   if(s.drain){const hl=Math.round(total*.6);b.hp=Math.min(D.hp,b.hp+hl);L.push(`You drain <b>${hl}</b> HP.`)}if(b.aw&&b.aw.drain){const hl=Math.round(total*b.aw.drain);b.hp=Math.min(D.hp,b.hp+hl);L.push(`The Hollow Crown drinks <b>${hl}</b> HP for you.`)}}
  else L.push(`You use <span style="color:${ELEM[s.el].c}">${s.n}</span>.`);
  if(s.heal){const hl=Math.round(s.heal*(1+D.S.spi*.05)*(1+D.B.heal));b.hp=Math.min(D.hp,b.hp+hl);L.push(`Healed <b>${hl}</b> HP.`)}
  if(s.shield){const sh=Math.round(s.shield*(1+D.S.spi*.04));b.sh+=sh;L.push(`🛡 +${sh} barrier.`)}
  if(s.counter){b.counter=s.counter;L.push('The next hit will be reflected.')}
  if(s.evade)b.evade=1;if(s.buff){b.buff=3;L.push('⚡ Damage +40% for 2 turns.')}
  if(s.weaken){e.weakT=2;e.weakA=s.weaken;L.push(`${e.n}'s attack is weakened.`)}
  if(s.stun&&e.hp>0&&Math.random()<s.stun){e.stun=1;L.push(`<em>${e.n} is pinned!</em>`)}}
 assist(L);
 if(e.hp<=0){winBattle(L);return}
 if(e.stun){e.stun=0;L.push(`${e.n} is pinned and can't move.`)}
 else{const heavy=b.turn%3===0;let d=Math.max(1,Math.round(e.atk*(.85+Math.random()*.3)*(heavy?1.7:1)*(e.weakT?1-e.weakA:1)*(b.aw&&b.aw.weak?1-b.aw.weak:1)*(1-Math.min(.7,D.dr+(b.aw&&b.aw.dr||0))))-(D.def||0));const name=heavy?`<b>${e.heavy}</b>`:'an attack';
  if(b.evade||Math.random()*100<D.dodge+(b.aw&&b.aw.dodge||0))L.push(`${e.n} uses ${name}. You dodge!`);
  else{if(b.counter){const r=Math.round(d*b.counter);e.hp-=r;L.push(`Reflected <b>${r}</b> damage!`);b.counter=0}
   const ab=Math.min(b.sh,d);b.sh-=ab;b.hp-=d-ab;L.push(`${e.n} uses ${name}: <b>${d-ab}</b> damage${ab?` (🛡 absorbed ${ab})`:''}.`)}
  b.evade=0}
 if(e.weakT)e.weakT--;if(b.buff)b.buff--;if(b.emberT)b.emberT--;
 if(b.aw){if(b.aw.heal){const hl=Math.round(D.hp*b.aw.heal);b.hp=Math.min(D.hp,b.hp+hl);L.push(`${b.aw.n} restores <b>${hl}</b> HP.`)}b.aw.t--;if(b.aw.t<=0){L.push(`${b.aw.n} fades.`);b.aw=null}}
 if(e.hp<=0){winBattle(L);return}
 if(b.hp<=0){if((st.inv.phoenix||0)>0&&!b.revived){st.inv.phoenix--;b.revived=true;b.hp=Math.round(D.hp*.5);L.push(`<em>🔥 A Phoenix Feather burns. You rise again with ${b.hp} HP!</em>`);save()}
  else{b.hp=0;b.over='lose';b.log.push(...L,'<b>You fall.</b>');renderBattle();return}}
 b.mp=Math.min(D.mp,b.mp+3+D.B.regen);b.turn++;
 if(b.turn%3===0)L.push(`<em>⚠ ${e.n} is gathering power for ${e.heavy}! Guard or shield up.</em>`);
 b.log.push(...L);renderBattle()}

/* ---------- menu ---------- */
const TABS=[['status','Status'],['locker','Locker'],['tree','Tree'],['bonds','Bonds'],['codex','Codex'],['store','Store'],['settings','Settings']];
function openMenu(tab){if(tab)menuTab=tab;if(!st&&!['store','settings'].includes(menuTab))menuTab='store';$('menu').hidden=false;renderMenu(true)}
function closeMenu(){$('menu').hidden=true;if(st&&!$('app').hidden){hud();if(b&&!b.over){b.D=derived();renderBattle()}}}
function bar(lab,v,col,max=100,right){return`<div class="row sm"><span>${lab}</span><span>${right??v+'%'}</span></div><div class="bar"><i style="width:${pct(v,max)}%;background:${col}"></i></div>`}
function renderMenu(fresh){const ms=document.querySelector('#menu .mscroll'),top=!fresh&&ms?ms.scrollTop:0;const tb=$('treebox'),tl=tb?tb.scrollLeft:null;
 const tabs=TABS.filter(([t])=>st||t==='store'||t==='settings').map(([t,n])=>`<button class="tab${menuTab===t?' on':''}" data-t="${t}">${n}${t==='tree'&&st&&st.sp?` (${st.sp})`:''}${t==='status'&&st&&st.pts?' ●':''}</button>`).join('');
 const body=({status:statusTab,locker:lockerTab,tree:treeTab,bonds:bondsTab,codex:codexTab,store:storeTab,settings:settingsTab})[menuTab]();
 $('menuBody').innerHTML=`<div class="mtop"><div class="tabs">${tabs}</div><button class="mini" id="mclose">Close</button></div><div class="mscroll">${body}</div>`;
 const ms2=document.querySelector('#menu .mscroll');if(ms2)ms2.scrollTop=top;const tb2=$('treebox');if(tb2){if(tl!=null&&!fresh)tb2.scrollLeft=tl;else tb2.scrollLeft=(tb2.scrollWidth-tb2.clientWidth)/2}
 wireMenu();if(menuTab==='locker'){wireLocker();drawMenuArt()}}
function statusTab(){const D=derived(),C=CHARS[st.char];
 return`<div class="win"><div class="whead"><div><div class="big">${esc(pname())}</div><div class="mut">${C.race} · ${C.nation} · Life ${ROMAN[(st.life||1)-1]||st.life}</div></div><div class="rkbig r${rank()}">${rank()}</div></div>
  <div class="row sm"><span>Level ${st.lv}</span><span>${st.xp} / ${xpNeed(st.lv)} XP</span></div><div class="bar"><i style="width:${pct(st.xp,xpNeed(st.lv))}%;background:var(--gold)"></i></div>
  <div class="kv"><span>Awakening</span><b>${AWAKEN[st.awaken]}</b></div>
  <div class="kv"><span>Trait</span><b>${st.trait?C.traits.find(x=>x[0]===st.trait)[1]:'Unlocks at Awakening I'}</b></div>
  <div class="kv"><span>Class</span><b>${st.cls!=null?C.classes[st.cls][0]:'Unlocks at Awakening II'}</b></div>
  <div class="kv"><span>Wallet</span><b>🪙 ${st.gold.toLocaleString('en')} · 💎 ${ACC.crowns.toLocaleString('en')}</b></div>
  ${st.romance?`<div class="kv"><span>Romance</span><b class="love">♥ ${esc(cnm(st.romance))}</b></div>`:''}
  ${st.titles.length?`<div class="titles">${st.titles.map(t=>`<span class="tag ti">「${esc(t)}」</span>`).join('')}</div>`:''}</div>
  <h4>Affinity</h4>${Object.entries(st.aff).filter(([k])=>k!=='void'||F.void).map(([k,v])=>bar(ELEM[k].n,v,ELEM[k].c)).join('')}
  <h4>Stats ${st.pts?`<span class="pts">${st.pts} points to spend</span>`:''}</h4>
  ${[['str','Strength','Physical damage, HP'],['agi','Agility','Crit and dodge'],['mana','Mana','MP pool'],['ctrl','Control','Skill damage'],['spi','Spirit','HP, healing, defense']].map(([k,n,d])=>`<div class="stat"><div><b>${n}</b><small>${d}</small></div><span class="sv">${st.stats[k]}${D.B[k]?`<em>+${D.B[k]}</em>`:''}</span><button class="plus" data-s="${k}" ${st.pts?'':'disabled'} aria-label="Add a point to ${n}">+</button></div>`).join('')}
  <h4>Combat</h4><div class="dgrid"><div><small>HP</small><b>${D.hp}</b></div><div><small>MP</small><b>${D.mp}</b></div><div><small>Crit</small><b>${D.crit}%</b></div><div><small>Dodge</small><b>${D.dodge}%</b></div><div><small>Defense</small><b>${Math.round(D.dr*100)}%</b></div><div><small>MP regen</small><b>${3+D.B.regen}/turn</b></div></div>`}

/* --- the golden Tree of Life --- */
function crPath(p){let d=`M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;for(let i=0;i<p.length-1;i++){const p0=p[i-1]||p[i],p1=p[i],p2=p[i+1],p3=p[i+2]||p2;
 d+=` C${(p1[0]+(p2[0]-p0[0])/6).toFixed(1)},${(p1[1]+(p2[1]-p0[1])/6).toFixed(1)} ${(p2[0]-(p3[0]-p1[0])/6).toFixed(1)},${(p2[1]-(p3[1]-p1[1])/6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`}return d}
const isTreeNode=id=>id.startsWith('r_')||id.startsWith('a_');
const owns=id=>isTreeNode(id)?st.tree.includes(id):st.skills.includes(id);
const avail=id=>isTreeNode(id)?treeCan(id)[0]:SK[id]?canLearn(id)[0]:false;
function treeModel(){const Wd=600,X=300,RH=64,XS=[84,146,208,268];
 const els=Object.keys(st.aff).filter(e=>e!=='void').sort((a,b)=>st.aff[b]-st.aff[a]);if(F.void)els.push('void');
 const rowsFor=el=>{if(el==='void')return[['void','Hollow Path',Object.values(SK).filter(s=>s.br==='void').sort((a,b)=>a.t-b.t).map(s=>s.id)]];
  const rs=BR[el].filter(r=>r[0]!=='void').map(([id,n])=>[id,n,Object.values(SK).filter(s=>s.el===el&&s.br===id).sort((a,b)=>a.t-b.t).map(s=>s.id)]);
  rs.push(['att','Attunement',[1,2,3].map(i=>`a_${el}_${i}`)]);return rs};
 const brs=els.map((el,i)=>({el,side:i%2?1:-1,level:Math.floor(i/2),rows:rowsFor(el)}));
 const nLv=Math.ceil(brs.length/2),lvH=[];for(let L=0;L<nLv;L++)lvH[L]=Math.max(...brs.filter(x=>x.level===L).map(x=>x.rows.length))*RH+62;
 const crownH=212,baseY=crownH+lvH.reduce((a,c)=>a+c,0)+30,H=baseY+285;
 const nodes=[],twigs=[],labels=[];let yb=baseY-24;
 for(let L=0;L<nLv;L++){for(const br of brs.filter(x=>x.level===L)){
   br.rows.forEach((row,ri)=>{const ry=yb-30-ri*RH;const pts=[[X+br.side*12,ry+22]];
    row[2].forEach((id,ti)=>{const dx=XS[ti],x=X+br.side*dx,y=ry-Math.pow(dx/268,1.5)*20;pts.push([x,y]);nodes.push({id,x,y,el:br.el,kind:isTreeNode(id)?'att':'skill'})});
    twigs.push({pts,ids:row[2],side:br.side})});
   labels.push({x:X+br.side*176,y:yb-30-(br.rows.length-1)*RH-40,el:br.el})}
  yb-=lvH[L]}
 const cls=st.skills.find(s=>SK[s].el==='class');const crown=[{id:cls||'__class',x:X,y:96,kind:'class',el:'class'}];
 const fus=Object.values(SK).filter(s=>s.el==='fusion'&&s.els.every(e=>st.aff[e]!==undefined));const fx=[-92,92,-172,172,-240,240];
 fus.forEach((s,i)=>crown.push({id:s.id,x:X+fx[i],y:150+(i>1?18:0)+(i>3?14:0),kind:'fusion',el:'fusion'}));
 const rings=[0,1,2,3].map(k=>({id:'__aw'+k,x:X,y:baseY-(baseY-crownH+18)*(k/3.4),k}));
 const roots=[],ang=[-70,-35,0,35,70];
 ROOTS.forEach((r,i)=>{const a=ang[i]*Math.PI/180;[95,165,235].forEach((d,j)=>roots.push({id:`r_${r[0]}_${j+1}`,x:X+d*Math.sin(a),y:baseY+12+d*Math.cos(a)*.86,ri:i}))});
 return{Wd,H,X,baseY,crownH,nodes,twigs,labels,crown,rings,roots,ang}}
function nodeSVG(n){const id=n.id;let state,shape,glyph;
 if(n.k!==undefined){const reached=n.k===0||n.k<=st.awaken;state=reached?'own':'lock';shape=`<circle class="nb" r="13"/>`;glyph=n.k===0?'◆':ROMAN[n.k-1]}
 else if(id==='__class'){state='lock';shape=`<polygon class="nb" points="${starPts(24,11)}"/>`;glyph='♛'}
 else{state=owns(id)?'own':avail(id)?'can':'lock';
  if(n.kind==='class')shape=`<polygon class="nb" points="${starPts(25,12)}"/>`;
  else if(n.kind==='fusion')shape=`<polygon class="nb" points="${hexPts(18)}"/>`;
  else if(isTreeNode(id))shape=`<circle class="nb" r="12"/>`;
  else if(SK[id].type==='p')shape=`<rect class="nb" x="-13" y="-13" width="26" height="26" rx="3" transform="rotate(45)"/>`;
  else shape=`<circle class="nb" r="17"/>`;
  glyph=isTreeNode(id)?'+':ELEMG[SK[id].el]||'•'}
 const fs=n.k!==undefined?(n.k===0?11:10):isTreeNode(id)?15:n.kind==='class'?17:14;
 return`<g class="tn ${state}${sel===id?' sel':''}" data-n="${id}" transform="translate(${n.x.toFixed(1)},${n.y.toFixed(1)})" tabindex="0" role="button" aria-label="${esc(nodeName(id))}">
 <circle r="28" fill="transparent"/>${sel===id?'<circle r="25" class="selring"/>':''}${shape}<text class="tg" y="${(fs*.36).toFixed(1)}" font-size="${fs}" text-anchor="middle">${glyph}</text></g>`}
function starPts(R,r){let p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r:R;p.push(`${(Math.cos(a)*rr).toFixed(1)},${(Math.sin(a)*rr).toFixed(1)}`)}return p.join(' ')}
function hexPts(R){let p=[];for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;p.push(`${(Math.cos(a)*R).toFixed(1)},${(Math.sin(a)*R).toFixed(1)}`)}return p.join(' ')}
function nodeName(id){if(id.startsWith('__aw'))return+id.slice(4)===0?'Core':AWAKEN[+id.slice(4)];if(id==='__class')return'Crown: Class Evolution';if(isTreeNode(id))return treeDef(id).name;return SK[id].n}
function treeSVG(){const M=treeModel(),{Wd,H,X,baseY,crownH}=M;const rr=rnd(9);
 let s=`<svg viewBox="0 0 ${Wd} ${H}" class="tree" style="width:${zoom*100}%" aria-label="Tree of Life"><defs>
 <radialGradient id="tgBg" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#2b1d07"/><stop offset=".55" stop-color="#140d04"/><stop offset="1" stop-color="#070502"/></radialGradient>
 <linearGradient id="tgTrunk" x1="0" x2="1"><stop offset="0" stop-color="#5e461a"/><stop offset=".42" stop-color="#f3d27a"/><stop offset=".62" stop-color="#d4a648"/><stop offset="1" stop-color="#523c14"/></linearGradient>
 <radialGradient id="tgNode" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff7da"/><stop offset=".55" stop-color="#f0c75e"/><stop offset="1" stop-color="#9a7022"/></radialGradient>
 <filter id="tgGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
 <rect width="${Wd}" height="${H}" fill="url(#tgBg)"/><circle cx="${X}" cy="100" r="170" fill="#f3d27a" opacity=".05"/><circle cx="${X}" cy="100" r="90" fill="#f3d27a" opacity=".07"/>`;
 for(let i=0;i<80;i++)s+=`<circle cx="${(rr()*Wd).toFixed(1)}" cy="${(rr()*H).toFixed(1)}" r="${(rr()*1.3+.3).toFixed(2)}" fill="#f6dc94" opacity="${(rr()*.45+.08).toFixed(2)}"/>`;
 // roots
 ROOTS.forEach((r,i)=>{const pts=[[X,baseY+6],...M.roots.filter(n=>n.ri===i).map(n=>[n.x,n.y])];const a=M.ang[i]*Math.PI/180;pts.push([X+268*Math.sin(a),baseY+12+268*Math.cos(a)*.86]);
  s+=`<path d="${crPath(pts)}" fill="none" stroke="#8a6a2a" stroke-width="7" stroke-linecap="round" opacity=".85"/><path d="${crPath(pts)}" fill="none" stroke="#e8c36a" stroke-width="2" stroke-linecap="round" opacity=".55"/>`;
  const own=M.roots.filter(n=>n.ri===i&&st.tree.includes(n.id)).length;if(own)s+=`<path d="${crPath(pts.slice(0,own+1))}" fill="none" stroke="#ffe39a" stroke-width="3.5" stroke-linecap="round" filter="url(#tgGlow)"/>`;
  const lx=X+250*Math.sin(a),ly=baseY+12+250*Math.cos(a)*.86;s+=`<text class="rlab" x="${lx.toFixed(1)}" y="${(ly+26).toFixed(1)}" text-anchor="middle">${r[1].toUpperCase()}</text>`});
 // trunk
 const tp=`M${X},${baseY+16} C${X-16},${(baseY*.66+crownH*.34).toFixed(1)} ${X+16},${(baseY*.33+crownH*.66).toFixed(1)} ${X},${crownH-26}`;
 s+=`<path d="${tp}" stroke="url(#tgTrunk)" stroke-width="28" fill="none" stroke-linecap="round"/><path d="${tp}" stroke="#fff1c2" stroke-width="5" fill="none" opacity=".35"/><path d="${tp}" stroke="#f3d27a" stroke-width="10" fill="none" opacity=".25" filter="url(#tgGlow)"/>`;
 // crown rays
 for(const c of M.crown)s+=`<path d="M${X},${crownH-26} Q${((X+c.x)/2).toFixed(1)},${(crownH-60).toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}" stroke="#c9a24a" stroke-width="${c.kind==='class'?6:3}" fill="none" opacity=".8"/>`;
 s+=`<text class="clab" x="${X}" y="52" text-anchor="middle">CROWN</text>`;
 // twigs and leaves
 for(const tw of M.twigs){s+=`<path d="${crPath(tw.pts)}" fill="none" stroke="#a5813a" stroke-width="4.5" stroke-linecap="round"/>`;
  const k=(()=>{let n=0;for(const id of tw.ids){if(owns(id))n++;else break}return n})();
  if(k)s+=`<path d="${crPath(tw.pts.slice(0,k+1))}" fill="none" stroke="#ffe39a" stroke-width="3.5" stroke-linecap="round" filter="url(#tgGlow)"/>`;
  for(let i=1;i<tw.pts.length;i++){const[x0,y0]=tw.pts[i-1],[x1,y1]=tw.pts[i];const mx=(x0+x1)/2,my=(y0+y1)/2;const up=rr()>.5?-1:1;
   s+=`<ellipse cx="${mx.toFixed(1)}" cy="${(my+up*9).toFixed(1)}" rx="7" ry="3" fill="#e8c36a" opacity=".38" transform="rotate(${(tw.side*-30*up).toFixed(0)} ${mx.toFixed(1)} ${(my+up*9).toFixed(1)})"/>`}}
 for(const l of M.labels)s+=`<text class="tlab" x="${l.x}" y="${l.y.toFixed(1)}" text-anchor="middle" fill="${ELEM[l.el].c}">${ELEM[l.el].n.toUpperCase()} · ${st.aff[l.el]}%</text>`;
 for(const n of M.rings)s+=nodeSVG(n);for(const n of M.roots)s+=nodeSVG(n);for(const n of M.nodes)s+=nodeSVG(n);for(const n of M.crown)s+=nodeSVG(n);
 return s+`</svg>`}
function treeDetail(){if(!sel)return`<div class="tdet empty">Tap any node on the tree. <b>Glowing</b> nodes can be unlocked now.</div>`;
 if(sel.startsWith('__aw')){const k=+sel.slice(4);return`<div class="tdet"><div class="tdh"><b>${k===0?'Core':AWAKEN[k]}</b><span class="tag ${k===0||k<=st.awaken?'ti':''}">${k===0||k<=st.awaken?'Reached':'Not yet'}</span></div><p>${k===0?`Level ${st.lv} · Rank ${rank()}. Every branch grows from your core.`:['','Opens tier 2 skills, Attunement II and the deepest roots. Reached in your prologue.','Opens tier 3 skills, Fusion arts and Attunement III. Reached during Volume I.','Opens tier 4 skills. Coming in Volume II.'][k]}</p></div>`}
 if(sel==='__class')return`<div class="tdet"><div class="tdh"><b>The Crown</b></div><p>Your Class Evolution at Awakening II places a crown skill here. Fusion arts grow around it as golden fruit.</p></div>`;
 if(isTreeNode(sel)){const d=treeDef(sel),[ok,why]=treeCan(sel),has=st.tree.includes(sel);
  return`<div class="tdet"><div class="tdh"><b>${d.name}</b><span class="tag">${d.kind==='root'?'Status · Root':'Status · '+ELEM[d.el].n}</span></div><p>${d.desc}</p><div class="tdb">${has?'<span class="tag ti">Unlocked ✓</span>':ok?`<button class="mini learn" data-tu="${sel}">${why}</button>`:`<span class="mut">🔒 ${why}</span>`}</div></div>`}
 const s=SK[sel],[ok,why]=canLearn(sel),has=st.skills.includes(sel),eq=st.equip.includes(sel);
 const stats=[s.mp?`${s.mp} MP`:'',s.pow?`Power ${s.pow}${s.hits?' × '+s.hits:''}`:'',s.heal?`Heal ${s.heal}`:'',s.shield?`Shield ${s.shield}`:'',s.stun?`${Math.round(s.stun*100)}% stun`:'',s.pierce?'Ignores armor':''].filter(Boolean).join(' · ');
 return`<div class="tdet"><div class="tdh"><b>${s.n}</b><span class="tag" style="color:${ELEM[s.el].c};border-color:${ELEM[s.el].c}">${ELEM[s.el].n} · T${s.t} · ${s.type==='a'?'Active':'Passive'}</span></div><p>${s.d}</p>${stats?`<div class="sm">${stats}</div>`:''}
 <div class="tdb">${has?(s.type==='a'?`<button class="mini${eq?' on':''}" data-q="${sel}">${eq?'Equipped ✓ (tap to remove)':'Equip for battle'}</button>`:'<span class="tag ti">Learned · always active</span>'):ok?`<button class="mini learn" data-l="${sel}">${why}</button>`:`<span class="mut">🔒 ${why}</span>`}</div></div>`}
function treeTab(){const bondArts=st.skills.filter(s=>SK[s].el==='bond');
 return`<div class="row"><span class="mut">Skill Points</span><b class="pts">${st.sp} SP</b></div>
 <h4>Battle loadout <small class="mut">(4 active skills)</small></h4><div class="load">${[0,1,2,3].map(i=>{const id=st.equip[i];return id?`<button class="slot" data-u="${id}" style="--ec:${ELEM[SK[id].el].c}">${SK[id].n}<small>tap to remove</small></button>`:`<div class="slot empty">Empty</div>`}).join('')}</div>
 <h4>Tree of Life <span class="zoom"><button class="mini" id="zout" aria-label="Zoom out">−</button><button class="mini" id="zin" aria-label="Zoom in">+</button></span></h4>
 <p class="mut sm2">Roots grow your stats. Each branch is an element; each twig is a path of skills, ending in Attunements. Fusion arts and your class skill crown the top.</p>
 <div class="treebox" id="treebox">${treeSVG()}</div>${treeDetail()}
 ${bondArts.length?`<h4>Bond Arts</h4><div class="load">${bondArts.map(id=>`<button class="slot${st.equip.includes(id)?' on':''}" data-q="${id}" style="--ec:${ELEM.bond.c}">${SK[id].n}<small>${st.equip.includes(id)?'Equipped ✓':'Tap to equip'}</small></button>`).join('')}</div>`:''}`}
function bondsTab(){const opts=partnerOptions();
 let h=`<h4>Battle partner</h4><p class="mut sm2">Your partner fights beside you in team battles. Every victory together raises your bond, and the one you're closest to changes how Volume I ends.</p>
 <div class="pgrid">${opts.map(o=>`<button class="pcard${partnerId()===o?' on':''}" data-p="${o}"><b>${esc(cnm(o))}${st.romance===o?' ♥':''}</b><small>${partnerId()===o?'Partner ✓':'Set as partner'} · ${st.fought[o]||0} battles</small></button>`).join('')}</div><h4>Companions</h4>`;
 h+=COMP.filter(c=>c!==st.char).map(c=>{const v=st.bonds[c]||0,r=st.brank[c]||0,next=BRANK[r];
  const rw=r>=4?'All Bond Ranks reached':`Rank ${ROMAN[r]} at bond ${next}: `+['+1 SP and 50 Gold',`Bond Art "${SK['b_'+c].n}"`,`Resonance Gift (${ELEM[GIFT[c]].n})`,`"${SK['l_'+c].n}"`][r];
  return`<div class="bcard${st.romance===c?' love':''}"><div class="row"><b>${esc(cnm(c))}${st.romance===c?' ♥':''}</b><span class="tag${r?' ti':''}">${r?'Bond Rank '+ROMAN[r-1]:'Stranger'}</span></div>
  <div class="row sm"><span>Bond ${v}${r<4?' / '+next:''}</span><span>Side story ${st.sq[c]||0}/3${st.flirt[c]?` · ♥ ${st.flirt[c]}`:''}</span></div><div class="bar"><i style="width:${r>=4?100:pct(v,next)}%;background:linear-gradient(90deg,#ff9ec4,#ffd36b)"></i></div><div class="sm">${rw}</div></div>`}).join('');
 h+=`<h4>Legend Pact</h4>`+(ACC.pacts.length?ACC.pacts.map(p=>`<div class="bcard"><div class="row"><b>${LEG[p].n} · ${LEG[p].t}</b><button class="mini${st.pact===p?' on':''}" data-pact="${p}">${st.pact===p?'Equipped ✓':'Equip'}</button></div><div class="sm">${LEG[p].bd} · Summon: ${LEG[p].sum.n}</div></div>`).join(''):`<p class="mut">Bond with the heroes and First Dragons of the Sundering in the Store.</p>`);
 const fam=Object.entries(st.bonds).filter(([k])=>!COMP.includes(k));
 if(fam.length)h+=`<h4>Others</h4>`+fam.sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="bond"><b>${esc(BONDN[k]||k)}</b><span class="hearts">${v<0?'<span class="neg">hostile '+v+'</span>':'♥'.repeat(Math.min(10,v))+'<span class="mut">'+'♥'.repeat(Math.max(0,10-Math.min(10,v)))+'</span>'}</span></div>`).join('');
 return h}
function codexTab(){const base=Object.keys(CODEX).filter(c=>!c.startsWith('leg_')).length;
 return`<p class="mut">${st.codex.filter(c=>!c.startsWith('leg_')).length} of ${base} entries discovered. Different choices reveal more.</p>`+st.codex.map(id=>`<details class="cdx"><summary>${CODEX[id][0]}</summary>${CODEX[id][1].split('\n\n').map(p=>`<p>${p}</p>`).join('')}</details>`).join('')}
function storeTab(){const left=adsLeftToday();
 let h=`<div class="wallet"><span>💎 <b>${ACC.crowns.toLocaleString('en')}</b> Crowns</span>${st?`<span>🪙 <b>${st.gold.toLocaleString('en')}</b> Gold</span>`:''}</div>
 <div class="testbanner"><b>TEST MODE</b> · Nothing is charged. Real payments arrive with the App Store version.</div><h4>Featured</h4><div class="sgrid">`;
 if(!ACC.starter)h+=`<div class="scard feat"><b>Starter Bundle</b><small>500 Crowns + 3 Phoenix Feathers. Once per account.</small><button class="mini learn" data-buyp="starter">€4.99</button></div>`;
 h+=ACC.noAds?`<div class="scard own"><b>Ads removed ✓</b><small>Thank you for supporting the game.</small></div>`:`<div class="scard feat"><b>Remove Ads</b><small>No more ads between scenes. Forever, on every life.</small><button class="mini learn" data-buyp="noads">€2.99</button></div>`;
 if(st)h+=`<div class="scard"><b>Free Gold</b><small>Watch a short ad: +${ADS.rewardGold} Gold · ${Math.max(0,left)} left today</small><button class="mini" id="adgold" ${left>0?'':'disabled'}>▶ Watch</button></div>`;
 h+=`</div><h4>Legend Pacts</h4><p class="mut sm2">Bond with a hero or First Dragon of the Sundering. Equip one per life for a passive bonus and a summon once per battle. Unlocked on every life.</p><div class="sgrid">`+
  Object.entries(LEG).map(([k,l])=>`<div class="scard leg" style="--ec:${ELEM[l.el].c}"><div class="lh"><span class="lg">${ELEMG[l.el]}</span><div><b>${l.n}</b><small>${l.t}</small></div></div><small>${l.bd}<br>Summon: ${l.sum.n}</small>${ACC.pacts.includes(k)?(st?`<button class="mini${st.pact===k?' on':''}" data-pact="${k}">${st.pact===k?'Equipped ✓':'Equip'}</button>`:'<span class="tag ti">Owned</span>'):`<button class="mini learn" data-buyleg="${k}">💎 ${STORE.pact}</button>`}</div>`).join('')+`</div>`;
 if(st){h+=`<h4>Element Tomes</h4><p class="mut sm2">Each tome gives +5% affinity and +1 SP. Up to ${STORE.tome.max} per element, per life.</p><div class="sgrid">`+Object.keys(st.aff).filter(e=>e!=='void').map(e=>{const n=st.tomes[e]||0;
   return`<div class="scard" style="--ec:${ELEM[e].c}"><b><span style="color:${ELEM[e].c}">${ELEMG[e]}</span> Tome of ${ELEM[e].n}</b><small>${n}/${STORE.tome.max} read · ${ELEM[e].n} ${st.aff[e]}%</small>${n>=STORE.tome.max?'<span class="tag ti">Mastered</span>':`<div class="bb"><button class="mini learn" data-tome="${e}" data-cur="c">💎 ${STORE.tome.crowns}</button><button class="mini" data-tome="${e}" data-cur="g">🪙 ${STORE.tome.gold}</button></div>`}</div>`}).join('')+`</div>
  <h4>Power-ups</h4><div class="sgrid">`+Object.entries(STORE.items).map(([k,[n,d,g,c]])=>`<div class="scard"><b>${n}</b><small>${d} · You have ${st.inv[k]||0}</small><div class="bb"><button class="mini" data-item="${k}" data-cur="g">🪙 ${g}</button><button class="mini learn" data-item="${k}" data-cur="c">💎 ${c}</button></div></div>`).join('')+
  Object.entries(STORE.boosts).map(([k,[n,d,c]])=>`<div class="scard"><b>${n}</b><small>${d}</small><div class="bb"><button class="mini learn" data-boost="${k}">💎 ${c}</button></div></div>`).join('')+`</div>`}
 else h+=`<p class="mut">Continue or start a life to buy Element Tomes and power-ups for it.</p>`;
 h+=`<h4>Wardrobe</h4><p class="mut sm2">Cosmetic outfits for every character and every life. Equip them in the Locker.</p><div class="sgrid">`+Object.values(IT).filter(I=>I.shop).map(I=>{const own=ACC.wardrobe.includes(I.id);return`<div class="scard ward" style="--ec:${RAR[I.rar][1]}"><canvas class="wc" data-wart="${I.id}" width="120" height="120"></canvas><div><b>${I.n}</b><small style="color:${RAR[I.rar][1]}">${RAR[I.rar][0]} outfit</small><small>${esc(I.d||'')}</small>${own?'<span class="tag ti">Owned</span>':`<button class="mini learn" data-wbuy="${I.id}">💎 ${I.shop}</button>`}</div></div>`}).join('')+`</div>`;
 h+=`<h4>Crowns</h4><div class="sgrid">`+STORE.packs.map(([id,n,c,eur,tag])=>`<div class="scard"><b>${n}</b><small>💎 ${c.toLocaleString('en')} Crowns${tag?' · '+tag:''}</small><button class="mini learn" data-buyp="${id}">${eur}</button></div>`).join('')+`</div>`;
 return h}
function settingsTab(){const N=ACC.narr;let h=`<h4>Narrator</h4>`;
 if(!Narr.ok)h+=`<p class="mut">Reading aloud isn't available in this view.</p>`;
 else h+=`<div class="row"><span>Read every new scene aloud</span><button class="mini${N.on?' on':''}" id="narrOn">${N.on?'On':'Off'}</button></div>
  <label class="fld">Voice<select id="narrVoice">${Narr.voices.length?[...Narr.voices].sort((a,b)=>Narr.score(b)-Narr.score(a)).map(v=>`<option value="${esc(v.voiceURI)}" ${Narr.voice&&Narr.voice.voiceURI===v.voiceURI?'selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join(''):'<option>Default voice</option>'}</select></label>
  <label class="fld"><span>Speed <b id="rateV">${N.rate.toFixed(2)}</b></span><input type="range" id="narrRate" min="0.6" max="1.2" step="0.02" value="${N.rate}"></label>
  <label class="fld"><span>Depth (lower is deeper) <b id="pitchV">${N.pitch.toFixed(2)}</b></span><input type="range" id="narrPitch" min="0.4" max="1.2" step="0.02" value="${N.pitch}"></label>
  <button class="mini learn" id="narrTest">▶ Test the voice</button>
  <p class="mut sm2">For the deepest British voice on iPhone: Settings → Accessibility → Spoken Content → Voices → English → pick "Arthur" or "Daniel" and download the Enhanced version. Then choose it here.</p>`;
 const G=ACC.gfx;h+=`<h4>Graphics</h4><div class="row"><span>Quality</span><span class="bb">${[['low','Low'],['high','High'],['ultra','Ultra']].map(([k,n])=>`<button class="mini${G.q===k?' on':''}" data-gq="${k}">${n}</button>`).join('')}</span></div>
  <div class="row"><span>Frame rate</span><span class="bb">${[[30,'30'],[60,'60'],[0,'Max']].map(([k,n])=>`<button class="mini${G.fps===k?' on':''}" data-gf="${k}">${n}</button>`).join('')}</span></div>
  <p class="mut sm2">Now running at <b id="fpsv">${fpsM||'…'}</b> fps. "Max" follows your screen: up to 120 Hz on ProMotion and 120 Hz Android phones where the browser allows it. Ultra renders at 3× sharpness with more particles; Low saves battery.</p>`;
 if(st)h+=`<h4>Difficulty</h4><div class="row"><span>${st.diff==='story'?'Story · weaker enemies':'Normal'}</span><button class="mini" id="diffb">Switch to ${st.diff==='story'?'Normal':'Story'}</button></div>`;
 h+=`<h4>Ads</h4><div class="row"><span>${ACC.noAds?'Removed ✓':`Test ads every ${ADS.every} scenes`}</span><button class="mini" id="testAd">Show a test ad</button></div>
 <h4>Saves</h4><p class="mut sm2">${Cloud.ready?'☁ Your lives are saved to your Claude account and follow you to every device where you open this game.':'Your lives are saved in this browser. When the game is open while you are signed in to Claude, they also sync to your account.'}</p>`;
 if(st)h+=`<button class="btn" id="exitLife">Save and return to your lives</button>`;
 return h}
function wireMenu(){const q=(s,f)=>document.querySelectorAll('#menu '+s).forEach(x=>x.onclick=()=>f(x));
 $('mclose').onclick=closeMenu;
 q('.tab',x=>{menuTab=x.dataset.t;sel=null;renderMenu(true)});
 q('.plus',x=>{if(st.pts>0){st.pts--;st.stats[x.dataset.s]++;save();renderMenu()}});
 q('[data-l]',x=>{doLearn(x.dataset.l);save();toast(`Learned ${SK[x.dataset.l].n}`);renderMenu()});
 q('[data-tu]',x=>{treeUnlock(x.dataset.tu);save();toast(`Unlocked ${treeDef(x.dataset.tu).name}`);renderMenu()});
 q('[data-q]',x=>{const id=x.dataset.q;if(st.equip.includes(id)){if(st.equip.length<=1){toast('Keep at least one skill equipped.');return}st.equip=st.equip.filter(e=>e!==id)}else if(st.equip.length<4)st.equip.push(id);else{toast('Loadout full. Remove a skill first.');return}save();renderMenu()});
 q('[data-u]',x=>{if(st.equip.length<=1){toast('Keep at least one skill equipped.');return}st.equip=st.equip.filter(e=>e!==x.dataset.u);save();renderMenu()});
 const tb=$('treebox');if(tb)tb.onclick=e=>{const g=e.target.closest('[data-n]');if(!g)return;sel=g.dataset.n;renderMenu()};
 if(tb)tb.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){const g=e.target.closest('[data-n]');if(g){e.preventDefault();sel=g.dataset.n;renderMenu()}}};
 const zi=$('zin'),zo=$('zout');if(zi)zi.onclick=()=>{zoom=Math.min(2.2,zoom+.6);renderMenu(true)};if(zo)zo.onclick=()=>{zoom=Math.max(1,zoom-.6);renderMenu(true)};
 q('[data-p]',x=>{st.partner=x.dataset.p;save();toast(`${cnm(x.dataset.p)} is your battle partner`);renderMenu()});
 q('[data-pact]',x=>{st.pact=x.dataset.pact;save();toast(`${LEG[x.dataset.pact].n} answers your pact`);renderMenu()});
 q('[data-buyp]',x=>{const id=x.dataset.buyp;Monet.purchase(id).then(ok=>{if(!ok)return;grantProduct(id);toast('Purchase complete (test)');renderMenu();hudSafe()})});
 q('[data-buyleg]',x=>{const k=x.dataset.buyleg;if(!spendCrowns(STORE.pact)){toast('Not enough Crowns. Get more at the bottom of the Store.');return}ACC.pacts.push(k);saveAcc();if(st){if(!st.codex.includes('leg_'+k))st.codex.push('leg_'+k);if(!st.pact)st.pact=k;save()}toast(`Pact sealed: ${LEG[k].n}`);renderMenu();hudSafe()});
 q('[data-tome]',x=>{const e=x.dataset.tome,c=x.dataset.cur==='c';if((st.tomes[e]||0)>=STORE.tome.max)return;if(c?!spendCrowns(STORE.tome.crowns):!spendGold(STORE.tome.gold)){toast(c?'Not enough Crowns':'Not enough Gold');return}
  st.tomes[e]=(st.tomes[e]||0)+1;st.aff[e]=Math.min(100,st.aff[e]+5);st.sp+=1;save();toast(`${ELEM[e].n} +5% · +1 SP`);renderMenu();hudSafe()});
 q('[data-item]',x=>{const k=x.dataset.item,c=x.dataset.cur==='c',it=STORE.items[k];if(c?!spendCrowns(it[3]):!spendGold(it[2])){toast(c?'Not enough Crowns':'Not enough Gold');return}st.inv[k]=(st.inv[k]||0)+1;save();toast(`+1 ${it[0]}`);renderMenu();hudSafe()});
 q('[data-boost]',x=>{const k=x.dataset.boost,it=STORE.boosts[k];if(!spendCrowns(it[2])){toast('Not enough Crowns');return}if(k==='xpscroll'){xp(150)}else{st.sp+=1;sysMsg('+1 SP')}save();toast(it[1]);renderMenu();hudSafe()});
 const ag=$('adgold');if(ag)ag.onclick=()=>Monet.rewarded().then(ok=>{if(!ok)return;countAd();st.gold+=ADS.rewardGold;save();toast(`+${ADS.rewardGold} Gold`);renderMenu()});
 const no=$('narrOn');if(no)no.onclick=()=>{ACC.narr.on=!ACC.narr.on;saveAcc();if(!ACC.narr.on)Narr.stop();renderMenu();hudSafe()};
 const nv=$('narrVoice');if(nv)nv.onchange=()=>{ACC.narr.voice=nv.value;Narr.pick();saveAcc()};
 const nr=$('narrRate');if(nr){nr.oninput=()=>{ACC.narr.rate=+nr.value;$('rateV').textContent=(+nr.value).toFixed(2)};nr.onchange=saveAcc}
 const np=$('narrPitch');if(np){np.oninput=()=>{ACC.narr.pitch=+np.value;$('pitchV').textContent=(+np.value).toFixed(2)};np.onchange=saveAcc}
 const nt=$('narrTest');if(nt)nt.onclick=()=>Narr.read(['Welcome to Arcanum. The black moon is rising, and the Seven Crowns are waiting for you.']);
 const db=$('diffb');if(db)db.onclick=()=>{st.diff=st.diff==='story'?'normal':'story';save();renderMenu()};
 const ta=$('testAd');if(ta)ta.onclick=()=>adOverlay('interstitial',()=>{});
 q('[data-gq]',x=>{ACC.gfx.q=x.dataset.gq;saveAcc();setGfx(ACC.gfx.q,ACC.gfx.fps);renderMenu()});
 q('[data-gf]',x=>{ACC.gfx.fps=+x.dataset.gf;saveAcc();setGfx(ACC.gfx.q,ACC.gfx.fps);renderMenu()});
 q('[data-wbuy]',x=>{const id=x.dataset.wbuy,I=IT[id];if(ACC.wardrobe.includes(id))return;if(!spendCrowns(I.shop)){toast('Not enough Crowns. Get more at the bottom of the Store.');return}ACC.wardrobe.push(id);saveAcc();
  if(st){if(!st.gear.inv.includes(id))st.gear.inv.push(id);save()}reward('item',id);if(st)showRewards();else{RQ.length=0;toast(`${I.n} added to your Wardrobe`)}renderMenu();hudSafe()});
 document.querySelectorAll('#menu canvas.wc').forEach(cv=>{const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);drawItemArt(c,IT[cv.dataset.wart],cv.width)});
 const ex=$('exitLife');if(ex)ex.onclick=()=>{save();Narr.stop();$('menu').hidden=true;b=null;st=null;showTitle()}}
let tt;function toast(m){const e=$('toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2200)}

/* ---------- test purchases and test ads ---------- */
function testPurchaseSheet(id,res){const[n,price]=PRODUCTS[id];const o=$('sheet');o.hidden=false;
 o.innerHTML=`<div class="sheetbox" role="dialog" aria-label="Test purchase"><div class="sh-tag">TEST PURCHASE</div><b class="sh-n">${esc(n)}</b><div class="sh-p">${price}</div><p class="mut">No money will be charged. In the App Store version, this opens Apple's own payment screen.</p><button class="btn" id="spay">Buy (test)</button><button class="btn ghost" id="scan">Cancel</button></div>`;
 $('spay').onclick=()=>{o.hidden=true;res(true)};$('scan').onclick=()=>{o.hidden=true;res(false)}}
function adOverlay(kind,res){const o=$('adov'),rw=kind==='rewarded';let t=5;o.hidden=false;Narr.stop();
 o.innerHTML=`<div class="adbox" role="dialog" aria-label="Advertisement"><div class="adtop"><span class="adtag">AD · TEST</span><button class="adx" id="adx" disabled>${rw?'Reward in':'Skip in'} 5</button></div>
 <canvas class="adcv" id="adcv"></canvas><div class="adcopy"><b>Legend Pacts are here</b><span>Bond with the First Dragons of the Sundering. Find them in the Store.</span></div>
 <p class="mut sm2">Test ad. In the App Store version, a real ad from Google AdMob appears here.</p>${rw?'<button class="mini" id="adclose">Close without reward</button>':''}</div>`;
 requestAnimationFrame(()=>{const c=$('adcv');if(c)thumb(c,['academy','peak','sylvaris','city'][Math.floor(Math.random()*4)]||'academy')});
 const btn=$('adx');const iv=setInterval(()=>{t--;if(t>0)btn.textContent=`${rw?'Reward in':'Skip in'} ${t}`;else{clearInterval(iv);btn.disabled=false;btn.textContent=rw?'Claim reward ✓':'Skip ✕'}},1000);
 btn.onclick=()=>{clearInterval(iv);o.hidden=true;res(true)};const cl=$('adclose');if(cl)cl.onclick=()=>{clearInterval(iv);o.hidden=true;res(false)}}

/* ---------- title screen with lives ---------- */
const ago=ts=>{const m=Math.round((now()-(ts||0))/60000);return m<1?'just now':m<60?`${m} min ago`:m<1440?`${Math.round(m/60)} h ago`:`${Math.round(m/1440)} d ago`};
const chapterOf=l=>{try{const c=SCN[l.sc]&&SCN[l.sc].ch;const s=typeof c==='function'?'Side story':String(c||'');return l.sc==='arc_end'?'Volume I complete':s.split('·').pop().trim()}catch(e){return''}};
function showTitle(){$('app').hidden=true;$('menu').hidden=true;$('title').hidden=false;setScene('title');b=null;Narr.stop();
 const lives=allLives();
 $('cloudline').textContent=Cloud.ready?'☁ Your lives are saved to your Claude account.':'Your lives are saved on this device.';
 $('tgem').textContent=`💎 ${ACC.crowns.toLocaleString('en')}`;
 $('chars').innerHTML=Object.entries(CHARS).map(([id,C])=>{const L=lives.filter(l=>l.char===id);
  return`<div class="cc" data-c="${id}"><div class="thw"><canvas class="th" data-bg="${C.bg}"></canvas><canvas class="cav" data-av="${id}" width="240" height="360" aria-hidden="true"></canvas></div><div class="ci">
  <h3>${id==='ren'?esc(ACC.renName||'Ren'):C.n}</h3><div class="mut">${C.race} · ${C.nation}</div>
  <div class="pills">${Object.entries(C.aff).map(([k,v])=>`<span class="pill" style="--ec:${ELEM[k].c}">${ELEM[k].n} ${v}%</span>`).join('')}${id==='ren'?'<span class="pill" style="--ec:#8a8a9a">??? hidden</span>':''}</div>
  <p>${C.hook}</p>
  ${L.length?`<div class="lives">${L.map(l=>`<div class="life" data-l="${l.id}"><div class="li"><b>Life ${ROMAN[(l.life||1)-1]||l.life}${id==='ren'?' · '+esc(l.renName):''}${l.romance?' ♥':''}</b><small>Lv ${l.lv} · Rank ${rankOf(l.lv)} · ${esc(chapterOf(l))} · ${ago(l.updated)}</small></div><button class="mini learn" data-cont="${l.id}">${l.sc==='arc_end'?'View':'Play'}</button><button class="mini del" data-del="${l.id}" aria-label="Delete this life">✕</button></div>`).join('')}</div>`:''}
  ${id==='ren'?`<label class="nm">Name for a new life<input id="renName" maxlength="16" value="${esc(ACC.renName||'Ren')}" autocomplete="off"></label>`:''}
  <button class="btn${L.length?' ghost':''}" data-new="${id}">${L.length?'+ Start a new life':'Begin'}</button></div></div>`}).join('');
 requestAnimationFrame(()=>{document.querySelectorAll('.th').forEach(c=>thumb(c,c.dataset.bg));document.querySelectorAll('.cav').forEach(cv=>{const id=cv.dataset.av,last=lives.filter(l=>l.char===id).sort((a,b)=>(b.updated||0)-(a.updated||0))[0];const c=cv.getContext('2d');c.clearRect(0,0,240,360);const g=last&&last.gear;drawAvatar(c,(g&&g.look)||LOOKS[id],(g&&g.eq)||{weapon:STARTGEAR[id]},{w:240})})});
 document.querySelectorAll('[data-new]').forEach(x=>x.onclick=()=>{const id=x.dataset.new;let name=ACC.renName||'Ren';
  if(id==='ren'){name=($('renName').value.trim()||'Ren').replace(/[<>&"']/g,'');ACC.renName=name;saveAcc()}
  const s=newState(id,name);s.life=1+Math.max(0,...allLives().filter(l=>l.char===id).map(l=>l.life||1));setState(s);
  MSG=['A new life begins. Tap Menu to open your Tree of Life, Bonds and the Store.'];startGame()});
 document.querySelectorAll('[data-cont]').forEach(x=>x.onclick=()=>{const s=loadLife(x.dataset.cont);if(!s)return;setState(s);MSG=[];startGame()});
 document.querySelectorAll('[data-del]').forEach(x=>x.onclick=()=>{const row=x.closest('.life');const id=x.dataset.del;
  row.innerHTML=`<div class="li"><b>Delete this life forever?</b><small>This can't be undone.</small></div><button class="mini del" data-yes>Delete</button><button class="mini" data-no>Keep</button>`;
  row.querySelector('[data-yes]').onclick=()=>{deleteLife(id);showTitle()};row.querySelector('[data-no]').onclick=showTitle})}
function startGame(){$('title').hidden=true;$('app').hidden=false;sel=null;go(st.sc)}
function onCloudReady(){if(!$('title').hidden)showTitle();else if(!$('menu').hidden)renderMenu()}
$('tstore').onclick=()=>openMenu('store');$('tgem').onclick=()=>openMenu('store');$('tset').onclick=()=>openMenu('settings');
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('menu').hidden)closeMenu()});
$('menu').addEventListener('click',e=>{if(e.target.id==='menu')closeMenu()});

/* ---------- v4: battle specials, drops, rewards, locker ---------- */
function specials(){let h='';const w=st.gear.eq.weapon&&IT[st.gear.eq.weapon];
 if(w&&w.pw&&!b.awUsed)h+=`<button class="act legend" data-a="wawake" style="--ec:${RAR[w.rar][1]}"><b>⚡ ${w.pw.n}</b><small>Weapon awakening · 3 turns</small></button>`;
 if(b.aw)h+=`<div class="act basic awake" style="--ec:#ffd36b"><b>⚡ ${b.aw.n}</b><small>${b.aw.t} turn${b.aw.t>1?'s':''} left</small></div>`;
 for(const id of st.gear.orbEq){const O=ORBS[id];if(O&&!b.orbUsed[id])h+=`<button class="act legend" data-a="orb:${id}" style="--ec:${O.c[0]}"><b>◈ ${O.art.n}</b><small>${O.n} · once per battle</small></button>`}
 return h}
function winBattle(L){const e=b.e,E=EN[b.eid];e.hp=0;b.over='win';
 if(E.drop&&!st.gear.inv.includes(E.drop))b.drop=E.drop;else if(Math.random()<.35){const pool=DROPS.filter(i=>!st.gear.inv.includes(i));if(pool.length)b.drop=pool[Math.floor(Math.random()*pool.length)]}
 b.log.push(...L,`<b>${e.n} is defeated!</b>`);renderBattle()}
const SLOTN={weapon:'Weapon',armor:'Armor',outfit:'Outfit',cloak:'Cloak',accessory:'Accessory'};
const STATN={atk:['Attack',''],def:['Defense',''],hp:['HP',''],mp:['MP',''],crit:['Crit','%'],dodge:['Dodge','%'],str:['Strength',''],agi:['Agility',''],mana:['Mana',''],ctrl:['Control',''],spi:['Spirit',''],regen:['MP per turn',''],dr:['Damage taken','%'],dmg:['All damage','%'],heal:['Healing','%']};
function statLines(s){const out=[];for(const k in s){if(k==='el'){for(const e in s.el)out.push(`+${Math.round(s.el[e]*100)}% ${ELEM[e]?ELEM[e].n:e} damage`)}else if(STATN[k]){const v=s[k];const pctk=['dr','dmg','heal'].includes(k);out.push(k==='dr'?`-${Math.round(v*100)}% damage taken`:`+${pctk?Math.round(v*100):v}${STATN[k][1]} ${STATN[k][0]}`)}}return out.length?out:['No stats · cosmetic']}
function artDesc(A){return[A.pow?`Power ${A.pow}${A.hits?' × '+A.hits:''}`:'',A.pierce?'ignores armor':'',A.stun?`${Math.round(A.stun*100)}% stun`:'',A.healPct?`heals ${Math.round(A.healPct*100)}% HP`:'',A.shield?`shield ${A.shield}`:'',A.buff?'+40% damage for 2 turns':'',A.weaken?`enemy attack -${Math.round(A.weaken*100)}%`:'',A.evade?'dodge the next attack':'',A.drain?'drains HP':'',A.trans?'TRANSCENDENCE':''].filter(Boolean).join(' · ')+'. Once per battle.'}
function skillStats(s){return[s.mp?`${s.mp} MP`:'',s.pow?`Power ${s.pow}${s.hits?' × '+s.hits:''}`:'',s.heal?`Heal ${s.heal}`:'',s.shield?`Shield ${s.shield}`:'',s.stun?`${Math.round(s.stun*100)}% stun`:''].filter(Boolean)}
function drawMedal(c,S,col,glyph){const g=c.createRadialGradient(S/2,S/2,S*.05,S/2,S/2,S*.5);g.addColorStop(0,hexA(col,.55));g.addColorStop(1,hexA(col,0));c.fillStyle=g;c.fillRect(0,0,S,S);
 c.beginPath();for(let i=0;i<6;i++){const an=Math.PI/6+i*Math.PI/3;c.lineTo(S/2+Math.cos(an)*S*.3,S/2+Math.sin(an)*S*.3)}c.closePath();const g2=c.createLinearGradient(0,S*.2,0,S*.8);g2.addColorStop(0,'#2a2140');g2.addColorStop(1,'#0e0b1c');c.fillStyle=g2;c.fill();c.strokeStyle=col;c.lineWidth=S*.02;c.stroke();
 c.fillStyle=col;c.font=`bold ${S*.26}px "Segoe UI Symbol","Apple Symbols",serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(glyph,S/2,S/2+S*.01)}
function drawSkillArt(c,s,S){drawMedal(c,S,ELEM[s.el].c,ELEMG[s.el]||'•')}
let rwOpen=false,rwRAF=0;
function showRewards(){if(rwOpen||!RQ.length)return;const r=RQ.shift();rwOpen=true;const o=$('rwd');let head='SYSTEM',title='',sub='',col='#7fd8ff',stats=[],power=null,art=null,eqb='',rl='';
 if(r.kind==='item'){const I=IT[r.id];col=RAR[I.rar][1];head='ITEM ACQUIRED';rl=RAR[I.rar][0];title=I.n;sub=I.type==='weapon'?`Weapon · ${I.wt}`:SLOTN[I.type];stats=[...statLines(I.s)];if(I.d)stats.push(`<i>${esc(I.d)}</i>`);power=I.pw?{n:'Awakening · '+I.pw.n,d:I.pw.d+' Once per battle.'}:null;art=(c,S)=>drawItemArt(c,I,S);if(st.gear.eq[I.type]!==r.id)eqb=`<button class="btn" id="rweq">Equip now</button>`}
 else if(r.kind==='orb'){const O=ORBS[r.id];col=O.c[0];head='LEGENDARY ORB';rl=`${ORBT[O.tier-1]} · ${NATION[O.nat][0]}`;title=O.n;sub=`Sub-element: ${O.sub}`;stats=[O.bd,`<i>${esc(O.d)}</i>`];power={n:'Orb Art · '+O.art.n,d:artDesc(O.art)};art=(c,S,t)=>drawOrbArt(c,O,S,t);if(!st.gear.orbEq.includes(r.id)&&orbSlots()>0)eqb=`<button class="btn" id="rworb">Equip orb</button>`}
 else if(r.kind==='skill'){const s=SK[r.id];col=ELEM[s.el].c;head='SKILL ACQUIRED';rl=`${ELEM[s.el].n} · Tier ${s.t} · ${s.type==='a'?'Active':'Passive'}`;title=s.n;sub=s.d;stats=skillStats(s);art=(c,S)=>drawSkillArt(c,s,S)}
 else if(r.kind==='title'){col='#ffd36b';head='TITLE EARNED';title=`「${esc(r.id)}」`;sub='Shown in your status window';art=(c,S)=>drawMedal(c,S,'#ffd36b','✦')}
 else if(r.kind==='bond'){col='#ff9ec4';head='BOND RANK UP';rl=['Friends','Trusted','Bonded','Soulbound'][r.rank-1];title=`${esc(cnm(r.id))} · Rank ${ROMAN[r.rank-1]}`;stats=[['+1 SP and 50 Gold',`New Bond Art: ${SK['b_'+r.id].n}`,`Resonance Gift: ${ELEM[GIFT[r.id]].n}`,`Soulbound Art: ${SK['l_'+r.id].n}`][r.rank-1]];
  art=(c,S)=>{drawMedal(c,S,'#ff9ec4','♥');const im=new Image();im.onload=()=>{c.save();c.beginPath();c.arc(S/2,S/2,S*.22,0,7);c.clip();c.drawImage(im,S*.28,S*.28,S*.44,S*.44);c.restore()};im.src=portrait(r.id,r.id==='ren'?null:null,null,64)}}
 else if(r.kind==='awaken'){col='#7fd8ff';head='AWAKENING';title=AWAKEN[r.id];sub=r.n||'';stats=[r.id===1?'Tier 2 skills · Orb slot I':'Tier 3 and Fusion skills · Orb slot II'];art=(c,S)=>drawMedal(c,S,'#7fd8ff',ROMAN[r.id-1])}
 const tr=(r.kind==='orb'&&ORBS[r.id].tier>=4)||r.kind==='awaken';if(r.kind==='orb'&&ORBS[r.id].tier>=5){head='TRANSCENDENT ORB';stats.unshift('Ascension · its bearer steps beyond human')}
 o.hidden=false;o.innerHTML=`${tr?`<canvas class="rwfx" id="rwfx"></canvas><div class="rwflash"></div><div class="rwshock" style="--rc:${col}"></div><div class="rwshock s2" style="--rc:${col}"></div><div class="rwshock s3" style="--rc:${col}"></div>`:''}<div class="rwbox${tr?' trans':''}" style="--rc:${col}" role="dialog" aria-label="${head}"><div class="rwrays"></div><div class="rwin"><div class="rwhead">◆ SYSTEM · ${head}</div>${rl?`<div class="rwrar">${rl}</div>`:''}
  <canvas id="rwcv" width="440" height="440"></canvas><div class="rwname">${title}</div>${sub?`<div class="rwsub">${sub}</div>`:''}
  ${stats.length?`<ul class="rwstats">${stats.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}${power?`<div class="rwpow"><b>⚡ ${power.n}</b><span>${power.d}</span></div>`:''}
  <div class="rwbtns">${eqb}<button class="btn ghost" id="rwok">${RQ.length?`Next (${RQ.length} more)`:'Continue'}</button></div></div></div>`;
 if(tr)rwBurst(col);const cv=$('rwcv'),cc=cv.getContext('2d');const tick=t=>{cc.clearRect(0,0,440,440);art&&art(cc,440,t);if(r.kind==='orb'&&!RM)rwRAF=requestAnimationFrame(tick)};tick(0);
 const close=()=>{cancelAnimationFrame(rwRAF);rwOpen=false;o.hidden=true;o.innerHTML='';save();if(RQ.length)showRewards();else{hudSafe();if(!$('menu').hidden)renderMenu()}};
 $('rwok').onclick=close;const qe=$('rweq');if(qe)qe.onclick=()=>{equip(r.id);toast(`Equipped ${IT[r.id].n}`);close()};
 const qo=$('rworb');if(qo)qo.onclick=()=>{if(st.gear.orbEq.length>=orbSlots())st.gear.orbEq.shift();st.gear.orbEq.push(r.id);toast(`${ORBS[r.id].n} equipped`);close()}}
let lockTab='gear',pickSlot='weapon',itemSel=null,orbSel=null;
function lockerTab(){const subs=[['gear','Gear'],['orbs','Orbs'],['look','Appearance'],['sets','Skill Sets']].map(([k,n])=>`<button class="ltab${lockTab===k?' on':''}" data-lt="${k}">${n}</button>`).join('');
 let h=`<div class="lockwrap"><div class="lockfig"><canvas id="lockcv" width="440" height="660" aria-label="Your character"></canvas><div class="gs"><span>Gear Score</span><b>${gearScore()}</b></div></div>
 <div class="lockside"><div class="locksubs">${subs}</div>`;
 if(lockTab==='gear'){h+=`<div class="slots">`+SLOTS.map(k=>{const id=st.gear.eq[k],I=id&&IT[id];return`<button class="lslot${pickSlot===k?' on':''}" data-slot="${k}" style="--rc:${I?RAR[I.rar][1]:'#4a4458'}"><canvas class="ic" data-art="${id||''}" width="88" height="88"></canvas><span><small>${SLOTN[k]}</small><b>${I?I.n:'Empty'}</b></span></button>`}).join('')+`</div>`;
  const list=st.gear.inv.filter(id=>IT[id]&&IT[id].type===pickSlot);
  h+=`<h4>${SLOTN[pickSlot]} · ${list.length} owned</h4><div class="ilist">${list.length?list.map(id=>{const I=IT[id],on=st.gear.eq[pickSlot]===id;return`<div class="irow${itemSel===id?' sel':''}" data-isel="${id}" style="--rc:${RAR[I.rar][1]}"><canvas class="ic" data-art="${id}" width="88" height="88"></canvas><div class="ii"><b>${I.n}</b><small style="color:${RAR[I.rar][1]}">${RAR[I.rar][0]}${I.pw?' · ⚡ '+I.pw.n:''}</small><small>${statLines(I.s).slice(0,3).join(' · ')}</small></div>${on?(pickSlot!=='weapon'?`<button class="mini on" data-uneq="${pickSlot}">Equipped ✓</button>`:'<span class="tag ti">Equipped</span>'):`<button class="mini learn" data-eq="${id}">Equip</button>`}</div>`}).join(''):'<p class="mut">Nothing here yet. Win battles, finish side stories and follow the story to find more.</p>'}</div>`;
  if(itemSel&&IT[itemSel]){const I=IT[itemSel];h+=`<div class="idet" style="--rc:${RAR[I.rar][1]}"><canvas class="ic big" data-art="${itemSel}" width="260" height="260"></canvas><div><b>${I.n}</b><small style="color:${RAR[I.rar][1]}">${RAR[I.rar][0]} ${SLOTN[I.type]}</small><ul class="rwstats">${statLines(I.s).map(x=>`<li>${x}</li>`).join('')}</ul>${I.pw?`<div class="rwpow"><b>⚡ Awakening · ${I.pw.n}</b><span>${I.pw.d} Once per battle.</span></div>`:''}<p class="mut sm2">${esc(I.d||'')}</p></div></div>`}}
 else if(lockTab==='orbs'){const n=orbSlots();h+=`<p class="mut sm2">Equip ${n?`up to ${n} orb${n>1?'s':''}`:'orbs after Awakening I'}. Each orb gives a passive bonus and one Orb Art per battle. Transcendent orbs grant powers equal to the Crown-bearers of the Sundering.</p><div class="slots">`+[0,1].map(i=>{const id=st.gear.orbEq[i];return i<n?`<button class="lslot" data-oslot="${i}" style="--rc:${id?ORBS[id].c[0]:'#4a4458'}"><canvas class="oc" data-orb="${id||''}" width="88" height="88"></canvas><span><small>Orb slot ${ROMAN[i]}</small><b>${id?ORBS[id].n:'Empty'}</b></span></button>`:`<div class="lslot locked"><span><small>Orb slot ${ROMAN[i]}</small><b>Unlocks at Awakening ${ROMAN[i]}</b></span></div>`}).join('')+`</div>`;
  h+=`<h4>Orb Vault · ${st.gear.orbs.length} / 35</h4>`+Object.entries(NATION).map(([k,N])=>`<div class="onat"><div class="onh" style="color:${N[2]}">${N[0]} · ${ELEM[N[1]].n}</div><div class="ogrid">${Object.values(ORBS).filter(O=>O.nat===k).map(O=>{const has=st.gear.orbs.includes(O.id);return`<button class="ocell${has?'':' unk'}${orbSel===O.id?' sel':''}" data-osel="${O.id}" title="${has?esc(O.n):'Unknown orb'}">${has?`<canvas class="oc" data-orb="${O.id}" width="96" height="96"></canvas>`:`<span>?</span>`}<small>${ROMAN[O.tier-1]}</small></button>`}).join('')}</div></div>`).join('');
  if(orbSel){const O=ORBS[orbSel],has=st.gear.orbs.includes(orbSel);h+=`<div class="idet" style="--rc:${O.c[0]}">${has?`<canvas class="oc big" data-orb="${orbSel}" width="260" height="260"></canvas>`:'<div class="unkbig">?</div>'}<div><b>${has?O.n:'Unknown '+ORBT[O.tier-1]+' Orb'}</b><small style="color:${O.c[0]}">${ORBT[O.tier-1]} · ${NATION[O.nat][0]}${has?' · '+O.sub:''}</small>${has?`<ul class="rwstats"><li>${O.bd}</li></ul><div class="rwpow"><b>◈ ${O.art.n}</b><span>${artDesc(O.art)}</span></div><p class="mut sm2">${esc(O.d)}</p>${n?(st.gear.orbEq.includes(orbSel)?`<button class="mini on" data-ounq="${orbSel}">Equipped ✓ (tap to remove)</button>`:`<button class="mini learn" data-oeq="${orbSel}">Equip orb</button>`):''}`:`<p class="mut sm2">Not found yet. ${O.where==='Volume I'?'Hidden somewhere in Volume I.':'Waiting in '+O.where+'.'}</p>`}</div></div>`}}
 else if(lockTab==='look'){const L=st.gear.look;const sw=(key,arr)=>`<div class="lk"><small>${({skin:'Skin',hairC:'Hair color',eyes:'Eyes',outC:'Outfit color',trim:'Trim'})[key]}</small><div class="sws">${arr.map(v=>`<button class="sw${L[key]===v?' on':''}" data-look="${key}" data-val="${v}" style="background:${v}" aria-label="${v}"></button>`).join('')}</div></div>`;
  const ch=(key,arr,label)=>`<div class="lk"><small>${label}</small><div class="chips">${arr.map(v=>`<button class="chip${L[key]===v?' on':''}" data-look="${key}" data-val="${v}">${v}</button>`).join('')}</div></div>`;
  h+=`<p class="mut sm2">Change how ${esc(pname().split(' ')[0])} looks. Outfits from the Gear tab are worn over your own style.</p>`+sw('skin',LOOKOPT.skin)+ch('hair',LOOKOPT.hair,'Hair style')+sw('hairC',LOOKOPT.hairC)+sw('eyes',LOOKOPT.eyes)+ch('outfit',LOOKOPT.outfit,'Outfit style')+sw('outC',LOOKOPT.outC)+sw('trim',LOOKOPT.trim)+ch('build',LOOKOPT.build,'Build')+ch('ears',LOOKOPT.ears,'Ears')+ch('mark',LOOKOPT.mark,'Markings')+ch('beard',LOOKOPT.beard,'Beard')+ch('extra',LOOKOPT.extra,'Extra')+`<button class="mini" id="lookreset">Reset to ${esc(pname().split(' ')[0])}'s original look</button>`}
 else{h+=`<p class="mut sm2">Save your current 4-skill battle loadout into a set, and switch sets before a fight.</p>`+['A','B','C'].map(k=>{const set=st.gear.sets[k];return`<div class="bcard"><div class="row"><b>Skill Set ${k}</b><span class="bb"><button class="mini" data-ssave="${k}">Save current</button>${set?`<button class="mini learn" data-sload="${k}">Use this set</button>`:''}</span></div><div class="sm">${set?set.map(id=>SK[id]?SK[id].n:'').join(' · '):'Empty'}</div></div>`}).join('')+`<div class="sm">Current: ${st.equip.map(id=>SK[id].n).join(' · ')}</div>`}
 return h+`</div></div>`}
function drawMenuArt(){const lc=$('lockcv');if(lc){const c=lc.getContext('2d');c.clearRect(0,0,440,660);drawAvatar(c,st.gear.look,st.gear.eq,{w:440,orbs:st.gear.orbEq})}
 document.querySelectorAll('#menu canvas.ic').forEach(cv=>{const id=cv.dataset.art;const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);if(id&&IT[id])drawItemArt(c,IT[id],cv.width)});
 document.querySelectorAll('#menu canvas.oc').forEach(cv=>{const id=cv.dataset.orb;const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);if(id&&ORBS[id])drawOrbArt(c,ORBS[id],cv.width,2000)})}
function wireLocker(){const q=(s,f)=>document.querySelectorAll('#menu '+s).forEach(x=>x.onclick=()=>f(x));
 q('[data-lt]',x=>{lockTab=x.dataset.lt;itemSel=null;orbSel=null;renderMenu()});
 q('[data-slot]',x=>{pickSlot=x.dataset.slot;itemSel=null;renderMenu()});
 q('[data-isel]',x=>{itemSel=x.dataset.isel;renderMenu()});
 q('[data-eq]',x=>{equip(x.dataset.eq);save();toast(`Equipped ${IT[x.dataset.eq].n}`);renderMenu()});
 q('[data-uneq]',x=>{unequip(x.dataset.uneq);save();renderMenu()});
 q('[data-osel]',x=>{orbSel=x.dataset.osel;renderMenu()});
 q('[data-oslot]',x=>{const id=st.gear.orbEq[+x.dataset.oslot];if(id)orbSel=id;renderMenu()});
 q('[data-oeq]',x=>{if(st.gear.orbEq.length>=orbSlots())st.gear.orbEq.shift();st.gear.orbEq.push(x.dataset.oeq);save();toast(`${ORBS[x.dataset.oeq].n} equipped`);renderMenu()});
 q('[data-ounq]',x=>{st.gear.orbEq=st.gear.orbEq.filter(i=>i!==x.dataset.ounq);save();renderMenu()});
 q('[data-look]',x=>{st.gear.look[x.dataset.look]=x.dataset.val;save();renderMenu()});
 const lr=$('lookreset');if(lr)lr.onclick=()=>{st.gear.look={...LOOKS[st.char]};save();renderMenu()};
 q('[data-ssave]',x=>{st.gear.sets[x.dataset.ssave]=[...st.equip];save();toast(`Saved to Skill Set ${x.dataset.ssave}`);renderMenu()});
 q('[data-sload]',x=>{st.equip=st.gear.sets[x.dataset.sload].filter(id=>st.skills.includes(id)).slice(0,4);save();toast(`Skill Set ${x.dataset.sload} equipped`);renderMenu()})}

function rwBurst(col){const cv=$('rwfx');if(!cv||RM)return;const w=cv.width=cv.clientWidth,h=cv.height=cv.clientHeight,c=cv.getContext('2d'),P=[];for(let i=0;i<140;i++){const a=Math.random()*6.283,s=2+Math.random()*10;P.push([w/2,h*.42,Math.cos(a)*s,Math.sin(a)*s,1,1+Math.random()*2.6])}const t0=performance.now();
 const f=()=>{if(!cv.isConnected)return;const t=(performance.now()-t0)/1000;c.clearRect(0,0,w,h);c.globalCompositeOperation='lighter';for(const p of P){p[0]+=p[2];p[1]+=p[3];p[2]*=.97;p[3]=p[3]*.97+.06;p[4]=Math.max(0,1-t/1.9);c.fillStyle=hexA(col,p[4]);c.beginPath();c.arc(p[0],p[1],p[5]*(.5+p[4]),0,7);c.fill()}if(t<1.9)requestAnimationFrame(f)};f()}
setInterval(()=>{const f=$('fpsv');if(f)f.textContent=fpsM||'…'},1000);
loadAcc();setGfx(ACC.gfx.q,ACC.gfx.fps);Narr.init();showTitle();Cloud.init();
