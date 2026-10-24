import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { validateCP5, CORRECT_CHRONOLOGICAL_ORDER } from '../../game/logic';
import { Check, RotateCcw } from 'lucide-react';

interface Props {
  onComplete: (stars: number) => void;
  onClose: () => void;
}

export const CP5HutanSusunan: React.FC<Props> = ({ onComplete, onClose }) => {
  // Scrambled pool
  const initialPool = ['Asar', 'Subuh', 'Isya\'', 'Zohor', 'Maghrib'];
  const [available, setAvailable] = useState<string[]>(initialPool);
  const [arranged, setArranged] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect?: boolean } | null>(null);

  const prayerIcons: Record<string, string> = {
    'Subuh': '🌅',
    'Zohor': '☀️',
    'Asar': '⛅',
    'Maghrib': '🌇',
    'Isya\'': '🌙',
  };

  const handlePick = (prayer: string) => {
    sound.playClick();
    setAvailable(prev => prev.filter(p => p !== prayer));
    setArranged(prev => [...prev, prayer]);
  };

  const handleRemove = (prayer: string) => {
    sound.playClick();
    setArranged(prev => prev.filter(p => p !== prayer));
    setAvailable(prev => [...prev, prayer]);
  };

  const handleCheck = () => {
    if (arranged.length < 5) {
      sound.playWrong();
      setFeedback({
        message: `Sila susun kesemua 5 waktu solat dahulu! (${arranged.length} / 5 dipilih)`,
        isCorrect: false,
      });
      return;
    }

    const isCorrect = validateCP5(arranged);
    if (isCorrect) {
      sound.playCorrect();
      setFeedback({
        message: 'SYABAS! Urutan harian tepat: 1. Subuh ➔ 2. Zohor ➔ 3. Asar ➔ 4. Maghrib ➔ 5. Isya\'!',
        isCorrect: true,
      });
      setTimeout(() => {
        onComplete(3);
      }, 1500);
    } else {
      sound.playWrong();
      setFeedback({
        message: 'Urutan masih belum teratur. Mulakan dengan Subuh pada waktu pagi hingga Isya\' pada waktu malam ya!',
        isCorrect: false,
      });
    }
  };

  const handleReset = () => {
    sound.playClick();
    setAvailable(initialPool);
    setArranged([]);
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Objective */}
      <div className="bg-lime-50 border-2 border-lime-200 rounded-2xl p-4 text-center">
        <h3 className="text-xl font-bold text-lime-900 font-heading">Misi: Susun Waktu Solat Mengikut Hari</h3>
        <p className="text-sm text-lime-700">
          Tekan kad solat di bawah untuk menyusunnya dari waktu pagi (Subuh) sehingga malam (Isya').
        </p>
      </div>

      {/* Target Slots: 1 to 5 */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2 text-center">Laluan Susunan Solat:</p>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map(idx => {
            const item = arranged[idx];
            return (
              <div
                key={idx}
                onClick={() => item && handleRemove(item)}
                className={`min-h-[110px] rounded-2xl border-3 flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                  item
                    ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-md hover:bg-rose-100 hover:border-rose-300'
                    : 'bg-white border-dashed border-slate-300 text-slate-400'
                }`}
              >
                <span className="text-xs font-black text-slate-400 block mb-1">#{idx + 1}</span>
                {item ? (
                  <>
                    <span className="text-2xl mb-1">{prayerIcons[item]}</span>
                    <span className="font-extrabold text-sm md:text-base leading-tight">{item}</span>
                    <span className="text-[10px] text-slate-500 mt-1">Tekan tukar</span>
                  </>
                ) : (
                  <span className="text-xs font-semibold">Kosong</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Cards Pool */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2 text-center">Pilihan Waktu Solat (Tekan untuk susun):</p>
        <div className="flex flex-wrap items-center justify-center gap-3 min-h-[50px]">
          {available.map(prayer => (
            <button
              key={prayer}
              onClick={() => handlePick(prayer)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-b from-white to-amber-50 border-3 border-amber-400 font-extrabold text-lg text-slate-800 shadow-md hover:bg-amber-100 active:scale-95 transition cursor-pointer"
            >
              <span className="text-2xl">{prayerIcons[prayer]}</span>
              <span>{prayer}</span>
            </button>
          ))}
          {available.length === 0 && (
            <p className="text-xs font-bold text-emerald-700">Semua solat telah disusun! Tekan "Semak Urutan".</p>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border-2 text-center font-bold text-base ${
            feedback.isCorrect ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-rose-100 border-rose-400 text-rose-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Susun Semula</span>
        </button>

        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm">
            Tutup
          </button>
          <button
            onClick={handleCheck}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-lg shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition cursor-pointer"
          >
            <Check className="w-5 h-5" />
            <span>Semak Urutan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
