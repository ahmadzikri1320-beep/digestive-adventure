/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BoardTile, Player } from '../types/game';
import { sounds } from '../utils/soundEffects';
import { X, Sparkles, ChevronLeft, ChevronRight, BookOpen, ShieldCheck } from 'lucide-react';

interface MobileTileInfoSheetProps {
  tile: BoardTile;
  activePlayer: Player;
  onClose: () => void;
  onStepAdjust?: (delta: number) => void;
  onOpenFinalMission?: () => void;
}

export const MobileTileInfoSheet: React.FC<MobileTileInfoSheetProps> = ({
  tile,
  activePlayer,
  onClose,
  onStepAdjust,
  onOpenFinalMission,
}) => {
  const isPlayerOnThisTile = activePlayer.position === tile.id;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-up Bottom Sheet */}
      <div className="w-full bg-white rounded-t-3xl border-t-2 border-amber-300 shadow-2xl p-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 pb-safe">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              Kotak #{tile.id}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {tile.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Organ / Tile Content */}
        <div className="flex items-start gap-3.5 my-3">
          <img
            src={tile.image}
            alt={tile.name}
            className="w-20 h-20 rounded-2xl object-contain border-2 border-amber-200 bg-amber-50/50 p-1 shrink-0 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-heading font-black text-slate-800 leading-tight">
              {tile.name}
            </h3>
            {tile.subtitle && (
              <p className="text-xs font-semibold text-amber-700 mt-0.5">
                {tile.subtitle}
              </p>
            )}
            {isPlayerOnThisTile ? (
              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                📍 {activePlayer.name} Sedang di Sini
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                🔍 Meninjau Kotak
              </span>
            )}
          </div>
        </div>

        {/* Educational Description */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
          {tile.description}
        </div>

        {/* Contextual Actions (Final Mission or Step Correction) */}
        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Step Adjustment Buttons */}
          {onStepAdjust && isPlayerOnThisTile && (
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-slate-500 mr-1">Koreksi:</span>
              <button
                onClick={() => {
                  sounds.playStep();
                  onStepAdjust(-1);
                }}
                disabled={activePlayer.position <= 1}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-30 cursor-pointer"
              >
                -1
              </button>
              <button
                onClick={() => {
                  sounds.playStep();
                  onStepAdjust(1);
                }}
                disabled={activePlayer.position >= 28}
                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl disabled:opacity-30 cursor-pointer"
              >
                +1
              </button>
            </div>
          )}

          {/* Final Mission Button */}
          {tile.id === 27 && onOpenFinalMission && (
            <button
              onClick={() => {
                onClose();
                onOpenFinalMission();
              }}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Buka Final Mission (Kotak 27)
            </button>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="ml-auto py-1.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-heading font-bold text-xs rounded-xl cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
