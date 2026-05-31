import { Outlet, useParams } from "react-router-dom";
import { RoomSocketProvider } from "@/context/RoomSocketContext";
import { useRoom } from "@/hooks/useRooms";

export function RoomSocketWrapper() {
  const { roomId } = useParams<{ roomId: string }>();
  const { data: room, isLoading } = useRoom(roomId);
  if (isLoading) return <div className="p-4">Загрузка комнаты...</div>;
  if (!room) return <div className="p-4">Комната не найдена</div>;
  return (
    <RoomSocketProvider joinCode={room.join_code}>
      <Outlet />
    </RoomSocketProvider>
  );
}