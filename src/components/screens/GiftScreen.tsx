"use client";

import { motion } from "motion/react";
import { CONFIG } from "@/config";
import Certificate from "../ui/Certificate";

interface GiftScreenProps {
  score: number;
  onContinue?: () => void;
}

function getScoreMessage(score: number): string {
  if (score <= 2) return CONFIG.scoreMessages.low;
  if (score <= 5) return CONFIG.scoreMessages.mid;
  return CONFIG.scoreMessages.high;
}

export default function GiftScreen({ score, onContinue }: GiftScreenProps) {
  const message = getScoreMessage(score);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-text-secondary text-sm text-center"
        >
          Твой результат: {score}/7
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="text-text-primary text-center text-base"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
          className="w-full"
        >
          <Certificate />
        </motion.div>

        {onContinue && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="bg-accent-gold/20 hover:bg-accent-gold/30 text-accent-gold rounded-xl py-3 px-8 text-sm transition-colors"
          >
            Дальше →
          </motion.button>
        )}
      </div>
    </div>
  );
}
