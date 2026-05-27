// NOT USED - FOR A WHILE 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Clock, Award, Hash } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { participantHistory } from "@/lib/mockData";

export default function ParticipantDashboard() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="Participant Dashboard" />
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
              Ask the organizer for the room code to join their quiz.
            </p>
          </CardContent>
        </Card>

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
                  <Award className="w-6 h-6 text-chart-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3>Recent Quizzes</h3>
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
      </main>
    </div>
  );
}
