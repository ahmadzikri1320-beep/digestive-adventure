/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { BoardTile, Player, FloatingPointItem, PawnColor } from '../types/game';
import { PawnAvatar } from './PawnAvatar';
import { FloatingPointsOverlay } from './FloatingPointsOverlay';
import { DiceRoller } from './DiceRoller';
import { sounds } from '../utils/soundEffects';
import { Maximize, Minimize, ChevronLeft, ChevronRight, Sparkles, Sliders, RotateCcw, Volume2 } from 'lucide-react';

interface BoardProps {
  tiles: BoardTile[];
  players: Player[];
  activePlayerIndex: number;
  isMoving: boolean;
  onTileClick: (tile: BoardTile) => void;
  selectedTileId: number | null;
  floatingPoints?: FloatingPointItem[];
  onRollDice?: (val: number) => void;
  lastRoll?: number | null;
  onStepAdjust?: (delta: number) => void;
  onOpenFinalMission?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isDiceDisabled?: boolean;
  hasRolledThisTurn?: boolean;
  children?: React.ReactNode;
}

// 10 Horizontal x 6 Vertical perimeter track mapping (10 + 4 + 10 + 4 = 28 tiles)
interface GridPos {
  row: number; // 0 to 5
  col: number; // 0 to 9
}

const TILE_GRID_POSITIONS: Record<number, GridPos> = {
  // Top row: 10 boxes (Row 0, Col 0..9)
  1: { row: 0, col: 0 },
  2: { row: 0, col: 1 },
  3: { row: 0, col: 2 },
  4: { row: 0, col: 3 },
  5: { row: 0, col: 4 },
  6: { row: 0, col: 5 },
  7: { row: 0, col: 6 },
  8: { row: 0, col: 7 },
  9: { row: 0, col: 8 },
  10: { row: 0, col: 9 },

  // Right column: 4 boxes (Col 9, Row 1..4)
  11: { row: 1, col: 9 },
  12: { row: 2, col: 9 },
  13: { row: 3, col: 9 },
  14: { row: 4, col: 9 },

  // Bottom row: 10 boxes (Row 5, Col 9..0)
  15: { row: 5, col: 9 },
  16: { row: 5, col: 8 },
  17: { row: 5, col: 7 },
  18: { row: 5, col: 6 },
  19: { row: 5, col: 5 },
  20: { row: 5, col: 4 },
  21: { row: 5, col: 3 },
  22: { row: 5, col: 2 },
  23: { row: 5, col: 1 },
  24: { row: 5, col: 0 },

  // Left column: 4 boxes (Col 0, Row 4..1)
  25: { row: 4, col: 0 },
  26: { row: 3, col: 0 },
  27: { row: 2, col: 0 },
  28: { row: 1, col: 0 },
};

export const Board: React.FC<BoardProps> = ({
  tiles,
  players,
  activePlayerIndex,
  isMoving,
  onTileClick,
  selectedTileId,
  floatingPoints = [],
  onRollDice,
  lastRoll = null,
  onStepAdjust,
  onOpenFinalMission,
  isFullscreen = false,
  onToggleFullscreen,
  isDiceDisabled,
  hasRolledThisTurn = false,
  children,
}) => {
  const activePlayer = players[activePlayerIndex];
  const boardRef = useRef<HTMLDivElement>(null);
  const isBoardFullscreen = Boolean(isFullscreen);

  // Helper to get players on a specific tile
  const getPlayersOnTile = (tileId: number) => {
    return players.filter((p) => p.position === tileId);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Board Outer Container (Strict 10 columns x 6 rows layout with adaptive scaling) */}
      <div
        ref={boardRef}
        id="game-board-container"
        className={`relative ${
          isBoardFullscreen
            ? 'fixed inset-0 z-50 w-full h-full min-h-screen max-w-none rounded-none p-1.5 sm:p-3 md:p-5 bg-[#FAF7F0] flex flex-col items-center justify-center overflow-auto'
            : 'w-full max-w-[1080px] bg-[#FAF7F0] rounded-2xl sm:rounded-3xl p-1.5 sm:p-3 md:p-4 shadow-xl border-3 sm:border-4 border-amber-300'
        } select-none transition-all duration-300`}
      >
        {/* Subtle decorative dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#E2D9C8_1.2px,transparent_1.2px)] [background-size:18px_18px] opacity-40 pointer-events-none rounded-2xl sm:rounded-3xl" />

        {/* 10x6 Rigid Grid with LayoutGroup for silky-smooth pawn transitions */}
        <LayoutGroup id="board-pawns-layout">
          <div className={`relative ${isBoardFullscreen ? 'w-full max-w-[1300px] max-h-[96vh] aspect-[10/6]' : 'w-full'} grid grid-cols-10 grid-rows-6 gap-0.5 sm:gap-1.5 md:gap-2`}>
          {/* Render 28 Perimeter Tiles */}
          {tiles.map((tile) => {
            const pos = TILE_GRID_POSITIONS[tile.id];
            if (!pos) return null;

            const playersHere = getPlayersOnTile(tile.id);
            const isTargetActive = activePlayer?.position === tile.id;
            const isSelected = selectedTileId === tile.id;
            const tileFloatingPoints = floatingPoints.filter((fp) => fp.tileId === tile.id);

            return (
              <div
                key={tile.id}
                onClick={() => {
                  sounds.playStep();
                  onTileClick(tile);
                }}
                style={{
                  gridRowStart: pos.row + 1,
                  gridColumnStart: pos.col + 1,
                }}
                className={`relative aspect-square w-full rounded-lg sm:rounded-xl md:rounded-2xl cursor-pointer transition-all duration-150 bg-white/90 ${
                  isTargetActive
                    ? 'ring-2 sm:ring-4 ring-amber-400 ring-offset-0.5 sm:ring-offset-2 z-20 shadow-md'
                    : isSelected
                    ? 'ring-2 sm:ring-3 ring-sky-400 ring-offset-0.5 z-10 shadow-sm'
                    : 'hover:ring-2 hover:ring-amber-300 hover:ring-offset-0.5 shadow-2xs'
                }`}
              >
                {/* Tile Graphic from PDF */}
                <img
                  src={tile.image}
                  alt={tile.name}
                  className="w-full h-full object-contain pointer-events-none select-none rounded-lg sm:rounded-xl md:rounded-2xl"
                  draggable={false}
                  referrerPolicy="no-referrer"
                />

                {/* Floating Points Visual (+10, -5, etc) directly above tile & avatar */}
                <FloatingPointsOverlay items={tileFloatingPoints} />

                {/* Active Highlight Beacon */}
                {isTargetActive && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-400 rounded-full border-2 border-white shadow-xs animate-ping" />
                )}

                {/* Pawns on this tile with reliable hop animations */}
                {playersHere.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center p-0.5 pointer-events-none z-30">
                    <div
                      className={`grid items-center justify-center gap-0.5 max-w-full ${
                        playersHere.length === 1
                          ? 'grid-cols-1'
                          : playersHere.length === 2
                          ? 'grid-cols-2'
                          : playersHere.length <= 4
                          ? 'grid-cols-2'
                          : 'grid-cols-3'
                      }`}
                    >
                      {playersHere.map((p) => {
                        const isThisPawnActive = p.id === activePlayer?.id;
                        const isThisPawnMoving = isMoving && isThisPawnActive;
                        const pawnSize =
                          playersHere.length >= 5
                            ? 'xs'
                            : playersHere.length >= 3
                            ? 'xs'
                            : playersHere.length === 2
                            ? 'sm'
                            : 'md';
                        const playerIdx = players.findIndex((x) => x.id === p.id);
                        const playerNum = playerIdx >= 0 ? playerIdx + 1 : undefined;

                        return (
                          <motion.div
                            key={p.id}
                            layoutId={`pawn-token-${p.id}`}
                            layout
                            transition={{
                              layout: {
                                type: 'spring',
                                stiffness: 340,
                                damping: 25,
                                mass: 0.8,
                              },
                            }}
                            className={`relative flex flex-col items-center justify-center pointer-events-none ${
                              isThisPawnActive ? 'z-40 scale-105' : 'z-20'
                            }`}
                          >
                            {/* Active Turn Pointer Arrow */}
                            {isThisPawnActive && (
                              <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                                className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none"
                              >
                                <span className="text-[9px] font-heading font-black text-amber-900 bg-amber-300 px-1.5 py-0.2 rounded-full border border-amber-500 shadow-2xs whitespace-nowrap">
                                  {isThisPawnMoving ? 'LOMPAT!' : 'GILIRAN'}
                                </span>
                                <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-amber-500 -mt-0.5" />
                              </motion.div>
                            )}

                            {/* Animated Hop Container */}
                            <motion.div
                              animate={
                                isThisPawnMoving
                                  ? {
                                      y: [-2, -22, 0],
                                      scale: [1, 1.22, 1],
                                      rotate: [0, -7, 5, 0],
                                    }
                                  : {
                                      y: 0,
                                      scale: isThisPawnActive ? 1.06 : 1,
                                      rotate: 0,
                                    }
                              }
                              transition={
                                isThisPawnMoving
                                  ? {
                                      duration: 0.3,
                                      ease: [0.34, 1.45, 0.64, 1],
                                    }
                                  : { duration: 0.2 }
                              }
                            >
                              <PawnAvatar
                                color={p.pawnColor}
                                size={pawnSize}
                                isCurrent={isThisPawnActive}
                                playerNumber={playerNum}
                                showLabel={false}
                              />
                            </motion.div>

                            {/* Dynamic Ground Contact Shadow */}
                            <motion.div
                              animate={
                                isThisPawnMoving
                                  ? {
                                      scaleX: [1, 0.3, 1.15, 1],
                                      scaleY: [1, 0.3, 1.15, 1],
                                      opacity: [0.55, 0.15, 0.6, 0.45],
                                    }
                                  : {
                                      scaleX: 1,
                                      scaleY: 1,
                                      opacity: isThisPawnActive ? 0.45 : 0.35,
                                    }
                              }
                              transition={
                                isThisPawnMoving
                                  ? {
                                      duration: 0.3,
                                      ease: [0.34, 1.45, 0.64, 1],
                                    }
                                  : { duration: 0.2 }
                              }
                              className="w-4 h-1.5 sm:w-5 sm:h-2 bg-slate-900/50 rounded-full blur-[1px] -mt-1"
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Central Area: Big Centered Title & Corner Dice (Cols 2..9, Rows 2..5) */}
          <div
            style={{
              gridRow: '2 / 6',
              gridColumn: '2 / 10',
            }}
            className="relative min-h-0 min-w-0 p-1.5 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl md:rounded-3xl bg-linear-to-b from-white/95 via-[#FFFDF8]/95 to-amber-50/95 backdrop-blur-xs border sm:border-2 border-amber-300/90 shadow-inner z-10 overflow-hidden flex items-center justify-center select-none"
          >
            {/* Ambient warm glow in center */}
            <div className="absolute w-44 sm:w-80 md:w-96 h-44 sm:h-80 md:h-96 bg-amber-300/25 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* ========================================================
                1. CENTER: GRAND TITLE & LOGO ("judul DIGESTIVE ADVENTURE dibuat besar lagi dan tulisan di bawahnya dikosongkan")
                ======================================================== */}
            <div className="flex flex-col items-center justify-center text-center px-1 sm:px-2 py-1 select-none pointer-events-none z-10 max-w-[65%] sm:max-w-[70%] md:max-w-[75%]">
              <img
                src="./assets/logo_clean.png"
                alt="Digestive Adventure"
                className="max-h-16 xs:max-h-24 sm:max-h-36 md:max-h-48 lg:max-h-56 xl:max-h-64 w-auto object-contain drop-shadow-lg transition-all duration-300"
                draggable={false}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* ========================================================
                2. POJOK KANAN BAWAH (BOTTOM-RIGHT CORNER): 3D DICE ("dadunya di pojok")
                ======================================================== */}
            <div className="absolute bottom-0.5 right-0.5 sm:bottom-2 sm:right-2 z-20 flex flex-col items-end pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-md p-0.5 sm:p-1 md:p-1.5 rounded-lg sm:rounded-2xl border sm:border-2 border-amber-300 shadow-md sm:shadow-lg w-[78px] xs:w-[84px] sm:w-[120px] md:w-[134px] flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-0.5 px-0.5">
                  <span className="text-[7px] sm:text-[9.5px] font-heading font-extrabold text-amber-900 flex items-center gap-0.5">
                    🎲 Dadu
                  </span>
                  {lastRoll && (
                    <span className="text-[6.5px] sm:text-[8.5px] font-bold text-emerald-700 bg-emerald-50 px-0.5 sm:px-1 rounded border border-emerald-200">
                      {lastRoll} Langkah
                    </span>
                  )}
                </div>

                {onRollDice && activePlayer ? (
                  <DiceRoller
                    onRoll={onRollDice}
                    disabled={isDiceDisabled !== undefined ? isDiceDisabled : (isMoving || activePlayer.hasFinished || Boolean(hasRolledThisTurn))}
                    lastRoll={lastRoll}
                    variant="embedded"
                  />
                ) : (
                  <div className="text-center p-0.5 text-[8px] text-slate-400">Siap Main</div>
                )}
              </div>
            </div>

            {/* ========================================================
                3. POJOK KIRI ATAS (TOP-LEFT CORNER): ACTIVE PLAYER TURN BADGE
                ======================================================== */}
            {activePlayer && (
              <div className="absolute top-0.5 left-0.5 sm:top-2 sm:left-2 z-20 flex items-center gap-0.5 sm:gap-1.5 bg-white/95 backdrop-blur-md px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-amber-300 shadow-2xs max-w-[86px] sm:max-w-[170px] pointer-events-auto">
                <PawnAvatar color={activePlayer.pawnColor} size="xs" isCurrent={true} />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[7.5px] sm:text-[11px] font-heading font-extrabold text-slate-800 truncate">
                      {activePlayer.name}
                    </span>
                    {activePlayer.hasSaverCard && <span className="text-[8px]" title="Kartu Penyelamat">🛡️</span>}
                    {activePlayer.hasCompletedFinalMission && <span className="text-[8px]" title="Lolos Final Mission">⭐</span>}
                  </div>
                  <div className="text-[6.5px] sm:text-[9px] font-bold text-amber-900 flex items-center gap-0.5">
                    <span>#{activePlayer.position}</span>
                    <span>&bull;</span>
                    <span className="text-amber-700">{activePlayer.points}P</span>
                    <span>&bull;</span>
                    <span className="text-emerald-700">{activePlayer.organCards.length}🫀</span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                4. POJOK KANAN ATAS (TOP-RIGHT CORNER): FULLSCREEN & CORRECTION
                ======================================================== */}
            <div className="absolute top-0.5 right-0.5 sm:top-2 sm:right-2 z-30 flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
              {onStepAdjust && activePlayer && !isMoving && !activePlayer.hasFinished && (
                <div className="flex items-center gap-0.5 bg-white/95 p-0.5 sm:p-1 rounded-md sm:rounded-lg border border-amber-300 shadow-2xs">
                  <button
                    onClick={() => {
                      sounds.playStep();
                      onStepAdjust(-1);
                    }}
                    disabled={activePlayer.position <= 1}
                    title="Koreksi mundur 1 kotak jika salah langkah fisik"
                    className="px-1.5 sm:px-2 py-0.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 rounded text-[7.5px] sm:text-[9px] font-bold cursor-pointer"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => {
                      sounds.playStep();
                      onStepAdjust(1);
                    }}
                    disabled={activePlayer.position >= 28}
                    title="Koreksi maju 1 kotak"
                    className="px-1.5 sm:px-2 py-0.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-30 text-white rounded text-[7.5px] sm:text-[9px] font-bold cursor-pointer"
                  >
                    +1
                  </button>
                </div>
              )}

              {/* Dedicated Board Fullscreen / Perkecil Toggle Button */}
              {onToggleFullscreen && (
                <button
                  onClick={() => {
                    sounds.playCardFlip();
                    onToggleFullscreen();
                  }}
                  title={isBoardFullscreen ? 'Keluar Layar Penuh (Perkecil) - Esc' : 'Layar Penuh Papan Permainan'}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1 sm:gap-1.5 font-heading active:scale-95 ${
                    isBoardFullscreen
                      ? 'bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[8px] sm:text-[10px] border-2 border-rose-700 shadow-md ring-2 ring-rose-300'
                      : 'bg-white/95 hover:bg-amber-100 text-slate-800 hover:text-amber-950 font-bold text-[8px] sm:text-[9.5px] border border-amber-300'
                  }`}
                >
                  {isBoardFullscreen ? (
                    <>
                      <Minimize className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>Perkecil</span>
                    </>
                  ) : (
                    <>
                      <Maximize className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                      <span className="hidden sm:inline">Layar Penuh</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* ========================================================
                5. POJOK KIRI BAWAH (BOTTOM-LEFT CORNER): GUIDANCE & ALERTS
                ======================================================== */}
            <div className="absolute bottom-0.5 left-0.5 sm:bottom-2 sm:left-2 z-20 flex flex-col gap-1 pointer-events-auto max-w-[120px] xs:max-w-[150px] sm:max-w-[220px]">
              {/* Guidance & Alerts for Active Player */}
              {activePlayer && (
                <div className="flex flex-col gap-0.5">
                  {isMoving ? (
                    <div className="bg-amber-100/95 border border-amber-300 px-1 sm:px-2 py-0.2 sm:py-1 rounded-md sm:rounded-lg text-amber-900 text-[6.5px] xs:text-[7.5px] sm:text-[10px] font-bold shadow-2xs animate-pulse truncate">
                      🏃 Melompat #{activePlayer.position}
                    </div>
                  ) : activePlayer.skipNextTurn ? (
                    <div className="bg-rose-50 border border-rose-300 px-1 sm:px-2 py-0.2 sm:py-1 rounded-md sm:rounded-lg text-rose-900 text-[6.5px] xs:text-[7.5px] sm:text-[10px] font-bold shadow-2xs flex items-center justify-between gap-0.5">
                      <span className="truncate">🤢 Sakit</span>
                      {onRollDice && (
                        <button
                          onClick={() => onRollDice(0)}
                          className="px-1 py-0.2 bg-rose-600 text-white rounded text-[7px] font-bold cursor-pointer shrink-0 animate-bounce"
                        >
                          Lewati
                        </button>
                      )}
                    </div>
                  ) : activePlayer.position === 27 && !activePlayer.hasCompletedFinalMission ? (
                    <div className="bg-emerald-50 border border-emerald-300 px-1 sm:px-2 py-0.2 sm:py-1 rounded-md sm:rounded-lg text-emerald-900 text-[6.5px] xs:text-[7.5px] sm:text-[10px] font-bold shadow-2xs flex items-center justify-between gap-0.5 animate-pulse">
                      <span className="truncate">🏆 Final</span>
                      {onOpenFinalMission && (
                        <button
                          onClick={onOpenFinalMission}
                          className="px-1 py-0.2 bg-emerald-600 text-white rounded text-[7px] font-bold cursor-pointer shrink-0 animate-bounce"
                        >
                          Misi 🎯
                        </button>
                      )}
                    </div>
                  ) : activePlayer.position >= 24 && !activePlayer.hasCompletedFinalMission ? (
                    <div className="bg-amber-100/95 border border-amber-300 px-1 sm:px-2 py-0.2 sm:py-1 rounded-md sm:rounded-lg text-amber-950 text-[6.5px] xs:text-[7.5px] sm:text-[10px] font-bold shadow-2xs leading-tight">
                      🎯 Sisa <span className="text-rose-600 font-extrabold">{27 - activePlayer.position}</span> kotak
                    </div>
                  ) : (
                    <div className="hidden sm:block text-[8px] sm:text-[9px] text-slate-500 bg-white/80 px-1.5 py-0.5 rounded-md border border-slate-200/60 truncate">
                      💡 Ketuk kotak untuk info organ
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </LayoutGroup>

        {/* Modal Portals / Overlays attached inside board for fullscreen visibility */}
        {children}
      </div>
    </div>
  );
};
