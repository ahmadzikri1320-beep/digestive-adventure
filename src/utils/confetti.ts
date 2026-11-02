/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import confetti from 'canvas-confetti';

/**
 * Grand Victory Celebration:
 * Multi-stage firework cannons, golden stars, and vibrant colorful ribbons
 * designed to celebrate reaching Kotak 28 (Finish) with high delight.
 */
export function fireVictoryConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Stage 1: Immediate explosive center fountain
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#FCD34D', '#F43F5E', '#34D399', '#60A5FA'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#F59E0B', '#E11D48', '#059669', '#4F46E5'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    shapes: ['circle'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });

  // Stage 2: Left & Right side cannons firing diagonally inward across the screen
  const end = Date.now() + 2500;
  const colors = ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#F97316'];

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 28,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 28,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
      zIndex: 9999,
    });
  }, 220);
}

/**
 * Mini Celebration for earning badges, bonus points, or completing missions.
 */
export function fireMiniConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
    zIndex: 9999,
  });
}
