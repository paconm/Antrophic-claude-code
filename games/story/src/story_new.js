/* ================= NERISSA · THALASSA ================= */
Object.assign(BONDN,{ysolde:'Captain Ysolde · Adoptive mother',thessaly:'Queen Thessaly · Tide Queen',bramble:'Bramble · Best friend',oracle:'The Oracle'});
const CH_NE='Prologue · Nerissa · The Drowned Fleet';
const CH_PI='Prologue · Pip · The Small Light';
Object.assign(SCN,{
 nes_1:{bg:'sea',ch:CH_NE,h:'The Black Trench',codex:'thalassa',txt:()=>[
  `Twenty fathoms of rope, a knife, and a net for pearls. You are Nerissa Deepcurrent, twenty years old, merfolk of the Tide Courts, and the best pearl diver on the Abyssal Sea.`,
  `The <i>Gull's Promise</i> rocks above the Black Trench. Only Thalassan ships sail this close to Gravemont. Everyone else is too afraid.`,
  `Captain Ysolde Marrow leans on the rail: the human woman who pulled you out of the wreck of your parents' ship when you were a baby, and never gave you back.`,
  `@Captain Ysolde: The whales stopped singing three days ago, Neri. The pearls can wait.`,
  `You look down. Far below the surface, deep in the Trench where no light should reach, something is glowing orange.`],
  c:[{t:'Dive for the glow',s:'Deeper than anyone has ever gone',fx:()=>{aff('water',2);F.deep=1},to:'nes_2'},
   {t:'Dive the pearl beds, as planned',s:'Safe, and it pays',fx:()=>{gold(60);stat('agi',1)},to:'nes_1b'},
   {t:'"Why did the whales go quiet?"',s:'Ask Ysolde first',fx:()=>{bond('ysolde',2);codex('drowned')},to:'nes_1c'}]},
 nes_1b:{bg:'tide',ch:CH_NE,h:'The Pearl Beds',txt:()=>[
  `The pearl beds are quiet. Too quiet. No fish. No crabs. Just you and the oysters.`,
  `In the last oyster you open there is a black pearl the size of an eye. Ysolde will cry when she sees it. It is worth more than the ship.`,
  `But below you, the orange glow pulses. Once. Twice. Like a heartbeat.`],
  c:[{t:'Pocket the pearl and follow the glow',fx:()=>{grant('x_pearl')},to:'nes_2'}]},
 nes_1c:{bg:'sea',ch:CH_NE,h:'Whale-Song',txt:()=>[
  `@Captain Ysolde: My grandmother said the whales went quiet once before. The year the Sundering started. They know when something big moves in the Abyss.`,
  `She grips your wrist with a sailor's hand, rough as rope.`,
  `@Captain Ysolde: If you go down there, you come back up. Promise me.`],
  c:[{t:'"I always come back up."',fx:()=>{bond('ysolde',2);stat('spi',1)},to:'nes_2'}]},
 nes_2:{bg:'tide',ch:CH_NE,h:'The Drowned Fleet',codex:'drowned',txt:()=>[
  `At the bottom of the Trench lie ships. Dozens of them. Dragon-prowed warships of Pyrrhos, burned black, still glowing with embers that never went out.`,
  `The Ember Fleet. Queen Isolde's fleet, lost in the last year of the Sundering. Three hundred years at the bottom of the sea, and still burning.`,
  `Something moves on the deck of the flagship: a sailor in rotten red armor, skin grey as ash, eyes two holes. A drowned husk.`,
  `It turns toward you, and the water around it goes cold and dead.`],
  c:[{t:'Fight',fight:'drowned',to:'nes_2w'}]},
 nes_2w:{bg:'tide',ch:CH_NE,h:'Isolde\'s Flagship',txt:()=>[
  `In the captain's cabin, two skeletons sit side by side at a table. A woman in a burned crown. And a merfolk admiral, one hand still resting on a trident that glows faintly blue.`,
  `Between them lies a map, drawn in dragonfire ink that still shines: a route through the Abyss, all the way to the ruins of Gravemont.`,
  `They sailed here together, so the other nations could escape. They never left.`],
  c:[{t:'Take the trident and the map',s:'The dead would want it used',fx:()=>{grant('w_triL');F.map=1;codex('gravemont')},to:'nes_3'},
   {t:'Say the Thalassan prayer for the drowned first',s:'Then take them',fx:()=>{aff('light',2);grant('w_triL');F.map=1;F.prayer=1},to:'nes_3'},
   {t:'Take only the map. Leave the dead their weapons.',s:'Respect',fx:()=>{F.map=1;stat('spi',2)},to:'nes_3'}]},
 nes_3:{bg:'tide',ch:CH_NE,h:'The Tide Queen',txt:()=>[
  `The Tide Courts glitter under the sea: halls of living coral, lit by jellyfish lanterns. Queen Thessaly listens to your report from a throne of white shell. She is four hundred years old, and her silver scales have gone pale as moonlight.`,
  `@Queen Thessaly: The Ember Fleet, stirring. ${F.map?'And a map to Gravemont, in Isolde\'s own ink.':'And you left the dead in peace. Good.'}`,
  `@Queen Thessaly: Thalassa takes no sides. That is how we survived the Sundering. But this is not a side. This is the war, coming back.`,
  `@Queen Thessaly: In three months the six nations meet at Arcanum for the Rite of Renewal. Our envoy goes. And you, Nerissa, go with him. As my eyes. Find the gravity-bearer the rumors speak of.`],
  c:[{t:'"Why me?"',fx:()=>{bond('thessaly',1)},to:'nes_3a'},
   {t:'"I\'ll go."',fx:()=>{bond('thessaly',2);stat('spi',1)},to:'nes_3b'}]},
 nes_3a:{bg:'tide',ch:CH_NE,h:'The Tide Queen',txt:()=>[
  `@Queen Thessaly: Because you went down when everyone else stayed up. Because you came back. And because you were raised by a human, child. You will understand them better than any of my courtiers.`,
  `She almost smiles.`,
  `@Queen Thessaly: Also, you are the only one of us who can grow legs for longer than an afternoon. Try not to trip.`],
  c:[{t:'"I\'ll go."',fx:()=>{bond('thessaly',1)},to:'nes_3b'}]},
 nes_3b:{bg:'tide',ch:CH_NE,h:'The Healing Halls',txt:()=>[
  `Before you leave, you swim through the healing halls to say goodbye to the healers who patched you up after every bad dive.`,
  `In the warm pools, a human boy from Voltara is learning to swim, with a healer holding him up. His lungs, they tell you, were full of spark-dust when he arrived. Now he laughs like any other kid.`,
  `@Nico: You're going to Arcanum? My sister's there! Kaida. She's got lightning and a really bad temper.`,
  `@Nico: If you see her, tell her I'm okay. And tell her the fish here are rude.`],
  c:[{t:'"I\'ll tell her. Word for word."',fx:()=>{F.nicoMsg=1;bond('nico',2)},to:'nes_4'},
   {t:'Give him your black pearl for luck',req:()=>st.gear.inv.includes('x_pearl'),lock:'You don\'t have a pearl',fx:()=>{F.nicoMsg=1;bond('nico',3);st.gear.inv=st.gear.inv.filter(i=>i!=='x_pearl');if(st.gear.eq.accessory==='x_pearl')delete st.gear.eq.accessory;sysMsg('You gave Nico the black pearl.')},to:'nes_4'}]},
 nes_4:{bg:'sea',ch:CH_NE,h:'Storm on the Abyssal Sea',txt:()=>[
  `The envoy's ship sails north toward the river that climbs to the Lake of Seven. On the third night a storm hits: black waves taller than the mast.`,
  `Then the hull shudders. Something has wrapped around the keel. Forty feet of eel, grey as a corpse, with a mouth like a cave full of needles.`,
  `@Captain Ysolde: Neri! It's dragging us under!`],
  c:[{t:'Dive in and fight it',fight:'eel',fx:()=>{},to:'nes_5'}]},
 nes_5:{bg:'tide',ch:CH_NE,h:'The Eye in the Deep',txt:()=>[
  `The eel goes limp and sinks. So do you. You're exhausted, and the storm has dragged you deep, deeper than the Trench, into a darkness that has no bottom.`,
  `Then an eye opens below you. An eye as big as the moon, ringed with old gold.`,
  `@???: Child of the tide. You went down when everyone else stayed up. Choose what you will become.`,
  `#AWAKENING I · Your core has kindled. Choose a Trait.`],
  c:()=>traitChoices('nes_6')},
 nes_6:{bg:'academy',ch:CH_NE,h:'Arcanum',txt:()=>[
  `The river climbs, impossibly, uphill, through seven waterfalls into the sky, and spills into the Lake of Seven. Above it floats Arcanum Academy.`,
  `You step onto the dock on your tide-legs, wobbling, and immediately walk into a crate.`,
  `@Captain Ysolde: Graceful. Truly. Go on, Neri. Find your gravity-bearer. And come back up.`,
  `#Prologue complete. Your story is about to merge with others.`],
  c:[{t:'Step onto the skyport',fx:()=>{xp(30)},to:'arc_1'}]},

 /* ================= PIP · LUMERIA ================= */
 pip_1:{bg:'lumeria',ch:CH_PI,h:'The Oracle\'s Hall',codex:'lumeria',txt:()=>[
  `Lumeria floats above the clouds, where no map can find it: a city of crystal spires and lanterns that never go out.`,
  `You are Pip Glimmerwing. You are a hundred and twenty years old, which for a fairy is young, but very much grown. You are a lamplighter of the Oracle's Hall, and last night, for the first time in three hundred years, the Oracle's light flickered.`,
  `@Bramble: Everyone's pretending it didn't happen. Which means everyone's terrified.`,
  `Your best friend Bramble lands beside you on his moth, wings dusted silver, freckles everywhere.`],
  c:[{t:'Polish the Great Lantern until it shines again',s:'Do your job',fx:()=>{aff('light',2)},to:'pip_2'},
   {t:'Sneak a look at the forbidden prophecy scrolls',s:'Find out why',fx:()=>{codex('rumor');F.scroll=1;stat('ctrl',1)},to:'pip_1b'},
   {t:'Fly with Bramble to the edge of the clouds',s:'Clear your head',fx:()=>{bond('bramble',2);stat('agi',1)},to:'pip_1c'}]},
 pip_1b:{bg:'lumeria',ch:CH_PI,h:'The Forbidden Scrolls',txt:()=>[
  `The prophecy room smells of dust and starlight. Most of the scrolls are about weather. One is not.`,
  `"When the weight returns to a mortal hand, the Pact is broken, or made whole." Every fairy knows that line. But under it, in fresh ink, a second line you have never seen:`,
  `"And a small light must walk beside the weight."`,
  `Somewhere below your feet, the clouds creak.`],
  c:[{t:'Run to tell the Oracle',fx:()=>{},to:'pip_2'}]},
 pip_1c:{bg:'lumeria',ch:CH_PI,h:'The Edge of the Clouds',txt:()=>[
  `You and Bramble sit on the very edge of Lumeria, legs dangling over a sea of clouds, the world far below hidden in white.`,
  `@Bramble: Do you ever want to go down there? See the humans? The dragons?`,
  `@You: Fairies don't leave Lumeria.`,
  `@Bramble: That's not what I asked.`,
  `Then the cloud under your feet cracks, like ice on a pond.`],
  c:[{t:'Pull Bramble back from the edge',fx:()=>{bond('bramble',1)},to:'pip_2'}]},
 pip_2:{bg:'lumeria',ch:CH_PI,h:'A Crack in the Clouds',txt:()=>[
  `Something climbs up through the crack. It is grey. It has no face, only two holes where eyes should be. Where it touches the clouds, they turn to ash.`,
  `In all the history of Lumeria, no shadow has ever reached the city. The lanterns nearest to it go out one by one.`],
  c:[{t:'Fight it with your light',fight:'lumshade',to:'pip_3'}]},
 pip_3:{bg:'lumeria',ch:CH_PI,h:'The Oracle',codex:'oracle',txt:()=>[
  `The Oracle's Hall is empty except for a light. Not a lantern. Just light, hanging in the air, speaking in a voice like warm bells.`,
  `@The Oracle: Pip Glimmerwing. You fought the shadow alone.`,
  `@The Oracle: "When the weight returns to a mortal hand, a small light must walk beside the weight." The gravity-bearer has woken, child. And the small light is you.`,
  `@The Oracle: You will go down to the world, to the academy called Arcanum, and you will walk beside them. Whatever comes.`],
  c:[{t:'"Why me? I light lanterns."',fx:()=>{bond('oracle',1)},to:'pip_3a'},
   {t:'"What is the Hollow King?"',fx:()=>{codex('hollowking')},to:'pip_3a'},
   {t:'"I\'ll go."',fx:()=>{bond('oracle',2);stat('spi',1)},to:'pip_4'}]},
 pip_3a:{bg:'lumeria',ch:CH_PI,h:'The Oracle',txt:()=>[
  `@The Oracle: Because a lamplighter knows the one thing every hero forgets. That light is not a weapon. Light is a promise that someone is still awake.`,
  `@The Oracle: The Hollow King is the opposite of that promise. A boy who decided the dark was kinder. He will try to make the gravity-bearer decide the same.`,
  `@The Oracle: Do not let them be alone in the dark, Pip.`],
  c:[{t:'"I won\'t."',fx:()=>{bond('oracle',1)},to:'pip_4'}]},
 pip_4:{bg:'lumeria',ch:CH_PI,h:'Lumen Bloom',txt:()=>[
  `To walk among humans, a fairy drinks Lumen Bloom and grows to their size for a year and a day. Everyone says it hurts. Everyone is right.`,
  `Before you drink, the light of the Oracle drifts down into your hands and becomes solid: a small brass lantern with a flame that does not flicker.`,
  `@The Oracle: Take my lantern. Where you carry it, I can see.`,
  `Bramble is crying and pretending it's pollen.`],
  c:[{t:'Drink the Bloom in one swallow',s:'Get it over with',fx:()=>{grant('w_wandL');stat('spi',1)},to:'pip_5'},
   {t:'Hug Bramble first',s:'Say goodbye properly',fx:()=>{grant('w_wandL');bond('bramble',3)},to:'pip_5'}]},
 pip_5:{bg:'sky',ch:CH_PI,h:'Falling Through the Sky',txt:()=>[
  `You fall through the clouds into the world below, human-sized and clumsy, your wings still too small to carry your new weight.`,
  `A wild wyvern spots you: a bright, glowing, falling snack. It dives.`],
  c:[{t:'Fight in midair',fight:'wyvern',to:'pip_6'}]},
 pip_6:{bg:'lumeria',ch:CH_PI,h:'Lumina\'s Eye',txt:()=>[
  `As the wyvern falls away, the sun breaks through the clouds and looks at you. Not the sun. An eye. Golden, enormous, ancient.`,
  `@???: Little light. You left the clouds when no one else would. Choose what you will become.`,
  `#AWAKENING I · Your core has kindled. Choose a Trait.`],
  c:()=>traitChoices('pip_7')},
 pip_7:{bg:'academy',ch:CH_PI,h:'Arcanum',txt:()=>[
  `You glide the last mile on wings that are slowly learning your new size, and land, badly, on the Skyport of Arcanum.`,
  `Humans everywhere. Loud. Tall. Nobody is glowing. You hold the Oracle's lantern tight.`,
  `Somewhere in this crowd is the gravity-bearer. You are supposed to walk beside them. You have no idea what they look like.`,
  `#Prologue complete. Your story is about to merge with others.`],
  c:[{t:'Step onto the skyport',fx:()=>{xp(30)},to:'arc_1'}]}
});
