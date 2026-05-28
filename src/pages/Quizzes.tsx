import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizzes } from "@/hooks/useQuizzes";
import type { QuizResponse } from "@/types/quiz";
import { Plus } from "lucide-react";

export default function Quizzes() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuizzes();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="Квизы" />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Назад
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>Список квизов</h2>
            <p className="text-muted-foreground mt-1">Публичные и ваши викторины</p>
          </div>

          <Button onClick={() => navigate("/quiz/new")}>
            <Plus className="w-4 h-4" />
            Создать викторину
          </Button>
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Загрузка списка...</p>
        )}

        <div className="space-y-4">
          {(data ?? []).map((quiz) => (
            <QuizRow key={quiz.id} quiz={quiz} onOpen={() => navigate(`/quizzes/${quiz.id}`)} />
          ))}
        </div>
      </main>
    </div>
  );
}

function QuizRow({ quiz, onOpen }: { quiz: QuizResponse; onOpen: () => void }) {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onOpen}
    >
      <CardContent className="pt-6">
        <h3>{quiz.title}</h3>
        <p className="text-sm text-muted-foreground">
          {quiz.description ?? "Без описания"}
        </p>
      </CardContent>
    </Card>
  );
}
