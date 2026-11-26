/* ================= CHARACTERS ================= */
const CHARS={
 ren:{n:'Ren',race:'Human',nation:'Emberfall, Pyrrhos',bg:'village',start:'ren_1',
  aff:{gravity:97,lightning:41,wind:38},stats:{str:4,agi:4,mana:6,ctrl:5,spi:4},skills:['g_c1','g_o1'],
  hook:"A farmer's son on the Pyrrhos border. When he touches the Crystal of Seven, it turns black. The first gravity user in 300 years, and everyone wants him.",
  traits:[['t_abyss','Heart of the Abyss','+3 Mana, +2 MP every turn. Your power runs deeper than it should.',{mana:3,regen:2}],
   ['t_heaven','Heavenly Body','+3 Strength, +40 HP. Your body adapts to crushing weight.',{str:3,hp:40}],
   ['t_weight','Weightless Mind','+3 Control, +15% gravity damage. You feel the weight of everything.',{ctrl:3,el:{gravity:.15}}]],
  classes:[['Sovereign of Weight','+20% gravity damage. Grants King\'s Decree.',{el:{gravity:.2}},'c_king'],
   ['Star Shepherd','+5% crit, +3 Control. Grants Constellation.',{crit:5,ctrl:3},'c_const'],
   ['The Immovable','+50 HP, 10% less damage taken. Grants Bastion of Gravemont.',{hp:50,dr:.1},'c_bastion']]},
 lyra:{n:'Lyra Windsong',race:'Elf',nation:'Silverwood, Sylvaris',bg:'silverwood',start:'lyra_1',
  aff:{wind:89,light:54},stats:{str:3,agi:7,mana:5,ctrl:5,spi:4},skills:['w_g1','li_r1'],
  hook:"Granddaughter of the elf Archon who fought in the Sundering War. Her Light affinity makes the Silver Court call her 'fairy-touched'. Something is moving in the dead forest.",
  traits:[['t_windborn','Windborn','+4 Agility, +5% dodge. The wind carries you.',{agi:4,dodge:5}],
   ['t_lumen','Lumen Blood','+3 Spirit, +30% healing. Your mother\'s light.',{spi:3,heal:.3}],
   ['t_eye','Hunter\'s Eye','+12% crit chance. You never miss what matters.',{crit:12}]],
  classes:[['Tempest Archer','+15% wind damage. Grants Tempest Volley.',{el:{wind:.15}},'c_tempest'],
   ['Dawn Warden','+20% light damage, +30 HP. Grants Warden\'s Dawn.',{el:{light:.2},hp:30},'c_dawn'],
   ['Skydancer','+8% dodge, +3 Agility. Grants Thousand Feathers.',{dodge:8,agi:3},'c_dance']]},
 torvin:{n:'Torvin Deepforge',race:'Dwarf',nation:'Deepforge Hold, Kharak',bg:'underhold',start:'tor_1',
  aff:{earth:86,fire:49},stats:{str:7,agi:2,mana:4,ctrl:4,spi:6},skills:['e_s1','e_i1'],
  hook:"An apprentice smith in the dwarf halls. Something has been knocking on the Lower Seal, where the dwarves walled in their own dead 300 years ago.",
  traits:[['t_deep','Deep Blood','+50 HP, +2 Spirit. Stubborn as the mountain.',{hp:50,spi:2}],
   ['t_forge','Forgeheart','+3 Strength, +15% fire damage.',{str:3,el:{fire:.15}}],
   ['t_patience','Stone Patience','+12% damage reduction. You simply don\'t fall.',{dr:.12}]],
  classes:[['Runesmith','+3 Control, +10% damage. Grants Runebrand.',{ctrl:3,dmg:.1},'c_rune'],
   ['Mountain King','+60 HP. Grants Mountain Throne.',{hp:60},'c_mount'],
   ['Magma Breaker','+15% earth and fire damage. Grants Lava Breaker.',{el:{earth:.15,fire:.15}},'c_magma']]},
 kaida:{n:'Kaida Voss',race:'Human',nation:'Sparkhaven, Voltara',bg:'city',start:'kai_1',
  aff:{lightning:84,water:46},stats:{str:4,agi:7,mana:5,ctrl:4,spi:3},skills:['l_f1','wa_t1'],
  hook:"A rooftop runner in the lightning city of Sparkhaven, stealing to pay for her little brother's medicine. One job shows her what the government keeps in its tower.",
  traits:[['t_over','Overclock','+3 Agility, +8% crit.',{agi:3,crit:8}],
   ['t_tide','Tide Heart','+3 Spirit, +40 HP. Your mother was from Thalassa.',{spi:3,hp:40}],
   ['t_wire','Live Wire','+15% lightning damage, +2 Control.',{el:{lightning:.15},ctrl:2}]],
  classes:[['Storm Phantom','+10% dodge. Grants Phantom Circuit.',{dodge:10},'c_phantom'],
   ['Tidecaller','+20% water damage, +30% healing. Grants Tidecaller\'s Hymn.',{el:{water:.2},heal:.3},'c_tide'],
   ['Railrunner','+20% lightning damage. Grants Overdrive Rail.',{el:{lightning:.2}},'c_rail']]}
};

/* ================= ENEMIES ================= */
const EN={
 legion:{n:'Ember Legionnaire',hp:70,atk:9,def:2,res:['fire'],xp:45,heavy:'Flame Halberd',d:'A soldier of the Ember Throne in red lacquered armor.'},
 husk:{n:'Husk Scout',hp:78,atk:10,def:1,weak:['light'],xp:55,heavy:'Hollow Shriek',d:'A body emptied of every element. Its eyes are holes.'},
 shade:{n:'Shade Husk',hp:76,atk:10,def:1,weak:['light'],xp:55,heavy:'Grasping Dark',d:'Once an elf. Its silver skin has gone grey.'},
 thalion:{n:'Thalion Windsong',hp:92,atk:11,def:2,res:['wind'],weak:['light'],xp:60,heavy:'Silver Gale',d:'Your cousin. Pure wind, pure arrogance.'},
 crawler:{n:'Tunnel Crawler',hp:84,atk:10,def:4,weak:['fire'],xp:55,heavy:'Burrow Strike',d:'A many-legged thing that grew in the dark below the Seal.'},
 hknight:{n:'Hollow Knight',hp:112,atk:12,def:3,weak:['light','fire'],xp:75,heavy:'Rusted Oath',d:'A dwarf warrior from 300 years ago, still in his armor. Still fighting.'},
 warden:{n:'Arc Warden Unit-7',hp:82,atk:10,def:4,res:['lightning'],weak:['water'],xp:55,heavy:'Overcharge',d:'A brass security golem with a lightning core.'},
 vex:{n:'Vex Corven',hp:98,atk:12,def:2,res:['lightning'],weak:['earth','water'],xp:65,heavy:'Thunder Rail',d:'The Director\'s son. Directorate hunter. Smiling.'},
 wyvern:{n:'Ashwood Wyvern',hp:86,atk:11,def:2,weak:['lightning'],xp:60,heavy:'Dive Bomb',d:'A wild wyvern drawn by the crystal\'s flare.'},
 golem:{n:'Labyrinth Golem',hp:165,atk:13,def:5,weak:['lightning','water'],xp:95,heavy:'Granite Slam',d:'The entrance exam\'s final guardian.',allies:1},
 sentinel:{n:'Hollow Sentinel',hp:195,atk:15,def:4,weak:['light'],xp:115,heavy:'Erase',d:'A guardian made of black glass, protecting the Gravemont door.',allies:1},
 kael:{n:'Kael Ashford',hp:215,atk:16,def:4,res:['fire'],weak:['water'],xp:130,heavy:'Ember Throne Strike',d:'Heir of House Ashford. A dragon\'s fire in a human body.'},
 horde:{n:'Husk Horde',hp:260,atk:15,def:2,weak:['light'],xp:145,heavy:'Tide of Hollows',d:'Dozens of husks pouring out of the rift.',allies:1},
 vale:{n:'Professor Vale',hp:320,atk:18,def:5,weak:['light'],res:['gravity'],xp:210,heavy:'Hollow Crown Fragment',d:'Your teacher. Servant of the Hollow King.',allies:1}
};

/* ================= CODEX ================= */
const CODEX={
 ascension:['The Ascension',`The old texts speak of a road beyond Awakening. A bearer who gathers all five orbs of one nation, from Lesser to Transcendent, stops being only mortal. The Crown-bearers of the Sundering walked that road.\n\nA few went further and became gods of their element: of flame, tide, stone, gale, storm, dawn and weight.\n\nTwo powers were never given a nation: the Void, which the Hollow King swallowed, and the Divine, which no one has held since the First Dragons. The texts end with a warning. A god of one element can be killed. A god of the Void cannot even be forgotten.`],
 world:['The World of Aethra','Aethra is a continent of seven nations, each bound to one element by a Crown. The calendar counts years After the Sundering (AS). It is now the year 300 AS.\n\nPeople are born with an affinity for one element, measured by the Crystal of Seven. Most have one. A few have two. Having three is almost unheard of.'],
 accord:['The Age of Accord','Long ago, the Seven First Dragons each bound one element into a Crown and gave it to a people who swore to keep the balance.\n\nIgnaris gave Fire to the humans of Pyrrhos. Thalor gave Water to the merfolk of Thalassa. Grundmaw gave Earth to the dwarves of Kharak. Sylphae gave Wind to the elves of Sylvaris. Voltrix gave Lightning to the plains-folk of Voltara. Lumina gave Light to the fairies of Lumeria.\n\nThe last, the Black Dragon Gravaxis, gave Gravity to the humans of Gravemont. Gravity was the Keystone: the force that holds the other six together. For 712 years there was peace.'],
 sundering:['The Sundering War','In the year 712 of the Accord, Crown Prince Caedric of Gravemont, the greatest gravity mage who ever lived, found something beneath gravity: the Void. An eighth element, the absence of everything, which no dragon would name.\n\nCaedric believed the Crowns kept the world in chains. He set out to take all seven. The war lasted seven years.\n\nSilverwood burned and the elves lost half their forest. The Ember Fleet of Pyrrhos was swallowed whole. The dwarves sealed their Lower Holds with their own dead still inside to stop the hollow host. Voltara stayed neutral until the last year, something the other nations have never forgotten.\n\nThe war ended at the Battle of the Black Moon. The six Crown-bearers combined their power and sealed Caedric beneath his own city. Gravemont collapsed into the Abyss. The Gravity Crown vanished. Every gravity user in the world lost their power on the same night.'],
 hollowking:['The Hollow King','Prince Caedric of Gravemont, called the Weightless Prince, and later the Hollow King. He wore his own Crown and devoured three First Dragons before the seal took him.\n\nHe does not burn or cut. He empties. What he touches loses its element and becomes a husk.\n\nScholars disagree about whether anything human is left of him.'],
 pact:['The Pact of Six','The seal that holds the Hollow King is anchored by six seal-stones, one kept by each surviving nation.\n\nEvery hundred years, the six nations meet at Arcanum Academy for the Rite of Renewal, where the seals are strengthened. The third Rite is due this year, 300 AS.\n\nThe last Rite, in 200 AS, nearly failed. Nobody will say why.'],
 rumor:['The Three-Hundred-Year Rumor','In taverns from Sparkhaven to Emberfall, people whisper the same thing: the war will happen again. "Three hundred years to seal, three hundred to wake."\n\nThe Lumerian Oracle\'s prophecy is quoted everywhere: "When the weight returns to a mortal hand, the Pact is broken, or made whole."\n\nThis year, husks have been seen for the first time since the war. Stones have been seen falling upward.'],
 pyrrhos:['Pyrrhos · The Ember Throne','A human kingdom of fire and dragon-riders, ruled from the volcanic capital Cindral. Its great noble Houses compete for dragons and glory. House Ashford is the strongest.\n\nPyrrhos lost its fleet and most of its dragons in the war and has rebuilt itself as the continent\'s strongest army. Many of its lords believe Pyrrhos should lead the other nations, by force if needed.'],
 sylvaris:['Sylvaris · The Silver Court','The elven forest kingdom of wind and silver trees. Elves live six hundred years or more, so many who fought in the Sundering are still alive, including the Archon Elowen Windsong.\n\nElves remember that humans of Gravemont started the war. Most trust no human, and anything "fairy-touched" (elves with Light affinity) is treated with suspicion. The burned half of their forest, the Scar, is forbidden.'],
 kharak:['Kharak · The Nine Holds','The dwarf kingdom beneath the mountains, ruled by the Council of Nine Holds. Dwarves forge the finest weapons in Aethra and sing to the stone to shape it.\n\nDuring the war, the Lower Holds were overrun by the hollow host. The dwarves sealed them, along with their own trapped warriors. The Lower Seal has not been opened in three centuries.'],
 voltara:['Voltara · The Directorate','A lightning republic of spark-engines, airships and tall copper towers. Its capital, Sparkhaven, never sleeps.\n\nVoltara is run by the Directorate under Director Hale Corven. It is the richest nation in Aethra and the most ambitious. Rumors say Voltara traded with the hollow host during the war.'],
 thalassa:['Thalassa · The Tide Courts','The sea kingdom of merfolk and coastal humans, ruled by the Tide Queen. Thalassa trades with everyone and takes sides with no one. Its ships are the only ones that sail the Abyssal Sea near Gravemont.'],
 lumeria:['Lumeria · The Hidden Realm','The fairy kingdom of Light, hidden somewhere in the clouds. Its location is secret. Lumeria guards the keystone seal of the Pact and the Oracle, whose prophecies have never been wrong.'],
 gravemont:['Gravemont · The Fallen Kingdom','The kingdom of gravity that once held the Keystone Crown. After the Battle of the Black Moon it collapsed into the Abyss. Its ruins float in pieces above a pit of nothing in the far north.\n\nNo one has lived there in three hundred years.'],
 arcanum:['Arcanum Academy','Founded in 3 AS by Headmistress Seraphine and survivors from all nations, Arcanum is the only school that trains all seven elements, and it is neutral ground.\n\nThe academy floats above the Lake of Seven on a mountain of stone. Few people know where that stone came from: it was lifted from Gravemont by the last gravity mages before their power vanished.'],
 husks:['Husks','Creatures emptied of their element by the Void. A husk was once a person or an animal. They feel no pain and fear only Light.\n\nUntil this year, no husk had been seen since the Sundering.'],
 resonance:['The Resonance System','Affinity: how strongly you resonate with an element, from 0 to 100%. Higher affinity makes that element\'s skills stronger.\n\nRank: your overall power class, from F up to S, based on your level.\n\nAwakening: breakthroughs that come at crucial moments in your story. Each Awakening unlocks a new tier of skills. Awakening I gives a Trait. Awakening II gives a Class Evolution.\n\nSkill Paths: each element has paths. Learn tier 1 before tier 2, and so on. Skills cost Skill Points (SP), which come from leveling up.\n\nFusion: someone with two elements and tier-2 skills in both can learn a Fusion skill after Awakening II.\n\nLoadout: you can bring 4 active skills into battle.'],
 project:['Project Null','A secret Directorate program in Sparkhaven. Its goal: to harness the Void as an endless power source for Voltara\'s spark-engines. Captured husks are kept in tanks on Floor 40 of the Directorate Tower.'],
 fragment:['The Black Fragment','A shard of black stone carved with seven rings, found below the Lower Seal of Kharak. It is impossibly heavy for its size and warm to the touch. Near a gravity user, it hums.']
};

/* ================= v3 additions ================= */
Object.assign(EN,{
 wshade:{n:'Shade of the East Wing',hp:130,atk:13,def:2,weak:['light'],xp:85,heavy:'Rattling Keys',d:'A caretaker emptied thirty years ago, still guarding the room.'},
 rimewyrm:{n:'Rimewyrm',hp:150,atk:14,def:4,weak:['fire','lightning'],res:['water'],xp:95,heavy:'Glacier Coil',d:'A serpent of living ice that sleeps beneath the Lake of Seven.'},
 vex2:{n:'Vex Corven',hp:155,atk:15,def:3,res:['lightning'],weak:['earth','water'],xp:100,heavy:'Thunder Rail',d:'The Director\'s son, a spy with a smile.'},
 echo:{n:'Gravemont Echo',hp:145,atk:14,def:2,weak:['light'],res:['gravity'],xp:95,heavy:'Weight of Ages',d:'A mage of Gravemont, remembered by the stones themselves.'},
 wisp:{n:'Frost Wisp',hp:125,atk:13,def:2,weak:['fire'],res:['water'],xp:85,heavy:'Absolute Zero',d:'A floating ball of cold light that freezes the air solid.'}
});
CODEX.aelira=['Aelira Windsong','An elf of Sylvaris and Lyra\'s mother. She came to the human lands at sixty-one and taught Elemental Theory at Arcanum, alongside a young Professor Vale.\n\nThirty winters ago she vanished. The academy wrote that she had "left her post." Her letter, found in the east wing, says she saw who was feeding the door beneath the library.'];
const LEG={
 gravaxis:{n:'Gravaxis',t:'The Black Dragon',el:'gravity',b:{el:{gravity:.12},ctrl:2},bd:'+12% gravity damage, +2 Control',sum:{n:'Black Star Descent',pow:70,pierce:1},
  lore:'The First Dragon of Gravity, who gave the Keystone Crown to Gravemont. Caedric devoured him first. Some say a sliver of him still sleeps in every gravity-born.'},
 sylphae:{n:'Sylphae',t:'The White Wind',el:'wind',b:{dodge:8},bd:'+8% dodge',sum:{n:'Wings of Sylphae',healPct:.4,evade:1},
  lore:'The First Dragon of Wind, mother of the elves\' magic. She gave a single white feather to every Archon of Sylvaris.'},
 grundmaw:{n:'Grundmaw',t:'The Walking Mountain',el:'earth',b:{hp:60},bd:'+60 HP',sum:{n:'Mountain\'s Fall',pow:60,stun:.5},
  lore:'The First Dragon of Earth. The dwarves say Kharak is his sleeping body, and the stone-song is how they speak to him.'},
 voltrix:{n:'Voltrix',t:'The Storm Serpent',el:'lightning',b:{crit:8},bd:'+8% crit',sum:{n:'Coil of Ten Thousand Bolts',pow:14,hits:5},
  lore:'The First Dragon of Lightning, coiled around the moon. Voltara\'s first engines were built to catch her falling sparks.'},
 ignaris:{n:'Ignaris',t:'The First Flame',el:'fire',b:{dmg:.1},bd:'+10% to all damage',sum:{n:'The First Flame',pow:66},
  lore:'The First Dragon of Fire, eldest of the Seven. Every dragon of Pyrrhos descends from her. She was the second dragon Caedric devoured.'},
 thalor:{n:'Thalor',t:'The Deep',el:'water',b:{spi:3,heal:.3},bd:'+3 Spirit, +30% healing',sum:{n:'Tide of Thalor',healPct:.5,shield:40},
  lore:'The First Dragon of Water, who sleeps at the bottom of the Abyssal Sea. The Tide Queen claims he still answers her.'},
 lumina:{n:'Lumina',t:'The Dawn',el:'light',b:{el:{light:.15}},bd:'+15% light damage',sum:{n:'Dawn of Lumina',pow:62},
  lore:'The First Dragon of Light, who hid Lumeria in the clouds. Husks cannot bear to look at her.'},
 durin:{n:'Durin Deepforge',t:'The Last Warden',el:'earth',b:{dr:.12},bd:'12% less damage taken',sum:{n:'The Warden\'s Stand',shield:80},
  lore:'A dwarf warrior who walked behind the Lower Seal with four hundred others, so that Kharak would live. He kept the door for three hundred years.'},
 elowen:{n:'Young Elowen',t:'Archer of the Black Moon',el:'wind',b:{agi:4},bd:'+4 Agility',sum:{n:'Black Moon Arrow',pow:72,pierce:1},
  lore:'At the Battle of the Black Moon, a young elf archer put an arrow through the Hollow King\'s shadow. Four hundred years later she is the Archon of Sylvaris.'},
 isolde:{n:'Queen Isolde',t:'The Dragonrider',el:'fire',b:{str:2,spi:2},bd:'+2 Strength, +2 Spirit',sum:{n:'Dragonfall Charge',pow:64,stun:.3},
  lore:'The Queen of Pyrrhos during the Sundering, who led the Ember Fleet into the Abyss so the other nations could escape. Her dragon\'s skull hangs in Cindral.'}
};
Object.entries(LEG).forEach(([k,l])=>{CODEX['leg_'+k]=[`Legend · ${l.n}, ${l.t}`,l.lore]});
const STORE={
 packs:[['crowns_100','Pouch of Crowns',100,'€0.99',''],['crowns_550','Chest of Crowns',550,'€4.99','+10%'],['crowns_1200','Vault of Crowns',1200,'€9.99','+20%'],['crowns_2600','Dragon Hoard',2600,'€19.99','Best value']],
 items:{draught:['Healing Draught','Restores 50% HP in battle',60,10],ether:['Mana Ether','Restores 60% MP in battle',60,10],ember:['Dragon\'s Ember','+50% damage for 3 turns',120,20],phoenix:['Phoenix Feather','Revives you once at 50% HP when you fall',400,40]},
 boosts:{xpscroll:['Scroll of Insight','+150 XP right now',30],spshard:['Skill Shard','+1 Skill Point right now',60]},
 tome:{crowns:250,gold:900,max:3},pact:600
};
const ADS={every:7,rewardGold:60,perDay:5};

EN.golem.teamOnly=1;EN.sentinel.teamOnly=1;

/* ================= v4: new lives, enemies and drops ================= */
Object.assign(CHARS,{
 nerissa:{n:'Nerissa Deepcurrent',race:'Merfolk',nation:'The Tide Courts, Thalassa',bg:'tide',start:'nes_1',
  aff:{water:91,light:47},stats:{str:5,agi:5,mana:6,ctrl:4,spi:5},skills:['wa_t1','li_r1'],
  hook:"A pearl diver from the only nation whose ships sail near Gravemont. Something is moving in the drowned fleet at the bottom of the Abyss.",
  traits:[['t_lungs','Deep Lungs','+50 HP, +2 Spirit. The pressure of the deep is nothing to you.',{hp:50,spi:2}],
   ['t_pearlmind','Pearl Mind','+3 Mana, +2 MP every turn.',{mana:3,regen:2}],
   ['t_riptide','Riptide','+15% water damage, +2 Control.',{el:{water:.15},ctrl:2}]],
  classes:[['Abyss Warden','+15% water damage, +40 HP. Grants Abyssal Gate.',{el:{water:.15},hp:40},'c_abyss'],
   ['Pearl Oracle','+20% light damage, +30% healing. Grants Pearl Choir.',{el:{light:.2},heal:.3},'c_pearl'],
   ['Leviathan Rider','+20% water damage. Grants Leviathan\'s Wake.',{el:{water:.2}},'c_levi']]},
 pip:{n:'Pip Glimmerwing',race:'Fairy',nation:'The Oracle\'s Hall, Lumeria',bg:'lumeria',start:'pip_1',
  aff:{light:93,wind:44},stats:{str:2,agi:7,mana:7,ctrl:5,spi:4},skills:['li_r1','w_g1'],
  hook:"A lamplighter fairy who was never supposed to leave the clouds. The Oracle's prophecy has her name in it.",
  traits:[['t_lumen2','Lumen Heart','+4 Mana, +20% healing.',{mana:4,heal:.2}],
   ['t_quickwing','Quickwing','+4 Agility, +5% dodge.',{agi:4,dodge:5}],
   ['t_prismeye','Prism Eye','+12% light damage, +6% crit.',{el:{light:.12},crit:6}]],
  classes:[['Dawnbringer','+20% light damage. Grants Dawnbreak.',{el:{light:.2}},'c_dawnb'],
   ['Prism Weaver','+3 Control, +10% damage. Grants Prism Storm.',{ctrl:3,dmg:.1},'c_prism'],
   ['Lantern Saint','+50 HP, +30% healing. Grants Lantern of Saints.',{hp:50,heal:.3},'c_lantern']]}
});
Object.assign(EN,{
 drowned:{n:'Drowned Sailor',hp:80,atk:10,def:2,weak:['light'],res:['water'],xp:55,heavy:'Anchor Swing',d:'A sailor of the Ember Fleet, three hundred years under the sea.',drop:'a_chain'},
 eel:{n:'Abyss Eel',hp:92,atk:11,def:2,weak:['lightning'],res:['water'],xp:62,heavy:'Crushing Coil',d:'Forty feet of teeth from the bottom of the Abyssal Sea.'},
 lumshade:{n:'Shade in the Light',hp:78,atk:10,def:1,weak:['light'],xp:55,heavy:'Swallowed Glow',d:'The first shadow ever to climb into Lumeria.'}
});
EN.warden.drop='w_dagE';EN.golem.drop='a_moss';EN.sentinel.drop='a_glass';EN.vale.drop='w_hollow';EN.hknight.drop='a_deep';EN.legion.drop='w_iron';EN.thalion.drop='w_hunter';
CODEX.drowned=['The Drowned Fleet','At the bottom of the Black Trench lie the warships of the Ember Fleet, which Queen Isolde of Pyrrhos led into the Abyss in the last year of the Sundering so the other nations could escape. Their embers never went out.\n\nA Thalassan admiral sailed with her. He is still at her side.'];
CODEX.oracle=['The Oracle of Lumeria','A voice made of light at the heart of the Oracle\'s Hall. Its prophecies have never been wrong. In the year 300 AS it spoke a second line no one had heard before: "a small light must walk beside the weight."'];
CODEX.orbs=['The Legendary Orbs','Each of the seven nations hides five Legendary Orbs: crystallized fragments of its First Dragon\'s power. Lesser, Greater, Grand, Mythic, and Transcendent.\n\nA person who bonds with an orb can use its power in battle. A person who holds a Transcendent orb is said to become something more than mortal, as the Crown-bearers did in the Sundering.\n\nThirty-five orbs. Most have not been seen in three hundred years.'];
LOOKS.ysolde={skin:'#d9a27a',hair:'braid',hairC:'#5a3a22',eyes:'#5cb8ff',outfit:'coat',outC:'#1f3a5a',trim:'#e8edf2',mark:'scar',ears:'human',beard:'none',extra:'none',build:'average',aura:'#5cb8ff'};
LOOKS.bramble={skin:'#f3d2b4',hair:'messy',hairC:'#5a3a22',eyes:'#8fe3b0',outfit:'jacket',outC:'#3a5a8a',trim:'#ffd36b',mark:'freckles',ears:'pointy',beard:'none',extra:'wings',build:'slim',aura:'#8fe3b0'};
