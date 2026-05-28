import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { JoinQuizCard } from "@/components/dashboard/JoinQuizCard";
import { OrganizerCtaCard } from "@/components/dashboard/OrganizerCtaCard";
import { OrganizerSection } from "@/components/dashboard/OrganizerSection";
import { organizerQuizzes, participantHistory } from "@/lib/mockData";
import { useMe } from "@/hooks/useMe";
import { useMyHistory, useMyQuizzes } from "@/hooks/useUser";
import type { ParticipationHistory, QuizSummary } from "@/types/quiz";
import type { ParticipationHistoryResponse, UserQuizResponse } from "@/types/user";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: user } = useMe();
  const { data: myQuizzes } = useMyQuizzes();
  const { data: myHistory } = useMyHistory();

  const quizzes: QuizSummary[] = (myQuizzes ?? organizerQuizzes).map(mapQuizSummary);
  const history: ParticipationHistory[] = (myHistory ?? participantHistory).map(mapHistoryItem);

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
        <JoinQuizCard onJoin={(code) => navigate(`/quiz/${code}`)} />

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

        <ActivitySection
          history={history}
          onOpenResult={(id) => navigate(`/results/${id}`)}
        />
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
    participants: item.participants ?? 0,
  };
}

function mapHistoryItem(
  item: ParticipationHistoryResponse | ParticipationHistory,
): ParticipationHistory {
  if ("totalPoints" in item) return item;
  return {
    id: item.room_id,
    title: item.quiz_title,
    category: "Без категории",
    score: item.score,
    totalPoints: Math.max(item.score, 1),
    rank: item.leaderboard_position ?? 0,
    totalParticipants: 0,
    completedAt: item.finished_at,
  };
}
