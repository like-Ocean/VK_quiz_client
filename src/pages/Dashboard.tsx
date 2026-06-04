import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { JoinQuizCard } from "@/components/dashboard/JoinQuizCard";
import { OrganizerCtaCard } from "@/components/dashboard/OrganizerCtaCard";
import { OrganizerSection } from "@/components/dashboard/OrganizerSection";
import { useMe } from "@/hooks/useMe";
import { useMyHistory, useMyQuizzes } from "@/hooks/useUser";
import type { ParticipationHistory, QuizSummary } from "@/types/quiz";
import type { ParticipationHistoryResponse, UserQuizResponse } from "@/types/user";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: user } = useMe();
  const { data: myQuizzes } = useMyQuizzes();
  const { data: myHistory } = useMyHistory();
  const [historyLimit, setHistoryLimit] = useState(5);

  
  const quizzes: QuizSummary[] = (myQuizzes ?? [])
    .slice()
    .sort((a, b) => {
      const aDate = new Date(a.created_at).getTime();
      const bDate = new Date(b.created_at).getTime();
      return bDate - aDate;
    })
    .slice(0, 3)
    .map(mapQuizSummary);
  const fullHistory: ParticipationHistory[] = (myHistory ?? []).map(mapHistoryItem);
  const history = fullHistory.slice(0, historyLimit);

  function handleCreateQuiz() {
    if (!user) {
      navigate("/register");
      return;
    }
    navigate("/quiz/new");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="Главная" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <JoinQuizCard onJoin={(code) => navigate(code ? `/join/${code}` : `/join`)} />

        {!user && (
          <OrganizerCtaCard
            onLogin={() => navigate("/login")}
            onRegister={() => navigate("/register")}
          />
        )}

        <OrganizerSection
          isAuthed={Boolean(user)}
          quizzes={quizzes}
          onCreate={handleCreateQuiz}
          onEdit={(id) => navigate(`/quiz/${id}/edit`)}
          onLaunch={(id) => navigate(`/quiz/${id}/launch`)}
          onMonitor={(id) => navigate(`/quiz/${id}/monitor`)}
          onResults={(id) => navigate(`/results/${id}`)}
        />
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => navigate("/quizzes")}>
            Смотреть все квизы
          </Button>
        </div>
        <ActivitySection
          history={history}
          onOpenResult={(id) => navigate(`/results/${id}`)}
        />
        {fullHistory.length > history.length && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistoryLimit((prev) => prev + 5)}
            >
              Показать ещё
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function mapQuizSummary(item: UserQuizResponse | QuizSummary): QuizSummary {
  if ("timeLimit" in item) return item;
  return {
    id: item.id,
    title: item.title,
    category: item.category ?? "Без категории",
    questions: item.questions ?? 0,
    timeLimit: item.time_per_question ?? 0,
    status: item.status ?? "draft",
    participants: item.participants_count ?? 0,
  };
}

function mapHistoryItem(
  item: ParticipationHistoryResponse | ParticipationHistory,
): ParticipationHistory {
  if ("totalPoints" in item) return item;
  return {
    id: item.room_id,
    title: item.quiz_title,
    category: item.category ?? "Без категории",
    score: item.score,
    totalPoints: item.total_points,
    rank: item.leaderboard_position ?? 0,
    totalParticipants: item.total_participants, 
    completedAt: item.finished_at,
  };
}
