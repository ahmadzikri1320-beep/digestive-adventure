/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameCard } from '../../types/game';
import { sounds } from '../../utils/soundEffects';
import { Coins, Eye, Check, X, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface CardModalProps {
  card: GameCard;
  onClose: () => void;
  onSellCard?: () => void;
  canSell?: boolean;
  playerName: string;
  ownerName?: string;
  isAlreadyClaimedByOther?: boolean;
}

export const CardModal: React.FC<CardModalProps> = ({
  card,
  onClose,
  onSellCard,
  canSell = false,
  playerName,
  ownerName,
  isAlreadyClaimedByOther = false,
}) => {
  const [isReadingMode, setIsReadingMode] = useState(false);

  const handleSell = () => {
    sounds.playBonus();
    if (onSellCard) onSellCard();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-rose-400 relative">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold tracking-wider uppercase bg-rose-100 text-rose-800 px-3 py-1 rounded-full border border-rose-300">
              KARTU ORGAN PENCERNAAN
            </span>
            {isAlreadyClaimedByOther ? (
              <span className="text-[11px] font-black uppercase bg-amber-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                <Lock className="w-3 h-3" />
                <span>Dimiliki {ownerName}</span>
              </span>
            ) : (
              <span className="text-[11px] font-black uppercase bg-emerald-600 text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3" />
                <span>+10 Poin di Finish</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-rose-950 mt-1">
            {card.title}
          </h3>
          <p className="text-xs text-slate-500">
            {isAlreadyClaimedByOther
              ? `Telah ditemukan oleh petualang: ${ownerName}`
              : card.subtitle || `Ditemukan oleh ${playerName}`}
          </p>
        </div>

        {/* Ownership Notice */}
        {isAlreadyClaimedByOther ? (
          <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 text-left text-xs mb-3 flex items-start gap-2.5 text-amber-900">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold">Kartu Organ Sudah Dimiliki {ownerName}!</p>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                Setiap kartu organ bersifat eksklusif dan <strong>hanya dapat dimiliki oleh 1 pemain yang pertama kali menemukannya</strong>. Kamu dapat membaca dan mempelajari informasinya, tetapi kartu ini tidak masuk ke inventarismu.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs mb-3 flex items-center justify-center gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Kartu ini tersimpan di inventarismu dan akan <strong>diakumulasi +10 Poin saat Finish</strong>!</span>
          </div>
        )}

        {/* Card Image Authentic View */}
        <div className="flex justify-center my-2">
          <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-rose-200 max-w-[260px] bg-rose-50">
            <img
              src={card.image}
              alt={card.title}
              className={`w-full h-auto object-contain transition-transform duration-300 ${
                isReadingMode ? 'scale-110' : 'hover:scale-105'
              }`}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Card Description */}
        <div className="bg-rose-50/80 rounded-2xl p-3 border border-rose-200 my-3 text-center">
          <p className="text-xs sm:text-sm font-medium text-rose-950 leading-relaxed">
            &ldquo;{card.instruction}&rdquo;
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sounds.playStep();
                setIsReadingMode(!isReadingMode);
              }}
              className="py-2.5 px-3 rounded-xl border border-rose-200 text-slate-700 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Eye className="w-4 h-4 text-rose-600" />
              <span>{isReadingMode ? 'Tampilan Normal' : 'BACA KARTU'}</span>
            </button>

            {canSell && onSellCard && !isAlreadyClaimedByOther && (
              <button
                onClick={handleSell}
                className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-transform active:scale-95"
              >
                <Coins className="w-4 h-4" />
                <span>JUAL (+5 POIN)</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              sounds.playStep();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-linear-to-r from-rose-600 to-red-600 text-white font-heading font-bold text-sm tracking-wide shadow-md shadow-rose-600/20 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isAlreadyClaimedByOther ? 'MENGERTI & LANJUTKAN' : 'SIMPAN KE INVENTARIS (+10 POIN)'}</span>
          </button>
        </div>

        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
