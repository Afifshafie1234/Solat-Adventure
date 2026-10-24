import React, { useState, useEffect } from 'react';
import {
  CHECKPOINTS,
  BADGES,
  CheckpointInfo,
  calculateProgress,
  isBridgeRepaired,
} from './game/logic';
import { sound } from './game/audio';
import { TitleScreen } from './components/TitleScreen';
import { HUD } from './components/HUD';
import { WorldMap } from './components/WorldMap';
import { CheckpointModal } from './components/CheckpointModal';
import { BadgesModal } from './components/BadgesModal';
import { CertificateModal } from './components/CertificateModal';
import { MascotMentor } from './components/MascotMentor';
import { Sparkles, Trophy } from 'lucide-react';

const STORAGE_KEYS = {
  NAME: 'solat_adventure_student_name',
  UNLOCKED: 'solat_adventure_unlocked',
  STARS: 'solat_adventure_stars',
  BADGES: 'solat_adventure_badges',
  BRIDGE: 'solat_adventure_bridge',
  SOUND: 'solat_adventure_sound',
  SPEECH: 'solat_adventure_speech',
};

export default function App() {
  // Check for ?autostart=1
  const isAutostart = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('autostart') === '1';

  // Game state
  const [gameState, setGameState] = useState<'title' | 'map'>(isAutostart ? 'map' : 'title');
  const [studentName, setStudentName] = useState<string>('Ahmad');
  const [unlockedCheckpoints, setUnlockedCheckpoints] = useState<number[]>([1]);
  const [checkpointStars, setCheckpointStars] = useState<Record<number, number>>({});
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [bridgeRepaired, setBridgeRepaired] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);

  // Modals & Popups
  const [activeCheckpoint, setActiveCheckpoint] = useState<CheckpointInfo | null>(null);
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [newBadgeNotification, setNewBadgeNotification] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedName = localStorage.getItem(STORAGE_KEYS.NAME);
      if (savedName) setStudentName(savedName);

      const savedUnlocked = localStorage.getItem(STORAGE_KEYS.UNLOCKED);
      if (savedUnlocked) {
        const parsed = JSON.parse(savedUnlocked);
        if (Array.isArray(parsed) && parsed.length > 0) setUnlockedCheckpoints(parsed);
      }

      const savedStars = localStorage.getItem(STORAGE_KEYS.STARS);
      if (savedStars) {
        setCheckpointStars(JSON.parse(savedStars));
      }

      const savedBadges = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (savedBadges) {
        setEarnedBadges(JSON.parse(savedBadges));
      }

      const savedBridge = localStorage.getItem(STORAGE_KEYS.BRIDGE);
      if (savedBridge !== null) {
        setBridgeRepaired(savedBridge === 'true');
      }

      const savedSound = localStorage.getItem(STORAGE_KEYS.SOUND);
      if (savedSound !== null) {
        const isSnd = savedSound === 'true';
        setSoundEnabled(isSnd);
        sound.setMuted(!isSnd);
      }

      const savedSpeech = localStorage.getItem(STORAGE_KEYS.SPEECH);
      if (savedSpeech !== null) {
        setSpeechEnabled(savedSpeech === 'true');
      }
    } catch {
      // Storage access fallback
    }
  }, []);

  // Update body dataset state for game state machine (Ultra mode)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.state = gameState === 'title' ? 'title' : 'playing';
    }
  }, [gameState]);

  // Handle checkpoint completion
  const handleCheckpointComplete = (checkpointId: number, starsEarned: number) => {
    const updatedStars = {
      ...checkpointStars,
      [checkpointId]: Math.max(checkpointStars[checkpointId] || 0, starsEarned),
    };
    setCheckpointStars(updatedStars);
    localStorage.setItem(STORAGE_KEYS.STARS, JSON.stringify(updatedStars));

    // Unlock next checkpoint
    const nextId = checkpointId + 1;
    let updatedUnlocked = [...unlockedCheckpoints];
    if (nextId <= 8 && !updatedUnlocked.includes(nextId)) {
      updatedUnlocked.push(nextId);
      setUnlockedCheckpoints(updatedUnlocked);
      localStorage.setItem(STORAGE_KEYS.UNLOCKED, JSON.stringify(updatedUnlocked));
    }

    // Special: Checkpoint 4 repairs the bridge!
    if (checkpointId === 4) {
      setBridgeRepaired(true);
      localStorage.setItem(STORAGE_KEYS.BRIDGE, 'true');
    }

    // Check for badge unlocks
    const badgeMap: Record<number, string> = {
      2: 'badge-1', // Bintang Asas Solat
      4: 'badge-2', // Wira Rakaat
      5: 'badge-3', // Penjelajah Waktu
      7: 'badge-4', // Budak Cergas & Taat
      8: 'badge-5', // Juara Pengembara Solat
    };

    const earnedBadgeId = badgeMap[checkpointId];
    if (earnedBadgeId && !earnedBadges.includes(earnedBadgeId)) {
      const updatedBadges = [...earnedBadges, earnedBadgeId];
      setEarnedBadges(updatedBadges);
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(updatedBadges));

      const badgeObj = BADGES.find(b => b.id === earnedBadgeId);
      if (badgeObj) {
        setNewBadgeNotification(badgeObj.title);
        setTimeout(() => setNewBadgeNotification(null), 3500);
      }
    }

    // Close the checkpoint modal
    setActiveCheckpoint(null);
  };

  const handleUpdateName = (newName: string) => {
    setStudentName(newName);
    localStorage.setItem(STORAGE_KEYS.NAME, newName);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setMuted(!next);
    localStorage.setItem(STORAGE_KEYS.SOUND, String(next));
  };

  const toggleSpeech = () => {
    const next = !speechEnabled;
    setSpeechEnabled(next);
    localStorage.setItem(STORAGE_KEYS.SPEECH, String(next));
  };

  const handleResetGame = () => {
    sound.playWrong();
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    sound.playClick();
    localStorage.removeItem(STORAGE_KEYS.UNLOCKED);
    localStorage.removeItem(STORAGE_KEYS.STARS);
    localStorage.removeItem(STORAGE_KEYS.BADGES);
    localStorage.removeItem(STORAGE_KEYS.BRIDGE);

    setUnlockedCheckpoints([1]);
    setCheckpointStars({});
    setEarnedBadges([]);
    setBridgeRepaired(false);
    setShowResetConfirm(false);
    setActiveCheckpoint(null);
  };

  const progress = calculateProgress(checkpointStars);
  const isJuaraUnlocked = (checkpointStars[8] || 0) > 0;

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800 flex flex-col font-sans">
      {gameState === 'title' ? (
        <TitleScreen
          studentName={studentName}
          onUpdateName={handleUpdateName}
          onStartGame={() => setGameState('map')}
        />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Top Heads-Up Display */}
          <HUD
            studentName={studentName}
            totalStars={progress.totalStars}
            maxStars={progress.maxStars}
            progressPercent={progress.percent}
            earnedBadgesCount={earnedBadges.length}
            totalBadgesCount={BADGES.length}
            soundEnabled={soundEnabled}
            speechEnabled={speechEnabled}
            isJuaraUnlocked={isJuaraUnlocked}
            onUpdateName={handleUpdateName}
            onToggleSound={toggleSound}
            onToggleSpeech={toggleSpeech}
            onOpenBadges={() => setShowBadgesModal(true)}
            onOpenCertificate={() => setShowCertificateModal(true)}
            onResetGame={handleResetGame}
          />

          {/* World Map Main Stage */}
          <main className="flex-1 p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-6xl">
              <WorldMap
                unlockedCheckpoints={unlockedCheckpoints}
                checkpointStars={checkpointStars}
                bridgeRepaired={bridgeRepaired}
                onSelectCheckpoint={cp => setActiveCheckpoint(cp)}
              />
            </div>
          </main>

          {/* Mascot Mentor in corner */}
          <MascotMentor
            currentCheckpointId={Math.max(...unlockedCheckpoints)}
            bridgeRepaired={bridgeRepaired}
            totalStars={progress.totalStars}
            speechEnabled={speechEnabled}
            studentName={studentName}
          />

          {/* New Badge Unlock Toast Banner */}
          {newBadgeNotification && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-6 py-3 rounded-2xl border-4 border-white shadow-2xl flex items-center gap-3 animate-bounce">
              <Trophy className="w-8 h-8 text-amber-950" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider block">Lencana Baru Diperolehi!</span>
                <span className="text-lg font-black font-heading">{newBadgeNotification}</span>
              </div>
              <Sparkles className="w-6 h-6 text-yellow-100" />
            </div>
          )}

          {/* Active Checkpoint Modal */}
          {activeCheckpoint && (
            <CheckpointModal
              checkpoint={activeCheckpoint}
              studentName={studentName}
              onComplete={handleCheckpointComplete}
              onOpenCertificate={() => setShowCertificateModal(true)}
              onClose={() => setActiveCheckpoint(null)}
            />
          )}

          {/* Badges Collection Modal */}
          {showBadgesModal && (
            <BadgesModal
              earnedBadges={earnedBadges}
              onClose={() => setShowBadgesModal(false)}
            />
          )}

          {/* Digital Certificate Modal */}
          {showCertificateModal && (
            <CertificateModal
              studentName={studentName}
              totalStars={progress.totalStars}
              onClose={() => setShowCertificateModal(false)}
            />
          )}

          {/* Reset Confirmation Dialog */}
          {showResetConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
              <div className="bg-white rounded-3xl border-4 border-rose-400 shadow-2xl p-6 max-w-md w-full text-center">
                <span className="text-4xl block mb-2">⚠️</span>
                <h3 className="text-xl font-black font-heading text-slate-900 mb-2">
                  Mula Semula Pengembaraan?
                </h3>
                <p className="text-sm font-semibold text-slate-600 mb-6">
                  Adakah anda pasti mahu memadam semua bintang, lencana dan membuka semula dari Checkpoint 1?
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-sm text-slate-700 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmReset}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-sm text-white shadow-md cursor-pointer"
                  >
                    Ya, Padam & Mula Semula
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
