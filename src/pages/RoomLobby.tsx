import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useRoom, useParticipants, useKick } from "@/hooks/useRooms";
import { useQuiz } from "@/hooks/useQuizzes";
import { useMe } from "@/hooks/useMe";
import { useRoomSocketContext } from "@/context/RoomSocketContext";
import { Copy, Play, UserX } from "lucide-react";
import type { KickRequest } from "@/types/room";

export default function RoomLobby() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { data: me } = useMe();
  const { data: room, isLoading: roomLoading } = useRoom(roomId);
  const { data: quiz } = useQuiz(room?.quiz_id);
  const kick = useKick(roomId ?? "");
  

  const { roomState, startQuiz } = useRoomSocketContext();

  const { data: participants = [] } = useParticipants(roomId, {
    refetchInterval: roomState.phase === "waiting" ? 2000 : false,
  });
  const visibleParticipants = participants.filter((p) => p.user_id !== room?.owner_id);

  useEffect(() => {
    if (roomState.phase === "question") navigate(`/room/${roomId}/play`);
    if (roomState.phase === "kicked") navigate("/dashboard");
  }, [roomState.phase, navigate, roomId]);

  const isOwner = room && me && room.owner_id === me.id;
  const count = visibleParticipants.length;

  async function handleCopy() {
    const joinCode = room?.join_code ?? "";
    try {
      await navigator.clipboard.writeText(joinCode);
    } catch {
      const el = document.createElement("textarea");
      el.value = joinCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  }

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка комнаты...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Комната не найдена</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="Лобби" />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">{quiz?.title ?? "Загрузка..."}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {quiz ? `${quiz.questions_count ?? "—"} вопросов · ` : ""}
            Ожидание участников
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Поделитесь кодом с участниками
              </p>
              <span className="text-5xl font-mono font-bold tracking-[0.2em]">
                {room.join_code}
              </span>
              <Button variant="outline" onClick={handleCopy} className="gap-2">
                <Copy className="w-4 h-4" />
                Скопировать код
              </Button>
            </div>

            {isOwner ? (
              <Button
                size="lg"
                className="w-full gap-2 mt-auto"
                disabled={count < 1}
                onClick={startQuiz}
              >
                <Play className="w-5 h-5" />
                Начать · {count}{" "}
                {count === 1 ? "участник" : count < 5 ? "участника" : "участников"}
              </Button>
            ) : (
              <div className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
                Ожидайте, пока хозяин начнёт игру...
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Участники</h3>
              <span className="text-muted-foreground font-mono text-sm">{count}</span>
            </div>

            {count === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Никто ещё не присоединился...
              </p>
            ) : (
              <ul className="space-y-2">
                {visibleParticipants.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold uppercase shrink-0">
                        {p.display_name.charAt(0)}
                      </div>
                      <span className="text-sm">{p.display_name}</span>
                    </div>
                    {isOwner && p.user_id !== me?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive shrink-0"
                        onClick={() => kick.mutate({ participant_id: p.id } satisfies KickRequest)}
                        disabled={kick.isPending}
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}