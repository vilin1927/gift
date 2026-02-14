"use client";

import { motion } from "motion/react";
import type { Screen } from "../App";

const TABS: { id: Screen; label: string; icon: string }[] = [
  { id: "gift", label: "Подарок", icon: "🎁" },
  { id: "gallery", label: "Фото", icon: "📸" },
  { id: "poem", label: "Стих", icon: "✍️" },
];

interface BottomNavProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
  onRetake: () => void;
}

export default function BottomNav({
  current,
  onNavigate,
  onRetake,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-bg-secondary/90 backdrop-blur-md border-t border-accent-gold/10 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around max-w-md mx-auto h-14">
        {TABS.map((tab) => {
          const active = current === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                active ? "text-accent-gold" : "text-text-secondary/60"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="text-[10px]">{tab.label}</span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 h-0.5 w-8 bg-accent-gold rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
        <button
          onClick={onRetake}
          className="flex flex-col items-center gap-0.5 px-4 py-1 text-text-secondary/60 transition-colors"
        >
          <span className="text-base">🔄</span>
          <span className="text-[10px]">Заново</span>
        </button>
      </div>
    </nav>
  );
}
