/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameCard, Player } from '../../types/game';
import { MYSTERY_CARDS } from '../../data/cardsData';
import { sounds } from '../../utils/soundEffects';
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle, Users, Dices, RefreshCw } from 'lucide-react';

interface MysteryCardModalProps {
  card: GameCard;
  player: Player;
  allPlayers?: Player[];
  usedCardIds?: string[];
  onDrawAnotherCard?: () => GameCard;
  onApplyEffect: (effectResult: {
    stepsDelta?: number;
    newPosition?: number;
    targetNewPosition?: number;
    targetPlayerId?: string;
    pointsDelta?: number;
    gotSaverCard?: boolean;
    rollAgain?: boolean;
    description: string;
  }) => void;
  onClose: () => void;
}

export const MysteryCardModal: React.FC<MysteryCardModalProps> = ({
  card,
  player,
  allPlayers = [],
  usedCardIds = [],
  onDrawAnotherCard,
  onApplyEffect,
  onClose,
}) => {
  const [currentCard, setCurrentCard] = useState<GameCard>(card);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [teacherApproved, setTeacherApproved] = useState<boolean | null>(null);

  // For swap_position effect
  const otherPlayers = allPlayers.filter((p) => p.id !== player.id);
  const aheadPlayers = otherPlayers.filter((p) => p.position > player.position);
  const [selectedAheadPlayerId, setSelectedAheadPlayerId] = useState<string>(
    aheadPlayers[0]?.id || ''
  );

  useEffect(() => {
    setCurrentCard(card);
    setSelectedOption(null);
    setAnsweredCorrectly(null);
    setTeacherApproved(null);
  }, [card]);

  useEffect(() => {
    if (aheadPlayers.length > 0 && !selectedAheadPlayerId) {
      setSelectedAheadPlayerId(aheadPlayers[0].id);
    }
  }, [aheadPlayers, selectedAheadPlayerId]);

  const cardIndex = MYSTERY_CARDS.findIndex((c) => c.id === currentCard.id);
  const totalCards = MYSTERY_CARDS.length;
  const remainingCardsCount = MYSTERY_CARDS.filter((c) => !usedCardIds.includes(c.id)).length;

  const handleShuffleAnotherCard = () => {
    sounds.playCardFlip();
    if (onDrawAnotherCard) {
      const nextCard = onDrawAnotherCard();
      setCurrentCard(nextCard);
    } else {
      const unused = MYSTERY_CARDS.filter((c) => c.id !== currentCard.id && !usedCardIds.includes(c.id));
      const pool = unused.length > 0 ? unused : MYSTERY_CARDS.filter((c) => c.id !== currentCard.id);
      const nextCard = pool[Math.floor(Math.random() * pool.length)] || MYSTERY_CARDS[0];
      setCurrentCard(nextCard);
    }
    setSelectedOption(null);
    setAnsweredCorrectly(null);
    setTeacherApproved(null);
  };

  const handleResolve = () => {
    sounds.playStep();

    switch (currentCard.effectType) {
      case 'move_forward':
        sounds.playBonus();
        onApplyEffect({
          stepsDelta: currentCard.effectValue || 2,
          description: `Mendapat kartu Kejutan: Maju ${currentCard.effectValue || 2} langkah!`,
        });
        break;

      case 'move_backward':
        sounds.playPenalty();
        onApplyEffect({
          stepsDelta: -(currentCard.effectValue || 2),
          description: `Mendapat kartu Salah Jalur: Mundur ${currentCard.effectValue || 2} langkah!`,
        });
        break;

      case 'saver':
        sounds.playShield();
        onApplyEffect({
          gotSaverCard: true,
          description: 'Mendapat KARTU PENYELAMAT! Kartu ini akan melindungi dari pengurangan poin.',
        });
        break;

      case 'quiz_acid':
        if (answeredCorrectly) {
          sounds.playBonus();
          onApplyEffect({
            pointsDelta: 10,
            description: 'Berhasil menjawab kuis asam lambung! +10 poin.',
          });
        } else {
          onApplyEffect({
            pointsDelta: 0,
            description: 'Jawaban kuis belum tepat. Tetap semangat!',
          });
        }
        break;

      case 'quiz_teeth':
        if (teacherApproved) {
          sounds.playBonus();
          onApplyEffect({
            pointsDelta: 10,
            description: 'Berhasil menjelaskan fungsi gigi! +10 poin.',
          });
        } else {
          onApplyEffect({
            pointsDelta: 0,
            description: 'Penjelasan belum tepat. Coba lagi di kesempatan berikutnya!',
          });
        }
        break;

      case 'action_gestures':
        if (teacherApproved) {
          sounds.playBonus();
          onApplyEffect({
            pointsDelta: 10,
            description: 'Berhasil memperagakan perjalanan makanan mulut ke lambung! +10 poin.',
          });
        } else {
          onApplyEffect({
            pointsDelta: 0,
            description: 'Peragaan belum tepat. Tetap semangat!',
          });
        }
        break;

      case 'swap_position':
        if (selectedAheadPlayerId) {
          const target = allPlayers.find((p) => p.id === selectedAheadPlayerId);
          if (target) {
            sounds.playBonus();
            onApplyEffect({
              newPosition: target.position,
              targetNewPosition: player.position,
              targetPlayerId: target.id,
              description: `PINDAH POSISI (Kartu Mystery Ungu): Bertukar posisi dengan ${target.name} (sekarang di Kotak #${target.position})!`,
            });
            return;
          }
        }
        sounds.playBonus();
        onApplyEffect({
          description: 'PINDAH POSISI: Kamu sedang di posisi terdepan, posisi tetap aman.',
        });
        break;

      default:
        onApplyEffect({
          description: `Menjalankan kartu misteri: ${currentCard.title}`,
        });
        break;
    }
  };

  const handleChooseBonus = () => {
    sounds.playBonus();
    onApplyEffect({
      pointsDelta: 5,
      description: 'Memilih opsi +5 poin dari kartu Pilihan!',
    });
  };

  const handleChooseRollAgain = () => {
    sounds.playStep();
    onApplyEffect({
      rollAgain: true,
      description: 'Memilih lempar dadu lagi dari kartu Pilihan!',
    });
  };

  const isQuizAcidNeedAnswer = currentCard.effectType === 'quiz_acid' && selectedOption === null;
  const isTeacherNeedAnswer =
    (currentCard.effectType === 'quiz_teeth' || currentCard.effectType === 'action_gestures') &&
    teacherApproved === null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-4 border-purple-400 relative max-h-[94vh] flex flex-col overflow-y-auto">
        {/* Header with Randomized Card Indicator and Re-shuffle Option */}
        <div className="text-center mb-3">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold border border-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>KARTU MYSTERY (WARNA UNGU)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-600 text-white text-[11px] font-black shadow-xs">
              <Dices className="w-3 h-3" />
              <span>Acak &bull; Tersisa {Math.max(1, remainingCardsCount)} dari {totalCards}</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-800 mt-1">
            {currentCard.title}
          </h3>
          <p className="text-xs text-slate-500">Giliran Petualang: <strong>{player.name}</strong></p>
        </div>

        {/* Card Authentic Visual */}
        <div className="flex justify-center my-2">
          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-purple-200 max-w-[260px] bg-purple-50 p-1">
            <img
              src={currentCard.image}
              alt={currentCard.title}
              className="w-full h-auto object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Card Instruction */}
        <div className="bg-purple-50 rounded-2xl p-3.5 border border-purple-200 text-center mb-3">
          <p className="text-xs sm:text-sm font-bold text-purple-950 leading-relaxed">
            {currentCard.instruction}
          </p>
        </div>

        {/* Re-shuffle / Kocok Kartu Lain Button */}
        <div className="flex justify-center mb-3">
          <button
            onClick={handleShuffleAnotherCard}
            className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-900 border border-purple-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-700" />
            <span>Kocok Kartu Tersisa Lainnya ({Math.max(0, remainingCardsCount - 1)} Kartu)</span>
          </button>
        </div>

        {/* Interactive content based on card type */}
        {currentCard.effectType === 'choose_bonus_or_roll' && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={handleChooseBonus}
              className="py-3 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95 cursor-pointer text-center"
            >
              🎁 Ambil +5 Poin
            </button>
            <button
              onClick={handleChooseRollAgain}
              className="py-3 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95 cursor-pointer text-center"
            >
              🎲 Lempar Dadu Lagi
            </button>
          </div>
        )}

        {currentCard.effectType === 'quiz_acid' && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-bold text-slate-600">Pilih organ penghasil asam lambung:</p>
            {['Lambung', 'Mulut', 'Usus Halus', 'Kerongkongan'].map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === 0;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playStep();
                    setSelectedOption(idx);
                    setAnsweredCorrectly(isCorrect);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? isCorrect
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                        : 'bg-rose-50 border-rose-500 text-rose-800 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="font-bold mr-1">{String.fromCharCode(65 + idx)}.</span> {opt}
                  {isSelected && (
                    <span className="float-right font-bold text-[11px]">
                      {isCorrect ? '✓ Benar (+10)' : '✗ Belum Tepat'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {(currentCard.effectType === 'quiz_teeth' || currentCard.effectType === 'action_gestures') && (
          <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-300 mb-4">
            <p className="text-xs font-bold text-amber-950 mb-2.5 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Konfirmasi Guru / Pendamping Kelas:</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sounds.playBonus();
                  setTeacherApproved(true);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  teacherApproved === true
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white border-2 border-emerald-400 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                ✓ Benar / Berhasil (+10)
              </button>
              <button
                onClick={() => {
                  sounds.playPenalty();
                  setTeacherApproved(false);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  teacherApproved === false
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white border-2 border-rose-400 text-rose-700 hover:bg-rose-50'
                }`}
              >
                ✗ Coba Lagi (+0)
              </button>
            </div>
          </div>
        )}

        {/* PINDAH POSISI (Kartu Mystery Ungu) */}
        {currentCard.effectType === 'swap_position' && (
          <div className="p-3.5 bg-purple-50 rounded-2xl border-2 border-purple-200 mb-4">
            <p className="text-xs font-bold text-purple-950 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-700" />
              <span>Pilih Pemain di Depanmu untuk Bertukar Posisi:</span>
            </p>
            {aheadPlayers.length > 0 ? (
              <div className="space-y-1.5">
                {aheadPlayers.map((p) => {
                  const isSelected = selectedAheadPlayerId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        sounds.playStep();
                        setSelectedAheadPlayerId(p.id);
                      }}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-700 shadow-sm font-bold'
                          : 'bg-white hover:bg-purple-100/60 border-purple-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold">{p.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'}`}>
                          Kotak #{p.position}
                        </span>
                      </div>
                      <span className="text-[11px] font-extrabold">
                        {isSelected ? '✓ Terpilih' : 'Pilih Tukar'}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 bg-white rounded-xl border border-purple-200 text-center">
                <span className="text-xs font-bold text-purple-900 block">
                  👑 Kamu Berada di Posisi Terdepan!
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Tidak ada pemain lain di depanmu untuk ditukar. Posisi tetap aman!
                </span>
              </div>
            )}
          </div>
        )}

        {currentCard.effectType === 'saver' && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 mb-4 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Kartu ini disimpan di inventarismu dan otomatis dapat dipakai untuk membatalkan hukuman pengurangan poin!</span>
          </div>
        )}

        {/* Continue confirmation button */}
        {currentCard.effectType !== 'choose_bonus_or_roll' && (
          <button
            disabled={isQuizAcidNeedAnswer || isTeacherNeedAnswer}
            onClick={handleResolve}
            className={`w-full py-3.5 rounded-xl font-heading font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-auto ${
              isQuizAcidNeedAnswer || isTeacherNeedAnswer
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white active:scale-98 shadow-purple-600/20'
            }`}
          >
            <span>
              {isQuizAcidNeedAnswer
                ? 'Pilih Jawaban Di Atas Terlebih Dahulu'
                : isTeacherNeedAnswer
                ? 'Tunggu Konfirmasi Guru Di Atas'
                : 'KONFIRMASI HASIL & LANJUTKAN'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
