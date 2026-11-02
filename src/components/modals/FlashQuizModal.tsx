/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, QrQuestion } from '../../types/game';
import { QR_CHALLENGES } from '../../data/quizzesData';
import { Sparkles, HelpCircle, CheckCircle2, XCircle, Award, X } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { fireMiniConfetti } from '../../utils/confetti';

interface FlashQuizModalProps {
  player: Player;
  onAwardBonus: (points: number, message: string) => void;
  onClose: () => void;
}

export const FlashQuizModal: React.FC<FlashQuizModalProps> = ({
  player,
  onAwardBonus,
  onClose,
}) => {
  // Pick a random question from question bank
  const [question] = useState<QrQuestion>(() => {
    const randomIndex = Math.floor(Math.random() * QR_CHALLENGES.length);
    return QR_CHALLENGES[randomIndex];
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    setIsSubmitted(true);

    const isCorrect = idx === question.correctAnswer;
    if (isCorrect) {
      sounds.playBonus();
      fireMiniConfetti();
      onAwardBonus(10, `Menjawab benar Kuis Kilat IPA (+10 poin)!`);
    } else {
      sounds.playPenalty();
    }
  };

  const isCorrect = selectedOption !== null && selectedOption === question.correctAnswer;

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border-3 border-amber-300 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-heading font-extrabold text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full border border-amber-300">
                  KUIS KILAT IPA (+10 POIN)
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  Petualang: {player.name}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-heading font-black text-slate-800 mt-0.5">
                Uji Pemahaman Sistem Pencernaan
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Body */}
        <div className="my-4">
          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed bg-amber-50/70 p-3 sm:p-4 rounded-xl border border-amber-200">
            {question.question}
          </p>

          {/* Options */}
          <div className="space-y-2 mt-3">
            {question.options.map((option, idx) => {
              let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700';

              if (isSubmitted) {
                if (idx === question.correctAnswer) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400 font-bold';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs sm:text-sm cursor-pointer flex items-center justify-between ${btnStyle} ${
                    !isSubmitted ? 'hover:scale-[1.01] active:scale-[0.99]' : ''
                  }`}
                >
                  <span>{option}</span>
                  {isSubmitted && idx === question.correctAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {isSubmitted && idx === selectedOption && idx !== question.correctAnswer && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation after submit */}
          {isSubmitted && (
            <div
              className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed animate-in fade-in ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {isCorrect ? (
                  <>
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Hebat! Jawabanmu Benar (+10 Poin)</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Penjelasan Edukasi:</span>
                  </>
                )}
              </div>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-heading font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all"
          >
            {isSubmitted ? 'Selesai & Lanjut Main' : 'Tutup'}
          </button>
        </div>
      </div>
    </div>
  );
};
