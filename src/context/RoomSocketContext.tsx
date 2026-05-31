import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useRoomSocket } from "@/hooks/useRoomSocket";
import type { RoomSocketState } from "@/types/room";

interface RoomSocketContextValue {
  roomState: RoomSocketState;
  connected: boolean;
  startQuiz: () => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  submitAnswer: (questionId: string, optionIds: string[]) => void;
}

const RoomSocketContext = createContext<RoomSocketContextValue | null>(null);

export function RoomSocketProvider({ joinCode, children }: { joinCode: string; children: ReactNode }) {
  const socket = useRoomSocket(joinCode);
  return <RoomSocketContext.Provider value={socket}>{children}</RoomSocketContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRoomSocketContext() {
  const ctx = useContext(RoomSocketContext);
  if (!ctx) throw new Error("useRoomSocketContext must be used within RoomSocketProvider");
  return ctx;
}