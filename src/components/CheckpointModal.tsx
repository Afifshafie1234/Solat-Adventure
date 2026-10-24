import React from 'react';
import { CheckpointInfo } from '../game/logic';
import { X, Sparkles } from 'lucide-react';
import { sound } from '../game/audio';
import { CP1GerbangSolat } from './minigames/CP1GerbangSolat';
import { CP2SekolahIlmu } from './minigames/CP2SekolahIlmu';
import { CP3MenaraLimaWaktu } from './minigames/CP3MenaraLimaWaktu';
import { CP4JambatanRakaat } from './minigames/CP4JambatanRakaat';
import { CP5HutanSusunan } from './minigames/CP5HutanSusunan';
import { CP6KampungBijak } from './minigames/CP6KampungBijak';
import { CP7CabaranPengetahuan } from './minigames/CP7CabaranPengetahuan';
import { CP8IstanaJuara } from './minigames/CP8IstanaJuara';

interface Props {
  checkpoint: CheckpointInfo;
  studentName: string;
  onComplete: (checkpointId: number, stars: number) => void;
  onOpenCertificate: () => void;
  onClose: () => void;
}

export const CheckpointModal: React.FC<Props> = ({
  checkpoint,
  studentName,
  onComplete,
  onOpenCertificate,
  onClose,
}) => {
  const handleMiniGameComplete = (stars: number) => {
    onComplete(checkpoint.id, stars);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border-4 sm:border-6 border-amber-400 shadow-2xl p-4 sm:p-6 my-auto max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-black text-xl flex items-center justify-center border-2 border-amber-500 shadow-sm shrink-0">
              {checkpoint.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                  {checkpoint.region}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 leading-tight">
                Checkpoint {checkpoint.id}: {checkpoint.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Tutup Cabaran"
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Mini-Game Content */}
        {checkpoint.id === 1 && (
          <CP1GerbangSolat onComplete={handleMiniGameComplete} onClose={onClose} />
        )}
        {checkpoint.id === 2 && (
          <CP2SekolahIlmu onComplete={handleMiniGameComplete} onClose={onClose} />
        )}
        {checkpoint.id === 3 && (
          <CP3MenaraLimaWaktu onComplete={handleMiniGameComplete} onClose={onClose} />
        )}
        {checkpoint.id === 4 && (
          <CP4JambatanRakaat onComplete={handleMiniGameComplete} onClose={onClose} />
        )}
        {checkpoint.id === 5 && (
          <CP5HutanSusunan onComplete={handleMiniGameComplete} onClose={onClose} />
        )}
        {checkpoint.id === 6 && (
          <CP6KampungBijak onComplete={handleMiniGameComplete} onClose={onClose} />
        )}
        {checkpoint.id === 7 && (
          <CP7CabaranPengetahuan onComplete={handleMiniGameComplete} onClose={onClose} />
        )}
        {checkpoint.id === 8 && (
          <CP8IstanaJuara
            studentName={studentName}
            onComplete={handleMiniGameComplete}
            onOpenCertificate={onOpenCertificate}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};
