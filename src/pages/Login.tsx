import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LabeledInput } from '@/components/LabeledInput';
import { useLogin } from '@/hooks/useAuth';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const loginMutation = useLogin();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!email || !password) return;
        loginMutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    navigate('/dashboard');
                },
                onError: () => {
                    setError('Login failed. Check your credentials.');
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
                        <h2>Дрбро пожаловать в VK Quiz</h2>
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">Войдите, чтобы продолжить</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                            Войти
                        </Button>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </form>

                    <p className="text-sm text-muted-foreground text-center mt-4">
                        Нет аккаунта?{' '}
                        <Link to="/register" className="text-primary hover:underline">
                            Зарегистрироваться
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
