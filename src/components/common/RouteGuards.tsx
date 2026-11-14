import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { status, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Authenticating Session...
          </span>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated -> Send to Login
  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Incomplete profile -> Must go to onboarding
  if (status === 'authenticated_incomplete' || (user && !user.isProfileComplete)) {
    if (location.pathname !== '/app/onboarding') {
      return <Navigate to="/app/onboarding" replace />;
    }
  }

  // 3. Completed profile -> Should not re-enter onboarding
  if (status === 'authenticated_complete' && user?.isProfileComplete) {
    if (location.pathname === '/app/onboarding') {
      return <Navigate to="/app/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export const PublicAuthRoute: React.FC = () => {
  const { status, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 font-sans">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If already logged in, redirect away from /login or /signup
  if (status === 'authenticated_complete' && user?.isProfileComplete) {
    return <Navigate to="/app/dashboard" replace />;
  }

  if (status === 'authenticated_incomplete' || (user && !user.isProfileComplete)) {
    return <Navigate to="/app/onboarding" replace />;
  }

  return <Outlet />;
};
