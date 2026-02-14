export interface MediaItem {
  src: string;
  caption: string;
  type?: "image" | "video";
  poster?: string;
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

export function isVideo(item: MediaItem): boolean {
  if (item.type) return item.type === "video";
  return VIDEO_EXTENSIONS.some((ext) => item.src.toLowerCase().endsWith(ext));
}

export interface PoemLine {
  text: string;
  strikethrough?: boolean;
}

export const CONFIG = {
  password: "ялюблюташкент",

  soundFile: "/sound.mp3",

  puzzleImage: "/puzzle.jpg",
  puzzleGrid: { cols: 3, rows: 3 },

  media: [
    { src: "/photos/IMG_6600.jpg", caption: "" },
    { src: "/photos/IMG_6256.mp4", caption: "" },
    { src: "/photos/IMG_6602.jpg", caption: "" },
    { src: "/photos/IMG_6603.jpg", caption: "" },
    { src: "/photos/IMG_6526.mp4", caption: "" },
    { src: "/photos/IMG_6604.jpg", caption: "нарцисска, твоё первое фото мне 🌼" },
    { src: "/photos/IMG_6605.jpg", caption: "" },
    { src: "/photos/IMG_6606.jpg", caption: "" },
  ] as MediaItem[],

  galleryFooter: "да, немного! будет больше 💛",

  poemLines: [
    { text: "зачем мы проливали слезы" },
    { text: "зачем же рвали мы цветы" },
    { text: "у Ани раны кожи" },
    { text: "а у Володи нет души" },
    { text: "когда у Ани и Володи", strikethrough: true },
    { text: "Счастливые часы???", strikethrough: true },
    { text: "когда у Ани и Володи" },
    { text: "Счастливые часы???" },
  ] as PoemLine[],
  poemBadge: "Повторяешься?? 🙄",

  certificate: {
    title: "Интерьерная живопись",
    studio: "Oldich Art & Sculpture",
    date: "22 февраля 2026, 12:00",
    address: "Садовническая наб., 7, Москва",
    details: "3 часа · холст 60×40 · акрил, маркеры",
  },

  scoreMessages: {
    low: "Ну... мы ещё поработаем над этим. Но подарок всё равно твой 😏",
    mid: "Неплохо! Ты знаешь меня лучше, чем притворяешься. Держи:",
    high: "Окей, ты реально шаришь. Козырной бы одобрил. Вот тебе:",
  },

  correctReactions: [
    "Ну шаришь! 🎯",
    "Матрица одобряет ✨",
    "Козырной бы гордился",
    "Жентольник!",
    "Ого, ты это помнишь?",
    "Дикая кошка довольна 🐱",
  ],

  wrongReactions: [
    "Ой мимо...",
    "Это была ловушка, да?",
    "Ну камон...",
    "Даже Козырной знал бы...",
    "Матрица в шоке",
    "Попробуй ещё... ой, нельзя",
    "Ты точно Аня?",
  ],
};
