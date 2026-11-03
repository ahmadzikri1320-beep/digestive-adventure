/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Music, BookOpen, Sparkles, RotateCcw, Maximize, Minimize } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  onOpenRules: () => void;
  onOpenOrganGuide: () => void;
  onResetGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isBgmOn: boolean;
  onToggleBgm: () => void;
  currentTurnPlayerName?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRules,
  onOpenOrganGuide,
  onResetGame,
  isMuted,
  onToggleMute,
  isBgmOn,
  onToggleBgm,
  currentTurnPlayerName,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <img
            src="./assets/logo_clean.png"
            alt="Digestive Adventure"
            className="h-8 sm:h-10 w-auto object-contain drop-shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Edisi Edukasi SD/MI
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              sounds.playCardFlip();
              onOpenRules();
            }}
            className="flex items-center gap-1.5 hover:text-amber-600 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Cara Bermain</span>
          </button>

          <button
            onClick={() => {
              sounds.playCardFlip();
              onOpenOrganGuide();
            }}
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Mengenal Organ</span>
          </button>



          {currentTurnPlayerName && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Giliran: {currentTurnPlayerName}</span>
            </div>
          )}
        </nav>

        {/* Zone 3: Primary Actions (Kids BGM, SFX, Reset, Help) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Kids Background Music Toggle */}
          <button
            onClick={onToggleBgm}
            title={isBgmOn ? 'Matikan Musik Latar Ceria' : 'Putar Musik Ceria Anak-Anak'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isBgmOn
                ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${isBgmOn ? 'text-amber-600 animate-bounce' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Lagu Anak</span>
            <span className={`text-[10px] px-1 rounded-sm ${isBgmOn ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {isBgmOn ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Sound Effects Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Nyalakan Efek Suara' : 'Matikan Efek Suara'}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>

          {/* Fullscreen Toggle Button */}
          {onToggleFullscreen && (
            <button
              onClick={() => {
                sounds.playCardFlip();
                onToggleFullscreen();
              }}
              title={isFullscreen ? 'Keluar Layar Penuh (Esc)' : 'Masuk Mode Layar Penuh'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isFullscreen
                  ? 'bg-rose-600 border-rose-700 text-white shadow-xs hover:bg-rose-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline font-extrabold">Perkecil</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline font-bold">Layar Penuh</span>
                </>
              )}
            </button>
          )}

          {/* Reset Game Button */}
          <button
            onClick={() => {
              sounds.playCardFlip();
              onResetGame();
            }}
            title="Mulai Ulang Permainan"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer border border-rose-200 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Ulang</span>
          </button>

          <button
            onClick={onOpenRules}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
            title="Petunjuk"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
