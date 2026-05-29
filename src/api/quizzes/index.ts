import { api } from "@/api/client";
import type { QuizCreate, QuizResponse, QuizUpdate, QuizListResponse, QuizFilters } from "@/types/quiz";

export async function fetchQuizzes(filters: QuizFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category_id) params.set("category_id", filters.category_id);
  if (filters.owner_id) params.set("owner_id", filters.owner_id);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.page_size) params.set("page_size", String(filters.page_size));

  const response = await api.get<QuizListResponse>(`/quizzes?${params.toString()}`);
  return response.data;
}

export async function fetchQuiz(quizId: string) {
  const response = await api.get<QuizResponse>(`/quizzes/${quizId}`);
  return response.data;
}

export async function createQuiz(payload: QuizCreate) {
  const response = await api.post<QuizResponse>("/quizzes", payload);
  return response.data;
}

export async function updateQuiz(quizId: string, payload: QuizUpdate) {
  const response = await api.patch<QuizResponse>(`/quizzes/${quizId}`, payload);
  return response.data;
}

export async function deleteQuiz(quizId: string) {
  const response = await api.delete<{ message: string }>(`/quizzes/${quizId}`);
  return response.data;
}
