# Van deze map naar een downloadbare app

## 1. Spelen via Claude Code
1. Installeer [Node.js](https://nodejs.org) en open deze map in Claude Code.
2. Vraag: "Draai npm run dev en open de game". De game staat dan op `http://localhost:5173`.

## 2. Naar GitHub, met een speelbare link
1. Maak een gratis account op github.com en installeer de GitHub CLI (`gh`).
2. In Claude Code: plak de prompt "Naar GitHub" uit `PROMPTS.md`, of doe het zelf:
   ```bash
   git init && git add -A && git commit -m "The Seven Crowns"
   gh repo create seven-crowns --private --source=. --push
   ```
3. Op GitHub: Settings > Pages > Source: "GitHub Actions". Vanaf dan zet elke push de nieuwste versie online.
   GitHub Pages bij een private repository vraagt een betaald GitHub-abonnement. Met een openbare repository is het gratis.

## 3. Snelste route: installeren zonder store (PWA)
Plak de prompt "Installeerbaar maken zonder store". Daarna kunnen spelers de link openen en kiezen:
- Android (Chrome): menu > App installeren.
- iPhone (Safari): Deel > Zet op beginscherm.

Dit is gratis en heeft geen keuring, maar je staat niet in de stores en in-app-aankopen van Apple of Google werken er niet.

## 4. Android-app in Google Play
1. Maak een Google Play Console-account: eenmalig 25 dollar. Google controleert je identiteit en vraagt je een Android-toestel te verifiëren.
2. Plak de prompt "Android-app". Claude Code voert dit uit:
   ```bash
   npm i @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "The Seven Crowns" com.jouwnaam.sevencrowns --web-dir dist
   npm run build && npx cap add android && npx cap sync
   npx cap open android
   ```
3. In Android Studio: Build > Generate Signed App Bundle. Bewaar het sleutelbestand en het wachtwoord goed: zonder kun je geen updates uitbrengen.
4. In Play Console: app aanmaken, AAB uploaden, winkelpagina, privacybeleid en leeftijdsclassificatie invullen.
5. Nieuwe persoonlijke accounts moeten eerst een gesloten test doen met minstens 12 testers die 14 dagen achter elkaar meedoen. Pas daarna kun je productie aanvragen. Je volgers kunnen die testers zijn.

## 5. iPhone-app in de App Store
1. Word lid van het Apple Developer Program: 99 dollar per jaar.
2. Je hebt een Mac met Xcode nodig, of een Mac in de cloud (bijvoorbeeld een macOS-runner van GitHub Actions of Codemagic).
3. Plak de prompt "iPhone-app". Op de Mac:
   ```bash
   npm i @capacitor/ios && npx cap add ios && npx cap sync && npx cap open ios
   ```
4. In Xcode: kies je team, zet een uniek Bundle ID, Product > Archive > Distribute App.
5. In App Store Connect: app aanmaken, build kiezen, schermafbeeldingen, privacygegevens, daarna testen via TestFlight en insturen voor review.

## 6. 4K en 120 Hz, eerlijk
- De game heeft drie standen: Performance (tot 120 fps), Balanced en Cinematic 4K (tot 3840 pixels breed).
- Android en desktop halen 120 fps als het scherm en de chip dat aankunnen.
- Safari en webviews op iPhone tekenen maximaal 60 keer per seconde. Voor 120 Hz op iPhone is een native build nodig met `CADisableMinimumFrameDurationOnPhone` in Info.plist.
- 4K en 120 fps tegelijk is op telefoons niet haalbaar. Op een sterke pc wel.

## 7. Geld verdienen
Product-ID's die de game al gebruikt in testmodus: `crowns_100`, `crowns_550`, `crowns_1200`, `crowns_2600`, `noads` (EUR 2,99) en `starter`.
Maak dezelfde ID's aan in App Store Connect en Play Console en plak de prompt "Verdienen".
Advertenties lopen via Google AdMob (plugin `@capacitor-community/admob`).

## 8. Uitbetaling naar jouw rekening
- Apple: App Store Connect > Business. Accepteer de Paid Apps Agreement en vul belasting- en bankgegevens in. Je kiest zelf de bankrekening. Apple betaalt binnen ongeveer 45 dagen na het einde van de fiscale maand, zodra je boven de minimumdrempel zit. Meld je aan voor het Small Business Program: dan is de commissie 15% in plaats van 30% tot 1 miljoen dollar opbrengst per jaar.
- Google Play: Play Console > Betalingsprofiel. Voeg je bankrekening toe en bevestig hem met de testbetaling.
- AdMob: betalingsgegevens invullen en identiteit en adres laten verifiëren. Uitbetaling per SEPA zodra je saldo de drempel van 70 euro haalt.
- Houd alle inkomsten bij. Wie structureel verdient, moet dat in Nederland opgeven en vaak een onderneming inschrijven bij de KvK. Dit is geen belastingadvies: vraag het na bij de Belastingdienst of een boekhouder.

## Bronnen
- Google Play, testvereisten voor nieuwe accounts: https://support.google.com/googleplay/android-developer/answer/14151465
- Google Play, aan de slag met Play Console: https://support.google.com/googleplay/android-developer/answer/6112435
- Apple, betalingen ontvangen: https://developer.apple.com/help/app-store-connect/getting-paid/overview-of-receiving-payments
- AdMob, betalingen: https://support.google.com/admob/answer/2772208
- Apple Developer Forums, 120 Hz in webviews: https://developer.apple.com/forums/thread/773222
