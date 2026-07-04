import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { compareCars } from '../api/quiz';
import CompareModal from '../components/CompareModal';
import CarCard from '../components/results/CarCard';
import { getMatchTag, COUNT_PILL_STYLES, MATCH_TAG_ORDER } from '../constants/matchTags';

export default function ResultsPage() {
  const navigate = useNavigate();

  const [results, setResults]       = useState(null);
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [shortlist, setShortlist]   = useState(() => {
    try {
      const saved = localStorage.getItem('carShortlist');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch { return new Set(); }
  });
  const [expandedId, setExpandedId]         = useState(null);
  const [compareData, setCompareData]       = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError]     = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('quizResults');
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults(data.results || data.cars || []);
          setQuizAnswers(data.answers || null);
        }
      }
    } catch {
      // malformed storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carShortlist', JSON.stringify([...shortlist]));
  }, [shortlist]);

  function toggleShortlist(id) {
    setShortlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleExpand(id) {
    setExpandedId(prev => prev === id ? null : id);
  }

  async function handleCompare() {
    if (shortlist.size < 2) return;
    setCompareLoading(true);
    setCompareError(null);
    try {
      const data = await compareCars([...shortlist], quizAnswers);
      setCompareData(data);
    } catch {
      setCompareError('Failed to load comparison. Please try again.');
    } finally {
      setCompareLoading(false);
    }
  }

  if (results === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 gap-4">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-bold text-gray-800">No results yet</h2>
        <p className="text-sm text-gray-400">Complete the quiz to see your personalised car list.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 cursor-pointer shadow-sm"
        >
          Take the Quiz →
        </button>
      </div>
    );
  }

  const counts = results.reduce((acc, car) => {
    const tag = getMatchTag(car.score);
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const shortlistCars = results.filter(c => shortlist.has(c.id));

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {results.length} cars match your preferences
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {MATCH_TAG_ORDER.map(tag =>
                counts[tag] ? (
                  <span key={tag} className={`text-xs font-semibold px-3 py-1 rounded-full ${COUNT_PILL_STYLES[tag]}`}>
                    {counts[tag]} {tag}
                  </span>
                ) : null
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="shrink-0 px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
          >
            ↺ Retake Quiz
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">

        {compareError && (
          <div className="mb-5 p-3 bg-red-50 rounded-lg text-sm text-red-600">
            {compareError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map(car => (
            <CarCard
              key={car.id}
              car={car}
              isShortlisted={shortlist.has(car.id)}
              onToggleShortlist={toggleShortlist}
              isExpanded={expandedId === car.id}
              onToggleExpand={toggleExpand}
            />
          ))}
        </div>

        {shortlist.size >= 2 && (
          <div className="mt-10 bg-white rounded-xl shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900">Your Shortlist</h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {shortlistCars.map(c => `${c.make} ${c.model}`).join(' · ')}
                </p>
              </div>
              <button
                onClick={handleCompare}
                disabled={compareLoading}
                className={[
                  'shrink-0 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200',
                  compareLoading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-sm',
                ].join(' ')}
              >
                {compareLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading…
                  </span>
                ) : `Compare ${shortlist.size} cars →`}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {shortlistCars.map(car => (
                <span
                  key={car.id}
                  className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                >
                  {car.make} {car.model}
                  <button
                    onClick={() => toggleShortlist(car.id)}
                    className="hover:text-blue-900 cursor-pointer leading-none transition-all duration-200"
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {shortlist.size === 1 && (
          <p className="mt-6 text-center text-sm text-gray-400">
            ♥ Save one more car to unlock side-by-side comparison
          </p>
        )}
      </main>

      {compareData && (
        <CompareModal
          cars={compareData.cars || shortlistCars}
          highlights={compareData.highlights || {}}
          quizAnswers={quizAnswers}
          onClose={() => setCompareData(null)}
          shortlist={shortlist}
          onToggleShortlist={toggleShortlist}
        />
      )}
    </div>
  );
}
