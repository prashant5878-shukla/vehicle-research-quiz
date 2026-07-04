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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-lg p-8">

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-1.5 bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">{step.title}</h2>
        <p className="text-sm text-gray-500 mb-6">
          {step.subtitle}
          {step.type === 'multi2' && (
            <span className={`ml-2 font-semibold ${(currentValue?.length || 0) === 2 ? 'text-green-600' : 'text-blue-500'}`}>
              ({currentValue?.length || 0}/2 selected)
            </span>
          )}
        </p>

        <div className="space-y-3">
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
                  'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200',
                  'flex items-center justify-between gap-3',
                  'focus:outline-none',
                  isSelected
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20 cursor-pointer'
                    : isDisabled
                      ? 'border-gray-200 bg-white opacity-40 cursor-not-allowed'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer',
                ].join(' ')}
              >
                <span className="text-base font-medium text-gray-800">{opt.label}</span>
                {isSelected && <CheckIcon />}
              </button>
            );
          })}
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}

        {loading && (
          <div className="mt-5">
            <Spinner />
          </div>
        )}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          {isFirstStep ? (
            <div />
          ) : (
            <button
              onClick={handleBack}
              disabled={loading}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-all duration-200 cursor-pointer disabled:opacity-40"
            >
              ← Back
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={isNextDisabled() || loading}
            className={[
              'px-8 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200',
              isNextDisabled() || loading
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:shadow-md',
              isLastStep
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700',
            ].join(' ')}
          >
            {isLastStep ? 'Find My Cars →' : 'Next →'}
          </button>
        </div>

      </div>
    </div>
  );
}
