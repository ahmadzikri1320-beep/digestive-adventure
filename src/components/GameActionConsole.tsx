/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BoardTile, Player, FloatingPointItem } from '../types/game';
import { PawnAvatar } from './PawnAvatar';
import { DiceRoller } from './DiceRoller';
import { FloatingPointsOverlay } from './FloatingPointsOverlay';
import { Sparkles, ShieldCheck, Info, ChevronLeft, ChevronRight, Sliders, Volume2 } from 'lucide-react';
import { sounds, CHARACTER_PROFILES } from '../utils/soundEffects';

interface GameActionConsoleProps {
  activePlayer: Player;
  currentTile: BoardTile;
  isMoving: boolean;
  onRollDice: (val: number) => void;
  lastRoll: number | null;
  selectedTile: BoardTile | null;
  onStepAdjust?: (delta: number) => void;
  onOpenFinalMission?: () => void;
  floatingPoints?: FloatingPointItem[];
}

export const GameActionConsole: React.FC<GameActionConsoleProps> = ({
  activePlayer,
  currentTile,
  isMoving,
  onRollDice,
  lastRoll,
  selectedTile,
  onStepAdjust,
  onOpenFinalMission,
  floatingPoints = [],
}) => {
  const activePlayerFloating = floatingPoints.filter((fp) => fp.playerId === activePlayer.id);
  const isInspectingDifferentTile = selectedTile && selectedTile.id !== currentTile.id;
  const tileToDisplay = isInspectingDifferentTile ? selectedTile : currentTile;

  return (
    <div className="w-full max-w-[1080px] bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-2 sm:border-3 border-amber-300 shadow-md mt-2 sm:mt-3">
      {/* Header: Status Petualang & Edukasi Kotak */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <FloatingPointsOverlay items={activePlayerFloating} />
            <PawnAvatar color={activePlayer.pawnColor} size="sm" isCurrent={true} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full border border-amber-300">
                PETUALANG AKTIF
              </span>
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.2 rounded-full border border-slate-200">
                {CHARACTER_PROFILES[activePlayer.pawnColor]?.title || 'Petualang'}
              </span>
              {activePlayer.hasCompletedFinalMission && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full flex items-center gap-1 border border-emerald-300">
                  <Sparkles className="w-3 h-3" /> Final Lulus
                </span>
              )}
              {activePlayer.hasSaverCard && (
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.2 rounded-full flex items-center gap-1 border border-purple-300">
                  <ShieldCheck className="w-3 h-3" /> Penyelamat
                </span>
              )}
              {activePlayer.skipNextTurn && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.2 rounded-full flex items-center gap-1 border border-rose-300 animate-pulse">
                  🤢 Sakit Perut
                </span>
              )}
            </div>
            <div className="mt-0.5">
              <h3 className="text-sm sm:text-base font-heading font-extrabold text-slate-800 truncate">
                {activePlayer.name} &bull; <span className="text-amber-600 font-bold">{activePlayer.points} Poin</span> &bull; Posisi Kotak #{activePlayer.position}
              </h3>
            </div>
          </div>
        </div>

        {/* Info banner telling player dice is inside the board */}
        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 shrink-0">
          <span className="text-base">🎲</span>
          <span>Dadu berada di pojok papan permainan</span>
        </div>
      </div>

      {/* Main Educational Tile Card */}
      <div className="mt-2.5 p-3 bg-slate-50/90 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <img
          src={tileToDisplay.image}
          alt={tileToDisplay.name}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-contain border border-slate-300 bg-white p-1 shrink-0 shadow-xs"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                isInspectingDifferentTile
                  ? 'bg-sky-200 text-sky-900'
                  : 'bg-amber-200 text-amber-900'
              }`}
            >
              {isInspectingDifferentTile ? `🔍 Meninjau Kotak #${tileToDisplay.id}` : `📍 Posisi Kotak #${tileToDisplay.id}`}
            </span>
            <h4 className="text-xs sm:text-sm font-heading font-bold text-slate-800 truncate">
              {tileToDisplay.name} {tileToDisplay.subtitle ? `— ${tileToDisplay.subtitle}` : ''}
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {tileToDisplay.description}
          </p>
        </div>
      </div>
    </div>
  );
};
