/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { sounds } from '../../utils/soundEffects';
import { Droplets, Sparkles, Check, Award, X } from 'lucide-react';

interface WaterAndWasteModalProps {
  playerName: string;
  onClaimBonus: () => void;
  onClose: () => void;
}

export const WaterAndWasteModal: React.FC<WaterAndWasteModalProps> = ({
  playerName,
  onClaimBonus,
  onClose,
}) => {
  const handleClaim = () => {
    sounds.playBonus();
    onClaimBonus();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-4 border-sky-400 relative">
        {/* Header */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-extrabold tracking-wider uppercase bg-sky-100 text-sky-800 px-3 py-1 rounded-full border border-sky-300">
            KOTAK 21: AIR & SISA
          </span>
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-800 mt-2">
            Penyerapan Cairan di Usus Besar
          </h3>
          <p className="text-xs text-slate-500">Petualang: {playerName}</p>
        </div>

        {/* Tile Image */}
        <div className="flex justify-center my-3">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-sky-300 bg-white">
            <img
              src="/assets/tiles/tile_21.png"
              alt="Air dan Sisa"
              className="w-full h-full object-contain p-1"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Learning Content */}
        <div className="bg-sky-50/80 rounded-2xl p-4 border border-sky-200 text-slate-700 text-xs sm:text-sm space-y-2 mb-4 leading-relaxed">
          <p>
            Di dalam <strong>usus besar</strong>, ampas sisa makanan mengalami penyerapan kembali kelebihan air dan garam-garam mineral.
          </p>
          <p className="text-sky-950 font-medium">
            Proses ini menjaga tubuh agar tidak dehidrasi dan mengubah ampas cair menjadi feses yang padat dan teratur.
          </p>
        </div>

        {/* Bonus +10 Highlight */}
        <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-center mb-4">
          <div className="flex items-center justify-center gap-1.5 text-amber-900 font-heading font-extrabold text-sm sm:text-base">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Bonus Pemahaman IPA: +10 Poin!</span>
          </div>
        </div>

        <button
          onClick={handleClaim}
          className="w-full py-3.5 rounded-xl bg-linear-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-heading font-bold text-sm tracking-wide shadow-md shadow-sky-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>KLAIM +10 POIN & LANJUTKAN</span>
        </button>

        <button
          onClick={handleClaim}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
