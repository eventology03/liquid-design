# ENTRY GATES

The two screens a visitor sees when the site is first opened: **language**, then **visitor
type**. Separate from `main-hero/` — do not merge them.

## Files

| File | What it is |
|---|---|
| `entry-gates.html` | The screens. Self-contained — open directly, no server needed. Pure ASCII, so it renders correctly regardless of server charset. |
| `entry-gates.template.html` | Same file with `__FRAUNCES__` / `__INTER__` / `__KUFI__` / `__LENS__` tokens, for rebuilding. |
| `fonts/*.woff2` | The three subsetted faces, already embedded in the HTML. Kept for reuse elsewhere. |
| `lens-map.png` | The lens displacement map, shared with `main-hero`. |

## Flow

```
(01) Language  →  English / العربية
(02) Visitor   →  Corporate / Private     (in the chosen language, RTL for Arabic)
               →  goes straight to the matching version — no confirmation screen
```

Wire the real destinations in one place, at the top of the script:

```js
var DESTINATIONS = {
  "en|corporate": null,   // ← put the real URL here
  "en|private"  : null,
  "ar|corporate": null,
  "ar|private"  : null
};
```

While these are `null` the gate simply lifts away over the stage, which is what a mounted
site would look like underneath.

## What is deliberately on screen

**Only the logo in the corner and the two options.** No headline, no description, no step
markers, no footer, no confirmation screen. In Arabic the shell mirrors (`dir="rtl"`) and the
logo moves to the top-left.

The choice is stored in `localStorage["eventology.entry"]`, so the gates appear **once on the
first visit**. There is **no on-screen control to change it yet** — that moves into the corner
slider once the full design exists. To reopen the gates meanwhile, append **`?reset`** to the
URL.

## Design

The stage is the **approved hero atmosphere**, unchanged: `--stage-0 #07070a` ground, ember
`#ff5a2e` glow left, azure `#1fb8c4` glow right, both breathing, plus grain and vignette.
The mark shape and the hero's full-surface liquid are **not** reused — only the colour world.

> A flat single-colour background (`#4C8B9B`) was tried once and reverted at the user's
> request. Do not reintroduce it.

**The liquid lives on the options.** Hovering attaches the same glass lens used in
`main-hero`: it trails the cursor on a first-order lag and detaches once settled, so there is
no cost at rest.

> **Why each button contains a `.plate`.** A displacement lens can only bend what is already
> there. The first attempt filtered the whole button, which was a transparent panel with a
> hairline border and a text label — so the only thing that distorted was the type, and it
> just looked like shredded letterforms, not liquid. Each button now holds a `.plate`: a
> tinted gradient with fine diagonal streaks. **The lens filters the plate; the label sits
> above it, unfiltered and crisp.** Remove the plate's texture and the effect disappears
> again.

## Type

| Role | Face |
|---|---|
| The option labels (display) | **Fraunces** 300 |
| Logo, UI | **Inter Tight** |
| All Arabic | **Noto Kufi Arabic** 500 |

Variable fonts, subsetted to the glyphs actually used — 80 KB for all three instead of 505 KB.

## Tunables

```
SIZE  210    lens diameter, px
MAX   34     refraction strength
LAG   0.075  viscosity — LOWER is thicker / slower
EASE  0.10   fade in / out speed
```

## Not settled

Corporate and Private are meant to carry genuinely different content, which has not been
defined yet.
