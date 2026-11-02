/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface ResetConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-rose-300 text-center animate-in zoom-in-95">
        <div className="inline-flex p-3.5 bg-rose-100 text-rose-600 rounded-2xl mb-3 shadow-inner">
          <RotateCcw className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-heading font-extrabold text-slate-800">
          Mulai Ulang Permainan?
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Semua progres pemain, posisi pion, kartu organ yang terkumpul, dan skor akan diatur ulang kembali ke awal.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={() => {
              sounds.playPenalty();
              onConfirm();
            }}
            className="w-full py-3 bg-linear-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-600 hover:to-red-600 text-white font-heading font-extrabold text-sm rounded-xl shadow-md shadow-rose-500/25 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ya, Mulai Ulang</span>
          </button>

          <button
            onClick={onCancel}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
          >
            Batal & Lanjutkan Main
          </button>
        </div>
      </div>
    </div>
  );
};
