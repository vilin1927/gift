"use client";

import { AnimatePresence, motion } from "motion/react";
import { useGameState } from "@/hooks/useGameState";
import PasswordScreen from "./screens/PasswordScreen";
import LandingScreen from "./screens/LandingScreen";
import PuzzleScreen from "./screens/PuzzleScreen";
import QuizScreen from "./screens/QuizScreen";
import GiftScreen from "./screens/GiftScreen";
import GalleryScreen from "./screens/GalleryScreen";
import PoemScreen from "./screens/PoemScreen";
import WelcomeBackScreen from "./screens/WelcomeBackScreen";
import BottomNav from "./ui/BottomNav";
import { useState, useEffect } from "react";
import LandscapeOverlay from "./ui/LandscapeOverlay";

export type Screen =
  | "password"
  | "welcome-back"
  | "landing"
  | "puzzle"
  | "quiz"
  | "gift"
  | "gallery"
  | "poem";

const BROWSE_SCREENS: Screen[] = ["gift", "gallery", "poem"];

export default function App() {
  const { state, loaded, update, resetQuiz } = useGameState();
  const [screen, setScreen] = useState<Screen>("password");
  // Browse mode = quest completed, free navigation between gift/gallery/poem
  const browseMode = state.quizCompleted && BROWSE_SCREENS.includes(screen);

  useEffect(() => {
    if (!loaded) return;
    if (!state.authenticated) {
      setScreen("password");
    } else if (state.quizCompleted) {
      setScreen("welcome-back");
    } else if (state.puzzleCompleted) {
      setScreen("quiz");
    } else {
      setScreen("landing");
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg-primary" />
    );
  }

  const handleAuthenticated = () => {
    update({ authenticated: true });
    setScreen("landing");
  };

  const handleRetake = () => {
    resetQuiz();
    setScreen("puzzle");
  };

  const handleViewResult = () => {
    setScreen("gift");
  };

  return (
    <div className="min-h-dvh bg-bg-primary relative overflow-hidden">
      <LandscapeOverlay />
      <AnimatePresence mode="wait">
        {screen === "password" && (
          <ScreenWrapper key="password">
            <PasswordScreen onSuccess={handleAuthenticated} />
          </ScreenWrapper>
        )}
        {screen === "welcome-back" && (
          <ScreenWrapper key="welcome-back">
            <WelcomeBackScreen
              score={state.quizScore}
              onRetake={handleRetake}
              onViewResult={handleViewResult}
            />
          </ScreenWrapper>
        )}
        {screen === "landing" && (
          <ScreenWrapper key="landing">
            <LandingScreen onContinue={() => setScreen("puzzle")} />
          </ScreenWrapper>
        )}
        {screen === "puzzle" && (
          <ScreenWrapper key="puzzle">
            <PuzzleScreen
              onComplete={() => {
                update({ puzzleCompleted: true });
                setScreen("quiz");
              }}
            />
          </ScreenWrapper>
        )}
        {screen === "quiz" && (
          <ScreenWrapper key="quiz">
            <QuizScreen
              onComplete={(score, answers) => {
                update({
                  quizCompleted: true,
                  quizScore: score,
                  quizAnswers: answers,
                  completedAt: new Date().toISOString(),
                });
                setScreen("gift");
              }}
            />
          </ScreenWrapper>
        )}
        {screen === "gift" && (
          <ScreenWrapper key="gift" padBottom={browseMode}>
            <GiftScreen
              score={state.quizScore}
              onContinue={browseMode ? undefined : () => setScreen("gallery")}
            />
          </ScreenWrapper>
        )}
        {screen === "gallery" && (
          <ScreenWrapper key="gallery" padBottom={browseMode}>
            <GalleryScreen
              onContinue={browseMode ? undefined : () => setScreen("poem")}
            />
          </ScreenWrapper>
        )}
        {screen === "poem" && (
          <ScreenWrapper key="poem" padBottom={browseMode}>
            <PoemScreen onRetake={browseMode ? undefined : handleRetake} />
          </ScreenWrapper>
        )}
      </AnimatePresence>

      {browseMode && (
        <BottomNav
          current={screen}
          onNavigate={setScreen}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
}

function ScreenWrapper({
  children,
  padBottom,
}: {
  children: React.ReactNode;
  padBottom?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`min-h-dvh ${padBottom ? "pb-20" : ""}`}
    >
      {children}
    </motion.div>
  );
}
