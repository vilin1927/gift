"use client";

import { motion } from "motion/react";
import FallingLeaves from "../ui/FallingLeaves";

interface WelcomeBackScreenProps {
  score: number;
  onRetake: () => void;
  onViewResult: () => void;
}

export default function WelcomeBackScreen({
  score,
  onRetake,
  onViewResult,
}: WelcomeBackScreenProps) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 relative">
      <FallingLeaves />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="z-10 bg-bg-card border border-accent-gold/20 rounded-2xl p-8 text-center max-w-sm w-full"
      >
        <h2 className="font-heading text-2xl text-text-primary mb-2">
          С возвращением, Ань!
        </h2>
        <p className="text-text-secondary text-sm mb-8">
          Твой результат: {score}/7
        </p>
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onViewResult}
            className="bg-accent-gold text-bg-primary font-medium rounded-xl py-3 text-sm transition-colors"
          >
            Посмотреть результат
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRetake}
            className="bg-bg-secondary border border-accent-gold/20 text-text-secondary rounded-xl py-3 text-sm transition-colors"
          >
            Пройти заново
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
