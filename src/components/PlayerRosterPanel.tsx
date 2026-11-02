/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Player } from '../types/game';
import { ORGAN_CARDS } from '../data/cardsData';
import { PawnAvatar } from './PawnAvatar';
import { sounds } from '../utils/soundEffects';
import { ShieldCheck, Sparkles, CheckCircle2, Coins, ChevronRight } from 'lucide-react';
import { FloatingPointItem } from '../types/game';
import { FloatingPointsOverlay } from './FloatingPointsOverlay';

interface PlayerRosterPanelProps {
  players: Player[];
  activePlayerIndex: number;
  onOpenCardModal: (organKey: string, canSell: boolean) => void;
  floatingPoints?: FloatingPointItem[];
}

export const PlayerRosterPanel: React.FC<PlayerRosterPanelProps> = ({
  players,
  activePlayerIndex,
  onOpenCardModal,
  floatingPoints = [],
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h4 className="text-xs font-heading font-bold text-slate-800 uppercase tracking-wider">
          Daftar Petualang & Inventaris
        </h4>
        <span className="text-[11px] text-slate-400 font-medium">
          {players.length} Pemain
        </span>
      </div>

      <div className="space-y-3">
        {players.map((player, idx) => {
          const isTurn = idx === activePlayerIndex;

          return (
            <div
              key={player.id}
              className={`p-3 rounded-2xl border transition-all ${
                isTurn
                  ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              {/* Player Top Line */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <FloatingPointsOverlay items={floatingPoints.filter((fp) => fp.playerId === player.id)} />
                    <PawnAvatar color={player.pawnColor} size="sm" isCurrent={isTurn} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-heading font-bold text-slate-800 truncate">
                        {player.name}
                      </span>
                      {isTurn && (
                        <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200 px-1.5 py-0.2 rounded-md">
                          Giliranmu
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Kotak #{player.position}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-heading font-extrabold text-amber-800">
                    {player.points}
                    <span className="text-[10px] font-normal text-slate-500 ml-1">Poin</span>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                {player.hasSaverCard && (
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-purple-600" /> Penyelamat
                  </span>
                )}

                {player.hasCompletedFinalMission && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Final Lulus
                  </span>
                )}

                {player.hasFinished && (
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-sky-600" /> Finish #{player.finishRank}
                  </span>
                )}
              </div>

              {/* Cards Held Pills */}
              {player.organCards.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                    Kartu Organ Dimiliki ({player.organCards.length} = +{player.organCards.length * 10} Poin di Finish):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {player.organCards.map((key) => {
                      const organ = ORGAN_CARDS[key];
                      if (!organ) return null;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            sounds.playCardFlip();
                            onOpenCardModal(key, isTurn);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 text-[11px] font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                        >
                          <img
                            src={organ.image}
                            alt={organ.title}
                            className="w-4 h-4 rounded-xs object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <span>{organ.title}</span>
                          {isTurn && <Coins className="w-3 h-3 text-emerald-600 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
