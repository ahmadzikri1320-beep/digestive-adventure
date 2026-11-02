import React, { useEffect } from 'react';
import { Player } from '../../types/game';
import { ORGAN_CARDS } from '../../data/cardsData';
import { sounds } from '../../utils/soundEffects';
import { fireVictoryConfetti } from '../../utils/confetti';
import { Trophy, Award, Sparkles, CheckCircle2, ArrowRight, Layers, Coins, PartyPopper } from 'lucide-react';

interface FinishModalProps {
  player: Player;
  rank: number;
  bonusPoints: number;
  organBonusPoints?: number;
  organCards?: string[];
  totalBonusPoints?: number;
  onContinue: () => void;
  isAllFinished: boolean;
  onViewSummary: () => void;
}

export const FinishModal: React.FC<FinishModalProps> = ({
  player,
  rank,
  bonusPoints,
  organBonusPoints = 0,
  organCards = [],
  totalBonusPoints,
  onContinue,
  isAllFinished,
  onViewSummary,
}) => {
  useEffect(() => {
    sounds.playVictory();
    // Fire multi-stage grand victory confetti animation
    fireVictoryConfetti();
  }, []);

  const rankBadges = ['🥇 Juara 1 Finish', '🥈 Juara 2 Finish', '🥉 Juara 3 Finish', '🏅 Selesai Finish'];
  const finalTotalBonus = totalBonusPoints !== undefined ? totalBonusPoints : bonusPoints + organBonusPoints;

  return (
    <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-7 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow backdrop */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-orange-300/30 rounded-full blur-2xl pointer-events-none" />

        <div className="overflow-y-auto pr-1 flex-1">
          <div className="inline-flex p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-inner mb-2">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 animate-bounce" />
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1">
              {rankBadges[rank - 1] || 'Finish'}
            </span>
          </div>

          <h3 className="text-xl sm:text-3xl font-heading font-extrabold text-slate-800 mt-1">
            SELAMAT, {player.name.toUpperCase()}!
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Berhasil menyelesaikan seluruh penjelajahan sistem pencernaan dan Final Mission!
          </p>

          <div className="flex justify-center mt-2">
            <button
              onClick={() => {
                sounds.playBonus();
                fireVictoryConfetti();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-xs font-bold border border-amber-300 shadow-2xs cursor-pointer transition-all active:scale-95 animate-pulse"
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-600" />
              <span>Rayakan Konfeti Lagi! 🎉</span>
            </button>
          </div>

          {/* Total Bonus Point Hero Card */}
          <div className="my-4 p-4 rounded-2xl bg-linear-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 shadow-xs">
            <div className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">
              TOTAL BONUS DI GARIS FINISH
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-extrabold text-amber-950 mt-0.5">
              +{finalTotalBonus} Poin!
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Total Skor Akhir: <strong className="text-slate-900 text-sm font-extrabold">{player.points} Poin</strong>
            </p>
          </div>

          {/* Breakdown Section: Rank Bonus + Organ Accumulation Bonus */}
          <div className="space-y-2.5 text-left mb-4">
            {/* 1. Rank Bonus */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-amber-950">
                  Bonus Urutan Finish (Peringkat ke-{rank})
                </span>
              </div>
              <span className="text-xs font-heading font-extrabold text-amber-800">
                +{bonusPoints} Poin
              </span>
            </div>

            {/* 2. Organ Cards Accumulation */}
            <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-xs font-bold text-rose-950">
                    Akumulasi {organCards.length} Kartu Organ di Inventaris
                  </span>
                </div>
                <span className="text-xs font-heading font-extrabold text-rose-700">
                  +{organBonusPoints} Poin
                </span>
              </div>

              {/* Organ Chips Showcase */}
              {organCards.length > 0 ? (
                <div className="pt-1.5 border-t border-rose-200/60">
                  <p className="text-[10px] text-rose-800 font-semibold mb-1.5">
                    Kartu organ yang berhasil dikumpulkan (10 poin/kartu):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {organCards.map((key) => {
                      const organ = ORGAN_CARDS[key];
                      if (!organ) return null;
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-rose-200 text-[10px] font-bold text-rose-900 shadow-2xs"
                        >
                          <img
                            src={organ.image}
                            alt={organ.title}
                            className="w-3.5 h-3.5 object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <span>{organ.title}</span>
                          <span className="text-emerald-600 font-black">+10</span>
                        </span>
                      );
                    })}
                  </div>
                  {organCards.length === 8 && (
                    <div className="mt-2 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lengkap 8 Organ! Bonus Set Sistem Pencernaan (+20 Poin)!</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic pt-1 border-t border-rose-100">
                  Belum ada kartu organ tersimpan di inventaris saat finish (+0 poin).
                </p>
              )}
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mb-4 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isAllFinished
                ? 'Semua pemain telah menyelesaikan penjelajahan!'
                : 'Pemain lain masih melanjutkan giliran bermain untuk mengumpulkan poin tertinggi.'}
            </span>
          </div>
        </div>

        {/* Continue Actions */}
        <div className="pt-2 shrink-0">
          {isAllFinished ? (
            <button
              onClick={() => {
                sounds.playBonus();
                onViewSummary();
              }}
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-heading font-bold text-sm tracking-wide shadow-lg shadow-orange-500/25 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>LIHAT PAPAN KLASEMEN AKHIR</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playStep();
                onContinue();
              }}
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-heading font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>LANJUTKAN GILIRAN BERIKUTNYA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
