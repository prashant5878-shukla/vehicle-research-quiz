import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { compareCars } from "../api/quiz";
import CompareModal from "../components/CompareModal";
import CarCard from "../components/results/CarCard";
import {
  getMatchTag,
  COUNT_PILL_STYLES,
  MATCH_TAG_ORDER,
} from "../constants/matchTags";

export default function ResultsPage() {
  const navigate = useNavigate();

  const [results, setResults] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [shortlist, setShortlist] = useState(() => {
    try {
      const saved = localStorage.getItem("carShortlist");
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });
  const [expandedId, setExpandedId] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("quizResults");
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
    localStorage.setItem("carShortlist", JSON.stringify([...shortlist]));
  }, [shortlist]);

  function toggleShortlist(id) {
    setShortlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  async function handleCompare() {
    if (shortlist.size < 2) return;
    setCompareLoading(true);
    setCompareError(null);
    try {
      const data = await compareCars([...shortlist], quizAnswers);
      setCompareData(data);
    } catch {
      setCompareError("Failed to load comparison. Please try again.");
    } finally {
      setCompareLoading(false);
    }
  }

  if (results === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/40 flex flex-col items-center justify-center px-6 sm:px-8 py-12 sm:py-16">
        <div className="card-surface max-w-md w-full mx-auto p-10 sm:p-12 text-center flex flex-col items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
            🔍
          </div>
          <h2 className="text-xl font-bold text-slate-900">No results yet</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Complete the quiz to see your personalised car list.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 cursor-pointer shadow-md shadow-indigo-200"
          >
            Take the Quiz →
          </button>
        </div>
      </div>
    );
  }

  const counts = results.reduce((acc, car) => {
    const tag = getMatchTag(car.score);
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const shortlistCars = results.filter((c) => shortlist.has(c.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/40">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-6 sm:py-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                {results.length} cars match your preferences
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {MATCH_TAG_ORDER.map((tag) =>
                  counts[tag] ? (
                    <span
                      key={tag}
                      className={`text-xs font-semibold px-4 py-2 rounded-full ${COUNT_PILL_STYLES[tag]}`}
                    >
                      {counts[tag]} {tag}
                    </span>
                  ) : null,
                )}
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="shrink-0 self-start sm:self-auto px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white ring-1 ring-slate-200 rounded-xl hover:bg-slate-50 hover:ring-slate-300 transition-all duration-200 cursor-pointer shadow-sm"
            >
              ↺ Retake Quiz
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
        {compareError && (
          <div className="mb-8 p-5 bg-red-50 rounded-xl text-sm text-red-600 ring-1 ring-red-100">
            {compareError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {results.map((car) => (
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
          <div className="mt-12 card-surface p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">
                  Your Shortlist
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {shortlistCars.map((c) => `${c.make} ${c.model}`).join(" · ")}
                </p>
              </div>
              <button
                onClick={handleCompare}
                disabled={compareLoading}
                className={[
                  "shrink-0 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md",
                  compareLoading
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-indigo-200 hover:shadow-lg",
                ].join(" ")}
              >
                {compareLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Loading…
                  </span>
                ) : (
                  `Compare ${shortlist.size} cars →`
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {shortlistCars.map((car) => (
                <span
                  key={car.id}
                  className="flex items-center gap-2 text-sm bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full ring-1 ring-indigo-100"
                >
                  {car.make} {car.model}
                  <button
                    onClick={() => toggleShortlist(car.id)}
                    className="hover:text-indigo-900 cursor-pointer leading-none transition-all duration-200 text-base"
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
          <p className="mt-10 text-center text-sm text-slate-400 px-6">
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
