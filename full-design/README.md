# FULL DESIGN

The homepage: staged hero, then the live site's content in the Fuel grammar.
Separate folder — does not replace `main-hero/` or `entry-gates/`.

## Files

| File | What it is |
|---|---|
| `full-design.html` | Standalone page — **has a doctype**, open it directly in any browser. |
| `full-design.template.html` | Token version (`__FRAUNCES__`, `__MASKFILL__`, `__LENS__`, …) for rebuilding. |
| `lens-map.png` | Lens displacement map for the gate buttons, already embedded. |

## The entry gate

The gate from `entry-gates/` is now **built into this page** as a fixed overlay above the
site, rather than a separate file that navigates away.

```
(01) Language  English / العربية
(02) Visitor   Corporate / Private
               → the overlay fades and is REMOVED from the DOM; the site is already
                 underneath, sitting at scroll 0 with the hero at its start state
```

While the gate is up, `body[data-gate="open"]` locks scrolling and hides the site nav.
The choice is stored in `localStorage["eventology.entry"]`, so it appears once on the first
visit. Append **`?reset`** to the URL to see it again.

**The Arabic choice is recorded but the layout is not mirrored yet.** The page below is the
English version; mirroring English copy would look broken. Set `dir="rtl"` at the marked spot
in the gate script once the Arabic content exists.

The gate buttons carry the liquid lens — each holds a `.plate` (tinted gradient with fine
diagonal streaks) and **the lens filters the plate, not the button**; the label sits above it
unfiltered. Strip the plate's texture and the effect disappears, because a displacement lens
can only bend detail that is already there.

## The corner menu

The nav links are no longer inline. A **Menu** button sits in the top corner; opening it
slides a panel in from the edge:

```
Who We Are  01
Services    02
Work        03
Contact     04
────────────────
Preferences 05   ← Language & visitor type
```

**Preferences** clears the stored choice, resets the gate to screen 01, scrolls to the top and
reopens the gate — back to the very beginning. That is why the gate is now **hidden rather
than removed** from the DOM when it closes: Preferences reopens that same element.

All labels carry Arabic, applied automatically from the language choice:

| | en | ar |
|---|---|---|
| | Who We Are | من نحن |
| | Services | الخدمات |
| | Work | أعمالنا |
| | Contact | تواصل معنا |
| | **Preferences** | **التفضيلات** |
| | Language & visitor type | اللغة ونوع الزائر |
| | Menu / Close | القائمة / إغلاق |

`data-k` sits on an **inner span**, never on the link itself — putting it on the `<a>` made
`textContent` wipe the `<sup>` index.

Esc closes the menu, so does clicking the backdrop or any link.

## The staged hero

A 320vh runway with the hero `position:sticky` inside it. Scroll progress drives everything;
nothing is on a timer.

| progress | what happens |
|---|---|
| 0 | mark only, centred, scroll cue showing |
| 0 → 0.34 | **`Eventology` rises and fades in beneath the mark**; the mark drifts up 34px to make room; cue fades out |
| 0.55 → 1 | the whole hero recedes and fades; the homepage takes over |

Verified at 0 / 0.34 / 0.6 / 0.78 / 1.

## Section reveals

Content rises 26px and fades in as it enters the viewport, staggered 80ms in groups of four,
fired once by `IntersectionObserver` and then unobserved. Scroll-driven, never looping —
matching the Fuel reference.

## Structure

Follows `../STRUCTURE.md`: strip → (01) Principles → (02) About → (03) Services →
(04) Work → (05) Contact → footer. Every section carries the Fuel header row
`▪ (0N) · (Name) · © 2026` over a hairline, alternating dark/white full-bleed with the
diagonal cut between them. All copy is the real content from the live site.

## Two fixes that came out of the Safari investigation

**1. Doctype.** Every file previously saved to disk lacked `<!doctype html>`, because they
were written as Artifact *page content* (the Artifact wrapper supplies the doctype) and then
copied to disk as-is. Opening them directly put the browser in **quirks mode**, where
`position:sticky`, percentage heights and containing blocks all behave differently — and
where Chrome and Safari diverge most. `main-hero`, `entry-gates`, `liquid-hero-concept` and
`safari-check` have all been wrapped. **Anything saved for direct opening needs the doctype;
the artifact copy must not have one.**

**2. No `overflow-x` on `<body>`.** It makes body the scroll container, which is a known
`position:sticky` / `position:fixed` hazard in WebKit. The marquee is clipped by `.strip`
instead.

The scroll handler also runs **directly** rather than through `requestAnimationFrame`. An
rAF-coalesced handler stalls permanently if rAF is ever throttled, which freezes the hero.

## The liquid lens

**On the hero mark**, using main-hero's approved constants — `SIZE 330`, `MAX 56`,
`REACH 150`, `LAG 0.065` (viscosity; lower is thicker), `EASE 0.07`. It trails the cursor on a
first-order lag with zero overshoot, fades in over 150px of proximity, and detaches completely
when settled so there is no cost at rest.

**On the gate buttons**, at `SIZE 230 / MAX 46`, filtering each button's **`.g-plate`**.

> **Why `.g-plate` and not `.plate`.** The Work section already owns `.plate` (the portfolio
> cards). When the gate was merged into this page the two collided, and because the Work
> rules come later they won — the gate's plate became `position:relative` with
> `aspect-ratio:4/3` and collapsed to **0×0**. Nothing to refract, so the gate buttons went
> dead while still *looking* wired up. Do not rename it back.

Both share one `#lensFilter`; they never run at once, and the hero checks
`body[data-gate="open"]` before touching it. Each sets the `feImage` width/height itself,
since they use different lens diameters.

> **The filter must stay on `.rig`** (a ~320px box). On the hero or the viewport the filter
> region exceeds the browser's filter-surface limit and the effect is **silently dropped** —
> a failure that looks like nothing happening.

## Corporate vs Private — what differs so far

The chosen type is written to `<html data-type="corporate|private">` — set when the gate
closes, restored from storage on a remembered visit, and cleared when Preferences reopens the
gate.

| | Corporate | Private |
|---|---|---|
| Hero background glows | **removed** | ember + azure, breathing |

Scoped `:root[data-type="corporate"] .stage-fix .glow{display:none}` — deliberately limited to
`.stage-fix` so the **gate keeps its own glows**, since the visitor type is not known while
the gate is still up. The mark's own `.tint` layer is untouched; it is part of the mark, not
the background.

Everything else is still identical between the two. The real content split is undefined.

## Building

`python3` on this machine is blocked behind an Xcode licence prompt, so the build is Node:

```
node build.mjs      # fills the __TOKENS__, writes site.html + site-standalone.html
```

## Not done
- Arabic/RTL not wired into this page yet (the gates handle language; this is the EN version).
- Corporate vs Private content still undefined.
- `/tickets` and `/payment` not yet rebuilt in this grammar.
