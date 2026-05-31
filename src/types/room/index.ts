export interface RoomCreate {
  quiz_id: string;
}

export interface RoomJoin {
  room_id: string;
  guest_name?: string;
}

export interface RoomJoinResponse {
  room_id: string;
  participant_id: string;
  guest_token?: string;
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
}