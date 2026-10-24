import React, { useState } from 'react';
import { Play, Sparkles, Volume2, VolumeX, Download } from 'lucide-react';
import { sound } from '../game/audio';
import { downloadStandaloneHtml } from '../utils/exportSingleHtml';

interface Props {
  studentName: string;
  onUpdateName: (name: string) => void;
  onStartGame: () => void;
}

export const TitleScreen: React.FC<Props> = ({
  studentName,
  onUpdateName,
  onStartGame,
}) => {
  const [name, setName] = useState(studentName || 'Ahmad');
  const [soundOn, setSoundOn] = useState(true);

  const handleStart = () => {
    sound.playClick();
    if (soundOn) {
      sound.playCorrect();
      sound.startBgm();
    }
    onUpdateName(name.trim() || 'Pengembara Cilik');
    onStartGame();
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.setMuted(!next);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-100 via-sky-100 to-emerald-100 overflow-hidden select-none">
      {/* Background Decorative Graphic */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/hero_solat_world_1792822183593.jpg"
          alt="Map Background"
          className="w-full h-full object-cover filter blur-xs"
        />
      </div>

      {/* Main Hero Card */}
      <div className="relative z-10 w-full max-w-xl bg-white/95 rounded-3xl border-4 sm:border-6 border-amber-400 shadow-2xl p-6 sm:p-8 text-center backdrop-blur-sm">
        {/* Mascot Avatar Wave */}
        <div className="relative inline-block mb-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-400 p-1 bg-amber-50 shadow-xl overflow-hidden mx-auto animate-float">
            <img
              src="/src/assets/images/mascot_ustaz_adam_1792822184161.jpg"
              alt="Ustaz Afif"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-1 text-2xl animate-bounce">👋</span>
        </div>

        {/* Title & Slogan */}
        <div className="space-y-1 mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-widest uppercase">
            Pendidikan Islam Tahun 1
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-amber-600 tracking-tight drop-shadow-sm">
            SOLAT ADVENTURE WORLD
          </h1>
          <p className="text-base sm:text-lg font-bold text-slate-600 font-heading">
            Teroka, Belajar, Selesaikan Misi! 🌟
          </p>
        </div>

        {/* Name Input for Grade 1 Student */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mb-6 text-left shadow-inner">
          <label htmlFor="student-name-input" className="block text-xs font-bold text-amber-900 uppercase tracking-wide mb-1.5">
            Nama Pengembara Cilik:
          </label>
          <input
            id="student-name-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleStart();
            }}
            placeholder="Tulis nama anda..."
            className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-400 bg-white font-extrabold text-base text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-300 transition"
          />
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            *Nama ini akan tertera pada Sijil Penghargaan Juara Solat!
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs font-bold text-slate-700">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-2">
            <span className="text-xl block mb-0.5">🗺️</span>
            <span>5 Kawasan</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2">
            <span className="text-xl block mb-0.5">🚩</span>
            <span>8 Checkpoint</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2">
            <span className="text-xl block mb-0.5">🏆</span>
            <span>Sijil Juara</span>
          </div>
        </div>

        {/* Primary Start Button */}
        <button
          onClick={handleStart}
          data-start="true"
          className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xl sm:text-2xl shadow-xl hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer ring-4 ring-amber-300"
        >
          <Play className="w-7 h-7 fill-white" />
          <span>MULA PENGEMBARAAN!</span>
        </button>

        {/* Secondary Tools: Sound & Offline Export */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 text-xs">
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{soundOn ? 'Muzik & Bunyi: Hidup' : 'Bunyi: Senyap'}</span>
          </button>

          <button
            onClick={() => downloadStandaloneHtml(name || 'Pengembara Cilik')}
            className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
            title="Muat Turun Fail HTML Mandiri untuk Main Offline"
          >
            <Download className="w-4 h-4" />
            <span>Muat Turun Fail HTML</span>
          </button>
        </div>
      </div>
    </div>
  );
};
