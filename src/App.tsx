/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Player, GameView, BoardTile, GameCard, ActivityLogItem, FloatingPointItem, PawnColor } from './types/game';
import { BOARD_TILES } from './data/tilesData';
import { ORGAN_CARDS, MYSTERY_CARDS, TRAP_CARDS } from './data/cardsData';
import { sounds } from './utils/soundEffects';
import { fireVictoryConfetti, fireMiniConfetti } from './utils/confetti';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameActionConsole } from './components/GameActionConsole';
import { PlayerSetupModal } from './components/PlayerSetupModal';
import { PlayerRosterPanel } from './components/PlayerRosterPanel';
import { ActivityLogPanel } from './components/ActivityLogPanel';
import { CardModal } from './components/modals/CardModal';
import { MysteryCardModal } from './components/modals/MysteryCardModal';
import { TrapCardModal } from './components/modals/TrapCardModal';
import { QrChallengeModal } from './components/modals/QrChallengeModal';
import { SecretCodeModal } from './components/modals/SecretCodeModal';
import { FinalMissionModal } from './components/modals/FinalMissionModal';
import { FinishModal } from './components/modals/FinishModal';
import { WaterAndWasteModal } from './components/modals/WaterAndWasteModal';
import { ChooseCardModal } from './components/modals/ChooseCardModal';
import { RulebookModal } from './components/modals/RulebookModal';
import { OrganGuideModal } from './components/modals/OrganGuideModal';
import { GameSummaryModal } from './components/modals/GameSummaryModal';
import { ResetConfirmModal } from './components/modals/ResetConfirmModal';
import { MusicSelectorModal } from './components/modals/MusicSelectorModal';
import { ShieldAlert, LayoutGrid, Users, ScrollText, Sparkles } from 'lucide-react';
import { PawnAvatar } from './components/PawnAvatar';
import { MobileTileInfoSheet } from './components/MobileTileInfoSheet';
import { FloatingPointsOverlay } from './components/FloatingPointsOverlay';

export default function App() {
  // Game View State
  const [view, setView] = useState<GameView>('WELCOME');
  const [mobileTab, setMobileTab] = useState<'board' | 'roster' | 'logs'>('board');
  const [showMobileTileSheet, setShowMobileTileSheet] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);

  // Players State with Ref Sync to eliminate closure staleness
  const [players, setPlayers] = useState<Player[]>([]);
  const playersRef = useRef<Player[]>([]);
  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  const updatePlayersState = (updater: Player[] | ((prev: Player[]) => Player[])) => {
    setPlayers((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      playersRef.current = next;
      return next;
    });
  };

  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [finishCounter, setFinishCounter] = useState<number>(0);

  // Board & Movement State
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.isMuted());
  const [isBgmOn, setIsBgmOn] = useState<boolean>(() => sounds.isBgmOn());

  React.useEffect(() => {
    return sounds.subscribe(() => {
      setIsMuted(sounds.isMuted());
      setIsBgmOn(sounds.isBgmOn());
    });
  }, []);

  // Fullscreen State & Change Listener
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    return Boolean(
      typeof document !== 'undefined' &&
      (document.fullscreenElement || (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement)
    );
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Fullscreen Toggle Handler (Seamless for both Native and CSS Fullscreen)
  const toggleFullscreen = async () => {
    sounds.playCardFlip();
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => Promise<void>;
    };

    if (isFullscreen || Boolean(doc.fullscreenElement || doc.webkitFullscreenElement)) {
      // EXIT FULLSCREEN
      setIsFullscreen(false);
      try {
        if (doc.fullscreenElement && doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      } catch (err) {
        // Safe to ignore fallback
      }
    } else {
      // ENTER FULLSCREEN
      setIsFullscreen(true);
      try {
        const boardEl = document.getElementById('game-board-container') || document.documentElement;
        const targetEl = boardEl as unknown as {
          requestFullscreen?: () => Promise<void>;
          webkitRequestFullscreen?: () => Promise<void>;
        };
        if (targetEl.requestFullscreen) {
          await targetEl.requestFullscreen();
        } else if (targetEl.webkitRequestFullscreen) {
          await targetEl.webkitRequestFullscreen();
        }
      } catch (err) {
        // In iframe or sandbox where native fullscreen is blocked, CSS fullscreen is active!
      }
    }
  };

  // Keyboard Escape listener to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        const doc = document as unknown as {
          fullscreenElement?: Element;
          exitFullscreen?: () => Promise<void>;
        };
        if (doc.fullscreenElement && doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Activity Log
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);

  // Active Modals State
  const [showRules, setShowRules] = useState(false);
  const [showOrganGuide, setShowOrganGuide] = useState(false);
  const [activeOrganCard, setActiveOrganCard] = useState<{
    card: GameCard;
    canSell: boolean;
    isInspectOnly?: boolean;
    isFromLanding?: boolean;
    ownerName?: string;
    isAlreadyClaimedByOther?: boolean;
  } | null>(null);
  const [hasRolledThisTurn, setHasRolledThisTurn] = useState<boolean>(false);
  const [activeMysteryCard, setActiveMysteryCard] = useState<GameCard | null>(null);
  const [activeTrapCard, setActiveTrapCard] = useState<GameCard | null>(null);
  const [activeQrTile, setActiveQrTile] = useState<{ number: number; title: string } | null>(null);
  const [showSecretCode, setShowSecretCode] = useState(false);
  const [showFinalMission, setShowFinalMission] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showChooseCardModal, setShowChooseCardModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState<{
    rank: number;
    bonus: number;
    organBonusPoints: number;
    organCards: string[];
    totalBonusPoints: number;
  } | null>(null);
  const [penaltyDialog, setPenaltyDialog] = useState<{
    amount: number;
    title: string;
    reason: string;
  } | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Deck Management without replacement (once drawn/used, not drawn again until full deck is exhausted)
  const [usedMysteryCardIds, setUsedMysteryCardIds] = useState<string[]>([]);
  const [usedTrapCardIds, setUsedTrapCardIds] = useState<string[]>([]);

  // Draw a random Mystery Card without replacement
  const drawRandomMysteryCard = (): GameCard => {
    const unused = MYSTERY_CARDS.filter((c) => !usedMysteryCardIds.includes(c.id));
    let pool = unused;
    let nextUsed = [...usedMysteryCardIds];
    if (pool.length === 0) {
      // All 8 cards have been used: reshuffle all 8 cards for infinite replayability
      pool = MYSTERY_CARDS;
      nextUsed = [];
      addLog('Sistem', 'purple', '🔀 Semua 8 Kartu Mystery telah keluar! Tumpukan kartu dikocok ulang kembali.');
    }
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setUsedMysteryCardIds([...nextUsed, picked.id]);
    return picked;
  };

  // Draw a random Trap Card without replacement
  const drawRandomTrapCard = (): GameCard => {
    const unused = TRAP_CARDS.filter((c) => !usedTrapCardIds.includes(c.id));
    let pool = unused;
    let nextUsed = [...usedTrapCardIds];
    if (pool.length === 0) {
      // All 8 cards have been used: reshuffle all 8 cards for infinite replayability
      pool = TRAP_CARDS;
      nextUsed = [];
      addLog('Sistem', 'blue', '🔀 Semua 8 Kartu Jebakan telah keluar! Tumpukan kartu dikocok ulang kembali.');
    }
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setUsedTrapCardIds([...nextUsed, picked.id]);
    return picked;
  };

  // Floating Points Animation State (+10, -5, etc)
  const [floatingPoints, setFloatingPoints] = useState<FloatingPointItem[]>([]);

  // Trigger floating point badge directly over player avatar and active stats
  const triggerFloatingPoint = (playerId: string, tileId: number, delta: number) => {
    if (!delta || delta === 0) return;
    const id = `fp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setFloatingPoints((prev) => [
      ...prev,
      { id, playerId, tileId, points: delta, createdAt: Date.now() },
    ]);
    setTimeout(() => {
      setFloatingPoints((prev) => prev.filter((item) => item.id !== id));
    }, 2800);
  };

  // Helper to add log and trigger floating point badge if points changed
  const addLog = (playerName: string, pawnColor: Player['pawnColor'], action: string, pointsDelta?: number) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: time,
        playerName,
        pawnColor,
        action,
        pointsDelta,
      },
      ...prev,
    ]);

    if (pointsDelta && pointsDelta !== 0) {
      const matched = playersRef.current.find((p) => p.name === playerName);
      if (matched) {
        triggerFloatingPoint(matched.id, matched.position, pointsDelta);
      }
    }
  };

  // Sound mute toggle
  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  };

  // Start new game from setup
  const handleStartGame = (initialPlayers: Player[]) => {
    updatePlayersState(initialPlayers);
    setActivePlayerIndex(0);
    setFinishCounter(0);
    setLastRoll(null);
    setSelectedTileId(1);
    setUsedMysteryCardIds([]);
    setUsedTrapCardIds([]);
    setView('PLAYING');
    setLogs([]);
    sounds.startBgm();
    addLog(
      'Sistem',
      'red',
      `Petualangan dimulai dengan ${initialPlayers.length} petualang! Masing-masing modal 30 poin.`
    );
  };

  // Reset entire game
  const handleResetGame = () => {
    sounds.pauseBgm();
    setShowResetConfirmModal(false);
    setIsMoving(false);
    setHasRolledThisTurn(false);
    setSelectedTileId(1);
    setLastRoll(null);
    setActiveOrganCard(null);
    setActiveMysteryCard(null);
    setActiveTrapCard(null);
    setActiveQrTile(null);
    setShowRules(false);
    setShowOrganGuide(false);
    setShowFinishModal(null);
    setShowSecretCode(false);
    setShowFinalMission(false);
    setShowWaterModal(false);
    setShowChooseCardModal(false);
    setPenaltyDialog(null);
    setFloatingPoints([]);
    setView('WELCOME');
    updatePlayersState([]);
    setActivePlayerIndex(0);
    setFinishCounter(0);
    setUsedMysteryCardIds([]);
    setUsedTrapCardIds([]);
    setLogs([]);
  };

  // Next Turn Handler (Always operates on current players list)
  const advanceToNextTurn = (customPlayers?: Player[]) => {
    setHasRolledThisTurn(false);
    const currentList = customPlayers || playersRef.current;
    if (currentList.length === 0) return;

    // Check if everyone has finished
    const allFinished = currentList.every((p) => p.hasFinished);
    if (allFinished) {
      setView('SUMMARY');
      return;
    }

    // Find next player who has not finished
    let nextIdx = (activePlayerIndex + 1) % currentList.length;
    let loopCount = 0;
    while (currentList[nextIdx].hasFinished && loopCount < currentList.length) {
      nextIdx = (nextIdx + 1) % currentList.length;
      loopCount++;
    }

    setActivePlayerIndex(nextIdx);
    if (currentList[nextIdx]) {
      setSelectedTileId(currentList[nextIdx].position);
    }
  };

  // Manual Step Adjuster for Teachers/Students (+1 / -1)
  const handleStepAdjust = (delta: number) => {
    const currentList = playersRef.current;
    const player = currentList[activePlayerIndex];
    if (!player || player.hasFinished || isMoving) return;

    let nextPos = player.position + delta;
    if (!player.hasCompletedFinalMission && nextPos >= 27) {
      nextPos = 27;
    } else {
      nextPos = Math.max(1, Math.min(28, nextPos));
    }
    if (nextPos === player.position) return;

    const updated = currentList.map((p, idx) =>
      idx === activePlayerIndex ? { ...p, position: nextPos } : p
    );
    updatePlayersState(updated);
    setSelectedTileId(nextPos);
    addLog(player.name, player.pawnColor, `Koreksi posisi pion ke Kotak #${nextPos}.`);
    handleTileLanding(nextPos);
  };

  // Check if any interactive card/challenge modal is currently open
  const isAnyModalActive = Boolean(
    activeOrganCard ||
    activeMysteryCard ||
    activeTrapCard ||
    activeQrTile ||
    showSecretCode ||
    showFinalMission ||
    showWaterModal ||
    showChooseCardModal ||
    penaltyDialog ||
    showFinishModal
  );

  // Step-by-step pawn movement with Final Mission (Kotak 27) strict stop
  const handleRollDice = (diceValue: number) => {
    if (isMoving || hasRolledThisTurn || isAnyModalActive) return;
    setHasRolledThisTurn(true);
    const player = playersRef.current[activePlayerIndex];
    if (!player) return;

    if (player.hasFinished) {
      advanceToNextTurn();
      return;
    }

    // If player has skipped turn flag
    if (player.skipNextTurn) {
      sounds.playPenalty();
      addLog(player.name, player.pawnColor, 'Masih sakit perut dan melewati giliran ini!');
      const updated = playersRef.current.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, skipNextTurn: false } : p
      );
      updatePlayersState(updated);
      advanceToNextTurn(updated);
      return;
    }

    // Player at Kotak 27 who hasn't finished Final Mission must complete it first
    if (player.position === 27 && !player.hasCompletedFinalMission) {
      sounds.playPenalty();
      addLog(
        player.name,
        player.pawnColor,
        'Kamu berada di Kotak 27! Wajib selesaikan Final Mission (gerakan organ) sebelum bisa melangkah ke Finish.'
      );
      setShowFinalMission(true);
      return;
    }

    // FINAL MISSION OVERSHOOT RULE:
    // If player has NOT completed Final Mission:
    // - If dice does NOT exceed Kotak 27 (player.position + diceValue <= 27), the player CAN WALK!
    //   (e.g., at Kotak 25, rolls 1 -> moves to Kotak 26; rolls 2 -> reaches Kotak 27 Final Mission)
    // - But if the dice OVERSHOOTS / exceeds Kotak 27 (player.position + diceValue > 27),
    //   the player STAYS IN PLACE (diam di tempat)!
    if (!player.hasCompletedFinalMission && player.position + diceValue > 27) {
      setLastRoll(diceValue);
      sounds.playPenalty();
      const remainingDistance = 27 - player.position;
      addLog(
        player.name,
        player.pawnColor,
        `Dadu keluar angka ${diceValue}. Melebihi Kotak 27 Final Mission (sisa jarak: ${remainingDistance} langkah). Angka dadu berlebih, pion diam di tempat!`
      );
      advanceToNextTurn();
      return;
    }

    setIsMoving(true);
    setLastRoll(diceValue);

    // Play unique character start acoustic fanfare
    sounds.playCharacterStart(player.pawnColor);
    addLog(player.name, player.pawnColor, `Melempar dadu dan mendapatkan angka ${diceValue}.`);

    let currentPos = player.position;
    let remainingSteps = diceValue;

    // Safety timeout to prevent isMoving from ever freezing
    const safetyTimer = setTimeout(() => {
      setIsMoving(false);
    }, (diceValue + 2) * 600);

    const stepInterval = setInterval(() => {
      remainingSteps--;
      currentPos = currentPos + 1;

      // STRICT RULES FOR MOVEMENT:
      // 1. If player has NOT completed Final Mission, they MUST STOP AT KOTAK 27!
      // 2. If player reaches Kotak 28, they land on FINISH and stop (never wrap around)!
      let shouldStop = false;
      if (!player.hasCompletedFinalMission && currentPos >= 27) {
        currentPos = 27;
        shouldStop = true;
      } else if (currentPos >= 28) {
        currentPos = 28;
        shouldStop = true;
      }

      // Play unique character hop SFX with step progression
      sounds.playCharacterStep(player.pawnColor, diceValue - remainingSteps);

      // Update player position on this hop
      updatePlayersState((prev) =>
        prev.map((p, idx) => (idx === activePlayerIndex ? { ...p, position: currentPos } : p))
      );
      setSelectedTileId(currentPos);

      if (remainingSteps === 0 || shouldStop) {
        clearInterval(stepInterval);
        clearTimeout(safetyTimer);

        if (shouldStop && currentPos === 27 && remainingSteps > 0 && !player.hasCompletedFinalMission) {
          addLog(
            player.name,
            player.pawnColor,
            'Tiba di Kotak 27! Dadu berhenti di sini untuk menyelesaikan Final Mission wajib sebelum Finish.'
          );
        }

        setTimeout(() => {
          setIsMoving(false);
          handleTileLanding(currentPos);
        }, 280);
      }
    }, 320);
  };

  // Process Tile Action when pawn stops
  const handleTileLanding = (tileId: number) => {
    const currentPlayers = playersRef.current;
    const player = currentPlayers[activePlayerIndex];
    if (!player) return;
    const tile = BOARD_TILES[tileId - 1];

    addLog(player.name, player.pawnColor, `Tiba di Kotak #${tileId} (${tile.name}: ${tile.subtitle}).`);

    // Handle Finish Tile (Kotak 28)
    if (tileId === 28) {
      if (!player.hasCompletedFinalMission) {
        sounds.playPenalty();
        addLog(
          player.name,
          player.pawnColor,
          'Mencapai Finish tetapi belum menyelesaikan Final Mission di Kotak 27! Pion tetap di Kotak 27.'
        );
        const updated = currentPlayers.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, position: 27 } : p
        );
        updatePlayersState(updated);
        setSelectedTileId(27);
        setShowFinalMission(true);
        return;
      }

      // Player successfully finishes!
      sounds.playVictory();
      fireVictoryConfetti();
      const newRank = finishCounter + 1;
      setFinishCounter(newRank);

      let rankBonus = 0;
      if (newRank === 1) rankBonus = 50;
      else if (newRank === 2) rankBonus = 30;
      else if (newRank === 3) rankBonus = 10;

      // Accumulate points from stored organ cards in inventory (+10 points per card)
      const organCount = player.organCards.length;
      let organBonus = organCount * 10;
      if (organCount === 8) {
        organBonus += 20; // Complete digestive system bonus
      }
      const totalFinishBonus = rankBonus + organBonus;

      const updatedPlayers = currentPlayers.map((p, idx) =>
        idx === activePlayerIndex
          ? {
              ...p,
              position: 28,
              points: p.points + totalFinishBonus,
              hasFinished: true,
              finishRank: newRank,
            }
          : p
      );
      updatePlayersState(updatedPlayers);
      addLog(
        player.name,
        player.pawnColor,
        `FINISH! Juara ke-${newRank} (+${rankBonus} poin) & Akumulasi ${organCount} Kartu Organ (+${organBonus} poin)! Total bonus +${totalFinishBonus} poin!`,
        totalFinishBonus
      );
      setShowFinishModal({
        rank: newRank,
        bonus: rankBonus,
        organBonusPoints: organBonus,
        organCards: [...player.organCards],
        totalBonusPoints: totalFinishBonus,
      });
      return;
    }

    // Kotak 27: FINAL MISSION
    if (tileId === 27) {
      sounds.playBonus();
      setShowFinalMission(true);
      return;
    }

    // Kotak 25: SECRET CODE
    if (tileId === 25) {
      sounds.playBonus();
      setShowSecretCode(true);
      return;
    }

    // Kotak 21: AIR & SISA
    if (tileId === 21) {
      sounds.playBonus();
      setShowWaterModal(true);
      return;
    }

    // Kotak 6: PILIH KARTU / TOKO INVENTARIS
    if (tileId === 6) {
      sounds.playCardFlip();
      setShowChooseCardModal(true);
      return;
    }

    // Kotak 7, 16, 22, 24: QR CHALLENGE / QR MISSION
    if (tileId === 7 || tileId === 16 || tileId === 22 || tileId === 24) {
      sounds.playQrBeep();
      setActiveQrTile({ number: tileId, title: tile.name });
      return;
    }

    // Kotak 4, 12, 20: MYSTERY
    if (tile.category === 'mystery') {
      sounds.playCardFlip();
      const randomCard = drawRandomMysteryCard();
      setActiveMysteryCard(randomCard);
      return;
    }

    // Kotak 13, 18: JEBAKAN
    if (tile.category === 'trap') {
      sounds.playCardFlip();
      const randomTrap = drawRandomTrapCard();
      setActiveTrapCard(randomTrap);
      return;
    }

    // Kotak 8, 14: BONUS +10
    if (tileId === 8 || tileId === 14) {
      sounds.playBonus();
      const updated = currentPlayers.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, position: tileId, points: p.points + 10 } : p
      );
      updatePlayersState(updated);
      addLog(player.name, player.pawnColor, `Mendapat bonus +10 poin dari ${tile.name}!`, 10);
      advanceToNextTurn(updated);
      return;
    }

    // Kotak 23: BONUS +15
    if (tileId === 23) {
      sounds.playBonus();
      const updated = currentPlayers.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, position: tileId, points: p.points + 15 } : p
      );
      updatePlayersState(updated);
      addLog(player.name, player.pawnColor, `Mendapat bonus super +15 poin dari ${tile.name}!`, 15);
      advanceToNextTurn(updated);
      return;
    }

    // Kotak 10: HAMBATAN -5 or Kotak 17: BAKTERI -5
    if (tileId === 10 || tileId === 17) {
      setPenaltyDialog({
        amount: 5,
        title: tile.name,
        reason: tile.description,
      });
      return;
    }

    // Organ Tiles (Mulut, Gigi, Lidah, Kerongkongan, Lambung, Usus Halus, Usus Besar, Anus)
    // Exclusive Rule: Kartu organ hanya bisa dimiliki oleh 1 pemain yang pertama kali mendapatkannya!
    if (tile.category === 'organ' && tile.organKey) {
      sounds.playCardFlip();
      const organCard = ORGAN_CARDS[tile.organKey];
      if (organCard) {
        const existingOwner = currentPlayers.find((p) => p.organCards.includes(tile.organKey!));

        if (existingOwner) {
          if (existingOwner.id === player.id) {
            // Already owned by the active player
            setActiveOrganCard({
              card: organCard,
              canSell: true,
              isInspectOnly: true,
              isFromLanding: true,
              ownerName: player.name,
              isAlreadyClaimedByOther: false,
            });
            addLog(player.name, player.pawnColor, `Berada di kotak ${tile.name}. Kartu ini sudah berada di inventarismu.`);
          } else {
            // Already claimed by ANOTHER player: cannot be obtained!
            sounds.playPenalty();
            setActiveOrganCard({
              card: organCard,
              canSell: false,
              isInspectOnly: true,
              isFromLanding: true,
              ownerName: existingOwner.name,
              isAlreadyClaimedByOther: true,
            });
            addLog(
              player.name,
              player.pawnColor,
              `Tiba di kotak ${tile.name}. Kartu Organ ${organCard.title} sudah dimiliki oleh ${existingOwner.name}! Hanya pemain pertama yang mendapatkan kartu ini.`
            );
          }
        } else {
          // First player to discover and claim this organ!
          sounds.playBonus();
          const updatedList = currentPlayers.map((p, idx) =>
            idx === activePlayerIndex ? { ...p, position: tileId, organCards: [...p.organCards, tile.organKey!] } : p
          );
          updatePlayersState(updatedList);
          addLog(
            player.name,
            player.pawnColor,
            `Pemain pertama yang menemukan Kartu Organ: ${organCard.title}! Kartu disimpan di inventaris (+10 poin saat Finish).`
          );
          setActiveOrganCard({
            card: organCard,
            canSell: true,
            isInspectOnly: false,
            isFromLanding: true,
            ownerName: player.name,
            isAlreadyClaimedByOther: false,
          });
        }
        return;
      }
    }

    // Default: advance turn
    advanceToNextTurn(currentPlayers);
  };

  // Handle Penalty Resolution (-5 points) with Saver card check
  const handleResolvePenalty = (useSaverCard: boolean) => {
    if (!penaltyDialog) return;
    const currentPlayers = playersRef.current;
    const player = currentPlayers[activePlayerIndex];
    if (!player) return;

    if (useSaverCard && player.hasSaverCard) {
      sounds.playShield();
      const updated = currentPlayers.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, hasSaverCard: false } : p
      );
      updatePlayersState(updated);
      addLog(player.name, player.pawnColor, `Menggunakan KARTU PENYELAMAT! Hukuman -${penaltyDialog.amount} poin dibatalkan.`);
      setPenaltyDialog(null);
      advanceToNextTurn(updated);
      return;
    }

    sounds.playPenalty();
    const updated = currentPlayers.map((p, idx) =>
      idx === activePlayerIndex
        ? { ...p, points: Math.max(0, p.points - penaltyDialog.amount) }
        : p
    );
    updatePlayersState(updated);
    addLog(player.name, player.pawnColor, `Kehilangan ${penaltyDialog.amount} poin dari ${penaltyDialog.title}.`, -penaltyDialog.amount);
    setPenaltyDialog(null);
    advanceToNextTurn(updated);
  };

  // Sell Organ Card for +5 Points
  const handleSellOrganCard = (organKey: string) => {
    const currentPlayers = playersRef.current;
    const player = currentPlayers[activePlayerIndex];
    if (!player || !player.organCards.includes(organKey)) return;

    const organ = ORGAN_CARDS[organKey];
    const isFromLanding = Boolean(activeOrganCard?.isFromLanding);
    const updated = currentPlayers.map((p, idx) =>
      idx === activePlayerIndex
        ? {
            ...p,
            points: p.points + 5,
            organCards: p.organCards.filter((k) => k !== organKey),
          }
        : p
    );
    updatePlayersState(updated);
    addLog(player.name, player.pawnColor, `Menjual kartu organ ${organ?.title || organKey} (+5 poin)!`, 5);
    setActiveOrganCard(null);
    if (isFromLanding) {
      advanceToNextTurn(updated);
    }
  };

  // Resolve Mystery Card Effects
  const handleApplyMysteryEffect = (res: {
    stepsDelta?: number;
    newPosition?: number;
    targetNewPosition?: number;
    targetPlayerId?: string;
    pointsDelta?: number;
    gotSaverCard?: boolean;
    rollAgain?: boolean;
    description: string;
  }) => {
    const currentPlayers = playersRef.current;
    const player = currentPlayers[activePlayerIndex];
    if (!player) return;

    const oldPosition = player.position;
    setActiveMysteryCard(null);
    addLog(player.name, player.pawnColor, res.description, res.pointsDelta);

    let updatedPlayers = currentPlayers.map((p, idx) => {
      if (idx === activePlayerIndex) {
        let newPts = p.points + (res.pointsDelta || 0);
        let newSaver = p.hasSaverCard || Boolean(res.gotSaverCard);
        let newPos = res.newPosition !== undefined ? res.newPosition : p.position + (res.stepsDelta || 0);
        if (!p.hasCompletedFinalMission && newPos >= 27) {
          newPos = 27;
        } else {
          newPos = Math.max(1, Math.min(28, newPos));
        }

        return {
          ...p,
          points: Math.max(0, newPts),
          hasSaverCard: newSaver,
          position: newPos,
        };
      }

      if (res.targetPlayerId && p.id === res.targetPlayerId) {
        const nextPos = res.targetNewPosition !== undefined ? res.targetNewPosition : p.position;
        return {
          ...p,
          position: nextPos,
        };
      }

      return p;
    });

    updatePlayersState(updatedPlayers);
    const updatedActive = updatedPlayers[activePlayerIndex];
    if (updatedActive) {
      setSelectedTileId(updatedActive.position);
    }


    // If player chose rollAgain from Pilihan card:
    if (res.rollAgain) {
      setHasRolledThisTurn(false);
      addLog(player.name, player.pawnColor, 'Mendapat giliran melempar dadu lagi! Silakan lempar dadu.');
      return;
    }

    // Cascading tile effect: if pawn moved forward/backward/swapped, trigger the landing tile effect!
    if (updatedActive && updatedActive.position !== oldPosition) {
      setTimeout(() => {
        handleTileLanding(updatedActive.position);
      }, 250);
      return;
    }

    advanceToNextTurn(updatedPlayers);
  };

  // Resolve Trap Card Effects
  const handleApplyTrapEffect = (res: {
    stepsDelta?: number;
    newPosition?: number;
    targetNewPosition?: number;
    pointsDelta?: number;
    skipNextTurn?: boolean;
    targetPlayerId?: string;
    targetPointsDelta?: number;
    usedSaverCard?: boolean;
    description: string;
  }) => {
    const currentPlayers = playersRef.current;
    const player = currentPlayers[activePlayerIndex];
    if (!player) return;

    const oldPosition = player.position;
    setActiveTrapCard(null);
    addLog(player.name, player.pawnColor, res.description, res.pointsDelta);

    let updatedPlayers = currentPlayers.map((p) => {
      if (p.id === player.id) {
        let newPts = p.points + (res.pointsDelta || 0);
        let newPos = res.newPosition !== undefined ? res.newPosition : p.position + (res.stepsDelta || 0);
        if (!p.hasCompletedFinalMission && newPos >= 27) {
          newPos = 27;
        } else {
          newPos = Math.max(1, Math.min(28, newPos));
        }

        return {
          ...p,
          points: Math.max(0, newPts),
          position: newPos,
          skipNextTurn: p.skipNextTurn || Boolean(res.skipNextTurn),
          hasSaverCard: res.usedSaverCard ? false : p.hasSaverCard,
        };
      }

      if (res.targetPlayerId && p.id === res.targetPlayerId) {
        const nextPts = res.targetPointsDelta ? Math.max(0, p.points + res.targetPointsDelta) : p.points;
        const nextPos = res.targetNewPosition !== undefined ? res.targetNewPosition : p.position;
        if (res.targetPointsDelta && res.targetPointsDelta !== 0) {
          triggerFloatingPoint(p.id, nextPos, res.targetPointsDelta);
        }
        return {
          ...p,
          points: nextPts,
          position: nextPos,
        };
      }

      return p;
    });

    updatePlayersState(updatedPlayers);
    const updatedActive = updatedPlayers[activePlayerIndex];
    if (updatedActive) {
      setSelectedTileId(updatedActive.position);
    }

    // Cascading tile effect: if pawn moved forward/backward/swapped/start, trigger the landing tile effect!
    if (updatedActive && updatedActive.position !== oldPosition) {
      setTimeout(() => {
        handleTileLanding(updatedActive.position);
      }, 250);
      return;
    }

    advanceToNextTurn(updatedPlayers);
  };

  // QR Challenge / Mission Success
  const handleQrChallengeSuccess = (points: number, message: string) => {
    const currentPlayers = playersRef.current;
    const player = currentPlayers[activePlayerIndex];
    if (!player) return;

    if (points > 0) {
      fireMiniConfetti();
    }
    setActiveQrTile(null);
    const updated = currentPlayers.map((p, idx) =>
      idx === activePlayerIndex ? { ...p, points: p.points + points } : p
    );
    updatePlayersState(updated);
    addLog(player.name, player.pawnColor, message, points > 0 ? points : undefined);
    advanceToNextTurn(updated);
  };

  // Secret Code Success
  const handleSecretCodeSuccess = (points: number, message: string) => {
    const currentPlayers = playersRef.current;
    const player = currentPlayers[activePlayerIndex];
    if (!player) return;

    fireMiniConfetti();
    setShowSecretCode(false);
    const updated = currentPlayers.map((p, idx) =>
      idx === activePlayerIndex ? { ...p, points: p.points + points } : p
    );
    updatePlayersState(updated);
    addLog(player.name, player.pawnColor, message, points);
    advanceToNextTurn(updated);
  };

  // Final Mission Complete
  const handleFinalMissionSuccess = (task: { organ: string }) => {
    const currentPlayers = playersRef.current;
    const player = currentPlayers[activePlayerIndex];
    if (!player) return;

    fireMiniConfetti();
    setShowFinalMission(false);
    const updated = currentPlayers.map((p, idx) =>
      idx === activePlayerIndex ? { ...p, hasCompletedFinalMission: true } : p
    );
    updatePlayersState(updated);
    addLog(
      player.name,
      player.pawnColor,
      `Berhasil menuntaskan Final Mission peragaan organ ${task.organ}! Syarat Finish telah terpenuhi.`
    );
    advanceToNextTurn(updated);
  };

  const activePlayer = players[activePlayerIndex];

  // Helper to render modals inside Board so they are always visible in fullscreen
  const renderGameModals = () => (
    <>
      {/* 1. Organ Card Modal */}
      {activeOrganCard && (
        <CardModal
          card={activeOrganCard.card}
          playerName={activePlayer?.name || ''}
          ownerName={activeOrganCard.ownerName}
          isAlreadyClaimedByOther={activeOrganCard.isAlreadyClaimedByOther}
          canSell={activeOrganCard.canSell && !activeOrganCard.isAlreadyClaimedByOther}
          onSellCard={() => {
            if (activeOrganCard.card.organKey) {
              handleSellOrganCard(activeOrganCard.card.organKey);
            }
          }}
          onClose={() => {
            const isFromLanding = Boolean(activeOrganCard.isFromLanding);
            setActiveOrganCard(null);
            if (isFromLanding) {
              advanceToNextTurn();
            }
          }}
        />
      )}

      {/* 2. Mystery Card Modal */}
      {activeMysteryCard && activePlayer && (
        <MysteryCardModal
          card={activeMysteryCard}
          player={activePlayer}
          allPlayers={players}
          usedCardIds={usedMysteryCardIds}
          onDrawAnotherCard={drawRandomMysteryCard}
          onApplyEffect={handleApplyMysteryEffect}
          onClose={() => {
            if (activeMysteryCard) {
              setActiveMysteryCard(null);
              advanceToNextTurn();
            }
          }}
        />
      )}

      {/* 3. Trap Card Modal */}
      {activeTrapCard && activePlayer && (
        <TrapCardModal
          card={activeTrapCard}
          player={activePlayer}
          allPlayers={players}
          usedCardIds={usedTrapCardIds}
          onDrawAnotherCard={drawRandomTrapCard}
          onApplyEffect={handleApplyTrapEffect}
          onClose={() => {
            if (activeTrapCard) {
              setActiveTrapCard(null);
              advanceToNextTurn();
            }
          }}
        />
      )}

      {/* 4. QR Challenge / Mission Modal with Web Links */}
      {activeQrTile && activePlayer && (
        <QrChallengeModal
          tileNumber={activeQrTile.number}
          tileTitle={activeQrTile.title}
          playerName={activePlayer.name}
          onSuccess={handleQrChallengeSuccess}
          onClose={() => {
            if (activeQrTile) {
              setActiveQrTile(null);
              advanceToNextTurn();
            }
          }}
        />
      )}

      {/* 5. Secret Code Modal */}
      {showSecretCode && activePlayer && (
        <SecretCodeModal
          playerName={activePlayer.name}
          onSuccess={handleSecretCodeSuccess}
          onClose={() => {
            if (showSecretCode) {
              setShowSecretCode(false);
              advanceToNextTurn();
            }
          }}
        />
      )}

      {/* 6. Final Mission Modal (Kotak 27) */}
      {showFinalMission && activePlayer && (
        <FinalMissionModal
          playerName={activePlayer.name}
          onSuccess={handleFinalMissionSuccess}
          onClose={() => {
            if (showFinalMission) {
              setShowFinalMission(false);
              advanceToNextTurn();
            }
          }}
        />
      )}

      {/* 8. Kotak 21: Air & Sisa Modal */}
      {showWaterModal && activePlayer && (
        <WaterAndWasteModal
          playerName={activePlayer.name}
          onClaimBonus={() => {
            const currentPlayers = playersRef.current;
            const updated = currentPlayers.map((p, idx) =>
              idx === activePlayerIndex ? { ...p, points: p.points + 10 } : p
            );
            updatePlayersState(updated);
            addLog(activePlayer.name, activePlayer.pawnColor, 'Mempelajari penyerapan air di usus besar (+10 poin)!', 10);
            setShowWaterModal(false);
            advanceToNextTurn(updated);
          }}
          onClose={() => {
            if (showWaterModal) {
              setShowWaterModal(false);
              advanceToNextTurn();
            }
          }}
        />
      )}

      {/* 9. Kotak 6: Pilih Kartu Modal */}
      {showChooseCardModal && activePlayer && (
        <ChooseCardModal
          player={activePlayer}
          allPlayers={players}
          usedMysteryCardIds={usedMysteryCardIds}
          usedTrapCardIds={usedTrapCardIds}
          onPickOrgan={(organKey) => {
            const currentPlayers = playersRef.current;
            const organCard = ORGAN_CARDS[organKey];
            if (!organCard) return;
            const alreadyClaimed = currentPlayers.some((p) => p.organCards.includes(organKey));
            if (alreadyClaimed) return;

            const updated = currentPlayers.map((p, idx) =>
              idx === activePlayerIndex ? { ...p, organCards: [...p.organCards, organKey] } : p
            );
            updatePlayersState(updated);
            addLog(activePlayer.name, activePlayer.pawnColor, `Memilih kartu organ eksklusif ${organCard.title} dari Kotak 6 (+10 poin saat Finish)!`);
            setShowChooseCardModal(false);
            advanceToNextTurn(updated);
          }}
          onPickMystery={(card) => {
            setShowChooseCardModal(false);
            setUsedMysteryCardIds((prev) => (prev.includes(card.id) ? prev : [...prev, card.id]));
            if (card.effectType === 'saver') {
              const currentPlayers = playersRef.current;
              const updated = currentPlayers.map((p, idx) =>
                idx === activePlayerIndex ? { ...p, hasSaverCard: true } : p
              );
              updatePlayersState(updated);
              sounds.playShield();
              addLog(activePlayer.name, activePlayer.pawnColor, 'Memilih dan menyimpan KARTU PENYELAMAT dari Kotak 6!');
              advanceToNextTurn(updated);
            } else {
              setActiveMysteryCard(card);
            }
          }}
          onPickTrap={(card) => {
            setShowChooseCardModal(false);
            setUsedTrapCardIds((prev) => (prev.includes(card.id) ? prev : [...prev, card.id]));
            setActiveTrapCard(card);
          }}
          onSellOrgan={(organKey) => {
            handleSellOrganCard(organKey);
            setShowChooseCardModal(false);
          }}
          onClose={() => {
            if (showChooseCardModal) {
              setShowChooseCardModal(false);
              advanceToNextTurn();
            }
          }}
        />
      )}

      {/* 10. Finish Celebration Modal */}
      {showFinishModal && activePlayer && (
        <FinishModal
          player={activePlayer}
          rank={showFinishModal.rank}
          bonusPoints={showFinishModal.bonus}
          organBonusPoints={showFinishModal.organBonusPoints}
          organCards={showFinishModal.organCards}
          totalBonusPoints={showFinishModal.totalBonusPoints}
          isAllFinished={players.every((p) => p.hasFinished)}
          onContinue={() => {
            setShowFinishModal(null);
            advanceToNextTurn();
          }}
          onViewSummary={() => {
            setShowFinishModal(null);
            setView('SUMMARY');
          }}
        />
      )}

      {/* 11. Penalty Dialog */}
      {penaltyDialog && activePlayer && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-rose-400 text-center">
            <div className="inline-flex p-3 bg-rose-100 text-rose-600 rounded-2xl mb-2">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-heading font-extrabold text-slate-800">
              {penaltyDialog.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {penaltyDialog.reason}
            </p>

            <div className="my-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-bold">
              Hukuman Pengurangan: -{penaltyDialog.amount} Poin
            </div>

            {activePlayer.hasSaverCard ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleResolvePenalty(true)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
                >
                  🛡️ GUNAKAN KARTU PENYELAMAT (BATALKAN HUKUMAN)
                </button>
                <button
                  onClick={() => handleResolvePenalty(false)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
                >
                  Terima Hukuman (-{penaltyDialog.amount} Poin)
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleResolvePenalty(false)}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
              >
                Konfirmasi Hukuman (-{penaltyDialog.amount} Poin)
              </button>
            )}
          </div>
        </div>
      )}

      {/* 12. Rulebook Modal */}
      {showRules && <RulebookModal onClose={() => setShowRules(false)} />}

      {/* 13. Organ Encyclopedia Modal */}
      {showOrganGuide && <OrganGuideModal onClose={() => setShowOrganGuide(false)} />}

      {/* 14. Victory Summary */}
      {view === 'SUMMARY' && (
        <GameSummaryModal
          players={players}
          onPlayAgain={handleResetGame}
          onClose={() => setView('PLAYING')}
        />
      )}

      {/* 15. Reset Game Confirmation Modal */}
      {showResetConfirmModal && (
        <ResetConfirmModal
          onConfirm={handleResetGame}
          onCancel={() => setShowResetConfirmModal(false)}
        />
      )}

      {/* 16. Music Selector Modal */}
      {showMusicModal && (
        <MusicSelectorModal onClose={() => setShowMusicModal(false)} />
      )}

    </>
  );

  // View: Welcome & Setup
  if (view === 'WELCOME' || view === 'SETUP') {
    return (
      <>
        <PlayerSetupModal
          onStartGame={handleStartGame}
          onOpenRules={() => setShowRules(true)}
          onOpenOrganGuide={() => setShowOrganGuide(true)}
          onOpenMusicSelector={() => setShowMusicModal(true)}
        />
        {showMusicModal && (
          <MusicSelectorModal onClose={() => setShowMusicModal(false)} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col justify-between">
      {/* Top Bar Header */}
      <Header
        onOpenRules={() => setShowRules(true)}
        onOpenOrganGuide={() => setShowOrganGuide(true)}
        onResetGame={() => setShowResetConfirmModal(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isBgmOn={isBgmOn}
        onToggleBgm={() => sounds.toggleBgm()}
        onOpenMusicSelector={() => setShowMusicModal(true)}
        currentTurnPlayerName={activePlayer?.name}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Mobile Tab Switcher (Visible on screens < lg) */}
      <div className="lg:hidden max-w-7xl mx-auto w-full px-2 sm:px-4 pt-2">
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs">
          <button
            onClick={() => setMobileTab('board')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-xl font-heading font-extrabold text-xs transition-all cursor-pointer ${
              mobileTab === 'board'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span className="truncate">Papan & Dadu</span>
          </button>
          <button
            onClick={() => setMobileTab('roster')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-xl font-heading font-extrabold text-xs transition-all cursor-pointer ${
              mobileTab === 'roster'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate">Pemain ({players.length})</span>
          </button>
          <button
            onClick={() => setMobileTab('logs')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-xl font-heading font-extrabold text-xs transition-all cursor-pointer ${
              mobileTab === 'logs'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ScrollText className="w-4 h-4 shrink-0" />
            <span className="truncate">Log ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* Main Playing Arena Layout */}
      <main className="max-w-7xl mx-auto w-full px-2 sm:px-4 md:px-6 py-2 sm:py-5 flex-1 flex flex-col lg:flex-row gap-4 lg:gap-5 items-start justify-center">
        {/* Left / Center Area: Board + External Game Action Console (Dadu & Keterangan) */}
        <div className={`flex-1 w-full flex flex-col items-center pb-20 sm:pb-0 ${mobileTab !== 'board' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Mobile Turn Status Banner (Visible only on smartphones < sm) */}
          {activePlayer && (
            <div className="sm:hidden w-full max-w-[1080px] mb-2 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-amber-300 shadow-2xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 shrink-0">
                  Giliran
                </span>
                <span className="font-heading font-extrabold text-slate-800 truncate">
                  {activePlayer.name}
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-slate-600 font-semibold truncate text-[11px]">
                  #{activePlayer.position} {BOARD_TILES[activePlayer.position - 1]?.name}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {activePlayer.hasSaverCard && <span title="Kartu Penyelamat">🛡️</span>}
                {activePlayer.hasCompletedFinalMission && <span title="Lolos Final">⭐</span>}
                {activePlayer.skipNextTurn && <span title="Sakit Perut">🤢</span>}
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                  {activePlayer.points} P
                </span>
              </div>
            </div>
          )}

          {/* 10x6 Board with Central Interactive Dice Arena */}
          <Board
            tiles={BOARD_TILES}
            players={players}
            activePlayerIndex={activePlayerIndex}
            isMoving={isMoving}
            onTileClick={(tile) => {
              setSelectedTileId(tile.id);
              setShowMobileTileSheet(true);
            }}
            selectedTileId={selectedTileId}
            floatingPoints={floatingPoints}
            onRollDice={handleRollDice}
            lastRoll={lastRoll}
            onStepAdjust={handleStepAdjust}
            onOpenFinalMission={() => setShowFinalMission(true)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          >
            {renderGameModals()}
          </Board>

          {/* Dadu & Keterangan Dibuat di Luar Papan Permainan (Visible on Desktop & Tablet) */}
          {activePlayer && (
            <div className="hidden sm:block w-full">
              <GameActionConsole
                activePlayer={activePlayer}
                currentTile={BOARD_TILES[activePlayer.position - 1] || BOARD_TILES[0]}
                isMoving={isMoving}
                onRollDice={handleRollDice}
                lastRoll={lastRoll}
                selectedTile={selectedTileId ? BOARD_TILES[selectedTileId - 1] : null}
                onStepAdjust={handleStepAdjust}
                onOpenFinalMission={() => setShowFinalMission(true)}
                floatingPoints={floatingPoints}
              />
            </div>
          )}

          {/* Quick Horizontal Player Status Strip (Visible on Tablet, hidden on mobile HP to prevent overcrowding) */}
          <div className="hidden sm:block lg:hidden w-full mt-3 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider">
                Ringkasan Pemain ({players.length})
              </span>
              <button
                onClick={() => setMobileTab('roster')}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
              >
                Lihat Lengkap & Kartu &rarr;
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {players.map((p, idx) => {
                const isActive = idx === activePlayerIndex;
                return (
                  <div
                    key={p.id}
                    onClick={() => setMobileTab('roster')}
                    className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isActive
                        ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-400/50 shadow-xs'
                        : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    <PawnAvatar color={p.pawnColor} size="sm" />
                    <div className="leading-tight">
                      <div className="font-heading font-bold text-slate-800 flex items-center gap-1">
                        <span className="max-w-[75px] truncate">{p.name}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold">
                        Kotak {p.position} &bull; <span className="font-bold text-amber-600">{p.points} P</span> &bull; {p.organCards.length}🫀
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Tile Info Sheet / Drawer (On-demand inspection for HP) */}
        {showMobileTileSheet && activePlayer && (
          <MobileTileInfoSheet
            tile={selectedTileId ? (BOARD_TILES[selectedTileId - 1] || BOARD_TILES[0]) : (BOARD_TILES[activePlayer.position - 1] || BOARD_TILES[0])}
            activePlayer={activePlayer}
            onClose={() => setShowMobileTileSheet(false)}
            onStepAdjust={handleStepAdjust}
            onOpenFinalMission={() => setShowFinalMission(true)}
          />
        )}

        {/* ========================================================
            STICKY MOBILE ACTION DOCK (Ergonomic Thumb-Zone for HP)
            ======================================================== */}
        {activePlayer && view === 'PLAYING' && mobileTab === 'board' && (
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-amber-300 shadow-[0_-6px_25px_rgba(0,0,0,0.12)] px-3 py-2 pb-safe flex items-center justify-between gap-2.5">
            {/* Active Player Mini Profile */}
            <div
              onClick={() => setMobileTab('roster')}
              className="flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Buka daftar pemain"
            >
              <div className="relative shrink-0">
                <FloatingPointsOverlay items={floatingPoints.filter((fp) => fp.playerId === activePlayer.id)} />
                <PawnAvatar color={activePlayer.pawnColor} size="sm" isCurrent={true} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-heading font-black text-slate-800 max-w-[75px] truncate">
                  {activePlayer.name}
                </span>
                <span className="text-[10px] font-bold text-amber-700">
                  {activePlayer.points} Poin
                </span>
              </div>
            </div>

            {/* Main Primary Thumb Action Button */}
            <div className="flex-1 flex justify-center min-w-0">
              {activePlayer.skipNextTurn ? (
                <button
                  onClick={() => {
                    sounds.playStep();
                    handleRollDice(0);
                  }}
                  className="w-full h-11 px-3 bg-linear-to-r from-rose-500 to-red-600 text-white font-heading font-black text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                >
                  <span>🤢 Lewati Giliran (Sakit)</span>
                </button>
              ) : activePlayer.position === 27 && !activePlayer.hasCompletedFinalMission ? (
                <button
                  onClick={() => {
                    sounds.playBonus();
                    setShowFinalMission(true);
                  }}
                  className="w-full h-11 px-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white font-heading font-black text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>🏆 MISI FINAL</span>
                </button>
              ) : isMoving ? (
                <div className="w-full h-11 px-3 bg-amber-100 border border-amber-300 text-amber-900 font-heading font-black text-xs rounded-xl flex items-center justify-center gap-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>🏃 Melangkah...</span>
                </div>
              ) : activePlayer.hasFinished ? (
                <div className="w-full h-11 px-3 bg-slate-100 border border-slate-300 text-slate-600 font-heading font-bold text-xs rounded-xl flex items-center justify-center">
                  <span>🏁 Selesai</span>
                </div>
              ) : hasRolledThisTurn ? (
                <div className="w-full h-11 px-3 bg-emerald-50 border border-emerald-300 text-emerald-800 font-heading font-bold text-xs rounded-xl flex items-center justify-center gap-1.5">
                  <span>🎲 Dadu: {lastRoll || 0}</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    sounds.playDiceRoll();
                    const diceVal = Math.floor(Math.random() * 6) + 1;
                    handleRollDice(diceVal);
                  }}
                  className="w-full h-11 px-3 bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-heading font-black text-sm tracking-wide rounded-xl shadow-lg shadow-amber-500/30 active:scale-95 hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="text-base animate-bounce">🎲</span>
                  <span>LEMPAR DADU</span>
                </button>
              )}
            </div>

            {/* Info Kotak Button */}
            <button
              onClick={() => {
                sounds.playCardFlip();
                setShowMobileTileSheet(true);
              }}
              className="px-2.5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 font-heading font-bold text-[11px] flex flex-col items-center justify-center shrink-0 cursor-pointer transition-all active:scale-95"
              title="Informasi Kotak & Organ"
            >
              <span className="text-xs">📖</span>
              <span>Info</span>
            </button>
          </div>
        )}

        {/* Right Sidebar: Player Roster & Activity Log */}
        <div className={`w-full lg:w-80 shrink-0 space-y-4 ${mobileTab === 'board' ? 'hidden lg:block' : 'block'}`}>
          <div className={`${mobileTab === 'logs' ? 'hidden lg:block' : 'block'}`}>
            <PlayerRosterPanel
              players={players}
              activePlayerIndex={activePlayerIndex}
              onOpenCardModal={(organKey, canSell) => {
                const c = ORGAN_CARDS[organKey];
                if (c) {
                  const owner = players.find((p) => p.organCards.includes(organKey));
                  setActiveOrganCard({
                    card: c,
                    canSell,
                    isInspectOnly: true,
                    ownerName: owner?.name || activePlayer?.name,
                    isAlreadyClaimedByOther: false,
                  });
                }
              }}
              floatingPoints={floatingPoints}
            />
          </div>

          <div className={`${mobileTab === 'roster' ? 'hidden lg:block' : 'block'}`}>
            <ActivityLogPanel logs={logs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-400 py-3 border-t border-slate-200/80 bg-white/60">
        DIGESTIVE ADVENTURE &copy; Game Papan Sistem Pencernaan SD/MI
      </footer>
    </div>
  );
}
