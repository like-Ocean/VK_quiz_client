import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom, fetchParticipants,
  fetchResults, fetchRoom,
  joinRoom, kickParticipant,
} from "@/api/rooms";
import type { KickRequest, RoomCreate, RoomJoin } from "@/types/room";

export function useRoom(roomId?: string) {
  return useQuery({
    queryKey: ["rooms", roomId],
    queryFn: () => fetchRoom(roomId as string),
    enabled: Boolean(roomId),
  });
}

export function useParticipants(roomId?: string) {
  return useQuery({
    queryKey: ["rooms", roomId, "participants"],
    queryFn: () => fetchParticipants(roomId as string),
    enabled: Boolean(roomId),
    refetchInterval: 3000,
  });
}

export function useResults(roomId?: string) {
  return useQuery({
    queryKey: ["rooms", roomId, "results"],
    queryFn: () => fetchResults(roomId as string),
    enabled: Boolean(roomId),
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoomCreate) => createRoom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useJoinRoom() {
  return useMutation({
    mutationFn: (payload: RoomJoin) => joinRoom(payload),
  });
}

export function useKick(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: KickRequest) => kickParticipant(roomId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", roomId, "participants"] });
    },
  });
}