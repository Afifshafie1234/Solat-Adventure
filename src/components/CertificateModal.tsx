import React, { useRef } from 'react';
import { sound } from '../game/audio';
import { Award, Download, Printer, X } from 'lucide-react';
import { downloadStandaloneHtml } from '../utils/exportSingleHtml';

interface Props {
  studentName: string;
  totalStars: number;
  onClose: () => void;
}

export const CertificateModal: React.FC<Props> = ({
  studentName,
  totalStars,
  onClose,
}) => {
  const certRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date().toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleDownloadOfflineGame = () => {
    sound.playClick();
    downloadStandaloneHtml(studentName || 'Pengembara Cilik');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden my-auto">
        {/* Top Control Bar */}
        <div className="bg-amber-600 px-6 py-3 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-300" />
            <span className="font-extrabold text-base md:text-lg font-heading">
              Sijil Digital Pengembara Solat
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadOfflineGame}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow"
              title="Muat Turun Kod Lengkap Dalam Satu Fail HTML"
            >
              <Download className="w-4 h-4" />
              <span>Muat Turun Fail HTML Mandiri</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold transition cursor-pointer shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sijil</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-amber-700 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div
          ref={certRef}
          id="printable-cert"
          className="p-6 md:p-10 bg-amber-50 border-8 border-double border-amber-500 m-4 rounded-2xl relative text-center text-slate-800"
          style={{
            backgroundImage: `radial-gradient(#fde68a 1.2px, transparent 1.2px)`,
            backgroundSize: '20px 20px',
          }}
        >
          {/* Certificate Header Banner */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 text-amber-700 text-sm font-extrabold tracking-widest uppercase mb-1">
              <span>✦</span>
              <span>KEMENTERIAN PENDIDIKAN MALAYSIA · PENDIDIKAN ISLAM TAHUN 1</span>
              <span>✦</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-heading text-amber-700 tracking-wide drop-shadow-sm">
              SIJIL PENGHARGAAN
            </h1>
            <p className="text-xs md:text-sm font-bold text-amber-900 tracking-wider uppercase mt-1">
              ANUGERAH JUARA SOLAT ADVENTURE WORLD
            </p>
          </div>

          <p className="text-sm md:text-base text-slate-600 italic mb-2">
            Dengan sukacitanya diperakui bahawa
          </p>

          {/* Student Name */}
          <div className="py-2 border-b-2 border-amber-400 inline-block px-8 mb-4 max-w-full">
            <h2 className="text-2xl md:text-4xl font-extrabold text-indigo-950 font-heading capitalize">
              {studentName || 'Pengembara Cilik Bintang Solat'}
            </h2>
          </div>

          {/* Statement */}
          <p className="text-sm md:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
            Telah berjaya menyelesaikan kesemua <strong>8 Checkpoint Misi</strong> merentasi{' '}
            <strong>5 Kawasan Pengembaraan Solat</strong> dengan menguasai Maksud Solat, Hukum Solat Fardu,
            Nama 5 Solat Fardu, Bilangan Rakaat, Urutan Tertib, dan Adab Solat Seharian.
          </p>

          {/* Badge & Stamp Showcase */}
          <div className="flex items-center justify-center gap-6 my-4">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-amber-400 p-1 shadow-lg bg-white shrink-0">
              <img
                src="/src/assets/images/badge_juara_solat_1792822185329.jpg"
                alt="Juara Solat Badge"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1 text-amber-500 text-lg md:text-xl mb-1">
                {'⭐'.repeat(Math.min(5, Math.ceil(totalStars / 5)))}
                <span className="text-xs font-black text-amber-800 ml-1">({totalStars}/24 Bintang)</span>
              </div>
              <div className="inline-block bg-emerald-100 border border-emerald-300 text-emerald-800 px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wide">
                Gred: CEMERLANG MUMTAZ 🏆
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">Tarikh Penganugerahan: {currentDate}</p>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t-2 border-amber-200">
            <div className="text-center">
              <div className="font-heading text-lg font-bold text-amber-800 italic">Ustaz Afif Al-Hafiz</div>
              <p className="text-xs font-bold text-slate-500">Guru Pembimbing & Mentor Misi</p>
            </div>
            <div className="text-center">
              <div className="font-heading text-lg font-bold text-emerald-800 italic">Pendidikan Islam Interaktif</div>
              <p className="text-xs font-bold text-slate-500">Sidang Juri Istana Juara Solat</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="bg-amber-100/60 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-amber-300 print:hidden">
          <button
            onClick={handleDownloadOfflineGame}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black transition cursor-pointer shadow"
          >
            <Download className="w-4 h-4" />
            <span>Simpan Kod Satu Fail (Single HTML File)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-sm font-black transition cursor-pointer shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sijil Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl text-sm font-bold transition cursor-pointer"
            >
              Kembali ke Peta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
