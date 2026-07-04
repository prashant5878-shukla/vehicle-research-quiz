export default function ScoreBar({ score }) {
  const pct = Math.min(100, Math.max(0, score));
  const fillColor = pct >= 75 ? 'bg-indigo-600' : 'bg-amber-500';

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`${fillColor} h-1.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-500 tabular-nums w-9 text-right shrink-0">
        {pct}%
      </span>
    </div>
  );
}
