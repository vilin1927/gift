"use client";

import { motion } from "motion/react";
import { CONFIG } from "@/config";
import FallingLeaves from "../ui/FallingLeaves";

export default function LandingScreen({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const handleFancyOpen = () => {
    try {
      const audio = new Audio(CONFIG.soundFile);
      audio.play().catch(() => {});
    } catch {
      // sound not available — continue anyway
    }
    onContinue();
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 relative">
      <FallingLeaves />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="z-10 text-center"
      >
        <p className="text-text-secondary mb-10 text-sm">
          Анюта, у меня к тебе кое-что...
        </p>
        <div className="flex flex-col gap-4 w-64">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="bg-accent-gold text-bg-primary font-medium rounded-xl py-4 text-base transition-colors"
          >
            Открыть
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleFancyOpen}
            className="bg-bg-card border border-accent-gold/20 text-text-primary rounded-xl py-4 text-base transition-colors"
          >
            Открыть по-другому
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
