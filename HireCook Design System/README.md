# HireCook Design System

> **AI-powered behavioral intelligence for hiring decisions.**

HireCook is an AI Decision Infrastructure for hiring. It predicts how a candidate will behave inside a specific job environment — not "what kind of person are you," but **"how will you actually work, here."** The system combines AI behavioral simulation, Situational Judgment Tests (SJT), Person × Environment (P × E) fit analysis, and Explainable AI (XAI) to give SMBs an evaluation grade tool at a sensible price.

This design system encodes the visual, verbal, and interactive language that makes HireCook feel like what it is: **a calm, scientific instrument** — not an HR portal, not a personality quiz, not a chatbot.

---

## Brand in one paragraph

HireCook reduces the systemic loss caused by talent mismatch. The product is best understood as three layers stacked: **AI Decision Infrastructure → Behavioral Intelligence System → Workforce Prediction Engine.** The brand should feel closer to Bloomberg Terminal, Palantir, Linear and Stripe Atlas than to anything in the traditional HR market. Despite the name, **HireCook is not food, restaurants, or kitchens** — "Cook the right talent for the right environment" is the only acceptable read.

## Core formula

```
B = f(P, E)

Behavior = function(Personality, Environment)
```

The brand mark, the dashboards, and the copy all return to this idea. Personality is one input; the environment is the other; behavior is the predicted output. Every visual decision should reinforce structure, signal, and prediction.

---

## Source materials

This design system was created from a written brand brief. **No codebase, Figma file, or production screenshots were provided.** The system below is therefore a *foundational* one — a defensible starting point in the style of the references the brief named, ready to be tightened once real product surfaces exist.

Reference North Stars named in the brief:

- Bloomberg Terminal — data density, monospaced rigor
- Palantir — calm intelligence, restrained surface
- Stripe Atlas — typographic precision, dense whitespace
- Linear — minimal chrome, signal-first
- Notion AI / OpenAI Enterprise / Scale AI / Perplexity Enterprise — modern AI infrastructure tone

Anti-references (do NOT echo): 104 人力銀行, traditional HR portals, MBTI quiz sites, cartoonish psych tests, gamified candy palettes.

---

## Index

| File | Purpose |
|---|---|
| `README.md` | This file — brand context, content + visual foundations, iconography |
| `SKILL.md` | Agent Skill entry point — read first when invoked as a skill |
| `colors_and_type.css` | All design tokens: color, typography, spacing, radius, shadow, motion |
| `assets/` | Logo lockups, brand marks |
| `preview/` | Card specimens that render in the Design System tab |
| `ui_kits/dashboard/` | HireCook TAT Playbook dashboard — JSX components + index.html |
| `screenshots/` | Reference captures of the dashboard for quick scanning |
| `fonts/` | (Optional) self-hosted webfonts. Currently loaded from Google Fonts CDN. |

### Font substitutions (flag this to the team)

The brief named **Inter / Geist / IBM Plex Sans / SF Pro / Noto Sans TC**. Self-hosted webfont files were not provided. The system currently loads via Google Fonts:

- **Inter** → used for sans / display (canonical match to the brief)
- **Noto Sans TC** → used for 繁中 (canonical match to the brief)
- **JetBrains Mono** → used as the mono rail (closest free GF match to **IBM Plex Mono**; Plex Mono is also free on GF if preferred — easy swap in `colors_and_type.css`)

When licensed, drop self-hosted `.woff2` files into `fonts/` and replace the `@import` at the top of `colors_and_type.css` with `@font-face` declarations.

---

---

## Content Fundamentals

HireCook copy reads like a **research note from an instrument**, not a marketing email. Calm, precise, never breathless. We are an infrastructure brand selling to operators who don't have time to be flattered.

### Voice anchors

| We are | We are not |
|---|---|
| Calm, exact, declarative | Excited, salesy, hype-driven |
| Quantitative when possible | Adjective-heavy |
| Plainly confident | Hedging or apologetic |
| Mechanism-explaining | Black-box mystifying |
| Bilingual EN ↔ 繁中, terms aligned | EN-only or unstable mixing |

### Pronouns

- Product → **the system / HireCook**. Use the proper noun more than "we".
- Customer → **you** (singular operator: HR lead, hiring manager). Never "users", "folks", "team members".
- Candidate → **the candidate**. Never "the applicant", never first-name-fake.
- Avoid "AI" as a noun-stuffed adjective ("AI-powered AI dashboard"). One "AI" per paragraph is plenty.

### Casing

- **Sentence case** everywhere: nav, buttons, headings, table columns. Title Case is reserved for proper nouns (TAT Playbook, P × E Fit Score, Person × Environment).
- Acronyms stay uppercase: **SJT**, **TAT**, **XAI**, **P × E**.
- Numbers use Western digits with thin spacing for currency: `NT$ 200,000–300,000`.

### Punctuation & symbols

- **× (multiplication sign), not x.** Always `P × E`, never `P x E`.
- **En-dash for ranges** (60.3 天, NT$ 20–30 萬). Em-dashes only sparingly, for parenthetical asides.
- Decimals are decimals, not "點" in EN copy.
- No emoji. None. (See Iconography.)
- Trailing periods on full sentences; **no period** on UI labels, buttons, table cells, chips.

### Sentence cadence

Short, declarative, paragraph-as-statement. Linear / Stripe rhythm.

> **Behavior is the function of personality and environment.**
> HireCook models both, then predicts the result.

Avoid run-on marketing sentences. If a sentence needs three commas, break it.

### Numbers and claims

Numeric claims always carry their unit and a non-breaking link to source. Examples from the brief:

- 平均填補職缺需 **60.3 天**
- 新人六個月留任率僅 **65.4%**
- 單次錯配損失 **NT$ 20–30 萬**

Never round in marketing copy ("60 天") — exactness is brand-positive. UI metrics use `font-feature-settings: "tnum"` so digit columns align.

### Bilingual rules

- 繁體中文 is canonical for Taiwan SMB audience copy. EN is canonical for engineering/IR/global pages.
- When mixing in one sentence, leave a **half-width space** on each side of the Latin block: `透過 AI 行為模擬 預測…`.
- Same term, same translation, every time. The system maintains a glossary; do not improvise.

| EN | 繁中 |
|---|---|
| Person × Environment fit | 人格 × 環境 適配 |
| Situational Judgment Test (SJT) | 情境判斷測驗 |
| TAT Playbook | TAT 人才使用手冊 |
| Behavioral simulation | 行為模擬 |
| Retention risk | 留任風險 |
| Decision intelligence | 決策智能 |

### Sample copy — drop-in correct register

**Hero, EN**
> AI-powered behavioral intelligence for hiring decisions.
> HireCook predicts how a candidate will work inside the role you actually have — before you hire them.

**Hero, 繁中**
> 用行為模擬，預測人才在你的環境中的真實表現。
> HireCook 把招募從主觀直覺，轉化為可計算決策。

**Empty state**
> No assessments yet. Model a role environment to begin.

**Risk callout**
> Watch — stress-response divergence from team baseline.

---

## Visual Foundations

### The one-line philosophy
**Digital Rationalism.** The interface is an instrument. Restraint earns trust. Information has gravity; chrome doesn't.

### Color

- **Deep Intelligence Blue (#2151F5)** is the only brand color. Use it for primary actions, key indicators, the brand mark, and the focus ring. Never for decoration.
- **White is the canonical surface.** `#FFFFFF` for cards and the top-bar canvas, `#F7F8FB` for raised / subtle zones (sidebar, search input, hover backgrounds). This mirrors the Linear / Stripe / Notion AI lineage.
- Neutrals are cool, near-black, slightly blue-cast. Never warm browns or greys.
- **Signal cyan (#00B4D8)** appears only when the system is *predicting / inferring / streaming*. Like an oscilloscope trace. Never a button. The brighter `#6FE3F5` variant is reserved for the dark theme.
- **Semantic status** is flat: green (`fit`), amber (`watch`), red (`risk`). Never gradient, never glow on these.
- **No rainbows. No purple-to-pink AI gradient. No candy palettes.** A single faint blue luminance behind the brand mark is the only allowed decorative effect.
- **Dark mode is available** but opt-in (`<html data-theme="dark">`). All tokens swap atomically.

### Type

- Single sans family: **Inter** (with Noto Sans TC for 繁中, automatic via font stack). Self-host Geist or IBM Plex Sans in production for closer match to the named references.
- Mono family: **JetBrains Mono** (substituting IBM Plex Mono until licensed). Mono is used for: numbers in data columns, IDs, code, eyebrows, model versions, timestamps.
- Base size **14 px** on dashboard surfaces — Linear-density. 16 px on marketing pages.
- Tracking is **slightly negative** on display sizes (`-0.02em` → `-0.005em`), neutral on body, **+0.12em uppercase** on eyebrows.
- Tabular figures (`font-feature-settings: "tnum"`) are mandatory on any numeric column or KPI.

### Spacing & grid

- 4 px base unit. Common stops: 8 / 12 / 16 / 24 / 32. Avoid odd values.
- Dashboard layout: **12-column grid, 24 px gutters**, max content width 1280 px.
- Panels separated by **1 px hairlines**, not gaps. Whitespace lives inside the panel.

### Backgrounds

- **White is canonical.** `#FFFFFF` cards on `#FFFFFF` canvas, separated by 1 px hairlines. Sidebars, search inputs, hover states use `#F7F8FB` (`--bg-subtle`).
- No textures, no patterns, no illustrations.
- Optional decorative element: a **faint dot lattice** at 3 % opacity behind hero areas — references the P × E mark. Render via SVG or radial-gradient grid; never imported as a raster.
- **Faint blue luminance** (max 10 % opacity) allowed behind the brand mark and major hero zones. Never on every card — it loses meaning.
- Imagery, when used, is **cool, desaturated, with optional 2 % monochrome grain** layered at 6 % opacity. Photography skews dusk/blue-hour, never warm office stock. We expect to use very little photography.

### Animation

- **Calm and instrument-like.** 140–200 ms is the default duration. 320 ms maximum for layout shifts.
- Easing: `cubic-bezier(0.2, 0.0, 0.0, 1)` for incoming, `cubic-bezier(0.4, 0.0, 1.0, 1)` for outgoing. **No bounces, no overshoots, no springs.**
- **Signal cyan is the only thing that pulses.** A 2 s ease-in-out opacity loop (0.4 → 0.9 → 0.4) on the "inference active" dot. Nothing else animates idly.
- Hover/press transitions: `140ms ease-precise` on color and border. Never on transform.

### Hover, press, focus

- **Hover**: background lightens one step (`--bg-surface → --bg-raised`); border goes from `--line-soft` to `--line-strong`. No scale. No translate.
- **Press**: background goes one step *deeper* (`--bg-raised → --bg-surface`) for tactile snap. No scale.
- **Focus**: always the brand ring (`--ring-focus`), 4 px offset, brand blue. Never the browser default.
- **Disabled**: 40 % opacity, no pointer events. Never grey-on-grey colorshift.

### Borders & dividers

- Almost everything uses a **1 px hairline** (`rgba(255,255,255,0.06)` dark / `rgba(8,16,40,0.06)` light). Borders are the load-bearing element, shadows are not.
- Selected/active state promotes the border to `--accent-brand` at 1 px (never 2 px — that's a HR-portal tell).
- **Inner shadow** (`inset 0 1px 0 var(--line-soft)`) is used sparingly on top of panels to suggest a slight bevel under top chrome.

### Shadows & elevation

- Three levels only. `--shadow-1` for cards (essentially just a hairline), `--shadow-2` for dropdowns/menus, `--shadow-3` for modals.
- We **do not** use the soft-pillow shadows of consumer products. Shadows here are functional separation, not aesthetic.

### Corner radii

- **Small, deliberate**: 3 px (chips, inputs), 6 px (buttons), 8 px (cards), 12 px (panels), 16 px (modals).
- **Pill** is reserved for status chips with text inside. Never on buttons.
- Top-level layout containers may be **fully square** (radius 0) — that's the Bloomberg-Terminal move and is welcome on the canvas edge.

### Cards

A standard card is:
```
background: var(--bg-surface);
border: 1px solid var(--line-hairline);
border-radius: 8px;
padding: 20px 24px;
```
Add an eyebrow (mono, uppercase, `--fg-muted`) at the top. Numbers go big and tabular. Supporting text below, never above the number. No icons inside the card unless they are functional (clickable).

### Transparency & blur

- Used **only** on overlays: modal scrim (`rgba(5,7,12,0.65)` + `backdrop-filter: blur(8px)`), command palette, sticky top-bar when scrolled.
- Never on regular cards. Never as a "glassmorphism" aesthetic effect.

### Layout rules

- **Persistent sidebar (240 px)** on dashboard. **Persistent top-bar (52 px)** with workspace switcher, search, env-modeling status, account.
- Page titles are *plain text in the content area*, not duplicated in the top-bar. Top-bar is for system state; the content area is for the workpiece.
- One H1 per page. Eyebrows segment without competing with the H1.

### Voice in visual decisions

Every visual decision should pass: **"would Bloomberg / Palantir / Linear / Stripe ship this?"** If it would land in a Slack channel called #candidate-experience-fun, it's wrong.

---

## Iconography

### Set

HireCook uses **[Lucide](https://lucide.dev/)** as the primary icon system — outline, 1.5 px stroke, square line-caps, 24 × 24 viewBox rendered at 16 / 20 px. Loaded from CDN:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

This is a **substitution**, flagged here: no production icon set was supplied. Lucide is the closest match to the Linear / Stripe aesthetic the brief calls for, and is open-license. **Replace with the official HireCook icon set when it exists.**

### Rules

- Stroke 1.5 px (Lucide default). Never fill-style icons in product UI; reserved for the brand mark only.
- Default color is `--fg-secondary` (`#B4BCD0` on dark). Active / brand state: `--accent-brand`. Status icons inherit semantic status colors.
- **Sizes**: 14 px (chip / inline), 16 px (default), 20 px (nav rail / buttons), 24 px (page header).
- Padding around icons in buttons is always the icon's own visual edge plus 8 px — measure to the visible glyph, not the SVG bounding box.

### Emoji

**Never.** HireCook is not a Slack app. The single allowed exception is system-level OS use (notification badge, file picker) — and even there, we prefer Lucide.

### Unicode

A small set of typographic symbols is welcome and on-brand:

| Symbol | Meaning | Where |
|---|---|---|
| `×` | Multiplication (P × E) | Headings, copy |
| `→` | Causation / flow (P × E → B) | Headings, callouts |
| `·` | Separator in metadata | Dense rows |
| `±` | Confidence interval | Score cards |
| `Δ` | Delta / change | Trend chips |
| `↗ ↘` | Trend arrows | Number cards |

### Custom diagram glyphs

The brand mark's node-and-path vocabulary is reusable in product diagrams (P × E maps, prediction explainability views). Use **the same blue + cyan** rule: nodes / structure in `--hc-blue-500`, active / predictive paths in `--hc-signal-cyan`.

### Logo files

- `assets/logo-mark.svg` — square mark, 64 × 64 viewBox
- `assets/logo-wordmark-dark.svg` — mark + wordmark for dark surfaces
- `assets/logo-wordmark-light.svg` — mark + wordmark for light surfaces
- `assets/monogram.svg` — HC monogram for favicons / app icons

