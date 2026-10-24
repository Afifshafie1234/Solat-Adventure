import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { FINAL_QUESTIONS } from '../../game/logic';
import { Award, Check, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  studentName: string;
  onComplete: (stars: number) => void;
  onOpenCertificate: () => void;
  onClose: () => void;
}

export const CP8IstanaJuara: React.FC<Props> = ({
  studentName,
  onComplete,
  onOpenCertificate,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = FINAL_QUESTIONS[currentIdx];

  const handleSelect = (optId: string) => {
    sound.playClick();
    setSelectedOpt(optId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOpt) return;

    const opt = currentQ.options.find(o => o.id === selectedOpt);
    const isCorrect = !!opt?.correct;

    setUserAnswers(prev => ({ ...prev, [currentQ.id]: selectedOpt }));

    if (isCorrect) {
      sound.playCorrect();
      setFeedback({ message: currentQ.explanation, isCorrect: true });
    } else {
      sound.playWrong();
      setFeedback({ message: 'Kurang tepat. Teruskan berusaha ya!', isCorrect: false });
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOpt(null);
      if (currentIdx + 1 < FINAL_QUESTIONS.length) {
        setCurrentIdx(prev => prev + 1);
      } else {
        setIsFinished(true);
        sound.playFanfare();
      }
    }, 1400);
  };

  // Calculate score
  let correctCount = 0;
  FINAL_QUESTIONS.forEach(q => {
    const chosen = userAnswers[q.id];
    const match = q.options.find(o => o.id === chosen);
    if (match?.correct) correctCount++;
  });

  const passed = correctCount >= 3;

  const handleClaimJuara = () => {
    sound.playFanfare();
    const stars = correctCount === 5 ? 3 : correctCount >= 4 ? 2 : 1;
    onComplete(stars);
    onOpenCertificate();
  };

  return (
    <div className="space-y-6">
      {/* Objective */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-2xl p-4 text-center">
        <h3 className="text-xl md:text-2xl font-black text-amber-900 font-heading">
          🏰 Ujian Akhir Pengembara Solat di Istana Juara
        </h3>
        <p className="text-sm font-semibold text-amber-800">
          Lengkapkan 5 soalan ini untuk dinobatkan sebagai Juara Solat dan menerima Sijil Digital!
        </p>
      </div>

      {!isFinished ? (
        <div className="space-y-4">
          {/* Progress Header */}
          <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl border border-slate-200">
            <span className="text-sm font-extrabold text-amber-700">
              Soalan {currentIdx + 1} / {FINAL_QUESTIONS.length}
            </span>
            <div className="flex gap-1.5">
              {FINAL_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    i === currentIdx
                      ? 'bg-amber-400 text-amber-950 scale-110 shadow'
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
          <div className="bg-amber-50 border-4 border-amber-300 rounded-3xl p-6 text-center shadow-md">
            <span className="text-4xl block mb-2">{currentQ.imageIcon}</span>
            <h4 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug">
              {currentQ.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map(opt => {
              const isSelected = selectedOpt === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full p-4 rounded-2xl border-3 text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-100 ring-4 ring-amber-200 shadow-md font-extrabold text-amber-950 scale-101'
                      : 'border-slate-200 bg-white hover:border-slate-300 font-bold text-slate-800'
                  }`}
                >
                  <span className="text-base">{opt.text}</span>
                  {isSelected && (
                    <span className="bg-amber-400 text-slate-950 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0">
                      ✓
                    </span>
                  )}
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

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm">
              Tutup
            </button>
            <button
              onClick={handleConfirmAnswer}
              disabled={!selectedOpt}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-base shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              <span>{currentIdx + 1 === FINAL_QUESTIONS.length ? 'Selesai & Semak Keputusan' : 'Sahkan Jawapan ➔'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Final Results & Grand Award */
        <div className="text-center py-6 space-y-4">
          <div className="relative inline-block">
            <img
              src="/src/assets/images/badge_juara_solat_1792822185329.jpg"
              alt="Lencana Juara Solat"
              className="w-32 h-32 mx-auto rounded-full object-cover shadow-2xl border-4 border-amber-400 animate-bounce"
            />
          </div>

          <h3 className="text-3xl font-black font-heading text-amber-700">
            {passed ? '🎉 TAHNIAH JUARA SOLAT! 🎉' : 'Bagus Usaha Anda!'}
          </h3>

          <p className="text-base font-bold text-slate-700 max-w-md mx-auto">
            {passed
              ? `Hebat adik ${studentName || 'Pengembara Cilik'}! Anda telah menjawab ${correctCount} daripada 5 soalan dengan betul dan layak menerima gelaran Juara Pengembara Solat!`
              : `Adik berjaya menjawab ${correctCount} / 5 soalan. Boleh cuba semula untuk dapatkan 5/5 ya!`}
          </p>

          <div className="flex items-center justify-center gap-2">
            {[...Array(correctCount === 5 ? 3 : correctCount >= 4 ? 2 : 1)].map((_, i) => (
              <span key={i} className="text-4xl text-amber-400 drop-shadow">⭐</span>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleClaimJuara}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer ring-4 ring-amber-300"
            >
              <Award className="w-6 h-6" />
              <span>Buka Sijil Digital Penghargaan 🎓</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
