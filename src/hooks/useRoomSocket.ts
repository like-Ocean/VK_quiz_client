import { useCallback, useEffect, useRef, useState } from 'react';
import { connectRoomWs } from '@/api/ws';
import { getAccessToken, getGuestToken } from '@/store/tokenStore';
import type { ClientWsEvent, RoomSocketState, ServerWsEvent } from '@/types/room';

const RECONNECT_DELAY = 3000;
const MAX_RECONNECTS = 5;

const initialState: RoomSocketState = {
    phase: 'waiting',
    participantCount: 0,
    currentQuestion: null,
    correctOptionIds: [],
    leaderboard: [],
    answeredParticipants: [],
    kickReason: null,
    wsError: null,
};

function reduce(state: RoomSocketState, ev: ServerWsEvent): RoomSocketState {
    switch (ev.event) {
        case 'participant_joined':
            return { ...state, participantCount: ev.participant_count };
        case 'question_start':
            return {
                ...state,
                phase: 'question',
                currentQuestion: {
                    question_id: ev.question_id,
                    text: ev.text,
                    image_url: ev.image_url,
                    answer_type: ev.answer_type,
                    options: ev.options,
                    time_limit: ev.time_limit,
                    index: ev.index,
                    total: ev.total,
                },
                correctOptionIds: [],
                answeredParticipants: [],
            };
        case 'question_end':
            return {
                ...state,
                phase: 'question_end',
                correctOptionIds: ev.correct_option_ids,
                leaderboard: ev.leaderboard,
            };
        case 'participant_answered':
            return {
                ...state,
                answeredParticipants: [...state.answeredParticipants, ev.participant_id],
            };
        case 'leaderboard_update':
            return { ...state, leaderboard: ev.leaderboard };
        case 'quiz_finish':
            return { ...state, phase: 'finished', leaderboard: ev.leaderboard };
        case 'kicked':
            return { ...state, phase: 'kicked', kickReason: ev.reason };
        case 'error':
            return { ...state, wsError: ev.detail };
        default:
            return state;
    }
}

export function useRoomSocket(roomId: string | undefined) {
    const [roomState, setRoomState] = useState<RoomSocketState>(initialState);
    const [connected, setConnected] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectCount = useRef(0);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!roomId) return;

        const token = getAccessToken() ?? getGuestToken();
        if (!token) return;

        function connect() {
            const conn = connectRoomWs(roomId!, {
                onOpen: () => {
                    setConnected(true);
                    reconnectCount.current = 0;
                },
                onMessage: (event) => {
                    setRoomState((prev) => reduce(prev, event));
                },
                onClose: () => {
                    setConnected(false);
                    if (reconnectCount.current < MAX_RECONNECTS) {
                        reconnectCount.current += 1;
                        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
                    }
                },
                onError: () => conn?.close(),
            });

            if (conn) wsRef.current = conn.ws;
        }

        connect();

        return () => {
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            wsRef.current?.close();
        };
    }, [roomId]);

    const send = useCallback((payload: ClientWsEvent) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(payload));
        }
    }, []);

    const startQuiz = useCallback(() => send({ event: 'start_quiz' }), [send]);
    const nextQuestion = useCallback(() => send({ event: 'next_question' }), [send]);
    const endQuiz = useCallback(() => send({ event: 'end_quiz' }), [send]);
    const submitAnswer = useCallback(
        (questionId: string, optionIds: string[]) =>
            send({ event: 'submit_answer', question_id: questionId, option_ids: optionIds }),
        [send],
    );

    return { roomState, connected, startQuiz, nextQuestion, endQuiz, submitAnswer };
}
