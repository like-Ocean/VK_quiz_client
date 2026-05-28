export type QuizStatus = "draft" | "active" | "completed";

export interface QuizSummary {
  id: string;
  title: string;
  category: string;
  questions: number;
  timeLimit: number;
  status: QuizStatus;
  participants?: number;
}

export interface ParticipationHistory {
  id: string;
  title: string;
  category: string;
  score: number;
  totalPoints: number;
  rank: number;
  totalParticipants: number;
  completedAt: string;
}

export interface QuestionDraft {
  id: string;
  type: "text" | "image";
  imageUrl?: string;
  question: string;
  options: string[];
  multipleChoice: boolean;
  correctAnswers: number[];
  points: number;
}

export interface ExecQuestion {
  question: string;
  options: string[];
  correctAnswers: number[];
  multipleChoice?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  total: number;
  correct: number;
  questions: number;
  avgTime: number;
}
