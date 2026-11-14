import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ShieldCheck, Target, GraduationCap, Code2, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getLearnerProfile } from '@/services/onboarding/onboardingService';
import { CompleteLearnerProfile } from '@/types';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CompleteLearnerProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        const saved = await getLearnerProfile(user.id);
        if (saved) setProfile(saved);
      }
    }
    loadProfile();
  }, [user]);

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      <div className="pb-4 border-b border-neutral-200">
        <Badge variant="brand" className="font-mono uppercase text-[10px] mb-2">
          Learner Profile & Credentials
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-950 tracking-tight">
          Learner Account & Verified Telemetry
        </h1>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-neutral-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-neutral-950 text-brand-400 font-display font-bold text-2xl flex items-center justify-center">
              {user?.fullName?.substring(0, 2).toUpperCase() || 'SP'}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-display font-bold text-neutral-950">{user?.fullName}</h2>
              <Badge variant="success" className="text-[10px]">
                <ShieldCheck className="w-3 h-3 mr-1" /> Verified Learner
              </Badge>
            </div>
            <p className="text-xs text-neutral-500 font-mono">{user?.email}</p>
            <p className="text-xs text-neutral-600 pt-1">
              Target Career:{' '}
              <strong className="text-neutral-900">
                {profile?.careerGoal || user?.targetCareerId || 'Data Scientist'}
              </strong>
            </p>
          </div>
        </div>

        {/* Dynamic summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Daily Pacing</span>
            <span className="text-base font-bold text-neutral-900">
              {profile?.preferences.dailyStudyHours || 2} Hours / Day
            </span>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Education Standing</span>
            <span className="text-base font-bold text-neutral-900">
              {profile?.education.currentYear || '3rd Year'}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Skills Tracked</span>
            <span className="text-base font-bold text-neutral-900">
              {profile?.skills.length || 4} Calibrated
            </span>
          </div>
        </div>

        {/* Calibrated Skills Preview */}
        {profile?.skills && profile.skills.length > 0 && (
          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-neutral-500">
              Self-Assessed Skill Baseline
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.skills.map((s) => (
                <span
                  key={s.skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-100 text-xs text-neutral-800 font-medium"
                >
                  <span>{s.skill}</span>
                  <span className="text-[10px] font-mono text-brand-800 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                    {s.proficiency.replace('_', ' ')}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
