import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/quiz/ImageUpload";
import { LabeledInput } from "@/components/LabeledInput";
import type { QuestionDraft } from "@/types/quiz";

interface QuestionCardProps {
  question: QuestionDraft;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<QuestionDraft>) => void;
  onToggleCorrect: (id: string, index: number) => void;
  onSetOption: (id: string, index: number, value: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
}

export function QuestionCard({
  question, index, total,
  onRemove, onUpdate,
  onToggleCorrect, onSetOption,
  onMoveUp, onMoveDown,
}: QuestionCardProps) {
  const hasCorrect = question.correctAnswers.length > 0;
  const id = question.id;

  return (
    <Card className={!hasCorrect ? "border-destructive" : ""}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <h4>Вопрос {index + 1}</h4>
            {!hasCorrect && (
              <span className="text-xs text-destructive">
                Отметьте правильный ответ
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {onMoveUp && (
              <Button variant="ghost" size="sm" disabled={index === 0}
                onClick={() => onMoveUp(id)}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            )}
            {onMoveDown && (
              <Button variant="ghost" size="sm" disabled={index === total - 1}
                onClick={() => onMoveDown(id)}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" disabled={total === 1}
              onClick={() => onRemove(id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>

        <div className="flex gap-6 mb-4">
          {(["text", "image"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 font-normal cursor-pointer">
              <input
                type="radio"
                name={`type-${id}`}
                checked={question.type === t}
                onChange={() => onUpdate(id, { type: t })}
              />
              <span>{t === "text" ? "Текстовый вопрос" : "Вопрос с изображением"}</span>
            </label>
          ))}
        </div>

        {question.type === "image" && (
          <div className="mb-4">
            <ImageUpload
              imageUrl={question.imageUrl}
              onUpload={(url) => onUpdate(id, { imageUrl: url })}
              onRemove={() => onUpdate(id, { imageUrl: undefined })}
            />
          </div>
        )}

        <div className="space-y-4">
          <LabeledInput
            label="Текст вопроса"
            placeholder="Какой ваш вопрос?"
            value={question.question}
            onChange={(e) => onUpdate(id, { question: e.target.value })}
          />

          <label className="flex items-center gap-2 font-normal cursor-pointer">
            <input
              type="checkbox"
              checked={question.multipleChoice}
              onChange={(e) =>
                onUpdate(id, {
                  multipleChoice: e.target.checked,
                  correctAnswers: e.target.checked
                    ? question.correctAnswers
                    : question.correctAnswers.slice(0, 1),
                })
              }
            />
            <span>Разрешить несколько правильных ответов</span>
          </label>

          <div className="space-y-2">
            <label>Варианты ответов (отметьте правильные)</label>
            {question.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type={question.multipleChoice ? "checkbox" : "radio"}
                  name={`correct-${id}`}
                  checked={question.correctAnswers.includes(i)}
                  onChange={() => onToggleCorrect(id, i)}
                />
                <Input
                  placeholder={`Вариант ${i + 1}`}
                  value={opt}
                  onChange={(e) => onSetOption(id, i, e.target.value)}
                />
              </div>
            ))}
          </div>

          <LabeledInput
            type="number"
            label="Баллы"
            value={question.points}
            onChange={(e) => onUpdate(id, { points: Number(e.target.value) || 0 })}
          />
        </div>
      </CardContent>
    </Card>
  );
}