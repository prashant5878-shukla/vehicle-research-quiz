import { getMatchTag, MATCH_TAG_STYLES } from '../../constants/matchTags';
import { formatPrice, getSpecBadges } from '../../utils/carFormatters';
import HeartIcon from '../icons/HeartIcon';
import ScoreBar from './ScoreBar';
import SpecBadge from './SpecBadge';
import ExpandedDetail from './ExpandedDetail';

export default function CarCard({ car, isShortlisted, onToggleShortlist, isExpanded, onToggleExpand }) {
  const tag = getMatchTag(car.score);
  const badges = getSpecBadges(car);
  const matchReasons = (car.matchReasons || []).slice(0, 3);
  const missReasons = (car.missReasons || []).slice(0, 2);

  function handleCardClick(e) {
    if (e.target.closest('[data-no-expand]')) return;
    onToggleExpand(car.id);
  }

  return (
    <div
      onClick={handleCardClick}
      className={[
        'relative bg-white rounded-xl cursor-pointer',
        'transition-all duration-200',
        isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md',
      ].join(' ')}
    >
      <button
        data-no-expand
        onClick={e => { e.stopPropagation(); onToggleShortlist(car.id); }}
        className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        title={isShortlisted ? 'Remove from shortlist' : 'Save to shortlist'}
      >
        <HeartIcon filled={isShortlisted} />
      </button>

      <div className="p-5 pr-12">

        <div className="mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${MATCH_TAG_STYLES[tag]}`}>
            {tag}
          </span>
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {car.make} {car.model}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{car.variant}</p>
          <p className="text-xl font-bold text-gray-900 mt-1.5">{formatPrice(car.priceLakh)}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {badges.map((b, i) => (
            <SpecBadge key={i} label={b.label} />
          ))}
        </div>

        <ScoreBar score={car.score} />

        {matchReasons.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {matchReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="flex-shrink-0 text-green-600 font-bold mt-0.5">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}

        {missReasons.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {missReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-500">
                <span className="flex-shrink-0 mt-0.5">⚠</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}

        <button
          data-no-expand
          onClick={e => { e.stopPropagation(); onToggleExpand(car.id); }}
          className="mt-4 flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition-all duration-200 cursor-pointer"
        >
          <svg
            className={`w-4 h-4 transition-all duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          {isExpanded ? 'Hide details' : 'Show full specs'}
        </button>

        {isExpanded && <ExpandedDetail car={car} />}
      </div>
    </div>
  );
}
