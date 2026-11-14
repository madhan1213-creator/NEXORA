import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isSupabaseActive } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app/dashboard';

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);

    if (!result.success) {
      setServerError(result.error || 'Invalid email or password.');
    } else {
      navigate(from, { replace: true });
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFormErrors({});
    setServerError(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold font-display text-neutral-950 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-neutral-500">
          Enter your credentials to access your autonomous learning cockpit
        </p>
      </div>

      {/* Driver status badge */}
      <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-medium">
          <Database className="w-3.5 h-3.5 text-neutral-500" />
          {isSupabaseActive ? 'Supabase PostgreSQL Auth' : 'Isolated Dev Storage (Hashed)'}
        </span>
        <span className="font-mono text-[10px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded">
          {isSupabaseActive ? 'Active' : 'Simulation'}
        </span>
      </div>

      {/* Error Banner */}
      {serverError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span className="leading-snug">{serverError}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
          }}
          leftIcon={<Mail className="w-4 h-4" />}
          placeholder="learner@university.edu"
          error={formErrors.email}
          disabled={isSubmitting}
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
              Password
            </span>
            <Link to="/forgot-password" className="text-xs text-brand-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formErrors.password) setFormErrors({ ...formErrors, password: undefined });
            }}
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder="••••••••"
            error={formErrors.password}
            disabled={isSubmitting}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-700 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full font-semibold shadow-sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Nexora
          </Button>
        </div>
      </form>

      {/* Quick Demo Pre-fill Links */}
      <div className="pt-2 border-t border-neutral-100 text-center">
        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-2">
          Quick Demo Accounts
        </span>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => fillDemoAccount('alex.chen@nexora.ai', 'password123')}
            className="text-xs text-neutral-600 hover:text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200 transition-colors"
          >
            Alex Chen (Completed)
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('new.student@nexora.ai', 'password123')}
            className="text-xs text-neutral-600 hover:text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200 transition-colors"
          >
            Jordan Taylor (Needs Onboarding)
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-neutral-500 pt-1">
        Don’t have an account yet?{' '}
        <Link to="/signup" className="text-brand-700 font-semibold hover:underline">
          Sign up free
        </Link>
      </div>
    </div>
  );
};
