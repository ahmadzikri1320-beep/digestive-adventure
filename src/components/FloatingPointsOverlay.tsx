/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { FloatingPointItem } from '../types/game';
import { Sparkles, TrendingDown, Star, Zap, Award } from 'lucide-react';

interface FloatingPointsOverlayProps {
  items: FloatingPointItem[];
  className?: string;
}

interface D3Particle {
  id: number;
  startX: number;
  startY: number;
  midX: number;
  midY: number;
  endX: number;
  endY: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  glowColor: string;
  shape: 'star' | 'diamond' | 'circle' | 'sparkle';
  rotation: number;
}

// Generate dynamic particle trajectories using D3 scales and parametric fountain physics
const generateD3Particles = (isPositive: boolean, count: number = 16): D3Particle[] => {
  const particles: D3Particle[] = [];
  const colorScale = isPositive
    ? d3.scaleLinear<string>()
        .domain([0, 0.25, 0.5, 0.75, 1])
        .range(['#10B981', '#34D399', '#FBBF24', '#F59E0B', '#06B6D4'])
    : d3.scaleLinear<string>()
        .domain([0, 0.33, 0.66, 1])
        .range(['#EF4444', '#F43F5E', '#FB923C', '#DC2626']);

  const angleStep = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    // Angular jitter for natural organic burst
    const angle = i * angleStep + (Math.random() - 0.5) * 0.45;
    const burstDistance = isPositive ? 28 + Math.random() * 32 : 24 + Math.random() * 28;
    
    // Midpoint trajectory (burst apex)
    const midX = Math.cos(angle) * burstDistance;
    const midY = Math.sin(angle) * burstDistance - (isPositive ? 16 + Math.random() * 12 : -8);

    // Endpoint trajectory (gravity drift & buoyant rise)
    const endX = midX * (1.2 + Math.random() * 0.4) + (Math.random() - 0.5) * 16;
    const endY = isPositive ? midY - (22 + Math.random() * 26) : midY + (20 + Math.random() * 24);

    const t = i / count;
    const color = colorScale(t);
    const glowColor = isPositive ? 'rgba(52, 211, 153, 0.6)' : 'rgba(239, 68, 68, 0.6)';
    const size = 3.5 + Math.random() * 5.5;
    const delay = Math.random() * 0.14;
    const duration = 1.4 + Math.random() * 0.6;
    const rotation = (Math.random() - 0.5) * 720;

    const shapes: Array<'star' | 'diamond' | 'circle' | 'sparkle'> = ['star', 'diamond', 'circle', 'sparkle'];
    const shape = shapes[i % shapes.length];

    particles.push({
      id: i,
      startX: 0,
      startY: 0,
      midX,
      midY,
      endX,
      endY,
      size,
      delay,
      duration,
      color,
      glowColor,
      shape,
      rotation,
    });
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
          return <DynamicFloatingBadge key={item.id} item={item} isPositive={isPositive} />;
        })}
      </AnimatePresence>
    </div>
  );
};

const DynamicFloatingBadge: React.FC<{ item: FloatingPointItem; isPositive: boolean }> = ({
  item,
  isPositive,
}) => {
  const particles = useMemo(() => generateD3Particles(isPositive, 16), [isPositive]);

  // Dynamic D3 trajectory keyframes for badge ascent
  const badgeX = isPositive ? [0, 8, -6, 5, -2, 0] : [0, -6, 6, -4, 3, 0];
  const badgeY = isPositive
    ? [14, -28, -52, -74, -96, -118]
    : [14, -18, -34, -48, -64, -78];

  return (
    <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-50 pointer-events-none flex items-center justify-center">
      {/* 1. Luminous Expanding Shockwave Ring (D3 Radial Wave) */}
      <motion.div
        initial={{ scale: 0.15, opacity: 0.95 }}
        animate={{ scale: [0.15, 1.8, 2.7], opacity: [0.95, 0.45, 0] }}
        transition={{ duration: 1.35, ease: 'easeOut' }}
        className={`absolute w-16 h-16 rounded-full pointer-events-none border-2 ${
          isPositive
            ? 'border-emerald-400 bg-linear-to-r from-emerald-400/30 via-teal-300/25 to-amber-300/30 blur-[2px]'
            : 'border-rose-500 bg-linear-to-r from-rose-600/30 via-red-500/25 to-amber-600/30 blur-[2px]'
        }`}
      />

      {/* 2. Secondary High-Speed Spark Halo */}
      <motion.div
        initial={{ scale: 0.1, opacity: 1, rotate: 0 }}
        animate={{ scale: [0.1, 1.5, 2.1], opacity: [1, 0.6, 0], rotate: isPositive ? 180 : -180 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className={`absolute w-10 h-10 rounded-full pointer-events-none ${
          isPositive ? 'bg-amber-300/40 blur-xs' : 'bg-red-400/40 blur-xs'
        }`}
      />

      {/* 3. D3 Dynamic Multi-Particle Fountain (16 Particles with Math Curves) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.startX, y: p.startY, scale: 0, opacity: 0 }}
          animate={{
            x: [p.startX, p.midX, p.endX],
            y: [p.startY, p.midY, p.endY],
            scale: [0, 1.5, 0.9, 0],
            opacity: [0, 1, 0.85, 0],
            rotate: [0, p.rotation],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1], // D3 cubic ease
          }}
          style={{
            width: p.size,
            height: p.size,
            filter: `drop-shadow(0 0 5px ${p.glowColor})`,
          }}
          className="absolute rounded-full pointer-events-none flex items-center justify-center select-none"
        >
          {p.shape === 'star' ? (
            <span style={{ color: p.color }} className="text-[12px] leading-none drop-shadow-sm">
              ★
            </span>
          ) : p.shape === 'diamond' ? (
            <span
              style={{ backgroundColor: p.color }}
              className="w-full h-full rotate-45 rounded-2xs shadow-sm"
            />
          ) : p.shape === 'sparkle' ? (
            <span style={{ color: p.color }} className="text-[11px] leading-none font-bold">
              ✦
            </span>
          ) : (
            <span
              style={{ backgroundColor: p.color }}
              className="w-full h-full rounded-full ring-1 ring-white/60 shadow-sm"
            />
          )}
        </motion.div>
      ))}

      {/* 4. Main Colorful 3D Floating Point Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.1, y: 16 }}
        animate={{
          opacity: [0, 1, 1, 1, 0],
          scale: [0.1, 1.45, 0.95, 1.06, 0.9],
          x: badgeX,
          y: badgeY,
          rotate: isPositive ? [-10, 8, -4, 2, 0] : [0, -8, 8, -4, 0],
        }}
        exit={{ opacity: 0, scale: 0.4, y: isPositive ? -130 : -90 }}
        transition={{
          duration: 2.5,
          times: [0, 0.18, 0.45, 0.75, 1],
          ease: 'easeOut',
        }}
        className={`relative pointer-events-none px-3.5 py-1.5 rounded-full font-heading font-black text-xs sm:text-sm shadow-2xl border-2 sm:border-3 border-white flex items-center gap-1.5 select-none whitespace-nowrap overflow-hidden transition-all ${
          isPositive
            ? 'bg-linear-to-r from-emerald-500 via-teal-500 to-amber-500 text-white ring-4 ring-emerald-300/90 shadow-emerald-500/60'
            : 'bg-linear-to-r from-rose-600 via-red-600 to-orange-700 text-white ring-4 ring-rose-400/90 shadow-rose-600/60'
        }`}
      >
        {/* Prismatic Shimmer Sweep Animation */}
        <motion.div
          initial={{ x: '-150%' }}
          animate={{ x: '250%' }}
          transition={{ duration: 1.1, repeat: 1, repeatDelay: 0.2, ease: 'easeInOut' }}
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none"
        />

        {isPositive ? (
          <>
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="text-amber-200 shrink-0 drop-shadow-sm flex items-center"
            >
              <Sparkles className="w-4 h-4 fill-amber-300 text-amber-200" />
            </motion.div>
            <span className="tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] flex items-center gap-1">
              <span className="text-sm sm:text-base font-black text-amber-100">+{item.points}</span>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-100">
                POIN
              </span>
            </span>
            <motion.span
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-[11px] select-none"
            >
              ✨
            </motion.span>
          </>
        ) : (
          <>
            <motion.div
              animate={{ y: [-1, 2, -1], rotate: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-rose-100 shrink-0 drop-shadow-sm flex items-center"
            >
              <TrendingDown className="w-4 h-4" />
            </motion.div>
            <span className="tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] flex items-center gap-1">
              <span className="text-sm sm:text-base font-black text-rose-100">{item.points}</span>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-rose-200">
                POIN
              </span>
            </span>
            <span className="text-[11px] select-none">💥</span>
          </>
        )}
      </motion.div>
    </div>
  );
};
