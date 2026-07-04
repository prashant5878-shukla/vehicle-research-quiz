export function getMatchTag(score) {
  if (score >= 75) return 'Great Match';
  if (score >= 50) return 'Good Match';
  return 'Worth a Look';
}

export const MATCH_TAG_STYLES = {
  'Great Match':  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  'Good Match':   'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100',
  'Worth a Look': 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

export const COUNT_PILL_STYLES = {
  'Great Match':  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  'Good Match':   'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100',
  'Worth a Look': 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

export const MATCH_TAG_ORDER = ['Great Match', 'Good Match', 'Worth a Look'];

export const COMPARE_MATCH_TAG_STYLES = {
  'Great Match': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  'Good Match':  'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100',
  'Worth a Look':'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};
