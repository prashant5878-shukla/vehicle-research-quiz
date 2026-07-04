export default function SpecBadge({ label }) {
  return (
    <span className="inline-flex items-center bg-slate-100 text-slate-700 rounded-lg px-4 py-2 text-xs font-semibold ring-1 ring-slate-200/80">
      {label}
    </span>
  );
}
