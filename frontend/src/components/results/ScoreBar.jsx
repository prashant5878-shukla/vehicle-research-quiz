export default function ScoreBar({ score }) {
  const pct = Math.min(100, Math.max(0, score));
  const fillColor = pct >= 75 ? 'bg-blue-600' : 'bg-amber-500';
  return (
    <div className="flex items-center gap-3 mt-3">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className={`${fillColor} h-2 rounded-full transition-all duration-200`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-500 w-8 text-right flex-shrink-0">{pct}%</span>
    </div>
  );
}
