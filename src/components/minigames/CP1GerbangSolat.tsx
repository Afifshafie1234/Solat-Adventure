import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { validateCP1 } from '../../game/logic';
import { Check, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (stars: number) => void;
  onClose: () => void;
}

export const CP1GerbangSolat: React.FC<Props> = ({ onComplete, onClose }) => {
  const [slot1, setSlot1] = useState<string>('');
  const [slot2, setSlot2] = useState<string>('');
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect?: boolean } | null>(null);

  const wordBank = [
    { id: 'perbuatan', label: 'Perbuatan', icon: '🤲' },
    { id: 'salam', label: 'Salam', icon: '🕊️' },
    { id: 'tidur', label: 'Tidur', icon: '😴' },
    { id: 'nyanyi', label: 'Nyanyian', icon: '🎵' },
    { id: 'makan', label: 'Makanan', icon: '🍎' },
  ];

  const handleSelectWord = (word: string) => {
    sound.playClick();
    if (activeSlot === 1) {
      setSlot1(word);
      setActiveSlot(2);
    } else {
      setSlot2(word);
    }
  };

  const handleCheckAnswer = () => {
    if (!slot1 || !slot2) {
      sound.playWrong();
      setFeedback({ message: 'Sila lengkapkan kedua-dua tempat kosong dahulu adik comel!', isCorrect: false });
      return;
    }

    const correct = validateCP1(slot1, slot2);
    if (correct) {
      sound.playCorrect();
      setFeedback({ message: 'Masya-Allah TEPAT SEKALI! Adik sangat pandai!', isCorrect: true });
      setTimeout(() => {
        onComplete(3);
      }, 1400);
    } else {
      sound.playWrong();
      setFeedback({
        message: 'Kurang tepat sedikit. Ingat: Solat ialah perkataan dan PERBUATAN, diakhiri dengan SALAM. Cuba lagi ya!',
        isCorrect: false,
      });
    }
  };

  const handleReset = () => {
    sound.playClick();
    setSlot1('');
    setSlot2('');
    setActiveSlot(1);
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Objective Banner */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
        <h3 className="text-xl font-bold text-blue-900 font-heading">Misi: Kenal Maksud Solat</h3>
        <p className="text-sm text-blue-700">Pilih kad perkataan yang betul untuk melengkapkan maksud solat di bawah.</p>
      </div>

      {/* Main Sentence Frame */}
      <div className="bg-amber-50 border-4 border-amber-300 rounded-3xl p-6 shadow-inner text-center">
        <p className="text-lg md:text-xl font-bold leading-relaxed text-slate-800">
          "Solat ialah perkataan dan{' '}
          <button
            onClick={() => {
              sound.playClick();
              setActiveSlot(1);
            }}
            className={`inline-flex items-center justify-center min-w-[130px] px-4 py-2 mx-1 rounded-2xl border-4 font-bold text-lg transition-all shadow-md ${
              slot1
                ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                : activeSlot === 1
                ? 'bg-amber-200 border-amber-500 text-amber-900 animate-pulse'
                : 'bg-white border-dashed border-amber-400 text-slate-400'
            }`}
          >
            {slot1 || '❓ Kosong 1'}
          </button>{' '}
          yang dimulakan dengan Takbiratul Ihram dan diakhiri dengan{' '}
          <button
            onClick={() => {
              sound.playClick();
              setActiveSlot(2);
            }}
            className={`inline-flex items-center justify-center min-w-[130px] px-4 py-2 mx-1 rounded-2xl border-4 font-bold text-lg transition-all shadow-md ${
              slot2
                ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                : activeSlot === 2
                ? 'bg-amber-200 border-amber-500 text-amber-900 animate-pulse'
                : 'bg-white border-dashed border-amber-400 text-slate-400'
            }`}
          >
            {slot2 || '❓ Kosong 2'}
          </button>
          ."
        </p>
      </div>

      {/* Word Options */}
      <div>
        <p className="text-sm font-bold text-slate-600 mb-2 text-center">
          Pilihan Kad Jawapan (Tekan kad untuk masukkan ke{' '}
          <span className="text-amber-600 underline">Kosong {activeSlot}</span>):
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {wordBank.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelectWord(item.label)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border-3 border-amber-400 text-slate-800 font-bold text-lg shadow-md hover:bg-amber-100 active:scale-95 transition-transform cursor-pointer"
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border-2 text-center font-bold text-base transition-all ${
            feedback.isCorrect
              ? 'bg-emerald-100 border-emerald-400 text-emerald-800 animate-bounce'
              : 'bg-rose-100 border-rose-400 text-rose-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-sm rounded-xl hover:bg-slate-100 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Isi Semula</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm"
          >
            Tutup
          </button>
          <button
            onClick={handleCheckAnswer}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-lg shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition cursor-pointer"
          >
            <Check className="w-5 h-5" />
            <span>Semak Jawapan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
