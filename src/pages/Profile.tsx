import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LabeledInput } from "@/components/LabeledInput";
import { useChangePassword, useUpdateMe } from "@/hooks/useUser";
import { useMe } from "@/hooks/useMe";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const errorMap: Record<string, string> = {
  "Email already in use": "Email уже занят",
  "Username already in use": "Имя пользователя уже занято",
  "Old password is incorrect": "Неверный текущий пароль",
};

function getErrorMessage(error: unknown, fallback: string): string {
  const raw = (error as any)?.response?.data?.detail ?? "";
  return errorMap[raw] ?? fallback;
}

export default function Profile() {
  const navigate = useNavigate();
  const { data: me, isLoading } = useMe();
  const updateMe = useUpdateMe();
  const changePassword = useChangePassword();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!me) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(me.email);
    setUsername(me.username);
  }, [me]);

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateMe.mutate(
      { email, username },
      {
        onSuccess: () => toast.success("Профиль обновлён"),
        onError: (error: unknown) =>
          toast.error(getErrorMessage(error, "Не удалось обновить профиль")),
      },
    );
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    changePassword.mutate(
      { old_password: oldPassword, new_password: newPassword },
      {
        onSuccess: () => {
          toast.success("Пароль обновлён");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error: unknown) =>
          toast.error(getErrorMessage(error, "Не удалось изменить пароль")),
      },
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="Профиль" />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Назад
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Мой профиль</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Загрузка профиля...</span>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleProfileSubmit}>
                <LabeledInput
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <LabeledInput
                  label="Имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button type="submit" disabled={updateMe.isPending}>
                  {updateMe.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    "Сохранить изменения"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Смена пароля</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <LabeledInput
                label="Текущий пароль"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <LabeledInput
                label="Новый пароль"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <LabeledInput
                label="Повторите новый пароль"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Обновление...
                  </>
                ) : (
                  "Обновить пароль"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}