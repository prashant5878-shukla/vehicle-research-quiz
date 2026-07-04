import { EXPANDED_SPEC_ROWS } from '../../constants/specRows';

export default function ExpandedDetail({ car }) {
  return (
    <div className="mt-5 pt-5 border-t border-gray-100">

      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Full Specifications</h4>
      <div className="rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {EXPANDED_SPEC_ROWS.map((row, i) => {
              const value = row.key === '_mileageOrRange'
                ? row.format(null, car)
                : row.format(car[row.key], car);
              return (
                <tr key={row.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-3 text-gray-400 font-medium w-40 text-xs">{row.label}</td>
                  <td className="py-2 px-3 text-gray-800 text-sm font-medium">{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2.5">Pros</h4>
          <ul className="space-y-2">
            {(car.pros || []).map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2.5">Cons</h4>
          <ul className="space-y-2">
            {(car.cons || []).map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center text-xs font-bold">✗</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(car.matchReasons?.length > 0 || car.missReasons?.length > 0) && (
        <div className="mt-5">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2.5">Match Analysis</h4>
          <div className="space-y-1.5">
            {(car.matchReasons || []).map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-green-600">
                <span className="flex-shrink-0 mt-0.5">✅</span>
                <span>{r}</span>
              </div>
            ))}
            {(car.missReasons || []).map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-amber-500">
                <span className="flex-shrink-0 mt-0.5">⚠️</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
