import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizMeta } from "@/components/quiz/QuizMeta";
import { useDeleteQuiz } from "@/hooks/useQuizzes";
import { useCreateRoom } from "@/hooks/useRooms";
import type { QuizResponse } from "@/types/quiz";
import { Play, Radio, BarChart2, Pencil, Trash2 } from "lucide-react";

interface QuizRowProps {
  quiz: QuizResponse;
  isOwner: boolean;
  onEdit: () => void;
}

export function QuizRow({ quiz, isOwner, onEdit }: QuizRowProps) {
  const navigate = useNavigate();
  const deleteQuiz = useDeleteQuiz();
  const createRoom = useCreateRoom();

  const activeRoomId = quiz.active_room_id;
  const quizStatus = quiz.room_status;

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm(`Удалить викторину «${quiz.title}»?`)) {
      deleteQuiz.mutate(quiz.id);
    }
  }

  function handleLaunch(e: React.MouseEvent) {
    e.stopPropagation();
    createRoom.mutate(
      { quiz_id: quiz.id },
      { onSuccess: (room) => navigate(`/room/${room.id}/lobby`) },
    );
  }

  return (
    <Card
      className={`transition-shadow ${isOwner ? "hover:shadow-md cursor-pointer" : ""}`}
      onClick={isOwner ? onEdit : undefined}
    >
      <CardContent className="pt-6 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="truncate">{quiz.title}</h3>
            {isOwner && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full shrink-0">
                Вы создатель
              </span>
            )}
            {quizStatus === "active" && (
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full shrink-0 animate-pulse">
                В эфире
              </span>
            )}
          </div>

          {quiz.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {quiz.description}
            </p>
          )}

          <QuizMeta quiz={quiz} />
        </div>

        {isOwner && (
          <div className="flex items-center gap-2 shrink-0">
            {!quizStatus || quizStatus === "finished" ? (
              <>
                {quizStatus === "finished" && activeRoomId && (
                  <Button
                    variant="outline" size="sm" title="Результаты"
                    onClick={(e) => { e.stopPropagation(); navigate(`/results/${activeRoomId}`); }}
                  >
                    <BarChart2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="outline" size="sm" title="Запустить"
                  onClick={handleLaunch}
                  disabled={createRoom.isPending}
                >
                  <Play className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline" size="sm"
                title={quizStatus === "waiting" ? "Лобби" : "Наблюдение"}
                onClick={(e) => { e.stopPropagation(); navigate(`/room/${activeRoomId}/lobby`); }}
              >
                <Radio className="w-4 h-4" />
              </Button>
            )}

            <Button
              variant="outline" size="sm" title="Редактировать"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="outline" size="sm" title="Удалить"
              onClick={handleDelete}
              disabled={deleteQuiz.isPending}
              className="text-destructive hover:text-destructive hover:border-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}