---
name: hirecook-design
description: Use this skill to generate well-branded interfaces and assets for HireCook, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping the AI Decision Infrastructure dashboard and surrounding marketing surfaces.
user-invocable: true
---

# HireCook — design skill

Read the `README.md` in this skill first; it covers brand context, content fundamentals, visual foundations, and iconography in full detail. Then explore:

- `colors_and_type.css` — all design tokens (color, type, spacing, radius, shadow, motion). Import this in any HTML you produce.
- `assets/` — brand mark, wordmark (dark + light), monogram. Always reference, never redraw.
- `preview/` — atomic specimens (color palettes, type scales, spacing, components, brand voice).
- `ui_kits/dashboard/` — HireCook product surface as React + JSX. Read `Atoms.jsx`, `Frame.jsx`, `Candidates.jsx`, `TATPlaybook.jsx`, `Roles.jsx` for the component vocabulary.

## North star

HireCook predicts how a candidate will work inside a specific job environment (the **B = f(P, E)** formula). The brand reads like Bloomberg Terminal × Palantir × Linear — calm, instrument-like, scientifically precise. **Not** an HR portal, **not** a personality-quiz site, **not** a chatbot, **not** food / restaurants. Despite the name, no chef hats.

## When invoked

- If the user gives you a concrete brief, build it.
- If they invoke this skill without other guidance, ask what they want (slide, landing page, in-product feature, throwaway mock) and a few focused questions, then act as their senior designer.
- Output HTML artifacts that *load* `colors_and_type.css` and *use* the existing `Atoms.jsx` patterns. For production code, copy the patterns; for mocks, copy whole components.

## Visual non-negotiables

1. **One brand color.** Deep Intelligence Blue `#2151F5`. Never a rainbow, never purple-to-pink AI gradient.
2. **Signal cyan only on prediction state.** `#6FE3F5` is the oscilloscope trace — used on the "inference active" dot, predicted-behavior glow in diagrams. Never a button.
3. **Hairlines over shadows.** Cards are bordered, not floated.
4. **Tabular figures.** Any number column gets `font-feature-settings: "tnum"`.
5. **No emoji.** No cute mascot. Lucide icons, 1.5 px stroke.
6. **× not x.** P × E always.
7. **Sentence case** in UI. Title Case only for proper nouns (TAT Playbook, P × E Fit Score).

## Voice in one line

Calm, exact, declarative. Closer to a research note than a marketing email.
