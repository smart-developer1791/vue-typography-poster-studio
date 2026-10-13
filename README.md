<div align="center">

# 🔤 Typography Poster Studio

**An ordinary thought. Beautifully said.**

![Vue](https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vuedotjs&logoColor=ffffff)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=for-the-badge&logo=typescript&logoColor=ffffff)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=ffffff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=ffffff)
![License](https://img.shields.io/badge/License-MIT-a48750?style=for-the-badge)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

_Vue typography poster workshop with three compositions, named CSS Modules, reactive SFC styles, local typefaces, and standalone print HTML/JSON exports._

</div>

---

## ✨ Highlights

- **Good Words, Given Space:** Edit a headline, supporting line, and footer with intentional line breaks.
- **Three Compositions:** Compare editorial, bold, and quiet poster layouts in portrait, square, or landscape shapes.
- **A Little Typographic Rhythm:** Select two local typefaces, heading size, line height, tracking, alignment, paper, ink, and accent.
- **Vue Style Isolation:** Named composition/lettering CSS Modules and reactive v-bind() styles keep mounted poster instances independent.
- **Portable Print Artwork:** Download complete HTML with its own styles, embedded Latin WOFF2 fonts/licenses, and physical print page size.
- **Local Workspace:** Validated device-local persistence and imports that preserve current work on failure.
- **Project Identity:** Original favicon and social artwork, CodeSculptor attribution, and deterministic configuration stamps.

## 🧱 Project Structure

```text
public/
|-- favicon.svg                         # Original project favicon
|-- og.svg                              # Original social artwork
|-- font-licenses.txt                   # Bundled font copyright and OFL licenses
`-- sample-workspace.json               # Complete importable sample
src/
|-- components/
|   |-- AppDialog.vue                   # Native Teleport dialog and focus lifecycle
|   |-- AppIcon.vue                     # Inline SVG interface icons
|   |-- PosterCanvas.vue                # Named CSS Modules, useCssModule, and reactive SFC CSS
|   `-- PosterPreview.vue               # ResizeObserver fit inside a reserved viewport
|-- domain/
|   |-- poster.ts                       # TP/1 recipes, shared composition tokens, and print geometry
|   `-- export.ts                       # Escaped independent HTML with embedded fonts and print CSS
|-- services/
|   |-- fonts.ts                        # Bundled font loading and embedded data URLs
|   |-- draft.ts                        # Validated local typography persistence
|   `-- files.ts                        # Downloads, cloning, and deterministic stamps
|-- App.vue                             # Workspace, editing, and data exchange
|-- base.css                            # Tailwind theme and native element defaults
|-- main.ts                             # Vue application entry
`-- style.css                           # Brand tokens and domain-specific styles
tests/
|-- e2e/
|   `-- poster.spec.ts
`-- poster.test.ts
index.html                              # English metadata and application mount
package.json                            # Local dependencies and npm commands
playwright.config.ts                    # Production browser workflows
vite.config.ts                          # Vue and Tailwind plugins
vercel.json                             # Explicit routes, cache, and headers
```

## 🛠️ Tech Stack

Vue 3, TypeScript 6, Vite 8, and Tailwind CSS 4. Locally bundled DM Sans and Bricolage Grotesque fonts. Prettier for formatting, Node's native test runner for domain/export checks, and Playwright for production browser workflows. Dependencies are installed inside this project; the application uses no backend service.

## 🎨 Tailwind Styling

The application uses Tailwind CSS 4 utilities directly in Vue templates for layout, spacing, typography, borders, colors, and visible states. Responsive and selector variants preserve the existing desktop and narrow-screen layouts. Utility names are complete source strings that Tailwind can detect during the Vite build.

`src/base.css` defines the font and spacing theme, maps project colors through `@theme inline`, and uses `@apply` for native element defaults. `src/style.css` holds the original brand tokens and any remaining domain-specific rules. Dynamic classes express Vue states, while explicit `data-ui` attributes identify elements used by descendant utilities or browser tests. Unused class names are removed. The spacing unit is `4px` to preserve the original pixel measurements independently of the root font size.

PosterCanvas retains its named CSS Modules and CSS v-bind typography as the Vue demonstration. Tailwind styles the application around it; printable HTML remains self-contained.

## 📦 Included Demo Data

`public/sample-workspace.json` is a complete importable TP/1 sample. Defaults also live in the domain module, so startup needs no sample fetch. Parsers reconstruct known fields and ignore unknown metadata.

An original ordinary-afternoon poster with a two-line headline, one supporting sentence, and a small final note. Three original composition treatments and locally bundled DM Sans/Bricolage Grotesque are included.

## 🚀 Local Development

Requires Node.js 24 or later.

```bash
npm ci
npm run dev
```

Open the Local URL printed by Vite, normally `http://localhost:5173`. To serve the production build:

```bash
npm run build
npm run preview
```

## ◈ Vue Implementation

`PosterCanvas.vue` defines named `<style module="composition">` and `<style module="lettering">` blocks. `useCssModule` returns their generated class maps, used for the paper, layout, decoration, and text. CSS v-bind() links typography, geometry, and colors to each instance’s props through Vue-generated custom properties on that instance. The three hero examples and the editor mount simultaneously; editing one cannot recolor the others. Preview and standalone export share validated layout/dimension/font tokens. ResizeObserver scales only the poster inside a reserved stage, leaving panel geometry stable when composition or shape changes.

Reference: [Vue SFC CSS Modules and reactive CSS bindings](https://vuejs.org/api/sfc-css-features.html#css-modules).

## 💾 Local Drafts & Data Exchange

Valid edits save to localStorage. Invalid edits preserve the last valid saved workspace and preview, with an inline error; exports are disabled until the draft is valid. The storage key is `typography-poster-studio:TP1`. Corrupted saved data falls back to the sample. Storage failures appear in the desktop header; export your work before clearing browser data or changing devices. There are no tracking or data-upload requests.

## ◈ Project Markers

JSON exports identify `vue-typography-poster-studio`, CodeSculptor, and a deterministic `TP-XXXXXXXX` checksum. The same canonical workspace produces the same stamp. This is an identity aid, not a cryptographic signature or uniqueness guarantee. Original favicon and social artwork carry the project identity.

## 🔌 Extension Notes & Nuances

Recipes require TP/1, a nonempty title up to 80 characters, nonempty heading up to 100, subtitle up to 200, footer up to 80, supported composition/shape/font/alignment, six-digit HEX colors, integer 24–110 px heading size, 0.9–1.6 line height, and −3 to 12 px letter spacing. JSON files must be below 10 KB. Invalid direct edits retain the last valid preview/save and disable export; invalid imports preserve the recipe. Restore asks for confirmation. The editing tab is session-only.

The reference canvases are 840 × 1188 px portrait, 900 × 900 px square, and 1200 × 800 px landscape. Physical exports preserve aspect ratio with a 210 mm short edge: 210 × 297 mm, 210 × 210 mm, or 315 × 210 mm. Heading sizes are reference-canvas pixels and scale with the entire poster. Composition changes affect inset, weight, border, and decoration. The fixed poster clips excessive text to preserve the page; inspect the result before printing and adjust text or type size.

Standalone HTML includes complete CSS, local Latin variable fonts as data URLs, font licenses in an inert template, metadata, and a TP stamp. It contains no JavaScript or linked fonts. The app bundles all font subsets through its package CSS, while the export embeds Latin subsets; other scripts fall back to installed system fonts. Open the file and use the browser print command with declared custom paper size, 100% scale, margins off, and background graphics on. Browser/printer support for custom page sizes and hardware margins requires a physical test sheet. No PDF generator or raster screenshot is included.

The HTML generator escapes user text and validates all CSS values. Print CSS scales every reference metric through one millimeter unit. JSON preserves editable words and styles. Named module class hashes belong to the live Vue build; exported HTML uses independent class names and requires no Vue runtime.

Panels reserve space across selections, modes, and tabs; larger content scrolls inside them. The layout supports 320 px screens and reduced motion. Native dialogs manage modal focus and Escape. Original visual assets are SVG; convert social artwork to PNG for services requiring raster images.

## 🧪 Build & Checks

```bash
npm run format:check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Four native tests cover bounded recipes, physical aspect ratios, safe standalone HTML/font metadata, and all three composition exports. Four production browser workflows cover real module classes and per-instance reactive CSS, persistence, downloaded HTML in an independent page with no HTTP requests, embedded fonts/licenses, print dimensions, actual JSON downloads, rejected imports, and stable 320 px tabs/shapes. Browser tests use the production build. Browser traces, reports, and build output are ignored by Git.

## 🌐 Pages & Vercel Deployment

- `/` — application workspace
- `/sample-workspace.json` — importable TP/1 fixture

Import this directory as the Vercel project root. The explicit configuration uses the Vite preset, `npm ci`, `npm run build`, and `dist`. The custom development command forwards `$PORT` to Vite with `--strictPort`.

- `/` serves the app; `/index.html` permanently redirects to `/`.
- Trailing slashes are removed; there is no catch-all rewrite.
- HTML, sample files, icons, and social artwork require revalidation.
- Content-hashed JS, CSS, and fonts in `/assets/` receive a one-year immutable cache policy.
- Responses include `X-Content-Type-Options: nosniff` and a referrer policy.
- Static files retain their original paths. Missing files do not fall back to HTML.

Vite preview does not emulate Vercel routing or headers. Schema validation and local route evaluation do not replace HTTP checks against an actual deployment.

## 📄 License

MIT License. See [LICENSE](./LICENSE). Bundled typefaces retain their original licenses in [font-licenses.txt](./public/font-licenses.txt).
