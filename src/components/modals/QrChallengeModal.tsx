/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { QR_CHALLENGES, QR_MATCHING_CHALLENGES, QR_SEQUENCE_PUZZLES } from '../../data/quizzesData';
import { sounds } from '../../utils/soundEffects';
import {
  Camera,
  Star,
  Award,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Globe,
  ExternalLink,
  X,
  Puzzle,
  ArrowUpDown,
  HelpCircle,
  Check,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface QrChallengeModalProps {
  tileNumber: number;
  tileTitle: string;
  playerName: string;
  onSuccess: (points: number, message: string) => void;
  onClose: () => void;
}

const EDUCATIONAL_WEB_LINKS = [
  {
    title: 'Video Edukasi Sistem Pencernaan SD (YouTube / Sumber Belajar)',
    url: 'https://www.youtube.com/results?search_query=sistem+pencernaan+manusia+sd+kelas+5',
    desc: 'Tonton video animasi perjalanan makanan dari mulut sampai anus.',
  },
  {
    title: 'Materi IPA Kelas 5: Organ & Enzim Pencernaan (Kemdikbud)',
    url: 'https://buku.kemdikbud.go.id/',
    desc: 'Referensi resmi buku tematik IPA kurikulum sekolah dasar.',
  },
  {
    title: 'Ensiklopedia Anatomi & Fakta Menarik Lambung & Usus',
    url: 'https://id.wikipedia.org/wiki/Sistem_pencernaan',
    desc: 'Pelajari fungsi penyerapan sari makanan dan proses pembentukan feses.',
  },
];

type QrTabType = 'matching' | 'sequence' | 'quiz' | 'scanner' | 'web';

export const QrChallengeModal: React.FC<QrChallengeModalProps> = ({
  tileNumber,
  tileTitle,
  playerName,
  onSuccess,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<QrTabType>('matching');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  // 1. MATCHING PUZZLE STATE
  const [matchingIndex, setMatchingIndex] = useState<number>(0);
  const matchingChallenge = QR_MATCHING_CHALLENGES[matchingIndex] || QR_MATCHING_CHALLENGES[0];
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [wrongPairNotice, setWrongPairNotice] = useState<string | null>(null);
  const [shuffledRights, setShuffledRights] = useState<typeof matchingChallenge.pairs>([]);

  useEffect(() => {
    // Shuffle the right side when challenge changes
    const shuffled = [...matchingChallenge.pairs].sort(() => Math.random() - 0.5);
    setShuffledRights(shuffled);
    setSelectedLeftId(null);
    setMatchedPairIds([]);
    setWrongPairNotice(null);
  }, [matchingChallenge]);

  const handleNextMatchingChallenge = () => {
    sounds.playStep();
    setMatchingIndex((prev) => (prev + 1) % QR_MATCHING_CHALLENGES.length);
  };

  const handleSelectLeft = (id: string) => {
    if (matchedPairIds.includes(id)) return;
    sounds.playStep();
    setSelectedLeftId(id);
    setWrongPairNotice(null);
  };

  const handleSelectRight = (id: string) => {
    if (!selectedLeftId || matchedPairIds.includes(id)) return;

    if (selectedLeftId === id) {
      sounds.playBonus();
      const updated = [...matchedPairIds, id];
      setMatchedPairIds(updated);
      setSelectedLeftId(null);
      setWrongPairNotice(null);
    } else {
      sounds.playPenalty();
      setWrongPairNotice('Pasangan belum tepat! Coba hubungkan dengan fungsi yang sesuai.');
      setSelectedLeftId(null);
      setTimeout(() => setWrongPairNotice(null), 2000);
    }
  };

  const isMatchingComplete = matchedPairIds.length === matchingChallenge.pairs.length;

  // 2. SEQUENCE PUZZLE STATE
  const [sequenceIndex, setSequenceIndex] = useState<number>(0);
  const sequenceChallenge = QR_SEQUENCE_PUZZLES[sequenceIndex] || QR_SEQUENCE_PUZZLES[0];
  const [currentSequenceOrder, setCurrentSequenceOrder] = useState<string[]>([]);
  const [isSequenceChecked, setIsSequenceChecked] = useState<boolean>(false);
  const [isSequenceCorrect, setIsSequenceCorrect] = useState<boolean>(false);

  useEffect(() => {
    // Scramble items for sequence puzzle
    const scrambled = [...sequenceChallenge.items].sort(() => Math.random() - 0.5).map((x) => x.id);
    setCurrentSequenceOrder(scrambled);
    setIsSequenceChecked(false);
    setIsSequenceCorrect(false);
  }, [sequenceChallenge]);

  const handleMoveSequenceItem = (fromIdx: number, direction: 'up' | 'down') => {
    sounds.playStep();
    const toIdx = direction === 'up' ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= currentSequenceOrder.length) return;

    const next = [...currentSequenceOrder];
    const temp = next[fromIdx];
    next[fromIdx] = next[toIdx];
    next[toIdx] = temp;
    setCurrentSequenceOrder(next);
    setIsSequenceChecked(false);
  };

  const handleCheckSequence = () => {
    const isOk = currentSequenceOrder.every((id, idx) => id === sequenceChallenge.correctOrder[idx]);
    setIsSequenceChecked(true);
    setIsSequenceCorrect(isOk);
    if (isOk) {
      sounds.playBonus();
    } else {
      sounds.playPenalty();
    }
  };

  const handleNextSequencePuzzle = () => {
    sounds.playStep();
    setSequenceIndex((prev) => (prev + 1) % QR_SEQUENCE_PUZZLES.length);
  };

  // 3. MULTIPLE CHOICE QUIZ STATE
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    return (tileNumber * 5 + Math.floor(Math.random() * 7)) % QR_CHALLENGES.length;
  });
  const question = QR_CHALLENGES[currentQuestionIndex] || QR_CHALLENGES[0];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleNextRandomQuestion = () => {
    sounds.playStep();
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setCurrentQuestionIndex((prev) => (prev + 1) % QR_CHALLENGES.length);
  };

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    sounds.playStep();
    setSelectedOption(index);
  };

  const handleSubmitQuiz = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === question.correctAnswer;
    setIsSubmitted(true);
    setIsCorrect(correct);
    if (correct) {
      sounds.playBonus();
    } else {
      sounds.playPenalty();
    }
  };

  // 4. SCANNER STATE & REFS
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        requestAnimationFrame(tickScanner);
      }
    } catch {
      setCameraError('Kamera tidak dapat diakses atau izin ditolak. Silakan gunakan Tantangan Puzzle atau Kuis Digital!');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const tickScanner = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            sounds.playQrBeep();
            setScannedCode(code.data);
            stopCamera();
            if (isUrl(code.data)) {
              setActiveTab('web');
            } else {
              setActiveTab('matching');
            }
            return;
          }
        }
      }
    }
    if (cameraActive) {
      animationFrameRef.current = requestAnimationFrame(tickScanner);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const isUrl = (text: string) => {
    try {
      const u = new URL(text);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const openWeb = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-300 relative max-h-[94vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center mb-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>TANTANGAN QR KOTAK #{tileNumber}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 mt-1">
            {tileTitle}
          </h3>
          <p className="text-xs text-slate-500">
            Petualang: <strong className="text-slate-800">{playerName}</strong> &bull; Hadiah:{' '}
            <strong className="text-emerald-600">+10 Poin Edukasi</strong>
          </p>
        </div>

        {/* Tab Switcher: 5 Modes */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl mb-3 shrink-0 overflow-x-auto">
          <button
            onClick={() => {
              stopCamera();
              setActiveTab('matching');
            }}
            className={`flex-1 min-w-[100px] py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'matching' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>Mencocokkan</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('sequence');
            }}
            className={`flex-1 min-w-[100px] py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'sequence' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Susun Rute</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('quiz');
            }}
            className={`flex-1 min-w-[80px] py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'quiz' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Kuis Cepat</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('scanner');
              startCamera();
            }}
            className={`flex-1 min-w-[85px] py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'scanner' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Kamera</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('web');
            }}
            className={`flex-1 min-w-[80px] py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'web' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Buka Web</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {/* TAB 1: PUZZLE MENCOCOKKAN (MATCHING) */}
          {activeTab === 'matching' && (
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-heading font-extrabold text-purple-950">
                    {matchingChallenge.title}
                  </h4>
                  <p className="text-[11px] text-purple-800 mt-0.5 leading-snug">
                    {matchingChallenge.instruction}
                  </p>
                </div>
                <button
                  onClick={handleNextMatchingChallenge}
                  className="px-2.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Acak Puzzle</span>
                </button>
              </div>

              {wrongPairNotice && (
                <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{wrongPairNotice}</span>
                </div>
              )}

              {/* Matching Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Left Side: Organs / Terms */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase text-purple-900 block">
                    1. Pilih Organ / Istilah:
                  </span>
                  {matchingChallenge.pairs.map((p) => {
                    const isMatched = matchedPairIds.includes(p.id);
                    const isSelected = selectedLeftId === p.id;
                    return (
                      <button
                        key={p.id}
                        disabled={isMatched}
                        onClick={() => handleSelectLeft(p.id)}
                        className={`w-full p-3 rounded-2xl border-2 text-left text-xs font-extrabold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-90 shadow-2xs'
                            : isSelected
                            ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-[1.02] ring-2 ring-purple-300'
                            : 'bg-white hover:bg-purple-50/60 border-purple-200 text-slate-800 shadow-2xs'
                        }`}
                      >
                        <div>
                          <span>{p.left}</span>
                          {p.badge && (
                            <span
                              className={`block text-[10px] font-medium mt-0.5 ${
                                isSelected ? 'text-purple-100' : 'text-slate-500'
                              }`}
                            >
                              {p.badge}
                            </span>
                          )}
                        </div>
                        {isMatched ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : isSelected ? (
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-bold">
                            Terpilih
                          </span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-300" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Side: Functions / Roles */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase text-purple-900 block">
                    2. Cocokkan Fungsinya:
                  </span>
                  {shuffledRights.map((p) => {
                    const isMatched = matchedPairIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        disabled={isMatched || !selectedLeftId}
                        onClick={() => handleSelectRight(p.id)}
                        className={`w-full p-3 rounded-2xl border-2 text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2 min-h-[58px] ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold opacity-90 shadow-2xs'
                            : selectedLeftId
                            ? 'bg-white hover:bg-amber-50 border-amber-300 text-slate-800 shadow-2xs hover:scale-[1.01]'
                            : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span className="leading-snug">{p.right}</span>
                        {isMatched && (
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Success Result & Claim Points */}
              {isMatchingComplete && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-center space-y-2.5 animate-in zoom-in-95">
                  <div className="inline-flex p-2 bg-emerald-100 rounded-full text-emerald-700">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-heading font-extrabold text-emerald-950">
                    Luar Biasa! Semua Pasangan Cocok!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Kamu berhasil mencocokkan seluruh organ pencernaan dengan fungsinya secara tepat.
                  </p>
                  <button
                    onClick={() =>
                      onSuccess(10, `Berhasil menyelesaikan puzzle mencocokkan "${matchingChallenge.title}" (+10 poin)!`)
                    }
                    className="w-full py-3 bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-heading font-extrabold text-sm rounded-xl shadow-lg transition-transform active:scale-98 cursor-pointer"
                  >
                    🎉 KLAIM BONUS MISI QR (+10 POIN) &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PUZZLE SUSUN URUTAN (SEQUENCE) */}
          {activeTab === 'sequence' && (
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-heading font-extrabold text-indigo-950">
                    {sequenceChallenge.title}
                  </h4>
                  <p className="text-[11px] text-indigo-800 mt-0.5 leading-snug">
                    {sequenceChallenge.instruction}
                  </p>
                </div>
                <button
                  onClick={handleNextSequencePuzzle}
                  className="px-2.5 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Acak Puzzle</span>
                </button>
              </div>

              {/* Scrambled Order List */}
              <div className="space-y-2">
                {currentSequenceOrder.map((id, idx) => {
                  const item = sequenceChallenge.items.find((x) => x.id === id);
                  if (!item) return null;
                  return (
                    <div
                      key={id}
                      className="p-3 bg-white rounded-2xl border-2 border-indigo-200 flex items-center justify-between gap-2 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 font-extrabold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <h5 className="text-xs font-extrabold text-slate-800 truncate">{item.label}</h5>
                          <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                        </div>
                      </div>

                      {/* Up / Down Move Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          disabled={idx === 0 || isSequenceCorrect}
                          onClick={() => handleMoveSequenceItem(idx, 'up')}
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 disabled:opacity-30 disabled:hover:bg-indigo-50 text-indigo-700 cursor-pointer transition-colors"
                          title="Geser ke atas"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === currentSequenceOrder.length - 1 || isSequenceCorrect}
                          onClick={() => handleMoveSequenceItem(idx, 'down')}
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 disabled:opacity-30 disabled:hover:bg-indigo-50 text-indigo-700 cursor-pointer transition-colors"
                          title="Geser ke bawah"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Check Sequence Button */}
              {!isSequenceCorrect && (
                <button
                  onClick={handleCheckSequence}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-extrabold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-transform active:scale-98"
                >
                  ✓ PERIKSA KEBENARAN SUSUNAN RUTE
                </button>
              )}

              {/* Feedback */}
              {isSequenceChecked && !isSequenceCorrect && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Susunan rute belum tepat! Ingat perjalanan makanan dari awal masuk sampai akhir.</span>
                </div>
              )}

              {isSequenceCorrect && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
                  <div className="inline-flex p-2 bg-emerald-100 rounded-full text-emerald-700">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-heading font-extrabold text-emerald-950">
                    Susunan Tepat Sempurna!
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    {sequenceChallenge.explanation}
                  </p>
                  <button
                    onClick={() =>
                      onSuccess(10, `Berhasil menyelesaikan puzzle rute "${sequenceChallenge.title}" (+10 poin)!`)
                    }
                    className="w-full py-3 bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-heading font-extrabold text-sm rounded-xl shadow-lg transition-transform active:scale-98 cursor-pointer mt-2"
                  >
                    🎉 KLAIM BONUS MISI QR (+10 POIN) &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: KUIS PILIHAN GANDA (QUIZ) */}
          {activeTab === 'quiz' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase">
                    Pertanyaan #{question.id} dari {QR_CHALLENGES.length}
                  </h4>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 mt-1 leading-snug">
                    {question.question}
                  </p>
                </div>
                <button
                  onClick={handleNextRandomQuestion}
                  className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Soal Lain</span>
                </button>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {question.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isAnswer = question.correctAnswer === idx;
                  let btnStyle = 'bg-white hover:bg-amber-50/50 border-slate-200 text-slate-700';

                  if (isSubmitted) {
                    if (isAnswer) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-50 border-rose-500 text-rose-800 font-bold';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-3 rounded-xl border-2 text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold w-5">{String.fromCharCode(65 + idx)}.</span>
                        <span>{option}</span>
                      </div>
                      {isSubmitted && isAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Submit / Claim */}
              {!isSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmitQuiz}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:hover:bg-amber-500 text-white font-heading font-extrabold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-transform active:scale-98"
                >
                  KIRIM JAWABAN
                </button>
              ) : isCorrect ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-center animate-in zoom-in-95">
                  <h5 className="text-xs font-bold text-emerald-800 font-heading">Jawaban Benar! +10 Poin</h5>
                  <p className="text-[11px] text-emerald-950 font-medium">{question.explanation}</p>
                  <button
                    onClick={() =>
                      onSuccess(10, `Berhasil menjawab kuis QR Kotak #${tileNumber} secara benar (+10 poin)!`)
                    }
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    KLAIM +10 POIN &rarr;
                  </button>
                </div>
              ) : (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-2 text-center">
                  <h5 className="text-xs font-bold text-rose-800 font-heading">Jawaban Belum Tepat</h5>
                  <p className="text-[11px] text-slate-700">{question.explanation}</p>
                  <button
                    onClick={handleNextRandomQuestion}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Coba Pertanyaan Lain
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SCANNER KAMERA */}
          {activeTab === 'scanner' && (
            <div className="text-center mb-4">
              <div className="relative aspect-video max-w-sm mx-auto bg-black rounded-2xl overflow-hidden flex items-center justify-center border-2 border-slate-300">
                <video ref={videoRef} className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />

                {!cameraActive && !cameraError && (
                  <div className="p-4 text-white text-xs">
                    <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-amber-400" />
                    <span>Mengaktifkan kamera...</span>
                  </div>
                )}

                {cameraError && (
                  <div className="p-4 text-rose-200 text-xs flex flex-col items-center">
                    <AlertCircle className="w-6 h-6 mb-2 text-rose-400" />
                    <span>{cameraError}</span>
                  </div>
                )}

                {cameraActive && (
                  <div className="absolute inset-8 border-2 border-dashed border-amber-400 rounded-xl pointer-events-none animate-pulse" />
                )}
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Arahkan kamera ke kode QR Kotak {tileNumber} pada papan cetak fisik atau kartu.
              </p>

              <button
                onClick={() => {
                  stopCamera();
                  setActiveTab('matching');
                }}
                className="mt-3 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Gunakan Tantangan Puzzle Digital Saja
              </button>
            </div>
          )}

          {/* TAB 5: WEB EDUKASI */}
          {activeTab === 'web' && (
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200">
                <h4 className="text-xs font-bold text-sky-900 uppercase flex items-center gap-1.5 mb-1">
                  <Globe className="w-4 h-4 text-sky-600" />
                  <span>Tautan Materi Web & Video Pembelajaran:</span>
                </h4>
                <p className="text-xs text-slate-600">
                  Klik tautan di bawah ini untuk membuka video edukasi animasi atau referensi materi kurikulum:
                </p>
              </div>

              <div className="space-y-2">
                {EDUCATIONAL_WEB_LINKS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-sky-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => openWeb(item.url)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto shadow-xs"
                    >
                      <span>Buka Web</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {scannedCode && isUrl(scannedCode) && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1">
                    Web dari Hasil Pindai QR:
                  </span>
                  <p className="text-xs font-mono text-emerald-950 truncate mb-2">{scannedCode}</p>
                  <button
                    onClick={() => openWeb(scannedCode)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Buka Alamat Web Hasil Scan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
