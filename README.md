# CarDekho Car Research Platform

A quiz-driven car recommendation tool for the Indian market. Overwhelmed buyers answer 5 questions → a scoring engine ranks 40+ real cars by fit → they get a confident shortlist with match explanations.

## How to Run

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
