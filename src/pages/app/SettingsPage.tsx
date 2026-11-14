import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, AlertTriangle, ShieldCheck, Database, User } from 'lucide-react';
import { ResetAccountModal } from '@/components/common/ResetAccountModal';

export const SettingsPage: React.FC = () => {
  const { user, resetCurrentAccountToFreshState, isSupabaseActive } = useAuth();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirmReset = async () => {
    await resetCurrentAccountToFreshState();
    navigate('/app/onboarding');
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      <div className="pb-4 border-b border-neutral-200">
        <Badge variant="neutral" className="font-mono uppercase text-[10px] mb-2">
          Configuration
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-950 tracking-tight">
          Platform & Account Settings
        </h1>
      </div>

      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-950">
            Telemetry & Data Privacy
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Configure how your coding challenge test runs and diagnostic results are utilized by the recommendation engine.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <div>
              <div className="text-xs font-semibold text-neutral-900">Adaptive Re-ranking</div>
              <div className="text-[11px] text-neutral-500">Recalculate milestone order automatically after assessments</div>
            </div>
            <span className="text-xs font-mono font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
              Enabled
            </span>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-950">
            Editor Sandbox Preferences
          </h3>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <div>
              <div className="text-xs font-semibold text-neutral-900">Vim Keybindings</div>
              <div className="text-[11px] text-neutral-500">Toggle modal Vim navigation in the in-browser IDE</div>
            </div>
            <span className="text-xs font-mono text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
              Standard
            </span>
          </div>
        </Card>

        {/* Development Reset Option for Testing First-Time Experience */}
        {import.meta.env.DEV && user && (
          <Card className="p-6 space-y-4 border-amber-300/80 bg-amber-50/30">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" className="bg-amber-100 text-amber-900 border-amber-200 font-mono text-[10px]">
                    Development Sandbox
                  </Badge>
                  <span className="text-xs font-mono text-neutral-500">
                    Active Driver: {isSupabaseActive ? 'Supabase' : 'Client Storage'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-neutral-950 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Reset Test Account to Fresh State</span>
                </h3>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Reset the currently active account (<strong>{user.fullName}</strong> — <code>{user.email}</code>) back to a pristine first-time learner baseline (0% progress, no completed courses, no assessment results, and uncompleted onboarding). This enables complete end-to-end testing of the onboarding and diagnostic flows.
            </p>

            <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-neutral-700 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-neutral-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Strict Isolation Protection:</span>
              </div>
              <p className="text-neutral-600 text-[10px]">
                Only this specific user account's records are cleared. All other registered test accounts and production records remain completely untouched.
              </p>
            </div>

            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
              <div className="text-[11px] font-mono text-neutral-500">
                Current Status: <strong className="text-neutral-800">{user.isProfileComplete ? 'Onboarded' : 'Fresh/Incomplete'}</strong>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResetModalOpen(true)}
                leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-600" />}
                className="text-xs font-bold border-amber-300 text-amber-900 bg-amber-100/60 hover:bg-amber-200"
              >
                Reset to Onboarding...
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Confirmation Modal */}
      <ResetAccountModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        user={user}
      />
    </div>
  );
};
