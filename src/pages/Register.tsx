import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LabeledInput } from '@/components/LabeledInput';
import { useRegister } from '@/hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const registerMutation = useRegister();

  function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError('');
      if (!name || !email || !password) return;
      if (password !== confirm) {
          setError('Пароли не совпадают');
          return;
      }
      registerMutation.mutate(
        { username: name, email, password },
        {
          onSuccess: () => {
            navigate('/dashboard');
          },
          onError: () => {
            setError('Ошибка регистрации. Попробуйте ещё раз.');
          },
        },
      );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle>
              <h2>Создать аккаунт</h2>
          </CardTitle>
          <p className="text-muted-foreground mt-2">Присоединяйтесь к VK Quiz сегодня</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
              <LabeledInput
                label="Имя пользователя"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <LabeledInput
                type="email"
                label="Почта"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <LabeledInput
                type="password"
                label="Пароль"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <LabeledInput
                type="password"
                label="Подтвердить пароль"
                placeholder="Повторите пароль"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Создание аккаунта...
                  </>
                ) : (
                  'Создать аккаунт'
                )}
              </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-4">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
