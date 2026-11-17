# JAVA QUEST — Offline Edition

An immersive, futuristic Java learning & gaming platform built as a **100% static front-end application**. Designed for 15 university beginners preparing for a Java Programming exam. Three game modes, seven world regions, the full Java syllabus, XP/levels/badges, and a premium esports-style UI — all stored locally on each player's device.

> ⚡ No backend. No database. No auth server. No APIs. No paid services. Works on GitHub Pages.

---

## 📦 Project Structure

```
java-quest/
├── index.html              # Single-page app shell with all screens
├── css/
│   └── style.css           # Futuristic theme, glassmorphism, RTL, responsive, animations
├── data/
│   ├── questions.js        # 100-question bank, 7 missions × 10+ sources × 10 types
│   └── missions.js         # 7 regions with story, lessons, code, exercises, OOP buildings
├── js/
│   ├── storage.js          # LocalStorage manager (export/import/reset/session)
│   ├── engine.js           # Question engine: filter, shuffle, scoring, XP, badges, timer, highlighter
│   ├── solo.js             # SOLO MODE: setup → gameplay → results → review → bookmarks
│   ├── team.js             # TEAM MODE: 4 pass-and-play formats + leaderboard + podium
│   ├── host.js             # HOST MODE: presentation, reveal controls, scoring, fullscreen, podium
│   └── app.js              # Main controller: navigation, mission map, home, profile, bank, confetti
└── README.md
```

Open `index.html` in any modern browser — that's it. No build step.

---

## 🚀 Deploy to GitHub Pages

1. Create a new GitHub repository, e.g. `java-quest`.
2. Upload the entire `java-quest/` folder contents to the repo root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`. Save.
6. Wait ~30 seconds. Your app is live at `https://<your-username>.github.io/java-quest/`.

Each of the 15 students opens that same URL on their own device and plays independently — all progress lives in their own browser's LocalStorage.

---

## 🎮 Three Game Modes

### A. SOLO MODE
Enter your name → pick an avatar → choose a mission → choose difficulty → play.
- Randomized options, instant or delayed feedback, per-question timer (medium 45s, hard 30s).
- Streaks, XP, score, accuracy tracked live.
- Skip, bookmark, and quit mid-quest.
- Final report: percentage, score, accuracy, XP gained, weak topics, full question review, new badges.
- Review mistakes from every mission in one place. Browse your bookmarks.
- Download your personal results as JSON.

### B. TEAM MODE — Local Pass-and-Play
The instructor builds teams on one device.
- Create multiple teams, name them, add members, assign colors and icons.
- Choose question count (3–50), category, difficulty filter, and scoring system.
- **Four team formats:**
  1. **One representative** answers for the team.
  2. **Take turns** — players rotate through teams.
  3. **Fixed count** — each member answers a fixed share.
  4. **Same questions together** — every team faces every question.
- Whose-turn indicator, live team scores, reveal answer + explanation, skip, auto-advance to next player.
- Scoring systems: standard, streak bonus, speed bonus, double-or-nothing.
- Final animated podium + full leaderboard, downloadable as JSON.

### C. HOST MODE — Presentation & Screen Sharing
For live online study sessions where the instructor shares their screen and asks students verbally.
- One question at a time, big and presentation-friendly.
- Category, difficulty, source, type tags on every question.
- Reveal answer, reveal explanation, next, previous, random question.
- Pick a student manually (roster grid) or randomly (🎲).
- Award points manually: +1, +2, +3, +5, +10, −2, −5.
- Live leaderboard updates instantly.
- Fullscreen presentation mode.
- End session → final podium + downloadable results.

---

## 🌍 The World of JAVA CORE — 7 Regions

| # | Region | Syllabus |
|---|---|---|
| 1 | 🌱 Java Foundation | History, JVM/JDK/JRE, program structure, main, Scanner, variables, primitives, constants, operators, casting, Strings, scope, I/O |
| 2 | 🧭 Control Flow Lab | if / if-else / nested if, switch, for, while, do-while, nested loops, break, continue, loop conversion |
| 3 | 🏙️ Arrays & Memory City | 1D arrays, 2D arrays, enhanced for-loop, indexing, searching, sorting basics, max/min/sum/average, matrix addition, jagged arrays, references, ArrayList |
| 4 | 🌀 Methods & Recursion | void/return methods, parameters, arguments, overloading, pass-by-value, references, call stack, recursion, factorial, Fibonacci, GCD |
| 5 | 🏰 OOP City *(most detailed)* | Classes, objects, attributes, methods, constructors, overloading, this, encapsulation, getters/setters, access modifiers, static vs instance, inheritance, extends, super, overloading vs overriding, polymorphism, dynamic dispatch, abstract classes, interfaces, final, packages, UML, equals() vs ==, null, garbage collection |
| 6 | 🛠️ System Recovery | Compile/runtime/logical errors, try/catch/finally, throw, throws, checked vs unchecked, custom exceptions, File I/O, streams |
| 7 | 🚀 Advanced Systems | Threads, multithreading, synchronization, synchronized, JAR, Ant |

Each region has: **story intro → lessons (with real-life analogies & code) → practice exercises → quiz → debug challenge → boss battle**. OOP City additionally has **8 interactive buildings**, each teaching one OOP concept.

Missions unlock sequentially (complete the previous one with ≥50% accuracy).

---

## 📚 Question Bank

100 questions spread across:
- **7 categories** (one per region).
- **10+ sources**: Sheet 1, Sheet 2, Lab 1, Lab 2, Lab 3, Lab 4, Methods Problems, Midterm 2024/2025, Midterm 2025/2026, Final 2024/2025, Final 2025/2026.
- **10 types**: MCQ, True/False, Predict the Output, Debugging, Complete the Code, Write a Program, Explain Why, OOP Scenario, Array Problem, Recursion Problem.

### ⚠️ Transparency on question provenance
The project brief listed question **sources and types** but did not paste the actual examination questions. Following the rule *"Do not invent missing original examination questions,"* every question in this build is flagged `original:false` and is clearly labelled **PRACTICE** in the UI (a `⭐ ORIGINAL` tag is reserved for real exam questions once supplied).

To add real exam questions later, open `data/questions.js`, add a question object with `original: true`, and it will be auto-tagged `⭐ ORIGINAL` everywhere — no other code changes needed.

Every question includes a correct answer and a **bilingual explanation** (English + Arabic, RTL). Compilation errors are flagged accurately (e.g. q074, q088).

---

## 🧠 Question Engine Features
- Random question order, randomized options (except True/False).
- Category, difficulty, source, type, and free-text filters.
- Per-question timer with countdown ring (turns red at ≤5s).
- Instant feedback with correct/wrong highlighting + explanation reveal.
- Self-grading for open-ended (Write a Program / Explain Why) questions.
- Bookmarks, wrong-answer review, replayable missions.

### Special Game Types
Predict the Output · Find the Bug · Code Detective · Complete the Missing Line · What Am I? · OOP City Puzzle · Loop Maze · Memory Hacker · Final Boss — surfaced through the question type system and the Boss Battle / Debug Challenge buttons on each mission page.

---

## 🏆 Rewards & Progression
- **XP** awarded per correct answer (× difficulty multiplier).
- **Levels** computed from cumulative XP.
- **16 badges**: First Step, On Fire (5-streak), Lightning (10-streak), per-mission completion, Perfect Run, JAVA CORE Master (all 7), Scholar (500 XP), Sage (1500 XP), Team Player, Host Master.
- **Streaks** with 🔥 indicator.
- **Mission completion** with progress rings on the map.
- **Confetti** on achievements (70%+ solo runs, team/host podiums).
- **Animated final podium** for team & host modes.

---

## 💾 Data & Results (LocalStorage)

All data is stored under the key `javaquest.v1` in the browser's LocalStorage **on this device only**. It is NOT automatically shared across devices.

Persisted:
- Player name & avatar.
- Total XP, level, earned badges.
- Per-mission: completion, best score, best accuracy, attempts, mistakes.
- Full session history (last 100).
- Saved team configurations & local competition history.
- Saved host roster & last host scores.
- Bookmarks.

Operations (Home screen → "Your Progress" card):
- **Export Results (JSON)** — downloads a full snapshot. Move it to another device manually.
- **Import Results (JSON)** — merges a snapshot into this device's storage.
- **Reset Progress** — wipes everything on this device (with confirmation).

Clearing your browser's site data also clears JAVA QUEST progress.

---

## 🎨 Design
- Deep navy + electric cyan + purple + magenta gradient palette.
- Glassmorphism cards, animated grid + floating orbs background.
- Orbitron display font, Inter body, JetBrains Mono code.
- Animated mission map, beautiful question cards, interactive OOP city buildings.
- Confetti on achievements, animated podium.
- Fully responsive: phones (375px), tablets, desktops.
- **Bilingual**: English explanations (LTR) + Arabic explanations (correct RTL layout); Java code always LTR.

---

## 🛠️ Tech Stack
- HTML5
- CSS3 (custom properties, grid, flex, backdrop-filter, animations)
- Vanilla JavaScript (no frameworks, no libraries)
- LocalStorage for persistence
- JSON question database (static `.js` file)
- Canvas confetti (vanilla)

No npm, no bundler, no build step. Just open the file.

---

## ✅ Requirements Checklist

- [x] 100% static front-end, GitHub Pages deployable
- [x] No Firebase/Supabase/backend/PHP/DBs/auth/multiplayer/APIs/paid services
- [x] Three independent game modes (Solo, Team, Host)
- [x] Seven world regions with full Java curriculum
- [x] OOP City most detailed — 8 interactive buildings
- [x] Mission map with locked/unlocked stages
- [x] 100-question bank across 10+ sources and 10 types
- [x] Question engine: random, filters, timer, feedback, explanations, bookmarks, review, retry
- [x] XP, levels, badges, streaks, progress bars, trophy collection, confetti
- [x] LocalStorage persistence + JSON export/import/reset/clear session
- [x] Premium futuristic esports design, glassmorphism, responsive
- [x] Arabic RTL explanations + English LTR code
- [x] Complete source files + README
- [x] Original questions clearly distinguished from practice (transparency note)

---

## 📝 Notes & Limitations
- Question provenance is documented above. When real original exam questions are supplied, append them with `original: true`.
- "Write a Program" and "Explain Why" questions use **self-grading** (you mark yourself correct after seeing the reference) — there is no automatic Java compiler in the browser.
- The host's "fullscreen" uses the browser Fullscreen API; some browsers require a user gesture.
- Progress is per-browser-per-device. Use Export/Import for manual cross-device sharing.

---

**Built to transform 15 Java beginners into confident, exam-ready programmers through an unforgettable interactive learning adventure.** 🚀
