"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import PuzzleGrid, { PuzzleGridHandle } from "../puzzle/PuzzleGrid";

export default function PuzzleScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const gridRef = useRef<PuzzleGridHandle>(null);
  const wasAutoSolve = useRef(false);
  const [showHintBtn, setShowHintBtn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [autoSolving, setAutoSolving] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Show hint button after 60 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHintBtn(true), 60_000);
    return () => clearTimeout(timer);
  }, []);

  const handlePopupSubmit = () => {
    if (inputValue.trim().toLowerCase() === "я тебя люблю") {
      setShowPopup(false);
      setInputValue("");
      setInputError(false);
      setAutoSolving(true);
      setShowHintBtn(false);
      wasAutoSolve.current = true;

      // Let the grid animate the solve
      gridRef.current?.autoSolve();
    } else {
      setInputError(true);
    }
  };

  // When puzzle finishes — either manual or auto-solve
  const handlePuzzleComplete = () => {
    if (wasAutoSolve.current) {
      setAutoSolving(false);
      setTimeout(() => setShowNext(true), 400);
    } else {
      onComplete();
    }
  };

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
        <PuzzleGrid
          ref={gridRef}
          onComplete={handlePuzzleComplete}
          disabled={autoSolving}
        />

        {/* "I don't know how" hint button — appears after 1 min */}
        <AnimatePresence>
          {showHintBtn && !autoSolving && !showNext && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowPopup(true)}
              className="mt-8 text-text-secondary/60 text-sm underline underline-offset-4 decoration-text-secondary/30 hover:text-text-secondary transition-colors"
            >
              я хз как
            </motion.button>
          )}
        </AnimatePresence>

        {/* "Next step" button after auto-solve */}
        <AnimatePresence>
          {showNext && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={onComplete}
              className="mt-8 px-8 py-3 bg-accent-gold text-bg-primary font-heading text-lg rounded-xl"
            >
              наконец-то 🎉
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Popup overlay */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-bg-card border border-border-subtle rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-text-secondary/50 hover:text-text-secondary text-xl leading-none p-1"
              >
                &times;
              </button>

              <p className="text-text-primary font-heading text-lg mb-1 text-center">
                Ладно, подскажу
              </p>
              <div className="text-text-secondary text-sm mb-5 text-center">
                <span>Ты знаешь, что написать 💛</span>
                {!showAnswer ? (
                  <button
                    onClick={() => {
                      setShowAnswer(true);
                      setTimeout(() => setShowAnswer(false), 3000);
                    }}
                    className="ml-2 text-accent-gold/70 underline underline-offset-2 text-xs"
                  >
                    что?
                  </button>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-accent-gold font-heading text-base"
                  >
                    я тебя люблю
                  </motion.p>
                )}
              </div>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setInputError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handlePopupSubmit()}
                placeholder="напиши сюда..."
                autoFocus
                className={`w-full bg-bg-primary border ${
                  inputError
                    ? "border-red-400/60 ring-1 ring-red-400/30"
                    : "border-border-subtle focus:border-accent-gold/50"
                } rounded-xl px-4 py-3 text-text-primary text-center outline-none transition-colors`}
              />

              {inputError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400/80 text-xs mt-2 text-center"
                >
                  Не то... попробуй ещё раз
                </motion.p>
              )}

              <button
                onClick={handlePopupSubmit}
                className="mt-4 w-full py-3 bg-accent-gold text-bg-primary font-heading rounded-xl text-base"
              >
                Подтвердить
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
