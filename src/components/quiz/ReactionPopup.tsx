"use client";

import { motion, AnimatePresence } from "motion/react";

interface ReactionPopupProps {
  message: string | null;
}

export default function ReactionPopup({ message }: ReactionPopupProps) {
  return (
    <div className="fixed top-16 left-0 right-0 flex justify-center z-30 pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-bg-card border border-accent-gold/20 rounded-xl px-5 py-3 shadow-lg"
          >
            <p className="text-text-primary text-sm whitespace-nowrap">
              {message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
