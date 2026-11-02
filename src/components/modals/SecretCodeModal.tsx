/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SECRET_CODE_CHALLENGES } from '../../data/quizzesData';
import { sounds } from '../../utils/soundEffects';
import { KeyRound, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

interface SecretCodeModalProps {
  playerName: string;
  onSuccess: (points: number, message: string) => void;
  onClose: () => void;
}

export const SecretCodeModal: React.FC<SecretCodeModalProps> = ({
  playerName,
  onSuccess,
  onClose,
}) => {
  // Random challenge
  const [challenge] = useState(() => {
    const idx = Math.floor(Math.random() * SECRET_CODE_CHALLENGES.length);
    return SECRET_CODE_CHALLENGES[idx];
  });

  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [attempts, setAttempts] = useState(0);

  const normalize = (str: string) => str.trim().toUpperCase().replace(/\s+/g, '');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setAttempts((prev) => prev + 1);
    const isMatched = normalize(inputVal) === normalize(challenge.answer);

    if (isMatched) {
      sounds.playBonus();
      setStatus('correct');
    } else {
      sounds.playPenalty();
      setStatus('wrong');
    }
  };

  const handleComplete = () => {
    onSuccess(10, `Memecahkan Secret Code ${challenge.answer}! Mendapatkan +10 poin.`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-4 border-amber-300 relative">
        {/* Header */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-extrabold tracking-wider uppercase bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
            KOTAK 25: SECRET CODE
          </span>
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-800 mt-2">
            Pecahkan Kode Rahasia Organ!
          </h3>
          <p className="text-xs text-slate-500">Petualang: {playerName}</p>
        </div>

        {/* Lock Graphic Card */}
        <div className="bg-linear-to-b from-amber-50 to-orange-50/50 rounded-2xl p-5 border-2 border-amber-200 text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-400 text-amber-950 rounded-2xl shadow-md mb-3">
            <KeyRound className="w-6 h-6" />
          </div>

          <div className="text-2xl sm:text-3xl font-heading font-extrabold tracking-[0.25em] text-slate-800 bg-white py-3 px-4 rounded-xl border border-amber-300 shadow-xs inline-block">
            {challenge.displayCode}
          </div>

          <p className="text-xs sm:text-sm font-medium text-amber-950 mt-3 max-w-xs mx-auto">
            💡 <strong>Petunjuk:</strong> &ldquo;{challenge.hint}&rdquo;
          </p>
        </div>

        {/* Form Input */}
        {status !== 'correct' ? (
          <form onSubmit={handleCheck} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Ketik Jawaban Organ:
              </label>
              <input
                type="text"
                autoFocus
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value.toUpperCase());
                  if (status === 'wrong') setStatus('idle');
                }}
                placeholder="CONTOH: MULUT"
                className="w-full px-4 py-3 text-center text-base sm:text-lg font-heading font-bold tracking-wider bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500 focus:bg-white uppercase placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
              />
            </div>

            {status === 'wrong' && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Jawaban &ldquo;{inputVal}&rdquo; belum tepat (percobaan ke-{attempts}). Baca petunjuknya lagi ya!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-heading font-bold text-sm tracking-wide shadow-md shadow-orange-500/20 active:scale-98 transition-all cursor-pointer"
            >
              PERIKSA JAWABAN (+10 POIN)
            </button>
          </form>
        ) : (
          <div className="space-y-4 animate-in zoom-in-95">
            <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-1 animate-bounce" />
              <h4 className="text-lg font-heading font-extrabold text-emerald-900">
                HEBAT! KODE BERHASIL DIPECAHKAN!
              </h4>
              <p className="text-xs font-bold text-emerald-700 mt-1">
                Jawaban: {challenge.answer} (+10 Poin)
              </p>
              <p className="text-xs text-slate-600 mt-2 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                {challenge.organFact}
              </p>
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-heading font-bold text-sm tracking-wide shadow-md shadow-emerald-500/20 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>SIMPAN 10 POIN & LANJUTKAN</span>
            </button>
          </div>
        )}

        {/* Close without solving */}
        {status !== 'correct' && (
          <button
            onClick={onClose}
            className="w-full mt-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
          >
            Lewati Tantangan
          </button>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
