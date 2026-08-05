# MAIN HERO

The approved hero direction for Eventology. **This folder is self-contained. Do not mix it
with any earlier hero experiments.**

## Files

| File | What it is |
|---|---|
| `main-hero.html` | The page. Fully self-contained — open it directly in a browser, no server or network needed. |
| `lens-map.png` | The lens displacement map, embedded in the HTML already. Kept here only so the lens can be regenerated or reshaped later. |

## What it is

The web sample built from the Framer **"Fuel"** extraction — chrome mark hero on near-black
with ember/azure glows, then sections (01) About · (02) Services · (03) Stats · (04) Portfolio
— plus a **thick glass lens that trails the cursor across the mark**.

## How the lens behaves

- **Local.** A pre-rendered lens map sits on a neutral-grey field, so displacement is
  mathematically zero anywhere the lens is not. The rest of the hero cannot move.
- **Still at rest.** Nothing happens until the cursor approaches the mark. It fades in over
  ~150px of proximity and fades back out on leave.
- **Thick.** The lens trails the cursor on a first-order lag — roughly 1.2s to catch up, with
  **zero overshoot** (measured). A spring was tried first and rejected: it reached the target
  in 130ms then bounced ±50px, which reads as rubber rather than fluid.

## Tuning

Three values near the bottom of `main-hero.html`:

```
LAG   0.065   viscosity — LOWER is thicker / slower
MAX   56      strength of the bulge
SIZE  330     lens diameter in px
```

## Constraint that must not be broken

The filter lives on `.rig` (the mark), giving a filter surface of about **1216 × 1480** device
pixels. It must **not** be moved onto the full hero or the viewport: at 1440×900 with dpr 2 a
full-viewport filter region works out to **4608 × 2880 px (13.3 MP)**, which exceeds the
~4096px filter-surface limit — browsers then silently drop the filter and the effect simply
stops rendering. That failure is invisible in code and easy to misread as "fixed".

Consequence: the lens refracts the mark only, not the surrounding glow. The glow is a soft
gradient with no detail, so there is nothing there to refract. Covering the whole hero would
require rebuilding it in WebGL.

## Still deliberately unfinished

Palette and real content/photography are placeholders by instruction. Icons remain
customizable. Type is a system grotesk stack, not a licensed face.
