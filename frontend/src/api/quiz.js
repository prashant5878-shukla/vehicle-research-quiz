import axios from 'axios';

// Strip trailing slash to avoid double-slash in URLs like //api/quiz/results
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const submitQuiz = (answers) =>
  axios.post(`${BASE}/api/quiz/results`, { answers }).then(r => r.data);

export const getCar = (id) =>
  axios.get(`${BASE}/api/cars/${id}`).then(r => r.data);

export const compareCars = (carIds, quizAnswers) =>
  axios.post(`${BASE}/api/compare`, { carIds, quizAnswers }).then(r => r.data);
