import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Play, Users, Clock, Plus, Hash } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { organizerQuizzes, participantHistory } from "@/lib/mockData";
import { getUser } from "@/lib/auth";
import type { QuizStatus } from "@/lib/types";

const statusBadge: Record<QuizStatus, string> = {
  active: "bg-chart-2/20 text-chart-2",
  completed: "bg-muted text-muted-foreground",
  draft: "bg-chart-1/20 text-chart-1",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [roomCode, setRoomCode] = useState("");

  const totalQuizzes = organizerQuizzes.length;
  const activeQuizzes = organizerQuizzes.filter((q) => q.status === "active").length;
  const totalParticipants = organizerQuizzes.reduce(
    (sum, q) => sum + (q.participants ?? 0),
    0,
  );

  const completed = participantHistory.length;
  const avgScore = Math.round(
    participantHistory.reduce(
      (acc, h) => acc + (h.score / h.totalPoints) * 100,
      0,
    ) / Math.max(participantHistory.length, 1),
  );
  const topThree = participantHistory.filter((h) => h.rank <= 3).length;

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const code = roomCode.trim();
    if (!code) return;
    navigate(`/quiz/${code}`);
  }

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
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-chart-2/10 border-primary/20">
          <CardContent className="pt-6">
            <h2 className="mb-4">Join a Quiz</h2>
            <form onSubmit={handleJoin} className="flex gap-3 max-w-md">
              <Input
                placeholder="Enter room code (e.g., ABC123)"
                className="bg-background"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              />
              <Button type="submit">
                <Hash className="w-4 h-4" />
                Join Quiz
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-3">
              You can participate without registration. Ask the organizer for the room code.
            </p>
          </CardContent>
        </Card>

        {!user && (
          <Card className="mb-8 border-dashed">
            <CardContent className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3>Want to host quizzes?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Only registered users can create and manage quizzes.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/register")}>Create Account</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="mb-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2>Organize Quizzes</h2>
              <p className="text-muted-foreground mt-1">
                Create, launch, and monitor your quizzes
              </p>
            </div>
            <Button onClick={handleCreateQuiz}>
              <Plus className="w-4 h-4" />
              Create New Quiz
            </Button>
          </div>

          {user ? (
            <>
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
                        <p className="text-sm text-muted-foreground">Total Participants</p>
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
                                onClick={() => navigate(`/quiz/${quiz.id}/edit`)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => navigate(`/quiz/${quiz.id}/launch`)}
                              >
                                <Play className="w-4 h-4" />
                                Launch
                              </Button>
                            </>
                          )}
                          {quiz.status === "active" && (
                            <Button
                              size="sm"
                              onClick={() => navigate(`/quiz/${quiz.id}/monitor`)}
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
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <h3>Organizer tools are available after registration</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Sign in to create and manage quizzes.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        <section>
          <div className="mb-6">
            <h2>Recent Quizzes</h2>
            <p className="text-muted-foreground mt-1">Your latest quiz activity</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                    <p className="text-3xl mt-1">{completed}</p>
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
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-3xl mt-1">{avgScore}%</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-2/20 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-chart-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Top 3 Finishes</p>
                    <p className="text-3xl mt-1">{topThree}</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-1/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-chart-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {participantHistory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="mb-2">{item.title}</h4>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" /> {item.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {item.completedAt}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Score</p>
                          <p className="text-xl">
                            {item.score}/{item.totalPoints}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Rank</p>
                          <p className="text-xl">
                            #{item.rank}
                            <span className="text-sm text-muted-foreground">
                              /{item.totalParticipants}
                            </span>
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/results/${item.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
