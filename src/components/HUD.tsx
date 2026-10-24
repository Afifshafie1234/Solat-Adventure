import React, { useState } from 'react';
import { Award, Download, RotateCcw, Volume2, VolumeX, Sparkles, User, MessageSquare } from 'lucide-react';
import { sound } from '../game/audio';
import { downloadStandaloneHtml } from '../utils/exportSingleHtml';

interface Props {
  studentName: string;
  totalStars: number;
  maxStars: number;
  progressPercent: number;
  earnedBadgesCount: number;
  totalBadgesCount: number;
  soundEnabled: boolean;
  speechEnabled: boolean;
  isJuaraUnlocked: boolean;
  onUpdateName: (name: string) => void;
  onToggleSound: () => void;
  onToggleSpeech: () => void;
  onOpenBadges: () => void;
  onOpenCertificate: () => void;
  onResetGame: () => void;
}

export const HUD: React.FC<Props> = ({
  studentName,
  totalStars,
  maxStars,
  progressPercent,
  earnedBadgesCount,
  totalBadgesCount,
  soundEnabled,
  speechEnabled,
  isJuaraUnlocked,
  onUpdateName,
  onToggleSound,
  onToggleSpeech,
  onOpenBadges,
  onOpenCertificate,
  onResetGame,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(studentName);

  const handleSaveName = () => {
    sound.playClick();
    onUpdateName(tempName || 'Pengembara Cilik');
    setIsEditingName(false);
  };

  const handleExport = () => {
    sound.playClick();
    downloadStandaloneHtml(studentName || 'Pengembara Cilik');
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b-4 border-amber-400 shadow-md px-3 sm:px-6 py-2.5 sm:py-3 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Lockup & Student Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-amber-500 flex items-center justify-center text-2xl shadow-sm shrink-0">
            🕌
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black font-heading text-amber-700 tracking-tight leading-none">
                SOLAT ADVENTURE WORLD
              </h1>
              {isJuaraUnlocked && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Award className="w-3 h-3 text-amber-600" /> Juara
                </span>
              )}
            </div>

            {/* Editable Student Name */}
            <div className="flex items-center gap-1.5 mt-0.5">
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    placeholder="Nama Murid..."
                    className="border border-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-800 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg hover:bg-emerald-700 transition"
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-amber-800 cursor-pointer group"
                  title="Klik untuk tukar nama murid"
                >
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Murid: <strong className="text-slate-900 group-hover:underline">{studentName || 'Pengembara Cilik'}</strong></span>
                  <span className="text-[10px] text-amber-500 opacity-80">(Tukar)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HUD Score & Metrics Strip */}
        <div className="flex items-center gap-2 sm:gap-4 bg-amber-50/80 px-3 py-1.5 rounded-2xl border-2 border-amber-300 shadow-inner">
          {/* Stars */}
          <div className="flex items-center gap-1.5">
            <span className="text-xl">⭐</span>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block leading-none">Bintang</span>
              <span className="text-sm sm:text-base font-extrabold text-amber-900">
                {totalStars} / {maxStars}
              </span>
            </div>
          </div>

          <div className="w-px h-7 bg-amber-300"></div>

          {/* Badges Drawer Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenBadges();
            }}
            className="flex items-center gap-1.5 hover:bg-amber-100 px-1.5 py-1 rounded-xl transition cursor-pointer"
            title="Buka Rak Lencana"
          >
            <span className="text-xl">🎖️</span>
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-500 uppercase block leading-none">Lencana</span>
              <span className="text-sm sm:text-base font-extrabold text-amber-900">
                {earnedBadgesCount} / {totalBadgesCount}
              </span>
            </div>
          </button>

          <div className="w-px h-7 bg-amber-300"></div>

          {/* Progress % */}
          <div className="w-20 sm:w-28">
            <div className="flex justify-between items-center text-[10px] font-extrabold text-emerald-800 mb-0.5">
              <span>Kemajuan</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Action Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isJuaraUnlocked && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenCertificate();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md transition cursor-pointer animate-pulse"
              title="Lihat Sijil Penghargaan"
            >
              <Award className="w-4 h-4 text-yellow-200" />
              <span className="hidden sm:inline">Sijil Saya</span>
            </button>
          )}

          {/* Single HTML Offline Download Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition cursor-pointer"
            title="Muat Turun Fail HTML Mandiri (Single File HTML untuk Main Offline)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Eksport HTML</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Matikan Bunyi' : 'Hidupkan Bunyi'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title={soundEnabled ? 'Bunyi Aktif' : 'Bunyi Dimatikan'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Speech Mentor Toggle */}
          <button
            onClick={onToggleSpeech}
            aria-label={speechEnabled ? 'Suara Ustaz Afif Aktif' : 'Suara Ustaz Afif Dimatikan'}
            className={`p-2 rounded-xl transition cursor-pointer ${
              speechEnabled ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'
            }`}
            title={speechEnabled ? 'Suara Pembimbing Ustaz Afif: Hidup' : 'Suara Pembimbing: Senyap'}
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Reset Game */}
          <button
            onClick={onResetGame}
            aria-label="Mula Semula Permainan"
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition cursor-pointer"
            title="Reset Kemajuan Permainan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
