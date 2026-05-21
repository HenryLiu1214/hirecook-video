# HireCook Dashboard — UI Kit

A high-fidelity recreation of the HireCook product surface as described in the brief: **the AI Decision Infrastructure dashboard, where the TAT Playbook for a candidate is generated and reviewed.** No production code was supplied, so this kit is a *defensible reference build* in the style of Linear / Palantir / Stripe — the visual references the brief named — using the design system's tokens.

## Screens included (clickable)

1. **Candidates** — list view, status chips, role context, fit scores.
2. **TAT Playbook** — candidate detail. P × E map, XAI drivers, retention forecast, management recommendations.
3. **Role environments** — list of modeled roles with their environment fingerprints.
4. **Empty state for "Model a new role"** — the entry point into Step 1 of the product flow.

## Files

| File | Role |
|---|---|
| `index.html` | Loads React + Babel + the design tokens, mounts the dashboard, wires click-through routing. |
| `App.jsx` | Top-level state + view switching. |
| `Frame.jsx` | Persistent sidebar + top-bar shell. |
| `Atoms.jsx` | `Button`, `Eyebrow`, `Chip`, `KPI`, `Card`, `Input`, `Icon`. |
| `Candidates.jsx` | Candidate table view + row component. |
| `TATPlaybook.jsx` | Candidate detail view (P × E map, drivers, recs). |
| `Roles.jsx` | Modeled-role list. |
| `data.js` | Fake but plausible candidate / role data. |

## Caveat

These are recreation-style designs — the brief did not include a real product. Once a Figma or codebase exists, every screen here should be re-aligned to the real component anatomy before being trusted as a source.
