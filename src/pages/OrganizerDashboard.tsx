import { useNavigate } from "react-router-dom";
import { Trophy, Play, Users, Clock, Plus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { organizerQuizzes } from "@/lib/mockData";
import type { QuizStatus } from "@/lib/types";

const statusBadge: Record<QuizStatus, string> = {
  active: "bg-chart-2/20 text-chart-2",
  completed: "bg-muted text-muted-foreground",
  draft: "bg-chart-1/20 text-chart-1",
};

export default function OrganizerDashboard() {
  const navigate = useNavigate();

  const totalQuizzes = organizerQuizzes.length;
  const activeQuizzes = organizerQuizzes.filter((q) => q.status === "active").length;
  const totalParticipants = organizerQuizzes.reduce(
    (sum, q) => sum + (q.participants ?? 0),
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="Organizer Dashboard" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2>My Quizzes</h2>
            <p className="text-muted-foreground mt-1">
              Create and manage your quizzes
            </p>
          </div>
          <Button onClick={() => navigate("/organizer/create-quiz")}>
            <Plus className="w-4 h-4" />
            Create New Quiz
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Quizzes</p>
                  <p className="text-3xl mt-1">{totalQuizzes}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Quizzes</p>
                  <p className="text-3xl mt-1">{activeQuizzes}</p>
                </div>
                <div className="w-12 h-12 bg-chart-2/20 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Participants
                  </p>
                  <p className="text-3xl mt-1">{totalParticipants}</p>
                </div>
                <div className="w-12 h-12 bg-chart-4/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {organizerQuizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3>{quiz.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusBadge[quiz.status]}`}
                      >
                        {quiz.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" /> {quiz.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {quiz.questions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {quiz.timeLimit}s per question
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {quiz.participants ?? 0} participants
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {quiz.status === "draft" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/organizer/edit-quiz/${quiz.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/organizer/launch-quiz/${quiz.id}`)}
                        >
                          <Play className="w-4 h-4" />
                          Launch
                        </Button>
                      </>
                    )}
                    {quiz.status === "active" && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/organizer/monitor-quiz/${quiz.id}`)}
                      >
                        Monitor
                      </Button>
                    )}
                    {quiz.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/results/${quiz.id}`)}
                      >
                        View Results
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
