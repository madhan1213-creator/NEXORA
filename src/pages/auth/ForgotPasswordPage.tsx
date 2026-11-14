import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold font-display text-neutral-950 tracking-tight">
          Reset password
        </h2>
        <p className="text-xs text-neutral-500">
          Enter your registered email and we'll send a secure recovery link
        </p>
      </div>

      {submitted ? (
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-brand-600 mx-auto" />
          <h4 className="font-semibold text-sm text-neutral-900">Recovery Link Sent</h4>
          <p className="text-xs text-neutral-600">
            If an account exists for <strong className="text-neutral-900">{email}</strong>, a password reset email has been dispatched.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSubmitted(false)}
            className="text-xs"
          >
            Try another email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="name@university.edu"
            required
          />

          <Button type="submit" variant="primary" className="w-full font-semibold shadow-sm">
            Send Reset Instructions
          </Button>
        </form>
      )}

      <div className="text-center text-xs text-neutral-500 pt-2">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-neutral-950 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>
      </div>
    </div>
  );
};
