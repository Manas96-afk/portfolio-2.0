# Manas Bandhu — Interactive 3D Portfolio

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/R3F-3D-88CAFF?style=for-the-badge&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-Animation-88CE02?style=for-the-badge&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logoColor=white)

**An immersive, hand-drawn 3D portfolio — an infinite paper-sketch corridor with doors that open into interactive rooms.**

[demo] Live Demo • [youtube] YouTube (@cnomo_editz) • [github] GitHub (Manas96-afk)

</div>

---

## Overview

This is the **interactive 3D portfolio** of **Manas Bandhu** (@cnomo_editz) — Video Editor, Motion Designer, and Web Developer based in Jaipur, India.

Instead of a flat scrolling page, the site is a **walk through a hand-drawn world**: an infinite corridor lined with sketch doors, each opening into a full 3D room. Built entirely with **React Three Fiber** and **Three.js**, with **GSAP** driving the transitions.

---

## The Experience

**The Corridor** — An infinite, procedurally-looping corridor with sawtooth walls, doodle decorations, a waving avatar, and your name drawn in sketch lettering that splits apart as you approach.

**Four Doors, One Corridor** — `/`, `/gallery`, `/workshop`, `/edited-videos`, `/contact`

| Door | Room | What's inside |
|------|------|---------------|
| **The Gallery** | Clothesline | Selected projects hanging as paper cards that flip — a black-and-white sketch reveals full colour on hover. |
| **Edited Videos** | Monitor tower | A falling tower of monitors showing video edits — click one to inspect it. |
| **The Workshop** | Sky flight | Infinite clouds, your story in milestones, awards, education, and skill balloons you can pop. |
| **Let's Connect** | Seaside | A dock with a lighthouse, a sailing ship, and floating barrels for each social link. |

---

## Key Features

- **Zero-light sketch world** — Every surface is a hand-drawn texture on unlit material, sitting in paper-white fog so distance dissolves into nothing.
- **Paper-tear loading & teleport** — A jagged torn-paper animation doubles as the preloader and the room-to-room transition curtain.
- **Sketch → colour reveal** — Custom brush-stroke shaders wipe cards, doors, and frames from black-and-white to full colour on hover.
- **Map teleport** — Drop down a hand-drawn map, hover a zone to paint it in colour, and place a pin to jump straight to a room.
- **Virtual routing** — Each room has its own URL (`/gallery`, `/workshop`, `/edited-videos`, `/contact`) with dynamic meta tags, full history support, and deep-linking (`/studio` still works as a legacy path).
- **Performance tiers** — Automatic HIGH/MEDIUM/LOW quality with a live FPS monitor, mobile-aware texture preloading, and DPR capping.
- **Accessibility** — Screen-reader navigation overlay, focus traps, keyboard support, and a semantic SEO content block for crawlers.

---

## Tech Stack

- **React 19** + **Vite 7**
- **Three.js** / **React Three Fiber** / **@react-three/drei**
- **GSAP** (timelines, Observer) for transitions
- **Sass** design system
- **Vite SEO plugin** — generates JSON-LD structured data and `llms.txt` at build time from local content

---

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview the build
npm run lint     # eslint
```

---

## Editing Content

All portfolio content lives in a single file:

```
src/data/content.js
```

There — you can update:

- `PERSONAL` — name, tagline, email, motto
- `GALLERY_PROJECTS` — the projects in the Gallery room
- `STUDIO_CONTENT` — the video/monitor items in the Edited Videos room
- `AWARDS` — milestones, education, and skills (The Workshop windows)
- `SOCIALS` — social links

No CMS or network calls required — content is bundled at build time.

---

## Regenerating Textures

The Gallery cards and Studio monitor screens are generated from your screenshots:

```bash
npm run gen:textures
```

This reads images from `public/projects/` and `public/what/`, and writes matching black-and-white (`.webp`) and colour (`_painted.webp`) variants. See `scripts/gen-textures.mjs`.

---

## Project Structure

```
src/
├── components/
│   ├── canvas/          # 3D world
│   │   ├── corridor/    # infinite corridor, doors, hero text, avatar
│   │   ├── entrance/    # front doors
│   │   ├── rooms/       # Workshop (About), Gallery/Reel, Studio, Contact
│   │   └── shaders/     # reveal/paint materials
│   ├── dom/             # Preloader, PaperTransition
│   └── ui/              # NavigationUI, GlobalOverlay, a11y overlay
├── context/             # Scene, Audio, Performance, Achievements
├── data/content.js      # ← all portfolio content
├── hooks/               # camera, document meta, data loading
├── config/              # texture preload lists
└── styles/              # SCSS design system
```

---

## License

MIT
