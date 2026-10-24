/**
 * Utility to export the complete Solat Adventure World as a self-contained Single HTML file.
 * This allows teachers and students to save and run the entire game offline without an internet connection.
 */
export function generateSingleHtmlGame(studentName: string): string {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solat Adventure World - Teroka, Belajar, Selesaikan Misi!</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #fef3c7; }
    h1, h2, h3, .font-heading { font-family: 'Fredoka', cursive; }
    @keyframes pulseGlow { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.7)); } 50% { transform: scale(1.08); filter: drop-shadow(0 0 16px rgba(245, 158, 11, 1)); } }
    .pulse-glow { animation: pulseGlow 1.8s infinite ease-in-out; }
  </style>
</head>
<body class="min-h-screen text-slate-800 p-2 md:p-6 flex flex-col items-center">
  <header class="w-full max-w-5xl bg-white border-4 border-amber-400 rounded-3xl p-4 shadow-xl mb-4 flex flex-wrap items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <span class="text-4xl">🕌</span>
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-amber-600 font-heading">SOLAT ADVENTURE WORLD</h1>
        <p class="text-xs md:text-sm font-semibold text-emerald-700">Teroka, Belajar, Selesaikan Misi! · Murid: <span id="studentDisplay" class="font-bold underline">${studentName || 'Pengembara Cilik'}</span></p>
      </div>
    </div>
    <div class="flex items-center gap-4 bg-amber-50 px-4 py-2 rounded-2xl border-2 border-amber-300">
      <div class="text-center"><span class="text-xs font-bold text-amber-700 block">BINTANG</span><span id="starCount" class="text-xl font-extrabold text-amber-600">⭐ 0/24</span></div>
      <div class="text-center"><span class="text-xs font-bold text-amber-700 block">KEMAJUAN</span><span id="progressText" class="text-xl font-extrabold text-emerald-600">0%</span></div>
    </div>
  </header>

  <main class="w-full max-w-5xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-4 md:p-6 relative overflow-hidden">
    <div class="text-center mb-4">
      <h2 class="text-xl md:text-2xl font-bold text-amber-700 font-heading">🗺️ Peta Pengembaraan Solat</h2>
      <p class="text-sm text-slate-600">Tekan Checkpoint yang terbuka untuk mulakan cabaran!</p>
    </div>

    <!-- 8 Checkpoints Grid -->
    <div id="checkpointsContainer" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <!-- Checkpoints rendered via JS -->
    </div>

    <div id="bridgeNotice" class="mt-6 p-4 rounded-2xl bg-amber-100 border-2 border-amber-400 text-center font-bold text-amber-800">
      🌉 Status Jambatan Rakaat: <span id="bridgeStatus" class="text-red-600">Belum Dicantumkan (Selesaikan Checkpoint 4 untuk baiki)</span>
    </div>
  </main>

  <footer class="mt-4 text-center text-xs text-slate-500 font-semibold">
    Solat Adventure World © 2026 · Pendidikan Islam Tahun 1 · Fail Mandiri Bersedia Luar Talian (Offline)
  </footer>

  <script>
    // Embedded Audio Synthesizer
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    function playBeep(f, d = 0.15) {
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + d);
    }
    function playSuccess() { playBeep(523, 0.1); setTimeout(() => playBeep(659, 0.1), 100); setTimeout(() => playBeep(783, 0.1), 200); setTimeout(() => playBeep(1046, 0.3), 300); }

    const checkpoints = [
      { id: 1, title: '1. Gerbang Solat', region: 'Sekolah Ilmu', desc: 'Maksud Solat' },
      { id: 2, title: '2. Sekolah Ilmu', region: 'Sekolah Ilmu', desc: 'Hukum Solat 5 Waktu' },
      { id: 3, title: '3. Menara 5 Waktu', region: 'Bandar Ibadah', desc: 'Kenal 5 Solat Fardu' },
      { id: 4, title: '4. Jambatan Rakaat', region: 'Bandar Ibadah', desc: 'Bilangan Rakaat' },
      { id: 5, title: '5. Hutan Susunan', region: 'Hutan Misi', desc: 'Urutan Waktu Solat' },
      { id: 6, title: '6. Kampung Bijak', region: 'Kampung Ceria', desc: 'Situasi Azan' },
      { id: 7, title: '7. Kuiz Pantas', region: 'Kampung Ceria', desc: 'Pengukuhan Solat' },
      { id: 8, title: '8. Istana Juara', region: 'Istana Juara', desc: 'Ujian Akhir & Sijil' },
    ];

    let unlocked = [1];
    let stars = {};

    function render() {
      const container = document.getElementById('checkpointsContainer');
      container.innerHTML = '';
      checkpoints.forEach(cp => {
        const isUnlocked = unlocked.includes(cp.id);
        const s = stars[cp.id] || 0;
        const card = document.createElement('div');
        card.className = isUnlocked 
          ? 'p-4 rounded-2xl border-4 border-amber-400 bg-amber-50 cursor-pointer hover:bg-amber-100 transition shadow-lg text-center pulse-glow'
          : 'p-4 rounded-2xl border-2 border-slate-300 bg-slate-100 opacity-60 text-center cursor-not-allowed';
        card.innerHTML = \`
          <div class="text-3xl mb-1">\${isUnlocked ? (s > 0 ? '⭐' : '🔓') : '🔒'}</div>
          <div class="font-bold text-sm text-amber-900">\${cp.title}</div>
          <div class="text-xs text-slate-500">\${cp.region}</div>
          <div class="text-xs font-semibold text-emerald-600 mt-1">\${s > 0 ? '⭐'.repeat(s) + ' Selesai' : (isUnlocked ? 'Sedia Dimainkan' : 'Terkunci')}</div>
        \`;
        if (isUnlocked) {
          card.onclick = () => playCP(cp.id);
        }
        container.appendChild(card);
      });

      const totalS = Object.values(stars).reduce((a, b) => a + b, 0);
      document.getElementById('starCount').innerText = '⭐ ' + totalS + '/24';
      const pct = Math.round((Object.keys(stars).length / 8) * 100);
      document.getElementById('progressText').innerText = pct + '%';

      if (stars[4]) {
        document.getElementById('bridgeStatus').className = 'text-emerald-700 font-extrabold';
        document.getElementById('bridgeStatus').innerText = 'Telah Bercantum & Kukuh! (Laluan Hutan Misi Terbuka) 🌉';
      }
    }

    function playCP(id) {
      playBeep(440, 0.08);
      if (id === 1) {
        const ans = prompt("Soalan Gerbang Solat:\\n'Solat ialah perkataan dan ________ yang dimulakan dengan takbiratul ihram dan diakhiri dengan salam.'\\n\\nTulis jawapan yang betul (perbuatan / tidur):", "");
        if (ans && ans.toLowerCase().trim() === 'perbuatan') {
          playSuccess();
          alert("TAHNIAH! Jawapan anda TEPAT! Perkataan dan PERBUATAN.");
          completeCP(1);
        } else {
          alert("Cuba lagi! Petunjuk: Solat mengandungi pergerakan seperti rukuk dan sujud (perbuatan).");
        }
      } else if (id === 2) {
        const ans = prompt("Apakah HUKUM menunaikan Solat 5 Waktu bagi orang Islam?\\n1. WAJIB\\n2. HARUS\\n3. SUNAT\\n(Taip 1 atau WAJIB):", "WAJIB");
        if (ans && (ans.includes('1') || ans.toUpperCase().includes('WAJIB'))) {
          playSuccess();
          alert("ALHAMDULILLAH! Solat 5 Waktu hukumnya WAJIB!");
          completeCP(2);
        } else {
          alert("Solat 5 waktu adalah rukun Islam kedua, hukumnya WAJIB.");
        }
      } else if (id === 3) {
        alert("Tahniah! Anda mengenal 5 Solat Fardu: Subuh, Zohor, Asar, Maghrib, Isya'!");
        playSuccess();
        completeCP(3);
      } else if (id === 4) {
        const subuh = prompt("Berapakah rakaat solat Subuh? (Contoh: 2):", "2");
        const maghrib = prompt("Berapakah rakaat solat Maghrib? (Contoh: 3):", "3");
        if (subuh === '2' && maghrib === '3') {
          playSuccess();
          alert("TAHNIAH! Jambatan Rakaat kini BERCANTUM! Laluan ke Hutan Misi dibuka!");
          completeCP(4);
        } else {
          alert("Subuh = 2 rakaat, Maghrib = 3 rakaat. Cuba lagi!");
        }
      } else if (id === 5) {
        alert("Urutan solat harian: 1. Subuh -> 2. Zohor -> 3. Asar -> 4. Maghrib -> 5. Isya'. Misi Berjaya!");
        playSuccess();
        completeCP(5);
      } else if (id === 6) {
        const a = confirm("Situasi: Ahmad mendengar azan Zohor semasa bermain.\\n\\nTekan OK untuk 'Segera solat Zohor', atau Cancel untuk 'Abaikan azan'.");
        if (a) {
          playSuccess();
          alert("Terbaik! Mengutamakan solat apabila azan berkumandang adalah amalan terpuji.");
          completeCP(6);
        }
      } else if (id === 7) {
        alert("Cabaran Pengetahuan Pantas: Berjaya diselesaikan dengan cemerlang!");
        playSuccess();
        completeCP(7);
      } else if (id === 8) {
        playSuccess();
        alert("🏆 TAHNIAH JUARA PENGEMBARA SOLAT! Anda telah menamatkan seluruh misi pembelajaran solat!");
        completeCP(8);
      }
    }

    function completeCP(id) {
      stars[id] = 3;
      if (!unlocked.includes(id + 1) && id < 8) {
        unlocked.push(id + 1);
      }
      render();
    }

    render();
  </script>
</body>
</html>`;
}

export function downloadStandaloneHtml(studentName: string) {
  const htmlContent = generateSingleHtmlGame(studentName);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Solat-Adventure-World-${studentName ? studentName.replace(/\\s+/g, '_') : 'Murid'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
