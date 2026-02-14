"use client";

import { CONFIG } from "@/config";

export default function Certificate() {
  const { title, studio, date, address, details } = CONFIG.certificate;

  return (
    <div className="rounded-xl border-2 border-accent-gold p-8 text-center bg-gradient-to-br from-bg-card to-[#3a2f28] animate-glow-pulse">
      <p className="font-heading text-accent-gold text-sm tracking-[0.3em] uppercase mb-6">
        Сертификат
      </p>
      <h3 className="font-heading text-2xl text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm mb-6">{studio}</p>
      <div className="space-y-1 text-text-primary text-sm">
        <p>{date}</p>
        <p>{address}</p>
      </div>
      <p className="mt-6 text-text-secondary text-xs">{details}</p>
    </div>
  );
}
