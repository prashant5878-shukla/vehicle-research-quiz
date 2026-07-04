import { EXPANDED_SPEC_ROWS } from '../../constants/specRows';

export default function ExpandedDetail({ car }) {
  return (
    <div className="mt-4 pt-8 border-t border-slate-100 space-y-8">

      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Full Specifications</h4>
        <div className="rounded-xl overflow-hidden ring-1 ring-slate-100">
          <table className="w-full text-sm">
            <tbody>
              {EXPANDED_SPEC_ROWS.map((row, i) => {
                const value = row.key === '_mileageOrRange'
                  ? row.format(null, car)
                  : row.format(car[row.key], car);
                return (
                  <tr key={row.key} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}>
                    <td className="py-4 px-5 text-slate-400 font-medium w-40 text-xs">{row.label}</td>
                    <td className="py-4 px-5 text-slate-800 text-sm font-semibold">{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Pros</h4>
          <ul className="space-y-3">
            {(car.pros || []).map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold ring-1 ring-emerald-100">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Cons</h4>
          <ul className="space-y-3">
            {(car.cons || []).map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold ring-1 ring-amber-100">✗</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(car.matchReasons?.length > 0 || car.missReasons?.length > 0) && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Match Analysis</h4>
          <div className="space-y-3">
            {(car.matchReasons || []).map((r, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-emerald-700 leading-relaxed">
                <span className="shrink-0 mt-0.5">✅</span>
                <span>{r}</span>
              </div>
            ))}
            {(car.missReasons || []).map((r, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-amber-700 leading-relaxed">
                <span className="shrink-0 mt-0.5">⚠️</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
