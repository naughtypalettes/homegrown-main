# Homegrown Arts & Media Collective — Production Website

A clean, dependency-free HTML/CSS/JS rebuild of the Homegrown Arts & Media
Collective site, replacing the generated Vite/RSC runtime captured in the
`homegrown-site-handoff/` reference package with plain, maintainable
production code.

## What this is

Six static pages sharing one design-token stylesheet and one small
progressive-enhancement script. No build step, no framework, no bundler —
open `index.html` in a browser, or serve the folder with any static file
server.

```
homegrown-production/
├── index.html          Homepage (funding strip, hero, pathway, stats,
│                        programs, team, showcase, watch, SPARKS teaser,
│                        donate, partner callout, final CTA)
├── sparks.html          SPARKS mentorship program page (full content,
│                        timeline, FAQ accordion)
├── resources.html       Creator resources directory
├── sponsor.html         Funding & partnership page
├── forum.html           Community forum landing (gated behind sign-in)
├── login.html           Member sign-in redirect page
├── css/
│   └── styles.css       Design tokens + every component style (BEM-ish,
│                        no utility-class framework)
├── js/
│   └── main.js          ~20 lines: closes the mobile nav after a link is
│                        chosen. Everything else (mobile nav, FAQ accordion)
│                        is native <details>/<summary> and works with JS
│                        disabled.
├── assets/               Local, optimized images — see "Assets" below
└── README.md             This file
```

## How the content was sourced

`homegrown-site-handoff/README.md` and `CLAUDE-PROMPT.md` both reference a
`live-snapshot.html` file as the content/visual source of truth, but that
file was **not present** in the handoff package — only `assets/` and the two
markdown briefs existed. To satisfy the brief's "do not invent programs,
team members, metrics, testimonials or partner claims" requirement, every
word of copy, every stat, every link, and every YouTube video ID in this
rebuild was read directly from the live reference site
(`https://homegrown-creative-pipeline.madebyamar.chatgpt.site/`) named in
that same README — homepage plus the five linked routes (`/sparks`,
`/resources`, `/sponsor`, `/forum`, `/login`) — including opening the
collapsed FAQ `<details>` elements on the SPARKS page to capture their
answer text. Nothing here is paraphrased marketing copy; it is a faithful
structural and content port into semantic HTML.

## Design tokens

Colours, radius and layout constants were extracted from the live site's
compiled CSS (`--gold`, `--charcoal-deep`, etc. in the original
`index-C7vg8HnT.css`) and re-declared as readable custom properties in
`css/styles.css`:

| Token | Value | Use |
|---|---|---|
| `--color-charcoal-deep` | `#344141` | Primary dark background / heading ink |
| `--color-charcoal` | `#5c6c6c` | Secondary dark tone (program card #2) |
| `--color-gold` | `#fcbc2e` | Brand accent, focus ring, CTAs |
| `--color-paper` | `#ffffff` | Light background |
| `--color-ink` | `#253030` | Body copy on light backgrounds |
| `--color-soft` | `#e9e9e9` | Soft neutral section background |
| `--color-dusty-teal` | `#acb4b4` | Muted accent (stats ribbon, image shadow) |
| `--radius` | `0.35rem` | Buttons, cards |
| `--shell-max` | `78rem` | Content max-width |
| `--font-sans` | `"Avenir Next", "Century Gothic", Arial, sans-serif` | Site-wide typeface stack |

All colour pairings were checked against WCAG AA (4.5:1 body text / 3:1
large text). The tightest pairing in use — white text on the `--color-charcoal`
program card — measures **5.5:1**; every other pairing exceeds 6:1.

## Assets

Everything in `assets/` is local and optimized; nothing hotlinks the
original site or third-party image hosts:

- `homegrown-logo.png`, `homegrown-logo-white.png` — from the handoff
  package, downsized from 4667×1667 to 900px wide and re-compressed
  (730KB → 66KB and 47KB → 31KB).
- `homegrown-creator-studio.jpg` — hero photo from the handoff package,
  converted from a 2MB PNG to an optimized JPEG (~193KB) since it's a
  photograph, not a graphic needing transparency.
- `team-guillermo-barraza.jpg`, `team-katelyn-barraza.jpg`,
  `team-tyler-mckinney.jpg` — the live site serves these three from
  imgur.com rather than its own asset host. Per the "do not hotlink"
  requirement, they were downloaded and are now served locally
  (originals were up to 2.3MB; all three are now under 100KB).
- `favicon.jpg` — unchanged, from the handoff package.

## Routes

This is a static, multi-page site — no server-side routing. Every route
listed in the handoff `README.md` is implemented directly:

| Route in handoff README | Implementation |
|---|---|
| `/` | `index.html` |
| `/sparks` | `sparks.html` |
| `/resources` | `resources.html` |
| `/sponsor` | `sponsor.html` |
| `/forum` | `forum.html` |
| `/login` | `login.html` |
| `/#team`, `/#watch`, `/#donate`, `/#short-film-showcase` | In-page anchors on `index.html`; other pages link to `index.html#team` etc. |

If this site is later deployed with clean URLs (e.g. `/sparks` instead of
`/sparks.html`), configure server/static-host rewrites accordingly (most
static hosts — Netlify, Vercel, GitHub Pages with a small config — support
extensionless routing without any code changes here).

## Accessibility

- Skip link (first focusable element, jumps to `#main-content`).
- Semantic landmarks: `<header>`, `<main>`, `<footer>`, `<nav>` with
  `aria-label`s distinguishing "Main navigation" from "Mobile navigation".
- Mobile nav and SPARKS FAQ both use native `<details>/<summary>` —
  keyboard-operable and screen-reader-exposed with zero JavaScript.
- Visible focus states: `outline: 3px solid var(--color-gold)` with offset,
  applied via `:focus-visible` on all links, buttons and form controls.
- All images carry descriptive `alt` text (decorative numerals/icons are
  `aria-hidden`).
- `prefers-reduced-motion: reduce` disables smooth scrolling and collapses
  all transitions/animations to near-zero duration.
- Colour contrast verified at ≥5.5:1 for every text/background pairing in
  use (see Design tokens table above).

## Known limitations & assumptions

- **`live-snapshot.html` was missing from the handoff package.** All content
  was sourced live instead (see "How the content was sourced" above). If a
  newer snapshot exists elsewhere, diff it against this rebuild before
  treating this as final.
- **The footer's Instagram link was broken on the live site** —
  `https://weare.homegrown` is missing a top-level domain and 404s as
  written. Rather than guess, the correct destination
  (`https://www.instagram.com/weare.homegrown/`) was confirmed via the
  live site's own Linktree (`linktr.ee/HomegrownAMC`), whose embedded page
  data lists that exact Instagram URL, and cross-checked by loading the
  profile itself — it identifies as "Homegrown Arts & Media Collective |
  YYC," matching the org's Calgary base and its `@we.are.homegrown`
  YouTube handle. This rebuild uses the corrected link.
- **No CMS, form backend, or analytics are wired up** — this is intentionally
  a static handoff. See the `TODO` comment in `login.html` for the one place
  an external integration (the member platform's login URL/provider) should
  be reconfirmed before launch.
- **Header/footer markup is duplicated across all six pages** rather than
  templated, since the brief calls for a zero-build static package. If this
  grows past ~6–8 pages, promote header/footer into includes via a static
  site generator (11ty, Astro) or a lightweight build step — no HTML/CSS
  would need to change, only how it's assembled.
- External links (Zeffy ticketing/donation, YouTube, social platforms,
  funding-body resource pages) point at the same third-party destinations
  the live site uses today; none were altered.

## Local development

No dependencies, no build step. Any static file server works:

```bash
# Python (built-in on most systems)
python -m http.server 5173 --directory homegrown-production

# Node (if you have it)
npx serve homegrown-production
```

Then open `http://localhost:5173`.

## Deployment

Upload the contents of this folder to any static host (Netlify, Vercel,
GitHub Pages, S3 + CloudFront, etc.) — there is nothing to build. Point the
host's root at this folder and set `index.html` as the default document.

## Visual QA summary

Verified at 375px (mobile), 768px (tablet), 1024px, and 1440px (desktop):

- No horizontal overflow at any width.
- Mobile nav (`<details>`) opens/closes correctly and exposes all 8 links
  (Home, SPARKS, Team, Watch, Resources, Partner, Forum, Member sign-in).
- Desktop nav appears at ≥981px per the original breakpoint.
- Hero image, team photos and program/pathway cards reflow correctly at
  every tested width.
- SPARKS FAQ accordion opens/closes and reveals real answer copy.
- All local asset requests return 200 (verified via network panel); zero
  console errors.
- Footer renders the white logo correctly against the dark background.
