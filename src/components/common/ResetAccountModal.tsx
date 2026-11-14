import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  X,
  Compass,
  CheckSquare,
  TrendingUp,
  User,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { User as UserType } from '@/types';

interface ResetAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  user: UserType | null;
}

export const ResetAccountModal: React.FC<ResetAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState(false);

  if (!isOpen || !user) return null;

  const handleReset = async () => {
    if (!hasConfirmedCheckbox) return;
    setIsResetting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Failed to reset test account:', err);
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden font-sans text-neutral-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Reset Test Account to Fresh State
              </h3>
              <p className="text-xs text-neutral-400">
                Experience the first-time learner onboarding flow from scratch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isResetting}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Account Info Pill */}
        <div className="p-6 space-y-5">
          <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-white">{user.fullName}</div>
                <div className="text-[11px] font-mono text-neutral-400">{user.email}</div>
              </div>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
              {user.id}
            </span>
          </div>

          {/* Reset Scope Breakdown */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
              The following will be completely reset:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-800/40 border border-neutral-800 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Onboarding Profile & Career Goal</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-800/40 border border-neutral-800 flex items-center gap-2">
                <CheckSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Diagnostic Assessment Results</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-800/40 border border-neutral-800 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Personalized Career Roadmap</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-800/40 border border-neutral-800 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Lessons, XP, Hours & Streaks (0%)</span>
              </div>
            </div>
          </div>

          {/* Isolation & Production Safety Guarantees */}
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Strict Data Isolation Guaranteed</span>
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-neutral-300 text-[10px]">
              <li>Only this active account ({user.email}) is reset.</li>
              <li>Other test accounts and registered users are completely untouched.</li>
              <li>Production data is never modified.</li>
            </ul>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 text-xs text-neutral-300 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={hasConfirmedCheckbox}
              onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
              className="mt-0.5 rounded border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span>
              I understand this action will reset this test account's learning progress and immediately redirect to the <strong>Onboarding Wizard</strong>.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-neutral-950/60 border-t border-neutral-800 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isResetting}
            className="text-xs text-neutral-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleReset}
            disabled={!hasConfirmedCheckbox || isResetting}
            isLoading={isResetting}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 border-none shadow-lg shadow-amber-500/10"
          >
            Confirm & Reset to Onboarding
          </Button>
        </div>
      </div>
    </div>
  );
};
