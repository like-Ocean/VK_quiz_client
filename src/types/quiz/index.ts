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

export interface QuizCreate {
  title: string;
  description?: string;
  category_id?: string;
  time_per_question: number;
  is_public: boolean;
}

export interface QuizUpdate {
  title?: string;
  description?: string;
  category_id?: string;
  time_per_question?: number;
  is_public?: boolean;
}

export interface QuizResponse {
  id: string;
  owner_id: string;
  category_id?: string | null;
  category_name: string;
  title: string;
  description?: string | null;
  time_per_question: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizListResponse {
  items: QuizResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface QuizFilters {
  search?: string;
  category_id?: string;
  owner_id?: string;
  page?: number;
  page_size?: number;
}

export type AnswerType = "single" | "multiple";

export interface AnswerOptionCreate {
  text: string;
  is_correct: boolean;
}

export interface QuestionCreate {
  order: number;
  text: string;
  image_url?: string;
  question_type: "text" | "image";
  answer_type: AnswerType;
  points: number;
  answer_options: AnswerOptionCreate[];
}

export interface QuestionUpdate {
  order?: number;
  text?: string;
  image_url?: string;
  question_type?: "text" | "image";
  answer_type?: AnswerType;
  points?: number;
  answer_options?: AnswerOptionCreate[];
}

export interface QuestionOptionResponse {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface QuestionResponse {
  id: string;
  order: number;
  text: string;
  image_url?: string | null;
  question_type: "text" | "image";
  answer_type: AnswerType;
  points: number;
  answer_options: QuestionOptionResponse[];
}

export interface QuestionReorderRequest {
  order: string[];
}
