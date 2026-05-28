import { Clock, Play, Plus, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { QuizStatus, QuizSummary } from "@/lib/types";

const statusBadge: Record<QuizStatus, string> = {
  active: "bg-chart-2/20 text-chart-2",
  completed: "bg-muted text-muted-foreground",
  draft: "bg-chart-1/20 text-chart-1",
};

interface OrganizerSectionProps {
  isAuthed: boolean;
  quizzes: QuizSummary[];
  onCreate: () => void;
  onEdit: (quizId: string) => void;
  onLaunch: (quizId: string) => void;
  onMonitor: (quizId: string) => void;
  onResults: (quizId: string) => void;
}

export function OrganizerSection({
  isAuthed, quizzes, onCreate, onEdit, onLaunch,
  onMonitor, onResults,
}: OrganizerSectionProps) {
  const totalQuizzes = quizzes.length;
  const activeQuizzes = quizzes.filter((q) => q.status === "active").length;
  const totalParticipants = quizzes.reduce((sum, q) => sum + (q.participants ?? 0), 0);

  return (
    <section className="mb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2>Организовать викторины</h2>
          <p className="text-muted-foreground mt-1">
            Создавайте, запускайте и отслеживайте свои викторины
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4" />
          Создать викторину
        </Button>
      </div>

      {isAuthed ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Все викторины</p>
                    <p className="text-3xl mt-1">{totalQuizzes}</p>
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
                    <p className="text-sm text-muted-foreground">Активные викторины</p>
                    <p className="text-3xl mt-1">{activeQuizzes}</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-2/20 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-chart-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Всего участников</p>
                    <p className="text-3xl mt-1">{totalParticipants}</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-4/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-chart-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3>{quiz.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${statusBadge[quiz.status]}`}
                        >
                          {quiz.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" /> {quiz.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {quiz.questions} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {quiz.timeLimit}s per question
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {quiz.participants ?? 0} participants
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {quiz.status === "draft" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => onEdit(quiz.id)}>
                            Изменить
                          </Button>
                          <Button size="sm" onClick={() => onLaunch(quiz.id)}>
                            <Play className="w-4 h-4" />
                            Запустить викторину
                          </Button>
                        </>
                      )}
                      {quiz.status === "active" && (
                        <Button size="sm" onClick={() => onMonitor(quiz.id)}>
                          Мониторинг
                        </Button>
                      )}
                      {quiz.status === "completed" && (
                        <Button size="sm" variant="outline" onClick={() => onResults(quiz.id)}>
                          Результаты
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <h3>Организаторские инструменты доступны после регистрации</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Войдите, чтобы создавать и управлять викторинами.
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
