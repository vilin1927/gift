"use client";

import { useMemo } from "react";
import { useReducedMotion } from "motion/react";

const EMOJIS = ["🍂", "🍁", "🌿"];

export default function FallingLeaves() {
  const reducedMotion = useReducedMotion();

  const leaves = useMemo(() => {
    const count = reducedMotion ? 3 : 12;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: Math.random() * 100,
      duration: 8 + Math.random() * 7,
      delay: Math.random() * 10,
      size: 16 + Math.random() * 10,
    }));
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        {leaves.map((leaf) => (
          <span
            key={leaf.id}
            className="fixed opacity-20"
            style={{
              left: `${leaf.left}%`,
              top: `${20 + leaf.id * 25}%`,
              fontSize: leaf.size,
            }}
          >
            {leaf.emoji}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          className="fixed animate-fall motion-reduce:hidden"
          style={{
            left: `${leaf.left}%`,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
            fontSize: leaf.size,
          }}
        >
          {leaf.emoji}
        </span>
      ))}
    </div>
  );
}
