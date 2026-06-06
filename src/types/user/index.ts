export interface AuthUser {
  name: string;
  email: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
  created_at: string;
}

export interface UserUpdateRequest {
  email?: string;
  username?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ParticipationHistoryResponse {
  room_id: string;
  quiz_title: string;
  score: number;
  total_points: number;
  finished_at: string;
  leaderboard_position?: number;
  total_participants: number;
  questions_count: number;
  time_per_question: number;
  category?: string | null;
}

export interface UserQuizResponse {
  id: string;
  title: string;
  status?: "draft" | "active" | "completed";
  category_name ?: string | null;
  questions?: number | null;
  time_per_question?: number | null;
  participants?: number | null;
  questions_count?: number;
  participants_count?: number;
  room_status?: "waiting" | "active" | "finished";
  created_at: string;
}
