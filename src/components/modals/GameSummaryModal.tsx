/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { Player, PawnColor } from '../../types/game';
import { PawnAvatar } from '../PawnAvatar';
import { sounds } from '../../utils/soundEffects';
import { Trophy, Medal, RotateCcw, BarChart3, ListOrdered, CheckCircle } from 'lucide-react';

interface GameSummaryModalProps {
  players: Player[];
  onPlayAgain: () => void;
  onClose: () => void;
}

const PAWN_COLOR_HEX: Record<PawnColor, string> = {
  red: '#EF4444',
  blue: '#0EA5E9',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  orange: '#F97316',
};

export const GameSummaryModal: React.FC<GameSummaryModalProps> = ({
  players,
  onPlayAgain,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'list'>('chart');

  useEffect(() => {
    sounds.playVictory();
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Sort players by points descending. If points equal, whoever finished earlier wins.
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    const rankA = a.finishRank || 99;
    const rankB = b.finishRank || 99;
    return rankA - rankB;
  });

  const winner = sortedPlayers[0];
  const isTie = sortedPlayers.length > 1 && sortedPlayers[0].points === sortedPlayers[1].points;

  // Chart Data preparation
  const chartData = sortedPlayers.map((p) => ({
    name: p.name,
    points: p.points,
    color: PAWN_COLOR_HEX[p.pawnColor] || '#F59E0B',
    cards: p.organCards.length,
    pawnColor: p.pawnColor,
  }));

  return (
    <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl border-4 border-amber-400 overflow-hidden relative">
        {/* Header Hero */}
        <div className="p-5 sm:p-6 bg-linear-to-b from-amber-400 via-orange-400 to-amber-500 text-center text-white relative shrink-0">
          <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-1.5 backdrop-blur-xs shadow-inner">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-200 animate-bounce" />
          </div>

          <h3 className="text-xl sm:text-3xl font-heading font-extrabold tracking-wide drop-shadow-sm">
            {isTie ? 'HASIL PERTANDINGAN SERI!' : `JUARA UTAMA: ${winner.name.toUpperCase()}!`}
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 font-medium mt-1">
            Petualangan Sistem Pencernaan Selesai dengan Gemilang!
          </p>
        </div>

        {/* Tab switchers: Visualisasi Grafik Batang Recharts vs Tabel Klasemen */}
        <div className="px-6 pt-3 pb-1 bg-amber-50/50 flex items-center justify-between border-b border-amber-200 shrink-0">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Hasil Akhir Permainan:
          </span>
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-amber-200 shadow-2xs">
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'chart'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Grafik Batang (Recharts)</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Daftar Klasemen</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'chart' ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-heading font-extrabold text-slate-700 uppercase tracking-wider">
                    Perbandingan Total Poin Antar Pemain
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Satuan: Poin
                  </span>
                </div>

                {/* Recharts Bar Chart Container */}
                <div className="w-full h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 15, left: -10, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-700">
                                <p className="font-bold text-amber-300">{data.name}</p>
                                <p className="text-sm font-extrabold mt-0.5">
                                  {data.points} Poin
                                </p>
                                <p className="text-[10px] text-slate-300">
                                  {data.cards} Kartu Organ Dimiliki
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="points" radius={[8, 8, 0, 0]} isAnimationActive={true}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Legend Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {chartData.map((entry, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="font-bold text-slate-800">{entry.name}:</span>
                    <span className="font-extrabold text-amber-700">{entry.points} Poin</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
                KLASEMEN AKHIR PETUALANG
              </h4>

              {sortedPlayers.map((player, idx) => (
                <div
                  key={player.id}
                  className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                    idx === 0
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl font-heading font-extrabold text-xs flex items-center justify-center ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <PawnAvatar color={player.pawnColor} size="sm" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-800">{player.name}</h5>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{player.organCards.length} Kartu Organ (+{player.organCards.length * 10} Poin)</span>
                        <span>•</span>
                        <span>Posisi Kotak: #{player.position}</span>
                        {player.hasCompletedFinalMission && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3" /> Misi Selesai
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-heading font-extrabold text-amber-800">
                      {player.points}
                      <span className="text-xs font-normal text-slate-500 ml-1">Poin</span>
                    </div>
                    {player.finishRank && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Finish Ke-{player.finishRank}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2 justify-between shrink-0">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
          >
            Tinjau Papan Permainan
          </button>

          <button
            onClick={onPlayAgain}
            className="py-3 px-6 rounded-xl bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-heading font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-orange-500/25 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MAIN LAGI DENGAN PEMAIN BARU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
