import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuizzes, useDeleteQuiz } from "@/hooks/useQuizzes";
import { useMe } from "@/hooks/useMe";
import { useCategories } from "@/hooks/useCategories";
import type { QuizResponse } from "@/types/quiz";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";


export default function Quizzes() {
  const navigate = useNavigate();
  const { data: me } = useMe();
  const { data: categories } = useCategories();

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
            <p className="text-muted-foreground mt-1">Публичные и ваши викторины</p>
          </div>
          <Button onClick={() => navigate("/quiz/new")}>
            <Plus className="w-4 h-4" />
            Создать викторину
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9 h-10"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
            />
          </div>

          <select
            className="px-3 py-2 bg-input-background border border-border rounded-lg h-10 text-sm"
            value={categoryFilter}
            onChange={(e) => handleFilterChange(() => setCategoryFilter(e.target.value))}
          >
            <option value="">Все категории</option>
            {(categories ?? []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {me && (
            <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg h-10 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={onlyMine}
                onChange={(e) => handleFilterChange(() => setOnlyMine(e.target.checked))}
              />
              Только мои
            </label>
          )}
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


function QuizRow({quiz, isOwner, onEdit} : {quiz: QuizResponse; isOwner: boolean; onEdit: () => void;}) {
  const deleteQuiz = useDeleteQuiz();

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm(`Удалить викторину «${quiz.title}»?`)) {
      deleteQuiz.mutate(quiz.id);
    }
  }

  return (
    <Card
      className={`transition-shadow ${isOwner ? "hover:shadow-md cursor-pointer" : ""}`}
      onClick={isOwner ? onEdit : undefined}
    >
      <CardContent className="pt-6 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="truncate">{quiz.title}</h3>
            {isOwner && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full shrink-0">
                Вы создатель
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {quiz.description ?? "Без описания"}
          </p>
          {quiz.category_name && (
            <p className="text-xs text-muted-foreground mt-1">
              Категория: {quiz.category_name}
            </p>
          )}
        </div>

        {isOwner && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
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