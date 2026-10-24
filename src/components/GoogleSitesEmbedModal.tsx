import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Globe, HelpCircle, Layers, X, Code, Smartphone } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  onClose: () => void;
}

export const GoogleSitesEmbedModal: React.FC<Props> = ({ onClose }) => {
  const [copiedType, setCopiedType] = useState<'iframe' | 'url' | 'responsive' | null>(null);

  // App URL: uses window.location.origin if available, or official shared app url
  const appOrigin = typeof window !== 'undefined' && window.location.origin.includes('localhost')
    ? 'https://ais-pre-6mlplwl3crntkueqx7bfdt-413738176578.asia-northeast1.run.app'
    : (typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-6mlplwl3crntkueqx7bfdt-413738176578.asia-northeast1.run.app');

  const iframeCode = `<iframe
  src="${appOrigin}?autostart=1"
  width="100%"
  height="820"
  style="border:4px solid #f59e0b; border-radius:24px; box-shadow:0 12px 30px rgba(0,0,0,0.12); width:100%; min-height:820px;"
  title="Solat Adventure World - Permainan Edukasi Tahun 1"
  allow="fullscreen; autoplay"
  loading="lazy"
  allowfullscreen>
</iframe>`;

  const responsiveCode = `<div style="position:relative; width:100%; padding-top:62.5%; overflow:hidden; border-radius:20px; border:4px solid #f59e0b; box-shadow:0 10px 25px rgba(0,0,0,0.15);">
  <iframe
    src="${appOrigin}?autostart=1"
    style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;"
    title="Solat Adventure World"
    allow="fullscreen; autoplay"
    allowfullscreen>
  </iframe>
</div>`;

  const copyToClipboard = (text: string, type: 'iframe' | 'url' | 'responsive') => {
    sound.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border-4 sm:border-6 border-amber-400 shadow-2xl p-4 sm:p-6 my-auto max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg">
                  Panduan Guru & Integrasi Web
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 leading-tight">
                Selitkan Permainan Ke Google Sites Anda
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Tutup Paparan"
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Introduction note */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <span className="text-2xl shrink-0 mt-0.5">💡</span>
          <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed">
            Anda boleh memasukkan permainan ini terus ke dalam laman web <strong>Google Sites sekolah / kelas</strong> anda supaya murid Tahun 1 boleh bermain secara terus tanpa perlu membuka tab lain!
          </p>
        </div>

        {/* Step-by-Step Guide for Teachers */}
        <div className="mb-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Cara Selitkan Dalam Google Sites (3 Langkah Mudah):</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
              <div>
                <span className="inline-block w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-center leading-6 mb-2">1</span>
                <h4 className="font-bold text-slate-900 mb-1">Salin Kod Di Bawah</h4>
                <p className="text-slate-600">Tekan butang <strong>"Salin Kod Embed"</strong> pilihan anda di bahagian bawah.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
              <div>
                <span className="inline-block w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-center leading-6 mb-2">2</span>
                <h4 className="font-bold text-slate-900 mb-1">Buka Google Sites</h4>
                <p className="text-slate-600">
                  Di Google Sites anda, tekan menu <strong>Selitkan (Insert)</strong> ➔ pilih <strong>Sematkan / Selit (Embed)</strong>.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
              <div>
                <span className="inline-block w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-center leading-6 mb-2">3</span>
                <h4 className="font-bold text-slate-900 mb-1">Tampal Kod & Siap!</h4>
                <p className="text-slate-600">
                  Pilih tab <strong>Kod Sematan (Embed code)</strong>, tampal (Paste) kod tadi, kemudian tekan <strong>Seterusnya (Next)</strong> & <strong>Sisip</strong>!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Option 1: Standard Iframe Code (Recommended) */}
        <div className="space-y-4">
          <div className="border-2 border-emerald-400 bg-emerald-50/50 rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-700" />
                <h4 className="font-extrabold text-sm sm:text-base text-emerald-950">
                  Pilihan 1: Kod Embed HTML (Disyorkan & Paling Sesuai)
                </h4>
              </div>

              <button
                onClick={() => copyToClipboard(iframeCode, 'iframe')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-sm cursor-pointer ${
                  copiedType === 'iframe'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {copiedType === 'iframe' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Kod Berjaya Disalin! ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Kod Embed HTML</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-2 font-medium">
              Tampal kod ini di Google Sites pada pilihan <strong>"Insert" ➔ "Embed" ➔ "Embed Code"</strong>:
            </p>

            <pre className="p-3 bg-slate-900 text-amber-300 font-mono text-xs rounded-xl overflow-x-auto select-all leading-relaxed border border-slate-700">
              {iframeCode}
            </pre>
          </div>

          {/* Option 2: Responsive 16:9 Aspect Ratio Code */}
          <div className="border-2 border-amber-300 bg-amber-50/40 rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-700" />
                <h4 className="font-extrabold text-sm sm:text-base text-amber-950">
                  Pilihan 2: Kod Responsif Skrin Penuh (Autofit 16:9)
                </h4>
              </div>

              <button
                onClick={() => copyToClipboard(responsiveCode, 'responsive')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-sm cursor-pointer ${
                  copiedType === 'responsive'
                    ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {copiedType === 'responsive' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Kod Berjaya Disalin! ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Kod Responsif</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-2 font-medium">
              Sesuai jika anda mahu saiz permainan mengikut lebar skrin tablet/komputer murid secara automatik.
            </p>

            <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto select-all leading-relaxed border border-slate-700">
              {responsiveCode}
            </pre>
          </div>

          {/* Option 3: Direct URL for "By URL" Embed */}
          <div className="border-2 border-slate-200 bg-slate-50 rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-slate-600" />
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                  Pilihan 3: Pautan URL Terus (Embed by URL)
                </h4>
              </div>

              <button
                onClick={() => copyToClipboard(appOrigin, 'url')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  copiedType === 'url'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {copiedType === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'url' ? 'Pautan Disalin!' : 'Salin Pautan URL'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-1">
              Jika menggunakan pilihan <em>"By URL"</em> di Google Sites:
            </p>
            <div className="bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 break-all select-all">
              {appOrigin}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            *Permainan ini dioptimumkan sepenuhnya untuk pelayar Google Chrome, Edge & Safari pada semua peranti.
          </p>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
