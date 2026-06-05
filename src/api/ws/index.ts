import { getAccessToken, getGuestToken } from "@/store/tokenStore";
import type { ClientWsEvent, ServerWsEvent } from "@/types/room";

const WS_BASE = import.meta.env.PUBLIC_WS_BASE_URL ?? "ws://localhost:8000/api/ws";

export interface WsConnection {
  ws: WebSocket;
  close: () => void;
}

export function connectRoomWs(
  roomId: string,
  handlers: {
    onOpen?: () => void;
    onMessage: (event: ServerWsEvent) => void;
    onClose?: () => void;
    onError?: () => void;
  },
): WsConnection | null {
  const token = getAccessToken() ?? getGuestToken();

  if (!token) {
    console.warn("WS: no token, skipping connection");
    return null;
  }

  const url = `${WS_BASE}/room/${roomId}?token=${token}`;
  const ws = new WebSocket(url);

  ws.onopen = () => handlers.onOpen?.();

  ws.onmessage = (e) => {
    try {
      const event: ServerWsEvent = JSON.parse(e.data);
      handlers.onMessage(event);
    } catch {
      console.error("WS parse error:", e.data);
    }
  };

  ws.onclose = () => handlers.onClose?.();
  ws.onerror = () => handlers.onError?.();

  return { ws, close: () => ws.close() };
}

export function sendWsEvent(ws: WebSocket | null, payload: ClientWsEvent) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}