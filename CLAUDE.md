# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Approach

- Think before acting. Read existing files before writing code.
- Be concise in output but thorough in reasoning.
- Prefer editing over rewriting whole files.
- Do not re-read files you have already read unless the file may have changed.
- Test your code before declaring done.
- No sycophantic openers or closing fluff.
- Keep solutions simple and direct.
- User instructions always override this file.

## Project Overview

This is Jisun Lee (이지선)'s personal portfolio website — a single-page application with scroll-based animations. It is a **vanilla HTML/CSS/JS project** with no build framework. GSAP (GreenSock) is the primary animation engine.

## Running the Project

- Open with **VS Code Live Server** on port `5501` (configured in `.vscode/settings.json`)
- Or use any static HTTP server: `npx http-server .` or `python -m http.server`
- **Do not open `index.html` directly** as a file — scroll animations require an HTTP server

## SCSS Compilation

SCSS source files live in `assets/scss/`. The compiled output is `assets/css/style.css`. There is no build script — compile manually:

```bash
sass assets/scss/style.scss assets/css/style.css --watch
```

Edit SCSS source files, not the compiled `style.css` directly.

## Architecture

### Entry Point

`index.html` is the single HTML file. All JS modules are loaded at the bottom with `defer` in this order:

1. `assets/js/config.js` — GSAP plugin registration, global `CONFIG` object, responsive helpers (`remap()`, `clampVal()`)
2. `assets/js/scroll.js` — ScrollSmoother init, section navigation, `sectionMove()` for programmatic scrolling
3. `assets/js/logo.js` — Intro loader and SVG logo animation sequence
4. `assets/js/navigation.js` — Sidebar dot navigation, scroll-sync, `.is-diff` class toggling
5. `assets/js/skillCircle.js` — SVG stroke-dashoffset skill circle animations
6. `assets/js/publish.js` — Publishing section carousel
7. `assets/js/uxui.js` — UX/UI gallery auto-play
8. `assets/js/graphic.js` — 3D flip card animations
9. `assets/js/planning.js` — Expandable process cards, fullscreen toggle
10. `assets/js/quick.js` — Quick-access buttons (top, PDF, resume, GitHub)

### SCSS Structure

| File | Purpose |
|------|---------|
| `_variable.scss` | CSS custom properties, breakpoints (`$pc: 1400px`, `$tablet: 768px`, `$mobile: 360px`) |
| `_mixin.scss` | Reusable mixins: `glass`, `flex-center`, `absolute-center`, `hover-effect`, `clamp-calc()` |
| `_animation.scss` | Keyframe animation definitions |
| `_common.scss` | Global element styles |
| `_component.scss` | Section-specific component styles |
| `_font.scss` | Font-face imports |

### Key Design Patterns

- **Responsive sizing**: Use the `clamp-calc($min, $max, $vp-min, $vp-max)` SCSS function for fluid values instead of fixed px
- **Hover vs touch**: Use `@mixin hover-effect` — applies `:hover` on PC and `:active` on touch
- **Orientation handling**: Many sections behave differently in portrait vs landscape via `@mixin portrait` and GSAP `matchMedia()`
- **GSAP responsive**: Use `gsap.matchMedia()` with the `CONFIG.media` breakpoints defined in `config.js`
- **Global state**: Intro completion tracked via `window.isIntroDone`; manual scroll override via `isManualMove` flag in `scroll.js`

### Page Sections

| Section ID | JS file | Description |
|------------|---------|-------------|
| `#intro` | `logo.js` | Animated SVG logo intro with loader |
| `#profile` | `skillCircle.js` | About info + animated skill circles |
| `#publishing` | `publish.js` | Work carousel with background image switching |
| `#uxui` | `uxui.js` | Design gallery with auto-play |
| `#graphic` | `graphic.js` | 3D flip card grid |
| `#planning` | `planning.js` | Expandable process cards |

Navigation dots are in `.navigation` sidebar; `data-full-move="true"` marks sections for full-section scroll snapping.

### Design Tokens

- Accent color: `--point-color: rgb(242, 120, 75)` (orange)
- Korean heading font: `YUniverse-B`
- Korean body font: `SUIT` / `SUITE`
- English accent font: `Raleway`
- All GSAP plugins (ScrollTrigger, ScrollSmoother, SplitText, Observer) are loaded via CDN and registered in `config.js`
