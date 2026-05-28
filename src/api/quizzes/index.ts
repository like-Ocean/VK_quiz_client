import { api } from "@/api/client";
import type { QuizCreate, QuizResponse, QuizUpdate } from "@/types/quiz";

export async function fetchQuizzes() {
  const response = await api.get<QuizResponse[]>("/quizzes");
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
