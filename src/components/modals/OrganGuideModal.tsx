/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ORGAN_ENCYCLOPEDIA } from '../../data/quizzesData';
import { sounds } from '../../utils/soundEffects';
import { BookOpen, Sparkles, HeartPulse, X } from 'lucide-react';

interface OrganGuideModalProps {
  onClose: () => void;
}

export const OrganGuideModal: React.FC<OrganGuideModalProps> = ({ onClose }) => {
  const [selectedId, setSelectedId] = useState<string>(ORGAN_ENCYCLOPEDIA[0].id);

  const currentOrgan = ORGAN_ENCYCLOPEDIA.find((o) => o.id === selectedId) || ORGAN_ENCYCLOPEDIA[0];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-emerald-300 overflow-hidden relative">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-linear-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-heading font-bold">
                Mengenal Organ Sistem Pencernaan Manusia
              </h3>
              <p className="text-xs text-emerald-100">
                Materi IPA Terpadu Kelas 5 SD/MI - Struktur, Enzim & Pola Hidup Sehat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
          {/* Organ Selector Sidebar */}
          <div className="w-full md:w-56 shrink-0 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            {ORGAN_ENCYCLOPEDIA.map((organ) => {
              const isSelected = organ.id === selectedId;
              return (
                <button
                  key={organ.id}
                  onClick={() => {
                    sounds.playStep();
                    setSelectedId(organ.id);
                  }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 md:whitespace-normal ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <img
                    src={organ.image}
                    alt={organ.name}
                    className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 border border-slate-300"
                    referrerPolicy="no-referrer"
                  />
                  <span>{organ.name}</span>
                </button>
              );
            })}
          </div>

          {/* Organ Details View */}
          <div className="flex-1 bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-emerald-300 shrink-0">
                <img
                  src={currentOrgan.image}
                  alt={currentOrgan.name}
                  className="w-full h-full object-contain p-2"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Lokasi: {currentOrgan.location}
                </span>
                <h4 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-800 mt-1">
                  {currentOrgan.name}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {currentOrgan.role}
                </p>
              </div>
            </div>

            {/* Enzymes & Chemicals */}
            <div className="mb-4">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Enzim & Cairan Pencernaan:</span>
              </h5>
              <div className="space-y-1.5">
                {currentOrgan.enzymes.map((enz, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    • {enz}
                  </div>
                ))}
              </div>
            </div>

            {/* Health Tips */}
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <HeartPulse className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-950">
                <strong className="font-bold">Tips Sehat Pencernaan:</strong> {currentOrgan.healthTips}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup Ensiklopedia
          </button>
        </div>
      </div>
    </div>
  );
};
