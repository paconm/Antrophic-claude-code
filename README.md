# The Seven Crowns

Een fantasy-RPG in twee delen:

- **Awakening** (`games/awakening`): een speelbaar 3D-hoofdstuk op het zwevende eiland Arcanum. Zes helden, vijf orbs, een zonsverduistering, Husks, een eindbaas en Transcendence.
- **The Gathering** (`games/story`): de verhaal-RPG met zes speelbare personages, locker, 35 orbs, bonds, romance en de gouden Tree of Life.

Alles is eigen code zonder externe pakketten. Je hebt alleen [Node.js 18 of nieuwer](https://nodejs.org) nodig.

## Spelen

```bash
npm run dev
```

Open daarna `http://localhost:5173`. Je kiest daar een van de twee games.

## Verder bouwen met Claude Code

1. Open deze map in Claude Code.
2. Plak de startprompt uit [`PROMPTS.md`](PROMPTS.md).
3. Claude Code leest [`CLAUDE.md`](CLAUDE.md) en [`ROADMAP.md`](ROADMAP.md) en bouwt fase voor fase een grotere, realistischere open wereld.

## Naar GitHub en naar een downloadbare app

Zie [`docs/APP-MAKEN.md`](docs/APP-MAKEN.md). Kort:

1. `gh repo create seven-crowns --private --source=. --push`
2. Zet op GitHub onder Settings > Pages de bron op "GitHub Actions". Elke push bouwt de game en zet hem online.
3. Laat Claude Code de Capacitor-wrapper maken voor Android en iPhone (prompt staat klaar in `PROMPTS.md`).

## Mappen

| Map | Inhoud |
| --- | --- |
| `games/awakening/src` | 3D-engine en gameplay (WebGL2), in volgorde a tot en met i |
| `games/story/src` | Verhaal-RPG: data, verhaallijnen, gevechten, interface |
| `shared/gear.js` | Uiterlijk van helden, items en de 35 orbs, gedeeld door beide games |
| `tools` | `build.mjs` bundelt naar `dist/`, `serve.mjs` is een kleine webserver |
| `docs` | Wereld en verhaal (`LORE.md`), app en stores (`APP-MAKEN.md`) |
