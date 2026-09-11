# ⚡ Manas Bandhu — Personal Portfolio 2.0

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modern_Aesthetics-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A high-impact cinematic portfolio and interactive web experience showcasing video editing, motion design, and software engineering.**

[🌐 Live Demo](https://manas-bandhu.vercel.app) • [🎬 YouTube Channel](https://www.youtube.com/@cnomo_editz) • [💼 LinkedIn](https://linkedin.com/in/manasbandhu) • [🐦 X / Twitter](https://x.com/manas_1303x)

</div>

---

## 📖 Overview

This is **Portfolio 2.0** for **Manas Bandhu** — Video Editor, Motion Designer, and Full-Stack Web Developer. Designed with an editorial cyberpunk and high-contrast dark aesthetic, this project blends cinematic storytelling, fluid physics-based micro-interactions, and modern web technologies to deliver an unforgettable digital presence.

---

## ✨ Key Highlights & Features

### 🎬 Cinematic Intro & Atmosphere
- **Cinematic Entrance**: Immersive title card animation with dynamic audio synthesizer and sound design.
- **Audio Ambience Toggle**: Optional ambient audio backdrop with sound effects for interactive elements.
- **Custom Cursor & Fluid Physics**: Proximity magnetic pull, smooth trail effects, and velocity-responsive element stretching.

### 🎨 Editorial Cyberpunk Design System
- **Curated Palette**: Deep navy `#001621`, accent solar orange `#ff3b00`, cyber amber `#ff8800`, and luxury gold `#d4af37`.
- **Dynamic Theme Engine**: Toggleable editorial themes with smooth CSS variable transitions.
- **Velocity Stretch**: Scroll velocity detection that dynamically scales and stretches typography for an editorial feel.

### 💼 Showcases & Sections
- **Hero Showcase**: Magnetic typography with interactive proximity text tracking.
- **Who I Am**: Personal story, creative vision, and design philosophies.
- **Selected Works**: Featured software projects including:
  - 🤖 **Rasmalai Windows Assistant** — AI-powered desktop voice & task assistant.
  - 💊 **DrugDex** — Modern pharmaceutical lookup and drug information web app.
  - 🌐 **Personal Web Experiences** — High-performance experimental portfolios.
- **What I Do**: Full breakdown of creative direction, motion graphics, DaVinci Resolve/After Effects editing, and frontend engineering.
- **Creative Lab / Experiments**: Interactive web experiments, glitch effects, soundboard, and canvas animations.
- **Gaming & Media**: Highlights, stats, and gaming community links.
- **Direct Engagement**: Floating "Buy Me A Coffee" modal and streamlined contact initiation.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 19, JavaScript (ESNext)
- **Bundler & Tooling**: Vite 8, Oxlint
- **Styling**: Vanilla Modern CSS (CSS custom properties, clamp typography, fluid grid layouts)
- **Audio & Interactions**: Web Audio API, Custom Physics Hooks (`useScrollVelocity`, `useMagnetic`, `useProximity`)
- **API Integration**: YouTube Data API v3 (for channel videos & subscriber highlights)

---

## 📁 Project Structure

```bash
portfolio-app/
├── public/              # Static assets & icons
├── src/
│   ├── assets/          # Media, video reels, imagery
│   ├── components/      # Modular UI components
│   │   ├── CinematicIntro.jsx  # Opening cinematic experience
│   │   ├── CustomCursor.jsx    # Physics-based interactive cursor
│   │   ├── Hero.jsx            # Dynamic magnetic hero section
│   │   ├── WhoIAm.jsx          # About & background section
│   │   ├── SelectedWork.jsx    # Project showcase
│   │   ├── WhatIDo.jsx         # Services & skills breakdown
│   │   ├── Experiments.jsx     # Creative playground & lab
│   │   ├── BuyMeCoffee.jsx     # Support modal
│   │   ├── FinalCTA.jsx        # Contact & socials
│   │   └── Footer.jsx          # Site footer & copyright
│   ├── hooks/           # Custom React hooks (scroll velocity, etc.)
│   ├── App.css          # Core design system & component styles
│   ├── App.jsx          # Application entry shell
│   ├── index.css        # Global CSS resets & root variables
│   ├── main.jsx         # React DOM mount point
│   └── site.js          # Navigation configuration & theme palette
├── .env.example         # Example environment configuration
├── package.json         # Dependencies & build scripts
└── vite.config.js       # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm, pnpm, or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Manas96-afk/manas-personal-website.git
   cd portfolio-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   Copy `.env.example` to `.env` and insert your YouTube API key if utilizing live channel stats:
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📬 Connect & Collaborate

- **Creator**: Manas Bandhu
- **Email**: [mgamer6900@gmail.com](mailto:mgamer6900@gmail.com)
- **GitHub**: [@Manas96-afk](https://github.com/Manas96-afk)
- **YouTube**: [@cnomo_editz](https://www.youtube.com/@cnomo_editz)
- **LinkedIn**: [Manas Bandhu](https://linkedin.com/in/manasbandhu)
- **X (Twitter)**: [@manas_1303x](https://x.com/manas_1303x)
- **Instagram**: [@cnomo_editz](https://www.instagram.com/cnomo_editz/)

---

<div align="center">
  <sub>Designed & Developed with ❤️ by Manas Bandhu. All rights reserved.</sub>
</div>
