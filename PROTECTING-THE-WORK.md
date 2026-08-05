# Protecting the design from damage or rewriting

**Live design lab:** https://eventology03.github.io/liquid-design/
Unlisted (noindex, robots disallow) but publicly reachable. Not the live site.

Written 2026-08-05, after a session in which files were lost to a temp-folder wipe, the design
drifted between versions, and two effects broke silently.

## What has actually gone wrong so far

Worth naming, because the protections follow from it.

| What happened | Cause |
|---|---|
| `web-sample.html` and the copied reference video disappeared | They lived in `/private/tmp`, which the system clears. Only files under `~/Documents` survived. |
| Spacing, hairlines and weights drifted between versions | Each new surface was authored as a **new file** that re-declared its own tokens, instead of extending the existing one. |
| The gate buttons went dead | A CSS class collision (`.plate`) when two surfaces merged. Looked correctly wired; rendered as 0×0. |
| The hero broke in Safari but not Chrome | Files saved to disk had no `<!doctype html>`, so they opened in quirks mode. |
| The glass lens only ever worked in the Claude preview pane | The SVG `feImage` displacement filter is unreliable outside Chromium: confirmed on-device 2026-08-05 that it either produced zero visible effect or dropped the element completely, depending on the exact filter. First fix attempt (a CSS-transform magnifier) was correctly rejected — it zoomed, it didn't liquefy. Real fix: `feTurbulence` generates its displacement map procedurally, with no external image reference at all, and genuinely warps content into organic shapes — verified with screenshots in real Safari, both on the hero mark and a gate button. `__evtMakeLoupe` in `full-design.template.html`. |
| Older artifact versions are gone | Every publish overwrote the same artifact URL. |

**The largest single source of damage was me rewriting things, not accidents.** Tooling helps,
but the rules matter more.

## The protections, in order of value

### 1. Version control — active

A **local** git repository now covers every authored file. To be explicit: **no remote is
configured, so nothing can be pushed anywhere.** It is an undo history on this machine.

```bash
git status                  # what changed since the last save point
git diff                    # exactly what changed, line by line
git add -A && git commit -m "why"     # new save point
git checkout -- <file>      # throw away changes to one file
git log --oneline           # every save point
```

Verified working: truncating `full-design.html` to 5 bytes and running
`git checkout -- full-design/full-design.html` restored all 417,765 bytes intact.

Commits use the GitHub noreply address rather than the real one, so if this repo is ever
given a remote the email is not exposed.

### 2. Snapshots — working today, as the interim

```bash
node _build/snapshot.mjs "what changed"
```

Copies the whole design into `snapshots/<timestamp>__<label>/`, sets every file
**read-only**, and writes a `MANIFEST.json` with a SHA-256 of each file. Verified: writing to
a snapshot is refused by the filesystem.

Take one before any significant change, and after anything you approve.

### 3. Freeze what is approved

`main-hero/` and `entry-gates/` are **finished references**. New work
goes in a new folder; approved folders are not edited. This is already how the work is
organised — keep it that way.

### 4. One source file per surface

`full-design/full-design.template.html` is the only file edited by hand. `build.mjs` produces
the two outputs from it. Never hand-edit a built `.html` — the next build silently discards it.

### 5. Everything lives under `~/Documents`

Never leave anything only in a scratch or temp directory. `_build/` holds the fonts, masks,
lens and build scripts that the design cannot be rebuilt without.

### 6. Distinct artifact URLs for milestones

Republishing overwrites. Approved milestones should get their own URL so they stay reachable.

## Rules I am holding myself to

1. **Extend the existing file. Never re-author a surface from scratch.**
2. **Never re-type a token value.** Copy the `:root` block verbatim.
3. **Fixing a bug is not permission to restyle** anything near it.
4. **Verify that it renders, not that it is wired.** Both silent breakages this session passed
   a wiring check and failed on screen. Pin the effect statically and look at it.
5. **Propose design changes in words first** rather than shipping them inside an unrelated fix.

## Still to do

- **Delete the temporary working files** once the full design is settled — everything needed
  has been copied into `_build/`. The scratch directory is
  `/private/tmp/claude-501/.../scratchpad`. Nothing there is unique any more.
