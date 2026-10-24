import React, { useState, useEffect } from 'react';
import { Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  currentCheckpointId: number;
  bridgeRepaired: boolean;
  totalStars: number;
  speechEnabled: boolean;
  studentName: string;
}

export const MascotMentor: React.FC<Props> = ({
  currentCheckpointId,
  bridgeRepaired,
  totalStars,
  speechEnabled,
  studentName,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [bubbleText, setBubbleText] = useState<string>('');

  useEffect(() => {
    let msg = '';
    if (totalStars === 0) {
      msg = `Assalamu'alaikum adik ${studentName || 'comel'}! Selamat datang ke Solat Adventure World! Jom tekan Checkpoint 1 di Sekolah Ilmu!`;
    } else if (currentCheckpointId === 4 && !bridgeRepaired) {
      msg = `Wah, Jambatan Rakaat ini rosak! Selesaikan Checkpoint 4 untuk cantumkan jambatan merentasi sungai!`;
    } else if (bridgeRepaired && currentCheckpointId === 5) {
      msg = `Alhamdulillah! Jambatan Rakaat telah bercantum kukuh! Sekarang laluan ke Hutan Misi telah terbuka!`;
    } else if (currentCheckpointId >= 8) {
      msg = `Masya-Allah! Adik kini berada di Istana Juara! Lengkapkan misi akhir untuk terima Sijil Penghargaan!`;
    } else {
      msg = `Bagus adik! Teruskan mengumpul bintang di setiap checkpoint. Jangan putus asa ya!`;
    }

    setBubbleText(msg);

    // If speech enabled, speak automatically on major milestones
    if (speechEnabled) {
      sound.speak(msg, speechEnabled);
    }
  }, [currentCheckpointId, bridgeRepaired, totalStars, speechEnabled, studentName]);

  const handleMascotClick = () => {
    sound.playClick();
    sound.speak(bubbleText, true);
  };

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-30 max-w-xs sm:max-w-sm pointer-events-auto">
      <div className="flex items-end gap-2">
        {/* Mascot Avatar Portrait */}
        <div
          onClick={handleMascotClick}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-400 bg-amber-100 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0 overflow-hidden ring-4 ring-white"
          title="Klik Ustaz Afif untuk dengar panduan suara!"
        >
          <img
            src="/src/assets/images/mascot_ustaz_adam_1792822184161.jpg"
            alt="Mascot Ustaz Afif"
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-0.5 border border-white text-[10px]">
            🗣️
          </span>
        </div>

        {/* Speech Balloon */}
        {!isMinimized ? (
          <div className="bg-white border-3 border-amber-400 rounded-3xl rounded-bl-none p-3 shadow-2xl text-xs sm:text-sm text-slate-800 relative animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between gap-1 mb-1 border-b border-amber-100 pb-1">
              <span className="font-extrabold text-amber-700 flex items-center gap-1">
                <span>Ustaz Afif</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md">Guru Pembimbing</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => sound.speak(bubbleText, true)}
                  className="p-1 hover:bg-amber-100 rounded text-amber-700"
                  title="Dengar suara"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400"
                  title="Kecilkan"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="font-semibold leading-relaxed text-slate-700">{bubbleText}</p>
          </div>
        ) : (
          <button
            onClick={() => setIsMinimized(false)}
            className="bg-white/90 border-2 border-amber-400 px-2 py-1 rounded-xl text-[11px] font-bold text-amber-800 shadow-md flex items-center gap-1"
          >
            <span>Panduan Ustaz Afif</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
