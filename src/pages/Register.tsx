import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LabeledInput } from '@/components/LabeledInput';
import { setUser } from '@/lib/auth';
import type { UserRole } from '@/lib/types';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<UserRole>('participant');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError('');
      if (!name || !email || !password) return;
      if (password !== confirm) {
          setError('Passwords do not match');
          return;
      }
      setUser({ name, email, role });
      navigate(role === 'organizer' ? '/organizer/dashboard' : '/participant/dashboard');
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle>
              <h2>Create your account</h2>
          </CardTitle>
          <p className="text-muted-foreground mt-2">Join QuizMaster today</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
              <LabeledInput
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <LabeledInput
                type="password"
                label="Confirm Password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <div className="space-y-2">
                <label>I am a:</label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 font-normal cursor-pointer">
                        <input
                            type="radio"
                            name="role"
                            value="participant"
                            checked={role === 'participant'}
                            onChange={() => setRole('participant')}
                        />
                        <span>Participant</span>
                    </label>
                    <label className="flex items-center gap-2 font-normal cursor-pointer">
                        <input
                            type="radio"
                            name="role"
                            value="organizer"
                            checked={role === 'organizer'}
                            onChange={() => setRole('organizer')}
                        />
                        <span>Organizer</span>
                    </label>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full">
                  Create Account
              </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
