import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuiz } from "@/hooks/useQuizzes";
import { formatDate } from "@/helpers/formatDate";

export default function QuizDetails() {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const { data, isLoading } = useQuiz(quizId);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="Квиз" />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/quizzes")}>Назад</Button>
          <Button onClick={() => navigate(`/quiz/${quizId}/edit`)}>Редактировать</Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            {isLoading && <p className="text-sm text-muted-foreground">Загрузка...</p>}
            {data && (
              <div className="space-y-3">
                <h2>{data.title}</h2>
                <p className="text-muted-foreground">
                  {data.description ?? "Без описания"}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div>Категория: {data.category_name ?? "—"}</div>
                  <div>Время на вопрос: {data.time_per_question}с</div>
                  <div>Публичный: {data.is_public ? "Да" : "Нет"}</div>
                  <div>Создан: {formatDate(data.created_at)}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
