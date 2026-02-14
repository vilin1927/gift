# Technical Specification: anna.norm.quest

## 1. Overview

Valentine's Day gift for Anya — an interactive web app at `anna.norm.quest`.
Password-protected. One user (Anya). Hosted on Vercel.

**Tech stack:** Next.js 15 (App Router, static export) + Motion v12 + Tailwind CSS v4, deployed on Vercel.
**Domain:** `anna.norm.quest` (CNAME → cname.vercel-dns.com)
**Redirects:** `norm.quest` and `www.norm.quest` → 301 → `https://anna.norm.quest`

### Why This Stack
- **Next.js 15** — static export (`output: 'export'`) for instant Vercel CDN delivery, `next/font` for zero-CLS font loading
- **Motion v12** (formerly Framer Motion) — built-in drag gestures for puzzle & quiz swipe, `AnimatePresence` for screen transitions, spring physics
- **Tailwind CSS v4** — design system tokens, `tailwindcss-motion` plugin for CSS-based leaf animations

---

## 2. App Flow

```
Password Screen
      ↓
Landing Screen (2 buttons)
      ↓
  ┌───────────────────────┐
  │ Button 1: Open Puzzle  │
  │ Button 2: Sound +      │
  │   Animation → Puzzle   │
  └───────────────────────┘
      ↓
Puzzle Screen (jigsaw)
      ↓
Quiz Screen (7 questions, swipeable)
      ↓
Gift Screen (certificate + score message)
      ↓
Photo Gallery Screen
      ↓
Poem / Wish Screen
```

---

## 3. Screens & Components

### 3.1 Password Screen

- Fullscreen dark background with subtle falling leaves animation
- Center-aligned input: "Введи пароль, который дал тебе Владимир"
- Hardcoded password: **`[PLACEHOLDER — set your password]`**
- On correct password → smooth transition to Landing
- On wrong password → shake animation + funny message (e.g., "Это не ты, Ань?")
- Password saved in `localStorage` so she doesn't re-enter on revisit

### 3.2 Landing Screen

- Two large buttons, vertically stacked, centered
- **Button 1:** "Открыть" → navigates directly to Puzzle Screen
- **Button 2:** "Открыть по-другому" → plays sound file once (`sound.mp3` in background) + triggers entry animation (e.g., leaves burst / particles / screen ripple) → then navigates to Puzzle Screen
- Optional: short text above buttons (e.g., "Анюта, у меня к тебе кое-что...")
- Sound: single playback, not looped. File: `[PLACEHOLDER — sound.mp3]`

### 3.3 Puzzle Screen

- Digital jigsaw puzzle (3×3 or 4×3 grid)
- Image: `[PLACEHOLDER — puzzle.jpg]` (a photo of them or meaningful image)
- Shuffled pieces on one side → empty grid on the other (or scrambled in-place)
- Drag & drop pieces to correct positions
- Visual feedback: piece snaps into place when correct, subtle glow
- When all pieces placed → congratulations animation → auto-transition to Quiz
- Mobile-friendly: touch drag support, pieces sized for thumbs
- Optional: piece counter "5/9 на месте"

### 3.4 Quiz Screen (CORE MECHANIC — Tinder-Style Swipe, see Section 5)

- 7 questions, one at a time
- Question text shown static at top of screen
- 4 answer cards stacked below (only top card visible), shuffled randomly
- **Swipe RIGHT** = select this answer ("this is my pick")
- **Swipe LEFT** = skip to next answer card
- If all 4 skipped → last card auto-selects
- **NO red/green highlighting** for right/wrong
- Instead: funny popup reactions (see Section 7)
- Dot indicators show remaining answer cards (● ○ ○ ○)
- Progress indicator: "3 / 7"
- Score tracked internally (0–7)
- After all 7 → smooth transition to Gift Screen

### 3.5 Gift Screen

- Score-dependent message (see Section 6)
- Certificate card for Oldich Art masterclass:
  ```
  ┌──────────────────────────────┐
  │     СЕРТИФИКАТ               │
  │                              │
  │  Интерьерная живопись        │
  │  Oldich Art & Sculpture      │
  │                              │
  │  22 февраля 2026, 12:00      │
  │  Садовническая наб., 7       │
  │  Москва                      │
  │                              │
  │  3 часа · холст 60×40        │
  │  акрил, маркеры              │
  └──────────────────────────────┘
  ```
- Certificate styled as elegant card with gold border
- Below certificate: score-based message text
- "Дальше →" button to Photos

### 3.6 Media Gallery Screen

- Animated media gallery — **vertical masonry layout** (Pinterest-style)
- Supports both **photos and videos** in `/public/photos/`
- Media: `[PLACEHOLDER — add filenames to array]`
- 2-column masonry grid, media at natural aspect ratios
- Each item can have optional caption overlay (bottom gradient + text)
- Entrance animations: staggered fade-in + slide-up as items scroll into view (IntersectionObserver)
- Lazy-load images for performance
- **Video support:**
  - Accepted formats: `.mp4`, `.webm`, `.mov`
  - Videos auto-detect via `type: "video"` field or file extension
  - Inline playback with `playsInline`, muted by default, tap to unmute
  - Play/pause on tap, no native controls (custom play icon overlay)
  - Videos lazy-load: only start loading when entering viewport
  - `poster` field for thumbnail before playback
  - Videos respect `prefers-reduced-motion`: show poster only, no autoplay
- Configuration:
  ```js
  const MEDIA = [
    { src: "/photos/photo1.jpg", caption: "optional caption" },
    { src: "/photos/video1.mp4", caption: "Наш момент", type: "video", poster: "/photos/video1-poster.jpg" },
    { src: "/photos/photo2.jpg", caption: "" },
    // type is optional — auto-detected from extension if omitted
  ];
  ```

### 3.7 Welcome Back Screen

- Shown when returning user has `authenticated && quizCompleted` in localStorage
- Centered card with warm greeting: "С возвращением, Ань!"
- Below: score reminder ("Твой результат: 5/7")
- Two buttons:
  - "Посмотреть результат" → jumps to Gift Screen
  - "Пройти заново" → clears quiz/puzzle state, starts from Puzzle
- Same falling leaves background as Password Screen
- Fade-in entrance animation

### 3.8 Poem / Wish Screen

- Final screen
- Poem text: `[PLACEHOLDER — Vladimir will paste poem here]`
- Styled as handwritten-style text or elegant typography
- Falling leaves animation in background
- Signed: "Вова" or "Вова Ворон"
- At the bottom: "Пройти заново" button (resets everything to Puzzle)

---

## 4. Quiz Data — 7 Questions with 4 Variants Each

Each question has 4 answers. One is correct. The other 3 are plausible fakes from the chat.

**Swipe direction for correct answer should be RANDOMIZED per question** — no predictable pattern.

---

### Q1: Стоп-слово

**Question:** "Какое у нас стоп-слово?"

| Card | Answer | |
|------|--------|--|
| 1 | **Жентольник** | ✅ |
| 2 | Биохакинг | ❌ |
| 3 | Тыква | ❌ |
| 4 | Козырной | ❌ |

---

### Q2: Запрещённые темы

**Question:** "Запрещённые темы к 23 сентября?"

| Card | Answer | |
|------|--------|--|
| 1 | **Соски, диета, образ жизни** | ✅ |
| 2 | Религия, политика, мясо | ❌ |
| 3 | Треугольники, зоопарки, Картье | ❌ |
| 4 | Мясо, Ницше, каршеринг | ❌ |

---

### Q3: Во что верит Аня

**Question:** "Аня верит только в..."

| Card | Answer | |
|------|--------|--|
| 1 | **«Ту таблицу»** | ✅ |
| 2 | Обычную астрологию | ❌ |
| 3 | Нумерологию и карты Таро | ❌ |
| 4 | Матрицу синхронности | ❌ |

---

### Q4: Что на лице

**Question:** "Что Аня хотела сделать на лице?"

| Card | Answer | |
|------|--------|--|
| 1 | **Тату** | ✅ |
| 2 | Пирсинг в нос | ❌ |
| 3 | Перманентный макияж бровей | ❌ |
| 4 | Веснушки хной | ❌ |

---

### Q5: Козырной

**Question:** "Кто такой Козырной?"

| Card | Answer | |
|------|--------|--|
| 1 | **Дед из деревни, сидел за убийство, звонил бабушке** | ✅ |
| 2 | Сосед бабушки, воровал яблоки | ❌ |
| 3 | Друг дедушки, приезжал каждое лето | ❌ |
| 4 | Бывший ухажёр бабушки, писал письма | ❌ |

---

### Q6: Зоопарки

**Question:** "Аня любит зоопарки"

| Card | Answer | |
|------|--------|--|
| 1 | **Бред — она против** | ✅ |
| 2 | Правда — ходит каждый месяц | ❌ |
| 3 | Только контактные | ❌ |
| 4 | Ей всё равно | ❌ |

---

### Q7: Тактильность

**Question:** "Аня — очень тактильный человек"

| Card | Answer | |
|------|--------|--|
| 1 | **Бред — она «не тактильный»** | ✅ |
| 2 | Правда — обнимает всех | ❌ |
| 3 | Только в хорошем настроении | ❌ |
| 4 | Только с Вовой | ❌ |

---

### Quiz Data as JSON

Answers array is shuffled at runtime. `correctIndex` refers to position in the original array (before shuffle).

```json
[
  {
    "id": 1,
    "question": "Какое у нас стоп-слово?",
    "answers": ["Жентольник", "Биохакинг", "Тыква", "Козырной"],
    "correctIndex": 0
  },
  {
    "id": 2,
    "question": "Запрещённые темы к 23 сентября?",
    "answers": ["Соски, диета, образ жизни", "Религия, политика, мясо", "Треугольники, зоопарки, Картье", "Мясо, Ницше, каршеринг"],
    "correctIndex": 0
  },
  {
    "id": 3,
    "question": "Аня верит только в...",
    "answers": ["«Ту таблицу»", "Обычную астрологию", "Нумерологию и карты Таро", "Матрицу синхронности"],
    "correctIndex": 0
  },
  {
    "id": 4,
    "question": "Что Аня хотела сделать на лице?",
    "answers": ["Тату", "Пирсинг в нос", "Перманентный макияж бровей", "Веснушки хной"],
    "correctIndex": 0
  },
  {
    "id": 5,
    "question": "Кто такой Козырной?",
    "answers": ["Дед из деревни, сидел за убийство, звонил бабушке", "Сосед бабушки, воровал яблоки", "Друг дедушки, приезжал каждое лето", "Бывший ухажёр бабушки, писал письма"],
    "correctIndex": 0
  },
  {
    "id": 6,
    "question": "Аня любит зоопарки",
    "answers": ["Бред — она против", "Правда — ходит каждый месяц", "Только контактные", "Ей всё равно"],
    "correctIndex": 0
  },
  {
    "id": 7,
    "question": "Аня — очень тактильный человек",
    "answers": ["Бред — она «не тактильный»", "Правда — обнимает всех", "Только в хорошем настроении", "Только с Вовой"],
    "correctIndex": 0
  }
]
```

**Note:** `correctIndex` is always 0 in the raw data (correct answer is first). At runtime, shuffle the `answers` array and track which index the correct answer moved to.

---

## 5. Swipe Mechanic Specification (Tinder-Style Stack — Option A)

### Concept
Question is shown as static text at the top. Answer cards are stacked below, one visible at a time. User swipes RIGHT to select an answer ("this is my pick"), swipes LEFT to skip to the next answer card.

### Visual Layout (Mobile-First)

```
┌──────────────────────────┐
│                          │
│   "Какое у нас           │
│    стоп-слово?"          │  ← Question (static, top)
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │   Жентольник       │  │  ← Answer card (swipeable)
│  │                    │  │
│  │      ← LEFT  RIGHT →  │  ← Swipe hints (subtle arrows)
│  │     (skip)  (pick) │  │
│  └────────────────────┘  │
│                          │
│       ● ○ ○ ○            │  ← Card dots (1 of 4 answers)
│       3 / 7              │  ← Question progress
│                          │
└──────────────────────────┘
```

### How It Works

1. Question text shown at top of screen (stays fixed)
2. Below it: a stack of 4 answer cards (only top card visible)
3. Answer order is **shuffled randomly** each time (correct answer isn't always first)
4. **Swipe RIGHT** = "This is my answer" → card flies off right → reaction popup → next question
5. **Swipe LEFT** = "Skip, show next" → card flies off left → next answer card appears
6. If she skips all 4 → last remaining card auto-selects (she must answer)
7. Small dot indicators show how many answer cards remain (● ○ ○ ○)

### Touch/Mouse Events

```
onTouchStart / onMouseDown:
  → Record start position (clientX)
  → Set isDragging = true

onTouchMove / onMouseMove:
  → Calculate deltaX = current.clientX - start.clientX
  → Move card horizontally: transform: translateX(deltaX)
  → Rotate slightly: rotate(deltaX * 0.08 deg)
  → Tilt card based on direction
  → Show visual hint:
    - Moving right → green/gold tint + "✓" overlay fading in
    - Moving left → dim/grey tint + "→" skip overlay

onTouchEnd / onMouseUp:
  → If deltaX > THRESHOLD (+80px):
    → SELECT this answer
    → Animate card flying off right (translateX: 120vw, rotate: 20deg)
    → Show reaction popup (correct/wrong)
    → After 1.5s → load next QUESTION
  → If deltaX < -THRESHOLD (-80px):
    → SKIP this answer
    → Animate card flying off left (translateX: -120vw, rotate: -20deg)
    → Show next answer card in stack
    → If no more cards → auto-select last card
  → If |deltaX| < THRESHOLD:
    → Snap back to center (spring animation)
```

### CSS for Swipe Card

```css
.answer-card {
  position: absolute;
  width: 85vw;
  max-width: 400px;
  min-height: 120px;
  touch-action: pan-y;         /* allow vertical scroll, capture horizontal */
  user-select: none;
  cursor: grab;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform;
}

.answer-card.dragging {
  transition: none;            /* instant follow during drag */
  cursor: grabbing;
}

.answer-card.fly-right {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
  transform: translateX(120vw) rotate(20deg);
  opacity: 0;
}

.answer-card.fly-left {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
  transform: translateX(-120vw) rotate(-20deg);
  opacity: 0;
}
```

### Stacked Cards Visual
Cards behind the active one are slightly scaled down and offset:
```css
.card-stack .card:nth-child(2) { transform: scale(0.95) translateY(8px); }
.card-stack .card:nth-child(3) { transform: scale(0.90) translateY(16px); }
.card-stack .card:nth-child(4) { transform: scale(0.85) translateY(24px); }
```

### Swipe Hints (First Question Only)
On the very first answer card, show animated arrow hints:
- Left arrow + "Пропустить" (skip)
- Right arrow + "Выбрать" (select)
- Fade out after 2 seconds or after first swipe

### Important Mobile UX Notes
- `touch-action: pan-y` on card (blocks horizontal scroll, allows vertical page scroll)
- `e.preventDefault()` on horizontal touchmove when |deltaX| > 10
- Minimum card height: 120px (easy to grab with thumb)
- Card text: 16-18px font (readable, no iOS zoom)
- Answer cards should have generous padding: 20-24px
- Haptic feedback via `navigator.vibrate(10)` on select (Android only, silent fail on iOS)
- Spring-back feel: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` for overshoot bounce

---

## 5.1 Mobile-Specific Requirements

### Viewport & Meta Tags
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#1a1612">
```

### Screen Sizes to Support
- **Primary:** iPhone SE (375×667) through iPhone 15 Pro Max (430×932)
- **Secondary:** Android phones (360×800 typical)
- **Fallback:** Desktop (nice to have, not priority)

### Mobile Layout Rules
- All content: `max-width: 430px; margin: 0 auto;` (centered on tablets/desktop)
- No horizontal scroll ever — `overflow-x: hidden` on body
- Font sizes: minimum 16px for inputs (prevents iOS auto-zoom), 14px minimum for body text
- Touch targets: minimum 44×44px (Apple HIG guideline)
- Safe area insets for notched phones:
  ```css
  padding-bottom: env(safe-area-inset-bottom);
  padding-top: env(safe-area-inset-top);
  ```

### Password Input (iOS Specific)
```css
input[type="password"] {
  font-size: 16px;        /* CRITICAL: prevents iOS zoom on focus */
  -webkit-appearance: none;
  border-radius: 12px;
}
```

### Scroll Behavior
- Password screen: no scroll (fixed layout)
- Landing screen: no scroll (fixed layout)
- Puzzle screen: no scroll (fixed layout)
- Quiz screen: no scroll (card swipe area)
- Gift/Photo/Poem screens: vertical scroll allowed
- Use `overflow: hidden` on body during non-scrollable screens, `overflow: auto` otherwise

### Performance
- Falling leaves: limit to 10-12 elements on mobile (vs 20 on desktop) to save battery
- Use `will-change: transform` on animated elements
- Prefer CSS animations over JS for leaf falling
- Lazy-load photos in gallery (intersection observer)

### Orientation
- Lock to portrait if possible: `@media (orientation: landscape) { /* show rotate prompt */ }`
- Or just make it work in both, but optimize for portrait

---

## 6. Scoring System

**Total questions: 7**
**Each correct answer = 1 point**
**Score range: 0–7**

### Score Tiers & Messages

| Score | Tier | Message next to certificate |
|-------|------|---------------------------|
| 0–2 | Low | "Ну... мы ещё поработаем над этим. Но подарок всё равно твой 😏" |
| 3–5 | Mid | "Неплохо! Ты знаешь меня лучше, чем притворяешься. Держи:" |
| 6–7 | High | "Окей, ты реально шаришь. Козырной бы одобрил. Вот тебе:" |

All tiers show the same certificate — only the message text above it changes.

---

## 7. Reactions System (Funny Popups)

Instead of red/green answer highlighting, show a toast/popup with a funny message for 1.5–2 seconds.

### Correct Answer Reactions (random pick)
```
"Ну шаришь! 🎯"
"Матрица одобряет ✨"
"Козырной бы гордился"
"Жентольник!"
"Ого, ты это помнишь?"
"Дикая кошка довольна 🐱"
```

### Wrong Answer Reactions (random pick)
```
"Ой мимо..."
"Это была ловушка, да?"
"Ну камон..."
"Даже Козырной знал бы..."
"Матрица в шоке"
"Попробуй ещё... ой, нельзя"
"Ты точно Аня?"
```

### Popup Behavior
- Appears center-top of screen
- Fade in + slight scale up
- Stays 1.5 seconds
- Fade out
- Then next question slides in from right

---

## 8. State Management

### Storage: `localStorage`

```js
const STATE_KEY = "anna_norm_quest";

// State shape:
{
  authenticated: true,           // password entered correctly
  puzzleCompleted: true,         // puzzle solved
  quizCompleted: true,           // quiz finished
  quizScore: 5,                  // 0–7
  quizAnswers: [0,1,1,0,1,1,1], // per-question results
  completedAt: "2026-02-14T..."  // timestamp
}
```

### Flow Logic

```
On page load:
  → Read state from localStorage
  → If authenticated && quizCompleted:
    → Show "Welcome Back" screen with two options:
      - "Посмотреть результат" → jump to Gift Screen
      - "Пройти заново" → clear state, start from Puzzle
  → If authenticated && !quizCompleted:
    → Resume from where they left off
  → If !authenticated:
    → Show Password Screen
```

### Retake Button
- Available on final screen (Poem)
- Clears: puzzleCompleted, quizCompleted, quizScore, quizAnswers
- Does NOT clear: authenticated (no need to re-enter password)
- Redirects to Puzzle Screen

### Server-Side Toggle (optional, for future)
If you want remote control over the state:
- Create a Vercel serverless function (`/api/state`)
- Stores a simple JSON in Vercel KV or a file
- `GET /api/state` → returns current state
- `POST /api/state` → updates state
- Only needed if you want to reset Anya's progress remotely

For MVP, `localStorage` is sufficient.

---

## 9. Design System

### Colors
```css
:root {
  --bg-primary: #1a1612;       /* dark brown-black */
  --bg-secondary: #2a2118;     /* slightly lighter */
  --bg-card: #2d2520;          /* card background */
  --text-primary: #e8dcc8;     /* warm cream */
  --text-secondary: #a89882;   /* muted tan */
  --accent-gold: #c9a84c;      /* gold for highlights */
  --accent-amber: #d4763c;     /* amber for buttons */
  --accent-green: #6b8f5e;     /* forest green */
  --accent-red: #a85443;       /* muted red */
  --shadow: rgba(0,0,0,0.4);
}
```

### Typography
```css
/* Headings */
font-family: 'Cormorant Garamond', Georgia, serif;

/* Body */
font-family: 'Inter', -apple-system, sans-serif;
```

### Falling Leaves Animation
```css
@keyframes fall {
  0%   { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}

.leaf {
  position: fixed;
  font-size: 20px;
  animation: fall linear infinite;
  pointer-events: none;
  z-index: 0;
}
```

Generate 15–20 leaf elements with randomized:
- `left`: 0–100%
- `animation-duration`: 8–15s
- `animation-delay`: 0–10s
- Emoji: 🍂 🍁 🌿

### Screen Transitions
- Between screens: fade out (300ms) → fade in (300ms)
- Or slide: current screen slides left, new screen slides in from right

### Card Style
```css
.card {
  background: var(--bg-card);
  border: 1px solid rgba(201, 168, 76, 0.2);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px var(--shadow);
}
```

### Certificate Style
```css
.certificate {
  background: linear-gradient(135deg, #2d2520 0%, #3a2f28 100%);
  border: 2px solid var(--accent-gold);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.15);
}
```

### Responsive Breakpoints
```css
/* Mobile first */
@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
```

---

## 10. Configuration / Placeholders

All configurable values at the top of the main file:

```js
// ============ CONFIGURATION ============
const CONFIG = {
  // Password for entry
  password: "CHANGE_ME",

  // Sound file (place in /public or same directory)
  soundFile: "/sound.mp3",

  // Puzzle image
  puzzleImage: "/puzzle.jpg",

  // Puzzle grid size
  puzzleGrid: { cols: 3, rows: 3 },

  // Photos for gallery
  photos: [
    // { src: "/photos/photo1.jpg", caption: "Описание" },
    // { src: "/photos/photo2.jpg", caption: "" },
  ],

  // Poem (final screen)
  poem: `
    ВСТАВЬ СТИХОТВОРЕНИЕ СЮДА
  `,

  // Certificate details
  certificate: {
    title: "Интерьерная живопись",
    studio: "Oldich Art & Sculpture",
    date: "22 февраля 2026, 12:00",
    address: "Садовническая наб., 7, Москва",
    details: "3 часа · холст 60×40 · акрил, маркеры",
  },

  // Score messages
  scoreMessages: {
    low:  "Ну... мы ещё поработаем над этим. Но подарок всё равно твой 😏",
    mid:  "Неплохо! Ты знаешь меня лучше, чем притворяешься. Держи:",
    high: "Окей, ты реально шаришь. Козырной бы одобрил. Вот тебе:",
  },
};
// ========================================
```

---

## 11. Deployment

### File Structure (Next.js 15)

```
/project-root
├── public/
│   ├── sound.mp3           ← [PLACEHOLDER]
│   ├── puzzle.jpg           ← [PLACEHOLDER]
│   └── photos/
│       ├── photo1.jpg       ← [PLACEHOLDER]
│       ├── photo2.jpg
│       └── ...
├── src/
│   ├── app/
│   │   ├── layout.tsx       ← root layout (fonts, metadata, Tailwind)
│   │   └── page.tsx         ← main SPA entry point
│   ├── components/
│   │   ├── screens/         ← PasswordScreen, LandingScreen, etc.
│   │   ├── quiz/            ← SwipeCard, CardStack, ReactionPopup
│   │   ├── puzzle/          ← PuzzleGrid, PuzzlePiece
│   │   └── ui/              ← FallingLeaves, Certificate, MasonryGallery
│   ├── data/
│   │   └── quiz.ts          ← quiz questions JSON
│   ├── hooks/
│   │   └── useGameState.ts  ← localStorage state management
│   └── config.ts            ← CONFIG object (placeholders)
├── next.config.ts           ← output: 'export'
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

### Deployment
- `next build` → generates static `out/` folder
- Vercel auto-detects Next.js, deploys to CDN
- Domain: `anna.norm.quest` CNAME → `cname.vercel-dns.com`

---

## 12. Summary of Placeholders to Fill

| What | Where | Status |
|------|-------|--------|
| Password | `CONFIG.password` | ❌ Need to set |
| Sound file | `/public/sound.mp3` | ❌ Need to upload |
| Puzzle image | `/public/puzzle.jpg` | ❌ Need to upload |
| Photos | `/public/photos/` | ❌ Need to upload |
| Poem text | `CONFIG.poem` | ❌ Need to paste |
| Masterclass purchased | Oldich Art website | ❌ Need to buy |

---

## 13. Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Total JS bundle | < 150KB gzipped |
| Largest Contentful Paint | < 2.5s |
| Animation framerate | 60fps minimum |
| Falling leaves on mobile | 10-12 elements max |
| Photo lazy-load | IntersectionObserver, load when 100px from viewport |

---

## 14. Accessibility

- **`prefers-reduced-motion`**: respect system setting
  - Falling leaves: reduce to 3 elements with slower speed, or hide
  - Screen transitions: instant cut (no slide/fade)
  - Swipe cards: still functional, remove rotation/fly animation
  - Use `useReducedMotion()` hook from Motion
- **Keyboard navigation**: password input focus on load, Enter to submit
- **Font sizes**: minimum 16px body, 14px captions (no iOS zoom triggers)
- **Color contrast**: all text meets WCAG AA against dark backgrounds (verified by design system)
- **Touch targets**: minimum 44x44px per Apple HIG

---

## 15. Error & Edge Case Handling

| Scenario | Behavior |
|----------|----------|
| Sound file fails to load | Silently skip sound, still navigate to Puzzle |
| Puzzle image fails to load | Show error card: "Картинка загружается..." + retry button |
| localStorage disabled/full | App still works in-memory for current session, no persistence |
| Network offline after load | Fully functional (static SPA, all assets cached) |
| Browser back button | Ignored (SPA state-machine, no URL routing) |
| Landscape orientation | Show gentle "Поверни телефон" overlay on mobile |
