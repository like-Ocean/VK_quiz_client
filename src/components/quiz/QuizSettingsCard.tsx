import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LabeledInput } from "@/components/LabeledInput";
import type { CategoryResponse } from "@/types/category";

interface QuizSettingsCardProps {
  title: string;
  onTitleChange: (value: string) => void;
  categoryId: string;
  categories: CategoryResponse[];
  onCategoryChange: (value: string) => void;
  timeLimit: number;
  onTimeLimitChange: (value: number) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

export function QuizSettingsCard({
  title, onTitleChange, categoryId,
  categories, onCategoryChange,
  timeLimit, onTimeLimitChange,
  description, onDescriptionChange,
}: QuizSettingsCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          <h3>Настройки викторины</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LabeledInput
          label="Название"
          placeholder="Моя классная викторина"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <div className="space-y-2">
          <label>Категория</label>
          <select
            className="w-full px-3 py-2 bg-input-background border border-border rounded-lg h-10"
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <LabeledInput
          type="number"
          label="Лимит времени (секунды на вопрос)"
          value={timeLimit}
          onChange={(e) => onTimeLimitChange(Number(e.target.value) || 0)}
        />
        <div className="space-y-2">
          <label>Описание</label>
          <textarea
            className="w-full px-3 py-2 bg-input-background border border-border rounded-lg min-h-20"
            placeholder="Необязательное описание викторины"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
