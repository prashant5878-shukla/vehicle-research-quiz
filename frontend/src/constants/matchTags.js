export function getMatchTag(score) {
  if (score >= 75) return 'Great Match';
  if (score >= 50) return 'Good Match';
  return 'Worth a Look';
}

export const MATCH_TAG_STYLES = {
  'Great Match':  'bg-green-100 text-green-700',
  'Good Match':   'bg-blue-100 text-blue-700',
  'Worth a Look': 'bg-gray-100 text-gray-500',
};

export const COUNT_PILL_STYLES = {
  'Great Match':  'bg-green-100 text-green-700',
  'Good Match':   'bg-blue-100 text-blue-700',
  'Worth a Look': 'bg-gray-100 text-gray-500',
};

export const MATCH_TAG_ORDER = ['Great Match', 'Good Match', 'Worth a Look'];

export const COMPARE_MATCH_TAG_STYLES = {
  'Great Match': 'bg-green-100 text-green-700',
  'Good Match':  'bg-blue-100 text-blue-700',
  'Worth a Look':'bg-slate-100 text-slate-600',
};
