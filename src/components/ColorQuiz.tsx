import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Sparkles, RefreshCw, Trophy, Volume2 } from 'lucide-react';
import { COLORS, CLASSROOM_ITEMS } from '../data/episodeData';
import { sound, speakDialogue } from '../utils/audio';

interface ColorQuizProps {
  voiceEnabled: boolean;
  onJumpToEpisode?: () => void;
}

interface Question {
  targetColor: typeof COLORS[0];
  correctItem: typeof CLASSROOM_ITEMS[0];
  options: typeof CLASSROOM_ITEMS[0][];
}

export const ColorQuiz: React.FC<ColorQuizProps> = ({ voiceEnabled }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Generate question pool based on available classroom items
  const generateQuestions = (): Question[] => {
    return COLORS.slice(0, 6).map((color) => {
      const match = CLASSROOM_ITEMS.find(
        (item) => item.colorName.toLowerCase() === color.name.toLowerCase()
      ) || CLASSROOM_ITEMS[0];

      // Pick 3 distractors of different colors
      const distractors = CLASSROOM_ITEMS.filter(
        (item) => item.colorName.toLowerCase() !== color.name.toLowerCase()
      ).slice(0, 3);

      const options = [match, ...distractors].sort(() => Math.random() - 0.5);

      return {
        targetColor: color,
        correctItem: match,
        options,
      };
    });
  };

  const [questions, setQuestions] = useState<Question[]>(generateQuestions());
  const currentQ = questions[currentQuestionIndex] || questions[0];

  useEffect(() => {
    if (voiceEnabled && currentQ) {
      speakDialogue(`Can you find something ${currentQ.targetColor.name}?`, 'mia');
    }
  }, [currentQuestionIndex, voiceEnabled]);

  const handleOptionSelect = (option: typeof CLASSROOM_ITEMS[0]) => {
    if (hasAnswered) return;

    if (option.colorName.toLowerCase() === currentQ.targetColor.name.toLowerCase()) {
      sound.playSuccessFanfare();
      setFeedback({
        message: `Hooray! You found the ${option.name}! It is bright ${currentQ.targetColor.name}!`,
        isCorrect: true,
      });
      setStars((prev) => prev + 1);
      setHasAnswered(true);

      if (voiceEnabled) {
        speakDialogue(
          `Awesome job, friend! The ${option.name} is ${currentQ.targetColor.name}!`,
          'leo'
        );
      }
    } else {
      sound.playBoing();
      setFeedback({
        message: `Nice try! The ${option.name} is ${option.colorName}. Can you find something ${currentQ.targetColor.name}?`,
        isCorrect: false,
      });

      if (voiceEnabled) {
        speakDialogue(`That one is ${option.colorName}! Try looking for ${currentQ.targetColor.name}!`, 'mia');
      }
    }
  };

  const handleNextQuestion = () => {
    sound.playPop();
    setFeedback(null);
    setHasAnswered(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed round
      setCurrentQuestionIndex(0);
      setQuestions(generateQuestions());
    }
  };

  const restartQuiz = () => {
    sound.playSparkle();
    setCurrentQuestionIndex(0);
    setStars(0);
    setFeedback(null);
    setHasAnswered(false);
    setQuestions(generateQuestions());
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title & Star Counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-3xl border border-amber-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Fredoka'] text-amber-950">
              Find the Color with Mia & Leo!
            </h2>
            <p className="text-xs sm:text-sm text-amber-900/80">
              Listen to the prompt and tap the matching colorful item.
            </p>
          </div>
        </div>

        {/* Stars earned badge */}
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400 animate-spin [animation-duration:8s]" />
          <span className="text-sm font-bold text-amber-950 font-['Fredoka']">
            {stars} Stars Collected!
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-xl space-y-6 text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-950 font-bold font-['Fredoka'] text-sm">
            <span>Mia asks:</span>
            <button
              type="button"
              onClick={() => {
                if (voiceEnabled) {
                  speakDialogue(`Can you find something ${currentQ.targetColor.name}?`, 'mia');
                }
              }}
              className="p-1 hover:text-amber-700 transition-colors"
              title="Hear Mia's voice again"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold font-['Fredoka'] text-slate-800">
            “Can you find something{' '}
            <span
              className="underline decoration-wavy decoration-2"
              style={{ color: currentQ.targetColor.hex }}
            >
              {currentQ.targetColor.name.toUpperCase()}
            </span>
            ?”
          </h3>
        </div>

        {/* 4 Interactive Option Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {currentQ.options.map((option) => {
            const isTarget = option.colorName.toLowerCase() === currentQ.targetColor.name.toLowerCase();
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`p-4 sm:p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 group ${
                  hasAnswered && isTarget
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105'
                    : 'border-slate-200 bg-white hover:border-amber-400 hover:shadow-md hover:scale-102'
                }`}
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${option.colorHex}25` }}
                >
                  {option.id.includes('apple') ? '🍎' :
                   option.id.includes('train') ? '🚂' :
                   option.id.includes('star') ? '⭐' :
                   option.id.includes('dino') ? '🦖' :
                   option.id.includes('ball') ? '🏀' :
                   option.id.includes('crayon') ? '🖍️' :
                   option.id.includes('duck') ? '🦆' :
                   option.id.includes('flower') ? '🌸' : '🎈'}
                </div>

                <div className="text-center">
                  <span className="font-bold text-sm sm:text-base font-['Fredoka'] text-slate-800 block">
                    {option.name}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1 text-white"
                    style={{ backgroundColor: option.colorHex }}
                  >
                    {option.colorName}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Feedback Message */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-center font-['Fredoka'] text-base sm:text-lg font-bold transition-all ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {hasAnswered ? (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold font-['Fredoka'] text-base shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>Next Color Question</span>
              <Sparkles className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={restartQuiz}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Shuffle Questions</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
