import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createQuiz, deleteQuiz, fetchQuiz, fetchQuizzes, updateQuiz } from "@/api/quizzes";
import type { QuizCreate, QuizFilters, QuizUpdate } from "@/types/quiz";

export function useQuizzes(filters: QuizFilters = {}) {
  return useQuery({
    queryKey: ["quizzes", filters],
    queryFn: () => fetchQuizzes(filters),
  });
}

export function useQuiz(quizId?: string) {
  return useQuery({
    queryKey: ["quizzes", quizId],
    queryFn: () => fetchQuiz(quizId as string),
    enabled: Boolean(quizId),
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuizCreate) => createQuiz(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["me", "quizzes"] });
    },
  });
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, payload }: { quizId: string; payload: QuizUpdate }) =>
      updateQuiz(quizId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", variables.quizId] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["me", "quizzes"] });
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: string) => deleteQuiz(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["me", "quizzes"] });
    },
  });
}
