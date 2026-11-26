/* ================= LOOKS, GEAR, ORBS ================= */
const RAR={common:['Common','#b8bccb'],rare:['Rare','#5cb8ff'],epic:['Epic','#b98bff'],legendary:['Legendary','#ffd36b'],mythic:['Mythic','#ff5c8a']};
const LOOKOPT={
 skin:['#f7e1cf','#f3d2b4','#e8bf98','#d9a27a','#b98463','#8d5b3e','#6b4430','#9fd3d0','#d6e6ff','#e8d6ff'],
 hair:['messy','spiky','long','wavy','short','ponytail','bob','swept','braid','bun','mohawk','shaved'],
 hairC:['#1d1b26','#2b2522','#5a3a22','#b5562b','#d9a441','#f3e3b0','#e8edf2','#c0392b','#2f8f9a','#7b5cff','#ff9ec4','#3a7a4a'],
 eyes:['#a48bff','#5fc98f','#86d6ff','#d4a86b','#ffb36a','#5cb8ff','#ffe7a0','#c0392b','#2a2040','#e8edf2'],
 outfit:['tunic','robe','coat','jacket','apron','scale','dress'],
 outC:['#5a4632','#2f5a48','#4a3a2a','#2a2f45','#1f5f78','#f4ecd0','#7a1f1f','#2b2250','#1b1b22','#3a5a8a'],
 trim:['#c9a24a','#e8edf2','#c98a3a','#86d6ff','#ff9ec4','#ffd36b','#8fe3b0','#ff8a5c'],
 mark:['none','scar','freckles','runes','scales','soot','glow'],
 ears:['human','elf','fin','pointy'],
 beard:['none','short','braided','long'],
 extra:['none','goggles','wings','gills','halo','horns'],
 build:['slim','average','stout']};
const LOOKS={
 ren:{skin:'#e8bf98',hair:'messy',hairC:'#2b2522',eyes:'#a48bff',outfit:'tunic',outC:'#5a4632',trim:'#c9a24a',mark:'none',ears:'human',beard:'none',extra:'none',build:'average',aura:'#a48bff'},
 lyra:{skin:'#f7e1cf',hair:'long',hairC:'#e8edf2',eyes:'#5fc98f',outfit:'robe',outC:'#2f5a48',trim:'#e8edf2',mark:'glow',ears:'elf',beard:'none',extra:'none',build:'slim',aura:'#8fe3b0'},
 torvin:{skin:'#d9a27a',hair:'short',hairC:'#b5562b',eyes:'#d4a86b',outfit:'apron',outC:'#4a3a2a',trim:'#c98a3a',mark:'soot',ears:'human',beard:'braided',extra:'none',build:'stout',aura:'#d4a86b'},
 kaida:{skin:'#b98463',hair:'ponytail',hairC:'#1d1b26',eyes:'#86d6ff',outfit:'jacket',outC:'#2a2f45',trim:'#86d6ff',mark:'scar',ears:'human',beard:'none',extra:'goggles',build:'slim',aura:'#86d6ff'},
 nerissa:{skin:'#9fd3d0',hair:'wavy',hairC:'#2f8f9a',eyes:'#5cb8ff',outfit:'scale',outC:'#1f5f78',trim:'#f4ecd0',mark:'scales',ears:'fin',beard:'none',extra:'gills',build:'average',aura:'#5cb8ff'},
 pip:{skin:'#f7e1cf',hair:'bob',hairC:'#d9a441',eyes:'#ffe7a0',outfit:'dress',outC:'#f4ecd0',trim:'#ffd36b',mark:'glow',ears:'pointy',beard:'none',extra:'wings',build:'slim',aura:'#ffe7a0'},
 kael:{skin:'#f3d2b4',hair:'swept',hairC:'#c0392b',eyes:'#ffb36a',outfit:'coat',outC:'#7a1f1f',trim:'#ffd36b',mark:'none',ears:'human',beard:'none',extra:'none',build:'average',aura:'#ff8a5c'},
 maren:{skin:'#e8d6ff',hair:'long',hairC:'#e8edf2',eyes:'#2a2040',outfit:'robe',outC:'#1b1b22',trim:'#a48bff',mark:'glow',ears:'human',beard:'none',extra:'none',build:'slim',aura:'#a48bff'},
 seraphine:{skin:'#f7e1cf',hair:'bun',hairC:'#f3f3f8',eyes:'#86d6ff',outfit:'robe',outC:'#e8edf2',trim:'#86d6ff',mark:'none',ears:'elf',beard:'none',extra:'none',build:'slim',aura:'#e8edf2'},
 vale:{skin:'#f3d2b4',hair:'swept',hairC:'#b8bccb',eyes:'#e8edf2',outfit:'coat',outC:'#8a8fa0',trim:'#e8edf2',mark:'none',ears:'human',beard:'short',extra:'none',build:'slim',aura:'#d6b8ff'}};
/* items: type weapon|armor|outfit|cloak|accessory; wt = weapon shape; c = colors [main, accent, glow] */
const IT={};
function it(id,n,type,rar,o){IT[id]=Object.assign({id,n,type,rar,s:{}},o)}
// weapons
it('w_farm','Farmhand\'s Gauntlets','weapon','common',{wt:'gauntlet',c:['#7a5a3a','#c9a24a','#c9a24a'],s:{atk:4},d:'Patched leather gloves from Emberfall. They have lifted a lot of hay.'});
it('w_orbit','Maren\'s Orbit Stones','weapon','epic',{wt:'gauntlet',c:['#2a2040','#a48bff','#c8b4ff'],s:{atk:10,el:{gravity:.1}},d:'Three black stones that circle your fists, from the last scholar of Gravemont.'});
it('w_keystone','Gauntlets of the Keystone','weapon','legendary',{wt:'gauntlet',c:['#141020','#ffd36b','#a48bff'],s:{atk:15,crit:6,el:{gravity:.15}},d:'Forged from a shard of the Keystone Crown.',pw:{n:'Singularity Stance',d:'For 3 turns: +50% damage and enemy attacks are 30% weaker.',dmg:.5,weak:.3}});
it('w_bow1','Silverwood Longbow','weapon','rare',{wt:'bow',c:['#d8e6e2','#5fc98f','#e8edf2'],s:{atk:7,crit:4},d:'Carved from a living silver tree that agreed to the cut.'});
it('w_bow2','Windsong Bow','weapon','epic',{wt:'bow',c:['#e8edf2','#8fe3b0','#c6ffe0'],s:{atk:11,crit:6,el:{wind:.08}},d:'The bow of the Windsong line. It hums when the wind changes.'});
it('w_bowL','Sylphae\'s Last Feather','weapon','legendary',{wt:'bow',c:['#ffffff','#8fe3b0','#ffffff'],s:{atk:16,crit:8,el:{wind:.15}},d:'A bow strung with a single hair of the First Dragon of Wind.',pw:{n:'White Wind',d:'For 3 turns: +40% damage and you dodge almost everything.',dmg:.4,dodge:60}});
it('w_ham0','Apprentice Hammer','weapon','common',{wt:'hammer',c:['#6b6b74','#8a5a3a','#c98a3a'],s:{atk:5,def:1},d:'Every Deepforge starts with this hammer. Most of them break it.'});
it('w_proving','Blade of the Proving','weapon','rare',{wt:'blade',c:['#b8bccb','#ff8a5c','#ffb36a'],s:{atk:9,el:{fire:.06}},d:'The blade you forged on the day of your Proving. It did not break.'});
it('w_hamL','Hammer of Durin Deepforge','weapon','legendary',{wt:'hammer',c:['#3a3a44','#ffd36b','#ff9a4a'],s:{atk:15,def:3,hp:30,el:{earth:.12}},d:'Your clan\'s oldest hammer. It was in Durin\'s hand when the Seal closed.',pw:{n:'Mountain-Heart',d:'For 3 turns: +40% damage and 30% less damage taken.',dmg:.4,dr:.3}});
it('w_dag0','Copper Shock-Knives','weapon','common',{wt:'daggers',c:['#c98a3a','#86d6ff','#86d6ff'],s:{atk:5,crit:5},d:'Two knives wired to a stolen spark-coil. Mind the fingers.'});
it('w_dagE','Warden-Core Blades','weapon','epic',{wt:'daggers',c:['#c9a24a','#86d6ff','#e8f7ff'],s:{atk:10,crit:8,el:{lightning:.08}},d:'Built from the lightning core of an Arc Warden.'});
it('w_tri0','Coral Trident','weapon','common',{wt:'trident',c:['#ff9e8a','#f4ecd0','#5cb8ff'],s:{atk:5,hp:15},d:'Grown, not forged, in the reefs of the Tide Courts.'});
it('w_triL','Trident of the Drowned Fleet','weapon','legendary',{wt:'trident',c:['#1f5f78','#ffd36b','#5cb8ff'],s:{atk:15,hp:30,el:{water:.15}},d:'Carried by the Thalassan admiral who sailed into the Abyss beside Queen Isolde.',pw:{n:'Tidal Sovereign',d:'For 3 turns: +45% damage and you heal 10% HP every turn.',dmg:.45,heal:.1}});
it('w_wand0','Dawnspark Wand','weapon','common',{wt:'wand',c:['#f4ecd0','#ffd36b','#ffe7a0'],s:{atk:4,mp:15},d:'A lamplighter\'s wand. It has lit ten thousand lanterns.'});
it('w_wandL','The Oracle\'s Lantern','weapon','legendary',{wt:'wand',c:['#fff6d4','#ffd36b','#ffffff'],s:{atk:14,mp:30,el:{light:.15}},d:'The Oracle\'s own lantern, given to the small light who must walk beside the weight.',pw:{n:'Dawnbringer',d:'For 3 turns: +45% damage, and husks burn in your light.',dmg:.45,crit:15}});
it('w_ember','Ashford Ember-Blade','weapon','epic',{wt:'blade',c:['#2a1418','#ff8a5c','#ffd36b'],s:{atk:12,el:{fire:.1}},d:'The blade of Kael\'s brother. Kael gave it to you.'});
it('w_hollow','Vale\'s Hollow Scepter','weapon','mythic',{wt:'wand',c:['#141020','#d6b8ff','#a48bff'],s:{atk:18,mp:30,el:{gravity:.1,void:.2}},d:'A broken piece of the Hollow Crown, set on a silver rod. It whispers.',pw:{n:'Hollow Crown',d:'For 3 turns: +60% damage and you drain 30% of the damage you deal.',dmg:.6,drain:.3}});
// drops (generic)
it('w_iron','Iron Gauntlets','weapon','common',{wt:'gauntlet',c:['#8a8f9a','#5a5f6a','#b8bccb'],s:{atk:6},d:'Standard issue for Pyrrhos border guards.'});
it('w_hunter','Hunter\'s Recurve','weapon','common',{wt:'bow',c:['#7a5a3a','#3a2a20','#c9a24a'],s:{atk:6,crit:3},d:'Good for deer. Better for husks.'});
it('w_steel','Steel Warhammer','weapon','rare',{wt:'hammer',c:['#b8bccb','#5a3a22','#e8edf2'],s:{atk:9,def:2},d:'Heavy enough to make a point.'});
it('w_oak','Oakheart Staff','weapon','rare',{wt:'wand',c:['#7a5a3a','#8fe3b0','#c6ffe0'],s:{atk:7,mp:25},d:'A staff cut from a tree that remembers the Accord.'});
// armor
it('a_leather','Traveler\'s Leathers','armor','common',{c:['#7a5a3a','#3a2a20'],s:{def:2,hp:20},d:'Road-worn and comfortable.'});
it('a_chain','Chain Shirt','armor','common',{c:['#8a8f9a','#5a5f6a'],s:{def:3,hp:10},d:'Clinks when you run.'});
it('a_moss','Moss-Granite Pauldrons','armor','rare',{c:['#5a6b4a','#8fe3b0'],s:{def:4,hp:30},d:'Broken off the Labyrinth Golem. Still a little mossy.'});
it('a_deep','Deepforge Mail','armor','rare',{c:['#6b6b74','#c98a3a'],s:{def:5,hp:25},d:'Dwarf-made. It will outlive you.'});
it('a_glass','Glassblack Mail','armor','epic',{c:['#141020','#a48bff'],s:{def:6,hp:40,el:{gravity:.05}},d:'Forged from the shards of a Hollow Sentinel.'});
// outfits (clothing)
it('o_arcanum','Arcanum Uniform','outfit','rare',{c:['#26305a','#ffd36b'],sty:'coat',s:{mp:10},d:'The deep blue coat of an Arcanum student, gold at the seams.'});
it('o_dragon','Dragonrider Regalia','outfit','epic',{c:['#7a1f1f','#ffd36b'],sty:'coat',s:{},d:'Cosmetic. The red and gold of the Ember Throne\'s dragon knights.',shop:300});
it('o_tidecaller','Tidecaller Robes','outfit','epic',{c:['#1f5f78','#f4ecd0'],sty:'robe',s:{},d:'Cosmetic. Pearl-stitched robes of the Tide Courts.',shop:300});
it('o_silver','Silver Court Raiment','outfit','epic',{c:['#e8edf2','#5fc98f'],sty:'robe',s:{},d:'Cosmetic. Worn at the Archon\'s feasts.',shop:300});
it('o_forge','Deepforge Festival Garb','outfit','epic',{c:['#5a3a22','#ff8a5c'],sty:'apron',s:{},d:'Cosmetic. For the night the forges sing.',shop:300});
it('o_neon','Neon Runner Jacket','outfit','epic',{c:['#151515','#86d6ff'],sty:'jacket',s:{},d:'Cosmetic. Glows faintly on Sparkhaven rooftops.',shop:300});
it('o_hollow','Hollow Prince Attire','outfit','legendary',{c:['#141020','#a48bff'],sty:'coat',s:{},d:'Cosmetic. Modeled on a portrait of Prince Caedric. Bold choice.',shop:600});
// cloaks
it('c_road','Wool Traveling Cloak','cloak','common',{c:['#5a4632','#c9a24a'],s:{hp:15},d:'Keeps the rain out. Mostly.'});
it('c_silverwood','Silverwood Cloak','cloak','rare',{c:['#d8e6e2','#5fc98f'],s:{dodge:4,hp:10},d:'Your grandmother\'s parting gift at the Night Gate.'});
it('c_archive','Archivist\'s Shawl','cloak','rare',{c:['#2b2250','#a48bff'],s:{mp:20},d:'Maren wore it for three hundred years. It still smells of old books.'});
it('c_champion','Champion\'s Cloak','cloak','epic',{c:['#7a1f1f','#ffd36b'],s:{hp:30,crit:4},d:'Awarded to the winner of the Tournament of Seven.'});
it('c_blackmoon','Mantle of the Black Moon','cloak','legendary',{c:['#0d0b1c','#d6b8ff'],s:{hp:50,def:3,dodge:5},d:'Woven from the night the seals broke. The stars in it move.',pw:{n:'Black Moon',d:'For 3 turns: +40% damage and +40% dodge.',dmg:.4,dodge:40}});
// accessories
it('x_pendant','Pendant of Seven Rings','accessory','epic',{art:'amulet',c:['#141020','#a48bff'],s:{mp:15,el:{gravity:.1}},d:'Your mother left it for you. It hums near gravity.'});
it('x_feather','Feather of Sylphae','accessory','epic',{art:'feather',c:['#ffffff','#8fe3b0'],s:{dodge:6,el:{wind:.1}},d:'Kept by the Archon for three hundred years.'});
it('x_ribbon','Aelira\'s Ribbon','accessory','epic',{art:'ribbon',c:['#e8edf2','#ffd36b'],s:{spi:2,heal:.05},d:'She wore it in every painting.'});
it('x_starsteel','Starsteel Band','accessory','epic',{art:'band',c:['#e8f7ff','#86d6ff'],s:{str:2,hp:25},d:'A promise in metal: whatever comes for you has to get through Torvin first.'});
it('x_renstone','Ren\'s Floating Stone','accessory','epic',{art:'stone',c:['#2b2522','#a48bff'],s:{ctrl:2},d:'It floats as long as he lives.'});
it('x_badge','Directorate Badge','accessory','rare',{art:'badge',c:['#c9a24a','#86d6ff'],s:{agi:2},d:'Vex Corven\'s. He wants it back. He is not getting it back.'});
it('x_scale','Ember\'s First Scale','accessory','epic',{art:'scale',c:['#c0392b','#ffd36b'],s:{hp:20,el:{fire:.08}},d:'Shed by a baby dragon who decided she likes you.'});
it('x_arrowhead','Aelira\'s Arrowhead','accessory','epic',{art:'feather',c:['#f4ecd0','#e8edf2'],s:{agi:1,crit:4},d:'Elves give these to the ones who guard their back.'});
it('x_carved','Torvin\'s Carved Stone','accessory','epic',{art:'stone',c:['#b8a07a','#ffd36b'],s:{def:2,hp:20},d:'Your name, in dwarf-runes.'});
it('x_firering','Fire-Sworn Ring','accessory','epic',{art:'ring',c:['#ffd36b','#ff8a5c'],s:{atk:5},d:'Where you fight, he fights.'});
it('x_pearl','Pearl of the Tide Courts','accessory','rare',{art:'amulet',c:['#f4ecd0','#5cb8ff'],s:{mp:15},d:'A black pearl from the Trench, gifted by the Tide Queen.'});
it('x_copper','Copper Ring','accessory','common',{art:'ring',c:['#c98a3a','#ffb36a'],s:{crit:2},d:'Slightly green on the inside.'});
const DROPS=['w_iron','w_hunter','w_steel','w_oak','a_leather','a_chain','c_road','x_copper'];
const STARTGEAR={ren:'w_farm',lyra:'w_bow1',torvin:'w_ham0',kaida:'w_dag0',nerissa:'w_tri0',pip:'w_wand0'};
/* legendary orbs: 7 nations x 5 */
const NATION={pyrrhos:['Pyrrhos','fire','#ff8a5c','#ffd36b'],thalassa:['Thalassa','water','#5cb8ff','#d9f6ff'],kharak:['Kharak','earth','#d4a86b','#fff0c8'],sylvaris:['Sylvaris','wind','#8fe3b0','#f0fff6'],voltara:['Voltara','lightning','#86d6ff','#ffffff'],lumeria:['Lumeria','light','#ffe7a0','#ffffff'],gravemont:['Gravemont','gravity','#a48bff','#2a1a4a']};
const ORBS={};const ORBT=['Lesser','Greater','Grand','Mythic','Transcendent'];
function orb(id,nat,tier,n,sub,b,bd,art,d,where){const N=NATION[nat];ORBS[id]={id,nat,el:N[1],tier,n,sub,b,bd,art,d,where,c:[N[2],N[3]]}}
orb('o_ember','pyrrhos',1,'Ember Orb','Flame',{el:{fire:.08}},'+8% fire damage',{n:'Ember Burst',pow:30},'The first spark Ignaris ever gave.','Volume I');
orb('o_magma','pyrrhos',2,'Magma Orb','Lava',{el:{fire:.12},hp:20},'+12% fire damage, +20 HP',{n:'Molten Fist',pow:42,pierce:1},'Fire that remembers being stone.','Volume II');
orb('o_solar','pyrrhos',3,'Solar Orb','Sunfire',{el:{fire:.15},crit:4},'+15% fire damage, +4% crit',{n:'Solar Flare',pow:26,hits:2,stun:.3},'A shard of noon, kept in glass.','Volume II');
orb('o_phoenix','pyrrhos',4,'Phoenix Orb','Rebirth',{el:{fire:.2},heal:.2},'+20% fire damage, +20% healing',{n:'Phoenix Rising',pow:40,healPct:.5},'It has died a thousand times. It does not mind.','Volume III');
orb('o_dragonheart','pyrrhos',5,'Dragonheart Orb','Dragonfire',{el:{fire:.3},dmg:.1},'+30% fire damage, +10% all damage',{n:'Transcend: Dragon Sovereign',pow:80,buff:1,trans:1},'The heart of Ignaris, the First Flame. Whoever holds it is no longer only human.','Volume III');
orb('o_tide','thalassa',1,'Tide Orb','Tide',{el:{water:.08}},'+8% water damage',{n:'Riptide',pow:28,weaken:.2},'It rises and falls with a sea that is not there.','Volume I');
orb('o_frost','thalassa',2,'Frost Orb','Ice',{el:{water:.12},def:2},'+12% water damage, +2 defense',{n:'Glacial Prison',pow:30,stun:.6},'Cold enough to freeze a scream.','Volume I');
orb('o_abyss','thalassa',3,'Abyss Orb','Deep Pressure',{el:{water:.15},hp:30},'+15% water damage, +30 HP',{n:'Crushing Deep',pow:50,pierce:1},'The weight of the whole ocean, folded small.','Volume II');
orb('o_typhoon','thalassa',4,'Typhoon Orb','Storm-sea',{el:{water:.2,lightning:.1}},'+20% water, +10% lightning damage',{n:'Typhoon',pow:16,hits:4},'Where the sea and the sky stop being polite.','Volume III');
orb('o_leviathan','thalassa',5,'Leviathan Orb','Primordial Sea',{el:{water:.3},hp:60},'+30% water damage, +60 HP',{n:'Transcend: Leviathan',pow:80,healPct:.3,trans:1},'An eye of Thalor, the Deep. It blinks.','Volume III');
orb('o_stone','kharak',1,'Stone Orb','Stone',{el:{earth:.08},def:1},'+8% earth damage, +1 defense',{n:'Stone Wall',shield:40},'A pebble from the first mountain.','Volume I');
orb('o_crystal','kharak',2,'Crystal Orb','Crystal',{el:{earth:.12},crit:4},'+12% earth damage, +4% crit',{n:'Crystal Lances',pow:14,hits:3},'Stone that learned to hold light.','Volume I');
orb('o_iron','kharak',3,'Iron Orb','Metal',{def:4,hp:30},'+4 defense, +30 HP',{n:'Iron Maiden',shield:60,pow:20},'The dwarves say metal is earth that made a decision.','Volume II');
orb('o_lodestone','kharak',4,'Lodestone Orb','Magnetism',{el:{earth:.2,lightning:.1}},'+20% earth, +10% lightning damage',{n:'Magnetic Pull',pow:44,stun:.5},'It points north. It always points north. North is Gravemont.','Volume III');
orb('o_titan','kharak',5,'Titan Orb','Mountain-Heart',{el:{earth:.3},def:6},'+30% earth damage, +6 defense',{n:'Transcend: Titan',pow:78,shield:60,trans:1},'Part of Grundmaw\'s heart. Kharak itself is his sleeping body.','Volume III');
orb('o_gale','sylvaris',1,'Gale Orb','Gale',{el:{wind:.08},dodge:3},'+8% wind damage, +3% dodge',{n:'Gale Slash',pow:28},'A gust that never stopped blowing.','Volume I');
orb('o_sky','sylvaris',2,'Sky Orb','Flight',{dodge:8},'+8% dodge',{n:'Skyward',pow:20,evade:1,buff:1},'Hold it and you weigh a little less.','Volume I');
orb('o_tempest','sylvaris',3,'Tempest Orb','Hurricane',{el:{wind:.15},crit:4},'+15% wind damage, +4% crit',{n:'Hurricane',pow:15,hits:4},'Elves are not allowed to open it indoors.','Volume II');
orb('o_silence','sylvaris',4,'Silence Orb','Vacuum',{el:{wind:.2}},'+20% wind damage',{n:'Breathless',pow:48,stun:.5,pierce:1},'Inside it, there is no air at all. Not even sound.','Volume III');
orb('o_sylphae','sylvaris',5,'Breath of Sylphae','Primordial Wind',{el:{wind:.3},dodge:10},'+30% wind damage, +10% dodge',{n:'Transcend: White Wind',pow:76,evade:1,trans:1},'The last breath of the First Dragon of Wind.','Volume III');
orb('o_spark','voltara',1,'Spark Orb','Spark',{el:{lightning:.08},crit:2},'+8% lightning damage, +2% crit',{n:'Spark Lance',pow:30},'Caught from a falling bolt above Sparkhaven.','Volume I');
orb('o_plasma','voltara',2,'Plasma Orb','Plasma',{el:{lightning:.12}},'+12% lightning damage',{n:'Plasma Arc',pow:36,pierce:1},'Lightning too hot to be lightning anymore.','Volume I');
orb('o_thunder','voltara',3,'Thunder Orb','Thunder',{el:{lightning:.15},crit:4},'+15% lightning damage, +4% crit',{n:'Thunderclap',pow:30,stun:.5},'It is loud. It is always loud.','Volume II');
orb('o_magnetar','voltara',4,'Magnetar Orb','Electromagnetism',{el:{lightning:.2,gravity:.1}},'+20% lightning, +10% gravity damage',{n:'Magnetar Storm',pow:18,hits:4},'A dead star\'s heartbeat.','Volume III');
orb('o_voltrix','voltara',5,'Coil of Voltrix','Primordial Lightning',{el:{lightning:.3},crit:8},'+30% lightning damage, +8% crit',{n:'Transcend: Storm Serpent',pow:20,hits:5,trans:1},'A scale from the Storm Serpent coiled around the moon.','Volume III');
orb('o_dawn','lumeria',1,'Dawn Orb','Dawn',{el:{light:.08},heal:.05},'+8% light damage, +5% healing',{n:'First Light',pow:26,healPct:.15},'Morning, kept in a bottle.','Volume I');
orb('o_prism','lumeria',2,'Prism Orb','Prism',{el:{light:.12},crit:4},'+12% light damage, +4% crit',{n:'Prism Break',pow:12,hits:4},'One light, split seven ways.','Volume I');
orb('o_radiance','lumeria',3,'Radiance Orb','Radiance',{el:{light:.15},hp:20},'+15% light damage, +20 HP',{n:'Radiant Judgement',pow:50},'Husks cannot look at it.','Volume II');
orb('o_starlight','lumeria',4,'Starlight Orb','Starlight',{el:{light:.2},mp:30},'+20% light damage, +30 MP',{n:'Starfall Hymn',pow:16,hits:4,healPct:.2},'Light that left its star before the world began.','Volume III');
orb('o_lumina','lumeria',5,'Eye of Lumina','Primordial Light',{el:{light:.3},heal:.3},'+30% light damage, +30% healing',{n:'Transcend: Dawn Eternal',pow:76,healPct:.4,trans:1},'Lumina\'s own eye. The Oracle sees through it.','Volume III');
orb('o_weight','gravemont',1,'Weight Orb','Weight',{el:{gravity:.08},str:1},'+8% gravity damage, +1 Strength',{n:'Heavy Hand',pow:30,stun:.3},'A pebble from Gravemont that never stopped falling.','Volume I');
orb('o_orbit','gravemont',2,'Orbit Orb','Orbit',{el:{gravity:.12},ctrl:1},'+12% gravity damage, +1 Control',{n:'Orbital Volley',pow:12,hits:4},'Seven tiny moons circle inside it.','Volume I');
orb('o_horizon','gravemont',3,'Event Horizon Orb','Black Hole',{el:{gravity:.15},dr:.05},'+15% gravity damage, 5% less damage taken',{n:'Event Horizon',pow:44,drain:1},'Light goes in. Nothing comes out. Vale carried it for thirty years.','Volume I');
orb('o_chronos','gravemont',4,'Chronos Orb','Time',{el:{gravity:.2},dodge:6},'+20% gravity damage, +6% dodge',{n:'Time Dilation',evade:1,buff:1,pow:30},'Near enough to gravity, time itself bends.','Volume III');
orb('o_keystone','gravemont',5,'Keystone Orb','The Keystone',{el:{gravity:.3},dmg:.1},'+30% gravity damage, +10% all damage',{n:'Transcend: Keystone Sovereign',pow:84,stun:.6,trans:1},'The heart of the Keystone Crown. The thing the Hollow King wants most.','Volume III');
const HOMEORB={ren:['o_weight','o_orbit'],lyra:['o_gale','o_sky'],torvin:['o_stone','o_crystal'],kaida:['o_spark','o_plasma'],nerissa:['o_tide','o_frost'],pip:['o_dawn','o_prism']};
const KEEPSAKE={lyra:'o_gale',torvin:'o_stone',kaida:'o_spark',ren:'o_weight',kael:'o_ember'};

/* ---------- drawing: avatars, items, orbs ---------- */
function rrp(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function hexA(h,a){const n=parseInt(h.slice(1),16);return`rgba(${n>>16},${n>>8&255},${n&255},${a})`}
function drawWeapon(c,wt,col,x,y,sc,ang){c.save();c.translate(x,y);c.rotate(ang||0);c.scale(sc,sc);const[a,b,g]=col;c.lineCap='round';c.lineJoin='round';
 if(wt==='bow'){c.strokeStyle=a;c.lineWidth=6;c.beginPath();c.moveTo(0,-70);c.bezierCurveTo(-34,-40,-34,40,0,70);c.stroke();c.strokeStyle=hexA(g,.9);c.lineWidth=1.5;c.beginPath();c.moveTo(0,-70);c.lineTo(0,70);c.stroke();c.fillStyle=b;rrp(c,-26,-8,9,16,3);c.fill();
  c.fillStyle=g;c.beginPath();c.arc(0,-70,3.5,0,7);c.arc(0,70,3.5,0,7);c.fill()}
 else if(wt==='hammer'){c.fillStyle=b;rrp(c,-4,-50,8,96,3);c.fill();c.fillStyle=a;rrp(c,-26,-74,52,30,5);c.fill();c.fillStyle=b;c.fillRect(-26,-62,52,5);c.fillStyle=hexA(g,.9);c.font='bold 12px serif';c.textAlign='center';c.fillText('ᚱ',0,-53)}
 else if(wt==='blade'){c.fillStyle=a;c.beginPath();c.moveTo(-6,-10);c.lineTo(-6,-80);c.lineTo(0,-94);c.lineTo(6,-80);c.lineTo(6,-10);c.closePath();c.fill();c.strokeStyle=hexA(g,.8);c.lineWidth=1.5;c.beginPath();c.moveTo(0,-14);c.lineTo(0,-84);c.stroke();
  c.fillStyle=b;rrp(c,-20,-12,40,7,3);c.fill();c.fillStyle='#3a2a20';rrp(c,-4,-6,8,26,3);c.fill();c.fillStyle=b;c.beginPath();c.arc(0,22,5,0,7);c.fill()}
 else if(wt==='daggers'){for(const s of[-1,1]){c.save();c.rotate(s*.35);c.fillStyle=a;c.beginPath();c.moveTo(-4,-6);c.lineTo(-4,-48);c.lineTo(0,-58);c.lineTo(4,-48);c.lineTo(4,-6);c.closePath();c.fill();c.fillStyle=b;rrp(c,-10,-8,20,5,2);c.fill();c.fillStyle='#2a2020';rrp(c,-3,-4,6,16,2);c.fill();
  c.strokeStyle=hexA(g,.9);c.lineWidth=1.2;c.beginPath();c.moveTo(0,-10);c.lineTo(0,-50);c.stroke();c.restore()}}
 else if(wt==='trident'){c.strokeStyle=b;c.lineWidth=5;c.beginPath();c.moveTo(0,50);c.lineTo(0,-50);c.stroke();c.strokeStyle=a;c.lineWidth=5;c.beginPath();c.moveTo(-18,-80);c.lineTo(-18,-56);c.quadraticCurveTo(-18,-46,0,-46);c.quadraticCurveTo(18,-46,18,-56);c.lineTo(18,-80);c.moveTo(0,-46);c.lineTo(0,-88);c.stroke();
  c.fillStyle=g;c.beginPath();c.arc(0,-46,4,0,7);c.fill()}
 else if(wt==='wand'){c.strokeStyle=a;c.lineWidth=5;c.beginPath();c.moveTo(0,40);c.lineTo(0,-50);c.stroke();c.strokeStyle=b;c.lineWidth=2;c.beginPath();c.arc(0,-58,11,0,7);c.stroke();
  const gl=c.createRadialGradient(0,-58,0,0,-58,22);gl.addColorStop(0,'#fff');gl.addColorStop(.4,g);gl.addColorStop(1,hexA(g,0));c.fillStyle=gl;c.beginPath();c.arc(0,-58,22,0,7);c.fill()}
 else{/* gauntlet */c.fillStyle=a;rrp(c,-16,-18,32,30,8);c.fill();c.fillStyle=b;for(let i=0;i<4;i++){rrp(c,-15+i*8,-22,7,8,2);c.fill()}c.fillStyle=g;c.beginPath();c.arc(0,-2,5,0,7);c.fill();
  c.fillStyle=hexA(b,.9);for(let i=0;i<3;i++){const an=i*2.1+.6;c.beginPath();c.arc(Math.cos(an)*34,-6+Math.sin(an)*20,5+i,0,7);c.fill()}}
 c.restore()}
function drawAvatar(c,L,eq,o){o=o||{};const s=(o.w||200)/200;c.save();c.translate(o.x||0,o.y||0);c.scale(s,s);
 const skin=L.skin,hc=L.hairC,out=eq&&eq.outfit?IT[eq.outfit]:null,oc=out?out.c[0]:L.outC,tc=out?out.c[1]:L.trim,sty=out?out.sty:L.outfit;
 const bw=L.build==='stout'?88:L.build==='slim'?64:74,legH=L.build==='stout'?50:L.build==='slim'?62:58,tTop=142,tBot=206,cx=100;const dark=shade(oc,-.45);
 // aura
 if(o.aura!==false){const g=c.createRadialGradient(cx,172,8,cx,172,98);g.addColorStop(0,hexA(L.aura||'#a48bff',.5));g.addColorStop(.6,hexA(L.aura||'#a48bff',.16));g.addColorStop(1,hexA(L.aura||'#a48bff',0));c.fillStyle=g;c.fillRect(0,60,200,240)}
 // wings
 if(L.extra==='wings'){c.save();for(const sgn of[-1,1]){c.fillStyle='rgba(255,247,214,.35)';c.strokeStyle='rgba(255,215,110,.85)';c.lineWidth=2;
  c.beginPath();c.ellipse(cx+sgn*58,150,46,26,sgn*-.6,0,7);c.fill();c.stroke();c.beginPath();c.ellipse(cx+sgn*48,200,30,18,sgn*.5,0,7);c.fill();c.stroke()}c.restore()}
 // cloak
 if(eq&&eq.cloak){const cl=IT[eq.cloak];c.fillStyle=cl.c[0];c.beginPath();c.moveTo(cx-bw/2-4,tTop+4);c.lineTo(cx+bw/2+4,tTop+4);c.lineTo(cx+bw/2+26,tBot+legH+12);c.quadraticCurveTo(cx,tBot+legH+26,cx-bw/2-26,tBot+legH+12);c.closePath();c.fill();
  c.strokeStyle=cl.c[1];c.lineWidth=3;c.stroke()}
 // back hair
 c.fillStyle=hc;if(['long','wavy','braid'].includes(L.hair)){rrp(c,cx-52,72,104,L.hair==='braid'?70:96,30);c.fill()}
 if(L.hair==='ponytail'){c.beginPath();c.ellipse(cx+46,104,16,38,-.4,0,7);c.fill()}
 if(L.hair==='bun'){c.beginPath();c.arc(cx,36,20,0,7);c.fill()}
 // legs + boots
 const robe=sty==='robe',dress=sty==='dress';
 c.fillStyle=dark;rrp(c,cx-bw/2+8,tBot-6,bw/2-10,legH,8);c.fill();rrp(c,cx+2,tBot-6,bw/2-10,legH,8);c.fill();
 c.fillStyle='#3a2a20';rrp(c,cx-bw/2+4,tBot+legH-14,bw/2-4,16,6);c.fill();rrp(c,cx+0,tBot+legH-14,bw/2-4,16,6);c.fill();
 // torso by outfit style
 c.fillStyle=oc;
 if(robe){c.beginPath();c.moveTo(cx-bw/2,tTop+4);c.lineTo(cx+bw/2,tTop+4);c.lineTo(cx+bw/2+12,tBot+legH-8);c.lineTo(cx-bw/2-12,tBot+legH-8);c.closePath();c.fill();c.strokeStyle=tc;c.lineWidth=3;c.beginPath();c.moveTo(cx,tTop+8);c.lineTo(cx,tBot+legH-10);c.moveTo(cx-bw/2-11,tBot+legH-12);c.lineTo(cx+bw/2+11,tBot+legH-12);c.stroke()}
 else if(dress){rrp(c,cx-bw/2,tTop+2,bw,tBot-tTop-12,14);c.fill();c.beginPath();c.moveTo(cx-bw/2+2,tBot-14);c.lineTo(cx+bw/2-2,tBot-14);c.lineTo(cx+bw/2+18,tBot+30);c.quadraticCurveTo(cx,tBot+40,cx-bw/2-18,tBot+30);c.closePath();c.fill();c.strokeStyle=tc;c.lineWidth=3;c.stroke()}
 else{rrp(c,cx-bw/2,tTop+2,bw,tBot-tTop,14);c.fill();
  if(sty==='coat'){c.beginPath();c.moveTo(cx-bw/2,tBot-10);c.lineTo(cx-bw/2-6,tBot+26);c.lineTo(cx-6,tBot+18);c.lineTo(cx-4,tBot-6);c.moveTo(cx+bw/2,tBot-10);c.lineTo(cx+bw/2+6,tBot+26);c.lineTo(cx+6,tBot+18);c.lineTo(cx+4,tBot-6);c.fill();
   c.fillStyle=shade(oc,.35);c.beginPath();c.moveTo(cx-12,tTop+4);c.lineTo(cx+12,tTop+4);c.lineTo(cx+4,tBot-4);c.lineTo(cx-4,tBot-4);c.closePath();c.fill();c.strokeStyle=tc;c.lineWidth=3;c.beginPath();c.moveTo(cx-14,tTop+4);c.lineTo(cx-4,tBot-4);c.moveTo(cx+14,tTop+4);c.lineTo(cx+4,tBot-4);c.stroke()}
  else if(sty==='jacket'){c.strokeStyle=tc;c.lineWidth=3;c.beginPath();c.moveTo(cx,tTop+10);c.lineTo(cx,tBot-4);c.stroke();c.fillStyle=tc;rrp(c,cx-20,tTop-2,40,10,4);c.fill()}
  else if(sty==='apron'){c.fillStyle='#6b4a2a';rrp(c,cx-bw/2+10,tTop+22,bw-20,tBot-tTop+18,8);c.fill();c.strokeStyle=tc;c.lineWidth=2;c.beginPath();c.moveTo(cx-bw/2+14,tTop+22);c.lineTo(cx-10,tTop+4);c.moveTo(cx+bw/2-14,tTop+22);c.lineTo(cx+10,tTop+4);c.stroke()}
  else if(sty==='scale'){c.strokeStyle=shade(oc,.4);c.lineWidth=1.6;for(let yy=tTop+14;yy<tBot-4;yy+=9)for(let xx=cx-bw/2+8;xx<cx+bw/2-4;xx+=10){c.beginPath();c.arc(xx+((yy/9|0)%2)*5,yy,5,0,Math.PI);c.stroke()}
   c.fillStyle=tc;for(let i=-3;i<=3;i++){c.beginPath();c.arc(cx+i*7,tTop+8+Math.abs(i)*2,2.6,0,7);c.fill()}}
  else{c.fillStyle='#4a3020';c.fillRect(cx-bw/2,tBot-24,bw,8);c.fillStyle=tc;c.fillRect(cx-5,tBot-25,10,10);c.strokeStyle=tc;c.lineWidth=3;c.beginPath();c.moveTo(cx-14,tTop+6);c.lineTo(cx,tTop+22);c.lineTo(cx+14,tTop+6);c.stroke()}}
 // armor overlay
 if(eq&&eq.armor){const ar=IT[eq.armor];const g=c.createLinearGradient(0,tTop,0,tBot);g.addColorStop(0,shade(ar.c[0],.35));g.addColorStop(1,shade(ar.c[0],-.25));c.fillStyle=g;
  rrp(c,cx-bw/2+8,tTop+10,bw-16,(tBot-tTop)*.6,12);c.fill();c.strokeStyle=ar.c[1];c.lineWidth=2.5;c.stroke();
  for(const sgn of[-1,1]){c.beginPath();c.ellipse(cx+sgn*(bw/2),tTop+10,18,12,0,0,7);c.fillStyle=g;c.fill();c.stroke()}}
 // arms
 for(const sgn of[-1,1]){c.fillStyle=eq&&eq.armor?shade(IT[eq.armor].c[0],.1):oc;rrp(c,cx+sgn*(bw/2+8)-9,tTop+6,18,52,9);c.fill();c.fillStyle=skin;c.beginPath();c.arc(cx+sgn*(bw/2+8),tTop+60,9,0,7);c.fill()}
 // accessory
 if(eq&&eq.accessory){const ac=IT[eq.accessory];c.strokeStyle='#c9a24a';c.lineWidth=1.5;c.beginPath();c.moveTo(cx-12,tTop+4);c.quadraticCurveTo(cx,tTop+24,cx+12,tTop+4);c.stroke();
  const g=c.createRadialGradient(cx,tTop+24,0,cx,tTop+24,9);g.addColorStop(0,'#fff');g.addColorStop(.4,ac.c[1]);g.addColorStop(1,ac.c[0]);c.fillStyle=g;c.beginPath();c.arc(cx,tTop+24,6,0,7);c.fill()}
 // neck + head
 c.fillStyle=skin;c.fillRect(cx-9,tTop-14,18,18);
 // ears
 c.fillStyle=skin;if(L.ears==='elf'){for(const sgn of[-1,1]){c.beginPath();c.moveTo(cx+sgn*44,86);c.lineTo(cx+sgn*74,58);c.lineTo(cx+sgn*46,104);c.closePath();c.fill()}}
 else if(L.ears==='pointy'){for(const sgn of[-1,1]){c.beginPath();c.moveTo(cx+sgn*45,90);c.lineTo(cx+sgn*62,74);c.lineTo(cx+sgn*46,104);c.closePath();c.fill()}}
 else if(L.ears==='fin'){for(const sgn of[-1,1]){c.fillStyle=hexA(L.trim,.85);c.beginPath();c.moveTo(cx+sgn*44,82);c.quadraticCurveTo(cx+sgn*78,74,cx+sgn*70,108);c.lineTo(cx+sgn*46,106);c.closePath();c.fill();c.strokeStyle=skin;c.lineWidth=1.5;for(let i=0;i<3;i++){c.beginPath();c.moveTo(cx+sgn*46,90+i*6);c.lineTo(cx+sgn*(66-i*3),82+i*9);c.stroke()}}}
 else{c.beginPath();c.arc(cx-47,96,8,0,7);c.arc(cx+47,96,8,0,7);c.fill()}
 c.fillStyle=skin;c.beginPath();c.ellipse(cx,92,48,50,0,0,7);c.fill();
 // face
 c.fillStyle='rgba(255,120,140,.18)';c.beginPath();c.ellipse(cx-26,112,9,5,0,0,7);c.ellipse(cx+26,112,9,5,0,0,7);c.fill();
 for(const sgn of[-1,1]){const ex=cx+sgn*18,ey=98;c.fillStyle='#fff';c.beginPath();c.ellipse(ex,ey,9,11,0,0,7);c.fill();c.fillStyle=L.eyes;c.beginPath();c.arc(ex,ey+1,7,0,7);c.fill();
  c.fillStyle='#120c18';c.beginPath();c.arc(ex,ey+2,3.6,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(ex-2.5,ey-2.5,2.2,0,7);c.fill();
  c.strokeStyle='#1a1418';c.lineWidth=2.6;c.beginPath();c.ellipse(ex,ey,9.5,11.5,0,Math.PI*1.08,Math.PI*1.92);c.stroke();
  c.strokeStyle=L.hairC==='#e8edf2'||L.hairC==='#f3f3f8'?'#9aa0ad':hc;c.lineWidth=3;c.beginPath();c.moveTo(ex-9,ey-17+(sgn>0?0:0));c.lineTo(ex+9,ey-19);c.stroke()}
 c.strokeStyle='#7a3a3a';c.lineWidth=2;c.beginPath();c.arc(cx,114,6,.2,Math.PI-.2);c.stroke();
 // marks
 if(L.mark==='scar'){c.strokeStyle='rgba(150,60,60,.8)';c.lineWidth=2;c.beginPath();c.moveTo(cx+10,80);c.lineTo(cx+30,114);c.stroke()}
 if(L.mark==='freckles'){c.fillStyle='rgba(140,80,50,.55)';for(const[fx,fy]of[[-30,108],[-24,112],[-34,114],[30,108],[24,112],[34,114]]){c.beginPath();c.arc(cx+fx,fy,1.6,0,7);c.fill()}}
 if(L.mark==='runes'){c.strokeStyle=hexA(L.trim,.9);c.lineWidth=2;c.beginPath();c.moveTo(cx-36,100);c.lineTo(cx-30,112);c.lineTo(cx-38,118);c.moveTo(cx+36,100);c.lineTo(cx+30,112);c.lineTo(cx+38,118);c.stroke()}
 if(L.mark==='scales'){c.strokeStyle=hexA('#1f5f78',.6);c.lineWidth=1.4;for(const sgn of[-1,1])for(let i=0;i<3;i++){c.beginPath();c.arc(cx+sgn*(36-i*3),80+i*7,3.5,0,Math.PI);c.stroke()}}
 if(L.mark==='soot'){c.fillStyle='rgba(40,30,30,.35)';c.beginPath();c.ellipse(cx-28,110,9,5,-.4,0,7);c.fill()}
 if(L.mark==='glow'){c.fillStyle=hexA(L.aura||'#ffe7a0',.9);for(const sgn of[-1,1]){c.beginPath();c.arc(cx+sgn*22,118,2,0,7);c.arc(cx+sgn*28,115,1.5,0,7);c.fill()}}
 // beard
 if(L.beard!=='none'){c.fillStyle=hc;c.beginPath();c.moveTo(cx-40,104);c.quadraticCurveTo(cx-38,(L.beard==='short'?136:150),cx,(L.beard==='short'?142:158));c.quadraticCurveTo(cx+38,(L.beard==='short'?136:150),cx+40,104);c.quadraticCurveTo(cx,126,cx-40,104);c.fill();
  c.strokeStyle='#7a3a3a';c.lineWidth=2;c.beginPath();c.arc(cx,116,6,.2,Math.PI-.2);c.stroke();
  if(L.beard==='braided'){c.fillStyle=hc;for(const sgn of[-1,1]){rrp(c,cx+sgn*12-5,144,10,26,5);c.fill();c.fillStyle=L.trim;c.fillRect(cx+sgn*12-6,160,12,4);c.fillStyle=hc}}}
 // front hair
 c.fillStyle=hc;const cap=()=>{c.beginPath();c.ellipse(cx,74,50,36,0,Math.PI,0);c.lineTo(cx+50,86);c.lineTo(cx-50,86);c.closePath();c.fill()};
 const H=L.hair;
 if(H==='shaved'){c.fillStyle=hexA(hc,.35);c.beginPath();c.ellipse(cx,70,47,30,0,Math.PI,0);c.fill()}
 else if(H==='mohawk'){c.beginPath();c.moveTo(cx-10,80);c.lineTo(cx-6,24);c.lineTo(cx+6,24);c.lineTo(cx+10,80);c.closePath();c.fill()}
 else{cap();
  if(H==='messy'||H==='spiky'){c.beginPath();c.moveTo(cx-50,86);for(let i=0;i<=8;i++)c.lineTo(cx-50+i*12.5,(i%2?96:80));c.lineTo(cx+50,70);c.closePath();c.fill();
   if(H==='spiky')for(let i=0;i<5;i++){c.beginPath();c.moveTo(cx-40+i*20,50);c.lineTo(cx-30+i*20,16+(i%2)*10);c.lineTo(cx-20+i*20,50);c.fill()}
   else for(const[a,b2]of[[-20,30],[8,24],[30,36]]){c.beginPath();c.moveTo(cx+a-6,44);c.lineTo(cx+a+4,b2);c.lineTo(cx+a+10,46);c.fill()}}
  if(H==='long'||H==='wavy'||H==='braid'){c.beginPath();c.moveTo(cx-50,78);c.quadraticCurveTo(cx-20,62,cx,74);c.quadraticCurveTo(cx+20,62,cx+50,78);c.lineTo(cx+50,70);c.lineTo(cx-50,70);c.fill();
   for(const sgn of[-1,1]){c.beginPath();c.moveTo(cx+sgn*50,72);if(H==='wavy'){c.bezierCurveTo(cx+sgn*62,100,cx+sgn*46,120,cx+sgn*58,150);c.lineTo(cx+sgn*44,150);c.bezierCurveTo(cx+sgn*34,120,cx+sgn*48,100,cx+sgn*40,80)}
    else{c.lineTo(cx+sgn*56,H==='braid'&&sgn>0?110:152);c.lineTo(cx+sgn*42,H==='braid'&&sgn>0?110:152);c.lineTo(cx+sgn*42,82)}c.closePath();c.fill()}
   if(H==='braid'){for(let i=0;i<5;i++){c.beginPath();c.ellipse(cx+36,112+i*14,9,8,0,0,7);c.fill()}c.fillStyle=L.trim;c.fillRect(cx+29,180,14,5)}}
  if(H==='short'){c.beginPath();c.moveTo(cx-50,84);c.lineTo(cx+50,84);c.lineTo(cx+50,72);c.lineTo(cx-50,72);c.fill()}
  if(H==='ponytail'){c.beginPath();c.moveTo(cx-50,84);c.quadraticCurveTo(cx-10,60,cx+50,78);c.lineTo(cx+50,68);c.lineTo(cx-50,68);c.fill();c.fillStyle='#86d6ff';c.fillRect(cx-30,52,6,26)}
  if(H==='bob'){for(const sgn of[-1,1]){rrp(c,cx+sgn*(sgn>0?36:52)-(sgn>0?0:0),70,16,52,8);c.fill()}c.fillRect(cx-50,70,100,16)}
  if(H==='swept'){c.beginPath();c.moveTo(cx-50,86);c.quadraticCurveTo(cx-20,56,cx+52,96);c.lineTo(cx+50,70);c.lineTo(cx-50,70);c.fill()}
  if(H==='bun'){c.fillRect(cx-50,72,100,10)}}
 // extras
 if(L.extra==='goggles'){c.strokeStyle='#5a3a22';c.lineWidth=4;c.beginPath();c.moveTo(cx-48,60);c.lineTo(cx+48,60);c.stroke();for(const sgn of[-1,1]){c.fillStyle='#c98a3a';c.beginPath();c.arc(cx+sgn*16,58,12,0,7);c.fill();c.fillStyle='rgba(134,214,255,.8)';c.beginPath();c.arc(cx+sgn*16,58,8,0,7);c.fill()}}
 if(L.extra==='gills'){c.strokeStyle=hexA('#1f5f78',.7);c.lineWidth=2;for(const sgn of[-1,1])for(let i=0;i<3;i++){c.beginPath();c.moveTo(cx+sgn*6,tTop-12+i*4);c.lineTo(cx+sgn*10,tTop-10+i*4);c.stroke()}}
 if(L.extra==='halo'){c.strokeStyle='rgba(255,231,160,.95)';c.lineWidth=4;c.beginPath();c.ellipse(cx,26,32,8,0,0,7);c.stroke()}
 if(L.extra==='horns'){c.fillStyle='#3a2a20';for(const sgn of[-1,1]){c.beginPath();c.moveTo(cx+sgn*26,50);c.quadraticCurveTo(cx+sgn*50,20,cx+sgn*36,6);c.quadraticCurveTo(cx+sgn*40,30,cx+sgn*16,48);c.fill()}}
 // weapon in right hand
 if(eq&&eq.weapon){const w=IT[eq.weapon];drawWeapon(c,w.wt,w.c,cx+bw/2+8,tTop+56,.62,w.wt==='bow'?0:.25)}
 // orbs
 if(o.orbs)o.orbs.forEach((id,i)=>{const O=ORBS[id];if(!O)return;const ox=cx-bw/2-30,oy=tTop-30+i*30;const g=c.createRadialGradient(ox,oy,0,ox,oy,16);g.addColorStop(0,'#fff');g.addColorStop(.35,O.c[0]);g.addColorStop(1,hexA(O.c[0],0));c.fillStyle=g;c.beginPath();c.arc(ox,oy,16,0,7);c.fill()});
 c.restore()}
function drawItemArt(c,item,S){c.save();const r=RAR[item.rar][1];const g=c.createRadialGradient(S/2,S/2,S*.05,S/2,S/2,S*.55);g.addColorStop(0,hexA(r,.45));g.addColorStop(1,hexA(r,0));c.fillStyle=g;c.fillRect(0,0,S,S);
 const k=S/200;c.translate(S/2,S/2);c.scale(k,k);const[a,b]=item.c;
 if(item.type==='weapon'){drawWeapon(c,item.wt,item.c,0,item.wt==='gauntlet'?10:30,item.wt==='gauntlet'?1.9:1.15,item.wt==='bow'?.5:item.wt==='gauntlet'?0:.6)}
 else if(item.type==='armor'){const g2=c.createLinearGradient(0,-60,0,60);g2.addColorStop(0,shade(a,.4));g2.addColorStop(1,shade(a,-.3));c.fillStyle=g2;rrp(c,-44,-50,88,96,22);c.fill();c.strokeStyle=b;c.lineWidth=4;c.stroke();
  for(const sgn of[-1,1]){c.beginPath();c.ellipse(sgn*48,-44,30,20,0,0,7);c.fillStyle=g2;c.fill();c.stroke()}c.strokeStyle=hexA(b,.8);c.lineWidth=3;c.beginPath();c.moveTo(0,-40);c.lineTo(0,40);c.stroke()}
 else if(item.type==='outfit'){c.fillStyle=a;c.beginPath();c.moveTo(-40,-60);c.lineTo(40,-60);c.lineTo(70,-30);c.lineTo(50,-14);c.lineTo(40,-24);c.lineTo(44,70);c.lineTo(-44,70);c.lineTo(-40,-24);c.lineTo(-50,-14);c.lineTo(-70,-30);c.closePath();c.fill();c.strokeStyle=b;c.lineWidth=4;c.stroke();c.beginPath();c.moveTo(-14,-60);c.lineTo(0,-40);c.lineTo(14,-60);c.moveTo(0,-40);c.lineTo(0,66);c.stroke()}
 else if(item.type==='cloak'){c.fillStyle=a;c.beginPath();c.moveTo(-30,-66);c.lineTo(30,-66);c.lineTo(70,70);c.quadraticCurveTo(0,86,-70,70);c.closePath();c.fill();c.strokeStyle=b;c.lineWidth=4;c.stroke();c.fillStyle=b;c.beginPath();c.arc(0,-60,8,0,7);c.fill()}
 else{const art=item.art;c.strokeStyle='#c9a24a';c.lineWidth=3;
  if(art==='ring'){c.lineWidth=12;c.strokeStyle=a;c.beginPath();c.arc(0,10,40,0,7);c.stroke();c.fillStyle=b;c.beginPath();c.arc(0,-34,16,0,7);c.fill()}
  else if(art==='feather'){c.fillStyle=a;c.beginPath();c.moveTo(0,-80);c.quadraticCurveTo(40,-10,0,80);c.quadraticCurveTo(-40,-10,0,-80);c.fill();c.strokeStyle=b;c.lineWidth=3;c.beginPath();c.moveTo(0,-78);c.lineTo(0,86);c.stroke()}
  else if(art==='stone'){c.fillStyle=a;c.beginPath();c.ellipse(0,0,46,38,.3,0,7);c.fill();c.strokeStyle=b;c.lineWidth=3;c.font='bold 30px serif';c.textAlign='center';c.fillStyle=b;c.fillText('ᚱᛖᚾ'.slice(0,2),0,10)}
  else if(art==='band'){c.lineWidth=16;c.strokeStyle=a;c.beginPath();c.ellipse(0,0,56,24,0,0,7);c.stroke();c.strokeStyle=b;c.lineWidth=3;c.beginPath();c.ellipse(0,0,56,24,0,0,7);c.stroke()}
  else if(art==='ribbon'){c.fillStyle=a;c.beginPath();c.moveTo(-60,-20);c.quadraticCurveTo(0,-50,60,-20);c.lineTo(50,10);c.quadraticCurveTo(0,-14,-50,10);c.closePath();c.fill();c.beginPath();c.moveTo(-10,0);c.lineTo(-30,80);c.lineTo(-14,70);c.lineTo(0,6);c.lineTo(14,70);c.lineTo(30,80);c.lineTo(10,0);c.fill();c.fillStyle=b;c.beginPath();c.arc(0,-6,10,0,7);c.fill()}
  else if(art==='badge'){c.fillStyle=a;c.beginPath();for(let i=0;i<6;i++){const an=i*Math.PI/3-Math.PI/2;c.lineTo(Math.cos(an)*54,Math.sin(an)*54)}c.closePath();c.fill();c.fillStyle=b;c.font='bold 46px sans-serif';c.textAlign='center';c.fillText('ϟ',0,16)}
  else if(art==='scale'){c.fillStyle=a;c.beginPath();c.moveTo(0,-60);c.quadraticCurveTo(54,-20,0,70);c.quadraticCurveTo(-54,-20,0,-60);c.fill();c.strokeStyle=b;c.lineWidth=3;c.stroke()}
  else{c.beginPath();c.moveTo(-40,-60);c.quadraticCurveTo(0,0,40,-60);c.stroke();const g3=c.createRadialGradient(0,10,0,0,10,40);g3.addColorStop(0,'#fff');g3.addColorStop(.35,b);g3.addColorStop(1,a);c.fillStyle=g3;c.beginPath();c.arc(0,10,32,0,7);c.fill();c.strokeStyle='#c9a24a';c.lineWidth=4;c.stroke()}}
 c.restore()}
function drawOrbArt(c,O,S,t){t=(t||0)*.001;c.save();const a=O.c[0],b=O.c[1]==='#2a1a4a'?'#d6c8ff':O.c[1],cx=S/2,cy=S*.48,R=S*.26,T=O.tier;let g;
 g=c.createRadialGradient(cx,cy,R*.6,cx,cy,R*2.15);g.addColorStop(0,hexA(a,.5));g.addColorStop(.5,hexA(a,.13));g.addColorStop(1,hexA(a,0));c.fillStyle=g;c.fillRect(0,0,S,S);
 c.save();c.translate(cx,cy+R*1.36);c.scale(1,.2);g=c.createRadialGradient(0,0,0,0,0,R*1.15);g.addColorStop(0,hexA(b,.55));g.addColorStop(.5,hexA(a,.3));g.addColorStop(1,hexA(a,0));c.fillStyle=g;c.beginPath();c.arc(0,0,R*1.15,0,7);c.fill();c.restore();
 const rings=Math.max(1,T-1),ring=(i,front)=>{const rx=R*(1.36+i*.2),ry=R*(.33+i*.07),rot=t*.5*(i%2?1:-1)+i*1.1;c.save();c.translate(cx,cy);c.rotate(rot);c.beginPath();c.ellipse(0,0,rx,ry,0,front?0:Math.PI,front?Math.PI:Math.PI*2);c.strokeStyle=hexA(b,front?.95:.35);c.lineWidth=S*(front?.011:.007);c.shadowColor=a;c.shadowBlur=S*.035;c.stroke();c.restore()};
 for(let i=0;i<rings;i++)ring(i,false);
 c.save();c.beginPath();c.arc(cx,cy,R,0,7);c.clip();g=c.createRadialGradient(cx,cy,0,cx,cy,R);g.addColorStop(0,shade(a,-.3));g.addColorStop(.72,shade(a,-.74));g.addColorStop(1,'#030208');c.fillStyle=g;c.fillRect(cx-R,cy-R,R*2,R*2);
 c.globalCompositeOperation='lighter';for(let i=0;i<14+T*3;i++){const an=i*2.399+t*(.5+(i%3)*.25),rr=R*(.1+.62*((i*.618)%1))*(.8+.2*Math.sin(t*1.3+i)),x=cx+Math.cos(an)*rr,y=cy+Math.sin(an*1.3)*rr*.82,s=R*(.2+.3*((i*.37)%1));g=c.createRadialGradient(x,y,0,x,y,s);g.addColorStop(0,hexA(i%4?a:b,.4));g.addColorStop(1,hexA(a,0));c.fillStyle=g;c.fillRect(x-s,y-s,s*2,s*2)}
 if(T>=3){c.strokeStyle=hexA(b,.75);c.lineWidth=S*.004;c.shadowColor='#fff';c.shadowBlur=S*.02;for(let k=0;k<T-1;k++){c.beginPath();let x=cx,y=cy;c.moveTo(x,y);const a0=k*2.1+Math.floor(t*7+k)*1.7;for(let q=1;q<=5;q++){x=cx+Math.cos(a0+Math.sin(q*3+k)*.5)*R*.19*q;y=cy+Math.sin(a0+Math.cos(q*2+k)*.5)*R*.19*q;c.lineTo(x,y)}c.stroke()}c.shadowBlur=0}
 const cs=R*(.2+.04*Math.sin(t*3));g=c.createRadialGradient(cx,cy,0,cx,cy,cs*2.3);g.addColorStop(0,'rgba(255,255,255,.97)');g.addColorStop(.25,hexA(b,.8));g.addColorStop(1,hexA(a,0));c.fillStyle=g;c.fillRect(cx-R,cy-R,R*2,R*2);
 c.globalCompositeOperation='source-over';g=c.createRadialGradient(cx,cy,R*.7,cx,cy,R);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.8,hexA(a,.22));g.addColorStop(.97,'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(255,255,255,.15)');c.fillStyle=g;c.fillRect(cx-R,cy-R,R*2,R*2);
 g=c.createRadialGradient(cx+R*.22,cy+R*.6,0,cx+R*.22,cy+R*.6,R*.7);g.addColorStop(0,hexA(b,.4));g.addColorStop(1,hexA(b,0));c.fillStyle=g;c.fillRect(cx-R,cy-R,R*2,R*2);c.restore();
 c.save();c.translate(cx-R*.38,cy-R*.46);c.rotate(-.6);c.scale(1,.55);g=c.createRadialGradient(0,0,0,0,0,R*.36);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.4,'rgba(255,255,255,.32)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.beginPath();c.arc(0,0,R*.36,0,7);c.fill();c.restore();
 c.fillStyle='rgba(255,255,255,.75)';c.beginPath();c.arc(cx+R*.44,cy+R*.5,R*.035,0,7);c.fill();for(let i=0;i<rings;i++)ring(i,true);
 c.globalCompositeOperation='lighter';const fl=(len,w,rot,al)=>{c.save();c.translate(cx-R*.38,cy-R*.46);c.rotate(rot);g=c.createLinearGradient(-len,0,len,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,'+al+')');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(-len,-w/2,len*2,w);c.restore()};fl(R*1.5,S*.006,0,.7);fl(R*.9,S*.005,1.571,.5);
 for(let i=0;i<6+T*2;i++){const an=i*1.7+t*.6,rr=R*(1.25+.5*((i*.41)%1)),x=cx+Math.cos(an)*rr,y=cy+Math.sin(an)*rr*.85;c.fillStyle=hexA(b,.5+.4*Math.sin(t*4+i));c.beginPath();c.arc(x,y,S*.005*(1+(i%3)),0,7);c.fill()}c.restore()}
const _pc={};
function portrait(id,look,eq,size){const L=look||LOOKS[id];if(!L)return'';const key=id+JSON.stringify(L)+JSON.stringify(eq||{})+(size||64);if(_pc[key])return _pc[key];
 const cv2=document.createElement('canvas');cv2.width=240;cv2.height=360;const c=cv2.getContext('2d');drawAvatar(c,L,eq||{},{w:240,aura:false});
 const out=document.createElement('canvas');const S=size||64;out.width=S*2;out.height=S*2;const o=out.getContext('2d');const g=o.createRadialGradient(S,S,S*.2,S,S,S);g.addColorStop(0,hexA(L.aura||'#a48bff',.55));g.addColorStop(1,'#120e1e');o.fillStyle=g;o.fillRect(0,0,S*2,S*2);
 o.drawImage(cv2,30,22,180,180,0,0,S*2,S*2);_pc[key]=out.toDataURL();return _pc[key]}
