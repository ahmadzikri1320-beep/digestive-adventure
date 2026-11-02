/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, GameCard } from '../../types/game';
import { ORGAN_CARDS } from '../../data/cardsData';
import { BOARD_TILES } from '../../data/tilesData';
import { Volume2, CheckCircle2, Lock, X, Sparkles, Award } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface OrganTrackerModalProps {
  players: Player[];
  activePlayer?: Player;
  onClose: () => void;
}

// 8 Sequential Digestive System Organs in anatomical order
const ORGAN_ORDER: Array<{ key: string; name: string; icon: string; tileId: number; step: number }> = [
  { key: 'mulut', name: 'Mulut', icon: '👄', tileId: 2, step: 1 },
  { key: 'gigi', name: 'Gigi', icon: '🦷', tileId: 3, step: 2 },
  { key: 'lidah', name: 'Lidah', icon: '👅', tileId: 5, step: 3 },
  { key: 'kerongkongan', name: 'Kerongkongan', icon: '🥖', tileId: 7, step: 4 },
  { key: 'lambung', name: 'Lambung', icon: '🥐', tileId: 9, step: 5 },
  { key: 'usus_halus', name: 'Usus Halus', icon: '🧃', tileId: 11, step: 6 },
  { key: 'usus_besar', name: 'Usus Besar', icon: '💧', tileId: 15, step: 7 },
  { key: 'anus', name: 'Anus', icon: '🎯', tileId: 19, step: 8 },
];

export const OrganTrackerModal: React.FC<OrganTrackerModalProps> = ({
  players,
  activePlayer,
  onClose,
}) => {
  const [selectedOrganKey, setSelectedOrganKey] = useState<string>('mulut');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Helper to find which player owns a specific organ
  const getOwner = (key: string): Player | undefined => {
    return players.find((p) => p.organCards.includes(key));
  };

  const activeOrganCard = ORGAN_CARDS[selectedOrganKey];
  const activeOrganMeta = ORGAN_ORDER.find((o) => o.key === selectedOrganKey) || ORGAN_ORDER[0];
  const owner = getOwner(selectedOrganKey);

  // Text to speech narration for elementary students
  const handleNarrate = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Total organs claimed across all players
  const totalClaimedCount = ORGAN_ORDER.filter((o) => Boolean(getOwner(o.key))).length;

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border-3 border-amber-300 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🫀</span>
            <div>
              <h3 className="text-base sm:text-lg font-heading font-black text-amber-950">
                Peta & Pelacak Organ Pencernaan
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500">
                Lacak kartu organ tubuh yang telah ditemukan petualang ({totalClaimedCount}/8 Organ Terkumpul):
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8 Organ Pathway Sequence */}
        <div className="py-2.5 overflow-x-auto scrollbar-none shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-1.5 min-w-max px-1">
            {ORGAN_ORDER.map((item, idx) => {
              const organOwner = getOwner(item.key);
              const isSelected = item.key === selectedOrganKey;

              return (
                <React.Fragment key={item.key}>
                  <button
                    onClick={() => {
                      sounds.playStep();
                      setSelectedOrganKey(item.key);
                    }}
                    className={`flex flex-col items-center p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer min-w-[62px] sm:min-w-[70px] ${
                      isSelected
                        ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 shadow-xs scale-105'
                        : organOwner
                        ? 'bg-emerald-50/80 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 opacity-80'
                    }`}
                  >
                    <span className="text-base sm:text-lg">{item.icon}</span>
                    <span className="text-[9px] sm:text-[10.5px] font-heading font-extrabold text-slate-800 mt-0.5 truncate max-w-full">
                      {item.name}
                    </span>
                    <span className="text-[7.5px] sm:text-[8px] font-bold mt-0.5">
                      {organOwner ? (
                        <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> {organOwner.name.slice(0, 5)}
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> Kotak #{item.tileId}
                        </span>
                      )}
                    </span>
                  </button>
                  {idx < ORGAN_ORDER.length - 1 && (
                    <span className="text-amber-400 font-black text-xs select-none">&rarr;</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Organ Detail Card */}
        {activeOrganCard && (
          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 bg-linear-to-b from-amber-50/70 to-orange-50/40 p-3 sm:p-4 rounded-2xl border border-amber-200">
              <img
                src={activeOrganCard.image}
                alt={activeOrganCard.title}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl bg-white p-1 border border-amber-300 shadow-xs shrink-0"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1">
                  <span className="text-[10px] font-heading font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">
                    URUTAN KE-{activeOrganMeta.step} DARI 8
                  </span>

                  {owner ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-600" /> Dimiliki oleh {owner.name} (+10 Poin Finish)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full border border-slate-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Masih Tersedia di Kotak #{activeOrganMeta.tileId}
                    </span>
                  )}
                </div>

                <h4 className="text-lg sm:text-xl font-heading font-black text-slate-800">
                  {activeOrganCard.title}
                </h4>
                <p className="text-xs text-amber-900 font-bold mt-0.5">
                  {activeOrganCard.subtitle}
                </p>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeOrganCard.instruction}
                </p>

                {/* Voice Narration Button */}
                <button
                  onClick={() =>
                    handleNarrate(
                      `${activeOrganCard.title}. ${activeOrganCard.subtitle || ''}. ${activeOrganCard.instruction}`
                    )
                  }
                  className="mt-2.5 inline-flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer transition-all"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse' : ''}`} />
                  <span>{isSpeaking ? 'Sedang Membaca...' : '🔊 Dengarkan Suara Narasi'}</span>
                </button>
              </div>
            </div>

            {/* Quick Fact Banner */}
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-start gap-2 text-xs text-sky-950">
              <span className="text-base shrink-0">💡</span>
              <p>
                <strong>Aturan Poin Organ:</strong> Setiap kartu organ tubuh yang disimpan di inventarismu akan
                dikonversi menjadi <strong>+10 Poin Bonus</strong> saat pion berhasil mencapai garis <strong>Finish (Kotak 28)</strong>!
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
