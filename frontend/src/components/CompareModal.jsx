import { useEffect } from 'react';
import { getMatchTag, COMPARE_MATCH_TAG_STYLES } from '../constants/matchTags';
import { COMPARE_SPEC_ROWS } from '../constants/specRows';

export default function CompareModal({ cars, highlights, quizAnswers, onClose, shortlist, onToggleShortlist }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!cars || cars.length === 0) return null;

  const wins = highlights?.wins || {};
  const losses = highlights?.losses || {};

  function getCellClass(carId, specKey) {
    if (wins[carId]?.includes(specKey)) return 'bg-green-50 text-green-800 font-medium';
    if (losses[carId]?.includes(specKey)) return 'bg-rose-50 text-rose-700';
    return 'text-slate-700';
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-8 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl min-h-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Side-by-Side Comparison</h2>
            <p className="text-sm text-slate-500">Comparing {cars.length} cars</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-4 px-5 text-sm font-semibold text-slate-500 w-36">Spec</th>
                {cars.map(car => {
                  const tag = getMatchTag(car.score);
                  const isShortlisted = shortlist?.has(car.id);
                  return (
                    <th key={car.id} className="py-4 px-5 text-left min-w-48">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">
                            {car.make} {car.model}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{car.variant}</p>
                          <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${COMPARE_MATCH_TAG_STYLES[tag]}`}>
                            {tag}
                          </span>
                        </div>
                        {onToggleShortlist && (
                          <button
                            onClick={() => onToggleShortlist(car.id)}
                            className="flex-shrink-0 mt-0.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                            title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                          >
                            <svg
                              className={`w-5 h-5 transition-colors ${isShortlisted ? 'text-red-500 fill-red-500' : 'text-slate-300 fill-none'}`}
                              stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {COMPARE_SPEC_ROWS.map((row, i) => (
                <tr key={row.key} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="py-3 px-5 text-sm font-medium text-slate-500 whitespace-nowrap">
                    {row.label}
                  </td>
                  {cars.map(car => {
                    const displayValue = row.key === '_mileageOrRange'
                      ? row.format(null, car)
                      : row.format(car[row.key], car);
                    const cellClass = getCellClass(car.id, row.key === '_mileageOrRange' ? (car.fuelType === 'Electric' ? 'rangeKm' : 'mileageKmpl') : row.key);
                    return (
                      <td key={car.id} className={`py-3 px-5 text-sm ${cellClass}`}>
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr className="bg-white border-t border-slate-100">
                <td className="py-3 px-5 text-sm font-medium text-slate-500 align-top whitespace-nowrap">
                  Key Features
                </td>
                {cars.map(car => (
                  <td key={car.id} className="py-3 px-5 align-top">
                    <div className="flex flex-wrap gap-1">
                      {(car.features || []).slice(0, 6).map(f => (
                        <span key={f} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
