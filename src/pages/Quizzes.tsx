import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizFilters } from "@/components/quiz/QuizFilters";
import { useQuizzes, useDeleteQuiz } from "@/hooks/useQuizzes";
import { useMe } from "@/hooks/useMe";
import { useCreateRoom } from "@/hooks/useRooms";
import type { QuizResponse } from "@/types/quiz";
import { 
  Plus, Play, Radio, BarChart2, Pencil, Trash2,
  ChevronLeft, ChevronRight, Tag,
  HelpCircle, Clock, Users } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function Quizzes() {
  const navigate = useNavigate();
  const { data: me } = useMe();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuizzes({
    search: debouncedSearch || undefined,
    category_id: categoryFilter || undefined,
    owner_id: onlyMine && me ? me.id : undefined,
    page,
    page_size: 10,
  });

  function handleFilterChange(fn: () => void) {
    fn();
    setPage(1);
  }

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
          </div>
          <Button onClick={() => navigate("/quiz/new")}>
            <Plus className="w-4 h-4" />
            Создать викторину
          </Button>
        </div>

        <div className="mb-6">
          <QuizFilters
            search={search}
            onSearchChange={(v) => handleFilterChange(() => setSearch(v))}
            categoryFilter={categoryFilter}
            onCategoryChange={(v) => handleFilterChange(() => setCategoryFilter(v))}
            onlyMine={onlyMine}
            onOnlyMineChange={(v) => handleFilterChange(() => setOnlyMine(v))}
            showOnlyMine={Boolean(me)}
          />
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        )}
        {!isLoading && data?.total === 0 && (
          <p className="text-sm text-muted-foreground">Ничего не найдено</p>
        )}

        <div className="space-y-4">
          {(data?.items ?? []).map((quiz) => (
            <QuizRow
              key={quiz.id}
              quiz={quiz}
              isOwner={me?.id === quiz.owner_id}
              onEdit={() => navigate(`/quiz/${quiz.id}/edit`)}
            />
          ))}
        </div>

        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: data.total_pages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                className="w-9"
              >
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === data.total_pages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function QuizRow({ quiz, isOwner, onEdit}: {quiz: QuizResponse;isOwner: boolean;onEdit: () => void;}) {
  const navigate = useNavigate();
  const deleteQuiz = useDeleteQuiz();
  const createRoom = useCreateRoom();

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

  const activeRoomId = quiz.active_room_id;
  const quizStatus = quiz.room_status;

  return (
    <Card
      className={`transition-shadow ${isOwner ? "hover:shadow-md cursor-pointer" : ""}`}
      onClick={isOwner ? onEdit : undefined}
    >
      <CardContent className="pt-6 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">

          {/* Заголовок + бейджи */}
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

          {/* Описание */}
          {quiz.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {quiz.description}
            </p>
          )}

          {/* Метаданные */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {quiz.category_name && (
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {quiz.category_name}
              </span>
            )}
            {quiz.questions_count != null && (
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {quiz.questions_count} вопр.
              </span>
            )}
            {quiz.time_per_question != null && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {quiz.time_per_question} сек.
              </span>
            )}
            {quizStatus === "active" && quiz.participants_count != null && (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <Users className="w-3 h-3" />
                {quiz.participants_count} участн.
              </span>
            )}
          </div>

        </div>

        {isOwner && (
          <div className="flex items-center gap-2 shrink-0">
            {!quizStatus || quizStatus === "finished" ? (
              <>
                {quizStatus === "finished" && activeRoomId && (
                  <Button
                    variant="outline"
                    size="sm"
                    title="Результаты"
                    onClick={(e) => { e.stopPropagation(); navigate(`/results/${activeRoomId}`); }}
                  >
                    <BarChart2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  title="Запустить"
                  onClick={handleLaunch}
                  disabled={createRoom.isPending}
                >
                  <Play className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                title={quizStatus === "waiting" ? "Лобби" : "Наблюдение"}
                onClick={(e) => { e.stopPropagation(); navigate(`/room/${activeRoomId}/lobby`); }}
              >
                <Radio className="w-4 h-4" />
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              title="Редактировать"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="Удалить"
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