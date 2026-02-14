"use client";

import { useState, useRef, useEffect } from "react";
import { CONFIG } from "@/config";
import FallingLeaves from "../ui/FallingLeaves";

const WRONG_MESSAGES = [
  "Это не ты, Ань?",
  "Попробуй ещё раз 🤔",
  "Не-а...",
  "Владимир бы расстроился",
];

export default function PasswordScreen({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === CONFIG.password.toLowerCase()) {
      onSuccess();
    } else {
      setError(WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)]);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setValue("");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 relative">
      <FallingLeaves />
      <form onSubmit={handleSubmit} className="w-full max-w-sm z-10">
        <p className="text-center text-text-secondary mb-6 text-sm">
          Введи пароль, который дал тебе Владимир
        </p>
        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full bg-bg-card border border-accent-gold/20 rounded-xl px-4 py-3 text-center text-text-primary placeholder-text-secondary/50 outline-none focus:border-accent-gold/50 transition-colors ${
            shaking ? "animate-shake" : ""
          }`}
          placeholder="••••••"
          autoComplete="off"
        />
        {error && (
          <p className="text-accent-red text-center text-sm mt-3 animate-fade-in">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full mt-4 bg-accent-gold/20 hover:bg-accent-gold/30 text-accent-gold rounded-xl py-3 text-sm transition-colors active:scale-[0.97]"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
