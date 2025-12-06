# AdobeKeys

<div align="center">

> **Master Your Workflow.**
> A minimalistic, fast, and beautiful reference guide for Adobe software keyboard shortcuts.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue.js](https://img.shields.io/badge/vue.js-v3.5-42b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-v5.9-3178c6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

[Live Demo](https://adobekeys.xssr.org) · [Report Bug](https://github.com/your-username/AdobeKeys/issues) · [Request Feature](https://github.com/your-username/AdobeKeys/issues)

</div>

---

## Overview

AdobeKeys is a modern web application designed to help designers, editors, and creators quickly find keyboard shortcuts for popular Adobe Creative Cloud software.

It features a clean, distraction-free interface with support for dark mode, multi-language switching, and dual-system (Windows/macOS) key mappings.

<!--
Add your own screenshots here:
![AdobeKeys Screenshot](./screenshots/home.png)
![Dark Mode](./screenshots/dark-mode.png)
-->

## Supported Applications

| Application | Shortcuts | Description |
|:------------|:---------:|:------------|
| <img src="https://img.shields.io/badge/Ps-31A8FF?style=flat-square&logo=adobe-photoshop&logoColor=001E36" alt="Photoshop"/> **Photoshop** | 173 | Image Editing & Composition |
| <img src="https://img.shields.io/badge/Ai-FF9A00?style=flat-square&logo=adobe-illustrator&logoColor=330000" alt="Illustrator"/> **Illustrator** | 172 | Vector Graphics & Illustration |
| <img src="https://img.shields.io/badge/Ae-9999FF?style=flat-square&logo=adobe-after-effects&logoColor=00005B" alt="After Effects"/> **After Effects** | 165 | Motion Graphics & Visual Effects |
| <img src="https://img.shields.io/badge/Pr-9999FF?style=flat-square&logo=adobe-premiere-pro&logoColor=00005B" alt="Premiere Pro"/> **Premiere Pro** | 141 | Video Editing & Production |
| <img src="https://img.shields.io/badge/Lr-31A8FF?style=flat-square&logo=adobe-lightroom&logoColor=001D26" alt="Lightroom"/> **Lightroom** | 138 | Photo Management & Editing |
| <img src="https://img.shields.io/badge/Au-00E4BB?style=flat-square&logo=adobe-audition&logoColor=00393B" alt="Audition"/> **Audition** | 125 | Audio Recording & Mixing |

> **Total: 914 keyboard shortcuts** across 6 Adobe applications

## Key Features

| Feature | Description |
|:--------|:------------|
| **Minimalist Design** | Clean UI with Adobe-style branding icons and smooth animations |
| **OS Detection** | Auto-detects your OS and shows correct modifier keys (`Ctrl`/`Cmd`, `Alt`/`Opt`) |
| **Favorites System** | Star shortcuts to pin them at the top of the list |
| **Dark & Light Mode** | Syncs with system preference or toggle manually |
| **Multi-language** | English and Chinese (简体中文) support |
| **Real-time Search** | Filter by key, description, or category (`Ctrl+K` / `Cmd+K`) |
| **Flexible Layouts** | Switch between Grid View (Cards) and List View |
| **Floating TOC** | Quick navigation through categories |
| **URL Anchors** | Share direct links to specific categories |
| **Responsive** | Optimized for desktop, tablet, and mobile |

## Tech Stack

| Category | Technology |
|:---------|:-----------|
| Framework | [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) |
| Build Tool | [Vite](https://vitejs.dev/) with [Rolldown](https://rolldown.rs/) |
| Language | [TypeScript](https://www.typescriptlang.org/) 5.9 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 3.4 |
| Icons | [Lucide Vue Next](https://lucide.dev/) |
| Routing | [Vue Router](https://router.vuejs.org/) 4 |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/AdobeKeys.git
cd AdobeKeys

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build    # Build to dist/
npm run preview  # Preview production build
```

## Project Structure

```
AdobeKeys/
├── public/              # Static assets (favicon)
├── src/
│   ├── components/      # Shared Vue components (Header)
│   ├── composables/     # Composition API logic
│   │   ├── useFavorites.ts  # Favorites management
│   │   ├── useLocale.ts     # i18n support
│   │   └── useOS.ts         # OS detection & key formatting
│   ├── data/            # JSON files containing shortcut data
│   │   ├── ps.json      # Photoshop (173 shortcuts)
│   │   ├── ai.json      # Illustrator (172 shortcuts)
│   │   ├── ae.json      # After Effects (165 shortcuts)
│   │   ├── pr.json      # Premiere Pro (141 shortcuts)
│   │   ├── lr.json      # Lightroom (138 shortcuts)
│   │   └── au.json      # Audition (125 shortcuts)
│   ├── router/          # Routing configuration
│   ├── views/           # Page views
│   │   ├── HomeView.vue     # Application selection
│   │   └── ShortcutView.vue # Shortcut list with search
│   ├── types.ts         # TypeScript type definitions
│   ├── App.vue          # Main layout
│   ├── style.css        # Global styles
│   └── main.ts          # Entry point
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Contributing

Contributions are welcome! Here's how you can help:

### Adding Shortcuts

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/add-shortcuts`
3. Edit data files in `src/data/`:

```json
{
  "key": "Ctrl + Shift + S",
  "description": {
    "en": "Save As",
    "zh": "另存为"
  },
  "category": {
    "en": "File",
    "zh": "文件"
  }
}
```

> **Special keys**: Use placeholders for keys that conflict with the separator:
> - `{{PLUS}}` for literal `+` key
> - `{{MINUS}}` for literal `-` key
> - `{{TILDE}}` for literal `~` key

4. Commit and push: `git commit -m 'Add Photoshop shortcuts'`
5. Open a Pull Request

## FAQ

<details>
<summary><strong>How do I switch between Windows and macOS shortcuts?</strong></summary>

Click the OS toggle button in the header. The app also auto-detects your operating system on first visit.
</details>

<details>
<summary><strong>Can I use this offline?</strong></summary>

Yes! After the initial load, the app works entirely in the browser. You can also build and deploy it locally.
</details>

<details>
<summary><strong>How do I add a shortcut to favorites?</strong></summary>

Click the star icon on any shortcut card. Favorites are stored in your browser's localStorage and persist across sessions.
</details>

<details>
<summary><strong>Is this affiliated with Adobe?</strong></summary>

No. This is an independent, community-driven project. All trademarks belong to their respective owners.
</details>

## Roadmap

- [ ] Add more Adobe applications (InDesign, XD, Animate)
- [ ] Keyboard shortcut practice mode
- [ ] Export favorites as PDF/PNG
- [ ] Browser extension for quick access
- [ ] Community-contributed shortcut packs

## Acknowledgements

- Shortcut data sourced from official Adobe documentation
- Icons by [Lucide](https://lucide.dev/)
- Built with [Vue.js](https://vuejs.org/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/)

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with love for the creative community

**[Back to Top](#adobekeys)**

</div>
