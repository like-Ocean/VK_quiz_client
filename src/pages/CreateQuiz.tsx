import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Image as ImageIcon, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LabeledInput } from "@/components/LabeledInput";
import { categories } from "@/lib/mockData";
import type { QuestionDraft } from "@/lib/types";

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
      <header className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg">QuizMaster</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2>{isEdit ? "Edit Quiz" : "Create New Quiz"}</h2>
          <p className="text-muted-foreground mt-1">
            Build a quiz with questions and options
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              <h3>Quiz Settings</h3>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LabeledInput
              label="Quiz Title"
              placeholder="My Awesome Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>Category</label>
                <select
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg h-9"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <LabeledInput
                type="number"
                label="Time Limit (seconds per question)"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label>Description</label>
              <textarea
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg min-h-20"
                placeholder="Optional description of the quiz"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <h3>Questions ({questions.length})</h3>
          <Button onClick={addQuestion}>
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <Card key={q.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <h4>Question {idx + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(q.id)}
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div className="flex gap-6 mb-4">
                  <label className="flex items-center gap-2 font-normal cursor-pointer">
                    <input
                      type="radio"
                      name={`type-${q.id}`}
                      checked={q.type === "text"}
                      onChange={() => updateQuestion(q.id, { type: "text" })}
                    />
                    <span>Text Question</span>
                  </label>
                  <label className="flex items-center gap-2 font-normal cursor-pointer">
                    <input
                      type="radio"
                      name={`type-${q.id}`}
                      checked={q.type === "image"}
                      onChange={() => updateQuestion(q.id, { type: "image" })}
                    />
                    <span>Image Question</span>
                  </label>
                </div>

                {q.type === "image" && (
                  <div className="p-4 border-2 border-dashed border-border rounded-lg text-center mb-4 cursor-pointer hover:bg-muted/40">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload image or drag and drop
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <LabeledInput
                    label="Question Text"
                    placeholder="What is your question?"
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(q.id, { question: e.target.value })
                    }
                  />

                  <label className="flex items-center gap-2 font-normal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={q.multipleChoice}
                      onChange={(e) =>
                        updateQuestion(q.id, {
                          multipleChoice: e.target.checked,
                          correctAnswers: e.target.checked
                            ? q.correctAnswers
                            : q.correctAnswers.slice(0, 1),
                        })
                      }
                    />
                    <span>Allow multiple correct answers</span>
                  </label>

                  <div className="space-y-2">
                    <label>Options (mark correct)</label>
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type={q.multipleChoice ? "checkbox" : "radio"}
                          name={`correct-${q.id}`}
                          checked={q.correctAnswers.includes(i)}
                          onChange={() => toggleCorrect(q.id, i)}
                        />
                        <Input
                          placeholder={`Option ${i + 1}`}
                          value={opt}
                          onChange={(e) => setOption(q.id, i, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <LabeledInput
                    type="number"
                    label="Points"
                    value={q.points}
                    onChange={(e) =>
                      updateQuestion(q.id, {
                        points: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Quiz</Button>
        </div>
      </main>
    </div>
  );
}
