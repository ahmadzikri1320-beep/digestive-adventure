/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PawnColor } from '../types/game';

interface PawnAvatarProps {
  color: PawnColor;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  name?: string;
  isCurrent?: boolean;
  playerNumber?: number;
  className?: string;
}

const COLOR_MAP: Record<PawnColor, { bg: string; border: string; hat: string; text: string; label: string; glow: string }> = {
  red: {
    bg: 'bg-rose-500',
    border: 'border-rose-600',
    hat: '#EF4444',
    text: 'text-rose-700',
    label: 'Pion Merah',
    glow: 'shadow-rose-400/50',
  },
  blue: {
    bg: 'bg-sky-500',
    border: 'border-sky-600',
    hat: '#0EA5E9',
    text: 'text-sky-700',
    label: 'Pion Biru',
    glow: 'shadow-sky-400/50',
  },
  green: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-600',
    hat: '#10B981',
    text: 'text-emerald-700',
    label: 'Pion Hijau',
    glow: 'shadow-emerald-400/50',
  },
  yellow: {
    bg: 'bg-amber-400',
    border: 'border-amber-500',
    hat: '#F59E0B',
    text: 'text-amber-800',
    label: 'Pion Kuning',
    glow: 'shadow-amber-400/50',
  },
  purple: {
    bg: 'bg-purple-500',
    border: 'border-purple-600',
    hat: '#8B5CF6',
    text: 'text-purple-700',
    label: 'Pion Ungu',
    glow: 'shadow-purple-400/50',
  },
  orange: {
    bg: 'bg-orange-500',
    border: 'border-orange-600',
    hat: '#F97316',
    text: 'text-orange-700',
    label: 'Pion Oranye',
    glow: 'shadow-orange-400/50',
  },
};

export const PAWN_COLORS: PawnColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

export const PawnAvatar: React.FC<PawnAvatarProps> = ({
  color,
  size = 'md',
  showLabel = false,
  name,
  isCurrent = false,
  playerNumber,
  className = '',
}) => {
  const config = COLOR_MAP[color] || COLOR_MAP.red;

  const sizeClasses = {
    xs: 'w-4 h-4 sm:w-5.5 sm:h-5.5',
    sm: 'w-5 h-5 sm:w-7 sm:h-7',
    md: 'w-6.5 h-6.5 sm:w-8.5 sm:h-8.5',
    lg: 'w-9 h-9 sm:w-12 sm:h-12',
    xl: 'w-12 h-12 sm:w-16 sm:h-16',
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div
        className={`relative rounded-full flex items-center justify-center transition-transform duration-200 ${
          sizeClasses[size]
        } ${isCurrent ? (size === 'sm' ? 'ring-2 ring-amber-400 shadow-md' : 'ring-3 ring-amber-400 shadow-lg') : 'shadow-xs'} bg-white border-2 ${config.border}`}
      >
        {/* Cartoon explorer scout svg avatar */}
        <svg viewBox="0 0 48 48" className="w-full h-full p-0.5">
          {/* Scout hat brim */}
          <ellipse cx="24" cy="19" rx="16" ry="4" fill={config.hat} stroke="#1E293B" strokeWidth="1.5" />
          {/* Scout hat crown */}
          <path d="M14 19 C14 10, 34 10, 34 19 Z" fill={config.hat} stroke="#1E293B" strokeWidth="1.5" />
          {/* Hat band */}
          <path d="M15 17 Q24 20 33 17" stroke="#1E293B" strokeWidth="1.8" fill="none" />
          {/* Face */}
          <circle cx="24" cy="27" r="10" fill="#FFE4C4" stroke="#1E293B" strokeWidth="1.5" />
          {/* Hair fringe */}
          <path d="M17 21 Q24 24 31 21" stroke="#5C3A21" strokeWidth="2.5" fill="none" />
          {/* Eyes */}
          <circle cx="20.5" cy="26" r="1.5" fill="#1E293B" />
          <circle cx="27.5" cy="26" r="1.5" fill="#1E293B" />
          {/* Eye sparkles */}
          <circle cx="21" cy="25.5" r="0.5" fill="#FFFFFF" />
          <circle cx="28" cy="25.5" r="0.5" fill="#FFFFFF" />
          {/* Cheeks */}
          <circle cx="18" cy="28.5" r="1.5" fill="#FF8A80" opacity="0.6" />
          <circle cx="30" cy="28.5" r="1.5" fill="#FF8A80" opacity="0.6" />
          {/* Smile */}
          <path d="M21.5 30 Q24 32.5 26.5 30" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Scout neckerchief / scarf in color */}
          <polygon points="21,36 27,36 24,42" fill={config.hat} stroke="#1E293B" strokeWidth="1" />
        </svg>

        {/* Active turn badge */}
        {isCurrent && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full animate-ping" />
        )}

        {/* Player number badge */}
        {playerNumber !== undefined && (
          <span
            className={`absolute -bottom-1 -right-1 font-heading font-black rounded-full flex items-center justify-center text-white border border-white shadow-2xs ${
              size === 'xs'
                ? 'w-3 h-3 text-[7px]'
                : size === 'sm'
                ? 'w-3.5 h-3.5 text-[8px]'
                : 'w-4 h-4 text-[9px]'
            } ${config.bg}`}
          >
            {playerNumber}
          </span>
        )}
      </div>

      {showLabel && (
        <span className={`text-[11px] font-bold mt-1 text-center truncate max-w-[80px] ${config.text}`}>
          {name || config.label}
        </span>
      )}
    </div>
  );
};
