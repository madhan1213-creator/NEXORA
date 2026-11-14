import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  ShieldCheck,
  UserX,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Wrench,
  Database,
  RotateCcw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResetAccountModal } from './ResetAccountModal';

export const DevAuthSwitcher: React.FC = () => {
  // Never render dev tools in production mode
  if (!import.meta.env.DEV) {
    return null;
  }

  const {
    status,
    user,
    loginAs,
    logout,
    resetCurrentAccountToFreshState,
    isSupabaseActive,
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleResetAccount = async () => {
    await resetCurrentAccountToFreshState();
    setIsOpen(false);
    navigate('/app/onboarding');
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 font-sans">
        <div className="bg-neutral-900/95 text-white backdrop-blur-md rounded-2xl border border-neutral-700/60 shadow-2xl overflow-hidden transition-all duration-200">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2.5 flex items-center gap-3 cursor-pointer select-none hover:bg-neutral-800/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
              <Wrench className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-semibold tracking-wide uppercase text-neutral-300">
                Auth Driver:
              </span>
              <span className="text-[11px] font-mono font-medium text-brand-300 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                {isSupabaseActive ? 'Supabase Live' : 'Dev Simulation'}
              </span>
              <span className="text-xs font-mono font-medium text-neutral-400 bg-neutral-800/60 px-2 py-0.5 rounded">
                {status === 'authenticated_complete' && 'Complete'}
                {status === 'authenticated_incomplete' && 'Incomplete'}
                {status === 'unauthenticated' && 'Guest'}
              </span>
            </div>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-neutral-400" />
            )}
          </div>

          {isOpen && (
            <div className="p-3 border-t border-neutral-800 space-y-2 bg-neutral-950/70 text-xs max-w-sm">
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 pb-1 border-b border-neutral-800">
                <Database className="w-3.5 h-3.5 text-neutral-400" />
                <span>
                  Backend:{' '}
                  {isSupabaseActive ? (
                    <strong className="text-brand-400">PostgreSQL via Supabase Auth</strong>
                  ) : (
                    <strong className="text-amber-400">Isolated Client Storage (Non-mock, SHA-256 hashed)</strong>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {/* 1. Complete Profile preset */}
                <button
                  onClick={() => {
                    loginAs('complete');
                    navigate('/app/dashboard');
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    status === 'authenticated_complete'
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <div>
                    <div className="font-medium">1. Complete Profile (Alex Chen)</div>
                    <div className="text-[10px] text-neutral-400">Bypasses onboarding directly to dashboard</div>
                  </div>
                </button>

                {/* 2. Incomplete Profile preset */}
                <button
                  onClick={() => {
                    loginAs('incomplete');
                    navigate('/app/onboarding');
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    status === 'authenticated_incomplete'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-medium">2. Incomplete Profile (Jordan Taylor)</div>
                    <div className="text-[10px] text-neutral-400">Test the 5-step onboarding wizard</div>
                  </div>
                </button>

                {/* 3. Reset Active Account to Fresh First-Time State */}
                {user && (
                  <button
                    onClick={() => setIsResetModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-amber-300">
                        Reset Active Account ({user.fullName})
                      </div>
                      <div className="text-[10px] text-amber-400/80">
                        Wipes progress & restarts onboarding with confirmation
                      </div>
                    </div>
                  </button>
                )}

                {/* 4. Log out */}
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    status === 'unauthenticated'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <UserX className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <div>
                    <div className="font-medium">Log Out (Unauthenticated Guest)</div>
                    <div className="text-[10px] text-neutral-400">Protects /app/* and permits public pages</div>
                  </div>
                </button>
              </div>

              {user && (
                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Active: <strong>{user.fullName}</strong></span>
                  <span className="font-mono text-[10px] text-neutral-500">{user.email}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ResetAccountModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetAccount}
        user={user}
      />
    </>
  );
};
