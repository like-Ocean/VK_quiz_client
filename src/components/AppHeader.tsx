import { Trophy, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";
import { useMe } from "@/hooks/useMe";

interface AppHeaderProps {
  subtitle: string;
  showLogout?: boolean;
}

export function AppHeader({ subtitle, showLogout = true }: AppHeaderProps) {
  const navigate = useNavigate();
  const { data: user } = useMe();
  const logoutMutation = useLogout();

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        navigate("/login");
      },
    });
  }

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground cursor-pointer" />
          </div>
          <div>
            <h1 className="text-lg cursor-pointer">VK Quiz</h1>
            <p className="text-sm text-muted-foreground cursor-pointer">{subtitle}</p>
          </div>
        </button>
        {showLogout && user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Добро пожаловать, {user.username}
            </span>
               <Button variant="ghost" size="lg" onClick={() => navigate("/quizzes")}>
                 Мои квизы
               </Button>
            <Button variant="ghost" className="cursor-pointer" size="lg" onClick={() => navigate("/profile")}>
              Профиль
            </Button>
            <Button variant="ghost" className="cursor-pointer" size="lg" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
