# Temple Run — Neon Endless Runner

A fast-paced, 3D-style browser endless runner built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Rendered entirely on an HTML5 Canvas with a neon cyberpunk aesthetic — no game engine, no asset files, just math and pixels.

---

## Features

- **Pseudo-3D perspective corridor** — strip-based renderer with vanishing-point perspective, parallax tunnel walls, and smooth depth scaling
- **3-lane gameplay** — dodge by switching lanes, jumping, or sliding
- **5 obstacle types** — full walls (change lane), low walls (jump over), high bars (slide under), turn gates (swipe L/R in time)
- **Turn events** — timed directional gates require the right swipe; miss them and stumble
- **Coins** — rotating animated coin clusters to collect for bonus score
- **3 difficulty levels** — Easy / Medium / Hard (speed, density, turn frequency)
- **Speed ramp** — continuously accelerates from slow start to maximum intensity
- **Lives & invincibility** — 3 hearts; brief invincibility window after each hit
- **Score multiplier** — builds on successful turns, resets on hit (up to ×4)
- **Particle effects** — coin sparks, hit bursts, foot-glow trail
- **Speed lines** — cyan streaks at high velocity
- **Procedural audio** — all SFX and background arpeggiated synth music via Web Audio API (zero asset files)
- **Persistent high scores** — `localStorage` per difficulty
- **Fully responsive** — canvas scales to any viewport size
- **Mobile-first controls** — on-screen buttons + touch swipe gestures
- **Pause / resume** — keyboard shortcut or HUD button
- **Animated UI** — Framer Motion transitions throughout

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Rendering | HTML5 Canvas 2D API |
| Audio | Web Audio API (procedural synth) |
| State | React refs (game loop) + useState (UI) |
| Persistence | localStorage |
| Deployment | Vercel (zero config) |

---

## Controls

### Desktop

| Key | Action |
|-----|--------|
| `←` / `A` | Change lane left |
| `→` / `D` | Change lane right |
| `↑` / `W` / `Space` | Jump |
| `↓` / `S` | Slide |
| `P` / `Escape` | Pause / resume |

### Mobile

- **Swipe left / right** — change lane
- **Swipe up** — jump
- **Swipe down** — slide
- **On-screen ◀ ▶ ▲ ▼ buttons** — shown on small screens
- **⏸ PAUSE** button — top-right corner

---

## How to Run Locally

```bash
# 1. Clone
git clone https://github.com/your-username/temple_run.git
cd temple_run

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

```bash
# Option A – Vercel CLI
npm i -g vercel
vercel

# Option B – GitHub integration
# Push to GitHub → import repo at vercel.com → Deploy
# No environment variables required.
```

---

## Project Structure

```
temple_run/
├── app/
│   ├── page.tsx            # Root game page (screen orchestration)
│   ├── layout.tsx          # HTML shell + metadata
│   ├── globals.css         # Base styles + neon utilities
│   └── favicon.svg         # Custom neon runner icon
├── components/game/
│   ├── GameCanvas.tsx      # Canvas + RAF game loop wiring
│   ├── HUD.tsx             # Score / distance / lives overlay
│   ├── MainMenu.tsx        # Animated start screen + difficulty picker
│   ├── GameOver.tsx        # Results overlay + restart / menu
│   └── PauseMenu.tsx       # Pause overlay
├── hooks/
│   ├── useGameLoop.ts      # requestAnimationFrame driver
│   ├── useInput.ts         # Keyboard + touch → single-frame input pulses
│   └── useHighScore.ts     # localStorage high-score persistence
├── lib/
│   ├── constants.ts        # All tunable game constants (speeds, heights, colours)
│   ├── utils.ts            # Perspective projection + math helpers
│   └── game/
│       ├── engine.ts       # Mutable game state + per-frame update logic
│       ├── renderer.ts     # Canvas 2D drawing (sky, track, obstacles, player, VFX)
│       └── audio.ts        # Procedural SFX + arpeggiated background music
└── types/
    └── game.ts             # All TypeScript interfaces
```

---

## Game Mechanics

### Obstacles

| Type | Visual | How to clear |
|------|--------|-------------|
| `WALL` | Red neon wall (full height) | Change lane |
| `LOW_WALL` | Orange wall with ↑ hint | Jump over |
| `HIGH_BAR` | Orange beam with ↓ hint | Slide under |
| `TURN_LEFT` | Green ← gate | Swipe left before it reaches you |
| `TURN_RIGHT` | Green → gate | Swipe right before it reaches you |

### Scoring

- **Distance** — score per frame proportional to current speed × multiplier
- **Coins** — 50 pts each (6 per cluster)
- **Successful turn** — +200 pts + 0.5× multiplier (caps at ×4)
- **Hit** — multiplier resets to ×1; lose a life

---

## License

MIT
