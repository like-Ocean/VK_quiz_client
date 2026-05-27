import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LabeledInput } from '@/components/LabeledInput';
import { nameFromEmail, setUser } from '@/lib/auth';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !password) return;
        setUser({ email, name: nameFromEmail(email) });
        navigate('/dashboard');
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                        <Trophy className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle>
                        <h2>Welcome to QuizMaster</h2>
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">Sign in to continue</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <LabeledInput
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <LabeledInput
                            type="password"
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>

                    <p className="text-sm text-muted-foreground text-center mt-4">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:underline">
                            Register
                        </Link>
                    </p>

                    <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                        <p className="font-medium mb-1">Demo Account:</p>
                        <p>demo@quiz.com</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
