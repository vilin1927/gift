"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";

interface SwipeCardProps {
  answer: string;
  stackIndex: number;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  showHints: boolean;
}

const SWIPE_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 0.11;

export default function SwipeCard({
  answer,
  stackIndex,
  onSwipeRight,
  onSwipeLeft,
  showHints,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const rightOpacity = useTransform(x, [0, 80], [0, 1]);
  const leftOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (
      offset.x > SWIPE_THRESHOLD ||
      velocity.x > VELOCITY_THRESHOLD * 1000
    ) {
      onSwipeRight();
    } else if (
      offset.x < -SWIPE_THRESHOLD ||
      velocity.x < -VELOCITY_THRESHOLD * 1000
    ) {
      onSwipeLeft();
    }
  };

  const isTop = stackIndex === 0;

  return (
    <motion.div
      drag={isTop ? "x" : false}
      dragElastic={0.15}
      dragMomentum={false}
      onDragEnd={isTop ? handleDragEnd : undefined}
      style={isTop ? { x, rotate } : {}}
      initial={{
        scale: 1 - stackIndex * 0.05,
        y: stackIndex * 8,
        opacity: stackIndex < 3 ? 1 : 0,
      }}
      animate={{
        scale: 1 - stackIndex * 0.05,
        y: stackIndex * 8,
        opacity: stackIndex < 3 ? 1 : 0,
      }}
      exit={{
        x: x.get() > 0 ? 500 : -500,
        rotate: x.get() > 0 ? 20 : -20,
        opacity: 0,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`absolute inset-0 bg-bg-card border border-accent-gold/20 rounded-2xl p-6 flex items-center justify-center touch-pan-y select-none ${
        isTop ? "cursor-grab active:cursor-grabbing z-10" : ""
      }`}
    >
      {/* Directional tint overlays */}
      {isTop && (
        <>
          <motion.div
            style={{ opacity: rightOpacity }}
            className="absolute inset-0 rounded-2xl bg-accent-green/10 pointer-events-none"
          />
          <motion.div
            style={{ opacity: leftOpacity }}
            className="absolute inset-0 rounded-2xl bg-text-secondary/10 pointer-events-none"
          />
        </>
      )}

      <p className="text-text-primary text-center text-base relative z-10">
        {answer}
      </p>

      {/* Swipe hints on first card */}
      {isTop && showHints && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="absolute bottom-3 left-0 right-0 flex justify-between px-4 pointer-events-none"
        >
          <span className="text-text-secondary/40 text-xs">
            ← Пропустить
          </span>
          <span className="text-accent-gold/40 text-xs">Выбрать →</span>
        </motion.div>
      )}
    </motion.div>
  );
}
