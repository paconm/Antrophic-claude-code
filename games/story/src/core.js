/* ================= STATE, LIVES & SAVES ================= */
const SCN={};
let st=null,F={},MSG=[],ACC=null;
const COMP=['ren','lyra','torvin','kaida','kael'];
const BRANK=[3,6,10,15];
const now=()=>Date.now();
const uid=()=>Math.random().toString(36).slice(2,9)+now().toString(36).slice(-5);
/* storage that never throws: localStorage when allowed, memory otherwise */
const LS={mem:{},get(k){try{const v=localStorage.getItem(k);return v!==null?v:(this.mem[k]??null)}catch(e){return this.mem[k]??null}},
 set(k,v){this.mem[k]=v;try{localStorage.setItem(k,v)}catch(e){}},del(k){delete this.mem[k];try{localStorage.removeItem(k)}catch(e){}},
 keys(){let ks=[];try{for(let i=0;i<localStorage.length;i++)ks.push(localStorage.key(i))}catch(e){}return[...new Set(ks.concat(Object.keys(this.mem)))]}};
const jget=k=>{try{return JSON.parse(LS.get(k))}catch(e){return null}};
const ACC0=()=>({v:3,crowns:0,noAds:false,pacts:[],purchases:[],starter:false,pendingPhoenix:0,adDay:'',adCount:0,deleted:[],
 narr:{on:false,voice:null,rate:.86,pitch:.72},diff:'normal',renName:'Ren',wardrobe:[],gfx:{q:'high',fps:0},updated:0});
function loadAcc(){ACC=Object.assign(ACC0(),jget('sc7_acc')||{});ACC.narr=Object.assign(ACC0().narr,ACC.narr||{});
 const meta=jget('sc7_meta');if(meta){if(meta.renName)ACC.renName=meta.renName;if(meta.diff)ACC.diff=meta.diff;LS.del('sc7_meta')}
 for(const ch of Object.keys(CHARS)){const old=jget('sc7_'+ch);if(old&&old.char){const m=migrate(old);m.life=1+allLives().filter(l=>l.char===ch).length;LS.set('sc7_life_'+m.id,JSON.stringify(m));LS.del('sc7_'+ch)}}}
function saveAcc(){ACC.updated=now();LS.set('sc7_acc',JSON.stringify(ACC));Cloud.queue('account',()=>ACC)}
function newState(ch,name,diff){const C=CHARS[ch];return{v:3,id:uid(),char:ch,renName:ch==='ren'?name:(ACC.renName||'Ren'),diff:diff||ACC.diff||'normal',
 lv:1,xp:0,sp:2,pts:0,stats:{...C.stats},aff:{...C.aff},skills:[...C.skills],equip:C.skills.filter(s=>SK[s].type==='a').slice(0,4),
 awaken:0,trait:null,traitB:null,cls:null,bonds:{},codex:['world','resonance'],titles:[],f:{},sc:C.start,
 gold:0,inv:{draught:1,ether:1,ember:0,phoenix:0},tree:[],tomes:{},sq:{},flirt:{},romance:null,partner:null,fought:{},brank:{},pact:null,
 gear:{inv:[STARTGEAR[ch]],eq:{weapon:STARTGEAR[ch]},look:{...LOOKS[ch]},orbs:[],orbEq:[],sets:{}},
 created:now(),updated:now(),life:1}}
function migrate(s){const d=newState(s.char,s.renName||ACC.renName||'Ren',s.diff);const o=Object.assign(d,s);o.v=3;if(!o.id)o.id=uid();
 for(const k of['inv','tomes','sq','flirt','fought','brank','bonds','f'])o[k]=Object.assign(d[k]&&typeof d[k]==='object'?{...d[k]}:{},s[k]||{});if(!Array.isArray(o.tree))o.tree=[];
 if(!o.gear||!o.gear.inv)o.gear=d.gear;o.gear.look=Object.assign({...LOOKS[o.char]},o.gear.look||{});o.gear.eq=o.gear.eq||{};o.gear.orbs=o.gear.orbs||[];o.gear.orbEq=o.gear.orbEq||[];o.gear.sets=o.gear.sets||{};
 const f=o.f||{};for(const[fl,itm]of[['ribbon','x_ribbon'],['starsteel','x_starsteel'],['renStone','x_renstone'],['pendant','x_pendant'],['feather','x_feather']])if(f[fl]&&!o.gear.inv.includes(itm))o.gear.inv.push(itm);
 return o}
function setState(s){st=s;F=st.f;if(ACC.pendingPhoenix){st.inv.phoenix=(st.inv.phoenix||0)+ACC.pendingPhoenix;ACC.pendingPhoenix=0;saveAcc()}
 for(const p of ACC.pacts)if(!st.codex.includes('leg_'+p))st.codex.push('leg_'+p);
 for(const w of ACC.wardrobe||[])if(!st.gear.inv.includes(w))st.gear.inv.push(w)}
function save(){if(!st)return;st.updated=now();LS.set('sc7_life_'+st.id,JSON.stringify(st));const s=st;Cloud.queue('life_'+s.id,()=>s)}
function loadLife(id){const s=jget('sc7_life_'+id);return s?migrate(s):null}
function allLives(){const L=[];for(const k of LS.keys()){if(k&&k.startsWith('sc7_life_')){const s=jget(k);if(s&&s.char&&CHARS[s.char])L.push(s)}}return L.sort((a,b)=>(b.updated||0)-(a.updated||0))}
function deleteLife(id){LS.del('sc7_life_'+id);if(!ACC.deleted.includes(id))ACC.deleted.push(id);saveAcc();Cloud.remove('life_'+id)}
/* cloud saves: each signed-in player's lives live in their own private space of this page's database */
const Cloud={ready:false,col:null,pend:{},busy:{},tm:{},
 async init(){try{if(!window.claude||typeof window.claude.use!=='function')return;
   const [db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);if(!db||!user)return;
   const id=await user.id();if(!id)return;this.col=db.collection('data/users/'+id);
   const snap=await Promise.race([this.col.get(),new Promise((_,rej)=>setTimeout(()=>rej({code:'timeout'}),10000))]);
   for(const d of snap.docs){const data=d.data&&d.data();if(!data)continue;
    if(d.id==='account'){if((data.updated||0)>(ACC.updated||0)){const keepNarr=ACC.narr;ACC=Object.assign(ACC0(),data);ACC.narr=Object.assign(ACC0().narr,data.narr||keepNarr);LS.set('sc7_acc',JSON.stringify(ACC))}}
    else if(d.id.startsWith('life_')){if(ACC.deleted.includes(data.id)){this.col.doc(d.id).delete().catch(()=>{});continue}
     const loc=jget('sc7_life_'+data.id);if(!loc||(data.updated||0)>(loc.updated||0))LS.set('sc7_life_'+data.id,JSON.stringify(data))}}
   this.ready=true;
   for(const l of allLives())if(!snap.docs.some(d=>d.id==='life_'+l.id))this.queue('life_'+l.id,()=>jget('sc7_life_'+l.id));
   this.queue('account',()=>ACC);
   if(typeof onCloudReady==='function')onCloudReady()}catch(e){console.warn('Cloud saves unavailable',e&&e.code)}},
 queue(doc,fn){if(!this.ready)return;this.pend[doc]=fn;clearTimeout(this.tm[doc]);this.tm[doc]=setTimeout(()=>this.flush(doc),1500)},
 async flush(doc){if(this.busy[doc]){this.tm[doc]=setTimeout(()=>this.flush(doc),900);return}const fn=this.pend[doc];if(!fn)return;delete this.pend[doc];
  this.busy[doc]=true;try{const data=fn();if(data)await this.col.doc(doc).set(JSON.parse(JSON.stringify(data)))}
  catch(e){if(e&&e.code==='unavailable'&&!this.pend[doc]){this.pend[doc]=fn;this.tm[doc]=setTimeout(()=>this.flush(doc),1500+Math.random()*1500)}else console.warn('Cloud write failed',e&&e.code)}
  finally{this.busy[doc]=false}},
 remove(doc){if(!this.ready)return;delete this.pend[doc];this.col.doc(doc).delete().catch(()=>{})}};

/* ================= HELPERS USED BY THE STORY ================= */
const R=()=>st&&st.renName||ACC&&ACC.renName||'Ren';
const by=o=>o[st.char]!==undefined?o[st.char]:o._;
const primary=()=>Object.entries(st.aff).filter(([k])=>k!=='void').sort((a,b)=>b[1]-a[1])[0][0];
const rankOf=lv=>{let r='F';for(const[l,n]of RANKS)if(lv>=l)r=n;return r};
const rank=()=>rankOf(st.lv);
const pname=()=>st.char==='ren'?R():CHARS[st.char].n;
const sysMsg=m=>MSG.push(m);
const cnm=id=>id==='kael'?'Kael':id==='ren'?R():({lyra:'Lyra',torvin:'Torvin',kaida:'Kaida'})[id]||BONDN[id]||id;
function stat(k,n){st.stats[k]+=n;sysMsg(`${({str:'Strength',agi:'Agility',mana:'Mana',ctrl:'Control',spi:'Spirit'})[k]} +${n}`)}
function aff(el,n){if(st.aff[el]===undefined)return;st.aff[el]=Math.min(100,st.aff[el]+n);sysMsg(`${ELEM[el].n} affinity +${n}% → ${st.aff[el]}%`)}
const BONDN={father:'Bren · Father',mira:'Mira · Sister',maren:'Maren · Archivist',aldric:'Aldric · Recruiter',dorran:'Captain Dorran',elowen:'Archon Elowen · Grandmother',thalion:'Thalion · Cousin',hilde:'Aunt Hilde',bram:'Grandfather Bram',gimm:'Gimm · Best friend',rook:'Mama Rook',nico:'Nico · Brother',vex:'Vex Corven',lyra:'Lyra Windsong',torvin:'Torvin Deepforge',kaida:'Kaida Voss',kael:'Kael Ashford',vale:'Professor Vale',seraphine:'Headmistress Seraphine'};
function bond(who,n){if(!who||who===st.char)return;st.bonds[who]=(st.bonds[who]||0)+n;sysMsg(`${who==='ren'?R():BONDN[who]||who}: bond ${n>0?'+':''}${n}`);if(n>0&&COMP.includes(who))bondCheck(who)}
function bondCheck(who){const v=st.bonds[who]||0;let r=st.brank[who]||0;while(r<4&&v>=BRANK[r]){r++;st.brank[who]=r;bondReward(who,r)}}
const GIFT={ren:'gravity',lyra:'wind',torvin:'earth',kaida:'lightning',kael:'fire'};
function bondReward(who,r){const n=cnm(who);reward('bond',who,{rank:r});
 if(r===1){st.sp+=1;st.gold+=50;sysMsg(`♥ BOND RANK I · ${n} · Friends · +1 SP, +50 Gold`)}
 else if(r===2){sysMsg(`♥ BOND RANK II · ${n} · Trusted · New Bond Art`);learn('b_'+who)}
 else if(r===3){const el=GIFT[who];if(st.aff[el]===undefined){st.aff[el]=20;sysMsg(`♥ BOND RANK III · ${n} · Resonance Gift: you awaken ${ELEM[el].n} (20%). A new branch grows on your Tree of Life.`)}else{st.aff[el]=Math.min(100,st.aff[el]+5);sysMsg(`♥ BOND RANK III · ${n} · Resonance Gift: ${ELEM[el].n} +5%`)}title(`${n}'s Confidant`)}
 else if(r===4){sysMsg(`♥ BOND RANK IV · ${n} · Soulbound`);learn('l_'+who);if(st.romance===who)sysMsg('Heartbound: +30 HP and +10% damage while you are together')}}
function flirt(who){st.flirt[who]=(st.flirt[who]||0)+1;sysMsg(`♥ A spark with ${cnm(who)}`);bond(who,2)}
const canFlirt=who=>!st.romance||st.romance===who;
const canConfess=who=>canFlirt(who)&&(st.flirt[who]||0)>=1&&(st.bonds[who]||0)>=6;
function romance(who){st.romance=who;sysMsg(`♥ ROMANCE · You and ${cnm(who)} are together`);bond(who,3)}
function gold(n){st.gold+=n;sysMsg(`+${n} Gold`)}
function sqDone(who,stage){st.sq[who]=stage;sysMsg(`Side story progress · ${cnm(who)} ${stage}/3`);xp(20+stage*10);gold(25*stage);if(stage===3&&KEEPSAKE[who])grantOrb(KEEPSAKE[who])}
function starsteel(){grant('x_starsteel');sqDone('torvin',2)}
const partnerOptions=()=>others().concat(F.kaelFriend?['kael']:[]);
const partnerId=()=>partnerOptions().includes(st.partner)?st.partner:(F.first&&others().includes(F.first)?F.first:others()[0]);
function closest(){if(st.romance)return st.romance;let best=partnerId(),bv=st.bonds[best]||0;for(const p of partnerOptions())if((st.bonds[p]||0)>bv){best=p;bv=st.bonds[p]}return best}
function codex(id){if(!st.codex.includes(id)){st.codex.push(id);sysMsg(`Codex unlocked: ${CODEX[id][0]}`)}}
function title(t){if(!st.titles.includes(t)){st.titles.push(t);sysMsg(`Title earned: 「${t}」`);reward('title',t)}}
function learn(id){if(st.skills.includes(id))return;st.skills.push(id);const s=SK[id];sysMsg(`Skill acquired: ${s.n}`);reward('skill',id);if(s.type==='a'&&st.equip.length<4)st.equip.push(id)}
function xp(n){st.xp+=n;sysMsg(`+${n} XP`);while(st.xp>=xpNeed(st.lv)){st.xp-=xpNeed(st.lv);st.lv++;st.pts+=3;st.sp+=2;sysMsg(`LEVEL UP → Lv ${st.lv} · Rank ${rank()} · +3 stat points · +2 SP`)}}
function traitChoices(next){return CHARS[st.char].traits.map(([id,n,d,b])=>({t:n,s:d,fx:()=>{st.trait=id;st.traitB=b;st.awaken=Math.max(st.awaken,1);st.sp+=2;sysMsg(`Trait acquired: ${n}`);sysMsg('Awakening I · New branches open on your Tree of Life · +2 SP · Orb slot I unlocked');reward('awaken',1,{n});grantOrb(HOMEORB[st.char][0])},to:next}))}
function classChoices(next){return CHARS[st.char].classes.map(([n,d,b,skl],i)=>({t:n,s:d,fx:()=>{st.cls=i;st.awaken=Math.max(st.awaken,2);st.sp+=2;sysMsg(`Class Evolution: ${n}`);reward('awaken',2,{n});learn(skl);sysMsg('Awakening II · Tier 3 and Fusion skills unlocked · +2 SP · Orb slot II unlocked')},to:next}))}

/* ================= POWER CALCULATIONS ================= */
function bonus(){const B={str:0,agi:0,mana:0,ctrl:0,spi:0,hp:0,mp:0,crit:0,dodge:0,dr:0,dmg:0,heal:0,regen:0,el:{}};
 const add=o=>{if(!o)return;for(const k in o){if(k==='el'){for(const e in o.el)B.el[e]=(B.el[e]||0)+o.el[e]}else B[k]=(B[k]||0)+o[k]}};
 add(st.traitB);if(st.cls!=null)add(CHARS[st.char].classes[st.cls][2]);st.skills.forEach(s=>SK[s]&&SK[s].type==='p'&&add(SK[s].p));
 for(const id of st.tree){const d=treeDef(id);if(!d)continue;if(d.kind==='root'){B[d.stat]+=ROOTV[d.tier-1];if(d.tier===3)add(ROOTS.find(r=>r[0]===d.stat)[3])}
  else if(d.tier===2)B.el[d.el]=(B.el[d.el]||0)+.08;else if(d.tier===3)B.ctrl+=1}
 B.atk=0;B.def=0;for(const k of['weapon','armor','outfit','cloak','accessory']){const id=st.gear.eq[k];if(id&&IT[id])add(IT[id].s)}
 for(const id of st.gear.orbEq)if(ORBS[id])add(ORBS[id].b);
 if(st.pact&&ACC.pacts.includes(st.pact))add(LEG[st.pact].b);
 if(st.romance&&(st.bonds[st.romance]||0)>=15)add({hp:30,dmg:.1});
 return B}
function derived(){const B=bonus(),s=st.stats,S={str:s.str+B.str,agi:s.agi+B.agi,mana:s.mana+B.mana,ctrl:s.ctrl+B.ctrl,spi:s.spi+B.spi};
 return{S,B,atk:B.atk||0,def:B.def||0,hp:Math.round(40+st.lv*6+S.str*3+S.spi*4+B.hp),mp:Math.round(20+st.lv*3+S.mana*6+B.mp),crit:Math.min(50,5+S.agi+B.crit),dodge:Math.min(40,Math.round(S.agi*1.2+B.dodge)),dr:Math.min(.6,S.spi*.012+B.dr)}}
function canLearn(id){const s=SK[id];if(st.skills.includes(id))return[false,'Learned'];
 if(s.el==='class')return[false,'Granted by your Class Evolution'];if(s.el==='bond')return[false,'Earned through Bond Ranks'];
 if(s.req==='void'&&!F.void)return[false,'Locked'];
 if(s.el==='fusion'){if(!s.els.every(e=>st.aff[e]!==undefined))return[false,'Needs both elements'];if(st.awaken<2)return[false,'Needs Awakening II'];
  if(!s.els.every(e=>st.skills.some(k=>SK[k].el===e&&SK[k].t>=2)))return[false,'Needs a tier-2 skill in both elements'];if(st.sp<3)return[false,'Needs 3 SP'];return[true,'Learn · 3 SP']}
 const el=s.br==='void'?'gravity':s.el;if(st.aff[el]===undefined)return[false,'No affinity'];
 if(s.t>st.awaken+1)return[false,`Needs ${['','','Awakening I','Awakening II','Awakening III'][s.t]}`];
 if(s.t>1&&!st.skills.some(k=>SK[k].el===s.el&&SK[k].br===s.br&&SK[k].t===s.t-1))return[false,'Learn the previous node first'];
 if(st.sp<s.t)return[false,`Needs ${s.t} SP`];return[true,`Learn · ${s.t} SP`]}
function doLearn(id){const s=SK[id];st.sp-=s.el==='fusion'?3:s.t;const keep=MSG;MSG=[];learn(id);MSG=keep}
/* Tree of Life: status roots and elemental attunements */
function treeDef(id){if(id.startsWith('r_')){const[,stt,i]=id.split('_');const Rt=ROOTS.find(r=>r[0]===stt);if(!Rt)return null;const n=+i;
  return{kind:'root',stat:stt,tier:n,name:`Root of ${Rt[1]} ${['I','II','III'][n-1]}`,desc:`+${ROOTV[n-1]} ${Rt[1]}${n===3?'. '+Rt[4]:''}`,cost:n}}
 if(id.startsWith('a_')){const[,el,i]=id.split('_');const n=+i;if(!ELEM[el])return null;return{kind:'att',el,tier:n,name:`${ELEM[el].n} ${ATT[n-1][1]}`,desc:ATT[n-1][2].replace('this element',ELEM[el].n),cost:n}}return null}
function treeCan(id){if(st.tree.includes(id))return[false,'Unlocked'];const d=treeDef(id);
 if(d.kind==='root'){if(d.tier>1&&!st.tree.includes(`r_${d.stat}_${d.tier-1}`))return[false,'Unlock the previous root first'];if(d.tier===2&&st.lv<3)return[false,'Needs Level 3'];if(d.tier===3&&st.awaken<1)return[false,'Needs Awakening I']}
 else{if(st.aff[d.el]===undefined)return[false,'No affinity'];if(d.tier>1&&!st.tree.includes(`a_${d.el}_${d.tier-1}`))return[false,'Unlock the previous attunement first'];if(d.tier>st.awaken+1)return[false,`Needs Awakening ${['','I','II'][d.tier-1]}`]}
 if(st.sp<d.cost)return[false,`Needs ${d.cost} SP`];return[true,`Unlock · ${d.cost} SP`]}
function treeUnlock(id){const d=treeDef(id);st.sp-=d.cost;st.tree.push(id);if(d.kind==='att'){if(d.tier===1)st.aff[d.el]=Math.min(100,st.aff[d.el]+4);if(d.tier===3)st.aff[d.el]=Math.min(100,st.aff[d.el]+6)}}

/* ================= MONETIZATION ADAPTER =================
 This web version runs purchases and ads in TEST MODE: nothing is charged and no real ads load.
 For the App Store build (Capacitor), replace these three functions:
  purchase()     → StoreKit via RevenueCat (@revenuecat/purchases-capacitor) or cordova-plugin-purchase
  interstitial() → AdMob interstitial (@capacitor-community/admob)
  rewarded()     → AdMob rewarded video (@capacitor-community/admob)
 Product IDs (crowns_100, crowns_550, crowns_1200, crowns_2600, noads, starter) must match App Store Connect. */
const Monet={mode:'test',
 purchase(id){return new Promise(res=>testPurchaseSheet(id,res))},
 interstitial(){return ACC.noAds?Promise.resolve(false):new Promise(res=>adOverlay('interstitial',res))},
 rewarded(){return new Promise(res=>adOverlay('rewarded',res))}};
const PRODUCTS={noads:['Remove Ads','€2.99'],starter:['Starter Bundle','€4.99']};
STORE.packs.forEach(p=>PRODUCTS[p[0]]=[`${p[1]} · ${p[2].toLocaleString('en')} Crowns`,p[3]]);
function grantProduct(id){if(id.startsWith('crowns_'))ACC.crowns+=STORE.packs.find(p=>p[0]===id)[2];
 else if(id==='noads')ACC.noAds=true;
 else if(id==='starter'){ACC.crowns+=500;ACC.starter=true;if(st)st.inv.phoenix=(st.inv.phoenix||0)+3;else ACC.pendingPhoenix+=3}
 ACC.purchases.push({id,at:now(),test:true});saveAcc();if(st)save()}
function spendCrowns(n){if(ACC.crowns<n)return false;ACC.crowns-=n;saveAcc();return true}
function spendGold(n){if(!st||st.gold<n)return false;st.gold-=n;save();return true}
function adsLeftToday(){const d=new Date().toISOString().slice(0,10);if(ACC.adDay!==d){ACC.adDay=d;ACC.adCount=0}return ADS.perDay-ACC.adCount}
function countAd(){adsLeftToday();ACC.adCount++;saveAcc()}

/* ================= GEAR, ORBS & REWARDS ================= */
const RQ=[];
function reward(kind,id,extra){RQ.push(Object.assign({kind,id},extra||{}))}
const SLOTS=['weapon','armor','outfit','cloak','accessory'];
function grant(id,quiet){if(!IT[id])return;if(!st.gear.inv.includes(id))st.gear.inv.push(id);const t=IT[id].type;if(!st.gear.eq[t])st.gear.eq[t]=id;sysMsg(`Item acquired: ${IT[id].n} (${RAR[IT[id].rar][0]})`);if(!quiet)reward('item',id)}
const orbSlots=()=>st.awaken>=2?2:st.awaken>=1?1:0;
function grantOrb(id){if(!ORBS[id])return;if(st.gear.orbs.includes(id)){gold(80);return}st.gear.orbs.push(id);if(st.gear.orbs.length>=3||ORBS[id].tier>=3)codex('ascension');if(st.gear.orbEq.length<orbSlots())st.gear.orbEq.push(id);sysMsg(`LEGENDARY ORB: ${ORBS[id].n} · ${ORBS[id].sub}`);reward('orb',id)}
function equip(id){const t=IT[id].type;st.gear.eq[t]=id}
function unequip(t){if(t!=='weapon')delete st.gear.eq[t]}
function gearScore(){let g=0;for(const k of SLOTS){const id=st.gear.eq[k];if(!id)continue;const s=IT[id].s;g+=(s.atk||0)*3+(s.def||0)*4+(s.hp||0)*.4+(s.mp||0)*.3+(s.crit||0)*2+(s.dodge||0)*2+Object.values(s.el||{}).reduce((a,v)=>a+v*100,0)+(IT[id].pw?25:0)}
 for(const id of st.gear.orbEq)g+=ORBS[id].tier*20;return Math.round(g)}
