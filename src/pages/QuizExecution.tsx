import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { execQuestions } from "@/lib/mockData";

const QUESTION_TIME = 30;

function arraysEqualUnordered(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

export default function QuizExecution() {
  const { roomCode = "ABC123" } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  const current = execQuestions[questionIndex];
  const total = execQuestions.length;
  const multipleChoice = current?.multipleChoice ?? false;

  const isCorrect = useMemo(
    () =>
      submitted &&
      current &&
      arraysEqualUnordered(selected, current.correctAnswers),
    [submitted, selected, current],
  );

  // Таймер
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(id);
  }, [timeLeft, submitted]);

  // Переход к следующему вопросу или результатам
  useEffect(() => {
    if (!submitted) return;
    const id = window.setTimeout(() => {
      if (questionIndex + 1 >= total) {
        navigate(`/results/exec-${roomCode}`);
      } else {
        setQuestionIndex((i) => i + 1);
        setSelected([]);
        setSubmitted(false);
        setTimeLeft(QUESTION_TIME);
      }
    }, 2000);
    return () => window.clearTimeout(id);
  }, [submitted, questionIndex, total, navigate, roomCode]);

  function handleSelect(i: number) {
    if (submitted) return;
    if (multipleChoice) {
      setSelected((prev) =>
        prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
      );
    } else {
      setSelected([i]);
    }
  }

  function handleSubmit() {
    if (submitted || !current) return;
    setSubmitted(true);
    if (arraysEqualUnordered(selected, current.correctAnswers)) {
      setScore((s) => s + 10);
    }
  }

  if (!current) return null;

  function getOptionClass(i: number) {
    const isSelected = selected.includes(i);
    if (!submitted) {
      return isSelected
        ? "border-primary bg-primary/10"
        : "border-border hover:bg-accent";
    }
    const isRight = current!.correctAnswers.includes(i);
    if (isRight) return "border-chart-2 bg-chart-2/20";
    if (isSelected) return "border-destructive bg-destructive/10";
    return "border-border";
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between gap-3 mb-6">
          <div className="px-4 py-2 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Код комнаты</p>
            <p className="font-mono">{roomCode}</p>
          </div>
          <div className="px-4 py-2 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Вопрос</p>
            <p className="font-mono">
              {questionIndex + 1}/{total}
            </p>
          </div>
          <div className="px-4 py-2 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Очки</p>
            <p className="font-mono">{score} pts</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span
                    className={`text-xl ${
                      timeLeft <= 5 ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    {timeLeft}s
                  </span>
                </div>
                {multipleChoice && (
                  <span className="text-sm text-muted-foreground">
                    Разрешено несколько ответов
                  </span>
                )}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    timeLeft <= 5 ? "bg-destructive" : "bg-primary"
                  }`}
                  style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="mb-6">{current.question}</h2>

            <div className="space-y-3 mb-6">
              {current.options.map((option, i) => {
                const isSelected = selected.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={submitted}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${getOptionClass(i)}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 ${multipleChoice ? "rounded" : "rounded-full"} border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <div
                            className={`w-3 h-3 bg-primary-foreground ${multipleChoice ? "rounded-sm" : "rounded-full"}`}
                          />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!submitted ? (
              <Button
                onClick={handleSubmit}
                disabled={selected.length === 0}
                className="w-full"
              >
                Отправить ответ
              </Button>
            ) : (
              <div
                className={`p-4 rounded-lg ${
                  isCorrect
                    ? "bg-chart-2/20 text-chart-2"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {isCorrect
                  ? "Correct! Moving to next question..."
                  : "Incorrect. The correct answer is highlighted."}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>12 участников онлайн</span>
        </div>
      </div>
    </div>
  );
}
