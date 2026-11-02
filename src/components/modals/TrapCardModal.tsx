/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameCard, Player } from '../../types/game';
import { TRAP_CARDS } from '../../data/cardsData';
import { sounds } from '../../utils/soundEffects';
import { AlertTriangle, ShieldCheck, ArrowRight, Dices, RefreshCw, Check, X, Users, HelpCircle } from 'lucide-react';

interface TrapCardModalProps {
  card: GameCard;
  player: Player;
  allPlayers: Player[];
  usedCardIds?: string[];
  onDrawAnotherCard?: () => GameCard;
  onApplyEffect: (effectResult: {
    stepsDelta?: number;
    newPosition?: number;
    targetNewPosition?: number;
    pointsDelta?: number;
    skipNextTurn?: boolean;
    targetPlayerId?: string;
    targetPointsDelta?: number;
    usedSaverCard?: boolean;
    description: string;
  }) => void;
  onClose: () => void;
}

export const TrapCardModal: React.FC<TrapCardModalProps> = ({
  card,
  player,
  allPlayers,
  usedCardIds = [],
  onDrawAnotherCard,
  onApplyEffect,
  onClose,
}) => {
  const [currentCard, setCurrentCard] = useState<GameCard>(card);
  const [useSaver, setUseSaver] = useState(false);
  const [subDiceRoll, setSubDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const otherPlayers = allPlayers.filter((p) => p.id !== player.id);
  const aheadPlayers = otherPlayers.filter((p) => p.position > player.position);

  const [selectedTargetPlayerId, setSelectedTargetPlayerId] = useState<string>(
    otherPlayers[0]?.id || ''
  );
  const [selectedAheadPlayerId, setSelectedAheadPlayerId] = useState<string>(
    aheadPlayers[0]?.id || ''
  );

  const [quizAnswered, setQuizAnswered] = useState<boolean | null>(null);
  const [explainOrganPassed, setExplainOrganPassed] = useState<boolean | null>(null);
  const [virusOutcome, setVirusOutcome] = useState<'target_correct' | 'target_wrong' | null>(null);

  useEffect(() => {
    setCurrentCard(card);
    setSubDiceRoll(null);
    setQuizAnswered(null);
    setExplainOrganPassed(null);
    setVirusOutcome(null);
    setUseSaver(false);
  }, [card]);

  useEffect(() => {
    if (otherPlayers.length > 0 && !selectedTargetPlayerId) {
      setSelectedTargetPlayerId(otherPlayers[0].id);
    }
  }, [otherPlayers, selectedTargetPlayerId]);

  const cardIndex = TRAP_CARDS.findIndex((c) => c.id === currentCard.id);
  const totalCards = TRAP_CARDS.length;
  const remainingCardsCount = TRAP_CARDS.filter((c) => !usedCardIds.includes(c.id)).length;

  const handleShuffleAnotherCard = () => {
    sounds.playCardFlip();
    if (onDrawAnotherCard) {
      const nextCard = onDrawAnotherCard();
      setCurrentCard(nextCard);
    } else {
      const unused = TRAP_CARDS.filter((c) => c.id !== currentCard.id && !usedCardIds.includes(c.id));
      const pool = unused.length > 0 ? unused : TRAP_CARDS.filter((c) => c.id !== currentCard.id);
      const nextCard = pool[Math.floor(Math.random() * pool.length)] || TRAP_CARDS[0];
      setCurrentCard(nextCard);
    }
    setSubDiceRoll(null);
    setQuizAnswered(null);
    setExplainOrganPassed(null);
    setVirusOutcome(null);
    setUseSaver(false);
  };

  const handleRollMiniDice = (onFinish: (val: number) => void) => {
    setIsRolling(true);
    sounds.playDiceRoll();
    let count = 0;
    const interval = setInterval(() => {
      setSubDiceRoll(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        const res = Math.floor(Math.random() * 6) + 1;
        setSubDiceRoll(res);
        setIsRolling(false);
        onFinish(res);
      }
    }, 60);
  };

  const handleResolve = () => {
    sounds.playStep();

    // Check if player uses Saver card against point loss
    if (useSaver && player.hasSaverCard) {
      sounds.playShield();
      onApplyEffect({
        usedSaverCard: true,
        pointsDelta: 0,
        description: `Menggunakan KARTU PENYELAMAT! Hukuman dari ${currentCard.title} berhasil dibatalkan.`,
      });
      return;
    }

    switch (currentCard.effectType) {
      case 'back_to_start':
        sounds.playPenalty();
        onApplyEffect({
          newPosition: 1,
          description: 'Terkena HARI SIAL: Mulai lagi perjalanan dari START (Kotak 1)!',
        });
        break;

      case 'trap_loss_20':
        if (quizAnswered) {
          sounds.playBonus();
          onApplyEffect({
            pointsDelta: 0,
            description: 'Berhasil menyebutkan fungsi usus halus! Hukuman -20 poin dibatalkan.',
          });
        } else {
          sounds.playPenalty();
          onApplyEffect({
            pointsDelta: -20,
            description: 'Kehilangan 20 poin akibat jebakan BAHAYA BESAR!',
          });
        }
        break;

      case 'trap_bacteria_back_3':
        sounds.playPenalty();
        onApplyEffect({
          stepsDelta: -3,
          description: 'Terkena Bakteri Jahat: Mundur 3 langkah!',
        });
        break;

      case 'trap_stomach_ache':
        sounds.playPenalty();
        onApplyEffect({
          skipNextTurn: true,
          description: 'Sakit Perut: Kehilangan 1 giliran bermain!',
        });
        break;

      case 'swap_position': {
        const chosenAhead =
          aheadPlayers.find((p) => p.id === selectedAheadPlayerId) ||
          [...aheadPlayers].sort((a, b) => b.position - a.position)[0];

        if (chosenAhead) {
          sounds.playBonus();
          onApplyEffect({
            newPosition: chosenAhead.position,
            targetPlayerId: chosenAhead.id,
            targetNewPosition: player.position,
            description: `Tukar posisi: Kamu maju ke Kotak #${chosenAhead.position} dan ${chosenAhead.name} berpindah ke Kotak #${player.position}!`,
          });
        } else {
          onApplyEffect({
            description: 'Kamu memimpin di posisi terdepan, tidak ada pemain di depanmu untuk ditukar.',
          });
        }
        break;
      }

      case 'explain_organ':
        if (explainOrganPassed === false) {
          sounds.playPenalty();
          onApplyEffect({
            pointsDelta: -5,
            description: 'Tantangan Organ Hilang belum berhasil dijelaskan (-5 poin).',
          });
        } else {
          sounds.playBonus();
          onApplyEffect({
            pointsDelta: 0,
            description: 'Tantangan Organ Hilang berhasil dijelaskan kepada petualang lain!',
          });
        }
        break;

      case 'trap_virus': {
        const target = otherPlayers.find((p) => p.id === selectedTargetPlayerId) || otherPlayers[0];
        if (virusOutcome === 'target_correct') {
          sounds.playPenalty();
          onApplyEffect({
            pointsDelta: -5,
            description: `Ada Virus: ${target?.name || 'Pemain lawan'} menjawab benar! Kamu kehilangan 5 poin.`,
          });
        } else if (virusOutcome === 'target_wrong') {
          sounds.playBonus();
          onApplyEffect({
            targetPlayerId: target?.id,
            targetPointsDelta: -5,
            description: `Ada Virus: ${target?.name || 'Pemain lawan'} salah menjawab dan kehilangan 5 poin!`,
          });
        } else {
          onApplyEffect({
            description: 'Tantangan Ada Virus diselesaikan.',
          });
        }
        break;
      }

      default:
        onApplyEffect({
          description: `Menjalankan kartu jebakan: ${currentCard.title}`,
        });
        break;
    }
  };

  const handlePortalConfirm = () => {
    if (subDiceRoll === null) return;
    const isOdd = subDiceRoll % 2 !== 0;
    const steps = isOdd ? -3 : 3;
    if (isOdd) sounds.playPenalty();
    else sounds.playBonus();

    onApplyEffect({
      stepsDelta: steps,
      description: `Portal Usus: Dadu keluar ${subDiceRoll} (${isOdd ? 'Ganjil - Mundur 3 Langkah' : 'Genap - Maju 3 Langkah'}).`,
    });
  };

  const handleTukarNasibConfirm = () => {
    if (subDiceRoll === null) return;
    if (subDiceRoll <= 3) {
      sounds.playBonus();
      const target = otherPlayers.find((p) => p.id === selectedTargetPlayerId) || otherPlayers[0];
      if (target) {
        onApplyEffect({
          targetPlayerId: target.id,
          targetPointsDelta: -10,
          description: `Tukar Nasib: Dadu ${subDiceRoll} (1-3) -> ${target.name} kehilangan 10 poin!`,
        });
      } else {
        onApplyEffect({
          description: `Tukar Nasib: Dadu ${subDiceRoll} (1-3) -> Beruntung! Tidak ada lawan yang terkena.`,
        });
      }
    } else {
      sounds.playPenalty();
      onApplyEffect({
        pointsDelta: -10,
        description: `Tukar Nasib: Dadu ${subDiceRoll} (4-6) -> Kamu kehilangan 10 poin!`,
      });
    }
  };

  const hasPointPenalty =
    currentCard.effectType === 'trap_loss_20' ||
    currentCard.effectType === 'trap_swap_points' ||
    (currentCard.effectType === 'trap_virus' && virusOutcome === 'target_correct');

  const isLoss20NeedAnswer = currentCard.effectType === 'trap_loss_20' && quizAnswered === null && !useSaver;
  const isExplainOrganNeedAnswer = currentCard.effectType === 'explain_organ' && explainOrganPassed === null;
  const isVirusNeedAnswer = currentCard.effectType === 'trap_virus' && virusOutcome === null && otherPlayers.length > 0;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-4 border-blue-500 relative max-h-[92vh] flex flex-col">
        {/* Header with Randomized Card Indicator (Blue Theme) */}
        <div className="text-center mb-3 shrink-0">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-300">
              <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
              <span>KARTU JEBAKAN (WARNA BIRU)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-black shadow-xs">
              <Dices className="w-3 h-3" />
              <span>Acak &bull; Tersisa {Math.max(1, remainingCardsCount)} dari {totalCards}</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-blue-950 mt-1">
            {currentCard.title}
          </h3>
          <p className="text-xs text-slate-500">Menimpa Petualang: <strong className="text-slate-800">{player.name}</strong></p>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Card Authentic Visual */}
          <div className="flex justify-center my-1">
            <div className="rounded-2xl overflow-hidden shadow-md border-3 border-blue-200 max-w-[240px] bg-blue-50">
              <img
                src={currentCard.image}
                alt={currentCard.title}
                className="w-full h-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Instruction */}
          <div className="bg-blue-50/90 rounded-2xl p-3.5 border border-blue-200 text-center">
            <p className="text-xs sm:text-sm font-semibold text-blue-950 leading-relaxed">
              {currentCard.instruction}
            </p>
          </div>

          {/* Re-shuffle / Kocok Kartu Lain Button */}
          <div className="flex justify-center">
            <button
              onClick={handleShuffleAnotherCard}
              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-700" />
              <span>Kocok Kartu Tersisa Lainnya ({Math.max(0, remainingCardsCount - 1)} Kartu)</span>
            </button>
          </div>

          {/* Saver Card Shield Option if available */}
          {player.hasSaverCard && hasPointPenalty && (
            <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-amber-900">Kamu punya Kartu Penyelamat!</p>
                  <p className="text-slate-600">Batalkan pengurangan poin?</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setUseSaver(!useSaver);
                  sounds.playShield();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  useSaver
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border-2 border-amber-400 text-amber-800 hover:bg-amber-100'
                }`}
              >
                {useSaver ? '✓ Dipakai' : 'Gunakan'}
              </button>
            </div>
          )}

          {/* 1. Portal Usus */}
          {currentCard.effectType === 'trap_portal' && (
            <div className="space-y-3 text-center">
              {subDiceRoll === null ? (
                <button
                  onClick={() => handleRollMiniDice(() => {})}
                  disabled={isRolling}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <Dices className="w-5 h-5" />
                  <span>{isRolling ? 'Memutar Dadu Portal...' : 'Putar Dadu Portal Usus'}</span>
                </button>
              ) : (
                <div className="space-y-2.5">
                  <div className="p-3 bg-blue-100/70 border border-blue-300 rounded-xl text-xs font-bold text-blue-950">
                    Hasil Dadu: {subDiceRoll} ({subDiceRoll % 2 !== 0 ? 'Ganjil -> Mundur 3 Langkah' : 'Genap -> Maju 3 Langkah'})
                  </div>
                  <button
                    onClick={handlePortalConfirm}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>KONFIRMASI LANGKAH PORTAL</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. Tukar Nasib */}
          {currentCard.effectType === 'trap_swap_points' && (
            <div className="space-y-3">
              {otherPlayers.length > 0 && subDiceRoll === null && (
                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1">
                    Pilih petualang target (jika dadu 1-3):
                  </label>
                  <select
                    value={selectedTargetPlayerId}
                    onChange={(e) => setSelectedTargetPlayerId(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-blue-300 rounded-xl font-semibold text-slate-800"
                  >
                    {otherPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.points} Poin)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {subDiceRoll === null ? (
                <button
                  onClick={() => handleRollMiniDice(() => {})}
                  disabled={isRolling}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <RefreshCw className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
                  <span>{isRolling ? 'Mengundi Nasib...' : 'Lempar Dadu Tukar Nasib'}</span>
                </button>
              ) : (
                <div className="space-y-2.5">
                  <div className="p-3 bg-blue-100/70 border border-blue-300 rounded-xl text-xs font-bold text-blue-950 text-center">
                    Hasil Dadu: {subDiceRoll} ({subDiceRoll <= 3 ? '1-3: Pemain Pilihan -10 Poin' : '4-6: Kamu -10 Poin'})
                  </div>
                  <button
                    onClick={handleTukarNasibConfirm}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>KONFIRMASI HASIL TUKAR NASIB</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. Bahaya Besar (-20 Poin / Quiz Usus Halus) */}
          {currentCard.effectType === 'trap_loss_20' && (
            <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200">
              <p className="text-xs font-bold text-blue-950 mb-2.5">
                Sebutkan fungsi usus halus untuk membatalkan hukuman:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    sounds.playBonus();
                    setQuizAnswered(true);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    quizAnswered === true
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white border-2 border-emerald-400 text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  ✓ Benar (Batal -20)
                </button>
                <button
                  onClick={() => {
                    sounds.playPenalty();
                    setQuizAnswered(false);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    quizAnswered === false
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-white border-2 border-rose-400 text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  ✗ Salah (-20 Poin)
                </button>
              </div>
            </div>
          )}

          {/* 4. Organ Hilang */}
          {currentCard.effectType === 'explain_organ' && (
            <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200">
              <p className="text-xs font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Tantangan Penjelasan Organ:</span>
              </p>
              <p className="text-[11px] text-slate-600 mb-2.5">
                Sebutkan salah satu organ pencernaan dan jelaskan fungsinya kepada teman-teman:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    sounds.playBonus();
                    setExplainOrganPassed(true);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    explainOrganPassed === true
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white border-2 border-emerald-400 text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  ✓ Berhasil (Aman)
                </button>
                <button
                  onClick={() => {
                    sounds.playPenalty();
                    setExplainOrganPassed(false);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    explainOrganPassed === false
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-white border-2 border-rose-400 text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  ✗ Belum Tepat (-5)
                </button>
              </div>
            </div>
          )}

          {/* 5. Ada Virus */}
          {currentCard.effectType === 'trap_virus' && (
            <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 space-y-3">
              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">
                  Pilih 1 petualang lawan untuk ditantang:
                </label>
                {otherPlayers.length > 0 ? (
                  <select
                    value={selectedTargetPlayerId}
                    onChange={(e) => setSelectedTargetPlayerId(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-blue-300 rounded-xl font-semibold text-slate-800"
                  >
                    {otherPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Kotak #{p.position}, {p.points} Poin)
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-slate-500 italic">Bermain solo: Uji pemahaman mandiri.</p>
                )}
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-blue-200 text-xs">
                <span className="font-bold text-blue-950 block">Pertanyaan Uji Virus:</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  &ldquo;Organ pencernaan manakah yang berfungsi menyerap air dan memadatkan feses?&rdquo; (Jawaban: Usus Besar)
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-bold text-slate-600 mb-1.5">Hasil Jawaban Lawan:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sounds.playPenalty();
                      setVirusOutcome('target_correct');
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      virusOutcome === 'target_correct'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-white border-2 border-rose-400 text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    Lawan Benar (Kamu -5)
                  </button>
                  <button
                    onClick={() => {
                      sounds.playBonus();
                      setVirusOutcome('target_wrong');
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      virusOutcome === 'target_wrong'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white border-2 border-emerald-400 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    Lawan Salah (Lawan -5)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Confirmation Button */}
        {currentCard.effectType !== 'trap_portal' && currentCard.effectType !== 'trap_swap_points' && (
          <div className="pt-3 border-t border-slate-100 mt-2 shrink-0">
            <button
              disabled={isLoss20NeedAnswer || isExplainOrganNeedAnswer || isVirusNeedAnswer}
              onClick={handleResolve}
              className={`w-full py-3 rounded-xl font-heading font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isLoss20NeedAnswer || isExplainOrganNeedAnswer || isVirusNeedAnswer
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white active:scale-98 shadow-blue-600/20'
              }`}
            >
              <span>
                {isLoss20NeedAnswer || isExplainOrganNeedAnswer || isVirusNeedAnswer
                  ? 'Lengkapi Pilihan Di Atas Terlebih Dahulu'
                  : useSaver
                  ? 'KONFIRMASI: BATALKAN DENGAN PENYELAMAT'
                  : 'KONFIRMASI HASIL JEBAKAN'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
