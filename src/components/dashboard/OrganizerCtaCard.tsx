import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OrganizerCtaCardProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function OrganizerCtaCard({ onLogin, onRegister }: OrganizerCtaCardProps) {
  return (
    <Card className="mb-8 border-dashed">
      <CardContent className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3>Хотите проводить викторины?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Только зарегистрированные пользователи могут создавать и управлять викторинами
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onLogin}>
            Войти
          </Button>
          <Button onClick={onRegister}>Создать аккаунт</Button>
        </div>
      </CardContent>
    </Card>
  );
}
