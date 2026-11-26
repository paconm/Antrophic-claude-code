# Prompts voor Claude Code

Open deze map in Claude Code en plak een prompt. Begin met de startprompt.

## Startprompt

```text
Lees CLAUDE.md, ROADMAP.md, docs/LORE.md en docs/APP-MAKEN.md volledig.
Draai daarna `npm run dev` en controleer in de browser dat beide games starten zonder fouten.

Voer dan Fase 0 en Fase 1 uit ROADMAP.md uit:
- zet Vite, TypeScript en three.js op in games/world,
- zet de speler, camera, gevechten, Husks, orbs en de Transcendence-scène over uit games/awakening,
- vervang de personages door gerigde glTF-modellen met echte animaties en bouw Arcanum opnieuw met PBR-materialen, een HDRI-lucht, echt gebladerte en water met reflecties,
- gebruik alleen assets met een licentie voor commercieel gebruik en noteer ze in ASSETS.md.

Werk in kleine commits. Test elke stap in de browser op 390 px breed en op desktop.
Stop na Fase 1 met een korte samenvatting, schermafbeeldingen en de keuzes die ik moet maken.
```

## Open wereld

```text
Voer Fase 2 uit ROADMAP.md uit: een continent van minstens 8 bij 8 km dat in stukken wordt ingeladen,
met Gravemont en de grens van Pyrrhos rond Emberfall, een wereldkaart, minimap, snel reizen, dag en nacht en weer.
Houd 60 fps op een gemiddelde telefoon in de stand Balanced. Laat me daarna de kaart zien en vraag welke regio's ik als volgende wil.
```

## Verhaal, bonds en uitrusting

```text
Voer Fase 3 uit ROADMAP.md uit. Zet de scènes uit games/story/src/story_*.js om naar JSON en bouw daar een quest- en dialoogsysteem op.
Voeg bonds, romance, de locker, uitrusting, de 35 orbs en de Tree of Life toe. Volg de verhaalregels in CLAUDE.md.
```

## Naar GitHub

```text
Maak van deze map een private GitHub-repository met `gh repo create`, push alles naar main
en controleer dat de workflow in .github/workflows/pages.yml de game op GitHub Pages zet. Geef me de link.
```

## Installeerbaar maken zonder store

```text
Maak van de game een PWA: voeg een webmanifest, iconen en een service worker toe zodat de game
op Android en iPhone op het beginscherm kan worden gezet en offline start. Test het en leg me uit hoe spelers hem installeren.
```

## Android-app

```text
Voeg Capacitor toe en maak een Android-project. Bouw een debug-APK, daarna een ondertekende AAB voor Google Play.
Voeg een GitHub Actions-workflow toe die bij elke push een APK als download klaarzet.
Schrijf de stappen die ik zelf in Google Play Console moet doen in docs/APP-MAKEN.md.
```

## iPhone-app

```text
Voeg het iOS-platform van Capacitor toe. Zet 120 Hz aan met CADisableMinimumFrameDurationOnPhone.
Leg uit wat ik op een Mac met Xcode moet doen, of zet een build op via een macOS-runner, tot en met TestFlight.
```

## Verdienen

```text
Voeg in-app-aankopen toe (Crowns-pakketten en Remove Ads voor EUR 2,99) en beloonde advertenties,
met een testmodus. Gebruik de product-ID's uit docs/APP-MAKEN.md. Voeg een privacybeleid toe.
```
