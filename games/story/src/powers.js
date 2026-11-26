/* ================= POWER SYSTEM ================= */
const ELEM={
 gravity:{n:'Gravity',c:'#a48bff'},lightning:{n:'Lightning',c:'#86d6ff'},wind:{n:'Wind',c:'#8fe3b0'},
 earth:{n:'Earth',c:'#d4a86b'},fire:{n:'Fire',c:'#ff8a5c'},water:{n:'Water',c:'#5cb8ff'},
 light:{n:'Light',c:'#ffe7a0'},void:{n:'Void',c:'#d6b8ff'},fusion:{n:'Fusion',c:'#ff9de2'},class:{n:'Class',c:'#ffd36b'}
};
const BR={
 gravity:[['crush','Pressure Path','Raw crushing force'],['orbit','Celestial Path','Projectiles and control'],['anchor','Bastion Path','Defense and endurance'],['void','Hollow Path','Forbidden. The element beneath gravity']],
 lightning:[['flash','Flash Path','Speed and precision'],['storm','Storm Path','Area damage and stuns']],
 wind:[['gale','Gale Path','Cutting wind'],['sky','Sky Path','Evasion and healing']],
 earth:[['stone','Stone Path','Overwhelming impact'],['iron','Iron Path','Unbreakable defense']],
 fire:[['blaze','Blaze Path','Burning offense'],['forge','Forge Path','Empowerment']],
 water:[['tide','Tide Path','Control and freezing'],['mist','Mist Path','Healing and draining']],
 light:[['radiance','Radiance Path','Holy offense. Husks fear it'],['grace','Grace Path','Healing and barriers']]
};
const SK={};
function sk(id,el,br,t,n,type,o){SK[id]=Object.assign({id,el,br,t,n,type},o)}
// Gravity
sk('g_c1','gravity','crush',1,'Pressure Point','a',{mp:6,pow:14,d:'Focus gravity on a single point. Bones creak.'});
sk('g_c2','gravity','crush',2,'Crushing Field','a',{mp:12,pow:22,stun:.3,d:'Multiply weight in a zone. 30% chance to pin the enemy for a turn.'});
sk('g_c3','gravity','crush',3,'Weight of Heaven','a',{mp:20,pow:36,stun:.45,d:'Drop the sky on one target. 45% pin chance.'});
sk('g_c4','gravity','crush',4,'Collapse Star','a',{mp:32,pow:62,d:'Compress the air into a tiny star and let it fall.'});
sk('g_o1','gravity','orbit',1,'Orbit','a',{mp:5,pow:7,hits:2,d:'Two stones circle you and strike twice.'});
sk('g_o2','gravity','orbit',2,'Meteor Lance','a',{mp:11,pow:20,pierce:1,d:'A stone accelerated to impossible speed. Ignores armor.'});
sk('g_o3','gravity','orbit',3,'Gravity Well','a',{mp:16,pow:16,weaken:.35,d:'A point that drags everything in. Enemy attack -35% for 2 turns.'});
sk('g_o4','gravity','orbit',4,'Starfall Ring','a',{mp:30,pow:16,hits:4,d:'A ring of falling stars. Four hits.'});
sk('g_a1','gravity','anchor',1,'Iron Anchor','a',{mp:6,shield:18,d:'Become immovable. Gain an 18-point barrier.'});
sk('g_a2','gravity','anchor',2,'Heavy Body','p',{p:{hp:30,dr:.05},d:'Passive. +30 HP, 5% less damage taken.'});
sk('g_a3','gravity','anchor',3,'Event Horizon','a',{mp:16,shield:30,counter:.6,d:'Barrier of bent space. Returns 60% of the next hit.'});
sk('g_a4','gravity','anchor',4,'Immovable Sovereign','p',{p:{dr:.15,hp:40},d:'Passive. +40 HP, 15% less damage taken.'});
sk('g_v1','gravity','void',1,'Hollow Touch','a',{mp:10,pow:16,drain:1,req:'void',d:'Steal the element from your enemy. Heals you for the damage dealt.'});
sk('g_v2','gravity','void',2,'Absence','p',{p:{mp:30,regen:2},req:'void',d:'Passive. +30 MP, +2 MP each turn.'});
// Lightning
sk('l_f1','lightning','flash',1,'Spark Step','a',{mp:5,pow:10,evade:1,d:'Blink and strike. You dodge the next attack.'});
sk('l_f2','lightning','flash',2,'Thunder Fang','a',{mp:10,pow:20,stun:.25,d:'A lightning-fast strike. 25% stun.'});
sk('l_f3','lightning','flash',3,'Godspeed','p',{p:{agi:5,dodge:8},d:'Passive. +5 Agility, +8% dodge.'});
sk('l_f4','lightning','flash',4,'Raijin Descent','a',{mp:28,pow:56,d:'Become the lightning bolt.'});
sk('l_s1','lightning','storm',1,'Static Skin','p',{p:{crit:6},d:'Passive. +6% critical chance.'});
sk('l_s2','lightning','storm',2,'Chain Bolt','a',{mp:11,pow:8,hits:3,d:'Lightning that jumps three times.'});
sk('l_s3','lightning','storm',3,'Thunderhead','a',{mp:20,pow:34,stun:.35,d:'Call a storm cloud. 35% stun.'});
sk('l_s4','lightning','storm',4,"Heaven's Wrath",'a',{mp:34,pow:64,d:'The sky itself answers.'});
// Wind
sk('w_g1','wind','gale',1,'Gale Cut','a',{mp:5,pow:11,d:'A blade of compressed air.'});
sk('w_g2','wind','gale',2,'Twin Cyclone','a',{mp:10,pow:11,hits:2,d:'Two spinning cyclones.'});
sk('w_g3','wind','gale',3,'Vacuum Blade','a',{mp:18,pow:34,pierce:1,d:'Air removed along a line. Ignores armor.'});
sk('w_g4','wind','gale',4,'Sky Sunder','a',{mp:30,pow:58,d:'Split the sky in two.'});
sk('w_s1','wind','sky',1,'Tailwind','p',{p:{agi:3,dodge:4},d:'Passive. +3 Agility, +4% dodge.'});
sk('w_s2','wind','sky',2,'Zephyr Mend','a',{mp:10,heal:24,d:'A warm wind that closes wounds.'});
sk('w_s3','wind','sky',3,'Eye of the Storm','a',{mp:16,shield:26,buff:1,d:'Barrier plus +40% damage for 2 turns.'});
sk('w_s4','wind','sky',4,'Sky Dancer','p',{p:{dodge:12,crit:8},d:'Passive. +12% dodge, +8% crit.'});
// Earth
sk('e_s1','earth','stone',1,'Rock Fist','a',{mp:5,pow:12,d:'A fist of living stone.'});
sk('e_s2','earth','stone',2,'Quake','a',{mp:11,pow:19,stun:.3,d:'Shake the ground. 30% stun.'});
sk('e_s3','earth','stone',3,'Mountain Breaker','a',{mp:20,pow:38,pierce:1,d:'A blow that cracks mountains. Ignores armor.'});
sk('e_s4','earth','stone',4,"Titan's Wrath",'a',{mp:32,pow:62,d:'The mountain stands up.'});
sk('e_i1','earth','iron',1,'Stoneskin','a',{mp:5,shield:16,d:'Skin like granite. 16-point barrier.'});
sk('e_i2','earth','iron',2,'Ironblood','p',{p:{hp:40},d:'Passive. +40 HP.'});
sk('e_i3','earth','iron',3,'Bulwark','a',{mp:14,shield:38,d:'A wall of stone. 38-point barrier.'});
sk('e_i4','earth','iron',4,'Unbreakable','p',{p:{dr:.18},d:'Passive. 18% less damage taken.'});
// Fire
sk('f_b1','fire','blaze',1,'Ember Shot','a',{mp:5,pow:11,d:'A bolt of flame.'});
sk('f_b2','fire','blaze',2,'Flame Wheel','a',{mp:11,pow:8,hits:3,d:'A spinning wheel of fire. Three hits.'});
sk('f_b3','fire','blaze',3,'Inferno','a',{mp:22,pow:38,d:'Everything burns.'});
sk('f_f1','fire','forge',1,'Forge Heat','p',{p:{str:3},d:'Passive. +3 Strength.'});
sk('f_f2','fire','forge',2,'Molten Edge','a',{mp:8,buff:1,d:'+40% damage for 2 turns.'});
sk('f_f3','fire','forge',3,'Heart of the Furnace','p',{p:{dmg:.12},d:'Passive. +12% to all damage.'});
// Water
sk('wa_t1','water','tide',1,'Tide Lash','a',{mp:5,pow:10,d:'A whip of seawater.'});
sk('wa_t2','water','tide',2,'Ice Prison','a',{mp:12,pow:14,stun:.5,d:'Freeze the enemy. 50% stun.'});
sk('wa_t3','water','tide',3,'Maelstrom','a',{mp:22,pow:36,d:'Drown the battlefield.'});
sk('wa_m1','water','mist',1,'Mist Veil','p',{p:{dodge:6},d:'Passive. +6% dodge.'});
sk('wa_m2','water','mist',2,'Healing Tide','a',{mp:10,heal:26,d:'Water that mends.'});
sk('wa_m3','water','mist',3,'Abyssal Current','a',{mp:18,pow:22,drain:1,d:'Pull the life out of your enemy.'});
// Light
sk('li_r1','light','radiance',1,'Radiant Shot','a',{mp:5,pow:11,d:'A bolt of pure light.'});
sk('li_r2','light','radiance',2,'Prism Lance','a',{mp:12,pow:21,pierce:1,d:'Light split and refocused. Ignores armor.'});
sk('li_r3','light','radiance',3,'Judgement','a',{mp:24,pow:40,d:'A pillar of light from above.'});
sk('li_g1','light','grace',1,'Mend','a',{mp:8,heal:22,d:'Heal 22 HP.'});
sk('li_g2','light','grace',2,'Sanctuary','a',{mp:12,shield:26,d:'A dome of light. 26-point barrier.'});
sk('li_g3','light','grace',3,'Halo','p',{p:{spi:4,heal:.3},d:'Passive. +4 Spirit, +30% healing.'});
// Fusions: need tier-2 skills in both elements and Awakening II
sk('fu_rail','fusion','fusion',3,'Railgun Meteor','a',{mp:26,pow:50,pierce:1,els:['gravity','lightning'],d:'Gravity + Lightning. A meteor fired like a bullet. Ignores armor.'});
sk('fu_vac','fusion','fusion',3,'Vacuum Collapse','a',{mp:24,pow:42,stun:.5,els:['gravity','wind'],d:'Gravity + Wind. Rip the air away and crush what remains. 50% stun.'});
sk('fu_dawn','fusion','fusion',3,'Dawn Gale','a',{mp:24,pow:34,heal:20,els:['wind','light'],d:'Wind + Light. A storm of sunlight that also heals you.'});
sk('fu_magma','fusion','fusion',3,'Magma Titan','a',{mp:26,pow:48,els:['earth','fire'],d:'Earth + Fire. Molten stone in the shape of a giant fist.'});
sk('fu_storm','fusion','fusion',3,'Storm Tide','a',{mp:24,pow:15,hits:3,stun:.3,els:['lightning','water'],d:'Lightning + Water. An electrified tidal wave.'});
// Class skills (granted by Class Evolution)
sk('c_king','class','class',3,"King's Decree",'a',{mp:24,pow:52,stun:.5,d:'Sovereign of Weight. Command the enemy to kneel.'});
sk('c_const','class','class',3,'Constellation','a',{mp:26,pow:12,hits:5,d:'Star Shepherd. Five stars strike.'});
sk('c_bastion','class','class',3,'Bastion of Gravemont','a',{mp:20,shield:55,counter:.8,d:'The Immovable. Huge barrier, returns 80% of the next hit.'});
sk('c_tempest','class','class',3,'Tempest Volley','a',{mp:24,pow:13,hits:4,d:'Tempest Archer. Four wind arrows.'});
sk('c_dawn','class','class',3,"Warden's Dawn",'a',{mp:22,heal:40,shield:25,d:'Dawn Warden. Heal 40 and shield 25.'});
sk('c_dance','class','class',3,'Thousand Feathers','a',{mp:22,pow:30,evade:1,buff:1,d:'Skydancer. Strike, dodge, and empower yourself.'});
sk('c_rune','class','class',3,'Runebrand','a',{mp:20,pow:30,weaken:.4,d:'Runesmith. Brand the enemy. Their attack -40%.'});
sk('c_mount','class','class',3,'Mountain Throne','a',{mp:22,shield:45,pow:20,d:'Mountain King. Strike and raise a 45-point wall.'});
sk('c_magma','class','class',3,'Lava Breaker','a',{mp:26,pow:54,d:'Magma Breaker. A blow that turns stone to lava.'});
sk('c_phantom','class','class',3,'Phantom Circuit','a',{mp:22,pow:11,hits:4,evade:1,d:'Storm Phantom. Four lightning-fast strikes, then vanish.'});
sk('c_tide','class','class',3,"Tidecaller's Hymn",'a',{mp:22,heal:30,pow:24,stun:.4,d:'Tidecaller. Damage, heal, and 40% stun.'});
sk('c_rail','class','class',3,'Overdrive Rail','a',{mp:26,pow:56,pierce:1,d:'Railrunner. Become a living railgun.'});

const RANKS=[[1,'F'],[3,'E'],[5,'D'],[7,'C'],[9,'B'],[11,'A'],[14,'S']];
const AWAKEN=['Unawakened','Awakening I · Kindled','Awakening II · Forged','Awakening III · Ascendant'];
const xpNeed=l=>30+l*25;

/* ---------- bond arts (earned through Bond Ranks, not bought) ---------- */
ELEM.bond={n:'Bond',c:'#ff9ec4'};ELEM.legend={n:'Legend',c:'#ffd36b'};
sk('b_ren','bond','bond',2,'Gravity Assist','a',{mp:12,pow:26,stun:.4,d:'Ren pins the enemy to the ground while you strike. 40% stun.'});
sk('b_lyra','bond','bond',2,'Starlight Volley','a',{mp:12,pow:9,hits:4,d:'Lyra\'s arrows and your power, falling together. Four hits.'});
sk('b_torvin','bond','bond',2,'Forgewall Strike','a',{mp:12,pow:20,shield:30,d:'Torvin raises a wall of stone; you strike from behind it.'});
sk('b_kaida','bond','bond',2,'Thunder Relay','a',{mp:12,pow:30,pierce:1,d:'Kaida passes you her lightning mid-strike. Ignores armor.'});
sk('b_kael','bond','bond',2,'Twin Flames','a',{mp:12,pow:28,buff:1,d:'Kael\'s fire wraps around your attack. +40% damage for 2 turns.'});
sk('l_ren','bond','bond',4,'Soulbound: Event Horizon','a',{mp:24,pow:58,stun:.5,d:'You and Ren bend space together. 50% stun.'});
sk('l_lyra','bond','bond',4,'Soulbound: Dawnwind','a',{mp:24,pow:40,heal:30,d:'A storm of light-arrows that heals you as it strikes.'});
sk('l_torvin','bond','bond',4,'Soulbound: Mountain Oath','a',{mp:22,pow:30,shield:60,d:'Torvin\'s oath made stone. Huge barrier.'});
sk('l_kaida','bond','bond',4,'Soulbound: Stormheart','a',{mp:24,pow:15,hits:4,evade:1,d:'Four strikes riding the same lightning, then vanish.'});
sk('l_kael','bond','bond',4,'Soulbound: Dragonheart','a',{mp:26,pow:62,buff:1,d:'Fire-sworn power. +40% damage for 2 turns.'});

/* ---------- the Tree of Life: roots (status) and attunements ---------- */
const ROOTS=[['str','Strength','Physical power and HP',{hp:30},'Titan Root: +30 HP'],['agi','Agility','Crit and dodge',{dodge:5},'Windstep Root: +5% dodge'],
 ['mana','Mana','Your MP pool',{regen:2},'Wellspring Root: +2 MP per turn'],['ctrl','Control','Skill damage',{crit:5},'Precision Root: +5% crit'],['spi','Spirit','HP, healing and defense',{dr:.05},'Ironheart Root: 5% less damage taken']];
const ROOTV=[2,3,4];
const ATT=[[1,'Attunement I','+4% affinity in this element'],[2,'Attunement II','+8% damage with this element'],[3,'Attunement III','+6% affinity and +1 Control']];
const ELEMG={gravity:'◉',lightning:'ϟ',wind:'≋',earth:'▲',fire:'✶',water:'≈',light:'✧',void:'○',fusion:'❖',class:'♛',bond:'♥',legend:'✦'};

/* ---------- v4: new class skills and a new fusion ---------- */
sk('c_abyss','class','class',3,'Abyssal Gate','a',{mp:24,pow:50,pierce:1,d:'Abyss Warden. Open the deep beneath your enemy. Ignores armor.'});
sk('c_pearl','class','class',3,'Pearl Choir','a',{mp:22,pow:20,heal:40,shield:25,d:'Pearl Oracle. A song that heals, shields and strikes.'});
sk('c_levi','class','class',3,'Leviathan\'s Wake','a',{mp:24,pow:14,hits:4,stun:.3,d:'Leviathan Rider. Four crashing waves. 30% stun.'});
sk('c_dawnb','class','class',3,'Dawnbreak','a',{mp:24,pow:54,d:'Dawnbringer. The sun rises inside your enemy.'});
sk('c_prism','class','class',3,'Prism Storm','a',{mp:24,pow:12,hits:5,d:'Prism Weaver. Light split into five blades.'});
sk('c_lantern','class','class',3,'Lantern of Saints','a',{mp:22,heal:50,shield:30,d:'Lantern Saint. Heal 50 and shield 30.'});
sk('fu_pearl','fusion','fusion',3,'Pearl Halo','a',{mp:24,pow:30,heal:25,shield:20,els:['water','light'],d:'Water + Light. A ring of shining water that strikes, heals and shields.'});
