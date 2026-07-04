export const EXPANDED_SPEC_ROWS = [
  { label: 'Price',            key: 'priceLakh',         format: v => v ? `₹${v} lakh` : '—' },
  { label: 'Engine',           key: 'engineCC',          format: (v, car) => car.fuelType === 'Electric' ? 'Electric motor' : v ? `${v} cc` : '—' },
  { label: 'Power',            key: 'powerBhp',          format: v => v ? `${v} bhp` : '—' },
  { label: 'Torque',           key: 'torqueNm',          format: v => v ? `${v} Nm` : '—' },
  { label: 'Mileage / Range',  key: '_mileageOrRange',   format: (_, car) => car.fuelType === 'Electric' ? (car.rangeKm ? `${car.rangeKm} km` : '—') : (car.mileageKmpl ? `${car.mileageKmpl} kmpl` : '—') },
  { label: 'Safety Rating',    key: 'safetyRating',      format: v => v ? `${v} ★ NCAP` : 'Unrated' },
  { label: 'Boot Space',       key: 'bootSpaceLitres',   format: v => v ? `${v} L` : '—' },
  { label: 'Seating',          key: 'seatingCapacity',   format: v => v ? `${v} seats` : '—' },
  { label: 'Ground Clearance', key: 'groundClearanceMm', format: v => v ? `${v} mm` : '—' },
  { label: 'Transmission',     key: 'transmission',      format: v => v || '—' },
  { label: 'Fuel Type',        key: 'fuelType',          format: v => v || '—' },
];

export const COMPARE_SPEC_ROWS = [
  { label: 'Price',             key: 'priceLakh',         format: v => v ? `₹${v} lakh` : '—' },
  { label: 'Engine',            key: 'engineCC',           format: v => v ? `${v} cc` : 'Electric' },
  { label: 'Power',             key: 'powerBhp',           format: v => v ? `${v} bhp` : '—' },
  { label: 'Torque',            key: 'torqueNm',           format: v => v ? `${v} Nm` : '—' },
  { label: 'Mileage / Range',   key: '_mileageOrRange',    format: (v, car) => {
    if (car.fuelType === 'Electric') return car.rangeKm ? `${car.rangeKm} km range` : '—';
    return car.mileageKmpl ? `${car.mileageKmpl} kmpl` : '—';
  }},
  { label: 'Safety Rating',     key: 'safetyRating',       format: v => v ? `${v} ★ NCAP` : 'Unrated' },
  { label: 'Boot Space',        key: 'bootSpaceLitres',    format: v => v ? `${v} L` : '—' },
  { label: 'Seating',           key: 'seatingCapacity',    format: v => v ? `${v} seats` : '—' },
  { label: 'Ground Clearance',  key: 'groundClearanceMm',  format: v => v ? `${v} mm` : '—' },
  { label: 'Transmission',      key: 'transmission',       format: v => v || '—' },
  { label: 'Fuel Type',         key: 'fuelType',           format: v => v || '—' },
];
