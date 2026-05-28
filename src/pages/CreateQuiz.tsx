import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionsToolbar } from "@/components/quiz/QuestionsToolbar";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuizSettingsCard } from "@/components/quiz/QuizSettingsCard";
import { categories } from "@/lib/mockData";
import type { QuestionDraft } from "@/types/quiz";

function makeQuestion(): QuestionDraft {
  return {
    id: crypto.randomUUID(),
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

  const [title, setTitle] = useState(isEdit ? "History Trivia" : "");
  const [category, setCategory] = useState(categories[0]);
  const [timeLimit, setTimeLimit] = useState(30);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([makeQuestion()]);

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
    setQuestions((qs) => [...qs, makeQuestion()]);
  }

  function removeQuestion(id: string) {
    setQuestions((qs) => (qs.length === 1 ? qs : qs.filter((q) => q.id !== id)));
  }

  function handleSave() {
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <QuizHeader onBack={() => navigate("/dashboard")} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2>{isEdit ? "Edit Quiz" : "Create New Quiz"}</h2>
          <p className="text-muted-foreground mt-1">
            Создайте викторину, добавьте вопросы и делитесь с друзьями!
          </p>
        </div>

        <QuizSettingsCard
          title={title}
          onTitleChange={setTitle}
          category={category}
          categories={categories}
          onCategoryChange={setCategory}
          timeLimit={timeLimit}
          onTimeLimitChange={setTimeLimit}
          description={description}
          onDescriptionChange={setDescription}
        />

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
          <Button onClick={handleSave}>Сохранить викторину</Button>
        </div>
      </main>
    </div>
  );
}
