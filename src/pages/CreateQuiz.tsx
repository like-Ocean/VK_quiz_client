import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CategoryAdminPanel } from "@/components/quiz/CategoryAdminPanel";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionsToolbar } from "@/components/quiz/QuestionsToolbar";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuizSettingsCard } from "@/components/quiz/QuizSettingsCard";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { useMe } from "@/hooks/useMe";
import { useCreateQuestion, useDeleteQuestion, useQuestions, useReorderQuestions, useUpdateQuestion } from "@/hooks/useQuestions";
import { useCreateQuiz, useQuiz, useUpdateQuiz } from "@/hooks/useQuizzes";
import { categories } from "@/lib/mockData";
import { v4 as uuidv4 } from 'uuid';
import type { CategoryResponse } from "@/types/category";
import type { AnswerOptionCreate, AnswerType, QuestionCreate, QuestionDraft, QuestionResponse } from "@/types/quiz";


function makeQuestion(): QuestionDraft {
  return {
    id: `local-${uuidv4()}`,
    type: "text",
    question: "",
    options: ["", "", "", ""],
    multipleChoice: false,
    correctAnswers: [],
    points: 10,
  };
}

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId?: string }>();
  const isEdit = Boolean(quizId);
  const { data: me } = useMe();
  const { data: quizData } = useQuiz(quizId);
  const { data: questionData } = useQuestions(quizId);
  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();
  const createQuestion = useCreateQuestion();
  const updateQuestionApi = useUpdateQuestion();
  const deleteQuestionApi = useDeleteQuestion();
  const reorderQuestionsApi = useReorderQuestions();
  const { data: categoryData } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [title, setTitle] = useState(isEdit ? "History Trivia" : "");
  const [categoryId, setCategoryId] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([makeQuestion()]);

  const categoryOptions = useMemo<CategoryResponse[]>(() => {
    if (categoryData && categoryData.length > 0) return categoryData;
    return categories.map((name) => ({ id: name, name }));
  }, [categoryData]);

  useEffect(() => {
    if (!categoryId && categoryOptions.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategoryId(categoryOptions[0].id);
    }
  }, [categoryId, categoryOptions]);

  useEffect(() => {
    if (!isEdit || !quizData) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(quizData.title);
    setDescription(quizData.description ?? "");
    setTimeLimit(quizData.time_per_question);
    if (quizData.category_id) {
      setCategoryId(quizData.category_id);
    }
  }, [isEdit, quizData]);

  useEffect(() => {
    if (!isEdit || !questionData) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuestions(questionData
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(mapQuestionResponse));
  }, [isEdit, questionData]);

  function updateQuestion(id: string, patch: Partial<QuestionDraft>) {
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    );
  }

  function setOption(qid: string, index: number, value: string) {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
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
    const next = makeQuestion();
    setQuestions((qs) => [...qs, next]);
  }

  function removeQuestion(id: string) {
    setQuestions((qs) => (qs.length === 1 ? qs : qs.filter((q) => q.id !== id)));
    if (quizId && !isLocalId(id)) {
      deleteQuestionApi.mutate({ quizId, questionId: id });
    }
  }

  function moveQuestion(id: string, direction: "up" | "down") {
    setQuestions((qs) => {
      const index = qs.findIndex((q) => q.id === id);
      if (index < 0) return qs;
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= qs.length) return qs;
      const copy = [...qs];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);

      if (quizId) {
        const order = copy.filter((q) => !isLocalId(q.id)).map((q) => q.id);
        if (order.length > 0) {
          reorderQuestionsApi.mutate({ quizId, payload: { order } });
        }
      }

      return copy;
    });
  }

  function handleSave() {
    const normalizedCategoryId = categoryData?.some((c) => c.id === categoryId)
      ? categoryId
      : undefined;

    const payload = {
      title,
      description: description || undefined,
      category_id: normalizedCategoryId,
      time_per_question: timeLimit,
      is_public: true,
    };

    if (isEdit && quizId) {
      updateQuiz.mutate(
        { quizId, payload },
        {
          onSuccess: () => {
            const ops = questions.map((q, index) => {
              const questionPayload = mapDraftToPayload(q, index + 1);
              if (isLocalId(q.id)) {
                return createQuestion.mutateAsync({ quizId, payload: questionPayload });
              }
              return updateQuestionApi.mutateAsync({
                quizId,
                questionId: q.id,
                payload: questionPayload,
              });
            });

            Promise.all(ops).then(() => {
              navigate(`/quizzes/${quizId}`);
            });
          },
        },
      );
      return;
    }

    createQuiz.mutate(payload, {
      onSuccess: async (created) => {
        const ops = questions.map((q, index) =>
          createQuestion.mutateAsync({
            quizId: created.id,
            payload: mapDraftToPayload(q, index + 1),
          }),
        );
        await Promise.all(ops);
        navigate(`/quizzes/${created.id}`);
      },
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <QuizHeader onBack={() => navigate("/dashboard")} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2>{isEdit ? "Изменить викторину" : "Создать викторину"}</h2>
        </div>

        <QuizSettingsCard
          title={title}
          onTitleChange={setTitle}
          categoryId={categoryId}
          categories={categoryOptions}
          onCategoryChange={setCategoryId}
          timeLimit={timeLimit}
          onTimeLimitChange={setTimeLimit}
          description={description}
          onDescriptionChange={setDescription}
        />

        {me?.is_admin && categoryData && (
          <div className="mb-6">
            <CategoryAdminPanel
              categories={categoryData}
              onCreate={(name) => createCategory.mutate({ name })}
              onDelete={(id) => deleteCategory.mutate(id)}
              isCreating={createCategory.isPending}
              isDeleting={deleteCategory.isPending}
            />
          </div>
        )}

        <QuestionsToolbar count={questions.length} onAdd={addQuestion} />

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              total={questions.length}
              onRemove={removeQuestion}
              onUpdate={updateQuestion}
              onToggleCorrect={toggleCorrect}
              onSetOption={setOption}
              onMoveUp={(id) => moveQuestion(id, "up")}
              onMoveDown={(id) => moveQuestion(id, "down")}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={createQuiz.isPending || updateQuiz.isPending}
          >
            Сохранить викторину
          </Button>
        </div>
      </main>
    </div>
  );
}

function isLocalId(id: string) {
  return id.startsWith("local-");
}

function mapQuestionResponse(item: QuestionResponse): QuestionDraft {
  const correctAnswers = item.answer_options
    .map((opt, index) => (opt.is_correct ? index : -1))
    .filter((index) => index >= 0);

  return {
    id: item.id,
    type: item.question_type,
    imageUrl: item.image_url ?? undefined,
    question: item.text,
    options: item.answer_options.map((opt) => opt.text),
    multipleChoice: item.answer_type === "multiple",
    correctAnswers,
    points: item.points,
  };
}

function mapDraftToPayload(question: QuestionDraft, order: number): QuestionCreate {
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
