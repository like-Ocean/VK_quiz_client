import { api } from '@/api/client';
import type {
    KickRequest, LeaderboardEntry,
    ParticipantResponse, RoomCreate,
    RoomJoin, RoomJoinResponse,
    RoomResponse,
} from '@/types/room';

export async function createRoom(payload: RoomCreate): Promise<RoomResponse> {
  const res = await api.post<RoomResponse>('/rooms', payload);
  console.log("createRoom response:", res.data);
  return res.data;
}

export async function joinRoom(payload: RoomJoin): Promise<RoomJoinResponse> {
    const res = await api.post<RoomJoinResponse>('/rooms/join', payload);
    return res.data;
}

export async function fetchRoom(roomId: string): Promise<RoomResponse> {
    const res = await api.get<RoomResponse>(`/rooms/${roomId}`);
    return res.data;
}

export async function fetchParticipants(roomId: string): Promise<ParticipantResponse[]> {
    const res = await api.get<ParticipantResponse[]>(`/rooms/${roomId}/participants`);
    return res.data;
}

export async function kickParticipant(roomId: string, payload: KickRequest): Promise<void> {
    await api.post(`/rooms/${roomId}/kick`, payload);
}

export async function fetchResults(roomId: string): Promise<LeaderboardEntry[]> {
    const res = await api.get<LeaderboardEntry[]>(`/rooms/${roomId}/results`);
    return res.data;
}

export async function fetchRoomByJoinCode(joinCode: string): Promise<RoomResponse> {
  const { data } = await api.get<RoomResponse>(`/rooms/by-code/${joinCode}`);
  return data;
}

export async function fetchKickReasons() {
  const res = await api.get('/rooms/kick-reasons');
  return res.data as { id: string; label: string }[];
}