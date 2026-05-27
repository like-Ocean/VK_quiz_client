import type {ExecQuestion, LeaderboardEntry, ParticipationHistory, QuizSummary} from "./types";

export const organizerQuizzes: QuizSummary[] = [
  {
    id: "1",
    title: "General Knowledge Quiz",
    category: "General Knowledge",
    questions: 10,
    timeLimit: 30,
    status: "completed",
    participants: 24,
  },
  {
    id: "2",
    title: "Science & Technology",
    category: "Science",
    questions: 15,
    timeLimit: 45,
    status: "active",
    participants: 12,
  },
  {
    id: "3",
    title: "History Trivia",
    category: "History",
    questions: 12,
    timeLimit: 40,
    status: "draft",
  },
];

export const participantHistory: ParticipationHistory[] = [
  {
    id: "1",
    title: "General Knowledge Quiz",
    category: "General Knowledge",
    score: 85,
    totalPoints: 100,
    rank: 3,
    totalParticipants: 24,
    completedAt: "2026-05-08",
  },
  {
    id: "2",
    title: "Science & Technology",
    category: "Science",
    score: 92,
    totalPoints: 150,
    rank: 1,
    totalParticipants: 18,
    completedAt: "2026-05-07",
  },
  {
    id: "3",
    title: "World History",
    category: "History",
    score: 78,
    totalPoints: 120,
    rank: 5,
    totalParticipants: 30,
    completedAt: "2026-05-05",
  },
];

export const execQuestions: ExecQuestion[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswers: [2],
  },
  {
    question: "Which are programming languages? (Select all)",
    options: ["Python", "HTML", "JavaScript", "CSS"],
    correctAnswers: [0, 2],
    multipleChoice: true,
  },
  {
    question: "What year did WWII end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswers: [2],
  },
  {
    question: "Largest planet in solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswers: [2],
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Da Vinci", "Picasso", "Michelangelo"],
    correctAnswers: [1],
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Sarah Chen", score: 48, total: 50, correct: 9, questions: 10, avgTime: 12 },
  { rank: 2, name: "Michael Johnson", score: 45, total: 50, correct: 9, questions: 10, avgTime: 14 },
  { rank: 3, name: "Emma Wilson", score: 42, total: 50, correct: 8, questions: 10, avgTime: 15 },
  { rank: 4, name: "David Brown", score: 39, total: 50, correct: 8, questions: 10, avgTime: 17 },
  { rank: 5, name: "Lisa Anderson", score: 36, total: 50, correct: 7, questions: 10, avgTime: 18 },
  { rank: 6, name: "James Taylor", score: 33, total: 50, correct: 7, questions: 10, avgTime: 20 },
  { rank: 7, name: "Olivia Martinez", score: 29, total: 50, correct: 6, questions: 10, avgTime: 22 },
  { rank: 8, name: "Daniel Lee", score: 25, total: 50, correct: 5, questions: 10, avgTime: 24 },
];

export const categories = [
  "General Knowledge",
  "Science",
  "History",
  "Geography",
  "Sports",
  "Entertainment",
];
