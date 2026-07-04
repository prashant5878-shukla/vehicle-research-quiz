import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitQuiz } from '../api/quiz';
import { QUIZ_STEPS } from '../constants/quizSteps';
import CheckIcon from '../components/icons/CheckIcon';
import Spinner from '../components/quiz/Spinner';

export default function QuizPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const step = QUIZ_STEPS[currentStep];
  const totalSteps = QUIZ_STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentValue = answers[step.key];

  function handleSingle(value) {
    setAnswers(prev => ({ ...prev, [step.key]: value }));
  }

  function handleMulti(value) {
    const current = answers[step.key] || [];
    if (current.includes(value)) {
      setAnswers(prev => ({ ...prev, [step.key]: current.filter(v => v !== value) }));
    } else if (current.length < 2) {
      setAnswers(prev => ({ ...prev, [step.key]: [...current, value] }));
    }
  }

  function isNextDisabled() {
    if (step.type === 'multi2') return !currentValue || currentValue.length !== 2;
    return !currentValue;
  }

  async function handleNext() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setLoading(true);
      setError(null);
      try {
        const data = await submitQuiz(answers);
        sessionStorage.setItem('quizResults', JSON.stringify({ ...data, answers }));
        navigate('/results');
      } catch {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  }

  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/40 flex items-center justify-center px-6 sm:px-8 py-12 sm:py-16">
      <div className="w-full max-w-2xl mx-auto">

        {/* Brand mark */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-md shadow-indigo-200">
              CD
            </span>
            <span className="text-lg font-bold text-slate-900 tracking-tight">CarDekho Research</span>
          </div>
          <p className="text-sm text-slate-500">Find your perfect car in 2 minutes</p>
        </div>

        {/* Quiz card */}
        <div className="card-surface p-8 sm:p-10 md:p-12">

          {/* Progress */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-xs font-semibold text-indigo-600 tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-1 bg-indigo-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {step.title}
            </h2>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              {step.subtitle}
              {step.type === 'multi2' && (
                <span className={`ml-2 font-semibold ${(currentValue?.length || 0) === 2 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                  ({currentValue?.length || 0}/2 selected)
                </span>
              )}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-4">
            {step.options.map(opt => {
              const isSelected =
                step.type === 'multi2'
                  ? (currentValue || []).includes(opt.value)
                  : currentValue === opt.value;

              const isDisabled =
                step.type === 'multi2' &&
                !isSelected &&
                (currentValue || []).length >= 2;

              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    step.type === 'multi2' ? handleMulti(opt.value) : handleSingle(opt.value)
                  }
                  disabled={isDisabled}
                  className={[
                    'w-full text-left px-6 py-5 rounded-xl transition-all duration-200',
                    'flex items-center justify-between gap-4',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                    isSelected
                      ? 'bg-indigo-50 ring-2 ring-indigo-600 shadow-sm shadow-indigo-100 cursor-pointer'
                      : isDisabled
                        ? 'bg-slate-50 ring-1 ring-slate-100 opacity-40 cursor-not-allowed'
                        : 'bg-white ring-1 ring-slate-200 hover:ring-indigo-300 hover:bg-indigo-50/40 cursor-pointer card-surface-hover',
                  ].join(' ')}
                >
                  <span className="text-[15px] font-medium text-slate-800 leading-snug">{opt.label}</span>
                  {isSelected && <CheckIcon />}
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mt-6 text-sm text-red-600 text-center bg-red-50 rounded-xl px-5 py-4 ring-1 ring-red-100">
              {error}
            </p>
          )}

          {loading && (
            <div className="mt-8">
              <Spinner />
            </div>
          )}

          {/* Footer nav — separated from options */}
          <div className="flex justify-between items-center mt-10 pt-8 border-t border-slate-100">
            {isFirstStep ? (
              <div className="w-16" />
            ) : (
              <button
                onClick={handleBack}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-all duration-200 cursor-pointer disabled:opacity-40 rounded-lg hover:bg-slate-50"
              >
                ← Back
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={isNextDisabled() || loading}
              className={[
                'px-8 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200',
                'shadow-md',
                isNextDisabled() || loading
                  ? 'bg-slate-300 shadow-none cursor-not-allowed'
                  : 'cursor-pointer hover:shadow-lg active:scale-[0.98]',
                isLastStep
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
              ].join(' ')}
            >
              {isLastStep ? 'Find My Cars →' : 'Next →'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
