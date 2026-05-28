import { api } from "@/api/client";
import type {
  ChangePasswordRequest,
  ParticipationHistoryResponse,
  UserQuizResponse,
  UserResponse,
  UserUpdateRequest,
} from "@/types/user";

export async function fetchMe() {
  const response = await api.get<UserResponse>("/users/me");
  return response.data;
}

export async function updateMe(payload: UserUpdateRequest) {
  const response = await api.patch<UserResponse>("/users/me", payload);
  return response.data;
}

export async function changePassword(payload: ChangePasswordRequest) {
  const response = await api.post<{ message: string }>("/users/me/password", payload);
  return response.data;
}

export async function fetchMyQuizzes() {
  const response = await api.get<UserQuizResponse[]>("/users/me/quizzes");
  return response.data;
}

export async function fetchMyHistory() {
  const response = await api.get<ParticipationHistoryResponse[]>("/users/me/history");
  return response.data;
}
