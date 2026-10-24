import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { validateCP4 } from '../../game/logic';
import { Check, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (stars: number) => void;
  onClose: () => void;
}

export const CP4JambatanRakaat: React.FC<Props> = ({ onComplete, onClose }) => {
  const prayers = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isya\''];
  const [matches, setMatches] = useState<Record<string, number>>({});
  const [selectedPrayer, setSelectedPrayer] = useState<string | null>('Subuh');
  const [showBridgeAnimation, setShowBridgeAnimation] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect?: boolean } | null>(null);

  const handleSelectPrayer = (p: string) => {
    sound.playClick();
    setSelectedPrayer(p);
  };

  const handleAssignRakaat = (rakaat: number) => {
    if (!selectedPrayer) return;
    sound.playClick();
    setMatches(prev => ({
      ...prev,
      [selectedPrayer]: rakaat,
    }));

    // Find next unmatched prayer
    const nextUnmatched = prayers.find(p => p !== selectedPrayer && !matches[p]);
    setSelectedPrayer(nextUnmatched || null);
  };

  const handleCheck = () => {
    const unmatched = prayers.filter(p => !matches[p]);
    if (unmatched.length > 0) {
      sound.playWrong();
      setFeedback({ message: `Padankan semua 5 solat dahulu ya! (${unmatched.length} lagi tinggal)`, isCorrect: false });
      return;
    }

    const res = validateCP4(matches);
    if (res.isCorrect) {
      // Trigger special Bridge Assembly Animation!
      setShowBridgeAnimation(true);
      sound.playBridgeAssemble();
      setTimeout(() => {
        sound.playFanfare();
      }, 1000);
      setTimeout(() => {
        onComplete(3);
      }, 3200);
    } else {
      sound.playWrong();
      setFeedback({
        message: 'Ada padanan rakaat yang kurang tepat. Ingat: Subuh = 2 rakaat, Maghrib = 3 rakaat, Zohor/Asar/Isya\' = 4 rakaat!',
        isCorrect: false,
      });
    }
  };

  const handleReset = () => {
    sound.playClick();
    setMatches({});
    setSelectedPrayer('Subuh');
    setFeedback(null);
  };

  return (
    <div className="space-y-6 relative overflow-hidden">
      {/* Special Fullscreen/Overlay Bridge Animation on Victory */}
      {showBridgeAnimation && (
        <div className="absolute inset-0 bg-amber-900/90 z-50 flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in zoom-in duration-300">
          <Sparkles className="w-16 h-16 text-yellow-400 animate-spin mb-4" />
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-amber-300 mb-2">
            🌉 JAMBATAN RAKAAT BERCANTUM! 🌉
          </h2>
          <p className="text-lg md:text-xl font-bold text-amber-100 max-w-md mb-6">
            Kayu-kayu jambatan bercantum dengan kukuh! Laluan misteri merentasi sungai ke Hutan Misi kini TERBUKA!
          </p>

          {/* SVG Animated Bridge connecting */}
          <div className="w-full max-w-md h-36 bg-sky-950/60 rounded-3xl p-4 border-4 border-amber-400 relative overflow-hidden flex items-center justify-center">
            {/* Water flowing */}
            <div className="absolute bottom-2 inset-x-0 h-8 bg-cyan-400/30 rounded-b-2xl"></div>

            {/* Bridge assembly graphic */}
            <div className="relative w-full h-16 flex items-center justify-center">
              {/* Left Pier */}
              <div className="w-16 h-12 bg-amber-800 rounded-l-xl border-2 border-amber-600 shadow-md"></div>
              {/* Assembled Connecting Planks */}
              <div className="flex-1 h-10 bg-amber-600 border-y-4 border-amber-400 flex items-center justify-around px-2 animate-bridge shadow-2xl">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-3 h-8 bg-amber-700 rounded-sm border border-amber-300"></div>
                ))}
              </div>
              {/* Right Pier */}
              <div className="w-16 h-12 bg-amber-800 rounded-r-xl border-2 border-amber-600 shadow-md"></div>
            </div>

            {/* Golden Star Sparkles */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-around">
              <span className="text-3xl animate-bounce">⭐</span>
              <span className="text-4xl animate-bounce delay-100">✨</span>
              <span className="text-3xl animate-bounce delay-200">⭐</span>
            </div>
          </div>

          <p className="mt-4 text-sm font-semibold text-amber-200 animate-pulse">
            Membuka Laluan Checkpoint 5 (Hutan Misi)...
          </p>
        </div>
      )}

      {/* Objective */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center">
        <h3 className="text-xl font-bold text-amber-900 font-heading">Misi: Baiki Jambatan Rakaat</h3>
        <p className="text-sm text-amber-700">
          Jambatan ini terputus! Padankan setiap solat dengan bilangan rakaat yang betul untuk mencantumkan jambatan.
        </p>
      </div>

      {/* Visual Mini Bridge Status */}
      <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌉</span>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Keadaan Jambatan Semasa</h4>
            <p className="text-xs text-amber-800 font-medium">Terputus dua di tengah sungai · Perlukan kayu padanan rakaat</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-500 block">Padanan Siap</span>
          <span className="text-lg font-black text-amber-600">{Object.keys(matches).length} / 5</span>
        </div>
      </div>

      {/* Selection Arena */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Step 1: Prayer Cards */}
        <div>
          <p className="text-sm font-bold text-slate-700 mb-2">1. Pilih Nama Solat:</p>
          <div className="space-y-2">
            {prayers.map(prayer => {
              const assigned = matches[prayer];
              const isSelected = selectedPrayer === prayer;
              return (
                <button
                  key={prayer}
                  onClick={() => handleSelectPrayer(prayer)}
                  className={`w-full p-3 rounded-2xl border-3 flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-100 ring-4 ring-amber-200 shadow-md scale-101 font-extrabold text-amber-950'
                      : 'border-slate-200 bg-white hover:border-slate-300 font-bold text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {prayer === 'Subuh' ? '🌅' : prayer === 'Zohor' ? '☀️' : prayer === 'Asar' ? '⛅' : prayer === 'Maghrib' ? '🌇' : '🌙'}
                    </span>
                    <span className="text-base">{prayer}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black ${
                      assigned
                        ? 'bg-emerald-500 text-white'
                        : isSelected
                        ? 'bg-amber-300 text-amber-900 animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {assigned ? `${assigned} Rakaat` : 'Pilih Rakaat ➔'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Rakaat Buttons */}
        <div>
          <p className="text-sm font-bold text-slate-700 mb-2">
            2. Tekan Bilangan Rakaat untuk{' '}
            <span className="font-extrabold text-amber-700 underline">
              {selectedPrayer || '(Pilih solat di sebelah)'}
            </span>
            :
          </p>

          <div className="grid grid-cols-1 gap-3">
            {[2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => handleAssignRakaat(num)}
                disabled={!selectedPrayer}
                className="p-4 rounded-2xl border-4 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 active:scale-95 transition-all text-left flex items-center justify-between shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <h4 className="text-2xl font-black font-heading text-amber-900">{num} RAKAAT</h4>
                  <p className="text-xs text-amber-700">
                    {num === 2 ? 'Contoh: Solat Subuh' : num === 3 ? 'Contoh: Solat Maghrib' : 'Contoh: Zohor, Asar & Isya\''}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-400 text-white font-extrabold text-xl flex items-center justify-center shadow-inner">
                  {num}
                </div>
              </button>
            ))}
          </div>
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
          <span>Padan Semula</span>
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
            <span>Cantumkan Jambatan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
