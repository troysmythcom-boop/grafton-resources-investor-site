# Grafton Resources — website redesign

A six-page investor website using Grafton's August 2026 brand identity: navy, orange, supporting teal and alpine colours, and the actual logo extracted from the supplied guidelines. The client's Claude reference informed the corporate navigation, news desk, update request strip, project feature, map and educational geology sections.

## Run locally

Run `npm start` in this folder, then open **http://localhost:4173**. Node.js 20 or newer is required. No installation or build step is needed.

Run `npm test` for the route, asset, capital reconciliation and terrain checks.

Pages: Home, Projects, Investors, Company, News & resources, Contact.

## Deploy on Railway

Push the contents of this folder to the repository root, then create a Railway service from that repository. Railway detects the Node app and uses `railway.toml` to run `npm start`, expose the app on Railway's assigned `PORT`, and check `/health` after deployment. No build command or environment variables are required.

After Railway assigns a domain, set it as the public domain and use it when configuring any social preview metadata. The site has no database, secrets, or persistent storage requirements.

## Working interactions

- Responsive navigation with keyboard access.
- Dropdown corporate/project/investor navigation and mobile menu.
- Leaflet map with OpenStreetMap tiles, keyboard/touch pan and zoom, locality popup and Chile/regional presets. The Alicahue locality marker uses OpenStreetMap node 214202900; it is not a surveyed concession position.
- Geological model: mouse drag, horizontal touch gestures, arrow keys, zoom, reset, terrain/wireframe/subsurface modes. Respects reduced motion.
- TradingView ticker and selectable Grafton, copper and gold charts.
- Capital chart category selection and filtered document library.
- Project overview, geology and location tabs, including keyboard navigation.
- Expandable investor FAQs and a source-credit dialog.
- Validated contact form that prepares an email draft for the visitor to review and send.
- An email-update request form prepares an explicit request in the visitor's email app. It does not silently subscribe or store visitors.

## Data and publication notes

This is an independently hosted redesign for client review. The existing graftonresources.com website is unaffected.

GFT's free TradingView widget supplies **end-of-day** CSE data, not a licensed real-time equity feed. Metals prices update as supplied by the provider; copper is an indicative CFD quotation. Real-time CSE data would require an appropriate licensed feed. Widgets and Google Fonts need internet access; the website retains local assets and fallback fonts.

The capital structure reproduces the undated figures on the company website: 16,860,901 issued shares, 7,179,568 warrants and 700,000 options, totalling 24,740,469 fully diluted. It is labelled as a published snapshot and must be checked against current filings before public launch.

No fabricated stock prices, drill results, grades, project sizes, resources, production forecasts or investor returns are displayed. The terrain is synthetic, educational geometry, not a survey or resource model. Both generated images are illustrative; the mineral is not a project sample.

Contact messages are not stored or automatically sent. A production contact inbox or newsletter service can replace the explicit email-draft workflow once the company provides its chosen service. No analytics or tracking code has been added; embedded market widgets and remotely hosted fonts use third-party services.

Before publication, the company should confirm the current legal entity name, management, share counts and technical disclosures. The original website uses several company-name variants, so this design consistently uses the Grafton Resources brand. Configure the public domain and social-sharing metadata when deploying.

For static hosting, serve the `index.html` fallback for `/projects`, `/investors`, `/company`, `/news` and `/contact`, and publish `styles.css`, `app.js`, `terrain.js` and the `assets` directory. Railway runs the included server on its assigned port and checks /health.

## Sources

Accessed 8 September 2026:

- [Original website](https://www.graftonresources.com/)
- [About and Alicahue](https://www.graftonresources.com/about-1)
- [Leadership](https://www.graftonresources.com/managment)
- [Share structure](https://www.graftonresources.com/share-structure)
- [Corporate directory](https://www.graftonresources.com/privacy-policy-1)
- [Presentation page](https://www.graftonresources.com/group-events)
- [2025 news archive](https://www.graftonresources.com/2025)
- [Governance](https://www.graftonresources.com/governance-1)
- [Privacy policy](https://www.graftonresources.com/management-1)
- [Disclaimer](https://www.graftonresources.com/management-1-1)
- [TradingView GFT](https://www.tradingview.com/symbols/CSE-GFT/)
- [TradingView copper](https://www.tradingview.com/symbols/XCUUSD/?exchange=OANDA)

The presentation and announcement buttons link to documents provided by the original website. Company logo: extracted from Grafton Resources — Brand Guidelines, August 2026. Landscape and mineral artwork: generated for this design. Typography uses Avenir Next LT Pro and Aptos when installed, with Raleway served by Google Fonts as the available brand-family fallback; licensed font binaries were not supplied.

The reference artifact explicitly labels its Caldera, Alaska, Poseidon and Jabalí profiles as placeholders. Those projects, unverified news items and technical claims were not published as established company facts. The map can be extended when approved project documents and coordinates are supplied.
