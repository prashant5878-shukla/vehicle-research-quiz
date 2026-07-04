import { getMatchTag, MATCH_TAG_STYLES } from "../../constants/matchTags";
import { formatPrice, getSpecBadges } from "../../utils/carFormatters";
import HeartIcon from "../icons/HeartIcon";
import ScoreBar from "./ScoreBar";
import SpecBadge from "./SpecBadge";
import ExpandedDetail from "./ExpandedDetail";

export default function CarCard({
  car,
  isShortlisted,
  onToggleShortlist,
  isExpanded,
  onToggleExpand,
}) {
  const tag = getMatchTag(car.score);
  const badges = getSpecBadges(car);
  const matchReasons = (car.matchReasons || []).slice(0, 3);
  const missReasons = (car.missReasons || []).slice(0, 2);

  function handleCardClick(e) {
    if (e.target.closest("[data-no-expand]")) return;
    onToggleExpand(car.id);
  }

  return (
    <div
      onClick={handleCardClick}
      className={[
        "relative card-surface card-surface-hover cursor-pointer overflow-hidden px-5",
        isExpanded ? "ring-2 ring-indigo-200" : "",
      ].join(" ")}
    >
      <button
        data-no-expand
        onClick={(e) => {
          e.stopPropagation();
          onToggleShortlist(car.id);
        }}
        className="absolute top-6 right-6 z-10 p-2.5 rounded-full hover:bg-slate-100 transition-all duration-200 cursor-pointer"
        title={isShortlisted ? "Remove from shortlist" : "Save to shortlist"}
      >
        <HeartIcon filled={isShortlisted} />
      </button>

      <div className="p-6 sm:p-8 pr-16 sm:pr-20 flex flex-col gap-6">
        {/* Match tag */}
        <div>
          <span
            className={`inline-flex text-xs font-semibold px-4 py-2 rounded-full ${MATCH_TAG_STYLES[tag]}`}
          >
            {tag}
          </span>
        </div>

        {/* Identity block */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
            {car.make} {car.model}
          </h3>
          <p className="text-sm text-slate-500 font-medium">{car.variant}</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight pt-2">
            {formatPrice(car.priceLakh)}
          </p>
        </div>

        {/* Spec chips */}
        <div className="flex flex-wrap gap-3">
          {badges.map((b, i) => (
            <SpecBadge key={i} label={b.label} />
          ))}
        </div>

        {/* Match score */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Match score
          </p>
          <ScoreBar score={car.score} />
        </div>

        {/* Reasons */}
        {(matchReasons.length > 0 || missReasons.length > 0) && (
          <div className="space-y-4 pt-2">
            {matchReasons.length > 0 && (
              <ul className="space-y-3">
                {matchReasons.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
                  >
                    <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold ring-1 ring-emerald-100">
                      ✓
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
            {missReasons.length > 0 && (
              <ul className="space-y-3">
                {missReasons.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-amber-700 leading-relaxed"
                  >
                    <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 text-amber-600 text-xs ring-1 ring-amber-100">
                      !
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Expand toggle */}
        <button
          data-no-expand
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(car.id);
          }}
          className={[
            "mt-2 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 cursor-pointer",
            "text-indigo-600 hover:text-indigo-800",
            "p-[20px] rounded-xl bg-indigo-50 hover:bg-indigo-100 ring-1 ring-indigo-100",
          ].join(" ")}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          {isExpanded ? "Hide details" : "Show full specs"}
        </button>

        {isExpanded && <ExpandedDetail car={car} />}
      </div>
    </div>
  );
}
