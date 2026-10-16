# 🏗️ Architecture

Deep dive for contributors who want to understand how the app is structured. Newcomers can skip this and start with the root [README](../README.md).

---

## 🧱 High-level

```mermaid
flowchart LR
  subgraph Browser["🖥️ Browser"]
    HTML["📄 index.html"]
    JS["📦 dist/gwent-checklist.js"]
    UI["⚛️ React UI"]
    Cookie["🍪 Cookie state"]
  end

  subgraph Static["📂 Static assets"]
    Data["🧾 data/data.json"]
    Locales["🌍 translations/*.json"]
    Flags["🏳️ translations/flags/*.svg"]
    Images["🖼️ data/images/*.png"]
  end

  HTML --> JS --> UI
  UI -->|fetch| Data
  UI -->|fetch| Locales
  UI -->|img| Flags
  UI -->|lazy img| Images
  UI <-->|language + gathered| Cookie
```

---

## 🔄 Startup sequence

```mermaid
sequenceDiagram
  participant U as 👤 User
  participant A as ⚛️ App
  participant D as 📂 ./data

  U->>A: Open index.html
  A->>D: GET data.json
  A->>D: GET translations/locales.json
  A->>D: GET translations/{locale}.json
  A->>A: Restore cookie or apply preselected
  A->>U: Render checklist
  U->>A: Toggle / filter / switch language
  A->>A: Persist cookie
```

---

## 📁 Repository layout

```mermaid
flowchart TB
  R["🃏 gwent-checklist"]

  R --> I["📄 index.html — Pages entry"]
  R --> P["📦 package.json · vite · tsconfig"]
  R --> N["🟢 .nvmrc"]

  R --> S["📁 src/ — React app"]
  S --> SC["components/"]
  S --> SH["hooks/"]
  S --> SD["data/ loaders"]
  S --> SP["persistence/"]
  S --> SI["i18n/ helpers"]

  R --> DT["📁 data/"]
  DT --> DJ["data.json"]
  DT --> DI["images/"]
  DT --> TR["translations/"]
  TR --> L["locales.json"]
  TR --> EN["en-US.json"]
  TR --> RU["ru-RU.json"]
  TR --> FL["flags/{locale}.svg"]

  R --> DIST["📁 dist/ — built JS/CSS"]
  R --> SCR["📁 scripts/ — write-*-index.mjs"]
  R --> DOC["📁 docs/"]
```

---

## 📐 Data model

```mermaid
erDiagram
  DATA_JSON ||--o{ CARD : contains
  CARD ||--|| IMAGE : imageId
  CARD ||--o{ TRANSLATION : uuid
  LOCALES ||--o{ PACK : lists
  PACK ||--|| FLAG : locale.svg

  DATA_JSON {
    object attributes
    array cards
  }
  CARD {
    string id
    string slug
    string faction
    string type
    boolean preselected
    string imageId
  }
  PACK {
    string locale
    object ui
    object attributeLabels
    object attributes
    object cards
  }
```

### `data/data.json`

- **`attributes`**: allowed values for faction, type, expansion, row, ability  
- **`cards[]`**: `id`, `slug`, faction/type/expansion, `strength`, `row`, `abilities[]`, `tags[]`, `imageId`, `preselected`

### Translation pack shape

```json
{
  "locale": "en-US",
  "ui": { "appTitle": "…", "…": "…" },
  "attributeLabels": { "faction": "Faction" },
  "attributes": {
    "faction": {
      "northern": { "name": "Northern Realms", "description": "…" }
    }
  },
  "cards": {
    "<uuid>": {
      "name": "…",
      "description": "…",
      "howToGet": "…",
      "effect": "…"
    }
  }
}
```

### Flags

`data/translations/flags/{locale}.svg` — same BCP 47 code as the translation file / `locales.json` entry (e.g. `en-US.svg`, `ru-RU.svg`).

---

## 🍪 Persistence

```mermaid
flowchart LR
  A["App state"] --> C["🍪 gwent_checklist cookie"]
  A --> J["💾 Export JSON"]
  J --> F["📁 gwent-checklist.json"]
  F --> I["📥 Import"]
  I --> A
  R["♻️ Reset"] --> P["preselected cards only"]
  P --> A
```

- Cookie format: `v1|{locale}|{base64-bitfield}` (bitfield = card order in `data.json`)  
- JSON export: `{ "language": "en-US", "gathered": ["uuid…"] }`
