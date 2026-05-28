import { api } from '@/api/client';
import type {QuestionCreate, QuestionReorderRequest, QuestionResponse, QuestionUpdate} from '@/types/quiz';

export async function fetchQuestions(quizId: string) {
    const response = await api.get<QuestionResponse[]>(`/quizzes/${quizId}/questions`);
    return response.data;
}

export async function createQuestion(quizId: string, payload: QuestionCreate) {
    const response = await api.post<QuestionResponse>(`/quizzes/${quizId}/questions`, payload);
    return response.data;
}

export async function updateQuestion(quizId: string, questionId: string, payload: QuestionUpdate) {
    const response = await api.patch<QuestionResponse>(
        `/quizzes/${quizId}/questions/${questionId}`,
        payload,
    );
    return response.data;
}

export async function deleteQuestion(quizId: string, questionId: string) {
    const response = await api.delete<{ message: string }>(
        `/quizzes/${quizId}/questions/${questionId}`,
    );
    return response.data;
}

export async function reorderQuestions(quizId: string, payload: QuestionReorderRequest) {
    const response = await api.patch<{ message: string }>(
        `/quizzes/${quizId}/questions/reorder`,
        payload,
    );
    return response.data;
}
