/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FINAL_MISSION_TASKS } from '../../data/quizzesData';
import { FinalMissionTask } from '../../types/game';
import { sounds } from '../../utils/soundEffects';
import { Award, UserCheck, RotateCcw, Check, Sparkles, X } from 'lucide-react';

interface FinalMissionModalProps {
  playerName: string;
  onSuccess: (task: FinalMissionTask) => void;
  onClose: () => void;
}

export const FinalMissionModal: React.FC<FinalMissionModalProps> = ({
  playerName,
  onSuccess,
  onClose,
}) => {
  const [taskIndex, setTaskIndex] = useState(() => Math.floor(Math.random() * FINAL_MISSION_TASKS.length));
  const [evaluation, setEvaluation] = useState<'pending' | 'success' | 'retry'>('pending');

  const task = FINAL_MISSION_TASKS[taskIndex];

  const handleNextTask = () => {
    sounds.playStep();
    setTaskIndex((prev) => (prev + 1) % FINAL_MISSION_TASKS.length);
    setEvaluation('pending');
  };

  const handleEvaluate = (isSuccess: boolean) => {
    if (isSuccess) {
      sounds.playBonus();
      setEvaluation('success');
    } else {
      sounds.playPenalty();
      setEvaluation('retry');
    }
  };

  const handleFinishMission = () => {
    sounds.playVictory();
    onSuccess(task);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-4 border-emerald-400 relative">
        {/* Header Badge */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-extrabold tracking-wider uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
            KOTAK 27: FINAL MISSION
          </span>
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-800 mt-2">
            Misi Gerakan Khas Organ Pencernaan
          </h3>
          <p className="text-xs text-slate-500">
            Petualang: <strong className="text-emerald-700">{playerName}</strong>
          </p>
        </div>

        {/* Task Visual Card */}
        <div className="bg-linear-to-b from-emerald-50 to-teal-50/60 rounded-2xl p-5 border-2 border-emerald-200 text-center mb-5">
          <div className="flex justify-center mb-3">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-300 bg-white">
              <img
                src={task.image}
                alt={task.organ}
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            ORGAN YANG DIPERAGAKAN:
          </span>
          <h4 className="text-lg sm:text-xl font-heading font-extrabold text-emerald-950 mt-0.5">
            {task.organ}
          </h4>

          <div className="mt-3 bg-white p-3.5 rounded-xl border border-emerald-200 text-slate-800 text-xs sm:text-sm font-semibold leading-relaxed shadow-xs">
            &ldquo;{task.actionInstruction}&rdquo;
          </div>

          <p className="text-[11px] text-emerald-800/80 mt-2 italic">
            💡 Fakta IPA: {task.learningTip}
          </p>
        </div>

        {/* Teacher Evaluation Section */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700">PENILAIAN GURU / PENDAMPING:</span>
            </div>
            <button
              onClick={handleNextTask}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Ganti Misi</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleEvaluate(true)}
              className={`py-2.5 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                evaluation === 'success'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white border-2 border-emerald-400 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>GERAKAN BERHASIL</span>
            </button>

            <button
              onClick={() => handleEvaluate(false)}
              className={`py-2.5 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                evaluation === 'retry'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white border-2 border-rose-400 text-rose-700 hover:bg-rose-50'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>COBA LAGI</span>
            </button>
          </div>

          {evaluation === 'retry' && (
            <p className="text-xs text-rose-600 mt-2 text-center font-medium">
              Gerakan belum tuntas. Beri semangat dan peragakan sekali lagi dengan ekspresif!
            </p>
          )}
        </div>

        {/* Success Action */}
        {evaluation === 'success' ? (
          <button
            onClick={handleFinishMission}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-heading font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
          >
            <Sparkles className="w-4 h-4" />
            <span>FINAL MISSION SELESAI! BUKA GERBANG FINISH</span>
          </button>
        ) : (
          <p className="text-xs text-slate-400 text-center">
            Pemain harus menyelesaikan gerakan ini sebelum diperbolehkan melangkah ke Kotak 28 (FINISH).
          </p>
        )}

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
