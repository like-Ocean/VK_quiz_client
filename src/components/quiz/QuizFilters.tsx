import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/useCategories";

interface QuizFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  onlyMine?: boolean;
  onOnlyMineChange?: (value: boolean) => void;
  showOnlyMine?: boolean;
}

export function QuizFilters({
  search, onSearchChange,
  categoryFilter, onCategoryChange,
  onlyMine = false, onOnlyMineChange,
  showOnlyMine = false,
}: QuizFiltersProps) {
  const { data: categories } = useCategories();

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-9 h-10"
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="px-3 py-2 bg-input-background border border-border rounded-lg h-10 text-sm"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Все категории</option>
        {(categories ?? []).map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {showOnlyMine && onOnlyMineChange && (
        <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg h-10 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => onOnlyMineChange(e.target.checked)}
          />
          Только мои
        </label>
      )}
    </div>
  );
}