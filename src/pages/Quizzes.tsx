import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { QuizFilters } from "@/components/quiz/QuizFilters";
import { QuizRow } from "@/components/quiz/QuizRow";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useMe } from "@/hooks/useMe";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>Назад</Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2>Список квизов</h2>
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

        {isLoading && <p className="text-sm text-muted-foreground">Загрузка...</p>}
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
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: data.total_pages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p} variant={p === page ? "default" : "outline"}
                size="sm" onClick={() => setPage(p)} className="w-9"
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === data.total_pages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}