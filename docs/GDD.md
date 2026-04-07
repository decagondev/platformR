# 🎮 GAME DESIGN DOCUMENT (GDD)

## 🧾 1. Game Overview

**Working Title:** *[TBD — placeholder: “Neon Ascent”]*
**Genre:** 2D Precision Platformer
**Perspective:** Side-scrolling (2D)
**Platform:** Web (desktop first)
**Tech Stack:** PixiJS + Vite + Vanilla JS

---

## 🎯 2. Core Concept

A **sci-fi precision platformer** where the player navigates high-risk environments using **tight movement and a double jump mechanic**.

The focus is:

* Precision over speed
* Mastery of movement
* Minimal but meaningful mechanics

---

## 🧱 3. Core Gameplay Pillars

### 1. 🎮 Tight Controls

* Instant input response
* Predictable physics
* No randomness

### 2. 🧩 Precision Challenge

* Every jump matters
* Punishing but fair level design

### 3. 🔁 Fast Iteration Loop

* Quick death → instant restart
* Encourages learning through repetition

### 4. 🌌 Clean Sci-Fi Aesthetic

* Minimalist but stylish pixel visuals
* Strong contrast for readability

---

## 🕹️ 4. Core Mechanics

### Movement

* Left / Right movement
* Jump
* **Double Jump (core mechanic)**

### Physics

* Constant gravity
* Air control (slightly reduced vs ground)
* Jump buffering (optional but recommended)
* Coyote time (small forgiveness window)

👉 These last two are *critical* for a Celeste-like feel.

---

## ⚙️ 5. Player Ability Spec

### Jump System

* First jump: grounded
* Second jump: mid-air reset

Optional later upgrades:

* Dash
* Wall jump

---

### Feel Tuning Targets

These matter more than visuals:

* Jump height: medium
* Fall speed: slightly faster than rise
* Air control: ~70–80% of ground control

---

## 🧠 6. Game Loop

Core loop:

1. Player attempts platforming challenge
2. Fails (falls / hits hazard)
3. Instant respawn
4. Learns timing/spacing
5. Re-attempts

Repeat until success.

---

## 🗺️ 7. Level Design

### Structure

Start with:

* **Single-screen or short scrolling levels**

Then expand to:

* Multi-section levels
* Checkpoints

---

### Level Elements

* Static platforms
* Gaps requiring double jump
* Moving platforms (later)
* Hazards:

  * Spikes
  * Energy beams
  * Void pits

---

### Difficulty Curve

1. Teach jump
2. Teach double jump
3. Combine timing + positioning
4. Introduce hazards
5. Increase precision demands

---

## 🎥 8. Camera Design

**Type:** Smooth follow

### Behavior:

* Follows player with slight lag
* Dead zone in center (reduces jitter)
* No sudden snapping

---

## 🎨 9. Art Direction

### Style:

* Pixel art (clean, readable)
* Sci-fi theme:

  * Neon accents
  * Dark backgrounds
  * Glowing elements

---

### Technical Rules:

* Fixed internal resolution (e.g. 320x180)
* Integer scaling only
* No texture smoothing

---

### Visual Hierarchy:

* Player: brightest / most readable
* Platforms: medium contrast
* Background: low contrast

---

## 🔊 10. Audio (Later Phase)

### Sound Effects:

* Jump
* Double jump (distinct sound)
* Death
* Landing

### Music:

* Ambient sci-fi loop
* Low distraction

---

## 🧑‍💻 11. Technical Design

### Rendering

* PixiJS containers:

  * `worldContainer`
  * `uiContainer`

---

### Systems

#### Core Systems:

* Game loop (Pixi ticker)
* Input system
* Physics system
* Collision system
* Scene manager

---

### Entity Types:

* Player
* Platform
* Hazard
* Enemy (later)

---

### Collision Type:

* AABB (simple + fast)

---

## ⚡ 12. Performance Goals

* 60 FPS stable
* Minimal garbage collection spikes
* Low memory footprint

### Strategies:

* Object pooling
* Sprite reuse
* Avoid per-frame allocations

---

## 📦 13. MVP Scope (IMPORTANT)

Your **first playable version**:

✅ Player movement
✅ Double jump
✅ Basic platforms
✅ Collision
✅ Camera follow
✅ One level
✅ Restart on death

---

## 🚀 14. Post-MVP Features

* Checkpoints
* Level select
* Timer / speedrun mode
* Advanced movement (dash, wall jump)
* Enemies
* Visual polish (particles, shaders)

---

## 🧪 15. Risks & Challenges

### 1. “Game Feel”

Hardest part.
Solution:

* Iterate movement constants constantly

---

### 2. Overengineering

You’re using vanilla JS — keep systems simple.

---

### 3. Performance pitfalls

* Too many sprites
* Poor batching

---

## 📅 16. Development Plan

### Phase 1 — Core Engine

* Pixi setup
* Game loop
* Scene system

### Phase 2 — Movement

* Player physics
* Jump + double jump

### Phase 3 — World

* Platforms
* Collision

### Phase 4 — Camera

* Smooth follow

### Phase 5 — Gameplay

* Hazards
* Death + restart

---

## 🧭 17. Next Decisions Needed

To refine further:

1. Player character:

   * Robot?
   * Human?
   * Drone?

2. Visual tone:

   * Dark cyberpunk?
   * Bright neon arcade?

3. Level format:

   * Tile grid?
   * Hand-placed objects?

