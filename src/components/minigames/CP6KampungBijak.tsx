import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { Check, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (stars: number) => void;
  onClose: () => void;
}

export const CP6KampungBijak: React.FC<Props> = ({ onComplete, onClose }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect?: boolean } | null>(null);

  const scenario = {
    title: 'Situasi di Kampung Ceria: Waktu Azan Berkumandang',
    story:
      'Ahmad sedang seronok bermain layang-layang bersama kawan-kawan di padang kampung. Tiba-tiba, suara azan Zohor berkumandang dengan merdu dari pembesar suara surau.',
    question: 'Apakah tindakan paling bijak dan terpuji yang patut Ahmad lakukan?',
    choices: [
      {
        id: 'solat-segera',
        icon: '🕌',
        text: 'Berhenti bermain, berwuduk dan segera ke surau / rumah untuk tunaikan solat Zohor.',
        isCorrect: true,
        reason: 'Bijak! Orang yang bertakwa mengutamakan seruan Allah apabila mendengar azan.',
      },
      {
        id: 'main-terus',
        icon: '🪁',
        text: 'Teruskan bermain layang-layang sampai penat dan buat tidak tahu tentang azan.',
        isCorrect: false,
        reason: 'Jangan begitu ya adik. Solat tidak boleh diabaikan demi permainan.',
      },
      {
        id: 'tidur',
        icon: '😴',
        text: 'Tutup telinga dengan bantal dan tidur tanpa solat.',
        isCorrect: false,
        reason: 'Tidur melalaikan solat adalah perbuatan yang merugikan diri sendiri.',
      },
    ],
  };

  const handleSelect = (choiceId: string) => {
    sound.playClick();
    setSelectedChoice(choiceId);
  };

  const handleCheck = () => {
    if (!selectedChoice) {
      sound.playWrong();
      setFeedback({ message: 'Sila pilih salah satu tindakan di atas ya!', isCorrect: false });
      return;
    }

    const choice = scenario.choices.find(c => c.id === selectedChoice);
    if (choice?.isCorrect) {
      sound.playCorrect();
      setFeedback({ message: `ALHAMDULILLAH! ${choice.reason}`, isCorrect: true });
      setTimeout(() => {
        onComplete(3);
      }, 1600);
    } else {
      sound.playWrong();
      setFeedback({ message: choice?.reason || 'Cuba pilih tindakan yang lebih baik ya!', isCorrect: false });
    }
  };

  return (
    <div className="space-y-6">
      {/* Objective */}
      <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 text-center">
        <h3 className="text-xl font-bold text-orange-900 font-heading">Misi: Teladan Budak Bijak</h3>
        <p className="text-sm text-orange-700">Fahami situasi di kampung dan buat keputusan terbaik.</p>
      </div>

      {/* Story Box */}
      <div className="bg-amber-50 border-4 border-amber-300 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="text-4xl p-2 bg-white rounded-2xl shadow-sm">🏘️</span>
          <div>
            <h4 className="font-extrabold text-lg text-slate-900 mb-1">{scenario.title}</h4>
            <p className="text-base text-slate-700 leading-relaxed">{scenario.story}</p>
          </div>
        </div>
      </div>

      {/* Question & Choices */}
      <div>
        <p className="font-extrabold text-base text-slate-900 mb-3 text-center">
          ❓ {scenario.question}
        </p>

        <div className="space-y-3">
          {scenario.choices.map(c => {
            const isSelected = selectedChoice === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={`w-full p-4 rounded-2xl border-3 text-left flex items-start gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-200 shadow-md scale-101'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-3xl shrink-0">{c.icon}</span>
                <div>
                  <p className="font-bold text-base text-slate-900">{c.text}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border-2 text-center font-bold text-base ${
            feedback.isCorrect ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-rose-100 border-rose-400 text-rose-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm">
          Tutup
        </button>

        <button
          onClick={handleCheck}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-lg shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition cursor-pointer"
        >
          <Check className="w-5 h-5" />
          <span>Sahkan Tindakan</span>
        </button>
      </div>
    </div>
  );
};
