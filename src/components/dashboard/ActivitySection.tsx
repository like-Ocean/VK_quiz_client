import { Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ParticipationHistory } from "@/types/quiz";
import { formatDate } from "@/helpers/formatDate";

interface ActivitySectionProps {
  history: ParticipationHistory[];
  onOpenResult: (id: string) => void;
}

export function ActivitySection({ history, onOpenResult }: ActivitySectionProps) {
  const completed = history.length;
  const avgScore = Math.round(
    history.reduce((acc, h) => acc + (h.score / h.totalPoints) * 100, 0) /
      Math.max(history.length, 1),
  );
  const topThree = history.filter((h) => h.rank <= 3).length;

  return (
    <section>
      <div className="mb-6">
        <h2>Недавняя активность</h2>
        <p className="text-muted-foreground mt-1">Твоя последняя викторина</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Завершенные викторины</p>
                <p className="text-3xl mt-1">{completed}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Средний балл</p>
                <p className="text-3xl mt-1">{avgScore}%</p>
              </div>
              <div className="w-12 h-12 bg-chart-2/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Топ 3</p>
                <p className="text-3xl mt-1">{topThree}</p>
              </div>
              <div className="w-12 h-12 bg-chart-1/20 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="mb-2">{item.title}</h4>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" /> {item.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> 
                      Завершено {formatDate(item.completedAt)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Счет</p>
                      <p className="text-xl">
                        {item.score}/{item.totalPoints}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Место</p>
                      <p className="text-xl">
                        #{item.rank}
                        <span className="text-sm text-muted-foreground">
                          /{item.totalParticipants}
                        </span>
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => onOpenResult(item.id)}>
                      Результаты
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
