import {
  BUDGET_RANGES,
  BUDGET_LABELS,
  CITY_BODIES,
  FAMILY_BODIES,
  HIGHWAY_BODIES,
  MATCH_TAG_THRESHOLDS,
} from '../constants/scoring.js';

function scoreBudget(car, budget) {
  const range = BUDGET_RANGES[budget];
  if (!range) return 0;
  if (car.priceLakh <= range.max) return 30;
  if (car.priceLakh <= range.max + 2) return 15;
  return 0;
}

function scoreUseCase(car, primaryUse) {
  let score = 0;
  const body = car.bodyType;
  const mileage = car.mileageKmpl;
  const power = car.powerBhp;
  const seats = car.seatingCapacity;
  const boot = car.bootSpaceLitres;

  switch (primaryUse) {
    case 'city-commute':
      if (CITY_BODIES.includes(body)) score += 15;
      if (mileage != null && mileage >= 18) score += 10;
      break;

    case 'family-trips':
      if (FAMILY_BODIES.includes(body)) score += 15;
      if (seats >= 5) score += 5;
      if (boot >= 350) score += 5;
      break;

    case 'highway':
      if (HIGHWAY_BODIES.includes(body)) score += 15;
      if (power >= 100) score += 10;
      break;

    case 'mixed':
      score += 15;
      if ((mileage == null || mileage >= 15) && power >= 80) score += 10;
      break;

    default:
      break;
  }

  return score;
}

function meetsPriority(car, priority) {
  switch (priority) {
    case 'efficiency':
      return car.mileageKmpl != null && car.mileageKmpl >= 18;
    case 'safety':
      return car.safetyRating >= 4;
    case 'power':
      return car.powerBhp >= 120;
    case 'space':
      return car.bootSpaceLitres >= 400 && car.seatingCapacity >= 5;
    case 'tech':
      return Array.isArray(car.features) && car.features.length >= 5;
    default:
      return false;
  }
}

function scorePriority(car, priorities) {
  const [p1, p2] = priorities;
  let score = 0;
  if (p1 && meetsPriority(car, p1)) score += 15;
  if (p2 && meetsPriority(car, p2)) score += 10;
  return score;
}

function scoreFuel(car, fuel) {
  if (fuel === 'no-preference') return 10;
  return car.fuelType === fuel ? 10 : 0;
}

function scoreTransmission(car, transmission) {
  if (transmission === 'no-preference') return 10;
  return car.transmission === transmission ? 10 : 0;
}

export function scoreCarForQuiz(car, answers) {
  const { budget, primaryUse, priorities = [], fuel, transmission } = answers;

  const budgetScore       = scoreBudget(car, budget);
  const useCaseScore      = scoreUseCase(car, primaryUse);
  const priorityScore     = scorePriority(car, priorities);
  const fuelScore         = scoreFuel(car, fuel);
  const transmissionScore = scoreTransmission(car, transmission);

  const total =
    budgetScore + useCaseScore + priorityScore + fuelScore + transmissionScore;

  return {
    total,
    budget:       budgetScore,
    useCase:      useCaseScore,
    priority:     priorityScore,
    fuel:         fuelScore,
    transmission: transmissionScore,
  };
}

export function generateMatchReasons(car, answers, scoreBreakdown) {
  const reasons = [];
  const { budget, primaryUse, priorities = [], fuel, transmission } = answers;
  const { budget: bs, useCase: us, fuel: fs, transmission: ts } = scoreBreakdown;

  if (bs === 30) {
    reasons.push(`Within your ${BUDGET_LABELS[budget]} budget`);
  } else if (bs === 15) {
    reasons.push(`Close to your ${BUDGET_LABELS[budget]} budget (₹${car.priceLakh}L)`);
  }

  if (us > 0) {
    switch (primaryUse) {
      case 'city-commute':
        if (CITY_BODIES.includes(car.bodyType)) {
          reasons.push(`${car.bodyType} — great for city driving`);
        }
        if (car.mileageKmpl != null && car.mileageKmpl >= 18) {
          reasons.push(`Great mileage (${car.mileageKmpl} kmpl) for city use`);
        }
        break;

      case 'family-trips':
        if (FAMILY_BODIES.includes(car.bodyType)) {
          reasons.push(`${car.bodyType} — suited for family trips`);
        }
        if (car.seatingCapacity >= 5) {
          reasons.push(`${car.seatingCapacity}-seat cabin fits the whole family`);
        }
        if (car.bootSpaceLitres >= 350) {
          reasons.push(`Generous ${car.bootSpaceLitres}L boot for luggage`);
        }
        break;

      case 'highway':
        if (HIGHWAY_BODIES.includes(car.bodyType)) {
          reasons.push(`${car.bodyType} — comfortable on highways`);
        }
        if (car.powerBhp >= 100) {
          reasons.push(`${car.powerBhp} bhp engine handles highway speeds with ease`);
        }
        break;

      case 'mixed':
        reasons.push(`Versatile ${car.bodyType} for mixed use`);
        if (car.mileageKmpl != null && car.mileageKmpl >= 15 && car.powerBhp >= 80) {
          reasons.push(`Balanced performance and efficiency`);
        }
        break;
    }
  }

  const [p1, p2] = priorities;

  const addPriorityReason = (priority) => {
    if (!priority || !meetsPriority(car, priority)) return;
    switch (priority) {
      case 'efficiency':
        reasons.push(`Excellent mileage (${car.mileageKmpl} kmpl) — efficiency priority met`);
        break;
      case 'safety':
        reasons.push(`${car.safetyRating}-star safety rating`);
        break;
      case 'power':
        reasons.push(`${car.powerBhp} bhp — strong performance`);
        break;
      case 'space':
        reasons.push(`${car.bootSpaceLitres}L boot + ${car.seatingCapacity} seats — spacious`);
        break;
      case 'tech':
        reasons.push(`Feature-rich: ${car.features.length} comfort/tech features`);
        break;
    }
  };

  addPriorityReason(p1);
  if (p2 !== p1) addPriorityReason(p2);

  if (fs === 10 && fuel !== 'no-preference') {
    reasons.push(`${car.fuelType} as preferred`);
  }

  if (ts === 10 && transmission !== 'no-preference') {
    reasons.push(`${car.transmission} transmission as preferred`);
  }

  return reasons;
}

export function generateMissReasons(car, answers, scoreBreakdown) {
  const reasons = [];
  const { budget, primaryUse, priorities = [], fuel, transmission } = answers;
  const { budget: bs, useCase: us, fuel: fs, transmission: ts } = scoreBreakdown;

  if (bs === 15) {
    reasons.push(`Slightly over budget (₹${car.priceLakh}L)`);
  } else if (bs === 0) {
    reasons.push(`Over your ${BUDGET_LABELS[budget]} budget (₹${car.priceLakh}L)`);
  }

  if (us < 10) {
    switch (primaryUse) {
      case 'city-commute':
        if (car.mileageKmpl != null && car.mileageKmpl < 18) {
          reasons.push(`Lower mileage (${car.mileageKmpl} kmpl) than ideal for city use`);
        }
        break;

      case 'family-trips':
        if (car.bootSpaceLitres < 350) {
          reasons.push(`Smaller boot (${car.bootSpaceLitres}L) for family luggage`);
        }
        break;

      case 'highway':
        if (car.powerBhp < 100) {
          reasons.push(`${car.powerBhp} bhp may feel underpowered on highways`);
        }
        break;
    }
  }

  const [p1, p2] = priorities;
  if (p1 && !meetsPriority(car, p1)) {
    switch (p1) {
      case 'efficiency':
        if (car.mileageKmpl != null) {
          reasons.push(`Mileage (${car.mileageKmpl} kmpl) below your efficiency target`);
        }
        break;
      case 'safety':
        reasons.push(`${car.safetyRating}-star safety — below your safety priority`);
        break;
      case 'power':
        reasons.push(`${car.powerBhp} bhp — below your power preference`);
        break;
      case 'space':
        if (car.bootSpaceLitres < 400) {
          reasons.push(`Boot (${car.bootSpaceLitres}L) smaller than your space requirement`);
        }
        break;
      case 'tech':
        reasons.push(`Fewer features (${car.features.length}) than your tech preference`);
        break;
    }
  }
  if (p2 && !meetsPriority(car, p2)) {
    switch (p2) {
      case 'efficiency':
        if (car.mileageKmpl != null && !reasons.some(r => r.includes('kmpl'))) {
          reasons.push(`Mileage (${car.mileageKmpl} kmpl) below efficiency target`);
        }
        break;
      case 'safety':
        if (!reasons.some(r => r.includes('safety'))) {
          reasons.push(`${car.safetyRating}-star safety — below your safety priority`);
        }
        break;
      case 'power':
        if (!reasons.some(r => r.includes('bhp'))) {
          reasons.push(`${car.powerBhp} bhp — below your power preference`);
        }
        break;
      case 'space':
        if (car.bootSpaceLitres < 400 && !reasons.some(r => r.includes('Boot'))) {
          reasons.push(`Boot (${car.bootSpaceLitres}L) smaller than your space requirement`);
        }
        break;
      case 'tech':
        if (!reasons.some(r => r.includes('feature'))) {
          reasons.push(`Fewer features (${car.features.length}) than your tech preference`);
        }
        break;
    }
  }

  if (fs === 0 && fuel !== 'no-preference') {
    reasons.push(`${car.fuelType} only — you preferred ${fuel}`);
  }

  if (ts === 0 && transmission !== 'no-preference') {
    reasons.push(`${car.transmission} only — you preferred ${transmission}`);
  }

  return reasons;
}

function getMatchTag(score) {
  if (score >= MATCH_TAG_THRESHOLDS.great) return 'Great Match';
  if (score >= MATCH_TAG_THRESHOLDS.good) return 'Good Match';
  if (score >= MATCH_TAG_THRESHOLDS.worth) return 'Worth a Look';
  return null;
}

export function scoreCarsForQuiz(cars, answers) {
  return cars
    .map((car) => {
      const breakdown = scoreCarForQuiz(car, answers);
      const score = breakdown.total;
      if (score <= 0) return null;

      const matchTag    = getMatchTag(score);
      const matchReasons = generateMatchReasons(car, answers, breakdown);
      const missReasons  = generateMissReasons(car, answers, breakdown);

      return {
        ...car,
        score,
        matchTag,
        matchReasons,
        missReasons,
        scoreBreakdown: breakdown,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}
