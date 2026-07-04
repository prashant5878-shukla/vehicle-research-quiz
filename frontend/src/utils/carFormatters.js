export function formatPrice(lakh) {
  if (!lakh) return '—';
  return `₹${lakh} lakh`;
}

export function getSpecBadges(car) {
  const badges = [];
  if (car.fuelType === 'Electric') {
    badges.push({ label: car.rangeKm ? `${car.rangeKm} km range` : '—' });
  } else {
    badges.push({ label: car.mileageKmpl ? `${car.mileageKmpl} kmpl` : '—' });
  }
  badges.push({ label: car.powerBhp ? `${car.powerBhp} bhp` : '—' });
  badges.push({ label: car.safetyRating ? `${car.safetyRating}★ safety` : 'Unrated' });
  return badges;
}
