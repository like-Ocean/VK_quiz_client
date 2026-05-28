import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizHeaderProps {
  onBack: () => void;
}

export function QuizHeader({ onBack }: QuizHeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Назад к дашборду
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg">VK Quiz</h1>
        </div>
      </div>
    </header>
  );
}
