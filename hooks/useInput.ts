// ─────────────────────────────────────────────────────────────────────────────
// hooks/useInput.ts  –  Keyboard + touch swipe → single-frame InputState pulses
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useCallback } from 'react';
import type { InputState } from '../types/game';

const SWIPE_THRESHOLD = 30; // px minimum swipe distance

export function useInput(): {
  consumeInput: () => InputState;
  fireInput:    (key: keyof InputState) => void;
} {
  // Queue of pending one-frame inputs
  const queue = useRef<Partial<InputState>>({});

  const fire = useCallback((key: keyof InputState) => {
    queue.current[key] = true;
  }, []);

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':  case 'KeyA': fire('left');    break;
        case 'ArrowRight': case 'KeyD': fire('right');   break;
        case 'ArrowUp':    case 'KeyW': case 'Space': fire('up'); break;
        case 'ArrowDown':  case 'KeyS': fire('down');   break;
        case 'KeyP':       case 'Escape':              fire('pause');  break;
      }
      // Prevent page scroll with arrow/space
      if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [fire]);

  // ── Touch swipe ────────────────────────────────────────────────────────────
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let active = false;

    const ts = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      startX = t.clientX;
      startY = t.clientY;
      active = true;
    };
    const te = (e: TouchEvent) => {
      if (!active) return;
      active = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);

      if (Math.max(adx, ady) < SWIPE_THRESHOLD) return;

      if (adx > ady) {
        fire(dx < 0 ? 'left' : 'right');
      } else {
        fire(dy < 0 ? 'up' : 'down');
      }
    };

    window.addEventListener('touchstart', ts, { passive: true });
    window.addEventListener('touchend',   te, { passive: true });
    return () => {
      window.removeEventListener('touchstart', ts);
      window.removeEventListener('touchend',   te);
    };
  }, [fire]);

  // ── Consumer ───────────────────────────────────────────────────────────────
  const consumeInput = useCallback((): InputState => {
    const snap = { ...queue.current } as InputState;
    queue.current = {};
    return snap;
  }, []);

  return { consumeInput, fireInput: fire };
}
