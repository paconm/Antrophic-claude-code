# The Seven Crowns: project brief for Claude Code

## What this is
A fantasy RPG owned by a solo creator with a large TikTok audience. Two playable builds exist:

- `games/awakening`: a 3D vertical slice in plain JavaScript and WebGL2 (no libraries). Custom renderer with HDR, bloom, god rays, shadow maps, depth-based ambient occlusion, instanced grass and leaf cards, cloth cloaks, and characters sculpted from signed-distance fields, meshed with surface nets and skinned to a 17-bone skeleton.
- `games/story`: a text-and-battle RPG (Volume I) with six playable characters, bonds, romance, a skill tree, a locker and 35 legendary orbs.

`shared/gear.js` holds hero looks, items and orbs for both.

## The goal you are working toward
Turn the 3D slice into a much more realistic, much larger open-world game that:

1. runs with `npm run dev` and can be played in the browser straight from this repo,
2. deploys to GitHub Pages on every push (workflow already present),
3. ships as a downloadable app for Android and iPhone through Capacitor, and later desktop through Tauri.

Follow `ROADMAP.md` phase by phase. Do not skip acceptance checks.

## Commands
- `npm run dev`: build both games into `dist/` and serve at http://localhost:5173
- `npm run build`: build only
- There are no tests yet. Phase 0 adds a Playwright smoke test.

## Code map of `games/awakening/src`
| File | Role |
| --- | --- |
| `a_math.js` | vectors, mat4, noise, WebGL helpers, instanced mesh format (10 floats per vertex, 24 per instance) |
| `b_mesh.js` | lathe, sphere, rock and terrain generators, island height field, cached height grid |
| `c_shaders.js` | all GLSL: sky, lighting, uber material shader (material ids 0 to 15), grass, leaves, water, sprites, beams, post chain |
| `d_world.js` | world population: plaza, towers, pier, ruins, trees, grass, colliders, orb sites |
| `e_render.js` | quality presets, environment palette (dusk, eclipse, dawn), render passes, post-processing |
| `f_body.js` | SDF character sculpting, surface nets, skin weights, per-race body parameters, clothing kits |
| `f_chars.js` | hero stats, skeleton posing, cloth cloak simulation, weapons |
| `g_game.js` | player controller, combat, skills, Husk AI, orb pickup and Transcendence sequences |
| `h_ui.js` | per-frame drawing of effects, audio, narrator voice, subtitles, multiplayer presence, input |
| `i_main.js` | title screen, cinematic, menus, HUD, main loop |

The code is dense on purpose (it had to fit one HTML file). When you migrate it, split it into readable TypeScript modules.

## Target architecture for the open-world version
- Vite, TypeScript, three.js (WebGPU renderer with WebGL2 fallback), Rapier physics.
- Real assets: glTF characters with skeletal animation, PBR materials, HDRI skies. Keep the procedural SDF characters only as a fallback.
- Post-processing: GTAO, bloom, TAA or SMAA, depth of field for cinematics, colour grading.
- World streaming in chunks with LOD and impostors. One continent, Aethra, with seven nations and Arcanum floating above the Lake of Seven in the centre.
- Data-driven quests and dialogue. Convert the scene graph in `games/story/src/story_*.js` to JSON and reuse it.
- Saves in IndexedDB. Online co-op comes later and needs a real backend (Colyseus or Supabase Realtime). The `room` code in `h_ui.js` only works inside Claude artifacts.
- Wrappers: Capacitor for iOS and Android, Tauri for desktop.

## Asset rules
- Use only assets whose licence allows commercial use inside a game, preferably CC0: Poly Haven, ambientCG, Quaternius, KayKit, Kenney.
- Record every asset in `ASSETS.md` with source URL and licence.
- Never use ripped or copyrighted characters, music, logos or brand names.

## Story and content rules
- Read `docs/LORE.md` before writing story content. Keep names, nations and elements consistent.
- Every playable and romanceable character is an adult. Mira (Ren's sister) and Nico (Kaida's brother) are children: no romance, no combat harm on screen.
- Romance stays non-sexual: flirting, a confession, at most a kiss.
- The long arc: heroes transcend, then ascend to become gods of their element. Void and Divine are sealed special elements for the endgame.

## Quality bar
- 60 fps on a mid-range phone in Balanced mode, 120 fps capable on desktop and in native wrappers.
- No console errors. Test on a 390 px wide viewport and on desktop.
- Keep the three graphics modes: Performance, Balanced, Cinematic 4K.
- Commit small, with clear messages. After each phase write a short summary and list open decisions for the owner.

## Honest limits to tell the owner about
- Photoreal characters need artist-made or scanned models. Budget time for asset work or buy a licensed pack.
- Safari and iOS web views cap rendering at 60 fps. 120 Hz on iPhone needs a native build.
- 4K at 120 fps is not realistic on phones. Offer the choice between quality and frame rate.
