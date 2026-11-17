import {Easing, interpolate} from 'remotion';

/** SF6 V2 smoothstep, now available without copying the SVG generator. */
export const smoothStep = (value: number) => {
  const t=Math.max(0,Math.min(1,value));
  return t*t*(3-2*t);
};

/** All helpers take explicit time: deterministic seek/render, no CSS animation. */
export const motionProgress = (frame: number, from: number, to: number) => {
  if (to <= from) return frame < from ? 0 : 1;
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
};
export const loopPhase = (seconds: number, period = 3, offset = 0) => {
  if (period <= 0) throw new Error('Animation period must be positive.');
  return ((seconds / period + offset) % 1 + 1) % 1;
};
export const bob = (seconds: number, amplitude = 4, period = 3) => Math.sin(loopPhase(seconds, period) * Math.PI * 2) * amplitude;
