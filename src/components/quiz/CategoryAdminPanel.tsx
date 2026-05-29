import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CategoryResponse } from "@/types/category";
import { Plus } from "lucide-react";

interface CategoryAdminPanelProps {
  categories: CategoryResponse[];
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
  isCreating: boolean;
  isDeleting: boolean;
}

export function CategoryAdminPanel({
  categories, onCreate, onDelete,
  isCreating, isDeleting,
}: CategoryAdminPanelProps) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3>Категории (админ)</h3>
          <p className="text-sm text-muted-foreground">
            Добавляйте или удаляйте категории для викторин
          </p>
        </div>
        <form className="flex gap-3" onSubmit={handleSubmit}>
          <Input
            placeholder="Новая категория"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" disabled={isCreating}>
            <Plus className="w-4 h-4" />
            Добавить
          </Button>
        </form>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <span>{category.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(category.id)}
                disabled={isDeleting}
              >
                Удалить
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
