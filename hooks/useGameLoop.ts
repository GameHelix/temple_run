// ─────────────────────────────────────────────────────────────────────────────
// hooks/useGameLoop.ts  –  requestAnimationFrame driver
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useCallback } from 'react';

type LoopCallback = (dt: number) => void;

export function useGameLoop(
  callback: LoopCallback,
  active: boolean
): void {
  const cbRef    = useRef<LoopCallback>(callback);
  const rafRef   = useRef<number>(0);
  const lastRef  = useRef<number>(0);

  // Always use the latest callback without restarting the loop
  cbRef.current = callback;

  const loop = useCallback((timestamp: number) => {
    // Cap delta to avoid huge jumps after tab-switch / background
    const dt = Math.min(timestamp - lastRef.current, 50);
    lastRef.current = timestamp;
    cbRef.current(dt);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, loop]);
}
