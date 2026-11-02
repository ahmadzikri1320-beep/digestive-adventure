/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { sounds } from '../utils/soundEffects';
import { Sparkles, Dices, X } from 'lucide-react';

interface DiceRollerProps {
  onRoll: (value: number) => void;
  disabled: boolean;
  lastRoll: number | null;
  variant?: 'card' | 'embedded';
}

// 3D rotation angles for 6 faces of the cube
const FACE_ROTATIONS: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 0, y: 180 },
};

export const DiceRoller: React.FC<DiceRollerProps> = ({
  onRoll,
  disabled,
  lastRoll,
  variant = 'card',
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [displayValue, setDisplayValue] = useState<number>(lastRoll || 1);
  const [mode, setMode] = useState<'digital' | 'physical'>('digital');
  const [showManualModal, setShowManualModal] = useState(false);
  const [spinCount, setSpinCount] = useState(0);

  // Sync initial or updated lastRoll
  useEffect(() => {
    if (lastRoll && lastRoll >= 1 && lastRoll <= 6) {
      setDisplayValue(lastRoll);
    }
  }, [lastRoll]);

  const handleDigitalRoll = () => {
    if (disabled || isRolling) return;

    setIsRolling(true);
    sounds.playDiceRoll();

    // Determine target roll (1 to 6)
    const targetValue = Math.floor(Math.random() * 6) + 1;
    setSpinCount((prev) => prev + 2); // Accumulate spins for smooth directional spin

    setTimeout(() => {
      setDisplayValue(targetValue);
      setIsRolling(false);
      sounds.playStep();
      onRoll(targetValue);
    }, 750);
  };

  const handleManualInput = (val: number) => {
    if (disabled || isRolling) return;
    setShowManualModal(false);
    setIsRolling(true);
    sounds.playDiceRoll();
    setSpinCount((prev) => prev + 1);

    setTimeout(() => {
      setDisplayValue(val);
      setIsRolling(false);
      sounds.playStep();
      onRoll(val);
    }, 450);
  };

  // Base rotation plus accumulated full 360-degree turns
  const targetAngles = FACE_ROTATIONS[displayValue] || FACE_ROTATIONS[1];
  const cubeTransformStyle: React.CSSProperties = isRolling
    ? {}
    : {
        transform: `rotateX(${targetAngles.x + spinCount * 360}deg) rotateY(${targetAngles.y + spinCount * 360}deg)`,
      };

  // Pip dot rendering for each face of the 3D cube
  const renderPip = (dotClass: string, isAccent = false) => (
    <span
      className={`absolute rounded-full shadow-inner ${
        isAccent
          ? 'w-4 h-4 bg-linear-to-tr from-rose-600 to-rose-400 border border-rose-300'
          : 'w-3.5 h-3.5 bg-linear-to-tr from-amber-900 to-amber-700 border border-amber-600/40'
      } ${dotClass}`}
    />
  );

  // Mini dot renderer for the fullscreen physical modal dice representations
  const renderDiceFaceDots = (face: number) => {
    switch (face) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-1">
            <span className="w-2 h-2 bg-amber-900 rounded-full self-start" />
            <span className="w-2 h-2 bg-amber-900 rounded-full self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-1">
            <span className="w-2 h-2 bg-amber-900 rounded-full self-start" />
            <span className="w-2 h-2 bg-amber-900 rounded-full self-center" />
            <span className="w-2 h-2 bg-amber-900 rounded-full self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 gap-1 p-1 items-center justify-items-center">
            <span className="w-2 h-2 bg-amber-900 rounded-full" />
            <span className="w-2 h-2 bg-amber-900 rounded-full" />
            <span className="w-2 h-2 bg-amber-900 rounded-full" />
            <span className="w-2 h-2 bg-amber-900 rounded-full" />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full relative p-1">
            <span className="absolute top-1 left-1 w-2 h-2 bg-amber-900 rounded-full" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-900 rounded-full" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-900 rounded-full" />
            <span className="absolute bottom-1 left-1 w-2 h-2 bg-amber-900 rounded-full" />
            <span className="absolute bottom-1 right-1 w-2 h-2 bg-amber-900 rounded-full" />
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full grid grid-cols-2 gap-x-1 gap-y-0.5 p-1 items-center justify-items-center">
            <span className="w-2 h-2 bg-amber-900 rounded-full" />
            <span className="w-2 h-2 bg-amber-900 rounded-full" />
            <span className="w-2 h-2 bg-amber-900 rounded-full" />
            <span className="w-2 h-2 bg-amber-900 rounded-full" />
            <span className="w-2 h-2 bg-amber-900 rounded-full" />
            <span className="w-2 h-2 bg-amber-900 rounded-full" />
          </div>
        );
      default:
        return null;
    }
  };

  const isEmbedded = variant === 'embedded';

  return (
    <div
      className={
        isEmbedded
          ? 'flex flex-col items-center w-full p-0.5'
          : 'flex flex-col items-center bg-white/95 backdrop-blur-xs p-3 rounded-2xl border-2 border-amber-200/90 shadow-md w-full'
      }
    >
      {/* Mode Switcher Tabs (Dadu 3D vs Dadu Fisik) */}
      <div
        className={`flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-lg mb-0.5 w-full ${
          isEmbedded ? 'max-w-[120px] sm:max-w-[140px]' : 'max-w-[200px]'
        }`}
      >
        <button
          onClick={() => setMode('digital')}
          className={`flex-1 py-0.2 sm:py-0.5 text-[7px] xs:text-[8px] sm:text-[9.5px] font-bold rounded-md transition-all cursor-pointer text-center ${
            mode === 'digital'
              ? 'bg-white text-amber-900 shadow-2xs font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Dadu 3D
        </button>
        <button
          onClick={() => setMode('physical')}
          className={`flex-1 py-0.2 sm:py-0.5 text-[7px] xs:text-[8px] sm:text-[9.5px] font-bold rounded-md transition-all cursor-pointer text-center ${
            mode === 'physical'
              ? 'bg-white text-amber-900 shadow-2xs font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Fisik
        </button>
      </div>

      {/* 3D Dice Scene (Slightly more compact scale for sleek board layout) */}
      <div
        className={`perspective-dice flex flex-col items-center justify-center select-none ${
          isEmbedded
            ? 'py-0 my-0 scale-38 xs:scale-44 sm:scale-52 md:scale-58 origin-center -my-2.5 sm:-my-1.5'
            : 'py-1 my-0.5 scale-75 sm:scale-80 origin-center'
        }`}
      >
        <div className="dice-scene flex items-center justify-center">
          <div
            className={`dice-cube ${isRolling ? 'dice-cube-rolling' : ''}`}
            style={cubeTransformStyle}
          >
            {/* Sisi 1 (Front: 1 Titik Merah Besar di Tengah) */}
            <div className="dice-face dice-face-1 relative">
              {renderPip('top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5', true)}
            </div>

            {/* Sisi 2 (Top: 2 Titik Diagonal) */}
            <div className="dice-face dice-face-2 relative">
              {renderPip('top-3 left-3')}
              {renderPip('bottom-3 right-3')}
            </div>

            {/* Sisi 3 (Right: 3 Titik Diagonal) */}
            <div className="dice-face dice-face-3 relative">
              {renderPip('top-3 left-3')}
              {renderPip('top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2')}
              {renderPip('bottom-3 right-3')}
            </div>

            {/* Sisi 4 (Left: 4 Titik Sudut) */}
            <div className="dice-face dice-face-4 relative">
              {renderPip('top-3 left-3')}
              {renderPip('top-3 right-3')}
              {renderPip('bottom-3 left-3')}
              {renderPip('bottom-3 right-3')}
            </div>

            {/* Sisi 5 (Bottom: 5 Titik) */}
            <div className="dice-face dice-face-5 relative">
              {renderPip('top-3 left-3')}
              {renderPip('top-3 right-3')}
              {renderPip('top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2')}
              {renderPip('bottom-3 left-3')}
              {renderPip('bottom-3 right-3')}
            </div>

            {/* Sisi 6 (Back: 6 Titik) */}
            <div className="dice-face dice-face-6 relative">
              {renderPip('top-2.5 left-3')}
              {renderPip('top-1/2 left-3 -translate-y-1/2')}
              {renderPip('bottom-2.5 left-3')}
              {renderPip('top-2.5 right-3')}
              {renderPip('top-1/2 right-3 -translate-y-1/2')}
              {renderPip('bottom-2.5 right-3')}
            </div>
          </div>
        </div>

        {/* Dynamic 3D Ground Contact Shadow */}
        <div
          className={`w-12 sm:w-14 h-2 bg-slate-900/30 rounded-full blur-[2px] mt-1.5 ${
            isRolling ? 'dice-shadow-rolling' : 'transition-all duration-300'
          }`}
        />

        {/* Roll Result Badge */}
        {lastRoll && !isRolling && (
          <div className="mt-0.5 flex items-center gap-0.5 animate-in zoom-in">
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 sm:px-1.5 py-0.2 rounded-full border border-amber-300 flex items-center gap-0.5 shadow-2xs">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
              <span>Dadu: {lastRoll}</span>
            </span>
          </div>
        )}
      </div>

      {/* Mode Actions: Digital Roll vs Physical Dice Selection */}
      {mode === 'digital' ? (
        <button
          onClick={handleDigitalRoll}
          disabled={disabled || isRolling}
          className={`${
            isEmbedded
              ? 'mt-0.5 py-0.5 sm:py-1 px-1 text-[8px] xs:text-[9px] sm:text-[10.5px] rounded-md sm:rounded-lg'
              : 'mt-2 py-2 px-3 text-xs sm:text-sm rounded-xl'
          } w-full font-heading font-extrabold tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-1 ${
            disabled || isRolling
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white hover:from-amber-600 hover:to-orange-600 active:scale-95 shadow-orange-500/25 hover:shadow-orange-500/40'
          }`}
        >
          <Dices className={`w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 ${isRolling ? 'animate-spin' : ''}`} />
          <span className="truncate">{isRolling ? 'Mengocok...' : disabled ? 'Melangkah...' : 'KOCOK DADU'}</span>
        </button>
      ) : (
        <div className="w-full mt-0.5 flex flex-col items-center">
          {/* Quick-Pick 1 to 6 direct buttons right in the widget */}
          <div className="w-full flex items-center justify-between mb-0.5 px-0.5">
            <span className="text-[6.5px] xs:text-[7.5px] sm:text-[8.5px] font-bold text-slate-500">
              Pilih Angka:
            </span>
            <button
              onClick={() => setShowManualModal(true)}
              disabled={disabled || isRolling}
              title="Buka pilihan dadu ukuran besar"
              className="text-[6.5px] xs:text-[7.5px] sm:text-[8.5px] font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
            >
              🔍 Layar Penuh
            </button>
          </div>
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1 w-full">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => handleManualInput(num)}
                disabled={disabled || isRolling}
                title={`Pilih ${num} langkah`}
                className="py-0.5 sm:py-1 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 disabled:opacity-40 border border-amber-300 hover:border-amber-400 rounded text-[9px] xs:text-[9.5px] sm:text-xs font-heading font-black text-amber-950 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs flex items-center justify-center"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Physical Dice Modal rendered directly to body via portal to prevent any clipping */}
      {showManualModal && typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[9999] animate-in fade-in">
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 shadow-2xl border-3 border-amber-300 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">🎲</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-heading font-black text-slate-800 leading-tight">
                      Pilih Angka Dadu Fisik
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500">
                      Ketuk angka sesuai lemparan dadu aslimu di meja:
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowManualModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 my-3 sm:my-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleManualInput(num)}
                    disabled={disabled || isRolling}
                    className="group flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-2 bg-amber-50/80 hover:bg-amber-100 active:bg-amber-200 border-2 border-amber-300 hover:border-amber-500 rounded-xl sm:rounded-2xl transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer shadow-xs hover:shadow-md"
                  >
                    <div className="w-7 h-7 sm:w-9 sm:h-9 bg-white border border-amber-300 rounded-md relative shadow-inner mb-1.5 flex items-center justify-center">
                      {renderDiceFaceDots(num)}
                    </div>
                    <span className="text-lg sm:text-xl font-heading font-black text-amber-950 leading-none">
                      {num}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-amber-700/80 mt-0.5">
                      {num} Langkah
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowManualModal(false)}
                className="w-full py-2 sm:py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal / Tutup
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
