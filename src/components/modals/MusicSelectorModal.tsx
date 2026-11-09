/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { sounds, BGM_TRACKS, BgmTrack } from '../../utils/soundEffects';
import {
  X,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  Sparkles,
  CheckCircle2,
  Radio,
  Flame,
} from 'lucide-react';

interface MusicSelectorModalProps {
  onClose: () => void;
}

export const MusicSelectorModal: React.FC<MusicSelectorModalProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => sounds.isBgmOn());
  const [currentTrackId, setCurrentTrackId] = useState<string>(() => sounds.getCurrentTrackId());
  const [volume, setVolume] = useState<number>(() => sounds.getBgmVolume());
  const [customName, setCustomName] = useState<string>(() => sounds.getCustomTrackName());
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return sounds.subscribe(() => {
      setIsPlaying(sounds.isBgmOn());
      setCurrentTrackId(sounds.getCurrentTrackId());
      setVolume(sounds.getBgmVolume());
      setCustomName(sounds.getCustomTrackName());
    });
  }, []);

  const handleSelectTrack = (trackId: string) => {
    sounds.playStep();
    sounds.setBgmTrack(trackId);
    if (!isPlaying) {
      sounds.startBgm();
    }
  };

  const handleTogglePlay = () => {
    sounds.playCardFlip();
    sounds.toggleBgm();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sounds.setBgmVolume(val);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sounds.playBonus();
      sounds.setCustomAudioFile(file);
      setUploadStatus(`Berhasil memuat: ${file.name}`);
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) return;
    sounds.playBonus();
    sounds.setCustomAudioUrl(customUrlInput.trim(), 'Musik URL Tautan');
    setUploadStatus('Berhasil memutar audio dari tautan!');
    setCustomUrlInput('');
    setTimeout(() => setUploadStatus(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border-3 sm:border-4 border-amber-300 overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-xs">
              <Music className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-white leading-tight">
                Pilih Musik Latar Permainan
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-100 font-medium">
                Irama ceria & bersemangat untuk memotivasi belajar anak
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playCardFlip();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Top Master Controller Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Jeda Musik (Pause)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Putar Musik (Play)</span>
                </>
              )}
            </button>

            {/* Volume Control */}
            <div className="w-full sm:w-auto flex items-center gap-2.5 flex-1 max-w-xs">
              <button
                onClick={() => sounds.setBgmVolume(volume > 0 ? 0 : 0.7)}
                className="text-slate-600 hover:text-slate-800 cursor-pointer p-1"
                title="Bisu / Nyala"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-amber-600" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-amber-500 cursor-pointer"
                title="Volume Musik"
              />
              <span className="text-[11px] font-bold text-slate-600 w-9 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Built-in Tracks List */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Pilihan Musik Ceria & Memotivasi:</span>
            </h3>

            <div className="space-y-2">
              {BGM_TRACKS.filter((t) => !t.isCustom).map((track) => {
                const isSelected = currentTrackId === track.id;
                const isThisPlaying = isSelected && isPlaying;

                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track.id)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300/60 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-linear-to-br ${track.color} text-white shadow-xs`}
                      >
                        {track.icon}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-heading font-black text-slate-800 truncate">
                            {track.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                            {track.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {track.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Action Pill */}
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-semibold hidden xs:inline">
                        {track.bpm} BPM
                      </span>
                      {isSelected ? (
                        <span
                          className={`px-3 py-1.5 rounded-xl font-heading font-extrabold text-[11px] flex items-center gap-1.5 ${
                            isThisPlaying
                              ? 'bg-amber-500 text-white animate-pulse shadow-xs'
                              : 'bg-amber-200 text-amber-900'
                          }`}
                        >
                          {isThisPlaying ? (
                            <>
                              <Radio className="w-3.5 h-3.5 animate-spin" />
                              <span>Memutar</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Dipilih</span>
                            </>
                          )}
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-xl font-heading font-bold text-[11px] transition-colors"
                        >
                          Pilih
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Track Uploader Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/70 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📁</span>
                <h4 className="text-xs sm:text-sm font-heading font-extrabold text-purple-950">
                  Tambah Lagu Sendiri (MP3 / Audio Kelas)
                </h4>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300">
                Kustom
              </span>
            </div>

            <p className="text-[11px] text-purple-800 leading-relaxed mb-3">
              Ingin memutar lagu tema anak favorit atau lagu kelas sendiri? Anda bisa memilih file audio dari HP / komputer atau memasukkan tautan lagu.
            </p>

            {uploadStatus && (
              <div className="mb-3 p-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 animate-in fade-in flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{uploadStatus}</span>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih File Audio (.mp3, .wav)</span>
              </button>

              {currentTrackId === 'custom' && (
                <button
                  onClick={() => handleSelectTrack('custom')}
                  className="py-2.5 px-3 bg-purple-100 border border-purple-300 text-purple-900 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-purple-700" />
                  <span className="max-w-[120px] truncate">{customName}</span>
                </button>
              )}
            </div>

            {/* Optional URL stream input */}
            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="Atau masukkan tautan audio (https://...mp3)"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleApplyUrl}
                disabled={!customUrlInput.trim()}
                className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Putar
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Musik akan berputar otomatis secara halus di latar belakang</span>
          </div>
          <button
            onClick={() => {
              sounds.playCardFlip();
              onClose();
            }}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-heading font-bold text-xs cursor-pointer transition-all active:scale-95"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
