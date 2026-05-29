import { useRef, useState } from "react";
import { Image as ImageIcon, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LabeledInput } from "@/components/LabeledInput";
import { uploadImage } from "@/api/questions";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);


  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onUpdate(question.id, { imageUrl: url });
    } catch {
      alert("Ошибка загрузки изображения");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }


  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <h4>Вопрос {index + 1}</h4>
          <div className="flex gap-2">
            {onMoveUp && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMoveUp(question.id)}
                disabled={index === 0}
              >
                Вверх
              </Button>
            )}
            {onMoveDown && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMoveDown(question.id)}
                disabled={index === total - 1}
              >
                Вниз
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(question.id)}
              disabled={total === 1}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>

        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-2 font-normal cursor-pointer">
            <input
              type="radio"
              name={`type-${question.id}`}
              checked={question.type === "text"}
              onChange={() => onUpdate(question.id, { type: "text" })}
            />
            <span>Текстовый вопрос</span>
          </label>
          <label className="flex items-center gap-2 font-normal cursor-pointer">
            <input
              type="radio"
              name={`type-${question.id}`}
              checked={question.type === "image"}
              onChange={() => onUpdate(question.id, { type: "image" })}
            />
            <span>Вопрос с изображением</span>
          </label>
        </div>

        {question.type === "image" && (
          <div className="mb-4">
            {question.imageUrl ? (
              <div className="relative w-full">
                <img
                  src={question.imageUrl}
                  alt="Изображение вопроса"
                  className="w-full max-h-60 object-contain rounded-lg border border-border"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-background/80"
                  onClick={() => onUpdate(question.id, { imageUrl: undefined })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div
                className="p-4 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    const fakeEvent = { target: { files: e.dataTransfer.files, value: "" } } as unknown as React.ChangeEvent<HTMLInputElement>;
                    handleFileChange(fakeEvent);
                  }
                }}
              >
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {uploading
                    ? "Загрузка..."
                    : "Нажмите или перетащите изображение сюда"}
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        <div className="space-y-4">
          <LabeledInput
            label="Текст вопроса"
            placeholder="Какой ваш вопрос?"
            value={question.question}
            onChange={(e) => onUpdate(question.id, { question: e.target.value })}
          />

          <label className="flex items-center gap-2 font-normal cursor-pointer">
            <input
              type="checkbox"
              checked={question.multipleChoice}
              onChange={(e) =>
                onUpdate(question.id, {
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
                  name={`correct-${question.id}`}
                  checked={question.correctAnswers.includes(i)}
                  onChange={() => onToggleCorrect(question.id, i)}
                />
                <Input
                  placeholder={`Вариант ${i + 1}`}
                  value={opt}
                  onChange={(e) => onSetOption(question.id, i, e.target.value)}
                />
              </div>
            ))}
          </div>

          <LabeledInput
            type="number"
            label="Баллы"
            value={question.points}
            onChange={(e) =>
              onUpdate(question.id, { points: Number(e.target.value) || 0 })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}