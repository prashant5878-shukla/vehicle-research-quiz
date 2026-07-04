import axios from 'axios';

export const submitQuiz = (answers) =>
  axios.post('/api/quiz/results', { answers }).then(r => r.data);

export const getCar = (id) =>
  axios.get(`/api/cars/${id}`).then(r => r.data);

export const compareCars = (carIds, quizAnswers) =>
  axios.post('/api/compare', { carIds, quizAnswers }).then(r => r.data);
