import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: typeof formErrors = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await signUp({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setServerError(result.error || 'Registration failed. Please try again.');
    } else {
      // Redirect to the onboarding wizard
      navigate('/app/onboarding');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold font-display text-neutral-950 tracking-tight">
          Create your account
        </h2>
        <p className="text-xs text-neutral-500">
          Begin your personalized, empirical career learning journey
        </p>
      </div>

      {/* Error Banner */}
      {serverError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span className="leading-snug">{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: undefined });
          }}
          leftIcon={<UserIcon className="w-4 h-4" />}
          placeholder="Jordan Taylor"
          error={formErrors.fullName}
          disabled={isSubmitting}
        />

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
          }}
          leftIcon={<Mail className="w-4 h-4" />}
          placeholder="jordan@university.edu"
          error={formErrors.email}
          disabled={isSubmitting}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (formErrors.password) setFormErrors({ ...formErrors, password: undefined });
          }}
          leftIcon={<Lock className="w-4 h-4" />}
          placeholder="At least 8 characters"
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

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (formErrors.confirmPassword)
              setFormErrors({ ...formErrors, confirmPassword: undefined });
          }}
          leftIcon={<Lock className="w-4 h-4" />}
          placeholder="Repeat your password"
          error={formErrors.confirmPassword}
          disabled={isSubmitting}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-neutral-400 hover:text-neutral-700 focus:outline-none"
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <div className="p-3 rounded-xl bg-brand-50/80 border border-brand-200/80 text-xs text-brand-950 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <span>
            Passwords are encrypted using industry cryptographic hashing. You will immediately proceed to the 5-step technical onboarding wizard.
          </span>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full font-semibold shadow-sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account & Start Onboarding
          </Button>
        </div>
      </form>

      <div className="text-center text-xs text-neutral-500 pt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-700 font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};
