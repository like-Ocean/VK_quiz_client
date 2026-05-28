import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionsToolbarProps {
  count: number;
  onAdd: () => void;
}

export function QuestionsToolbar({ count, onAdd }: QuestionsToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3>Вопросы ({count})</h3>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4" />
        Добавить вопрос
      </Button>
    </div>
  );
}
