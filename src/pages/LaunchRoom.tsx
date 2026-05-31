import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateRoom } from "@/hooks/useRooms";

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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Создание комнаты...</p>
    </div>
  );
}