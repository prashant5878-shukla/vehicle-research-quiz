import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const cars = JSON.parse(
  readFileSync(join(__dirname, 'cars.json'), 'utf-8')
);

export const carsById = Object.fromEntries(cars.map((c) => [c.id, c]));

export const reviews = JSON.parse(
  readFileSync(join(__dirname, 'reviews.json'), 'utf-8')
);

export const reviewsByCarId = reviews.reduce((acc, r) => {
  if (!acc[r.carId]) acc[r.carId] = [];
  acc[r.carId].push(r);
  return acc;
}, {});
