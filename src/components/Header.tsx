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
  onOpenMusicSelector?: () => void;
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
  onOpenMusicSelector,
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
        <nav className="hidden md:flex items-center gap-3 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              sounds.playCardFlip();
              onOpenRules();
            }}
            className="btn-nav group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/90 text-slate-700 hover:text-amber-800 border border-amber-200/80 hover:border-amber-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4 text-amber-500 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-6" />
            <span>Cara Bermain</span>
          </button>

          <button
            onClick={() => {
              sounds.playCardFlip();
              onOpenOrganGuide();
            }}
            className="btn-nav group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/90 text-slate-700 hover:text-emerald-800 border border-emerald-200/80 hover:border-emerald-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-emerald-500 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-12" />
            <span>Mengenal Organ</span>
          </button>

          {currentTurnPlayerName && (
            <div className="card-hover-subtle card-hover-emerald flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
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
            className={`btn-nav group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer border ${
              isBgmOn
                ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-2xs hover:bg-amber-200/80'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Music className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-115 ${isBgmOn ? 'text-amber-600 animate-bounce' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Lagu Anak</span>
            <span className={`text-[10px] px-1 rounded-sm ${isBgmOn ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {isBgmOn ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Music Selector Button */}
          {onOpenMusicSelector && (
            <button
              onClick={() => {
                sounds.playCardFlip();
                onOpenMusicSelector();
              }}
              title="Pilih atau Tambah Musik Latar Belakang (Tema Ceria / Lagu Sendiri)"
              className="btn-nav group p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span className="text-xs transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 inline-block">🎼</span>
              <span className="hidden md:inline">Pilih Lagu</span>
            </button>
          )}

          {/* Sound Effects Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Nyalakan Efek Suara' : 'Matikan Efek Suara'}
            className="btn-nav group p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer border border-slate-200"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500 transition-transform duration-200 group-hover:scale-115" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600 transition-transform duration-200 group-hover:scale-115" />
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
              className={`btn-nav group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer border ${
                isFullscreen
                  ? 'bg-rose-600 border-rose-700 text-white shadow-xs hover:bg-rose-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:scale-90" />
                  <span className="hidden sm:inline font-extrabold">Perkecil</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5 text-slate-600 transition-transform duration-200 group-hover:scale-115" />
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
            className="btn-nav group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl cursor-pointer border border-rose-200 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600 transition-transform duration-300 group-hover:-rotate-90" />
            <span className="hidden sm:inline">Ulang</span>
          </button>

          <button
            onClick={() => {
              sounds.playCardFlip();
              onOpenRules();
            }}
            className="btn-nav group md:hidden p-2 rounded-xl text-slate-600 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 cursor-pointer"
            title="Petunjuk"
          >
            <BookOpen className="w-4 h-4 text-amber-600 transition-transform duration-200 group-hover:scale-110" />
          </button>
        </div>
      </div>
    </header>
  );
};
