"use client";

export default function LandscapeOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-bg-primary flex items-center justify-center text-center p-8 portrait:hidden">
      <p className="text-text-secondary text-lg font-heading">
        Поверни телефон 📱
      </p>
    </div>
  );
}
