# Eventology — the full picture

The live site's content (MainRepo) mapped onto the new Fuel-derived design grammar.
Nothing here is invented: every row on the left already exists on eventology.sa today.

## Entry

```
(01) Language   English / العربية
(02) Visitor    Corporate / Private
                → opens the matching version
```

Built, in `entry-gates/`. The two versions carry **different content** — not yet defined.

## Homepage

| # | Live site today (MainRepo) | Becomes, in the new grammar | Why it fits |
|---|---|---|---|
| — | Hero: eyebrow, headline, body, 2 CTAs, scroll cue | **Hero** — the mark, then `Eventology` revealed on first scroll | The mark is the thesis; the wordmark lands as a second beat |
| — | Marquee: 7 event types, scrolling | **Strip** — same marquee, hairline-bounded | Fuel uses a flat client/logo strip in exactly this slot |
| 01 | Services: "What We Handle" (6) | **(01) Services** — "Our Services", numbered list `01`–`06` | Lead with what you do |
| 02 | Work: "Selected Events" | **(02) Work** — portfolio plates | Proof, right after the services claim |
| 03 | Principles: Vision · Mission · Goal (3) | **(03) Principles** — oversized numerals `01 02 03` | Fuel's numeral treatment is built for a 3-beat list |
| 04 | Who We Are: 4 chapters | **(04) About** — big statement type + 4 chapters | Fuel's full-bleed statement section |
| 05 | Contact: WhatsApp + Email | **(05) Contact** — text + `↗` + rule | Fuel never uses filled buttons |
| — | Footer: navigate, contact, motto | **Footer** — same, on the hairline grammar | unchanged |

Page order set 2026-08-05: Services → Work → Principles → About → Contact — services and
proof-of-work lead, trust-building material (principles, who-we-are) follows, before the ask.

Every section opens with the Fuel header row: `▪ (0N)` · `(Name)` · `© 2026` over a hairline,
and sections alternate dark/white full-bleed with the diagonal cut between them.

**Scroll movement (2026-08-05):** the `.rv` reveal (rise + fade) still fires once per element
on first entry. Layered on top, two elements stay **continuously** tied to scroll position the
whole time they're on screen, rather than arriving and going still — the oversized numerals in
Principles/About drift vertically as they cross the viewport, and each Work plate's art layer
parallaxes inside its own clipped frame. This is what actually matches Fuel; the one-shot
reveal alone reads as "stable" by comparison.

## Other routes

| Live today | Becomes |
|---|---|
| `/tickets` — 2 tiers (General SAR 250, VIP SAR 750) | Fuel's pricing cards: flat, sharp, `+` bullets, oversized numeral price |
| `/payment` — private reference page | unchanged, stays out of nav |

## Navigation

Live nav is `Who We Are · Services · Work · Contact · Tickets`. In the new grammar each link
carries a superscript index (`Who We Are ⁰¹`), matching Fuel and the footer nav.

## Open questions

1. **Corporate vs Private content.** The gate splits the audience but the two versions are
   undefined. Which of the eight rows above differ — all of them, or only Services / Work /
   Tickets?
2. **Principles vs About.** Both are "who we are" material. They stay separate above; they
   could merge into one `(01)` if that reads tighter.
3. **Language/type switcher** goes in the corner slider once this exists.

## Scroll behaviour (new)

```
load          mark only, centred
first scroll  "Eventology" fades up beneath the mark
scroll on     homepage begins — sections reveal as they enter
```

Section reveals follow the Fuel reference: content rises and fades in on entry, staggered,
never on a loop — driven by scroll position, not time.
