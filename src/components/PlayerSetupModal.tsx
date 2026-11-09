/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, PawnColor } from '../types/game';
import { PawnAvatar, PAWN_COLORS } from './PawnAvatar';
import { sounds, CHARACTER_PROFILES } from '../utils/soundEffects';
import { Users, Award, Play, Music, Volume2 } from 'lucide-react';

interface PlayerSetupModalProps {
  onStartGame: (players: Player[]) => void;
  onOpenRules: () => void;
  onOpenOrganGuide: () => void;
}

interface PlayerDraft {
  name: string;
  pawnColor: PawnColor;
}

const DEFAULT_NAMES = [
  'Petualang 1',
  'Petualang 2',
  'Petualang 3',
  'Petualang 4',
  'Petualang 5',
  'Petualang 6',
];

export const PlayerSetupModal: React.FC<PlayerSetupModalProps> = ({
  onStartGame,
  onOpenRules,
  onOpenOrganGuide,
}) => {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [isBgmOn, setIsBgmOn] = useState<boolean>(() => sounds.isBgmOn());

  React.useEffect(() => {
    return sounds.subscribe(() => {
      setIsBgmOn(sounds.isBgmOn());
    });
  }, []);

  const [drafts, setDrafts] = useState<PlayerDraft[]>([
    { name: 'Petualang 1', pawnColor: 'red' },
    { name: 'Petualang 2', pawnColor: 'blue' },
    { name: 'Petualang 3', pawnColor: 'green' },
    { name: 'Petualang 4', pawnColor: 'yellow' },
    { name: 'Petualang 5', pawnColor: 'purple' },
    { name: 'Petualang 6', pawnColor: 'orange' },
  ]);

  const handlePlayerCountChange = (count: number) => {
    sounds.playStep();
    setPlayerCount(count);
  };

  const handleNameChange = (index: number, newName: string) => {
    setDrafts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      return updated;
    });
  };

  const handlePawnSelect = (playerIndex: number, color: PawnColor) => {
    sounds.playStep();
    setDrafts((prev) => {
      const updated = [...prev];
      // If another player already holds this color, swap it
      const existingIdx = updated.findIndex((d, idx) => idx !== playerIndex && d.pawnColor === color);
      if (existingIdx !== -1) {
        const oldColor = updated[playerIndex].pawnColor;
        updated[existingIdx] = { ...updated[existingIdx], pawnColor: oldColor };
      }
      updated[playerIndex] = { ...updated[playerIndex], pawnColor: color };
      return updated;
    });
  };

  const handleStart = () => {
    sounds.playBonus();
    const finalPlayers: Player[] = drafts.slice(0, playerCount).map((d, idx) => ({
      id: `p-${idx + 1}`,
      name: d.name.trim() || DEFAULT_NAMES[idx],
      pawnColor: d.pawnColor,
      position: 1, // Start at tile 1
      points: 30, // 30 points starting
      organCards: [],
      hasSaverCard: false,
      skipNextTurn: false,
      hasCompletedFinalMission: false,
      hasFinished: false,
    }));
    onStartGame(finalPlayers);
  };

  const activeDrafts = drafts.slice(0, playerCount);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FEF3C7]/40 flex flex-col justify-between p-3 sm:p-6 lg:p-8">
      {/* Top Banner with Brand Logo and Subtitle */}
      <div className="max-w-4xl mx-auto w-full text-center mt-1 sm:mt-6">
        <div className="flex justify-center mb-2 sm:mb-3">
          <img
            src="./assets/logo_clean.png"
            alt="DIGESTIVE ADVENTURE"
            className="h-16 xs:h-20 sm:h-36 md:h-44 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        </div>

        <h2 className="text-base sm:text-2xl font-heading font-bold text-slate-800">
          Petualangan Seru Menjelajahi Sistem Pencernaan!
        </h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Jelajahi 28 organ & tantangan pencernaan, kumpulkan poin, dan selesaikan misi akhir!
        </p>

        {/* Quick Nav Pill / Action Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
          <button
            onClick={() => {
              sounds.playCardFlip();
              onOpenRules();
            }}
            className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-white hover:bg-amber-50 text-slate-700 text-[11px] sm:text-xs font-semibold rounded-xl border border-amber-200 shadow-xs transition-colors cursor-pointer"
          >
            📖 Cara Bermain
          </button>

          <button
            onClick={() => {
              sounds.playCardFlip();
              onOpenOrganGuide();
            }}
            className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-white hover:bg-emerald-50 text-slate-700 text-[11px] sm:text-xs font-semibold rounded-xl border border-emerald-200 shadow-xs transition-colors cursor-pointer"
          >
            🔬 Kenali Organ
          </button>

          <button
            onClick={() => sounds.toggleBgm()}
            className={`inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-xl border shadow-xs transition-colors cursor-pointer ${
              isBgmOn
                ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Music className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isBgmOn ? 'text-amber-600 animate-bounce' : 'text-slate-400'}`} />
            <span>{isBgmOn ? '🎵 Musik: ON' : '🔇 Musik: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Setup Card */}
      <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 shadow-xl border-2 sm:border-3 border-amber-200 my-3 sm:my-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          <h3 className="text-base sm:text-xl font-heading font-bold text-slate-800">
            Pengaturan Jumlah & Pion Petualang
          </h3>
        </div>

        {/* Player count selector (1 to 6) */}
        <div className="mt-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            PILIH JUMLAH PEMAIN (1 - 6 PEMAIN)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handlePlayerCountChange(num)}
                className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
                  playerCount === num
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {num} PEMAIN
              </button>
            ))}
          </div>
        </div>

        {/* Players Configuration List */}
        <div className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-4">
          {activeDrafts.map((draft, idx) => (
            <div
              key={idx}
              className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 transition-colors"
            >
              {/* Player Index Badge & Avatar Preview */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-center">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 text-white font-bold text-[10px] sm:text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <PawnAvatar color={draft.pawnColor} size="md" isCurrent={false} />
                <span className="sm:hidden text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  {CHARACTER_PROFILES[draft.pawnColor]?.title || 'Petualang'}
                </span>
              </div>

              {/* Name Input */}
              <div className="flex-1 w-full">
                <div className="hidden sm:flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-500">
                    Nama Petualang {idx + 1}
                  </label>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.2 rounded-md">
                    {CHARACTER_PROFILES[draft.pawnColor]?.title || 'Petualang'}
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={18}
                  value={draft.name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  placeholder={`Petualang ${idx + 1}`}
                  className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-white border border-slate-300 rounded-lg sm:rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>

              {/* Pawn Color Selector */}
              <div className="shrink-0 w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2">
                <label className="sm:hidden text-[11px] font-medium text-slate-500">
                  Warna Pion:
                </label>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {PAWN_COLORS.map((col) => {
                    const isSelected = draft.pawnColor === col;
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => handlePawnSelect(idx, col)}
                        className={`p-0.5 sm:p-1 rounded-full border-2 transition-transform cursor-pointer ${
                          isSelected ? 'border-slate-800 scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <PawnAvatar color={col} size="xs" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary of Starting Rules */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
          <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Ketentuan Awal:</span> Setiap pemain memulai di Kotak 1 (START) dengan modal{' '}
            <strong className="font-extrabold text-amber-950">30 Poin</strong>. Kumpulkan kartu organ, raih bintang pada tantangan QR (+10 poin), hindari jebakan, dan selesaikan Final Mission sebelum mencapai FINISH!
          </div>
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStart}
          className="mt-6 w-full py-4 rounded-2xl bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-heading font-bold text-base sm:text-lg tracking-wide shadow-lg shadow-orange-500/30 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          MULAI PETUALANGAN
        </button>
      </div>

      {/* Footer Info */}
      <footer className="text-center text-xs text-slate-400 pb-2">
        DIGESTIVE ADVENTURE &copy; Media Pembelajaran Interaktif IPA Sistem Pencernaan SD/MI
      </footer>
    </div>
  );
};
