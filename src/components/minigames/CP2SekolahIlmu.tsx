import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { validateCP2 } from '../../game/logic';
import { Check, RotateCcw } from 'lucide-react';

interface Props {
  onComplete: (stars: number) => void;
  onClose: () => void;
}

type Category = 'WAJIB' | 'SUNAT' | 'HARUS';

export const CP2SekolahIlmu: React.FC<Props> = ({ onComplete, onClose }) => {
  const cards = [
    { id: 'Solat 5 Waktu', label: 'Solat 5 Waktu', icon: '🕌', hint: 'Rukun Islam kedua' },
    { id: 'Solat Rawatib', label: 'Solat Rawatib', icon: '🤲', hint: 'Solat iringan sebelum/selepas' },
    { id: 'Bermain Basikal', label: 'Bermain Basikal', icon: '🚲', hint: 'Aktiviti riadah masa lapang' },
  ];

  const [selectedCard, setSelectedCard] = useState<string | null>(cards[0].id);
  const [placements, setPlacements] = useState<Record<string, Category>>({});
  const [feedback, setFeedback] = useState<{ message: string; isCorrect?: boolean } | null>(null);

  const handlePlaceCard = (targetCategory: Category) => {
    if (!selectedCard) return;
    sound.playClick();
    setPlacements(prev => ({
      ...prev,
      [selectedCard]: targetCategory,
    }));

    // Auto select next unplaced card
    const nextUnplaced = cards.find(c => c.id !== selectedCard && !placements[c.id]);
    setSelectedCard(nextUnplaced ? nextUnplaced.id : null);
  };

  const handleCheck = () => {
    const unplaced = cards.filter(c => !placements[c.id]);
    if (unplaced.length > 0) {
      sound.playWrong();
      setFeedback({ message: `Sila masukkan semua 3 kad ke dalam kotak hukum ya! (${unplaced.length} belum diisi)`, isCorrect: false });
      return;
    }

    const res = validateCP2(placements);
    if (res.isCorrect) {
      sound.playCorrect();
      setFeedback({ message: 'TAHNIAH! Solat 5 waktu adalah WAJIB bagi setiap Muslim!', isCorrect: true });
      setTimeout(() => {
        onComplete(3);
      }, 1500);
    } else {
      sound.playWrong();
      setFeedback({
        message: 'Ada yang belum tepat. Ingat: Solat 5 Waktu hukumnya WAJIB, Rawatib adalah SUNAT, bermain basikal adalah HARUS.',
        isCorrect: false,
      });
    }
  };

  const handleReset = () => {
    sound.playClick();
    setPlacements({});
    setSelectedCard(cards[0].id);
    setFeedback(null);
  };

  const categories: { key: Category; title: string; subtitle: string; color: string; border: string; bg: string }[] = [
    { key: 'WAJIB', title: 'WAJIB', subtitle: 'Wajib dibuat, tinggal berdosa', color: 'text-rose-700', border: 'border-rose-400', bg: 'bg-rose-50' },
    { key: 'SUNAT', title: 'SUNAT', subtitle: 'Buat dapat pahala ekstra', color: 'text-amber-700', border: 'border-amber-400', bg: 'bg-amber-50' },
    { key: 'HARUS', title: 'HARUS', subtitle: 'Boleh dibuat / ditinggalkan', color: 'text-blue-700', border: 'border-blue-400', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Objective */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center">
        <h3 className="text-xl font-bold text-emerald-900 font-heading">Misi: Isih Kad Hukum Solat</h3>
        <p className="text-sm text-emerald-700">Pilih kad di atas, kemudian tekan kotak hukum yang sesuai (Wajib / Sunat / Harus).</p>
      </div>

      {/* Cards to sort */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2 text-center">1. Pilih Kad Aktiviti:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cards.map(card => {
            const placedAt = placements[card.id];
            const isSelected = selectedCard === card.id;

            return (
              <button
                key={card.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCard(card.id);
                }}
                className={`p-4 rounded-2xl border-4 text-left transition-all relative ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-102 ring-4 ring-indigo-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{card.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{card.label}</h4>
                    <p className="text-xs text-slate-500">{card.hint}</p>
                  </div>
                </div>

                {placedAt && (
                  <span className="inline-block mt-2 text-xs font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                    Masuk: {placedAt}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sorting Bins */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2 text-center">
          2. Tekan Kotak untuk Masukkan{' '}
          <span className="font-extrabold text-indigo-700 underline">
            {selectedCard ? `[${selectedCard}]` : '(Pilih kad di atas)'}
          </span>
          :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {categories.map(cat => {
            const itemsInCat = cards.filter(c => placements[c.id] === cat.key);

            return (
              <div
                key={cat.key}
                onClick={() => selectedCard && handlePlaceCard(cat.key)}
                className={`p-4 rounded-2xl border-4 ${cat.border} ${cat.bg} min-h-[140px] flex flex-col justify-between cursor-pointer hover:shadow-md transition`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-black text-xl font-heading ${cat.color}`}>{cat.title}</span>
                    <span className="text-xs font-bold text-slate-500">{itemsInCat.length} kad</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{cat.subtitle}</p>
                </div>

                <div className="space-y-1">
                  {itemsInCat.map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl px-3 py-1.5 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between"
                    >
                      <span>{item.icon} {item.label}</span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          sound.playClick();
                          setPlacements(prev => {
                            const copy = { ...prev };
                            delete copy[item.id];
                            return copy;
                          });
                        }}
                        className="text-rose-500 hover:text-rose-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {itemsInCat.length === 0 && (
                    <div className="text-center py-3 text-xs text-slate-400 border border-dashed border-slate-300 rounded-xl">
                      (Kotak masih kosong)
                    </div>
                  )}
                </div>
              </div>
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
          <span>Susun Semula</span>
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
            <span>Semak Jawapan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
