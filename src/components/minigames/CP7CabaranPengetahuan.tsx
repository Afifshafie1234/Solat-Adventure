import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { CP7_QUESTIONS } from '../../game/logic';
import { Check, Sparkles, Timer } from 'lucide-react';

interface Props {
  onComplete: (stars: number) => void;
  onClose: () => void;
}

export const CP7CabaranPengetahuan: React.FC<Props> = ({ onComplete, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const currentQ = CP7_QUESTIONS[currentIdx];

  const handleChoose = (optId: string) => {
    sound.playClick();
    setSelectedOption(optId);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const opt = currentQ.options.find(o => o.id === selectedOption);
    const isCorrect = !!opt?.isCorrect;

    if (isCorrect) {
      sound.playCorrect();
      setScore(prev => prev + 1);
      setFeedback({ message: 'Hebat, betul!', isCorrect: true });
    } else {
      sound.playWrong();
      setFeedback({ message: 'Kurang tepat, tapi jangan putus asa!', isCorrect: false });
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      if (currentIdx + 1 < CP7_QUESTIONS.length) {
        setCurrentIdx(prev => prev + 1);
      } else {
        setShowResult(true);
        sound.playFanfare();
      }
    }, 1000);
  };

  const handleFinish = () => {
    const earnedStars = score === 3 ? 3 : score >= 2 ? 2 : 1;
    onComplete(earnedStars);
  };

  return (
    <div className="space-y-6">
      {/* Objective */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
        <h3 className="text-xl font-bold text-yellow-900 font-heading">Misi: Kuiz Kilat Pengukuhan</h3>
        <p className="text-sm text-yellow-700">Jawab 3 soalan pantas untuk mengumpul bintang keemasan!</p>
      </div>

      {!showResult ? (
        <div className="space-y-4">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl border border-slate-200">
            <span className="text-sm font-bold text-slate-600">
              Soalan {currentIdx + 1} daripada {CP7_QUESTIONS.length}
            </span>
            <div className="flex gap-1">
              {CP7_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === currentIdx
                      ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                      : i < currentIdx
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-white border-4 border-amber-300 rounded-3xl p-6 text-center shadow-md">
            <h4 className="text-xl md:text-2xl font-extrabold text-slate-800 leading-snug">
              {currentQ.question}
            </h4>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentQ.options.map(opt => {
              const isSelected = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleChoose(opt.id)}
                  className={`p-4 rounded-2xl border-3 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-100 ring-4 ring-amber-200 scale-102 font-extrabold text-amber-950 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 font-bold text-slate-700'
                  }`}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <span className="text-lg">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-2xl border-2 text-center font-bold text-sm ${
                feedback.isCorrect ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-rose-100 border-rose-400 text-rose-800'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Footer Next button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm">
              Tutup
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-base shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{currentIdx + 1 === CP7_QUESTIONS.length ? 'Tamat Kuiz' : 'Seterusnya ➔'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Results screen */
        <div className="text-center py-6 space-y-4">
          <div className="text-5xl animate-bounce">🌟</div>
          <h4 className="text-2xl font-black font-heading text-slate-900">Kuiz Kilat Selesai!</h4>
          <p className="text-base font-bold text-slate-700">
            Markah anda: <span className="text-amber-600 text-xl">{score} / 3</span>
          </p>
          <div className="flex items-center justify-center gap-2">
            {[...Array(score === 3 ? 3 : score >= 2 ? 2 : 1)].map((_, i) => (
              <span key={i} className="text-3xl text-amber-400 drop-shadow">⭐</span>
            ))}
          </div>

          <button
            onClick={handleFinish}
            className="mt-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-lg shadow-xl hover:from-amber-600 hover:to-orange-600 active:scale-95 transition cursor-pointer"
          >
            Teruskan ke Checkpoint Seterusnya! ➔
          </button>
        </div>
      )}
    </div>
  );
};
