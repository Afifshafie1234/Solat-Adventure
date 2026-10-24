import React from 'react';
import { CHECKPOINTS, CheckpointInfo } from '../game/logic';
import { Lock, Star, Sparkles, Check } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  unlockedCheckpoints: number[];
  checkpointStars: Record<number, number>;
  bridgeRepaired: boolean;
  onSelectCheckpoint: (cp: CheckpointInfo) => void;
}

export const WorldMap: React.FC<Props> = ({
  unlockedCheckpoints,
  checkpointStars,
  bridgeRepaired,
  onSelectCheckpoint,
}) => {
  const regions = [
    { name: '🏫 Sekolah Ilmu', x: '16%', y: '12%', color: 'bg-blue-600/90 text-white' },
    { name: '🕌 Bandar Ibadah', x: '28%', y: '52%', color: 'bg-emerald-600/90 text-white' },
    { name: '🌳 Hutan Misi', x: '52%', y: '32%', color: 'bg-lime-700/90 text-white' },
    { name: '🏡 Kampung Ceria', x: '73%', y: '58%', color: 'bg-amber-600/90 text-white' },
    { name: '🏆 Istana Juara', x: '88%', y: '10%', color: 'bg-yellow-500/95 text-slate-950 font-black' },
  ];

  return (
    <div className="relative w-full aspect-[16/9] max-w-6xl mx-auto rounded-3xl overflow-hidden border-4 md:border-6 border-amber-400 shadow-2xl bg-sky-200 select-none">
      {/* Visual Adventure Map Key Art Backdrop */}
      <img
        src="/src/assets/images/hero_solat_world_1792822183593.jpg"
        alt="Peta Pengembaraan Solat Adventure World"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* SVG Interactive Paths and Bridge Layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 562.5"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="unlockedPath" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Path 1 -> 2 (Sekolah Ilmu) */}
        <path
          d="M 130 253 Q 145 190 180 146"
          fill="none"
          stroke={unlockedCheckpoints.includes(2) ? '#fbbf24' : 'rgba(255,255,255,0.4)'}
          strokeWidth="6"
          strokeDasharray={unlockedCheckpoints.includes(2) ? 'none' : '6,6'}
          strokeLinecap="round"
          filter={unlockedCheckpoints.includes(2) ? 'url(#glow)' : undefined}
        />

        {/* Path 2 -> 3 (Sekolah to Bandar Ibadah) */}
        <path
          d="M 180 146 Q 260 220 350 365"
          fill="none"
          stroke={unlockedCheckpoints.includes(3) ? '#fbbf24' : 'rgba(255,255,255,0.4)'}
          strokeWidth="6"
          strokeDasharray={unlockedCheckpoints.includes(3) ? 'none' : '6,6'}
          strokeLinecap="round"
          filter={unlockedCheckpoints.includes(3) ? 'url(#glow)' : undefined}
        />

        {/* Path 3 -> 4 (Bandar Ibadah to Bridge Entry) */}
        <path
          d="M 350 365 Q 280 410 210 467"
          fill="none"
          stroke={unlockedCheckpoints.includes(4) ? '#fbbf24' : 'rgba(255,255,255,0.4)'}
          strokeWidth="6"
          strokeDasharray={unlockedCheckpoints.includes(4) ? 'none' : '6,6'}
          strokeLinecap="round"
          filter={unlockedCheckpoints.includes(4) ? 'url(#glow)' : undefined}
        />

        {/* Path 4 -> 5 ACROSS RIVER & BRIDGE TO HUTAN MISI */}
        <path
          d="M 210 467 Q 350 490 520 281"
          fill="none"
          stroke={bridgeRepaired ? '#10b981' : 'rgba(239,68,68,0.6)'}
          strokeWidth={bridgeRepaired ? '7' : '4'}
          strokeDasharray={bridgeRepaired ? 'none' : '8,6'}
          strokeLinecap="round"
          filter={bridgeRepaired ? 'url(#glow)' : undefined}
        />

        {/* Path 5 -> 6 (Hutan Misi to Kampung Ceria) */}
        <path
          d="M 520 281 Q 630 350 740 405"
          fill="none"
          stroke={unlockedCheckpoints.includes(6) ? '#fbbf24' : 'rgba(255,255,255,0.4)'}
          strokeWidth="6"
          strokeDasharray={unlockedCheckpoints.includes(6) ? 'none' : '6,6'}
          strokeLinecap="round"
          filter={unlockedCheckpoints.includes(6) ? 'url(#glow)' : undefined}
        />

        {/* Path 6 -> 7 (Kampung Ceria road) */}
        <path
          d="M 740 405 Q 800 450 860 472"
          fill="none"
          stroke={unlockedCheckpoints.includes(7) ? '#fbbf24' : 'rgba(255,255,255,0.4)'}
          strokeWidth="6"
          strokeDasharray={unlockedCheckpoints.includes(7) ? 'none' : '6,6'}
          strokeLinecap="round"
          filter={unlockedCheckpoints.includes(7) ? 'url(#glow)' : undefined}
        />

        {/* Path 7 -> 8 (Kampung Ceria UP to Istana Juara) */}
        <path
          d="M 860 472 Q 940 350 880 157"
          fill="none"
          stroke={unlockedCheckpoints.includes(8) ? '#fbbf24' : 'rgba(255,255,255,0.4)'}
          strokeWidth="6"
          strokeDasharray={unlockedCheckpoints.includes(8) ? 'none' : '6,6'}
          strokeLinecap="round"
          filter={unlockedCheckpoints.includes(8) ? 'url(#glow)' : undefined}
        />
      </svg>

      {/* Region Name Badges over 5 areas */}
      {regions.map((reg, idx) => (
        <div
          key={idx}
          className={`absolute px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black shadow-lg border border-white/50 backdrop-blur-xs pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105 ${reg.color}`}
          style={{ left: reg.x, top: reg.y }}
        >
          {reg.name}
        </div>
      ))}

      {/* Checkpoint 4: Dedicated Visual Bridge State Indicator */}
      <div
        className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: '20%', top: '75%' }}
      >
        {bridgeRepaired ? (
          <div className="bg-emerald-600/90 text-white text-[9px] sm:text-[11px] font-black px-2 py-0.5 rounded-lg border border-white shadow-lg flex items-center gap-1 animate-pulse">
            <span>🌉</span>
            <span>Jambatan Kukuh & Bercantum!</span>
          </div>
        ) : (
          <div className="bg-rose-600/90 text-white text-[9px] sm:text-[11px] font-black px-2 py-0.5 rounded-lg border border-white shadow-lg flex items-center gap-1 animate-bounce">
            <span>⚠️</span>
            <span>Jambatan Rosak (Selesaikan CP 4)</span>
          </div>
        )}
      </div>

      {/* 8 Interactive Checkpoint Pins */}
      {CHECKPOINTS.map(cp => {
        const isUnlocked = unlockedCheckpoints.includes(cp.id);
        const stars = checkpointStars[cp.id] || 0;
        const isCompleted = stars > 0;
        const isCurrentActive = isUnlocked && !isCompleted;

        return (
          <button
            key={cp.id}
            onClick={() => {
              if (isUnlocked) {
                sound.playClick();
                onSelectCheckpoint(cp);
              } else {
                sound.playWrong();
              }
            }}
            disabled={!isUnlocked}
            aria-label={`Checkpoint ${cp.id}: ${cp.title} (${
              isCompleted ? `${stars} bintang diperolehi` : isUnlocked ? 'Sedia Dimainkan' : 'Terkunci'
            })`}
            className={`absolute z-20 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-300 ${
              isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
            }`}
            style={{ left: `${cp.x}%`, top: `${cp.y}%` }}
          >
            {/* Pulsing Target Halo for active current checkpoint */}
            {isCurrentActive && (
              <span className="absolute -inset-2 rounded-full bg-amber-400/60 animate-ping pointer-events-none"></span>
            )}

            {/* Checkpoint Circular Pin */}
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-3 sm:border-4 flex items-center justify-center shadow-xl transition-transform ${
                isCompleted
                  ? 'bg-gradient-to-b from-amber-300 to-amber-500 border-yellow-100 text-amber-950 scale-105'
                  : isCurrentActive
                  ? 'bg-gradient-to-b from-emerald-400 to-teal-500 border-white text-white animate-bounce ring-4 ring-amber-300'
                  : 'bg-slate-400/90 border-slate-300 text-slate-100'
              }`}
            >
              {isCompleted ? (
                <div className="flex flex-col items-center">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-950 text-amber-950" />
                </div>
              ) : isUnlocked ? (
                <span className="font-heading font-black text-base sm:text-lg md:text-xl drop-shadow">
                  {cp.id}
                </span>
              ) : (
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200" />
              )}
            </div>

            {/* Star Rating Badge beneath node */}
            {isCompleted && (
              <div className="flex items-center gap-0.5 bg-amber-950/80 px-1.5 py-0.5 rounded-full mt-0.5 border border-amber-300 shadow">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-[9px] sm:text-[11px] ${
                      i < stars ? 'text-amber-300' : 'text-slate-500'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}

            {/* Label Plaque */}
            <div
              className={`mt-1 px-2 py-0.5 rounded-lg text-[9px] sm:text-xs font-black shadow-md border whitespace-nowrap transition-transform group-hover:scale-105 ${
                isCompleted
                  ? 'bg-amber-100 text-amber-950 border-amber-400'
                  : isUnlocked
                  ? 'bg-white text-slate-900 border-emerald-400 ring-2 ring-emerald-200'
                  : 'bg-slate-700/80 text-slate-200 border-slate-500'
              }`}
            >
              CP {cp.id}: {cp.title}
            </div>
          </button>
        );
      })}
    </div>
  );
};
