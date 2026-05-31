import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCategories } from "@/hooks/useCategories";
import { useQuiz } from "@/hooks/useQuizzes";
import { useQuestions } from "@/hooks/useQuestions";
import { categories as mockCategories } from "@/lib/mockData";
import type { CategoryResponse } from "@/types/category";
import type { QuestionDraft, QuestionResponse } from "@/types/quiz";

export function makeQuestion(): QuestionDraft {
  return {
    id: `local-${uuidv4()}`,
    type: "text",
    question: "",
    options: ["", "", "", ""],
    multipleChoice: false,
    correctAnswers: [0],
    points: 10,
  };
}

export function isLocalId(id: string) {
  return id.startsWith("local-");
}

export function mapQuestionResponse(item: QuestionResponse): QuestionDraft {
  const correctAnswers = item.answer_options
    .map((opt, i) => (opt.is_correct ? i : -1))
    .filter((i) => i >= 0);

  return {
    id: item.id,
    type: item.question_type,
    imageUrl: item.image_url ?? undefined,
    question: item.text,
    options: item.answer_options.map((o) => o.text),
    multipleChoice: item.answer_type === "multiple",
    correctAnswers,
    points: item.points,
  };
}

export function useQuizForm(quizId?: string) {
  const isEdit = Boolean(quizId);
  const { data: quizData } = useQuiz(quizId);
  const { data: questionData } = useQuestions(quizId);
  const { data: categoryData } = useCategories();

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([makeQuestion()]);

  const categoryOptions = useMemo<CategoryResponse[]>(() => {
    if (categoryData && categoryData.length > 0) return categoryData;
    return mockCategories.map((name) => ({ id: name, name }));
  }, [categoryData]);

  useEffect(() => {
    if (!categoryId && categoryOptions.length > 0) {
      setCategoryId(categoryOptions[0].id);
    }
  }, [categoryId, categoryOptions]);

  useEffect(() => {
    if (!isEdit || !quizData) return;
    setTitle(quizData.title);
    setDescription(quizData.description ?? "");
    setTimeLimit(quizData.time_per_question);
    if (quizData.category_id) setCategoryId(quizData.category_id);
  }, [isEdit, quizData]);

  useEffect(() => {
    if (!isEdit || !questionData) return;
    setQuestions(
      questionData
        .slice()
        .sort((a, b) => a.order - b.order)
        .map(mapQuestionResponse),
    );
  }, [isEdit, questionData]);

  function updateQuestion(id: string, patch: Partial<QuestionDraft>) {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function setOption(qid: string, index: number, value: string) {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) }
          : q,
      ),
    );
  }

  function toggleCorrect(qid: string, index: number) {
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.id !== qid) return q;
        if (q.multipleChoice) {
          const has = q.correctAnswers.includes(index);
          return {
            ...q,
            correctAnswers: has
              ? q.correctAnswers.filter((i) => i !== index)
              : [...q.correctAnswers, index],
          };
        }
        return { ...q, correctAnswers: [index] };
      }),
    );
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, makeQuestion()]);
  }

  function removeQuestion(id: string) {
    setQuestions((qs) => (qs.length === 1 ? qs : qs.filter((q) => q.id !== id)));
  }

  function reorderQuestion(id: string, direction: "up" | "down") {
    setQuestions((qs) => {
      const index = qs.findIndex((q) => q.id === id);
      if (index < 0) return qs;
      const next = direction === "up" ? index - 1 : index + 1;
      if (next < 0 || next >= qs.length) return qs;
      const copy = [...qs];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item);
      return copy;
    });
  }

  return {
    // форма
    title, setTitle,
    categoryId, setCategoryId,
    timeLimit, setTimeLimit,
    description, setDescription,
    // вопросы
    questions,
    addQuestion,
    removeQuestion,
    reorderQuestion,
    updateQuestion,
    setOption,
    toggleCorrect,
    // данные
    categoryOptions,
    categoryData,
    isEdit,
  };
}