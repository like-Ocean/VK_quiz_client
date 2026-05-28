import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQuestion,
  deleteQuestion,
  fetchQuestions,
  reorderQuestions,
  updateQuestion,
} from "@/api/questions";
import type { QuestionCreate, QuestionReorderRequest, QuestionUpdate } from "@/types/quiz";

export function useQuestions(quizId?: string) {
  return useQuery({
    queryKey: ["quizzes", quizId, "questions"],
    queryFn: () => fetchQuestions(quizId as string),
    enabled: Boolean(quizId),
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, payload }: { quizId: string; payload: QuestionCreate }) =>
      createQuestion(quizId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes", variables.quizId, "questions"],
      });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      questionId,
      payload,
    }: {
      quizId: string;
      questionId: string;
      payload: QuestionUpdate;
    }) => updateQuestion(quizId, questionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes", variables.quizId, "questions"],
      });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, questionId }: { quizId: string; questionId: string }) =>
      deleteQuestion(quizId, questionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes", variables.quizId, "questions"],
      });
    },
  });
}

export function useReorderQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      payload,
    }: {
      quizId: string;
      payload: QuestionReorderRequest;
    }) => reorderQuestions(quizId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes", variables.quizId, "questions"],
      });
    },
  });
}
