import { Tag, HelpCircle, Clock, Users } from "lucide-react";
import type { QuizResponse } from "@/types/quiz";

export function QuizMeta({ quiz }: { quiz: QuizResponse }) {
  const quizStatus = quiz.room_status;

  return (
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
  );
}