"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import SwipeCard from "./SwipeCard";

interface CardStackProps {
  answers: string[];
  correctIndex: number;
  isFirstQuestion: boolean;
  onAnswer: (selectedIndex: number) => void;
}

export default function CardStack({
  answers,
  correctIndex,
  isFirstQuestion,
  onAnswer,
}: CardStackProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);
  const remaining = answers.length - currentCard;

  const showHints = isFirstQuestion && !hasSwiped;

  const handleSwipeRight = useCallback(() => {
    setHasSwiped(true);
    try {
      navigator.vibrate?.(10);
    } catch {}
    onAnswer(currentCard);
  }, [currentCard, onAnswer]);

  const handleSwipeLeft = useCallback(() => {
    setHasSwiped(true);
    // If this is the last card (or second-to-last skip), auto-select last
    if (currentCard >= answers.length - 2) {
      // Auto-select the last remaining card
      const lastIndex = currentCard + 1 < answers.length ? currentCard + 1 : currentCard;
      onAnswer(lastIndex);
    } else {
      setCurrentCard((c) => c + 1);
    }
  }, [currentCard, answers.length, onAnswer]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Card area */}
      <div
        className="relative w-[85vw] max-w-[400px]"
        style={{ height: 160 }}
      >
        <AnimatePresence>
          {answers.slice(currentCard).map((answer, i) => (
            <SwipeCard
              key={`${currentCard + i}-${answer}`}
              answer={answer}
              stackIndex={i}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
              showHints={i === 0 && showHints}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Card dots */}
      <div className="flex gap-1.5">
        {answers.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentCard
                ? "bg-accent-gold"
                : i < currentCard
                  ? "bg-text-secondary/20"
                  : "bg-text-secondary/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
