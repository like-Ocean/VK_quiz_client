import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRoomSocketContext } from "@/context/RoomSocketContext";  
import type { WsAnswerOption, QuestionState, QuestionAction } from "@/types/room";
import { useMe } from "@/hooks/useMe";
import { useRoom } from "@/hooks/useRooms";


function questionReducer(state: QuestionState, action: QuestionAction): QuestionState {
  switch (action.type) {
    case "INIT":
      return { questionId: action.questionId, selected: [], submitted: false, timeLeft: action.timeLimit };
    case "SELECT": {
      if (state.submitted) return state;
      const next = action.multiple
        ? state.selected.includes(action.optionId)
          ? state.selected.filter((x) => x !== action.optionId)
          : [...state.selected, action.optionId]
        : [action.optionId];
      return { ...state, selected: next };
    }
    case "SUBMIT":
      return { ...state, submitted: true };
    case "TICK":
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };
    default:
      return state;
  }
}

export default function QuizExecution() {
  // const { joinCode = "" } = useParams<{ joinCode: string }>();
  const { roomId = "" } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { data: me } = useMe();
  const { data: room } = useRoom(roomId);


  const { roomState, submitAnswer } = useRoomSocketContext();
  const { phase, currentQuestion, correctOptionIds, participantCount } = roomState;
  const isOwner = room && me && room.owner_id === me.id;
  
  const [qState, dispatch] = useReducer(questionReducer, {
    questionId: null,
    selected: [],
    submitted: false,
    timeLeft: 0,
  });

  const multipleChoice = currentQuestion?.answer_type === "multiple";
  const timeLimit = currentQuestion?.time_limit ?? 30;

  useEffect(() => {
    if (phase === "question" && currentQuestion && currentQuestion.question_id !== qState.questionId) {
      dispatch({ 
        type: "INIT", 
        questionId: currentQuestion.question_id, 
        timeLimit: currentQuestion.time_limit 
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.question_id]);

    useEffect(() => {
      if (phase !== "question" || qState.timeLeft <= 0) return;
      const id = window.setTimeout(() => dispatch({ type: "TICK" }), 1000);
      return () => clearTimeout(id);
    }, [phase, qState.timeLeft]); 

  useEffect(() => {
    if (phase === "question" && !qState.submitted && qState.timeLeft === 0 && currentQuestion?.question_id === qState.questionId) {
      if (!isOwner) {
        dispatch({ type: "SUBMIT" });
        submitAnswer(currentQuestion.question_id, qState.selected);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qState.timeLeft]);

  useEffect(() => {
    const isLastQuestion =
      currentQuestion && currentQuestion.index + 1 >= currentQuestion.total;

    if (phase === "finished" || (phase === "question_end" && isLastQuestion)) {
      navigate(`/results/${roomId}`, {
        state: { leaderboard: roomState.leaderboard },
      });
    }
    if (phase === "kicked") navigate("/dashboard");
  }, [phase, currentQuestion, navigate, roomId, roomState.leaderboard]);

  function handleSelect(optionId: string) {
    dispatch({ type: "SELECT", optionId, multiple: multipleChoice ?? false });
  }

  function handleSubmit() {
    if (qState.submitted || !currentQuestion || isOwner) return;
    dispatch({ type: "SUBMIT" });
    submitAnswer(currentQuestion.question_id, qState.selected);
  }

  function getOptionClass(option: WsAnswerOption) {
    const isSelected = qState.selected.includes(option.id);
    if (!qState.submitted) {
      return isSelected ? "border-primary bg-primary/10" : "border-border hover:bg-accent";
    }
    const isCorrect = correctOptionIds.includes(option.id);
    if (isCorrect) return "border-green-500 bg-green-500/20";
    if (isSelected) return "border-destructive bg-destructive/10";
    return "border-border";
  }

  if (phase === "waiting" || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Ожидание вопроса...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between gap-3 mb-6">
          <div className="px-4 py-2 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Код комнаты</p>
            <p className="font-mono">{room?.join_code}</p>
          </div>
          <div className="px-4 py-2 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Вопрос</p>
            <p className="font-mono">{currentQuestion.index + 1}/{currentQuestion.total}</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className={`text-xl ${qState.timeLeft <= 5 ? "text-destructive" : "text-foreground"}`}>
                    {qState.timeLeft}s
                  </span>
                </div>
                {multipleChoice && (
                  <span className="text-sm text-muted-foreground">
                    Разрешено несколько ответов
                  </span>
                )}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${qState.timeLeft <= 5 ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${(qState.timeLeft / timeLimit) * 100}%` }}
                />
              </div>
            </div>

            {currentQuestion.image_url && (
              <img
                src={currentQuestion.image_url}
                alt="Question image"
                className="w-full max-h-60 object-contain rounded-lg mb-4"
              />
            )}

            <h2 className="mb-6">{currentQuestion.text}</h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option) => {
                const isSelected = qState.selected.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    disabled={qState.submitted || !!isOwner}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${getOptionClass(option)}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 ${multipleChoice ? "rounded" : "rounded-full"} border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-primary bg-primary" : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <div className={`w-3 h-3 bg-primary-foreground ${multipleChoice ? "rounded-sm" : "rounded-full"}`} />
                        )}
                      </div>
                      <span>{option.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!isOwner && (
              <>
                {!qState.submitted ? (
                  <Button onClick={handleSubmit} disabled={qState.selected.length === 0} className="w-full">
                    Отправить ответ
                  </Button>
                ) : (
                  <div className="p-4 rounded-lg text-sm bg-muted text-muted-foreground">
                    {phase === "question_end" ? "Ждём следующий вопрос..." : "Ответ отправлен, ждём остальных..."}
                  </div>
                )}
              </>
            )}

            {isOwner && (
              <div className="p-4 rounded-lg text-sm bg-muted text-muted-foreground text-center">
                Вы наблюдаете за игрой
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{participantCount} участников онлайн</span>
        </div>
      </div>
    </div>
  );
}