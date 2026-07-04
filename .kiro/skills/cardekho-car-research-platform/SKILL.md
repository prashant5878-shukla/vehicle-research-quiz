---
name: cardekho-car-research-platform
description: Full-stack car research platform. React + Vite frontend, Node/Express backend, in-memory JSON data. Quiz-based guided filtering with weighted scoring engine. Helps confused car buyers reach a confident shortlist. Indian market, 40+ real cars. Zero external dependencies.
---

# CarDekho Car Research Platform

## What This Is

Take-home for Software Engineer — AI-Native, CarDekho Group.
Core problem: buyer is overwhelmed → quiz extracts intent → scoring engine ranks cars → AI explains why each car fits → buyer has a confident shortlist.

**Time budget: 2-3 hours. Ship working > ship perfect.**

## Architecture

- **Frontend:** React (Vite) + TailwindCSS
- **Backend:** Node.js + Express
- **Data:** In-memory JSON arrays (no database, zero config)
- **Setup:** `npm install && npm run dev` — nothing else. Zero env vars required.

### Why No Database

40 cars. Read-only data. No user accounts. A database adds a dependency that can break the reviewer's setup for zero benefit. Data lives in `server/data/cars.json` and `server/data/reviews.json`, loaded into memory on server start.

### Project Structure

```
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # QuizStep, CarCard, CompareTable, Shortlist
│   │   ├── pages/           # QuizPage, ResultsPage
│   │   ├── api/             # fetch wrappers
│   │   └── App.jsx
│   └── index.html
├── server/
│   ├── data/                # cars.json, reviews.json (static seed data)
│   ├── services/            # quizScorer.js
│   ├── routes/              # quiz.js, cars.js, compare.js
│   └── index.js
├── package.json
└── README.md
```

## Data Shape

### Car Object (in cars.json)

```js
{
  "id": "creta-sx-petrol",           // slug, used as ID
  "make": "Hyundai",
  "model": "Creta",
  "variant": "SX",
  "year": 2024,
  "priceLakh": 15.5,
  "bodyType": "SUV",                  // SUV | Hatchback | Sedan | MPV
  "fuelType": "Petrol",              // Petrol | Diesel | Electric | CNG
  "transmission": "Automatic",       // Manual | Automatic
  "engineCC": 1497,
  "powerBhp": 115,
  "torqueNm": 144,
  "mileageKmpl": 17,                 // null for EVs
  "rangeKm": null,                   // for EVs only
  "safetyRating": 5,                 // out of 5 (GNCAP/BNCAP)
  "seatingCapacity": 5,
  "bootSpaceLitres": 433,
  "groundClearanceMm": 190,
  "features": ["sunroof", "adas", "wireless_charging", "ventilated_seats"],
  "pros": ["Feature-loaded", "Refined petrol engine", "Strong safety"],
  "cons": ["Turbo petrol lacks punch at low RPM", "Rear seat could be wider"],
  "imageUrl": "/images/creta.jpg"    // placeholder or real image URL
}
```

### Review Object (in reviews.json)

```js
{
  "carId": "creta-sx-petrol",
  "reviewerName": "Amit K.",
  "rating": 4,
  "ownershipMonths": 8,
  "reviewText": "Great features for the price. Mileage is around 14 in city though.",
  "drivingPattern": "mixed"          // city | highway | mixed
}
```

### Seed Data Targets

~40 cars across these segments. Real Indian market specs, 2024-2025 models:

- **Budget hatchbacks (4-8L):** Alto K10, Swift, Baleno, i20, Altroz, Glanza
- **Compact SUVs (8-15L):** Venue, Creta, Nexon, Punch, Sonet, Seltos, Brezza, WR-V
- **Mid SUVs (15-25L):** XUV700, Scorpio N, Thar, Harrier, Safari, Hector
- **Sedans (8-18L):** City, Ciaz, Verna, Virtus
- **EVs (10-25L):** Nexon EV, ZS EV, XUV400, Tiago EV

2-3 variants per popular model. 2-3 reviews per car.

## Core Feature: Quiz → Score → Shortlist

### Quiz Questions (5 steps, one per screen)

**Q1: Budget**

> "How much are you looking to spend?"

- Under ₹8 lakh
- ₹8 – 12 lakh
- ₹12 – 18 lakh
- ₹18 – 25 lakh

**Q2: Primary Use**

> "What will you mostly use this car for?"

- Daily city commute
- Family trips & weekend getaways
- Long highway drives
- A mix of everything

**Q3: Top Priorities (pick 2)**

> "What matters most to you?"

- Fuel efficiency / low running cost
- Safety ratings & features
- Powerful engine / fun to drive
- Space & comfort
- Latest tech & features

**Q4: Fuel Preference**

> "Any fuel type preference?"

- Petrol
- Diesel
- Electric
- No preference

**Q5: Transmission**

> "Gear preference?"

- Manual
- Automatic
- No preference

### Scoring Engine (the real backend logic)

This is NOT a filter. It's a weighted scorer. Every car gets a score 0-100. Partial matches still appear, ranked lower.

```
server/services/quizScorer.js
```

**Scoring weights:**

| Criterion    | Max Points | Logic                                                                                                                       |
| ------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| Budget match | 30         | In range = 30. Up to 2L over = 15. Way out = 0.                                                                             |
| Use-case fit | 25         | Body type + spec alignment (city→hatchback+good mileage, family→SUV/MPV+boot space, highway→power+sedan/SUV)                |
| Priority #1  | 15         | Spec matches the priority (efficiency→mileage≥18, safety→rating≥4, power→bhp≥120, space→boot≥400+seats, tech→feature count) |
| Priority #2  | 10         | Same as above, second priority                                                                                              |
| Fuel match   | 10         | Exact match = 10. "No preference" = 10 for all.                                                                             |
| Transmission | 10         | Exact match = 10. "No preference" = 10 for all.                                                                             |

```js
function scoreCarForQuiz(car, answers) {
  let score = 0;

  // Budget: check if car.priceLakh falls in selected range
  score += scoreBudget(car.priceLakh, answers.budget);

  // Use-case: check body type + relevant specs
  score += scoreUseCase(car, answers.primaryUse);

  // Priorities: check the two selected priorities
  score += scorePriority(car, answers.priorities[0], 15);
  score += scorePriority(car, answers.priorities[1], 10);

  // Fuel
  score += scoreExactOrNoPreference(car.fuelType, answers.fuel, 10);

  // Transmission
  score += scoreExactOrNoPreference(car.transmission, answers.transmission, 10);

  return score;
}
```

Return all cars with score > 0, sorted descending. Frontend shows top matches with score-based tags: "Great Match" (80+), "Good Match" (60-79), "Worth a Look" (40-59).

### Use-Case → Spec Mapping

```js
const useCaseProfile = {
  "city-commute": {
    preferredBody: ["Hatchback", "SUV"],
    mileageMin: 18,
    label: "city-friendly",
  },
  "family-trips": {
    preferredBody: ["SUV", "MPV"],
    seatingMin: 5,
    bootMin: 350,
    label: "family-ready",
  },
  highway: {
    preferredBody: ["SUV", "Sedan"],
    powerMin: 100,
    label: "highway-capable",
  },
  mixed: {
    preferredBody: ["SUV", "Sedan", "Hatchback"],
    label: "all-rounder",
  },
};
```

## Car Summaries — No LLM

No API calls. Each car already has `pros` and `cons` arrays in the seed data. The scoring engine is the intelligence — it ranks cars by fit and produces match/miss reasons from the score breakdown:

```js
// Returned alongside each scored car
matchReasons: [
  "Within your budget",
  "Great mileage for city use",
  "5-star safety rating",
];
missReasons: ["Manual only — you preferred automatic"];
```

These are deterministic, derived directly from which scoring criteria the car passed or failed. More trustworthy than generated text and zero external dependencies.

## API Endpoints

```
POST  /api/quiz/results     — body: { answers } → returns scored cars with matchReasons/missReasons
GET   /api/cars/:id          — single car + its reviews
POST  /api/compare           — body: { carIds, quizAnswers } → side-by-side comparison data
```

That's it. No shortlist endpoints — shortlist lives in React state (localStorage for persistence across refresh).

## Frontend Pages

### 1. Quiz Page (`/`)

- One question per screen, large tappable option cards
- Progress bar at top (Step 2 of 5)
- Smooth transitions between steps
- "Back" button on each step
- Final step shows "Find My Cars →" CTA

### 2. Results Page (`/results`)

- Header: "X cars match your preferences" with match quality breakdown
- Car cards in a grid, sorted by score
- Each card: image placeholder, make/model/variant, price, 2-3 highlighted specs relevant to their quiz answers, match tag (Great/Good/Worth a Look), shortlist heart icon
- "Retake Quiz" button
- Click card → expands to show full specs, pros/cons, match/miss reasons
- Compare button (if 2-3 cars shortlisted)

### 3. Compare View (modal or inline section)

- Side-by-side specs table for 2-3 selected cars
- Highlight where each car wins (green) or loses (red) relative to buyer's priorities

## UI Direction

- Clean, professional, minimal. Not a car dealership site.
- White/slate/blue palette. No gradients. No stock car imagery overload.
- Cards with subtle shadows, not borders.
- Typography: system font stack, clear hierarchy.
- Desktop-first, but responsive enough not to break on mobile.

## What NOT to Build

- No auth, no user accounts
- No database
- No admin panel
- No image upload
- No TypeScript (unless you're faster with it)
- No SSR
- No real-time chat with AI
- No payment/booking flow

## Build Order

1. **[15 min] Scaffold** — Vite + React + Tailwind, Express server, dev proxy config, hello-world running
2. **[20 min] Seed data** — Write cars.json and reviews.json with 40 real cars
3. **[35 min] Quiz flow** — Frontend quiz component (step-by-step) + POST endpoint + scoring engine with matchReasons/missReasons
4. **[30 min] Results page** — Car cards grid, match tags, match/miss reasons, sorting by score, shortlist toggle
5. **[15 min] Compare** — Side-by-side table for 2-3 shortlisted cars
6. **[15 min] Polish** — Loading states, empty states, error handling, transitions, README

## README Checklist

- [ ] What it does (one paragraph)
- [ ] How to run (`npm install && npm run dev`)
- [ ] Architecture decisions (why no database, why scoring over filtering, why no LLM)
- [ ] What you'd add with more time (LLM summaries, database, auth — the "nice-to-have" list for the email)
- [ ] Screen recording link
