import { Router } from 'express';
import { carsById } from '../data/loadData.js';
import { NUMERIC_COMPARE_FIELDS } from '../constants/compare.js';

const router = Router();

/**
 * POST /api/compare
 * Body: { carIds: string[], quizAnswers?: object }
 * Returns: { cars: [...], highlights: { [carId]: { wins: string[], losses: string[] } } }
 */
router.post('/', (req, res) => {
  const { carIds, quizAnswers } = req.body;

  if (!Array.isArray(carIds) || carIds.length < 2) {
    return res.status(400).json({ error: 'carIds must be an array of at least 2 IDs' });
  }

  const selectedCars = carIds.map((id) => carsById[id]).filter(Boolean);

  if (selectedCars.length !== carIds.length) {
    const missing = carIds.filter((id) => !carsById[id]);
    return res.status(404).json({ error: `Cars not found: ${missing.join(', ')}` });
  }

  const highlights = Object.fromEntries(
    selectedCars.map((c) => [c.id, { wins: [], losses: [] }])
  );

  for (const { field, lowerIsBetter } of NUMERIC_COMPARE_FIELDS) {
    const values = selectedCars
      .map((c) => ({ id: c.id, value: c[field] }))
      .filter((entry) => entry.value != null);

    if (values.length < 2) continue;

    const bestValue = lowerIsBetter
      ? Math.min(...values.map((v) => v.value))
      : Math.max(...values.map((v) => v.value));

    const allSame = values.every((v) => v.value === bestValue);
    if (allSame) continue;

    for (const { id, value } of values) {
      if (value === bestValue) {
        highlights[id].wins.push(field);
      } else {
        highlights[id].losses.push(field);
      }
    }
  }

  return res.json({ cars: selectedCars, highlights });
});

export default router;
