# CarDekho Car Research Platform

A quiz-driven car recommendation tool for the Indian market. Overwhelmed buyers answer 5 questions → a scoring engine ranks 40+ real cars by fit → they get a confident shortlist with match explanations.

## How to Run

**Quickest way:**

```bash
./start.sh
```

That's it — runs `docker compose up --build` for you. Then open http://localhost:3000.

**With Docker (manually):**

```bash
docker compose up --build
```

Then open http://localhost:3000

No Node, no npm, no env vars required.

**Without Docker (local dev):**

```bash
# Terminal 1 — backend
cd backend
npm install
npm run dev

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000

## Architecture Decisions

**No database** — 40 cars, read-only data, no user accounts. JSON files loaded into memory on start. Zero config, zero setup friction for reviewers.

**Scoring over filtering** — Filtering kills results for edge cases. Every car gets a weighted score (0-100) so partial matches still surface, ranked lower. Buyers see what fits and *why*.

**No LLM** — Match/miss reasons are deterministic strings derived from which scoring criteria passed or failed. More trustworthy (no hallucinations), faster (no API latency), free (no API key).

**React state for shortlist** — Shortlist lives in localStorage. No backend endpoint needed. Simple, works offline, persists across refresh.

## What I'd Add With More Time

- LLM-generated personalized summaries (GPT-4o or Claude) explaining each car in the buyer's context
- Database + user accounts to save quiz results and compare sessions
- Real car images (CarDekho CDN)
- EMI calculator per car based on budget answer
- Dealer lead form integration
- More quiz dimensions: ownership history, parking constraints, family size
- Test drive booking CTA

## Future Enhancements

**AI Chat Assistant** — A conversational interface where buyers can ask follow-up questions in natural language after getting their shortlist (e.g. "Does the Nexon have a sunroof?" or "Which of these is better for highway driving?"). The deterministic scoring engine is intentional — every match/miss reason ties directly to a quiz answer, which makes it transparent and traceable. An LLM-backed chat layer would sit on top of that for open-ended queries the fixed quiz can't anticipate, without replacing the scoring logic itself.

**Admin Panel for Car Data** — The car catalog is currently a static JSON file loaded into memory at startup — the right call for a read-only, zero-config demo. With more time this would be replaced by an admin interface where the team can add, edit, or remove car specs and adjust scoring weights without touching code or redeploying. That's also the natural point to move from in-memory JSON to a lightweight persistent store (SQLite or Postgres).
