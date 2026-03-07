"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const PASSWORD = "vi199819";

const WRONG_MESSAGES = [
  "Не-а...",
  "Попробуй ещё раз",
  "Это точно ты, Ань?",
  "Владимир разочарован",
];

interface GiftCard {
  code: string;
  pin: string;
  amount: string;
  barcode: string;
}

const CARDS: GiftCard[] = [
  { code: "2123001319524", pin: "5600", amount: "2 000", barcode: "/barcode-1.jpg" },
  { code: "2123001319693", pin: "5201", amount: "2 000", barcode: "/barcode-2.jpg" },
];

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSWORD) {
      onSuccess();
    } else {
      setError(
        WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)]
      );
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setValue("");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-4xl mb-3 font-heading">8</p>
          <p className="text-text-secondary text-sm">
            Введи пароль из открытки
          </p>
        </div>
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
          Открыть
        </button>
      </form>
    </div>
  );
}

const JOKE_TEXTS = ["отжарь меня", "женись на мне"];
const REAL_TEXTS = ["нажми на меня", "нажми на меня"];

function DisappearingText({
  text,
  onComplete,
  color,
}: {
  text: string;
  onComplete: () => void;
  color: string;
}) {
  const [dissolving, setDissolving] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setDissolving(true), 2000);
    const doneTimer = setTimeout(onComplete, 2800);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <span className="inline-flex justify-center flex-wrap">
      {text.split("").map((char, i) => {
        const randX = (Math.random() - 0.5) * 40;
        const randY = (Math.random() - 0.5) * 30 - 10;
        const randRotate = (Math.random() - 0.5) * 90;
        const delay = i * 0.03;

        return (
          <motion.span
            key={i}
            className={`inline-block ${color}`}
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
            animate={
              dissolving
                ? {
                    opacity: 0,
                    x: randX,
                    y: randY,
                    rotate: randRotate,
                    scale: 0,
                    filter: "blur(4px)",
                  }
                : { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }
            }
            transition={{
              duration: 0.5,
              delay: dissolving ? delay : 0,
              ease: [0.4, 0, 1, 1],
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}

function GiftCardPreview({
  index,
  onClick,
}: {
  index: number;
  onClick: () => void;
}) {
  const [switched, setSwitched] = useState(false);
  const handleDissolveComplete = useRef(() => setSwitched(true)).current;

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
        delay: 0.25 + index * 0.12,
      }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full group cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden">
        {/* Gradient background */}
        <div
          className={`absolute inset-0 ${
            index === 0
              ? "bg-gradient-to-br from-[#00838f]/40 via-[#00695c]/30 to-[#004d40]/50"
              : "bg-gradient-to-br from-[#6a1b9a]/30 via-[#4a148c]/30 to-[#311b92]/40"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Decorative circles */}
        <div
          className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-20 ${
            index === 0 ? "bg-[#4dd0e1]" : "bg-[#ce93d8]"
          }`}
        />
        <div
          className={`absolute -bottom-6 -left-6 w-24 h-24 rounded-full blur-xl opacity-15 ${
            index === 0 ? "bg-[#80cbc4]" : "bg-[#b39ddb]"
          }`}
        />

        {/* Content */}
        <div className="relative px-6 py-7 flex flex-col items-center gap-4">
          {/* Gift icon */}
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
              index === 0
                ? "bg-[#4dd0e1]/15 shadow-[0_0_20px_rgba(77,208,225,0.1)]"
                : "bg-[#ce93d8]/15 shadow-[0_0_20px_rgba(206,147,216,0.1)]"
            }`}
          >
            <span className="drop-shadow-sm">
              {index === 0 ? "\uD83C\uDF81" : "\uD83C\uDF80"}
            </span>
          </div>

          <div className="text-center space-y-1">
            <p className="text-text-primary font-heading text-xl">
              Подарок {index + 1}
            </p>
            <div
              className={`text-xs h-5 relative ${
                index === 0 ? "text-[#80cbc4]/80" : "text-[#ce93d8]/80"
              }`}
            >
              {!switched ? (
                <DisappearingText
                  text={JOKE_TEXTS[index]}
                  onComplete={handleDissolveComplete}
                  color={index === 0 ? "text-[#80cbc4]/80" : "text-[#ce93d8]/80"}
                />
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {REAL_TEXTS[index]}
                </motion.p>
              )}
            </div>
          </div>

          {/* Tap hint */}
          <div className="flex items-center gap-1.5 text-text-secondary/50 text-xs">
            <span>Нажми чтобы открыть</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function CardModal({
  card,
  index,
  onClose,
}: {
  card: GiftCard;
  index: number;
  onClose: () => void;
}) {
  const [pinRevealed, setPinRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-start justify-center px-5 pt-16 pb-8 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ backdropFilter: "blur(0px)" }}
        animate={{ backdropFilter: "blur(8px)" }}
        exit={{ backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/70"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40, rotateX: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 30,
          mass: 0.8,
        }}
        style={{ perspective: 800 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-bg-card border border-accent-gold/10 shadow-2xl"
      >
        {/* Card header with gradient */}
        <div
          className={`relative px-6 py-5 ${
            index === 0
              ? "bg-gradient-to-br from-[#00838f]/30 to-[#004d40]/20"
              : "bg-gradient-to-br from-[#6a1b9a]/25 to-[#311b92]/20"
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white/70 hover:text-white transition-colors text-xs z-10"
          >
            {"\u2715"}
          </button>

          <div className="flex items-center justify-between pr-8">
            <div className="space-y-0.5">
              <p
                className={`text-sm font-semibold tracking-wide ${
                  index === 0 ? "text-[#4dd0e1]" : "text-[#ce93d8]"
                }`}
              >
                РЕСПУБЛИКА*
              </p>
              <p className="text-text-secondary/60 text-xs">
                Подарочный сертификат
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-heading text-accent-gold">
                {card.amount} &#8381;
              </p>
            </div>
          </div>
        </div>

        {index === 1 && (
          <div className="px-6 pt-3 pb-0">
            <p className="text-text-secondary/70 text-xs text-center italic">
              да тоже республика и что :)
            </p>
          </div>
        )}

        {/* Card body */}
        <div className="px-6 py-5 space-y-5">
          {/* Code */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-1.5"
          >
            <span className="text-text-secondary text-xs uppercase tracking-wider">
              {"\u041A\u043E\u0434 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u0430"}
            </span>
            <div className="bg-bg-primary rounded-xl px-4 py-3 font-mono text-lg text-text-primary tracking-[0.15em] text-center select-all border border-white/5">
              {card.code}
            </div>
          </motion.div>

          {/* PIN */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="space-y-1.5"
          >
            <span className="text-text-secondary text-xs uppercase tracking-wider">
              {"\u041F\u0418\u041D-\u043A\u043E\u0434"}
            </span>
            <AnimatePresence mode="wait">
              {pinRevealed ? (
                <motion.div
                  key="pin"
                  initial={{ opacity: 0, rotateX: -90 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-bg-primary rounded-xl px-4 py-3 font-mono text-lg text-accent-gold tracking-[0.2em] text-center select-all border border-accent-gold/10"
                >
                  {card.pin}
                </motion.div>
              ) : (
                <motion.button
                  key="hidden"
                  exit={{ opacity: 0, rotateX: 90 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setPinRevealed(true)}
                  className="w-full bg-bg-primary hover:bg-bg-primary/80 rounded-xl px-4 py-3 text-sm text-text-secondary hover:text-text-primary transition-colors text-center border border-white/5 hover:border-white/10"
                >
                  {"\u041D\u0430\u0436\u043C\u0438 \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C"}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Barcode */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex justify-center"
          >
            <div className="bg-white rounded-lg px-6 py-4 w-full">
              <img
                src={card.barcode}
                alt="barcode"
                className="w-full h-24 object-fill"
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-1 space-y-3"
          >
            <div className="h-px bg-text-secondary/10" />
            <div className="flex items-center justify-between text-text-secondary/50 text-xs">
              <span>Бессрочный</span>
              <span>republika.ru</span>
            </div>
            <a
              href={card.barcode}
              download={`республика-сертификат-${index + 1}.jpg`}
              className="flex items-center justify-center gap-2 w-full bg-accent-gold/10 hover:bg-accent-gold/20 text-accent-gold rounded-xl py-2.5 text-sm transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Скачать сертификат
            </a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GiftContent() {
  const [openCard, setOpenCard] = useState<number | null>(null);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 py-10 sm:py-16">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl font-heading text-text-primary">
            {"\u0421 8 \u043C\u0430\u0440\u0442\u0430!"}
          </h1>
          <p className="text-text-secondary text-sm">
            Про Лилии и кошку помню, поэтому если кошка будет плакать, выкинь в окно Лилии эти и разбей мне сердце
          </p>
        </motion.div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.12 }}
          className="bg-bg-card/60 border border-accent-gold/10 rounded-xl px-5 py-4 text-sm text-text-secondary leading-relaxed"
        >
          {"\u041A\u043E\u0440\u043E\u0447\u0435 \u0445\u043E\u0442\u0435\u043B \u043A\u0443\u043F\u0438\u0442\u044C \u0432 \u0434\u0432\u0443\u0445 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430\u0445, \u043D\u043E \u0435\u0441\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u043E\u0434\u043D\u043E\u043C \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u044B\u0439 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u044F \u043A\u043E\u0440\u043E\u0447\u0435 \u043D\u0435 \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0439 \u0430\u0445\u0430\u0445\u0430"}
        </motion.div>

        {/* Gift cards */}
        <div className="w-full grid grid-cols-2 gap-3">
          {CARDS.map((_, i) => (
            <GiftCardPreview
              key={i}
              index={i}
              onClick={() => setOpenCard(i)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openCard !== null && (
          <CardModal
            card={CARDS[openCard]}
            index={openCard}
            onClose={() => setOpenCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const STORAGE_KEY = "march8-unlocked";

export default function MarchPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      setUnlocked(true);
    }
    setLoaded(true);
  }, []);

  const handleUnlock = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setUnlocked(true);
  };

  if (!loaded) return <div className="min-h-dvh bg-bg-primary" />;

  return (
    <AnimatePresence mode="wait">
      {!unlocked ? (
        <motion.div
          key="password"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PasswordGate onSuccess={handleUnlock} />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <GiftContent />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
