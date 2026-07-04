import { Router } from 'express';
import { cars } from '../data/loadData.js';
import { scoreCarsForQuiz } from '../services/quizScorer.js';
import {
  VALID_BUDGETS,
  VALID_USES,
  VALID_FUELS,
  VALID_TRANS,
} from '../constants/quizValidation.js';

const router = Router();

/**
 * POST /api/quiz/results
 * Body: { answers: { budget, primaryUse, priorities, fuel, transmission } }
 * Returns: { results: [...scored cars] }
 */
router.post('/results', (req, res) => {
  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ error: 'answers is required' });
  }

  const { budget, primaryUse, priorities, fuel, transmission } = answers;

  if (!VALID_BUDGETS.includes(budget)) {
    return res.status(400).json({ error: `Invalid budget: ${budget}` });
  }
  if (!VALID_USES.includes(primaryUse)) {
    return res.status(400).json({ error: `Invalid primaryUse: ${primaryUse}` });
  }
  if (!Array.isArray(priorities) || priorities.length !== 2) {
    return res.status(400).json({ error: 'priorities must be an array of 2 items' });
  }
  if (!VALID_FUELS.includes(fuel)) {
    return res.status(400).json({ error: `Invalid fuel: ${fuel}` });
  }
  if (!VALID_TRANS.includes(transmission)) {
    return res.status(400).json({ error: `Invalid transmission: ${transmission}` });
  }

  const results = scoreCarsForQuiz(cars, answers);
  return res.json({ results });
});

export default router;
