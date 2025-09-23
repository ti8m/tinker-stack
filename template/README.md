# PLANNING STACK TEMPLATE Frontend Monorepo

Dieses Monorepo enthält alle Module und Apps für das PLANNING STACK TEMPLATE Frontend. Inklusive der
Testdaten und des Prototyps.

## Was ist enthalten?

Dieses Monorepo enthält die folgenden Pakete/Apps:

### Apps und Pakete

- `@repo/prototype`: ein Prototyp für die PLANNING STACK TEMPLATE Anwendung.
- `@repo/api`: ein Paket, das die Domain-Typen und -Enums bereitstellt.
- `@repo/docs`: Dokumentationen für die PLANNING STACK TEMPLATE Anwendung im Antora-Format.
- `@repo/mock-data`: ein Paket, das synthetische Daten für die Anwendungen bereitstellt.
- `@repo/mock-api`: ein Paket, das eine Mock-API über Service-Worker bereitstellt.
- `@repo/ui`: eine Basis-React-Komponentenbibliothek, die von den Anwendungen
  `PLANNING STACK TEMPLATE` und `prototype` gemeinsam genutzt wird
- `@repo/eslint-config`: `eslint`-Konfigurationen (enthält `eslint-config-next` und
  `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s, die im gesamten Monorepo verwendet werden

Jedes Paket/jede App ist in [TypeScript](https://www.typescriptlang.org/) geschrieben.

## Dokumentation

Die Entwickler-Dokumentation befindet sich im Ordner `docs`. Sie wird automatisch mittels
Gitlab-Pages
[hier](https://frontend-6dd0b0.pages.ti8m.ch/planning-stack-template-frontend/HEAD/index.html)
veröffentlicht.

Die Projekt-Dokumentation ist in [AsciiDoc](https://asciidoctor.org/) verfasst und wird mittels
[Antora](https://antora.org/) generiert.

## Build

Die Builds sind alle von [Turborepo](https://turbo.build) gesteuert und sollten aus dem
Root-Verzeichnis heraus aufgerufen werden. werden.

Um alle Apps und Pakete zu bauen, führe den folgenden Befehl aus:

```
npm run build
```

Es ist auch möglich, nur ein bestimmtes Paket oder eine bestimmte App zu bauen:

```
npm run build:data

npm run build:msw

npm run build:prototype
```

### Entwicklung

Bevor der Dev-Server zum ersten Mal gestartet werden kann, müssen die Mock-Daten gebaut werden.

```
npm run build:data
```

Aktuell ist standardmässig der Prototyp aktiviert. Um die Entwicklung zu starten, führe den
folgenden Befehl aus. Dieser startet einen lokalen Server und watcher für die Abhängigen Pakete.

```
npm run dev
```

### Publish

Der Prototyp sollte automatisch bei einem Push auf die `main`-Branch auf einen Preview-Server
deployed werden.

Die Dokumentation wird bei einem Push auf die `main`-Branch mittels Gitlab-Pages deployed.
