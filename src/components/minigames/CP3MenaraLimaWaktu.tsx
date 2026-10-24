import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { validateCP3 } from '../../game/logic';
import { Check, RotateCcw } from 'lucide-react';

interface Props {
  onComplete: (stars: number) => void;
  onClose: () => void;
}

interface BalloonItem {
  id: string;
  name: string;
  color: string;
  isFardhu: boolean;
  icon: string;
}

export const CP3MenaraLimaWaktu: React.FC<Props> = ({ onComplete, onClose }) => {
  const balloons: BalloonItem[] = [
    { id: 'subuh', name: 'Subuh', color: 'from-amber-400 to-orange-500', isFardhu: true, icon: '🌅' },
    { id: 'dhuha', name: 'Dhuha', color: 'from-pink-400 to-rose-400', isFardhu: false, icon: '☀️' },
    { id: 'zohor', name: 'Zohor', color: 'from-blue-400 to-indigo-500', isFardhu: true, icon: '☀️' },
    { id: 'tahajjud', name: 'Tahajjud', color: 'from-purple-400 to-indigo-600', isFardhu: false, icon: '✨' },
    { id: 'asar', name: 'Asar', color: 'from-emerald-400 to-teal-500', isFardhu: true, icon: '⛅' },
    { id: 'witir', name: 'Witir', color: 'from-violet-400 to-fuchsia-500', isFardhu: false, icon: '🌙' },
    { id: 'maghrib', name: 'Maghrib', color: 'from-rose-400 to-red-500', isFardhu: true, icon: '🌇' },
    { id: 'tarawih', name: 'Tarawih', color: 'from-cyan-400 to-blue-500', isFardhu: false, icon: '🕌' },
    { id: 'isya', name: 'Isya\'', color: 'from-indigo-500 to-purple-600', isFardhu: true, icon: '🌙' },
  ];

  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect?: boolean } | null>(null);

  const toggleBalloon = (name: string, isFardhu: boolean) => {
    sound.playClick();
    if (selected.includes(name)) {
      setSelected(prev => prev.filter(item => item !== name));
    } else {
      if (!isFardhu) {
        sound.playWrong();
        setFeedback({ message: `Awas! "${name}" adalah solat sunat, bukan solat fardu 5 waktu!`, isCorrect: false });
      } else {
        sound.playStarTwinkle();
        setFeedback(null);
      }
      setSelected(prev => [...prev, name]);
    }
  };

  const handleCheck = () => {
    const res = validateCP3(selected);
    if (res.isCorrect) {
      sound.playCorrect();
      setFeedback({ message: 'HEBAT! 5 Solat Fardu berjaya dikumpulkan: Subuh, Zohor, Asar, Maghrib, Isya\'!', isCorrect: true });
      setTimeout(() => {
        onComplete(3);
      }, 1500);
    } else {
      sound.playWrong();
      if (res.wrongSelected.length > 0) {
        setFeedback({
          message: `Ada belon penipu yang terpilih: ${res.wrongSelected.join(', ')}. Nyahkan belon tersebut ya!`,
          isCorrect: false,
        });
      } else {
        setFeedback({
          message: `Masih ada ${res.missingCount} solat fardu yang belum dipilih. Cari semua 5 ya!`,
          isCorrect: false,
        });
      }
    }
  };

  const handleReset = () => {
    sound.playClick();
    setSelected([]);
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Objective */}
      <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 text-center">
        <h3 className="text-xl font-bold text-sky-900 font-heading">Misi: Petik 5 Belon Solat Fardu</h3>
        <p className="text-sm text-sky-700">
          Tekan 5 belon solat fardu wajib. Awas! Jangan terpedaya dengan belon solat sunat seperti Dhuha & Tahajjud!
        </p>
      </div>

      {/* Target Tracker */}
      <div className="flex items-center justify-center gap-3 bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-sm">
        <span className="text-sm font-bold text-slate-700">Terkumpul:</span>
        <span className="text-xl font-extrabold text-indigo-700">{selected.length} / 5</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(idx => (
            <span
              key={idx}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                idx <= selected.length ? 'bg-amber-400 text-amber-900' : 'bg-slate-200 text-slate-400'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Floating Balloons Arena */}
      <div className="bg-gradient-to-b from-sky-100 to-indigo-100 rounded-3xl p-6 border-4 border-sky-300 shadow-inner">
        <div className="grid grid-cols-3 gap-4">
          {balloons.map(b => {
            const isSelected = selected.includes(b.name);
            return (
              <button
                key={b.id}
                onClick={() => toggleBalloon(b.name, b.isFardhu)}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all cursor-pointer relative shadow-lg ${
                  isSelected
                    ? 'scale-105 ring-4 ring-amber-400 ring-offset-2'
                    : 'hover:scale-102 hover:-translate-y-1'
                } bg-gradient-to-b ${b.color} text-white`}
              >
                <span className="text-3xl mb-1 drop-shadow">{b.icon}</span>
                <span className="font-extrabold text-base md:text-lg tracking-wide drop-shadow-md">
                  {b.name}
                </span>

                {isSelected && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black border-2 border-white shadow">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
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
          <span>Mula Semula</span>
        </button>

        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm">
            Tutup
          </button>
          <button
            onClick={handleCheck}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-lg shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition"
          >
            <Check className="w-5 h-5" />
            <span>Semak Pilihan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
