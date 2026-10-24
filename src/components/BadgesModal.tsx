import { BADGES } from '../game/logic';
import { Award, Check, Lock, X } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  earnedBadges: string[];
  onClose: () => void;
}

export const BadgesModal: React.FC<Props> = ({ earnedBadges, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎖️</span>
            <div>
              <h3 className="text-2xl font-black font-heading text-amber-900">
                Koleksi Lencana Pengembara
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Terkumpul {earnedBadges.length} daripada {BADGES.length} Lencana Diraja
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
          {BADGES.map(b => {
            const isEarned = earnedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border-3 flex items-start gap-4 transition-all ${
                  isEarned
                    ? 'border-amber-400 bg-amber-50 shadow-md ring-2 ring-amber-200'
                    : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner ${
                    isEarned ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isEarned ? b.icon : <Lock className="w-6 h-6 text-slate-400" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base text-slate-900">{b.title}</h4>
                    {isEarned && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Milik Anda
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-amber-800 block">{b.region}</span>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{b.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base shadow-lg transition cursor-pointer"
          >
            Kembali Meneroka Peta
          </button>
        </div>
      </div>
    </div>
  );
};
