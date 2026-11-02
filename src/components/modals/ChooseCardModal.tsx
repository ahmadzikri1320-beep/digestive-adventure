/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, GameCard } from '../../types/game';
import { ORGAN_CARDS, MYSTERY_CARDS, TRAP_CARDS } from '../../data/cardsData';
import { sounds } from '../../utils/soundEffects';
import { Layers, HelpCircle, AlertTriangle, Coins, Check, X, Sparkles, ShieldCheck, ArrowRight, Dices, Lock } from 'lucide-react';

interface ChooseCardModalProps {
  player: Player;
  allPlayers?: Player[];
  usedMysteryCardIds?: string[];
  usedTrapCardIds?: string[];
  onPickOrgan: (organKey: string) => void;
  onPickMystery: (card: GameCard) => void;
  onPickTrap: (card: GameCard) => void;
  onSellOrgan: (organKey: string) => void;
  onClose: () => void;
}

export const ChooseCardModal: React.FC<ChooseCardModalProps> = ({
  player,
  allPlayers = [],
  usedMysteryCardIds = [],
  usedTrapCardIds = [],
  onPickOrgan,
  onPickMystery,
  onPickTrap,
  onSellOrgan,
  onClose,
}) => {
  // 3 distinct color categories
  const [activeTab, setActiveTab] = useState<'organ' | 'mystery' | 'trap'>('organ');
  const [showSellDrawer, setShowSellDrawer] = useState<boolean>(false);

  const allOrganKeys = Object.keys(ORGAN_CARDS);

  // Exclusive Organ Ownership: Map each organ key to the player who owns it
  const claimedOrganOwners: Record<string, { id: string; name: string }> = {};
  allPlayers.forEach((p) => {
    p.organCards.forEach((k) => {
      claimedOrganOwners[k] = { id: p.id, name: p.name };
    });
  });

  const availableOrgans = allOrganKeys.filter((k) => !claimedOrganOwners[k]);
  const availableMystery = MYSTERY_CARDS.filter((c) => !usedMysteryCardIds.includes(c.id));
  const availableTrap = TRAP_CARDS.filter((c) => !usedTrapCardIds.includes(c.id));

  // Deck-specific random pickers drawing only from remaining unused/unclaimed cards
  const handlePickRandomOrgan = () => {
    sounds.playCardFlip();
    if (availableOrgans.length === 0) return;
    const randomKey = availableOrgans[Math.floor(Math.random() * availableOrgans.length)];
    onPickOrgan(randomKey);
  };

  const handlePickRandomMystery = () => {
    sounds.playCardFlip();
    const pool = availableMystery.length > 0 ? availableMystery : MYSTERY_CARDS;
    const randomCard = pool[Math.floor(Math.random() * pool.length)];
    onPickMystery(randomCard);
  };

  const handlePickRandomTrap = () => {
    sounds.playCardFlip();
    const pool = availableTrap.length > 0 ? availableTrap : TRAP_CARDS;
    const randomCard = pool[Math.floor(Math.random() * pool.length)];
    onPickTrap(randomCard);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border-4 border-amber-300 relative max-h-[94vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="text-center mb-3 shrink-0">
          <span className="text-[11px] font-extrabold tracking-wider uppercase bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>KOTAK 06: PILIH KARTU BEBAS</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 mt-1">
            Pilih Kartu Sesuai Keinginanmu!
          </h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto mt-0.5">
            Pilihlah salah satu dari 3 kategori kartu di bawah: <strong className="text-rose-600">Kartu Organ (Merah)</strong>, <strong className="text-purple-600">Kartu Mystery (Ungu)</strong>, atau <strong className="text-blue-600">Kartu Jebakan (Biru)</strong>.
          </p>
        </div>

        {/* 3 Explicit Deck Tabs: Red (Organ), Purple (Mystery), Blue (Trap) */}
        <div className="grid grid-cols-3 gap-2 mb-3 shrink-0">
          {/* TAB 1: KARTU ORGAN (MERAH) */}
          <button
            onClick={() => {
              sounds.playButton();
              setActiveTab('organ');
            }}
            className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 ${
              activeTab === 'organ'
                ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-400 scale-[1.02]'
                : 'bg-rose-50/70 text-rose-800 border-rose-200 hover:bg-rose-100 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
              <Layers className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-heading font-black tracking-wide">ORGAN</span>
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              activeTab === 'organ' ? 'bg-white/20 text-white' : 'bg-rose-200/80 text-rose-900'
            }`}>
              WARNA MERAH ({availableOrgans.length} Tersedia)
            </span>
          </button>

          {/* TAB 2: KARTU MYSTERY (UNGU) */}
          <button
            onClick={() => {
              sounds.playButton();
              setActiveTab('mystery');
            }}
            className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 ${
              activeTab === 'mystery'
                ? 'bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-400 scale-[1.02]'
                : 'bg-purple-50/70 text-purple-800 border-purple-200 hover:bg-purple-100 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
              <HelpCircle className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-heading font-black tracking-wide">MYSTERY</span>
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              activeTab === 'mystery' ? 'bg-white/20 text-white' : 'bg-purple-200/80 text-purple-900'
            }`}>
              WARNA UNGU ({availableMystery.length} Tersisa)
            </span>
          </button>

          {/* TAB 3: KARTU JEBAKAN (BIRU) */}
          <button
            onClick={() => {
              sounds.playButton();
              setActiveTab('trap');
            }}
            className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 ${
              activeTab === 'trap'
                ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400 scale-[1.02]'
                : 'bg-blue-50/70 text-blue-800 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-heading font-black tracking-wide">JEBAKAN</span>
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              activeTab === 'trap' ? 'bg-white/20 text-white' : 'bg-blue-200/80 text-blue-900'
            }`}>
              WARNA BIRU ({availableTrap.length} Tersisa)
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* TAB 1: KARTU ORGAN (WARNA MERAH) */}
          {activeTab === 'organ' && (
            <div className="space-y-3">
              {/* Deck Info Banner & Deck-Specific Random Picker */}
              <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <h4 className="text-xs sm:text-sm font-heading font-extrabold text-rose-950 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span>Koleksi Kartu Organ Pencernaan (Warna Merah)</span>
                  </h4>
                  <p className="text-[11px] text-rose-800 mt-0.5">
                    Setiap organ hanya dapat dimiliki oleh <strong>1 petualang pertama</strong>. Kartu diakumulasi menjadi <strong>+10 Poin saat Finish</strong>!
                  </p>
                </div>
                <button
                  disabled={availableOrgans.length === 0}
                  onClick={handlePickRandomOrgan}
                  className={`px-3 py-1.5 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-transform shrink-0 ${
                    availableOrgans.length === 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer active:scale-95'
                  }`}
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>
                    {availableOrgans.length > 0
                      ? `Ambil Acak (${availableOrgans.length} Tersedia)`
                      : 'Semua Organ Sudah Dimiliki'}
                  </span>
                </button>
              </div>

              {/* 8 Organ Cards Grid with Exclusive Ownership Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {allOrganKeys.map((key) => {
                  const organ = ORGAN_CARDS[key];
                  const owner = claimedOrganOwners[key];
                  const isOwnedByMe = owner?.id === player.id;
                  const isOwnedByOther = Boolean(owner && owner.id !== player.id);
                  const isAvailable = !owner;

                  return (
                    <button
                      key={key}
                      disabled={!isAvailable}
                      onClick={() => {
                        if (!isAvailable) return;
                        sounds.playBonus();
                        onPickOrgan(key);
                      }}
                      className={`p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-between min-h-[148px] relative ${
                        isOwnedByMe
                          ? 'bg-emerald-50/70 border-emerald-300 cursor-default shadow-xs'
                          : isOwnedByOther
                          ? 'bg-slate-100/80 border-slate-300 opacity-60 grayscale-40 cursor-not-allowed'
                          : 'bg-white border-rose-200 hover:border-rose-500 hover:bg-rose-50/50 cursor-pointer shadow-xs group'
                      }`}
                    >
                      <div className="w-full flex justify-center mb-1">
                        {isOwnedByMe ? (
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Milikmu (+10 Poin)
                          </span>
                        ) : isOwnedByOther ? (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Milik {owner.name}</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                            Tersedia (+10)
                          </span>
                        )}
                      </div>

                      <img
                        src={organ.image}
                        alt={organ.title}
                        className={`w-14 h-14 object-contain mx-auto my-0.5 ${isAvailable ? 'group-hover:scale-108 transition-transform' : ''}`}
                        referrerPolicy="no-referrer"
                      />

                      <span className={`text-xs font-heading font-extrabold block truncate w-full ${isOwnedByOther ? 'text-slate-600 line-through' : 'text-slate-800'}`}>
                        {organ.title}
                      </span>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {organ.subtitle}
                      </span>

                      <div className="w-full mt-2 pt-1 border-t border-rose-100">
                        {isOwnedByMe ? (
                          <span className="text-[10px] text-emerald-700 font-extrabold flex items-center justify-center gap-0.5">
                            <Check className="w-3 h-3" /> Di Inventaris
                          </span>
                        ) : isOwnedByOther ? (
                          <span className="text-[10px] text-slate-500 font-extrabold flex items-center justify-center gap-0.5">
                            <Lock className="w-3 h-3 text-slate-400" /> Eksklusif
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-600 font-extrabold block group-hover:text-rose-700">
                            + Ambil Kartu
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: KARTU MYSTERY (WARNA UNGU) */}
          {activeTab === 'mystery' && (
            <div className="space-y-3">
              {/* Deck Info Banner & Deck-Specific Random Picker */}
              <div className="p-3 bg-purple-50 border-2 border-purple-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <h4 className="text-xs sm:text-sm font-heading font-extrabold text-purple-950 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-purple-500" />
                    <span>Tumpukan Kartu Mystery (Warna Ungu)</span>
                  </h4>
                  <p className="text-[11px] text-purple-800 mt-0.5">
                    Pilih 1 kartu misteri untuk langsung membuka dan menjalankan perintahnya.
                  </p>
                </div>
                <button
                  onClick={handlePickRandomMystery}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shrink-0"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>Ambil Acak ({availableMystery.length} Tersisa dari {MYSTERY_CARDS.length})</span>
                </button>
              </div>

              {/* Mystery Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MYSTERY_CARDS.map((card) => {
                  const isUsed = usedMysteryCardIds.includes(card.id);
                  return (
                    <button
                      key={card.id}
                      disabled={isUsed}
                      onClick={() => {
                        if (isUsed) return;
                        sounds.playCardFlip();
                        onPickMystery(card);
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-3 relative ${
                        isUsed
                          ? 'bg-slate-100/90 border-slate-300 opacity-55 grayscale-40 cursor-not-allowed'
                          : 'bg-white hover:bg-purple-50/70 border-purple-200 hover:border-purple-500 cursor-pointer shadow-xs group'
                      }`}
                    >
                      <div className={`w-14 h-16 rounded-xl overflow-hidden border shrink-0 flex items-center justify-center p-0.5 ${
                        isUsed ? 'border-slate-300 bg-slate-200/60' : 'border-purple-200 bg-purple-50'
                      }`}>
                        <img
                          src={card.image}
                          alt={card.title}
                          className={`w-full h-full object-contain ${!isUsed ? 'group-hover:scale-105 transition-transform' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full border ${
                            isUsed
                              ? 'bg-slate-200 text-slate-600 border-slate-300'
                              : 'bg-purple-100 text-purple-800 border-purple-200'
                          }`}>
                            Mystery Ungu
                          </span>
                          {card.effectType === 'saver' && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" /> Penyelamat
                            </span>
                          )}
                          {isUsed && (
                            <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.2 rounded-md">
                              Sudah Keluar
                            </span>
                          )}
                        </div>
                        <h5 className={`text-xs sm:text-sm font-heading font-extrabold truncate mt-1 ${
                          isUsed ? 'text-slate-600 line-through' : 'text-purple-950'
                        }`}>
                          {card.title}
                        </h5>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug mt-0.5">
                          {card.instruction}
                        </p>
                        {isUsed ? (
                          <span className="text-[10px] text-slate-500 font-extrabold inline-flex items-center gap-1 mt-1.5">
                            <Check className="w-3 h-3 text-slate-400" />
                            <span>Sudah Terpakai / Keluar</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-purple-600 font-extrabold inline-flex items-center gap-1 mt-1.5 group-hover:text-purple-800">
                            <span>Pilih & Jalankan</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: KARTU JEBAKAN (WARNA BIRU) */}
          {activeTab === 'trap' && (
            <div className="space-y-3">
              {/* Deck Info Banner & Deck-Specific Random Picker */}
              <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <h4 className="text-xs sm:text-sm font-heading font-extrabold text-blue-950 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Tumpukan Kartu Jebakan (Warna Biru)</span>
                  </h4>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    Pilih 1 kartu jebakan untuk menghadapi tantangan sistem pencernaan.
                  </p>
                </div>
                <button
                  onClick={handlePickRandomTrap}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shrink-0"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>Ambil Acak ({availableTrap.length} Tersisa dari {TRAP_CARDS.length})</span>
                </button>
              </div>

              {/* Trap Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TRAP_CARDS.map((card) => {
                  const isUsed = usedTrapCardIds.includes(card.id);
                  return (
                    <button
                      key={card.id}
                      disabled={isUsed}
                      onClick={() => {
                        if (isUsed) return;
                        sounds.playCardFlip();
                        onPickTrap(card);
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-3 relative ${
                        isUsed
                          ? 'bg-slate-100/90 border-slate-300 opacity-55 grayscale-40 cursor-not-allowed'
                          : 'bg-white hover:bg-blue-50/70 border-blue-200 hover:border-blue-500 cursor-pointer shadow-xs group'
                      }`}
                    >
                      <div className={`w-14 h-16 rounded-xl overflow-hidden border shrink-0 flex items-center justify-center p-0.5 ${
                        isUsed ? 'border-slate-300 bg-slate-200/60' : 'border-blue-200 bg-blue-50'
                      }`}>
                        <img
                          src={card.image}
                          alt={card.title}
                          className={`w-full h-full object-contain ${!isUsed ? 'group-hover:scale-105 transition-transform' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full border ${
                            isUsed
                              ? 'bg-slate-200 text-slate-600 border-slate-300'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            Jebakan Biru
                          </span>
                          {isUsed && (
                            <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.2 rounded-md">
                              Sudah Keluar
                            </span>
                          )}
                        </div>
                        <h5 className={`text-xs sm:text-sm font-heading font-extrabold truncate mt-1 ${
                          isUsed ? 'text-slate-600 line-through' : 'text-blue-950'
                        }`}>
                          {card.title}
                        </h5>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug mt-0.5">
                          {card.instruction}
                        </p>
                        {isUsed ? (
                          <span className="text-[10px] text-slate-500 font-extrabold inline-flex items-center gap-1 mt-1.5">
                            <Check className="w-3 h-3 text-slate-400" />
                            <span>Sudah Terpakai / Keluar</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-blue-600 font-extrabold inline-flex items-center gap-1 mt-1.5 group-hover:text-blue-800">
                            <span>Hadapi Tantangan</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DEDICATED SEPARATE DRAWER: JUAL KARTU ORGAN (+5 POIN) */}
          <div className="mt-4 pt-3 border-t-2 border-slate-200">
            <button
              onClick={() => setShowSellDrawer(!showSellDrawer)}
              className="w-full p-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-2xl flex items-center justify-between text-slate-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-heading font-extrabold">
                  Opsi Jual Kartu Organ Milikmu (+5 Poin per kartu)
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                  Milikmu: {player.organCards.length}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {showSellDrawer ? 'Tutup ▲' : 'Buka ▼'}
              </span>
            </button>

            {showSellDrawer && (
              <div className="mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                {player.organCards.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-2">
                    Kamu belum memiliki kartu organ yang dapat dijual.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {player.organCards.map((key) => {
                      const organ = ORGAN_CARDS[key];
                      if (!organ) return null;
                      return (
                        <div
                          key={key}
                          className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={organ.image}
                              alt={organ.title}
                              className="w-7 h-7 object-contain rounded-md"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">{organ.title}</span>
                              <span className="text-[10px] text-slate-500">{organ.subtitle}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              sounds.playBonus();
                              onSellOrgan(key);
                            }}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                          >
                            Jual (+5 Poin)
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Done / Close Button */}
        <div className="pt-3 border-t border-slate-100 mt-2 shrink-0">
          <button
            onClick={() => {
              sounds.playButton();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-heading font-bold text-xs sm:text-sm tracking-wide shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>TUTUP & SELESAIKAN GILIRAN</span>
          </button>
        </div>

        {/* Close Button in corner */}
        <button
          onClick={() => {
            sounds.playButton();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
