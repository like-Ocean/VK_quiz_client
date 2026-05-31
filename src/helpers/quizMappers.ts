import type { AnswerOptionCreate, AnswerType, QuestionCreate, QuestionDraft } from "@/types/quiz";

export function mapDraftToPayload(question: QuestionDraft, order: number): QuestionCreate {
  const answerOptions: AnswerOptionCreate[] = question.options.map((text, index) => ({
    text,
    is_correct: question.correctAnswers.includes(index),
  }));

  const answerType: AnswerType = question.multipleChoice ? "multiple" : "single";

  return {
    order,
    text: question.question,
    image_url: question.imageUrl,
    question_type: question.type,
    answer_type: answerType,
    points: question.points,
    answer_options: answerOptions,
  };
}