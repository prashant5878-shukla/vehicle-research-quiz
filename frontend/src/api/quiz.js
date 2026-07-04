import axios from 'axios';

// In production (Render static site), VITE_API_URL is set to the backend URL.
// In local dev, falls back to '' so Vite's proxy handles /api/* → localhost:4000.
const BASE = import.meta.env.VITE_API_URL || '';

export const submitQuiz = (answers) =>
  axios.post(`${BASE}/api/quiz/results`, { answers }).then(r => r.data);

export const getCar = (id) =>
  axios.get(`${BASE}/api/cars/${id}`).then(r => r.data);

export const compareCars = (carIds, quizAnswers) =>
  axios.post(`${BASE}/api/compare`, { carIds, quizAnswers }).then(r => r.data);
