"use client";

import { useState, useCallback, useEffect } from "react";

const STATE_KEY = "anna_norm_quest";

export interface GameState {
  authenticated: boolean;
  puzzleCompleted: boolean;
  quizCompleted: boolean;
  quizScore: number;
  quizAnswers: number[];
  completedAt: string | null;
}

const DEFAULT_STATE: GameState = {
  authenticated: false,
  puzzleCompleted: false,
  quizCompleted: false,
  quizScore: 0,
  quizAnswers: [],
  completedAt: null,
};

function readState(): GameState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    // localStorage disabled or parse error — use defaults
  }
  return { ...DEFAULT_STATE };
}

function writeState(state: GameState) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or disabled — silent fail
  }
}

export function useGameState() {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(readState());
    setLoaded(true);
  }, []);

  const update = useCallback((patch: Partial<GameState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      writeState(next);
      return next;
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setState((prev) => {
      const next = {
        ...prev,
        puzzleCompleted: false,
        quizCompleted: false,
        quizScore: 0,
        quizAnswers: [],
        completedAt: null,
      };
      writeState(next);
      return next;
    });
  }, []);

  return { state, loaded, update, resetQuiz };
}
