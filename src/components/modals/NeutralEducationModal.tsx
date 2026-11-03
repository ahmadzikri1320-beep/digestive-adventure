/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { sounds } from '../../utils/soundEffects';
import { Apple, Droplets, HeartPulse, Check, Sparkles, X } from 'lucide-react';

interface NeutralEducationModalProps {
  playerName: string;
  onClose: () => void;
}

export const NeutralEducationModal: React.FC<NeutralEducationModalProps> = ({
  playerName,
  onClose,
}) => {
  const handleContinue = () => {
    sounds.playStep();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-4 border-emerald-400 relative">
        {/* Header */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-extrabold tracking-wider uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
            KOTAK 24: INFO EDUKASI NETRAL
          </span>
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-800 mt-2">
            Pos Istirahat & Gizi Seimbang
          </h3>
          <p className="text-xs text-slate-500">Petualang: {playerName}</p>
        </div>

        {/* Tile Graphic Preview */}
        <div className="flex justify-center my-3">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-300 bg-white">
            <img
              src="./assets/tiles/tile_24.png"
              alt="Kotak 24 Info Sehat"
              className="w-full h-full object-contain p-1"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Educational Content */}
        <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 space-y-3 mb-5">
          <div className="flex items-start gap-2.5">
            <Droplets className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-bold">Cukupi Kebutuhan Air:</strong> Minum minimal 8 gelas air putih setiap hari agar usus besar lancar memproses sisa makanan dan mencegah sembelit.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Apple className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-bold">Konsumsi Makanan Berserat:</strong> Perbanyak makan sayur-sayuran hijau, buah pepaya, pisang, dan biji-bijian utuh.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <HeartPulse className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-bold">Kebiasaan Sehat:</strong> Cuci tangan dengan sabun sebelum makan dan kunyah makanan secara perlahan sampai halus.
            </div>
          </div>
        </div>

        {/* Note: Kotak Netral */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center mb-4">
          <span className="text-[11px] font-semibold text-slate-500">
            ℹ️ Kotak ini adalah zona edukasi netral (tidak ada pengurangan maupun penambahan poin otomatis).
          </span>
        </div>

        {/* Working Confirmation Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-bold text-sm tracking-wide shadow-md shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>SAYA SUDAH MEMBACA & LANJUTKAN</span>
        </button>

        {/* Close button */}
        <button
          onClick={handleContinue}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
