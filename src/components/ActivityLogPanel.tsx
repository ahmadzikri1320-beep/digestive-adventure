/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActivityLogItem } from '../types/game';
import { PawnAvatar } from './PawnAvatar';
import { History } from 'lucide-react';

interface ActivityLogPanelProps {
  logs: ActivityLogItem[];
}

export const ActivityLogPanel: React.FC<ActivityLogPanelProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col h-full max-h-80 sm:max-h-96">
      <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-slate-100 shrink-0">
        <History className="w-4 h-4 text-amber-500" />
        <h4 className="text-xs font-heading font-bold text-slate-800 uppercase tracking-wider">
          Riwayat Aktivitas Petualangan
        </h4>
        <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {logs.length} Aksi
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
        {logs.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            Belum ada aktivitas. Lempar dadu untuk memulai!
          </div>
        ) : (
          logs.slice(0, 30).map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100 border border-slate-100 transition-colors flex items-start gap-2.5"
            >
              <PawnAvatar color={log.pawnColor} size="sm" className="shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-800 truncate">{log.playerName}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
                </div>
                <p className="text-slate-600 mt-0.5 leading-snug break-words">{log.action}</p>
              </div>

              {log.pointsDelta !== undefined && log.pointsDelta !== 0 && (
                <span
                  className={`text-xs font-extrabold shrink-0 px-1.5 py-0.5 rounded-md ${
                    log.pointsDelta > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {log.pointsDelta > 0 ? `+${log.pointsDelta}` : log.pointsDelta}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
