/* ================= SIDE STORIES · BONDS & ROMANCE ================= */
const SQ={
 lyra:{titles:['Silver Arrows','The Teacher Who Vanished','Under the Same Stars'],teasers:['Lyra is alone on the eastern tower at dusk','Lyra found something in the old faculty records','Lyra is on the observatory roof. She asked for you.']},
 torvin:{titles:['No Ceiling','Starsteel','Stone-Song'],teasers:['Someone is singing in the cellar at midnight','Torvin has a very bad idea involving a frozen lake','Torvin is waiting at the edge of the island']},
 kaida:{titles:['Letters to Nowhere','The Spy in the Post Tower','Rooftop Lightning'],teasers:['Kaida is sitting on the highest roof again','Kaida got a letter. Someone opened it first.','A storm is coming. Kaida is at your window.']},
 ren:{titles:['Floating Lessons','The Gravemont Echo','What Matters'],teasers:()=>[`${R()} is alone on the frozen shore at dawn`,`${R()} found a name in Maren's archive`,`${R()} is on the bell tower with his pendant`]},
 kael:{titles:['Ashes in the Arena','Ember','Not My Father\'s Son'],teasers:['A fire is burning in the arena at midnight','Kael is hiding something in the old stables','Kael asked to see you before the Rite']}
};
const cn=id=>id==='kael'?'Kael':nm(id);
const tone=t=>{F.sqt=t};
const T=o=>o[F.sqt]||o.f;
const FL=(who,t,s,to,extra)=>({t:'♥ '+t,s:s||'Flirt',heart:1,req:()=>canFlirt(who),lock:()=>`Your heart belongs to ${cn(st.romance)}`,fx:()=>{tone('l');flirt(who);extra&&extra()},to});
const CF=(who,t,s,to)=>({t:'♥ '+t,s:s||'Confess your feelings',heart:1,req:()=>canConfess(who),lock:()=>st.romance&&st.romance!==who?`Your heart belongs to ${cn(st.romance)}`:`Needs: at least one ♥ moment with ${cn(who)}`,fx:()=>{romance(who)},to});
const back=()=>F.hubNext||'arc_3';
function hubChoices(h){const L=[];
 for(const c of others().concat(['kael'])){const s=st.sq[c]||0;if(s>=3)continue;
  const part=s+1,need=[0,3,6][s],hubOk=part===1||(part===2&&h>=2)||(part===3&&h>=3),ok=hubOk&&(st.bonds[c]||0)>=need;
  const tz=val(SQ[c].teasers)[s];
  L.push({t:`${cn(c)} · ${SQ[c].titles[s]}`,heart:st.romance===c,s:ok?tz:!hubOk?(part===3?'Opens on the night before the Rite':'Opens later in the year'):`Needs bond ${need} with ${cn(c)} (now ${st.bonds[c]||0})`,req:()=>ok,to:`sq_${c}_${part}`})}
 L.push({t:'Train alone in the Combat Hall',s:'+40 XP and a stat point',fx:()=>{xp(40);stat(['str','agi','ctrl','spi','mana'][h%5],1)},to:back});
 return L}
Object.assign(SCN,{
 /* ---------- hubs ---------- */
 hub_1:{bg:'academy',ch:'Free Time · First Evening',h:'Your First Free Evening',enter:()=>{F.hubNext='arc_3'},txt:()=>[
  `For the first time since you arrived, nobody is telling you where to be. The towers glow in seven colors. Somewhere a lute is playing badly. The lake below is silver under the moon.`,
  `#FREE TIME · Spend the evening with someone. Side stories build bonds, unlock rewards and change how the story ends.`],c:()=>hubChoices(1)},
 hub_2:{bg:'frozen',ch:'Free Time · Winter Break',h:'Winter Break',enter:()=>{F.hubNext='arc_8'},txt:()=>[
  `Winter break. Half the students have gone home. The Lake of Seven has frozen solid, and the corridors are so quiet you can hear the floating mountain hum.`,
  `After everything you found beneath the library, nobody feels like being alone.`,
  `#FREE TIME · Who do you spend the break with?`],c:()=>hubChoices(2)},
 hub_3:{bg:'academy',ch:'Free Time · The Night Before the Rite',h:'The Night Before the Rite',enter:()=>{F.hubNext='arc_10'},txt:()=>[
  `Tomorrow the six nations arrive. Tomorrow the black moon rises. Nobody at Arcanum can sleep.`,
  `If there is something you need to say to someone, tonight might be your last chance to say it.`,
  `#FREE TIME · This is the last free evening of Volume I.`],c:()=>hubChoices(3)},

 /* ---------- LYRA ---------- */
 sq_lyra_1:{bg:'academy',ch:'Side Story · Lyra',h:'Silver Arrows',txt:()=>[
  `Dusk on the eastern tower. Lyra is alone, firing arrow after arrow at a target nailed to a chimney two hundred feet away. Every arrow hits dead center. She keeps shooting anyway.`,
  `@Lyra: If you're going to stare, at least hold the target.`,
  `@You: You've hit the center forty times.`,
  `@Lyra: Forty-one. In Silverwood, nobody cared how well I shot. They only looked at my hands. Here, they look at my ears.`,
  `She lowers the bow. Her fingertips are glowing gold again, the way they do when she's upset.`,
  `@Lyra: A Pyrrhos boy asked me today if elves sleep hanging upside down like bats. A girl from Voltara asked if she could touch my ears for luck. For luck.`],
  c:[{t:'"Teach me to shoot like that."',s:'Friendly',fx:()=>{tone('f');bond('lyra',2);stat('agi',1)},to:'sq_lyra_1b'},
   FL('lyra','"For the record, your aim isn\'t the only thing up here worth staring at."',null,'sq_lyra_1b'),
   {t:'"Your hands are glowing. Is it about your mother?"',s:'Serious',fx:()=>{tone('s');bond('lyra',1);F.lyraMother=1},to:'sq_lyra_1b'}]},
 sq_lyra_1b:{bg:'academy',ch:'Side Story · Lyra',h:'Silver Arrows',txt:()=>[...T({
  f:[`She raises an eyebrow, then hands you the bow. For an hour she corrects your stance, your grip, the way you breathe.`,`@Lyra: You hold your breath like a human. Breathe out when you release. Let the arrow carry the breath for you.`,`On your thirtieth try you hit the chimney. Not the target. The chimney.`,`Lyra laughs so hard she has to sit down on the cold stone. It's the first time you've heard her laugh, really laugh, and it sounds like wind chimes.`],
  l:[`Lyra stares at you. Her ears go pink at the tips. Then, slowly, all the way up.`,`@Lyra: That was the most human thing anyone has ever said to me.`,`@You: Is that bad?`,`@Lyra: I haven't decided yet.`,`But she doesn't look away. And the gold in her fingertips gets brighter, not dimmer.`,`@Lyra: Hold the target, then. Since you're so interested in what's up here.`],
  s:[`For a long time she doesn't answer.`,`@Lyra: Aelira Windsong. My mother. She came to the human lands when she was sixty-one, like me. She taught here, at Arcanum. Thirty years ago.`,`@You: What happened to her?`,`@Lyra: Nobody knows. One winter she stopped writing home. The academy sent my grandmother a letter saying she had "left her post."`,`@Lyra: Elves don't leave their posts.`,`She looks down at the courtyard far below.`,`@Lyra: That's the real reason I came. Not the Rite. Her.`]}),
  `When the first stars come out, she walks you to the stairs and stops on the top step.`,
  `@Lyra: …Thank you. For not asking about my ears.`],
  c:[{t:'"Anytime. Same time tomorrow?"',fx:()=>{sqDone('lyra',1)},to:back}]},
 sq_lyra_2:{bg:'frozen',ch:'Side Story · Lyra',h:'The Teacher Who Vanished',txt:()=>[
  `Lyra finds you in the empty dining hall and drops a dusty ledger onto your plate.`,
  `@Lyra: Faculty records, thirty years old. I may have borrowed them from the archive. Maren may have looked the other way.`,
  `She opens it to a page. Under "Elemental Theory" there are two names. One is Professor Vale. The other has been scratched out so hard the pen tore the paper.`,
  F.lyraMother?`@Lyra: That's her. That's my mother's name. Someone scratched her out of the academy like she was a mistake.`:`@Lyra: My mother taught here. Aelira Windsong. Thirty winters ago she vanished, and the academy said she "left her post." This is her name. Someone scratched her out like she was a mistake.`,
  `@Lyra: Her old rooms were in the east wing. It's been closed since before either of us was born. I'm going tonight. You don't have to come.`],
  c:[{t:'"Of course I\'m coming."',s:'Friendly',fx:()=>{tone('f');bond('lyra',1)},to:'sq_lyra_2b'},
   FL('lyra','"I\'d follow you into a lot worse than a closed wing."',null,'sq_lyra_2b'),
   {t:'"Shouldn\'t we tell Seraphine first?"',s:'Cautious',fx:()=>{tone('s');stat('spi',1)},to:'sq_lyra_2b'}]},
 sq_lyra_2b:{bg:'vault',ch:'Side Story · Lyra',h:'The East Wing',txt:()=>[
  ...T({f:[`@Lyra: Good. I was going to drag you along anyway.`],l:[`Lyra glances at you sideways and almost smiles.`,`@Lyra: Careful. I might hold you to that.`],s:[`@Lyra: Seraphine signed the letter that said my mother left her post. I'm not telling her anything until I know why.`]}),
  `At midnight the east wing is silent and freezing. Frost grows on the inside of the windows. Every door is locked except one, at the very end, with a leaf carved into the frame.`,
  `Inside: a narrow bed. A desk facing the lake. A teacup that has been sitting there for thirty years.`,
  `Then the shadow in the corner stands up. A husk in the grey uniform of an academy caretaker, still holding a ring of keys. It has been guarding this room for a very long time.`],
  c:[{t:'Fight beside Lyra',fight:'wshade',with:'lyra',to:'sq_lyra_2c'}]},
 sq_lyra_2c:{bg:'vault',ch:'Side Story · Lyra',h:'A Letter for Lyra',codex:'aelira',txt:()=>[
  `In the desk drawer, under thirty years of dust, there is a letter. The envelope says one word in elvish: Lyra.`,
  `She reads it out loud. Her voice only shakes a little.`,
  `@Lyra: "My dearest Lyra. You are too young to read this yet, so I will give it to you when you are older. Something is wrong at Arcanum. The door beneath the library is being fed. I have seen who does it. Tomorrow I will go to the Headmistress, and then I will come home to you, and we will…"`,
  `The rest has been torn away.`,
  `Lyra sits down on her mother's bed with the letter in her lap. She doesn't cry. She just stops moving, the way a deer goes still in the forest.`],
  c:[{t:()=>(st.flirt.lyra?'♥ ':'')+'Sit beside her and take her hand',s:'Comfort',fx:()=>{bond('lyra',2);if(st.flirt.lyra)flirt('lyra')},to:'sq_lyra_2d'},
   {t:'"We\'ll find out who did this. I promise."',s:'A vow',fx:()=>{bond('lyra',2);F.lyraVow=1},to:'sq_lyra_2d'},
   {t:'Keep watch at the door and let her be alone with it',s:'Respect',fx:()=>{bond('lyra',1);stat('spi',1)},to:'sq_lyra_2d'}]},
 sq_lyra_2d:{bg:'vault',ch:'Side Story · Lyra',h:'A Letter for Lyra',txt:()=>[
  `You stay until the candle burns down. When Lyra finally stands, she ties something around your wrist: a faded silver ribbon from her mother's desk.`,
  `@Lyra: She wore this in her hair in every painting my grandmother keeps. I want you to have it. Because you came.`,
  `@Lyra: And because if I keep it, I'll just stare at it.`],
  c:[{t:'Walk her back to the dormitory',fx:()=>{F.ribbon=1;grant('x_ribbon');sqDone('lyra',2)},to:back}]},
 sq_lyra_3:{bg:'academy',ch:'Side Story · Lyra',h:'Under the Same Stars',enter:()=>{F.diary=1},txt:()=>[
  `The observatory roof. A sky so full of stars it looks like spilled sugar. Lyra is sitting with her knees pulled up, the torn letter in her lap, and a second scrap of paper beside it.`,
  `@Lyra: I found the rest. It was inside the binding of an old lecture book in the archive. Maren helped me. Guess whose lecture book.`,
  `She reads it to you.`,
  `@Lyra: "…it is Vale. He feeds the door with stolen elements. Tomorrow I tell Seraphine everything."`,
  `@Lyra: She never got to tell anyone. And tomorrow he'll stand in the Circle of Seals next to six kings, and smile.`,
  `#Evidence acquired: Aelira's letter names Vale.`,
  `She folds the letters away. Her voice is very quiet.`,
  `@Lyra: Elves don't cry in front of people. It's undignified. I've cried in front of you twice now.`,
  `@Lyra: My grandmother says elves only truly choose someone once in a hundred years. That you can feel it when it happens, like the wind changing direction.`,
  `She doesn't finish the sentence. She doesn't have to.`],
  c:[CF('lyra','"Then let me be your change in the wind."',null,'sq_lyra_3r'),
   {t:'"Whatever happens tomorrow, I\'m standing next to you."',s:'As her closest friend',fx:()=>{tone('f');bond('lyra',2)},to:'sq_lyra_3f'},
   {t:'"Tomorrow we make him answer for her."',s:'Justice',fx:()=>{tone('s');bond('lyra',2);stat('spi',1)},to:'sq_lyra_3f'}]},
 sq_lyra_3r:{bg:'academy',ch:'Side Story · Lyra',h:'The Wind Changes',txt:()=>[
  `For a heartbeat Lyra doesn't move.`,
  `Then the wind on the roof changes. It turns warm, out of nowhere, in the middle of winter, and wraps around both of you like a cloak.`,
  `@Lyra: …Oh.`,
  `@Lyra: Oh, it's you. Of course it's you.`,
  `She laughs, and she's crying a third time, and she doesn't seem to care about dignity at all anymore. When she leans in and kisses you, the stars are very bright, and every arrow she has ever fired was never as sure as this.`,
  `@Lyra: Don't you dare die tomorrow. I've only just found you.`],
  c:[{t:'"Not a chance."',fx:()=>{title('Beloved of the Silver Court');sqDone('lyra',3)},to:back}]},
 sq_lyra_3f:{bg:'academy',ch:'Side Story · Lyra',h:'Shield-Friend',txt:()=>[
  `Lyra looks at you for a long time. Then she pulls something from around her neck: a white stone arrowhead on a silver chain, carved like a leaf.`,
  `@Lyra: My mother's. She gave it to me before she left. Elves give these to the ones they trust to guard their back in battle.`,
  `She puts it over your head.`,
  `@Lyra: You're the only human I'd ever give it to. Don't tell anyone. I have a reputation.`],
  c:[{t:'"Your secret\'s safe."',fx:()=>{stat('agi',1);title('Lyra\'s Shield-Friend');grant('x_arrowhead');sqDone('lyra',3)},to:back}]},

 /* ---------- TORVIN ---------- */
 sq_torvin_1:{bg:'underhold',ch:'Side Story · Torvin',h:'No Ceiling',txt:()=>[
  `It's past midnight when you hear it: someone singing, very softly, somewhere under the dormitory. You follow it down to the wine cellar.`,
  `Torvin is lying flat on his back on the stone floor, one candle beside him, singing to the foundations.`,
  `@Torvin: Ah. You caught me.`,
  `He doesn't get up.`,
  `@Torvin: I can't sleep up there. There's a window. And behind the window there's nothing. Just… up. Forever.`,
  `@Torvin: Back home, the ceiling is a mountain. You always know where the world ends. My head knows the sky won't fall on me. My stomach doesn't believe a word of it.`,
  `@Torvin: Aunt Hilde would laugh herself sick if she saw me now.`],
  c:[{t:'Lie down next to him: "Then we sleep down here."',s:'Friendly',fx:()=>{tone('f');bond('torvin',2)},to:'sq_torvin_1b'},
   FL('torvin','"Close your eyes. I\'ll be your ceiling tonight."',null,'sq_torvin_1b'),
   {t:'"Tell me about the thing you found below the Seal."',s:'Serious',fx:()=>{tone('s');bond('torvin',1);codex('fragment')},to:'sq_torvin_1b'}]},
 sq_torvin_1b:{bg:'underhold',ch:'Side Story · Torvin',h:'No Ceiling',txt:()=>T({
  f:[`You lie on the freezing floor side by side. Torvin teaches you the first verse of the stone-song, and you sing it wrong four times.`,`On the fifth try, the floor hums back. Very gently. Like a cat.`,`@Torvin: Ha! It likes you. The stone doesn't like anyone. It barely tolerates me.`,`He falls asleep halfway through the second verse, snoring like a forge bellows. You stay anyway.`],
  l:[`Torvin opens one eye. Then the other. His beard can't quite hide that his face has gone as red as a forge.`,`@Torvin: That's a very un-dwarvish thing to say.`,`@You: Is it working?`,`@Torvin: …Yes. Annoyingly.`,`He closes his eyes. You sit beside him and talk about nothing: your home, his, the worst food at Arcanum, the time Gimm got his beard stuck in a door. Somewhere around the third story his breathing slows. His hand finds yours on the stone floor, and stays there.`],
  s:[hasFrag()?`He pulls a shard of black stone from his pocket. It's humming, faintly.`:`He tells you about the black shard of stone he found below the Seal, and how the Council took it from him.`,`@Torvin: It was inside my ancestor's armor. Where his heart should've been. I think it kept him… not alive. Awake. For three hundred years.`,`@Torvin: Something that strong doesn't come from Kharak. It came from Gravemont. And ever since I touched it, I've felt it pulling me north.`,`He looks at the low cellar ceiling, and for once it doesn't seem to comfort him.`]}),
  c:[{t:'Stay until morning',fx:()=>{sqDone('torvin',1)},to:back}]},
 sq_torvin_2:{bg:'underhold',ch:'Side Story · Torvin',h:'Starsteel',txt:()=>[
  `Torvin drags you to the academy's abandoned forge, a cavern carved into the underside of the floating mountain. It hasn't been lit in fifty years. He has already cleaned every inch of it.`,
  `@Torvin: I'm going to forge something worthy of Deepforge. Something that makes the Council choke on their own beards. But I need starsteel.`,
  `@Torvin: There's a fallen star at the bottom of the Lake of Seven. The founders sank it there. I read it in Maren's archive. The ice is three feet thick, I have one pickaxe, and a very bad idea.`],
  c:[{t:'"I\'ll hold the rope."',s:'Friendly',fx:()=>{tone('f');bond('torvin',1)},to:'sq_torvin_2b'},
   FL('torvin','"A very bad idea and a very good dwarf. I\'m in."',null,'sq_torvin_2b'),
   {t:'"Why does this matter so much to you?"',s:'Serious',fx:()=>{tone('s');bond('torvin',1)},to:'sq_torvin_2b'}]},
 sq_torvin_2b:{bg:'frozen',ch:'Side Story · Torvin',h:'Beneath the Ice',txt:()=>[
  ...(F.sqt==='s'?[`@Torvin: Because if I go home with nothing, the Council takes the forge from my family. Aunt Hilde's forge. Her mother's before that. Three hundred years of fire, gone because I wasn't good enough.`,`@Torvin: So I'm going to be good enough.`]:F.sqt==='l'?[`Torvin coughs into his beard. @Torvin: Right. Yes. Good. Bring a coat.`]:[`@Torvin: Good. Tie it twice. Dwarves sink.`]),
  `The Lake of Seven at midnight is a sheet of black glass under the stars. Torvin cuts a hole with three swings and a stone-song. Far below, something glows white: the fallen star.`,
  `Then the ice cracks in a long line toward you. Something under it is moving. Something big, and cold, and very awake.`],
  c:[{t:'Fight beside Torvin',fight:'rimewyrm',with:'torvin',to:'sq_torvin_2c'}]},
 sq_torvin_2c:{bg:'underhold',ch:'Side Story · Torvin',h:'A Promise in Metal',txt:()=>[
  `Torvin forges all night. You fall asleep against the warm stone wall and wake up to the smell of hot metal and the sound of him humming.`,
  `He kneels and holds out what he made: a band of starsteel, silver-white, thin enough to wear on your wrist, carved with tiny runes that glow when you touch them.`,
  `@Torvin: Dwarves don't make gifts. We make promises in metal. This one says: whatever comes for you, it has to get through me first.`],
  c:[{...FL('torvin','"Then here\'s mine: I\'ve got yours, too."'),fx:()=>{tone('l');flirt('torvin');starsteel()},to:back},
   {t:'"Thank you, Torvin. Really."',s:'Friendly',fx:()=>{bond('torvin',2);starsteel()},to:back}]},
 sq_torvin_3:{bg:'academy',ch:'Side Story · Torvin',h:'Stone-Song',txt:()=>[
  `The night before the Rite, Torvin finds you on the very edge of the floating island, where you can feel the whole mountain hum through your feet.`,
  `@Torvin: I wrote to Aunt Hilde. Told her about the Rite. About all of you. She wrote back one line: "Don't be a hero."`,
  `He laughs into his beard.`,
  `@Torvin: Bit late for that.`,
  `@Torvin: There's an old custom in Kharak. When a dwarf finds the one they'd stand beside until the mountain falls, they carve them a stone. I've been carving one for weeks.`,
  `He opens his fist. A small stone, polished smooth as glass, with your name carved into it in dwarf-runes.`,
  `@Torvin: I'm no good with words. Stone's easier. You can read it however you want. Friend. Or… more.`],
  c:[CF('torvin','"I\'m reading it as \'more.\'"',null,'sq_torvin_3r'),
   {t:'"Friend. Until the mountain falls."',s:'Clan-friend',fx:()=>{tone('f');bond('torvin',2)},to:'sq_torvin_3f'},
   {t:'"Carve one for each of us. We\'re a clan now."',s:'For the team',fx:()=>{tone('f');others().forEach(o=>bond(o,1))},to:'sq_torvin_3f'}]},
 sq_torvin_3r:{bg:'academy',ch:'Side Story · Torvin',h:'More',txt:()=>[
  `Torvin goes very still. Then he grins so widely his beard practically doubles in size.`,
  `@Torvin: Good. Good! Because I carved the runes for "more." I just didn't tell you.`,
  `He sings. Not the clan-song, not the stone-song. Something new, low and warm, and the whole floating mountain hums along under your feet as if it approves.`,
  `Then he kisses your knuckles, very formally, like a dwarf lord at a feast, and you laugh until you both nearly fall off the edge of the world.`],
  c:[{t:'Hold the stone to your heart',fx:()=>{title('Stone-Chosen');grant('x_carved');sqDone('torvin',3)},to:back}]},
 sq_torvin_3f:{bg:'academy',ch:'Side Story · Torvin',h:'Clan-Friend',txt:()=>[
  `He presses the stone into your palm and closes your fingers around it.`,
  `@Torvin: Clan-friend of Deepforge, then. In Kharak that means my aunt will try to feed you until you burst. Consider yourself warned.`],
  c:[{t:'"I\'ll bring an empty stomach."',fx:()=>{stat('spi',1);title('Clan-Friend of Deepforge');grant('x_carved');sqDone('torvin',3)},to:back}]},

 /* ---------- KAIDA ---------- */
 sq_kaida_1:{bg:'academy',ch:'Side Story · Kaida',h:'Letters to Nowhere',txt:()=>[
  `You find Kaida on the highest roof of the dormitory, legs dangling over a hundred-foot drop, writing on a piece of paper braced on her knee.`,
  `@Kaida: Don't. Say. Anything about the drop. I grew up on roofs. The ground's the scary part.`,
  `She writes a line. Crumples the paper. Then smooths it out again.`,
  `@Kaida: It's for my brother. Nico. He's on a ship to Thalassa, or he's already there, or… I don't know. I don't have an address. I don't even know if he's okay.`,
  `@Kaida: I write him one every night anyway. I've got twenty-three now. Pathetic, right?`],
  c:[{t:'"Not pathetic. Let\'s find a way to send them."',s:'Friendly',fx:()=>{tone('f');bond('kaida',2)},to:'sq_kaida_1b'},
   FL('kaida','"You take care of everyone. Who takes care of you?"',null,'sq_kaida_1b'),
   {t:'"Tell me about the man in the silver cloak."',s:'Serious',fx:()=>{tone('s');bond('kaida',1);codex('project')},to:'sq_kaida_1b'}]},
 sq_kaida_1b:{bg:'academy',ch:'Side Story · Kaida',h:'Letters to Nowhere',txt:()=>T({
  f:[`It takes you all evening to figure it out. The Tide Queen's envoy sends a mail-ship to the coast every week. Kaida forges a perfect Thalassan seal on her first try, which is either impressive or alarming.`,`You drop all twenty-three letters into the mail sack together.`,`@Kaida: If he reads all of these, he'll think I've gone soft.`,`@You: Have you?`,`@Kaida: …Maybe a little. Don't spread it around.`],
  l:[`Kaida opens her mouth to say something sharp. Nothing comes out.`,`@Kaida: Nobody's asked me that since my mom died.`,`She looks away, at the lights of the academy below.`,`@Kaida: The answer's nobody, by the way. That's how it works where I'm from.`,`You sit down beside her on the edge of the roof, close enough that your shoulders touch. She doesn't move away.`,`@Kaida: You're really bad at being scared of heights, you know that?`,`@You: I'm not scared. You're here.`,`She doesn't answer. But a tiny spark jumps from her shoulder to yours, and she doesn't apologize for it.`],
  s:[`She tells you everything. The tanks on Floor Forty. The husks wired to machines. Director Corven shaking hands with a man in a silver cloak.`,`@Kaida: The Directorate is drinking the Void to power their city. And everyone in Sparkhaven is so happy the lights never go out.`,`@Kaida: I used to be one of them. Happy. Not asking.`,`She tucks the letter into her jacket.`,`@Kaida: Not anymore.`]}),
  c:[{t:'Stay until the lamps go out',fx:()=>{sqDone('kaida',1)},to:back}]},
 sq_kaida_2:{bg:'frozen',ch:'Side Story · Kaida',h:'The Spy in the Post Tower',txt:()=>[
  `Kaida slams a letter down on your desk. A Thalassan seal. Handwriting that wobbles all over the page.`,
  `@Kaida: It's from Nico. He's okay. The healers in the Tide Courts fixed his lungs. He's learning to swim. He says the fish are "rude."`,
  `She's grinning so hard it must hurt. Then her face changes. She turns the envelope over. The wax seal has been cut and melted back together. Neatly. Professionally.`,
  `@Kaida: Someone opened this. Someone at Arcanum is reading my mail. And only one kind of person re-seals wax that neatly. Directorate.`],
  c:[{t:'"Let\'s set a trap."',s:'Friendly',fx:()=>{tone('f');bond('kaida',1)},to:'sq_kaida_2b'},
   FL('kaida','"First: your brother is okay. Come here."','Hug her','sq_kaida_2b'),
   {t:'"Could it be Vale?"',s:'Serious',fx:()=>{tone('s');F.suspectVale=1;stat('ctrl',1)},to:'sq_kaida_2b'}]},
 sq_kaida_2b:{bg:'city',ch:'Side Story · Kaida',h:'The Post Tower',txt:()=>[
  ...(F.sqt==='l'?[`She freezes for a second when you hug her. Then she hugs you back so hard your ribs creak, and buries her face in your shoulder, and laughs and laughs.`,`@Kaida: Okay. Okay. Now let's go catch a spy.`]:[]),
  `You bait the trap with a fake letter "from Nico" full of made-up secrets and wait in the dark of the post tower.`,
  `At two in the morning a figure in a black coat climbs through the window, takes the letter, and cuts the seal with one neat flick of a knife.`,
  `@Vex Corven: Little spark! You're even more fun when you're angry.`,
  `Vex Corven. The Director's son. Of course.`],
  c:[{t:'Take him down',fight:'vex2',with:'kaida',to:'sq_kaida_2c'}]},
 sq_kaida_2c:{bg:'city',ch:'Side Story · Kaida',h:'Vex',txt:()=>[
  `Vex is flat on his back on the post tower floor, smoking, and still laughing.`,
  `@Vex Corven: My father sent me to watch you. For the record, I wasn't going to tell him anything. It's more fun when you win.`,
  `@Kaida: Why?`,
  `For a second, the smile slips.`,
  `@Vex Corven: Because I've seen Floor Forty too. Because I'm tired of being the Director's dog.`],
  c:[{t:'Turn him in to Seraphine',s:'By the book',fx:()=>{F.vexCaught=1;bond('seraphine',1)},to:'sq_kaida_2d'},
   {t:'Let him go. He owes you now.',s:'A risky ally',fx:()=>{F.vexAlly=1;bond('vex',2)},to:'sq_kaida_2d'},
   {t:'"Tell us what your father is planning."',s:'Make him talk',fx:()=>{F.vexIntel=1},to:'sq_kaida_2d'}]},
 sq_kaida_2d:{bg:'academy',ch:'Side Story · Kaida',h:'Vex',txt:()=>[
  F.vexIntel?`Vex sighs. "He'll come to the Rite with crates. Big ones, from Floor Forty. Don't ask me what's in them. Fine, I'll tell you: things that scratch." You write down every word.`:F.vexAlly?`Vex salutes you with two fingers. "I owe you one, little spark. I always pay my debts." Then he's out the window and gone.`:`Seraphine's guards march Vex away. He winks at Kaida over his shoulder the whole time.`,
  `Back on the dormitory roof, Kaida reads Nico's letter out loud to you, twice, doing voices for the rude fish.`],
  c:[{t:'Laugh at the fish voices',fx:()=>{bond('kaida',2);grant('x_badge');sqDone('kaida',2)},to:back}]},
 sq_kaida_3:{bg:'storm',ch:'Side Story · Kaida',h:'Rooftop Lightning',txt:()=>[
  `The night before the Rite, a storm rolls over the Lake of Seven. Everyone else is inside. Someone knocks on your window. From the outside. Upside down.`,
  `It's Kaida, soaking wet and grinning.`,
  `@Kaida: Come on. I want to show you something.`,
  `She takes you to the highest copper spire of Arcanum, lightning crawling through the clouds above you.`,
  `@Kaida: In Sparkhaven, when you ride the lightning, it hurts. Every time. Like being pulled apart. I've never let anyone come with me.`,
  `She holds out her hand. Sparks crawl over her fingers.`,
  `@Kaida: You'd have to trust me. Completely.`],
  c:[{...CF('kaida','Take her hand, and don\'t let go of it afterwards','Confess your feelings','sq_kaida_3b'),fx:()=>{tone('l');romance('kaida')}},
   {t:'Take her hand. "Partners."',s:'Ride the lightning as friends',fx:()=>{tone('f');bond('kaida',2)},to:'sq_kaida_3b'}]},
 sq_kaida_3b:{bg:'storm',ch:'Side Story · Kaida',h:'Rooftop Lightning',txt:()=>[
  `You become light.`,
  `For one impossible second you are everywhere at once: the spires, the clouds, the frozen lake far below, and Kaida right beside you, laughing, made of storm.`,
  `You land on the observatory roof in a shower of sparks. Your hair is standing straight up.`,
  `@Kaida: You didn't let go. Everyone lets go.`,
  ...T({l:[`She looks down. Your hand is still in hers.`,`@Kaida: You're still holding on.`,`@You: You noticed.`,`@Kaida: I'm a thief. I notice everything.`,`Her voice drops.`,`@Kaida: I steal things because nobody ever gave me anything I could keep. So I'm not stealing this. I'm asking. Can I keep you?`,`You answer by kissing her. Above you, the storm finally breaks, and neither of you notices the rain.`],
   f:[`@Kaida: Partners, then. You and me. Anyone comes for you, they deal with me first.`,`She bumps her fist against yours, and a small spark jumps between your knuckles.`]})],
  c:[{t:()=>F.sqt==='l'?'"Keep me."':'"Partners."',fx:()=>{title(F.sqt==='l'?'Stormbound':'Kaida\'s Partner');sqDone('kaida',3)},to:back}]},

 /* ---------- REN (when you are not Ren) ---------- */
 sq_ren_1:{bg:'frozen',ch:()=>`Side Story · ${R()}`,h:'Floating Lessons',txt:()=>[
  `Dawn. Mist on the Lake of Seven. Out on the frozen shore, ${R()} is alone, one hand held out over the water. A dozen stones float in front of him, turning slowly.`,
  `Then all of them drop at once.`,
  `@${R()}: Sorry. Did I wake you? I practice out here because if I lose control, there's nothing to break except water.`,
  `@${R()}: Since the night on the road, the husk, something's different. When I use my power, I hear a voice. Very quiet. Very kind. It tells me I'm doing well.`,
  `@${R()}: That's worse than if it were angry, isn't it?`],
  c:[{t:'"Practice with me. Two of us, half the danger."',s:'Friendly',fx:()=>{tone('f');bond('ren',2);stat('ctrl',1)},to:'sq_ren_1b'},
   FL('ren','"Show me what it feels like to float."',null,'sq_ren_1b'),
   {t:'"Tell me about your family."',s:'Serious',fx:()=>{tone('s');bond('ren',1);F.renMother=1},to:'sq_ren_1b'}]},
 sq_ren_1b:{bg:'frozen',ch:()=>`Side Story · ${R()}`,h:'Floating Lessons',txt:()=>T({
  f:[`You stand back to back on the ice while he lifts stones and you knock them out of the air with your own power. Half of them land in the lake. One lands on his foot.`,`@${R()}: Ow. Okay. That one was me.`,`By the time the sun is up, he's holding thirty stones steady, and he's laughing. The voice, he says, has gone quiet.`,`@${R()}: Maybe it doesn't like company.`],
  l:[`He hesitates. Then he holds out his hand, and when you take it, the ground simply lets go of you.`,`You rise together, slowly. Ten feet. Twenty. Until the mist is below you and the whole academy is gold in the sunrise.`,`@${R()}: I've never done this with anyone. I always thought I'd drop them.`,`@You: You won't.`,`@${R()}: How do you know?`,`@You: Because you're holding on like it matters.`,`He looks at you then, really looks, and for a moment his eyes are not black at all. You drift there, weightless, until the first bell rings.`],
  s:[`He touches the pendant at his throat: black stone, seven rings.`,`@${R()}: My sister, Mira. She wants a dragon. My father, who doesn't talk much. And my mother, who went north when I was little and never came back.`,`@${R()}: She left me this. My father says the Crystal went dark for her too, once. I think she had gravity. I think she went looking for Gravemont.`,`@${R()}: I think she's still there.`]}),
  c:[{t:'Walk back together for breakfast',fx:()=>{sqDone('ren',1)},to:back}]},
 sq_ren_2:{bg:'vault',ch:()=>`Side Story · ${R()}`,h:'The Gravemont Echo',txt:()=>[
  `${R()} catches you in the corridor, out of breath.`,
  `@${R()}: Maren found a list. Everyone who traveled north to the ruins of Gravemont in the last twenty years. Most of them never came back.`,
  `@${R()}: One of the names is "Elsa of Emberfall." That's my mother.`,
  `@${R()}: There's a sealed reading room in the lowest level of the archive with the Gravemont crest on the door. Maren says only gravity can open it. Will you come with me?`],
  c:[{t:'"Lead the way."',s:'Friendly',fx:()=>{tone('f');bond('ren',1)},to:'sq_ren_2b'},
   FL('ren','"I\'d go a lot further north than the basement for you."',null,'sq_ren_2b'),
   {t:'"Are you sure you want to know what\'s in there?"',s:'Careful',fx:()=>{tone('s');stat('spi',1)},to:'sq_ren_2b'}]},
 sq_ren_2b:{bg:'hollow',ch:()=>`Side Story · ${R()}`,h:'The Sealed Room',txt:()=>[
  `${R()} puts his palm on the crest. The door sighs open. Inside, the air is thick and heavy, and the dust doesn't fall. It hangs.`,
  `In the center of the room, a shape of grey light rises from the floor: a Gravemont mage, three hundred years dead, remembered by the stones themselves.`,
  `Its face turns toward ${R()}. It does not look friendly.`],
  c:[{t:()=>`Fight beside ${R()}`,fight:'echo',with:'ren',to:'sq_ren_2c'}]},
 sq_ren_2c:{bg:'vault',ch:()=>`Side Story · ${R()}`,h:'What the Echo Said',txt:()=>[
  `As the echo fades, it whispers, in a voice like stones grinding.`,
  `@Echo: Elsa… went to the Keystone… she holds the door… she waits… for her son…`,
  `Then it's gone. ${R()} is shaking. You realize he's been holding his breath since the door opened.`,
  `@${R()}: She's alive. She's alive and she's holding something closed. Alone. For years.`],
  c:[{t:()=>(st.flirt.ren?'♥ ':'')+'Hold him until the shaking stops',fx:()=>{bond('ren',2);if(st.flirt.ren)flirt('ren')},to:'sq_ren_2d'},
   {t:'"Then we go north. Together. When this is over."',s:'A promise',fx:()=>{bond('ren',2);F.renVow=1},to:'sq_ren_2d'},
   {t:'"Breathe. You\'re turning blue. Very dramatic."',s:'Break the tension',fx:()=>{bond('ren',1);stat('spi',1)},to:'sq_ren_2d'}]},
 sq_ren_2d:{bg:'vault',ch:()=>`Side Story · ${R()}`,h:'What the Echo Said',txt:()=>[
  `When you leave the archive, he presses something into your hand: one of his floating stones, small and smooth. It hovers a quarter-inch above your palm.`,
  `@${R()}: It'll keep floating as long as I'm alive. So you'll always know.`],
  c:[{t:'Keep the stone close',fx:()=>{F.renStone=1;grant('x_renstone');sqDone('ren',2)},to:back}]},
 sq_ren_3:{bg:'academy',ch:()=>`Side Story · ${R()}`,h:'What Matters',txt:()=>[
  `The night before the Rite. ${R()} is sitting on the bell tower, turning his pendant over and over in his fingers.`,
  `@${R()}: If the Hollow King is waiting for me… if part of him is already in me… what if tomorrow I become him?`,
  `@${R()}: Maren told me gravity is deciding what matters. I've spent months trying to decide what matters to me.`,
  `He looks at you.`,
  `@${R()}: I think I figured it out. I just don't know if I'm allowed to say it.`],
  c:[CF('ren','"Say it. Please."',null,'sq_ren_3r'),
   {t:'"You\'re not him. You\'ve got us. You\'ve got me."',s:'As his best friend',fx:()=>{tone('f');bond('ren',2)},to:'sq_ren_3f'},
   {t:'"If you ever start to become him, I\'ll stop you. That\'s a promise."',s:'A hard promise',fx:()=>{tone('s');F.renPromise=1;bond('ren',2)},to:'sq_ren_3f'}]},
 sq_ren_3r:{bg:'academy',ch:()=>`Side Story · ${R()}`,h:'Gravity',txt:()=>[
  `@${R()}: You. It's you. I decided weeks ago. I just didn't know how to say it without everything floating away.`,
  `And everything does. The bell rope. The snow on the roof. The two of you, rising a few inches off the tower, weightless and ridiculous.`,
  `He kisses you in midair, very carefully, like you might break. You don't.`,
  `@${R()}: Okay. Okay. I can face anything tomorrow now.`],
  c:[{t:'"Then let\'s face it together."',fx:()=>{title('Gravity\'s Choice');sqDone('ren',3)},to:back}]},
 sq_ren_3f:{bg:'academy',ch:()=>`Side Story · ${R()}`,h:'Brothers in Weight',txt:()=>[
  `${R()} breathes out, long and slow, and some of the weight goes out of his shoulders.`,
  F.renPromise?`@${R()}: Good. I needed someone to say that. Promise me you'll actually do it.`:`@${R()}: Yeah. I've got you. That's what matters.`,
  `He lifts the snow off the roof and lets it hang around you both like stars, just for a moment.`],
  c:[{t:'"Promise."',fx:()=>{stat('ctrl',1);title('Anchor of the Gravity-Born');sqDone('ren',3)},to:back}]},

 /* ---------- KAEL ---------- */
 sq_kael_1:{bg:'arenaN',ch:'Side Story · Kael',h:'Ashes in the Arena',txt:()=>[
  `Midnight. A red glow from the training arena. Kael Ashford is alone, burning practice dummies to ash one after another, his shirt soaked with sweat.`,
  `He sees you. ${F.kaelHate?'For a second you think he\'ll throw a fireball at you.':''} For once, he doesn't smirk.`,
  `@Kael: Come to laugh?`,
  `@Kael: My father sent a letter today. Three lines. "Win the Tournament. Do not embarrass House Ashford. Your brother would have won already."`,
  `@Kael: My brother died at nineteen, on a dragon, in a border war nobody remembers. I turned nineteen last month. Funny, right?`],
  c:[{t:'"Spar with me. You need someone who hits back."',s:'Rivalry',fx:()=>{tone('f');bond('kael',2);stat('str',1)},to:'sq_kael_1b'},
   FL('kael','"You fight like someone trying to be seen. I see you."',null,'sq_kael_1b'),
   {t:'"Your father is wrong about you."',s:'Serious',fx:()=>{tone('s');bond('kael',2)},to:'sq_kael_1b'}]},
 sq_kael_1b:{bg:'arenaN',ch:'Side Story · Kael',h:'Ashes in the Arena',txt:()=>T({
  f:[`You fight until the sand is black with ash and neither of you can lift an arm. It's a draw. Kael lies on his back and laughs at the stars.`,`@Kael: You're the first person here who didn't let me win because of my name.`,`@You: You're the first person here who didn't hold back because of mine.`,`@Kael: …Tomorrow. Same time. Don't be late, ${st.char==='ren'?'farm boy':'commoner'}.`],
  l:[`The flames around his hands go out. All at once.`,`@Kael: Nobody talks to me like that.`,`@You: Maybe somebody should.`,`He stares at you. Then he sits down on the edge of the arena wall, very suddenly, like his legs gave out.`,`@Kael: I've spent my whole life on fire so people would look at me. And the one person who sees me is the one I've been trying to burn.`,`He laughs, shaky.`,`@Kael: Sit down before I say something even stupider.`],
  s:[`@Kael: You don't know my father.`,`@You: I know his son. That's enough.`,`Kael looks away. The fire around his fists flickers, then dims to embers.`,`@Kael: Nobody's ever said that to me. Not even my mother.`,`He doesn't say thank you. But the next morning, when Pyrrhos students mock your table at breakfast, he tells them to shut up.`]}),
  c:[{t:'Leave him to the stars',fx:()=>{F.kaelFriend=1;sqDone('kael',1)},to:back}]},
 sq_kael_2:{bg:'hall',ch:'Side Story · Kael',h:'Ember',txt:()=>[
  `Kael grabs your sleeve in the corridor and pulls you into the old stables behind the arena. Nobody has kept animals here in decades.`,
  `In the last stall, wrapped in every blanket Kael owns, is a baby dragon the size of a dog. Its scales are dull grey instead of red. It's shivering.`,
  `@Kael: My father's birthday gift. A runt from his breeding pens. He sent it so I'd remember I'm the runt too.`,
  `@Kael: Dragons need volcanic heat. It's dying of cold, and I can't make my fire hot enough. The only fire-moss in Arcanum grows in the frozen greenhouse. Something lives in there now.`],
  c:[{t:'"Then we go get the moss."',s:'Friendly',fx:()=>{tone('f');bond('kael',1)},to:'sq_kael_2b'},
   FL('kael','"You hid a baby dragon in a stable. You\'re a lot softer than you pretend."',null,'sq_kael_2b'),
   {t:'"Why didn\'t you ask anyone for help?"',s:'Serious',fx:()=>{tone('s');bond('kael',1)},to:'sq_kael_2b'}]},
 sq_kael_2b:{bg:'sylvaris',ch:'Side Story · Kael',h:'The Frozen Greenhouse',txt:()=>[
  ...(F.sqt==='s'?[`@Kael: Because Ashfords don't ask. They take. And I didn't want to take anything for her. I wanted to deserve it.`]:F.sqt==='l'?[`Kael turns red. @Kael: Say that again and I'll set your hair on fire. …Come on.`]:[`@Kael: Good. I wasn't going to ask twice.`]),
  `The greenhouse is a glass dome full of frozen jungle. Ice hangs from every leaf. In the middle, the fire-moss glows orange.`,
  `Guarding it is a frost wisp: a floating ball of cold light that freezes the air around it solid.`],
  c:[{t:'Fight beside Kael',fight:'wisp',with:'kael',to:'sq_kael_2c'}]},
 sq_kael_2c:{bg:'hall',ch:'Side Story · Kael',h:'Ember',txt:()=>[
  `You pack the fire-moss around the little dragon, and Kael breathes his fire over it, gently, for an hour, until the stall is hot as an oven.`,
  `At dawn the dragon sneezes. A tiny puff of flame. Its scales have turned from grey to deep, glowing red.`,
  `@Kael: Ha! Look at her! Look at her!`,
  `He's grinning like a child. Then he catches you looking and tries to frown, and fails.`,
  `@Kael: Her name's Ember. And she likes you. Traitor.`],
  c:[{t:'Scratch Ember under the chin',fx:()=>{F.ember=1;bond('kael',2);sysMsg('Ember the dragon will join your battles in the finale');grant('x_scale');sqDone('kael',2)},to:back}]},
 sq_kael_3:{bg:'arenaN',ch:'Side Story · Kael',h:'Not My Father\'s Son',txt:()=>[
  `The night before the Rite. Kael is waiting for you in the empty arena, where you fought in the Tournament. ${F.ember?'Ember is curled around his feet, already the size of a pony.':''}`,
  `@Kael: My father arrives tomorrow with the Pyrrhos delegation. He wants me beside him in the Circle of Seals. Smiling. Obedient. An Ashford.`,
  `@Kael: I'm not going to stand beside him. I'm going to stand beside you.`,
  `He scuffs the sand with his boot.`,
  `@Kael: I spent our whole first year trying to beat you. Turns out I was just trying to get you to look at me. Pathetic, isn't it?`],
  c:[CF('kael','"For the record, I was always looking."',null,'sq_kael_3r'),
   {t:'"Then stand beside me. As my sworn ally."',s:'Rivals to brothers-in-arms',fx:()=>{tone('f');bond('kael',2)},to:'sq_kael_3f'},
   {t:'"It\'s not pathetic. It\'s the bravest thing you\'ve said all year."',s:'Encourage him',fx:()=>{tone('f');bond('kael',2);stat('spi',1)},to:'sq_kael_3f'}]},
 sq_kael_3r:{bg:'arenaN',ch:'Side Story · Kael',h:'Fire',txt:()=>[
  `Kael stares at you. Then he laughs, loud and startled, and the torches all around the arena flare up at once.`,
  `@Kael: You're impossible. You know that? Completely impossible.`,
  `He crosses the sand in three steps and kisses you like he's been planning it for months and still somehow didn't plan it at all.`,
  `@Kael: Tomorrow I'm telling my father to go to the Abyss. And then I'm going to fight beside you until the sky falls.`],
  c:[{t:'"I\'ll hold you to that."',fx:()=>{F.kaelFriend=1;title('Ember-Hearted');grant('w_ember');sqDone('kael',3)},to:back}]},
 sq_kael_3f:{bg:'arenaN',ch:'Side Story · Kael',h:'Sworn',txt:()=>[
  `Kael draws a line in the sand with his boot, then cuts his palm with a flame and holds out his hand. The old Pyrrhos oath.`,
  `@Kael: Fire-sworn. Where you fight, I fight. Where you fall, I carry you.`,
  `You take his hand. The flame passes between you, warm, not burning.`],
  c:[{t:'"Fire-sworn."',fx:()=>{F.kaelFriend=1;stat('str',1);title('Fire-Sworn');grant('x_firering');grant('w_ember');sqDone('kael',3)},to:back}]}
});
