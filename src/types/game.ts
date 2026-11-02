/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PawnColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface Player {
  id: string;
  name: string;
  pawnColor: PawnColor;
  position: number; // 1 to 28
  points: number; // starts at 30
  organCards: string[]; // ids of organ cards held
  hasSaverCard: boolean; // has "SELAMAT!" card
  skipNextTurn: boolean; // e.g. from Sakit Perut
  hasCompletedFinalMission: boolean;
  hasFinished: boolean;
  finishRank?: number; // 1, 2, 3, etc.
}

export type TileCategory =
  | 'start'
  | 'organ'
  | 'mystery'
  | 'trap'
  | 'bonus'
  | 'penalty'
  | 'qr'
  | 'secret_code'
  | 'neutral'
  | 'final_mission'
  | 'finish';

export interface BoardTile {
  id: number; // 1 to 28
  name: string;
  category: TileCategory;
  subtitle: string;
  image: string;
  description: string;
  organKey?: string;
}

export type CardType = 'organ' | 'mystery' | 'trap';

export interface GameCard {
  id: string;
  type: CardType;
  title: string;
  subtitle?: string;
  instruction: string;
  image: string;
  borderColor: string;
  bgColor: string;
  organKey?: string;
  effectType?:
    | 'move_forward'
    | 'move_backward'
    | 'choose_bonus_or_roll'
    | 'quiz_acid'
    | 'quiz_teeth'
    | 'action_gestures'
    | 'saver'
    | 'back_to_start'
    | 'swap_position'
    | 'trap_loss_20'
    | 'trap_portal'
    | 'trap_bacteria_back_3'
    | 'trap_swap_points'
    | 'trap_stomach_ache'
    | 'trap_virus'
    | 'explain_organ';
  effectValue?: number;
  pointsReward?: number;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  playerName: string;
  pawnColor: PawnColor;
  action: string;
  pointsDelta?: number;
}

export type GameView = 'WELCOME' | 'SETUP' | 'PLAYING' | 'SUMMARY';

export interface FinalMissionTask {
  organ: string;
  actionInstruction: string;
  learningTip: string;
  image: string;
}

export interface SecretCodeChallenge {
  displayCode: string;
  hint: string;
  answer: string;
  organFact: string;
}

export interface QrQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
  badge?: string;
}

export interface MatchingChallenge {
  id: string;
  title: string;
  instruction: string;
  pairs: MatchingPair[];
}

export interface SequencePuzzleChallenge {
  id: string;
  title: string;
  instruction: string;
  items: { id: string; label: string; desc: string }[];
  correctOrder: string[];
  explanation: string;
}

export interface FloatingPointItem {
  id: string;
  playerId: string;
  tileId: number;
  points: number;
  createdAt: number;
}

