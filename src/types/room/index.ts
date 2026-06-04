export interface RoomCreate {
  quiz_id: string;
}

export interface RoomJoin {
  join_code: string;
  guest_name?: string;
}

export interface RoomJoinResponse {
  room_id: string;
  participant_id: string;
  guest_token?: string;
  join_code: string;
}

export interface RoomResponse {
  id: string;
  quiz_id: string;
  owner_id: string;
  join_code: string;
  status: "waiting" | "active" | "finished";
  current_question_index: number;
  created_at: string;
  started_at?: string;
  finished_at?: string;
}

export interface ParticipantResponse {
  id: string;
  room_id: string;
  user_id?: string;
  guest_name?: string;
  display_name: string;
  score: number;
  joined_at: string;
}

export interface KickRequest {
  participant_id: string;
  reason_id?: string;
  comment?: string;
}

export interface LeaderboardEntry {
  participant_id: string;
  display_name: string;
  score: number;
  total: number;
  correct: number;
  questions: number;
}

export type ServerWsEvent =
  | { event: "participant_joined"; display_name: string; participant_count: number }
  | { event: "question_start"; question_id: string; text: string; image_url?: string; answer_type: "single" | "multiple"; options: WsAnswerOption[]; time_limit: number; index: number; total: number }
  | { event: "question_end"; correct_option_ids: string[]; leaderboard: LeaderboardEntry[] }
  | { event: "participant_answered"; participant_id: string; display_name: string }
  | { event: "leaderboard_update"; leaderboard: LeaderboardEntry[] }
  | { event: "quiz_finish"; leaderboard: LeaderboardEntry[] }
  | { event: "kicked"; reason: string }
  | { event: "error"; detail: string };

export type ClientWsEvent =
  | { event: "start_quiz" }
  | { event: "submit_answer"; question_id: string; option_ids: string[] }
  | { event: "next_question" }
  | { event: "end_quiz" };

export interface WsAnswerOption {
  id: string;
  text: string;
}

export interface CurrentQuestion {
  question_id: string;
  text: string;
  image_url?: string;
  answer_type: "single" | "multiple";
  options: WsAnswerOption[];
  time_limit: number;
  index: number;
  total: number;
}

export type RoomPhase = "waiting" | "question" | "question_end" | "finished" | "kicked";

export interface RoomSocketState {
  phase: RoomPhase;
  participantCount: number;
  currentQuestion: CurrentQuestion | null;
  correctOptionIds: string[];
  leaderboard: LeaderboardEntry[];
  answeredParticipants: string[];
  kickReason: string | null;
  wsError: string | null;
}

export interface QuestionState {
  questionId: string | null;
  selected: string[];
  submitted: boolean;
  timeLeft: number;
}

export type QuestionAction =
  | { type: "INIT"; questionId: string; timeLimit: number }
  | { type: "SELECT"; optionId: string; multiple: boolean }
  | { type: "SUBMIT" }
  | { type: "TICK" };