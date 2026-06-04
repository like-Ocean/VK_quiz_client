import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinRoom } from "@/hooks/useRooms";
import { useMe } from "@/hooks/useMe";
import { setGuestToken } from "@/store/tokenStore";
import { Loader2 } from "lucide-react";

export default function JoinRoom() {
  const { joinCode: codeFromUrl } = useParams<{ joinCode?: string }>();
  const navigate = useNavigate();
  const { data: me } = useMe();
  const joinRoom = useJoinRoom();

  const [code, setCode] = useState(codeFromUrl ?? "");
  const [guestName, setGuestName] = useState("");

  function handleJoin() {
    if (!code.trim()) return;

    joinRoom.mutate(
      {
        join_code: code.trim().toUpperCase(),
        guest_name: me ? undefined : guestName.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          if (res.guest_token) setGuestToken(res.guest_token);
          navigate(`/room/${res.room_id}/lobby`);
        },
      },
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="Войти в игру" />
      <main className="max-w-md mx-auto px-4 py-16 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Войти в комнату</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Введите код комнаты, который выдал организатор
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Код комнаты</label>
            <Input
              placeholder="ABCDEF"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="font-mono text-center text-2xl tracking-widest h-14"
              maxLength={6}
            />
          </div>

          {!me && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Ваше имя</label>
              <Input
                placeholder="Введите имя"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </div>
          )}

          <Button
            size="lg"
            onClick={handleJoin}
            disabled={!code.trim() || (!me && !guestName.trim()) || joinRoom.isPending}
          >
            {joinRoom.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Подключение...
              </>
            ) : (
              "Войти"
            )}
          </Button>

          {joinRoom.isError && (
            <p className="text-sm text-destructive text-center">
              Комната не найдена или недоступна
            </p>
          )}
        </div>
      </main>
    </div>
  );
}