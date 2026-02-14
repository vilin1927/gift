"use client";

import { motion } from "motion/react";
import PuzzleGrid from "../puzzle/PuzzleGrid";

export default function PuzzleScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-center"
      >
        <h2 className="font-heading text-2xl text-text-primary mb-2">
          Собери картинку
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          Нажимай на кусочки рядом с пустой клеткой
        </p>
        <PuzzleGrid onComplete={onComplete} />
      </motion.div>
    </div>
  );
}
