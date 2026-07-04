import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import quizRouter    from './routes/quiz.js';
import carsRouter    from './routes/cars.js';
import compareRouter from './routes/compare.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/quiz',    quizRouter);
app.use('/api/cars',    carsRouter);
app.use('/api/compare', compareRouter);

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
