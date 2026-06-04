import { useNavigate, useParams } from "react-router-dom";
import { Trophy, Medal, Award, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResults } from "@/hooks/useRooms";

function getRankBadge(rank: number) {
  if (rank === 1) return "bg-chart-1/20 text-chart-1 border-chart-1/30";
  if (rank === 2) return "bg-muted/50 text-muted-foreground border-border";
  if (rank === 3) return "bg-chart-5/20 text-chart-5 border-chart-5/30";
  return "bg-background border-border";
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="w-6 h-6 text-chart-1" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-muted-foreground" />;
  if (rank === 3) return <Award className="w-6 h-6 text-chart-5" />;
  return <span className="text-xl text-muted-foreground">#{rank}</span>;
}

export default function Results() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  const { data: results, isLoading, isError } = useResults(roomId);

  function goDashboard() {
    navigate("/dashboard");
  }

  if (!roomId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          roomId не указан в URL
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Загрузка результатов...
        </p>
      </div>
    );
  }

  if (isError || !results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Не удалось загрузить результаты викторины
        </p>
      </div>
    );
  }
  const leaderboard = results
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({
      rank: index + 1,
      name: entry.display_name,
      score: entry.score,
      total: entry.total,
      correct: entry.correct,
      questions: entry.questions,
    }));

  const totalParticipants = leaderboard.length;
  const questions = leaderboard[0]?.questions ?? 0;
  const avgScore =
    leaderboard.length === 0
      ? 0
      : Math.round(
          leaderboard.reduce((acc, e) => acc + e.score, 0) /
            leaderboard.length,
        );

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1>Результаты викторины</h1>
        </div>

        <Card className="mb-6 bg-gradient-to-r from-primary/5 to-chart-2/5">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
                <Trophy className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2>Поздравляем!</h2>
              <p className="text-muted-foreground mt-2">
                Викторина завершена
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Всего участников
                </p>
                <p className="text-2xl mt-1">{totalParticipants}</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">Вопросы</p>
                <p className="text-2xl mt-1">{questions}</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Средний счёт
                </p>
                <p className="text-2xl mt-1">{avgScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              <h3>Таблица лидеров</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry) => {
                const percent = Math.round(
                  (entry.score / Math.max(entry.total, 1)) * 100,
                );
                return (
                  <div
                    key={entry.rank}
                    className={`p-4 rounded-lg border-2 ${getRankBadge(
                      entry.rank,
                    )}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 flex items-center justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <h4>{entry.name}</h4>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {entry.correct}/{entry.questions} correct
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl">
                          {entry.score}
                          <span className="text-sm text-muted-foreground">
                            /{entry.total}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {percent}% от возможного результата
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={goDashboard}>
            <Home className="w-4 h-4" />
            Назад
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            Присоединиться к другой викторине
          </Button>
        </div>
      </main>
    </div>
  );
}