/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingPointItem } from '../types/game';
import { Sparkles, TrendingDown, Star } from 'lucide-react';

interface FloatingPointsOverlayProps {
  items: FloatingPointItem[];
  className?: string;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  color: string;
  shape: 'star' | 'circle' | 'diamond';
}

const POSITIVE_COLORS = ['#FBBF24', '#34D399', '#60A5FA', '#F472B6', '#FCD34D'];
const NEGATIVE_COLORS = ['#EF4444', '#F87171', '#FB923C', '#DC2626', '#B91C1C'];

const generateParticles = (isPositive: boolean, count: number = 10): Particle[] => {
  const colors = isPositive ? POSITIVE_COLORS : NEGATIVE_COLORS;
  const particles: Particle[] = [];
  const angleStep = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    // Slight jitter in angle and distance for organic burst feel
    const angle = i * angleStep + (Math.random() - 0.5) * 0.4;
    const distance = isPositive ? 26 + Math.random() * 28 : 22 + Math.random() * 26;
    const size = 3 + Math.random() * 4;
    const delay = Math.random() * 0.12;
    const color = colors[i % colors.length];
    const shape: 'star' | 'circle' | 'diamond' =
      i % 3 === 0 ? 'star' : i % 3 === 1 ? 'diamond' : 'circle';

    particles.push({ id: i, angle, distance, size, delay, color, shape });
  }
  return particles;
};

export const FloatingPointsOverlay: React.FC<FloatingPointsOverlayProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`pointer-events-none relative ${className}`}>
      <AnimatePresence>
        {items.map((item) => {
          const isPositive = item.points > 0;
          return <FloatingBadgeItem key={item.id} item={item} isPositive={isPositive} />;
        })}
      </AnimatePresence>
    </div>
  );
};

const FloatingBadgeItem: React.FC<{ item: FloatingPointItem; isPositive: boolean }> = ({ item, isPositive }) => {
  const particles = useMemo(() => generateParticles(isPositive, 10), [isPositive]);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 -top-3 z-50 pointer-events-none flex items-center justify-center">
      {/* Expanding Ripple Glow Halo */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0.9 }}
        animate={{ scale: [0.3, 1.8, 2.4], opacity: [0.9, 0.4, 0] }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className={`absolute w-12 h-12 rounded-full pointer-events-none ${
          isPositive ? 'bg-emerald-400/30 blur-xs' : 'bg-rose-500/30 blur-xs'
        }`}
      />

      {/* Particle Burst Effects */}
      {particles.map((p) => {
        const targetX = Math.cos(p.angle) * p.distance;
        // Negative points drift slightly downwards like shattered drops
        const targetY = isPositive
          ? Math.sin(p.angle) * p.distance
          : Math.sin(p.angle) * p.distance + 14;

        return (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{
              x: targetX,
              y: targetY,
              scale: [0, 1.4, 0.8, 0],
              opacity: [0, 1, 0.9, 0],
              rotate: [0, 180 + p.id * 45],
            }}
            transition={{
              duration: 1.3,
              delay: p.delay,
              ease: [0.25, 1, 0.5, 1],
            }}
            style={{ width: p.size, height: p.size }}
            className="absolute rounded-full pointer-events-none flex items-center justify-center"
          >
            {p.shape === 'star' ? (
              <span style={{ color: p.color }} className="text-[10px] leading-none drop-shadow-xs select-none">
                ★
              </span>
            ) : p.shape === 'diamond' ? (
              <span
                style={{ backgroundColor: p.color }}
                className="w-full h-full rotate-45 rounded-2xs shadow-xs"
              />
            ) : (
              <span
                style={{ backgroundColor: p.color }}
                className="w-full h-full rounded-full shadow-xs"
              />
            )}
          </motion.div>
        );
      })}

      {/* Main Floating Badge with Zoom-In, Bounce, and Smooth Float */}
      <motion.div
        initial={{ opacity: 0, scale: 0.15, y: 16 }}
        animate={
          isPositive
            ? {
                opacity: [0, 1, 1, 1, 0],
                scale: [0.15, 1.4, 0.95, 1.05, 0.9],
                y: [16, -22, -38, -52, -68],
                rotate: [-8, 6, -2, 0, 0],
              }
            : {
                opacity: [0, 1, 1, 1, 0],
                scale: [0.15, 1.35, 0.92, 1.02, 0.88],
                x: [0, -6, 6, -4, 4, -2, 0],
                y: [16, -18, -32, -46, -60],
              }
        }
        exit={{ opacity: 0, scale: 0.5, y: -72 }}
        transition={{
          duration: 2.1,
          times: [0, 0.22, 0.45, 0.8, 1],
          ease: 'easeOut',
        }}
        className={`relative pointer-events-none px-3 py-1 rounded-full font-heading font-black text-xs sm:text-sm shadow-2xl border-2 border-white flex items-center gap-1.5 select-none whitespace-nowrap overflow-hidden ${
          isPositive
            ? 'bg-linear-to-r from-emerald-500 via-teal-500 to-green-600 text-white ring-4 ring-emerald-300/80 shadow-emerald-500/50'
            : 'bg-linear-to-r from-rose-600 via-red-600 to-amber-700 text-white ring-4 ring-rose-400/80 shadow-rose-600/50'
        }`}
      >
        {/* Shimmer Light Streak on Badge */}
        <motion.div
          initial={{ x: '-120%' }}
          animate={{ x: '220%' }}
          transition={{ duration: 0.9, delay: 0.15, ease: 'easeInOut' }}
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
        />

        {isPositive ? (
          <>
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="text-amber-200 shrink-0"
            >
              <Sparkles className="w-4 h-4 fill-amber-300 text-amber-200 drop-shadow-xs" />
            </motion.div>
            <span className="tracking-wide drop-shadow-md">
              +{item.points} <span className="text-[10px] font-bold opacity-90">POIN</span>
            </span>
          </>
        ) : (
          <>
            <motion.div
              animate={{ y: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="text-rose-100 shrink-0"
            >
              <TrendingDown className="w-4 h-4 drop-shadow-xs" />
            </motion.div>
            <span className="tracking-wide drop-shadow-md">
              {item.points} <span className="text-[10px] font-bold opacity-90">POIN</span>
            </span>
          </>
        )}
      </motion.div>
    </div>
  );
};
