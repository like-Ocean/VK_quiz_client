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
  finished_at: string;
  leaderboard_position?: number;
}

export interface UserQuizResponse {
  id: string;
  title: string;
  status?: "draft" | "active" | "completed";
  category?: string | null;
  questions?: number | null;
  time_per_question?: number | null;
  participants?: number | null;
}
