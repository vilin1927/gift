"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { QUIZ_QUESTIONS, shuffleQuestion } from "@/data/quiz";
import { CONFIG } from "@/config";
import CardStack from "../quiz/CardStack";
import ReactionPopup from "../quiz/ReactionPopup";

interface QuizScreenProps {
  onComplete: (score: number, answers: number[]) => void;
}

export default function QuizScreen({ onComplete }: QuizScreenProps) {
  const questions = useMemo(
    () => QUIZ_QUESTIONS.map(shuffleQuestion),
    []
  );

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [reaction, setReaction] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const question = questions[currentQ];

  const handleAnswer = useCallback(
    (selectedCardIndex: number) => {
      if (transitioning) return;
      setTransitioning(true);

      const isCorrect = selectedCardIndex === question.correctIndex;
      const newScore = isCorrect ? score + 1 : score;
      const newResults = [...results, isCorrect ? 1 : 0];

      // Show reaction
      const pool = isCorrect ? CONFIG.correctReactions : CONFIG.wrongReactions;
      setReaction(pool[Math.floor(Math.random() * pool.length)]);

      setScore(newScore);
      setResults(newResults);

      // Advance after reaction
      setTimeout(() => {
        setReaction(null);
        if (currentQ + 1 >= questions.length) {
          onComplete(newScore, newResults);
        } else {
          setCurrentQ((q) => q + 1);
          setTransitioning(false);
        }
      }, 1500);
    },
    [transitioning, question, score, results, currentQ, questions.length, onComplete]
  );

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-8 relative">
      <ReactionPopup message={reaction} />

      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md flex flex-col items-center gap-8"
      >
        {/* Question */}
        <div className="text-center">
          <p className="text-text-secondary text-xs mb-3">
            {currentQ + 1} / {questions.length}
          </p>
          <h2 className="font-heading text-xl text-text-primary">
            {question.question}
          </h2>
        </div>

        {/* Cards */}
        <CardStack
          answers={question.answers}
          correctIndex={question.correctIndex}
          isFirstQuestion={currentQ === 0}
          onAnswer={handleAnswer}
        />
      </motion.div>
    </div>
  );
}
