# Eventology — liquid design

Backup and version history for the Eventology design work. **Private.**
This is not the live site — that is [`MainRepo`](https://github.com/eventology03/MainRepo),
which serves eventology.sa.

Every page here is a **single self-contained HTML file**: fonts, mark masks and the lens map
are all embedded. Download one and open it — no server, no build, no network.

## What is here

| Folder | What it is |
|---|---|
| **`full-design/`** | **The live one.** Entry gate → staged hero → homepage. This is the file to open. |
| `main-hero/` | The approved chrome-mark hero with the glass lens. Frozen reference. |
| `entry-gates/` | Language and visitor-type screens, standalone. Frozen reference. |
| `_build/` | Fonts, mark masks, lens map, build + snapshot scripts. **The design cannot be rebuilt without these.** |
| `safari-check.html` | Browser capability test — open in Safari to see which effects render. |

`STRUCTURE.md` maps the live site's content onto the new design grammar.
`PROTECTING-THE-WORK.md` covers how this is kept safe and the rules the work follows.

## Working on it

Only `full-design/full-design.template.html` is edited by hand. Never edit a built `.html` —
the next build discards it.

```bash
cd full-design && node build.mjs     # fills the __TOKENS__, writes both outputs
```

Two outputs, deliberately:

- `full-design.html` — standalone, **has a doctype**, for opening directly
- the artifact copy — bare page content, no doctype, because the artifact wrapper supplies one

A file saved to disk without a doctype opens in quirks mode, where `position:sticky` and
percentage heights change behaviour and Safari and Chrome diverge. That was a real bug here.

## Two traps

**`.g-plate`, never `.plate`, for the gate buttons.** The Work section already owns `.plate`.
When the gate was merged in, the later Work rules won and the gate's plate collapsed to 0×0 —
the buttons went dead while still looking correctly wired.

**The lens filter belongs on `.rig`**, never the hero or the viewport. A filter region larger
than the browser's surface limit is *silently dropped*, which looks like nothing happening.

## Not in this repo

- **The Fuel reference videos** (249 MB and 326 MB) — over GitHub's 100 MB file limit. They
  are in `~/Documents/`. Ask if you want them added via Git LFS or as a compressed clip.
- `framer site.zip`, `MainRepo-main`, `archive.tar` — unrelated archives, excluded by
  `.gitignore` to keep the repo small.
- `snapshots/` — local read-only copies. Git is the real history; committing them would
  duplicate everything on every take.

## Still open

- Corporate vs Private carry **different content** — not yet defined. Only difference so far:
  corporate drops the hero background glows.
- Arabic is recorded at the gate but the site is not mirrored yet; the content does not exist.
- `/tickets` and `/payment` not yet rebuilt in this grammar.
