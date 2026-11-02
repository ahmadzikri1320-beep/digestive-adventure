/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingPointItem } from '../types/game';
import { Sparkles, TrendingDown } from 'lucide-react';

interface FloatingPointsOverlayProps {
  items: FloatingPointItem[];
  className?: string;
}

export const FloatingPointsOverlay: React.FC<FloatingPointsOverlayProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`pointer-events-none relative ${className}`}>
      <AnimatePresence>
        {items.map((item) => {
          const isPositive = item.points > 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12, scale: 0.5 }}
              animate={{ opacity: 1, y: -30, scale: 1.25 }}
              exit={{ opacity: 0, y: -54, scale: 0.8 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              className={`absolute left-1/2 -translate-x-1/2 -top-2 z-50 pointer-events-none px-2.5 py-0.5 rounded-full font-heading font-black text-xs sm:text-sm shadow-xl border-2 border-white flex items-center gap-1 select-none whitespace-nowrap ${
                isPositive
                  ? 'bg-linear-to-r from-emerald-500 to-green-600 text-white ring-3 ring-emerald-300 shadow-emerald-500/40'
                  : 'bg-linear-to-r from-rose-600 to-red-600 text-white ring-3 ring-rose-300 shadow-rose-500/40'
              }`}
            >
              {isPositive ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
                  <span>+{item.points}</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3.5 h-3.5 text-rose-100" />
                  <span>{item.points}</span>
                </>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
