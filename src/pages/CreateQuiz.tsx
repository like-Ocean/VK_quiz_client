import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CategoryAdminPanel } from "@/components/quiz/CategoryAdminPanel";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionsToolbar } from "@/components/quiz/QuestionsToolbar";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuizSettingsCard } from "@/components/quiz/QuizSettingsCard";
import { useCreateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { useMe } from "@/hooks/useMe";
import { useCreateQuestion, useDeleteQuestion, useReorderQuestions, useUpdateQuestion } from "@/hooks/useQuestions";
import { useCreateQuiz, useUpdateQuiz } from "@/hooks/useQuizzes";
import { useQuizForm, isLocalId } from "@/hooks/useQuizForm";
import { mapDraftToPayload } from "@/helpers/quizMappers";

function normalizeOption(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return "";

  return trimmed[0].toUpperCase() + trimmed.slice(1);
}


export default function CreateQuiz() {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId?: string }>();
  const { data: me } = useMe();

  const {
    title, setTitle,
    categoryId, setCategoryId,
    timeLimit, setTimeLimit,
    description, setDescription,
    questions, addQuestion, removeQuestion, reorderQuestion,
    updateQuestion, setOption, toggleCorrect,
    categoryOptions, categoryData, isEdit,
  } = useQuizForm(quizId);

  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();
  const createQuestion = useCreateQuestion();
  const updateQuestionApi = useUpdateQuestion();
  const deleteQuestionApi = useDeleteQuestion();
  const reorderQuestionsApi = useReorderQuestions();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  function handleRemoveQuestion(id: string) {
    removeQuestion(id);
    if (quizId && !isLocalId(id)) {
      deleteQuestionApi.mutate({ quizId, questionId: id });
    }
  }

  function handleReorder(id: string, direction: "up" | "down") {
    reorderQuestion(id, direction);
    if (quizId) {
      const order = questions
        .filter((q) => !isLocalId(q.id))
        .map((q) => q.id);
      if (order.length > 0) {
        reorderQuestionsApi.mutate({ quizId, payload: { order } });
      }
    }
  }

function handleSave() {
  if (!title.trim()) {
    alert("Введите название викторины");
    return;
  }

  const invalidQuestion = questions.find((q) => q.correctAnswers.length === 0);
  if (invalidQuestion) {
    const idx = questions.indexOf(invalidQuestion);
    alert(`Вопрос ${idx + 1}: отметьте хотя бы один правильный ответ`);
    return;
  }

  const emptyOption = questions.find((q) => q.options.some((opt) => !opt.trim()));
  if (emptyOption) {
    const idx = questions.indexOf(emptyOption);
    alert(`Вопрос ${idx + 1}: заполните все варианты ответов`);
    return;
  }

  const normalizedQuestions = questions.map((q) => ({
    ...q,
    question: q.question.trim(),
    options: q.options.map((opt) => normalizeOption(opt)),
  }));

  const payload = {
    title: title.trim(),
    description: description.trim(),
    category_id: categoryId || undefined,
    time_per_question: timeLimit,
    is_public: true,
  };

  if (isEdit && quizId) {
    updateQuiz.mutate(
      { quizId, payload },
      {
        onSuccess: () => {
          const ops = normalizedQuestions.map((q, i) => {
            const qPayload = mapDraftToPayload(q, i + 1);
            return isLocalId(q.id)
              ? createQuestion.mutateAsync({ quizId, payload: qPayload })
              : updateQuestionApi.mutateAsync({ quizId, questionId: q.id, payload: qPayload });
          });
          Promise.all(ops).then(() => navigate(`/quizzes/${quizId}`));
        },
      },
    );
    return;
  }

  createQuiz.mutate(payload, {
    onSuccess: async (created) => {
      await Promise.all(
        normalizedQuestions.map((q, i) =>
          createQuestion.mutateAsync({
            quizId: created.id,
            payload: mapDraftToPayload(q, i + 1),
          }),
        ),
      );
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
          title={title} onTitleChange={setTitle}
          categoryId={categoryId} categories={categoryOptions} onCategoryChange={setCategoryId}
          timeLimit={timeLimit} onTimeLimitChange={setTimeLimit}
          description={description} onDescriptionChange={setDescription}
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
              onRemove={handleRemoveQuestion}
              onUpdate={updateQuestion}
              onToggleCorrect={toggleCorrect}
              onSetOption={setOption}
              onMoveUp={(id) => handleReorder(id, "up")}
              onMoveDown={(id) => handleReorder(id, "down")}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={createQuiz.isPending || updateQuiz.isPending}
          >
            Сохранить
          </Button>
        </div>
      </main>
    </div>
  );
}