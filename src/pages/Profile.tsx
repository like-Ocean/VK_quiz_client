import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LabeledInput } from "@/components/LabeledInput";
import { useChangePassword, useUpdateMe } from "@/hooks/useUser";
import { useMe } from "@/hooks/useMe";

export default function Profile() {
  const navigate = useNavigate();
  const { data: me, isLoading } = useMe();
  const updateMe = useUpdateMe();
  const changePassword = useChangePassword();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (!me) return;
    setEmail(me.email);
    setUsername(me.username);
  }, [me]);

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    updateMe.mutate(
      { email, username },
      {
        onSuccess: () => {
          setProfileSuccess("Профиль обновлен");
        },
        onError: () => {
          setProfileError("Не удалось обновить профиль");
        },
      },
    );
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!oldPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    changePassword.mutate(
      { old_password: oldPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setPasswordSuccess("Пароль обновлен");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: () => {
          setPasswordError("Не удалось изменить пароль");
        },
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
              <p className="text-sm text-muted-foreground">Загрузка профиля...</p>
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
                {profileError && <p className="text-sm text-destructive">{profileError}</p>}
                {profileSuccess && (
                  <p className="text-sm text-chart-2">{profileSuccess}</p>
                )}
                <Button type="submit" disabled={updateMe.isPending}>
                  Сохранить изменения
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
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              {passwordSuccess && (
                <p className="text-sm text-chart-2">{passwordSuccess}</p>
              )}
              <Button type="submit" disabled={changePassword.isPending}>
                Обновить пароль
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
