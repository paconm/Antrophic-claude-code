# Roadmap

Each phase ends with a playable build, a passing smoke test and a short written summary.

## Phase 0: make the repo solid
- Run `npm run dev` and confirm both games start.
- Add a Playwright smoke test that loads both builds, starts a hero and fails on any console error.
- Add `ASSETS.md`, a licence note and a `CHANGELOG.md`.
- Confirm the GitHub Pages workflow deploys.

## Phase 1: new engine, same chapter, far more realistic
- Scaffold Vite, TypeScript and three.js in `games/world`.
- Port the player controller, camera, combat, Husks, orbs and the Transcendence sequence from `games/awakening`.
- Replace procedural characters with rigged glTF characters and real animations (idle, walk, run, jump, attack, cast, hit, death).
- Rebuild Arcanum with PBR materials, an HDRI sky, real foliage and water with reflections.
- Acceptance: start to Transcendence plays without errors at 60 fps on a mid-range phone.

## Phase 2: the open world
- Continent terrain of at least 8 by 8 km, streamed in chunks with LOD.
- First regions: Gravemont and the Pyrrhos border around Emberfall.
- World map, minimap, fast travel, day and night, weather.
- Mounts or gliding for travel.

## Phase 3: story, bonds and gear
- Quest and dialogue system driven by JSON converted from `games/story`.
- Bonds, romance, locker, gear, the 35 orbs and the Tree of Life skill tree in 3D.
- Narrator voice and subtitles.

## Phase 4: seven nations and ascension
- Pyrrhos, Thalassa, Kharak, Sylvaris, Voltara, Lumeria and Gravemont, each with a city, a dungeon and a boss.
- Ascension: heroes become gods of their element. Void and Divine open as endgame elements.

## Phase 5: online
- Accounts, cloud saves and 1 to 4 player co-op with a real backend.

## Phase 6: release
- Capacitor builds for Android and iPhone, Tauri for desktop.
- In-app purchases (Crowns, Remove Ads at EUR 2.99), rewarded ads, privacy policy, age rating.
- Closed testing, store listings, launch.
