import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { JoinQuizCard } from "@/components/dashboard/JoinQuizCard";
import { OrganizerCtaCard } from "@/components/dashboard/OrganizerCtaCard";
import { OrganizerSection } from "@/components/dashboard/OrganizerSection";
import { organizerQuizzes, participantHistory } from "@/lib/mockData";
import { useMe } from "@/hooks/useMe";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: user } = useMe();
  function handleCreateQuiz() {
    if (!user) {
      navigate("/register");
      return;
    }
    navigate("/quiz/new");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="Dashboard" />
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
          quizzes={organizerQuizzes}
          onCreate={handleCreateQuiz}
          onEdit={(id) => navigate(`/quiz/${id}/edit`)}
          onLaunch={(id) => navigate(`/quiz/${id}/launch`)}
          onMonitor={(id) => navigate(`/quiz/${id}/monitor`)}
          onResults={(id) => navigate(`/results/${id}`)}
        />

        <ActivitySection
          history={participantHistory}
          onOpenResult={(id) => navigate(`/results/${id}`)}
        />
      </main>
    </div>
  );
}
