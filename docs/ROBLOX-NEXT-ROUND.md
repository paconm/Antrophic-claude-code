# Roblox version: next round of work (saved brief, not started)

Saved on 2026-11-27 at the owner's request. Nothing in this brief has been built or planned yet.
The text below is the owner's brief, unchanged.

---

This is the next round of work on The Seven Crowns (Roblox version). Read the
existing code for characters, shop, boxes, quests, HUD and maps first, then
show me a short plan before you build. Keep saved progress and existing game
passes working.

1. WEAPONS AND ATTACKS
For every playable character, build a Roblox-ready weapon with VFX and four
attack animations: one basic slash, two advanced attacks and one ultimate.
- Heavy, flashy, vibrant effects, with the ultimate clearly the biggest.
- Player animations are fluid, agile and fast, with lightning-like movement
  trails in the same colour as the weapon.
- Each weapon has an idle animation on the blade that players have not seen
  before (energy spiralling, orbiting rings, pulsing runes).
- All VFX settings must be valid Roblox properties, so everything works in
  Studio exactly as built, with no manual fixing.
- Aim far above the current quality. If it looks ordinary, redo it.

2. POWER CUTSCENES AND SPECIAL MOVES
- The short cutscenes on normal powers need to look much better: a proper
  camera angle, glow, particles and a clean ending.
- Every special move gets a 3 to 5 second cutscene before it fires: the
  camera moves in on the character, they charge or prepare the move, energy
  gathers in their element colour, the ground and air react, then a flash
  and the move is released.
- Enemies are paused or the player is protected during the cutscene, and in
  multiplayer only the player using the move sees the full camera cut.

3. REWARDS AND COSMETICS IMAGES
- Every reward and cosmetic must have its own real image. No empty slots,
  placeholder squares, emoji or text-only items.
- The images must look professionally made, not AI-generated. Where an item
  has a 3D model, render its icon from the real model in a ViewportFrame
  with good lighting, a consistent angle and a rarity-coloured background.
- All icons share the same size, framing and style.
- Give me a list of every item that still lacks a proper image.

4. BOXES
- Boxes must be real 3D box objects with their own design per box type, not
  a button that instantly gives an item.
- Opening sequence: the box appears on screen, the player taps to open, it
  shakes and builds up with light leaking through the seams, the lid bursts
  open, and it explodes in light in the colour of the item's rarity. The
  item then rises out of the box with its name and rarity shown.
- Rarity colours: Common grey, Uncommon green, Rare blue, Epic purple,
  Legendary gold, Mythic red. Higher rarities get a longer build-up, a
  bigger explosion and stronger camera shake.
- The colour is hidden until the explosion, so the reveal stays exciting.
- Add a skip option and an "open several" option.
- Show the drop chances for each box, and use PolicyService to disable paid
  random boxes for players in countries where they are restricted.

5. CHARACTER UNLOCKING
- At the start only Ten is playable. Every character after Ten is locked.
- Each other character first appears in the story as a side character that
  the player meets through quests and dialogue.
- Each has their own chain of side quests. After a set number of them, the
  character offers the player the option to unlock them, in a dialogue.
- Difficulty: a real challenge that takes effort, but not frustrating. The
  target audience is children, so use clear goals, quest markers, short
  steps and no long grinding. Show progress like "3 of 5 quests completed".
- Alternatively, characters can be bought with Robux: Shadow for the Robux
  equivalent of EUR 4.99 and every other character for the equivalent of
  EUR 2.99. [FILL IN THE ROBUX AMOUNTS]
- Locked characters are visible in the character menu as silhouettes with
  two clear options: "Unlock through story" and the Robux price.
- Players who already own characters keep them.

6. HUD AND UI LABELS
Put a small text label under or beside every HUD and UI element (buttons,
icons, bars, menus) that says what it is or does, so a child understands it
immediately. Keep the labels small, readable on phones, and in the same
style as the rest of the UI.

7. MAP VARIETY
Add much more variation to the terrain in every chapter map: rocks and
boulders, cliffs, mountains, hills and valleys, rivers, lakes and
waterfalls, plus different ground materials and vegetation per area. Give
each map recognisable landmarks, keep paths and quest locations easy to
reach, and keep performance good on phones.

8. HOW TO WORK
- Build in this order and show me screenshots or a clip after each part:
  box opening, character unlocking, HUD labels, special move cutscenes,
  weapons, item images, maps.
- Test each part in play mode on phone and PC sizes.
- If you need models, textures, images or sounds you cannot make or find,
  stop and list them so I can supply them.
- At the end, give me a list of what changed and what is still open.
