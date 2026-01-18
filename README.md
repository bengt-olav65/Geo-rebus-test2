# Rebus — publikasjon

Denne PR legger til en enkel statisk side som bruker `images/rebus2.jpg` som bakgrunn for spørsmål 2.

For lokalt test:

- Start en enkel HTTP-server i repo-roten, f.eks. med Python:
  `python -m http.server 8080`
- Åpne `http://localhost:8080/`

For bildeoptimalisering (valgfritt):

- Kjør `npm install` lokalt
- Kjør `npm run optimize-images` for å generere WebP og resized varianter (skript bruker `sharp`)

Deploy:
- GitHub Actions i denne PR vil publisere repo-roten til GitHub Pages ved merge (gh-pages branch).

Tilgjengelighet:
- Bakgrunnsbildet er forklart i `aria-label` og vi inkluderer et skjult `<img>` med `alt` for skjermlesere.
