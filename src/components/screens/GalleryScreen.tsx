"use client";

import { motion } from "motion/react";
import { CONFIG } from "@/config";
import MasonryGallery from "../ui/MasonryGallery";

interface GalleryScreenProps {
  onContinue?: () => void;
}

export default function GalleryScreen({ onContinue }: GalleryScreenProps) {
  if (CONFIG.media.length === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-8">
        <p className="text-text-secondary text-sm mb-6">
          Фотографии скоро появятся...
        </p>
        {onContinue && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="bg-accent-gold/20 hover:bg-accent-gold/30 text-accent-gold rounded-xl py-3 px-8 text-sm transition-colors"
          >
            Дальше →
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-dvh px-4 py-8 pb-24">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="font-heading text-2xl text-center text-text-primary mb-6"
      >
        Наши моменты
      </motion.h2>
      <MasonryGallery items={CONFIG.media} />
      {CONFIG.galleryFooter && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-text-secondary text-sm text-center mt-6 italic"
        >
          {CONFIG.galleryFooter}
        </motion.p>
      )}
      {onContinue && (
        <div className="flex justify-center mt-8">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="bg-accent-gold/20 hover:bg-accent-gold/30 text-accent-gold rounded-xl py-3 px-8 text-sm transition-colors"
          >
            Дальше →
          </motion.button>
        </div>
      )}
    </div>
  );
}
