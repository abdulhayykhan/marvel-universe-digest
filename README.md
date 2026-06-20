# Marvel Character Encyclopedia

A neobrutalist, full-stack character database covering 40 heroes, villains, gods, mutants, and cosmic weirdos from the Marvel Universe — featuring real bios, MCU appearance histories, a favorites system, and a head-to-head comparison tool.

## 🌟 Live Demo

**URL**: [https://marvel-universe-digest.lovable.app](https://marvel-universe-digest.lovable.app)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Components Overview](#components-overview)
- [Data Model](#data-model)
- [Styling & Design System](#styling--design-system)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Marvel Character Encyclopedia is a fan-made, static web app cataloguing 40 major Marvel characters — Avengers, X-Men, Guardians of the Galaxy, villains, and street-level heroes alike. Each character has a dedicated profile page with biography, powers, MCU film/show appearances (with actor and role), and cross-linked allies and enemies. The entire experience is wrapped in a bold neobrutalist design system built around Marvel's signature black, red, and yellow palette.

### Character Categories
- **Avengers**: Iron Man, Captain America, Thor, Hulk, Black Widow, Hawkeye, and more
- **X-Men**: Wolverine, Storm, Magneto, Professor X
- **Guardians & Cosmic**: Star-Lord, Gamora, Rocket Raccoon, Groot, Thanos, Nebula
- **Villains**: Loki, Ultron, Red Skull, Kingpin, Green Goblin, Doctor Doom, Venom
- **Street-Level & Defenders**: Daredevil, Moon Knight, Shang-Chi, She-Hulk

## ✨ Features

### 🎨 Design & UI
- **Neobrutalist Theme**: Thick black borders, hard offset shadows (no blur), flat fills, zero gradients
- **Marvel Color System**: Signature black (#0D0D0D), red (#ED1D24), white, and yellow accent palette
- **Bold Typography**: Anton for display headings, Inter for body copy
- **Fully Responsive**: Grid stacks cleanly from 4 columns down to 1 on mobile
- **Smooth Route Transitions**: Fade + slide animation between pages

### 📱 Interactive Elements
- **Real-Time Search**: Filter characters instantly by name or alias
- **Category Filter Chips**: Multi-select filtering across 8 categories
- **Random Character Button**: One-click discovery of a random profile
- **Favorites System**: Bookmark characters, persisted to local storage
- **Comparison Tool**: Pick up to two characters for a side-by-side stat breakdown
- **Cross-Linked Profiles**: Allies and enemies link directly to their own character pages

### 🛠 Technical Features
- **TypeScript Support**: Full type safety across data models and components
- **Dynamic Routing**: Per-character detail pages via URL params
- **Smart Image Resolution**: Cascading character portrait lookup with brutalist initials fallback
- **No Backend Required**: Fully static, hardcoded character dataset

## 🚀 Tech Stack

### Frontend Framework
- **React** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server

### Routing & Navigation
- **TanStack Router** - Type-safe, client-side dynamic routing (`/characters/$characterId`)

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework with custom neobrutalist tokens
- **Google Fonts** - Anton (display) and Inter (body)
- **CSS Custom Properties** - Semantic design tokens for borders, shadows, and color

### State & Data
- **React State / Hooks** - `useFavorites` and `useCompare` hooks backed by localStorage
- **CustomEvent Sync** - Keeps nav counts (Favorites/Compare) in sync across components
- **Static JSON/TS Dataset** - Hardcoded, typed character data — no external API or database

### Development Tools
- **ESLint** - Code linting and style enforcement

## 📁 Project Structure

```
src/
├── components/
│   ├── SiteNav.tsx              # Sticky top navigation w/ Favorites & Compare counts
│   ├── CharacterCard.tsx        # Browse-grid character card (favorite + VS toggle)
│   ├── CharacterPortrait.tsx    # Image resolver w/ brutalist initials fallback
│   ├── PowerBadge.tsx           # Ability/power chip
│   ├── CategoryFilter.tsx       # Category chip row (All, Avengers, X-Men, etc.)
│   └── RelatedCharacterCard.tsx # Compact linked card for allies/enemies
├── routes/
│   ├── __root.tsx               # Root layout, head metadata, fonts, favicon
│   ├── index.tsx                # Browse page
│   ├── characters.$characterId.tsx  # Character detail page
│   ├── favorites.tsx            # Bookmarked characters page
│   └── compare.tsx              # Side-by-side comparison page
├── data/
│   └── characters.ts            # Typed dataset of all 40 characters
├── lib/
│   └── favorites.ts             # useFavorites / useCompare localStorage hooks
├── styles.css                   # Design tokens, brutalist utilities, fonts
└── main.tsx                     # Application entry point
```

## 🛠 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdulhayykhan/marvel-universe-digest.git
   cd marvel-universe-digest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🧩 Components Overview

### Core Pages
- **Browse (`/`)**: Hero banner, search bar, category filters, responsive character grid, empty state
- **Character Detail (`/characters/:id`)**: Hero banner, bio, abilities, MCU appearances table, allies/enemies grids
- **Favorites (`/favorites`)**: Grid of bookmarked characters with empty-state CTA
- **Compare (`/compare`)**: Two-slot side-by-side stat comparison

### UI Components
- **CharacterCard**: Black background, red border, hard shadow, hover tilt, favorite star, VS toggle
- **CharacterPortrait**: Deterministic palette by character ID, halftone dot overlay, geometric accents, real-image cascade with brutalist fallback
- **PowerBadge**: Yellow chip with black border for character abilities
- **CategoryFilter**: Red-highlighted active state chip row
- **RelatedCharacterCard**: Compact ally/enemy card linking to full profile

### Utility Hooks
- **useFavorites**: Bookmark state synced to localStorage
- **useCompare**: Two-character comparison slot state, capped at 2, synced to localStorage

## 🗂 Data Model

Each character in `src/data/characters.ts` follows this schema:

```typescript
{
  id: string;              // e.g. "iron-man"
  name: string;             // Real name, e.g. "Tony Stark"
  alias: string;             // Hero name, e.g. "Iron Man"
  category: string[];        // e.g. ["Avengers"]
  image: string;
  bio: string;
  powers: string[];
  affiliation: string[];
  allies: string[];          // Linked character ids
  enemies: string[];         // Linked character ids
  mcu_appearances: {
    title: string;
    year: number;
    role: "Lead" | "Supporting" | "Cameo";
    actor: string;
  }[];
}
```

## 🎨 Styling & Design System

### Design Tokens
Defined as semantic Tailwind theme variables and utilities in `src/styles.css`:

```css
--marvel-black: #0D0D0D;
--marvel-red: #ED1D24;
--marvel-white: #FFFFFF;
--marvel-yellow: #F5C518;
--marvel-bone: #F4F1EA;

--font-display: 'Anton', sans-serif;
--font-sans: 'Inter', sans-serif;
```

### Neobrutalist Utilities
- `brutal-border` / `brutal-border-4` — 3px / 4px solid black borders
- `brutal-shadow` / `brutal-shadow-sm` / `brutal-shadow-lg` — hard offset shadows, no blur
- `brutal-hover` — tilt + shadow shift on card hover
- `route-fade` — fade + slide-up transition on route change

### Design Rules
- No gradients, no rounded corners, no soft/blurred shadows
- Flat solid color fills only
- Bold uppercase display type for all headings
- High-contrast text on dark backgrounds throughout

## 📱 Responsive Design

Fully responsive with mobile-first breakpoints:
- **Mobile**: Single-column grid, nav collapses to icon buttons, hero banner stacks portrait below title
- **Tablet**: 2-column character grid
- **Desktop**: 3–4 column character grid, full nav with labels

## 🌐 Deployment

### Lovable Platform
1. Click **Publish** in the top right of the Lovable editor
2. Your site will be deployed automatically
3. Custom domains can be connected via Project Settings

### Manual Deployment
```bash
npm run build        # Build production files
# Deploy 'dist' folder to your hosting provider
```

### Supported Platforms
- **Vercel**: Zero-configuration deployment
- **Netlify**: Drag-and-drop or Git integration
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for public repos

## 🔧 Configuration

### Environment Variables
No environment variables are required — the app is fully static with a hardcoded dataset.

### Customization
- **Colors**: Modify CSS custom properties in `src/styles.css`
- **Characters**: Add or edit entries in `src/data/characters.ts`
- **Components**: Customize component styling directly via Tailwind classes

## 🤝 Contributing

This is a fan-made project for educational and portfolio purposes.

1. **Direct Editing**: Use the Lovable platform for quick changes
2. **Local Development**: Clone the repo and make changes locally
3. **Version Control**: All changes are tracked via Git

## ⚖️ Disclaimer

This is a **fan-made encyclopedia** and is **not affiliated with, endorsed by, or connected to Marvel Entertainment, Disney, or any of their subsidiaries**. All character names, likenesses, and associated media are the property of their respective owners. This project is built for educational and demonstrative purposes only.

## 📄 License

The **codebase and repository** are maintained by [**Abdul Hayy Khan**](https://www.linkedin.com/in/abdul-hayy-khan/).

> *"Building the Marvel Character Encyclopedia with Lovable was a great way to explore neobrutalist design at scale — 40 dynamic character pages, a comparison engine, and a fully static data layer, all without writing backend code. A great showcase of how far AI-assisted development has come."*

## 🆘 Support

For technical support or questions about the project:
- **Lovable Documentation**: [https://docs.lovable.dev/](https://docs.lovable.dev/)
- **Project Repository**: [https://github.com/abdulhayykhan/marvel-universe-digest](https://github.com/abdulhayykhan/marvel-universe-digest)

---

**Built with ❤️ using Lovable by Abdul Hayy Khan**
