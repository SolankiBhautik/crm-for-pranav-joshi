'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(password);

    if (success) {
      router.push('/');
    } else {
      setError('Incorrect password');
      setTimeout(() => setError(''), 3000); // Optional: Auto-hide error after 3 sec
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-md w-96 bg-card">
      <div className="space-y-1">
        <Label htmlFor="password" className="text-foreground">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            className={`mt-2 ${error ? 'border-destructive ring-destructive focus-visible:ring-destructive' : ''}`}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "password-error" : undefined}
          />

          {/* Error message styled with theme variables */}
          {error && (
            <div
              id="password-error"
              className="absolute -bottom-7 left-0 flex items-center gap-1.5 text-sm font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-sm"
              aria-live="polite"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Added margin-top to prevent overlap with error message */}
      <Button className="w-full mt-8">
        Enter
      </Button>
    </form>
  );
}