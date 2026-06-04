import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateRoom } from "@/hooks/useRooms";
import { Loader2 } from "lucide-react";

export default function LaunchRoom() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const createRoom = useCreateRoom();

  useEffect(() => {
    if (!quizId) return;

    createRoom.mutate(
      { quiz_id: quizId },
      {
        onSuccess: (room) => {
          navigate(`/room/${room.id}/lobby`, { replace: true });
        },
        onError: () => {
          navigate("/dashboard", { replace: true });
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      <p className="text-muted-foreground">Создание комнаты...</p>
    </div>
  );
}