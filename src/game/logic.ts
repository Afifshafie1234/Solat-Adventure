export interface CheckpointInfo {
  id: number;
  title: string;
  region: string;
  regionId: number;
  zoneColor: string;
  objective: string;
  x: number; // percentage in map
  y: number; // percentage in map
}

export interface GameState {
  studentName: string;
  unlockedCheckpoints: number[];
  checkpointStars: Record<number, number>;
  earnedBadges: string[];
  bridgeRepaired: boolean;
  soundEnabled: boolean;
  speechEnabled: boolean;
}

export interface Badge {
  id: string;
  title: string;
  region: string;
  icon: string;
  description: string;
  requiredCheckpoint: number;
}

export const CHECKPOINTS: CheckpointInfo[] = [
  {
    id: 1,
    title: 'Gerbang Solat',
    region: 'Sekolah Ilmu',
    regionId: 1,
    zoneColor: '#3b82f6',
    objective: 'Mengenal maksud Solat secara asas',
    x: 13,
    y: 45,
  },
  {
    id: 2,
    title: 'Sekolah Ilmu',
    region: 'Sekolah Ilmu',
    regionId: 1,
    zoneColor: '#3b82f6',
    objective: 'Menentukan hukum solat fardu 5 waktu',
    x: 18,
    y: 26,
  },
  {
    id: 3,
    title: 'Menara Lima Waktu',
    region: 'Bandar Ibadah',
    regionId: 2,
    zoneColor: '#10b981',
    objective: 'Mengenal nama 5 solat fardu',
    x: 35,
    y: 65,
  },
  {
    id: 4,
    title: 'Jambatan Rakaat',
    region: 'Bandar Ibadah',
    regionId: 2,
    zoneColor: '#10b981',
    objective: 'Memadankan solat dengan bilangan rakaat',
    x: 23,
    y: 77,
  },
  {
    id: 5,
    title: 'Hutan Susunan',
    region: 'Hutan Misi',
    regionId: 3,
    zoneColor: '#84cc16',
    objective: 'Menyusun lima waktu solat mengikut urutan hari',
    x: 52,
    y: 50,
  },
  {
    id: 6,
    title: 'Kampung Bijak',
    region: 'Kampung Ceria',
    regionId: 4,
    zoneColor: '#f97316',
    objective: 'Menjawab soalan situasi adab & amalan solat',
    x: 74,
    y: 72,
  },
  {
    id: 7,
    title: 'Cabaran Pengetahuan',
    region: 'Kampung Ceria',
    regionId: 4,
    zoneColor: '#f97316',
    objective: 'Kuiz pantas pengukuhan ilmu solat',
    x: 86,
    y: 84,
  },
  {
    id: 8,
    title: 'Istana Juara',
    region: 'Istana Juara',
    regionId: 5,
    zoneColor: '#eab308',
    objective: 'Ujian Akhir Pengembara Solat & Terima Sijil',
    x: 88,
    y: 28,
  },
];

export const BADGES: Badge[] = [
  {
    id: 'badge-1',
    title: 'Bintang Asas Solat',
    region: 'Sekolah Ilmu',
    icon: '🏫',
    description: 'Menguasai maksud & hukum solat fardu.',
    requiredCheckpoint: 2,
  },
  {
    id: 'badge-2',
    title: 'Wira Rakaat',
    region: 'Bandar Ibadah',
    icon: '🕌',
    description: 'Menghubungkan Jambatan Rakaat dengan bilangan solat yang tepat.',
    requiredCheckpoint: 4,
  },
  {
    id: 'badge-3',
    title: 'Penjelajah Waktu',
    region: 'Hutan Misi',
    icon: '🌳',
    description: 'Berjaya menyusun 5 waktu solat mengikut susunan tertib.',
    requiredCheckpoint: 5,
  },
  {
    id: 'badge-4',
    title: 'Budak Cergas & Taat',
    region: 'Kampung Ceria',
    icon: '🏡',
    description: 'Bijak bertindak mengutamakan solat dalam kehidupan seharian.',
    requiredCheckpoint: 7,
  },
  {
    id: 'badge-5',
    title: 'Juara Pengembara Solat',
    region: 'Istana Juara',
    icon: '🏆',
    description: 'Berjaya menamatkan seluruh 8 misi Solat Adventure World!',
    requiredCheckpoint: 8,
  },
];

export const FIVE_PRAYERS = [
  { name: 'Subuh', rakaat: 2, order: 1 },
  { name: 'Zohor', rakaat: 4, order: 2 },
  { name: 'Asar', rakaat: 4, order: 3 },
  { name: 'Maghrib', rakaat: 3, order: 4 },
  { name: 'Isya\'', rakaat: 4, order: 5 },
];

export const CORRECT_CHRONOLOGICAL_ORDER = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isya\''];

export function calculateProgress(checkpointStars: Record<number, number>) {
  const completedCount = Object.keys(checkpointStars).filter(id => (checkpointStars[Number(id)] || 0) > 0).length;
  let totalStars = 0;
  Object.values(checkpointStars).forEach(s => {
    totalStars += s;
  });
  const maxStars = CHECKPOINTS.length * 3;
  const percent = Math.round((completedCount / CHECKPOINTS.length) * 100);
  return {
    completedCount,
    totalStars,
    maxStars,
    percent,
  };
}

export function isBridgeRepaired(checkpointStars: Record<number, number>): boolean {
  return (checkpointStars[4] || 0) > 0;
}

export function isCheckpointUnlocked(id: number, unlockedCheckpoints: number[]): boolean {
  return unlockedCheckpoints.includes(id);
}

// Checkpoint 1 Validator
export function validateCP1(slot1: string, slot2: string): boolean {
  const clean1 = slot1.trim().toLowerCase();
  const clean2 = slot2.trim().toLowerCase();
  return clean1 === 'perbuatan' && clean2 === 'salam';
}

// Checkpoint 2 Validator (Sorting solat fardu vs others)
export function validateCP2(
  assignments: Record<string, 'WAJIB' | 'HARUS' | 'SUNAT'>
): { isCorrect: boolean; correctCount: number; total: number } {
  // Solat 5 Waktu => WAJIB
  // Solat Sunat Rawatib => SUNAT
  // Bermain Basikal => HARUS
  const expected: Record<string, 'WAJIB' | 'HARUS' | 'SUNAT'> = {
    'Solat 5 Waktu': 'WAJIB',
    'Solat Rawatib': 'SUNAT',
    'Bermain Basikal': 'HARUS',
  };

  let correctCount = 0;
  const total = Object.keys(expected).length;

  for (const [item, rule] of Object.entries(expected)) {
    if (assignments[item] === rule) {
      correctCount++;
    }
  }

  return {
    isCorrect: correctCount === total,
    correctCount,
    total,
  };
}

// Checkpoint 3 Validator (Pop true 5 Fardhu balloons, ignore trick balloons)
export function validateCP3(selectedBalloons: string[]): {
  isCorrect: boolean;
  correctSelected: string[];
  wrongSelected: string[];
  missingCount: number;
} {
  const fardhuSet = new Set(['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isya\'']);
  const correctSelected = selectedBalloons.filter(b => fardhuSet.has(b));
  const wrongSelected = selectedBalloons.filter(b => !fardhuSet.has(b));
  const missingCount = fardhuSet.size - correctSelected.length;

  const isCorrect = correctSelected.length === 5 && wrongSelected.length === 0;

  return {
    isCorrect,
    correctSelected,
    wrongSelected,
    missingCount,
  };
}

// Checkpoint 4 Validator (Rakaat matches)
export function validateCP4(matches: Record<string, number>): {
  isCorrect: boolean;
  correctCount: number;
  total: number;
} {
  const expected: Record<string, number> = {
    'Subuh': 2,
    'Zohor': 4,
    'Asar': 4,
    'Maghrib': 3,
    'Isya\'': 4,
  };

  let correctCount = 0;
  const total = Object.keys(expected).length;

  for (const [prayer, rakaat] of Object.entries(expected)) {
    if (matches[prayer] === rakaat) {
      correctCount++;
    }
  }

  return {
    isCorrect: correctCount === total,
    correctCount,
    total,
  };
}

// Checkpoint 5 Validator (Order from morning to night)
export function validateCP5(order: string[]): boolean {
  if (order.length !== CORRECT_CHRONOLOGICAL_ORDER.length) return false;
  return order.every((item, idx) => item === CORRECT_CHRONOLOGICAL_ORDER[idx]);
}

// Checkpoint 6 Validator (Scenario choice)
export function validateCP6(answerId: string): boolean {
  return answerId === 'solat-segera';
}

// Checkpoint 7 Validator (Fast knowledge quiz)
export interface CP7Question {
  id: number;
  question: string;
  options: { id: string; label: string; isCorrect: boolean; icon: string }[];
}

export const CP7_QUESTIONS: CP7Question[] = [
  {
    id: 1,
    question: 'Berapakah jumlah waktu solat fardu yang wajib dalam sehari semalam?',
    options: [
      { id: '3', label: '3 Waktu', isCorrect: false, icon: '3️⃣' },
      { id: '5', label: '5 Waktu', isCorrect: true, icon: '5️⃣' },
      { id: '7', label: '7 Waktu', isCorrect: false, icon: '7️⃣' },
    ],
  },
  {
    id: 2,
    question: 'Solat fardu manakah yang ditunaikan pada waktu awal pagi sebelum terbit matahari?',
    options: [
      { id: 'subuh', label: 'Solat Subuh', isCorrect: true, icon: '🌅' },
      { id: 'asar', label: 'Solat Asar', isCorrect: false, icon: '⛅' },
      { id: 'isya', label: 'Solat Isya\'', isCorrect: false, icon: '🌙' },
    ],
  },
  {
    id: 3,
    question: 'Solat manakah yang mempunyai 3 rakaat?',
    options: [
      { id: 'zohor', label: 'Solat Zohor', isCorrect: false, icon: '☀️' },
      { id: 'maghrib', label: 'Solat Maghrib', isCorrect: true, icon: '🌇' },
      { id: 'subuh', label: 'Solat Subuh', isCorrect: false, icon: '🌅' },
    ],
  },
];

// Checkpoint 8 Validator (Grand Final Quiz - 5 questions)
export interface FinalQuestion {
  id: number;
  question: string;
  imageIcon: string;
  options: { id: string; text: string; correct: boolean }[];
  explanation: string;
}

export const FINAL_QUESTIONS: FinalQuestion[] = [
  {
    id: 1,
    question: 'Solat dimulakan dengan Takbiratul Ihram dan diakhiri dengan...',
    imageIcon: '🤲',
    options: [
      { id: 'a', text: 'Membaca Buku', correct: false },
      { id: 'b', text: 'Memberi Salam', correct: true },
      { id: 'c', text: 'Tidur lena', correct: false },
    ],
    explanation: 'Hebat! Solat ditutup dengan memberi salam ke kanan dan ke kiri.',
  },
  {
    id: 2,
    question: 'Hukum menunaikan Solat 5 Waktu bagi setiap orang Islam ialah...',
    imageIcon: '⚖️',
    options: [
      { id: 'a', text: 'Wajib (Dapat pahala, tinggal berdosa)', correct: true },
      { id: 'b', text: 'Harus (Boleh buat boleh tidak)', correct: false },
      { id: 'c', text: 'Makruh', correct: false },
    ],
    explanation: 'Tepat sekali! Solat 5 waktu adalah kewajipan fardu ain.',
  },
  {
    id: 3,
    question: 'Antara berikut, yang manakah BUKAN solat fardu 5 waktu?',
    imageIcon: '🕌',
    options: [
      { id: 'a', text: 'Zohor', correct: false },
      { id: 'b', text: 'Solat Dhuha', correct: true },
      { id: 'c', text: 'Asar', correct: false },
    ],
    explanation: 'Bagus! Solat Dhuha ialah solat sunat, bukan solat fardu.',
  },
  {
    id: 4,
    question: 'Berapakah bilangan rakaat bagi solat Maghrib?',
    imageIcon: '🌇',
    options: [
      { id: 'a', text: '2 Rakaat', correct: false },
      { id: 'b', text: '3 Rakaat', correct: true },
      { id: 'c', text: '4 Rakaat', correct: false },
    ],
    explanation: 'Masya-Allah betul! Solat Maghrib mempunyai 3 rakaat.',
  },
  {
    id: 5,
    question: 'Apakah urutan waktu solat selepas solat Zohor?',
    imageIcon: '🕒',
    options: [
      { id: 'a', text: 'Solat Asar', correct: true },
      { id: 'b', text: 'Solat Subuh', correct: false },
      { id: 'c', text: 'Solat Isya\'', correct: false },
    ],
    explanation: 'Tahniah! Selepas Zohor ialah waktu solat Asar.',
  },
];
