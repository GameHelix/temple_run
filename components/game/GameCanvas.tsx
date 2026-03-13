'use client';
// ─────────────────────────────────────────────────────────────────────────────
// components/game/GameCanvas.tsx  –  Canvas + game loop wiring
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useCallback, useState } from 'react';
import { useGameLoop }   from '@/hooks/useGameLoop';
import { useInput }      from '@/hooks/useInput';
import { initGameState, updateGame } from '@/lib/game/engine';
import { render }        from '@/lib/game/renderer';
import { initAudio, startMusic, stopMusic, playSfx, setMusicVolume, setSfxVolume } from '@/lib/game/audio';
import type { GameState, Difficulty } from '@/types/game';

interface LiveState {
  score: number; distance: number; coins: number;
  lives: number; multiplier: number; speed: number;
}

interface Props {
  difficulty:   Difficulty;
  highScore:    number;
  onGameOver:   (score: number, distance: number, coins: number) => void;
  onPause:      () => void;
  isPaused:     boolean;
  soundOn:      boolean;
  onLiveState:  (s: LiveState) => void;
}

export default function GameCanvas({
  difficulty, highScore, onGameOver, onPause, isPaused, soundOn, onLiveState,
}: Props) {
  const hudTimer = useRef(0);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef<GameState>(initGameState(difficulty, highScore));
  const { consumeInput, fireInput } = useInput();
  const [started, setStarted] = useState(false);

  // ── Resize canvas to fill container ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // ── Audio init & sounds on state change ────────────────────────────────────
  useEffect(() => {
    initAudio();
    setMusicVolume(soundOn ? 0.18 : 0);
    setSfxVolume(soundOn ? 0.4 : 0);
  }, [soundOn]);

  // ── Restart / re-init when difficulty changes ───────────────────────────────
  useEffect(() => {
    stateRef.current = initGameState(difficulty, highScore);
    stateRef.current.status = 'playing';
    setStarted(true);
    if (soundOn) startMusic();
  }, [difficulty, highScore]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Main loop ───────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;

    // Handle pause toggle
    const input = consumeInput();
    if (input.pause) {
      onPause();
      return;
    }

    // Handle starting countdown  →  just go straight to playing
    if (state.status === 'starting') {
      state.status = 'playing';
    }

    if (!isPaused && state.status === 'playing') {
      // Sound cues (sample once per frame before update)
      const prevAction = state.player.action;
      const prevCoins  = state.coins;

      updateGame(state, input);

      // Trigger SFX on state changes
      if (soundOn) {
        if (state.player.action !== prevAction) {
          if (state.player.action === 'jumping')  playSfx('jump');
          if (state.player.action === 'sliding')  playSfx('slide');
          if (state.player.action === 'stumbling') playSfx('hit');
        }
        if (state.coins > prevCoins) playSfx('coin');
        if (state.turnWarning?.completed && state.turnWarning.timer === state.turnWarning.maxTimer - 1) {
          playSfx('turn');
        }
      }

      // Report live state to HUD every ~4 frames
      hudTimer.current++;
      if (hudTimer.current >= 4) {
        hudTimer.current = 0;
        onLiveState({
          score: Math.floor(state.score),
          distance: state.distance,
          coins: state.coins,
          lives: state.lives,
          multiplier: state.scoreMultiplier,
          speed: state.speed,
        });
      }

    }

    // Game over check (outside the 'playing' guard so it fires even after updateGame sets it)
    if (state.status === 'gameover' && !isPaused) {
      stopMusic();
      if (soundOn) playSfx('gameover');
      onGameOver(
        Math.floor(state.score),
        Math.floor(state.distance),
        state.coins
      );
      // Prevent repeated calls
      state.status = 'menu' as typeof state.status;
    }

    render(ctx, canvas, state);
  }, [consumeInput, isPaused, onGameOver, onPause, soundOn]);

  useGameLoop(tick, started);

  // ── Mobile on-screen button handlers ────────────────────────────────────────
  const btn = (key: 'left' | 'right' | 'up' | 'down') => () => fireInput(key);

  return (
    <div className="relative w-full h-full select-none">
      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: 'none', imageRendering: 'pixelated' }}
      />

      {/* Mobile control buttons */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-between items-end px-4 pointer-events-none md:hidden">
        {/* Left / Right */}
        <div className="flex gap-3 pointer-events-auto">
          <MobileBtn label="◀" onPress={btn('left')}  color="cyan" />
          <MobileBtn label="▶" onPress={btn('right')} color="cyan" />
        </div>
        {/* Jump / Slide */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          <MobileBtn label="▲ JUMP"  onPress={btn('up')}   color="purple" />
          <MobileBtn label="▼ SLIDE" onPress={btn('down')} color="orange" />
        </div>
      </div>

      {/* Pause button (top-right) */}
      <button
        onClick={onPause}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-sm font-mono
                   bg-black/30 backdrop-blur-sm border border-white/10 rounded px-3 py-1.5
                   transition-colors active:scale-95"
      >
        ⏸ PAUSE
      </button>
    </div>
  );
}

// ── Small mobile control button ───────────────────────────────────────────────

function MobileBtn({
  label, onPress, color,
}: {
  label: string;
  onPress: () => void;
  color: 'cyan' | 'purple' | 'orange';
}) {
  const palette = {
    cyan:   'border-cyan-400   text-cyan-300   active:bg-cyan-400/30',
    purple: 'border-purple-400 text-purple-300 active:bg-purple-400/30',
    orange: 'border-orange-400 text-orange-300 active:bg-orange-400/30',
  }[color];

  return (
    <button
      onTouchStart={e => { e.preventDefault(); onPress(); }}
      onClick={onPress}
      className={`
        w-14 h-14 rounded-xl border-2 font-bold text-xs font-mono
        bg-black/40 backdrop-blur-sm transition-all active:scale-95
        ${palette}
      `}
    >
      {label}
    </button>
  );
}
