import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface JoinQuizCardProps {
  onJoin: (code: string) => void;
}

export function JoinQuizCard({ onJoin }: JoinQuizCardProps) {
  const [roomCode, setRoomCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = roomCode.trim();
    if (!code) return;
    onJoin(code);
  }

  return (
    <Card className="mb-8 bg-gradient-to-r from-primary/10 to-chart-2/10 border-primary/20">
      <CardContent className="pt-6">
        <h2 className="mb-4">Присоединиться к викторине</h2>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
          <Input
            placeholder="Введите код комнаты (например, ABC123)"
            className="bg-background"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          />
          <Button type="submit">
            <Plus className="w-4 h-4" />
            Присоединиться
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-3">
          Вы можете участвовать без регистрации. Спросите организатора о коде комнаты
        </p>
      </CardContent>
    </Card>
  );
}
