# Grafton Resources website

A React website using Motion and Three.js, based on the supplied Claude wireframe. The local preview runs at **http://localhost:5173**.

## Run

Requires Node.js 22.12 or newer.

```sh
npm install
npm run build
npm start
```

For development, use `npm run dev`. The production commands work in Windows PowerShell as well as macOS/Linux. The development optimizer may require normal filesystem permissions outside a restricted agent sandbox.

## Page routes

`/company`, `/company/management`, `/company/directory`, `/company/governance`, `/projects`, `/projects/alaska`, `/projects/poseidon`, `/projects/jabali`, `/projects/caldera`, `/geology`, `/investors`, `/investors/stock`, `/investors/share-structure`, `/investors/presentations`, `/news`, `/contact`, `/privacy`, `/disclaimer`.

Project order: Alaska → Poseidon → Jabalí → Caldera. Headshots are omitted. A globe opens the language chooser; selection persists across pages. The map fits its complete drawing at first load and reset, including on mobile. The geological model shows continuous recharge and upflow paths, connected gold-bearing branches, a blind vein ending beneath the surface and projected selectable labels.

## Included

- The wireframe’s hero, signup, introduction/news, four project cards, epithermal model, strategy and project-map sequence. Investor information and leadership follow those sections.
- Brand Navy `#1F477D` and Alpine Sky `#DDF0F7`. The preferred heading face is Avenir Next LT Pro; Aptos is supported. Raleway, the guide’s secondary typeface, is the web fallback because licensed heading font files were not supplied. The unmodified standard logo is rendered directly from page 2 of the August 2026 guide, with its proportions preserved and white clear space. The same artwork replaces the older mark on the map.
- Responsive English, Spanish and Simplified Chinese interface and page copy. Official documents, original map annotations and no-key source excerpts retain their original English wording and are labelled accordingly. These are not certified translations.
- Actual Three.js wireframe terrain, an interactive geological cutaway, material highlighting, reset, pan/zoom on the original map, Motion section entrances, a scroll-driven drill-stem progress line. Reduced-motion preferences are honoured. No stock photos or image generation are used; image slots contain outline studies and art direction.
- The original vector map from the Claude artifact, preserved in `src/map-data.js`. It is stored compressed and decoded locally; no external mapping API is required. Its ownership annotations are historical wireframe content, not independently confirmed current title information.
- TradingView ticker and chart integrations for **CSE:GFT**, **OTC:GFTFF**, **FWB:K8L0**, **OANDA:XAUUSD** and **OANDA:XCUUSD**. All five tickers were observed returning provider quotes. Ticker hover does not interrupt the tape. GFT’s available embedded chart is **end-of-day**, not a licensed real-time equity feed. Copper is explicitly labelled **CFD**. Data availability and delays are controlled by the provider; no prices or chart series are fabricated.
- Resizable investor assistant with the GFT chart at the top, source-linked answers, and server-side AI integration. Without an AI key it returns relevant company excerpts and declines unsupported questions. No browser-visible API secrets.
- All ten original company website information pages are available through the menu as separate, linked pages with translated editorial content and complete original-language source archives. A dated snapshot preserves access when the source website is unavailable. Source links and published presentation/press-release downloads remain attached to the original documents.

## Connections to supply

Copy `.env.example` to `.env`, enter the values on the server, and restart:

| Setting | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Enables generated answers in the selected language. Until configured, the assistant uses English source excerpts. |
| `OPENAI_MODEL` | Defaults to `gpt-4.1-mini`; set a model available to your account. |
| `SUBSCRIBE_WEBHOOK_URL` | Your email platform’s server endpoint. Receives `{ "email": "…", "consent": true }`. |
| `SUBSCRIBE_WEBHOOK_TOKEN` | Optional bearer token for that endpoint. |
| `PORT` | Defaults to `5173`. |
| `HOST` | Defaults to `127.0.0.1` for local preview. A hosting platform may require `0.0.0.0`. |

The subscription form validates email and consent. It deliberately reports that signup is not connected until a provider is configured; it does not claim to save subscribers. Configure double opt-in and return a successful HTTP status only after your email provider accepts the request. The real AI and email-provider round trips cannot be tested without those credentials. The connected GitHub repository automatically deploys to the Grafton Investor Website Railway project. `railway.toml` defines the build, start and health-check commands.

## Content decisions and source differences

The supplied artifact explicitly calls its project pages placeholders. Caldera could be verified against Grafton’s 22 July 2026 company release. Alaska, Poseidon and Jabalí retain their requested layout positions and map views, with a clear note that current technical details need confirmation. The May Newmont LOI is non-binding; it is not presented as completed ownership.

The older company site reports 16,860,901 issued shares. The CSE profile retrieved on 9 September 2026 reports **19,973,856 issued and outstanding** and **7,017,368 reserved for issuance**. The main investor panel uses the CSE figures; the historical website figures remain in the original source document. The source website’s directory, legal wording and some management descriptions also contain older or inconsistent information. Original documents are preserved with source links rather than silently rewritten as current legal statements.

The chatbot uses only the curated company corpus in `src/content.js`, `company-snapshot.mjs` and company-issued disclosures in `src/disclosures.js`. The USGS geology reference and other mining-company design references are excluded from the chatbot. Topic retrieval and rate limiting are intentionally simple for the initial corpus; a larger document collection or multiple server instances should use ranked passage retrieval and a shared rate-limit store. The AI prompt restricts answers to supplied sources, but generated answers should still be evaluated before public launch.

## Verified

`npm run build` succeeds. `npm test` passes three runnable checks covering retrieval/input boundaries and the production server’s ten source pages, grounded answers, unsupported questions, unknown routes and disconnected subscription response. Browser checks covered desktop and 390px mobile layout, Spanish/Chinese switching, live provider quotes, GFT charts, geological layer selection, map project focus, assistant answers and source links. No application console errors were found during the reviewed browser session.

## Sources

- [Required Claude wireframe](https://claude.ai/code/artifact/8c3f08dc-813c-4659-ac55-967f1a7dc48b)
- [Grafton Resources website](https://www.graftonresources.com/)
- [Grafton CSE issuer profile](https://thecse.com/listings/grafton-resources-inc/)
- [Grafton financial filings](https://thecse.com/listings/grafton-resources-inc/sedar-filings/)
- [Caldera company announcement, 22 July 2026](https://thenewswire.com/press-releases/1A0vFwaG4-grafton-resources-introduces-the-new-silver-copper-gold-antimony-caldera-project-in-the-ag-cu-au-sb-pedernal-district-valparaiso-chile.html)
- [Newmont LOI company announcement, 19 May 2026](https://www.thenewswire.com/press-releases/1Bz4FqgxY-grafton-resources-announces-letter-of-intent-for-acquisition-of-two-gold-projects-in-chile.html)
- [USGS epithermal deposit reference](https://www.usgs.gov/publications/descriptive-models-epithermal-gold-silver-deposits)
- [TradingView widget documentation](https://www.tradingview.com/widget-docs/widgets/tickers/)
- [Motion scroll documentation](https://motion.dev/docs/react-use-scroll)

The supplied August 2026 brand guide provided the palette and preferred typography. NGEx and Meridian were used as reference points for mining/investor navigation, not as templates. The supplied Fitzroy assistant screenshot informed the chart-first assistant arrangement; the Railway reference itself was unavailable through the research fetch.
