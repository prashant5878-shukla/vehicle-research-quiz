import { Router } from 'express';
import { carsById, reviewsByCarId } from '../data/loadData.js';

const router = Router();

/**
 * GET /api/cars/:id
 * Returns: { car, reviews }
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const car = carsById[id];

  if (!car) {
    return res.status(404).json({ error: `Car not found: ${id}` });
  }

  const carReviews = reviewsByCarId[id] ?? [];
  return res.json({ car, reviews: carReviews });
});

export default router;
