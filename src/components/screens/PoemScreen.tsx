"use client";

import { motion } from "motion/react";
import { CONFIG } from "@/config";
import FallingLeaves from "../ui/FallingLeaves";

interface PoemScreenProps {
  onRetake?: () => void;
}

export default function PoemScreen({ onRetake }: PoemScreenProps) {
  const lines = CONFIG.poemLines;

  const lastStrikeIdx = lines.reduce(
    (acc, l, i) => (l.strikethrough ? i : acc),
    -1
  );

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 relative">
      <FallingLeaves />
      <div className="z-10 max-w-sm text-center">
        <div className="space-y-3 mb-10">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: 0.2 + i * 0.15,
              }}
              className={`font-heading text-lg ${
                line.strikethrough
                  ? "line-through text-text-secondary/50"
                  : "text-text-primary"
              }`}
            >
              {line.text}
            </motion.p>
          ))}

          {lastStrikeIdx >= 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: 0.2 + lines.length * 0.15 + 0.1,
              }}
              className="pt-2"
            >
              <span className="inline-block bg-accent-gold/15 text-accent-gold text-xs px-3 py-1.5 rounded-full">
                {CONFIG.poemBadge}
              </span>
            </motion.div>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + lines.length * 0.15 + 0.3 }}
          className="text-text-secondary text-sm mb-8"
        >
          — Вова
        </motion.p>

        {onRetake && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + lines.length * 0.15 + 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRetake}
            className="bg-bg-card border border-accent-gold/20 text-text-secondary rounded-xl py-3 px-6 text-sm transition-colors"
          >
            Пройти заново
          </motion.button>
        )}
      </div>
    </div>
  );
}
