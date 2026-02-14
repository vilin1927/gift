export interface QuizQuestion {
  id: number;
  question: string;
  answers: string[];
  correctIndex: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Какое у нас стоп-слово?",
    answers: ["Жентольник", "Биохакинг", "Тыква", "Козырной"],
    correctIndex: 0,
  },
  {
    id: 2,
    question: "Запрещённые темы к 23 сентября?",
    answers: [
      "Соски, диета, образ жизни",
      "Религия, политика, мясо",
      "Треугольники, зоопарки, Картье",
      "Мясо, Ницше, каршеринг",
    ],
    correctIndex: 0,
  },
  {
    id: 3,
    question: "Аня верит только в...",
    answers: [
      "«Ту таблицу»",
      "Обычную астрологию",
      "Нумерологию и карты Таро",
      "Матрицу синхронности",
    ],
    correctIndex: 0,
  },
  {
    id: 4,
    question: "Что Аня хотела сделать на лице?",
    answers: [
      "Тату",
      "Пирсинг в нос",
      "Перманентный макияж бровей",
      "Веснушки хной",
    ],
    correctIndex: 0,
  },
  {
    id: 5,
    question: "Кто такой Козырной?",
    answers: [
      "Дед из деревни, сидел за убийство, звонил бабушке",
      "Сосед бабушки, воровал яблоки",
      "Друг дедушки, приезжал каждое лето",
      "Бывший ухажёр бабушки, писал письма",
    ],
    correctIndex: 0,
  },
  {
    id: 6,
    question: "Аня любит зоопарки",
    answers: [
      "Бред — она против",
      "Правда — ходит каждый месяц",
      "Только контактные",
      "Ей всё равно",
    ],
    correctIndex: 0,
  },
  {
    id: 7,
    question: "Аня — очень тактильный человек",
    answers: [
      "Бред — она «не тактильный»",
      "Правда — обнимает всех",
      "Только в хорошем настроении",
      "Только с Вовой",
    ],
    correctIndex: 0,
  },
];

/** Shuffle answers and return new array with updated correctIndex */
export function shuffleQuestion(q: QuizQuestion): QuizQuestion {
  const correctAnswer = q.answers[q.correctIndex];
  const shuffled = [...q.answers];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return {
    ...q,
    answers: shuffled,
    correctIndex: shuffled.indexOf(correctAnswer),
  };
}
