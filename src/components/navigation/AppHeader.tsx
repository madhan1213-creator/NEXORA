import React, { useEffect, useState } from 'react';
import { Menu, Flame, Zap, Bell, Terminal, Bot } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getLearnerState } from '@/services/learning/learnerService';
import { getLearnerProfile } from '@/services/onboarding/onboardingService';
import { getLatestAssessmentResult } from '@/services/assessment/assessmentService';
import { LearnerProgressState } from '@/types/learner';
import { CompleteLearnerProfile } from '@/types';

interface AppHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const { user } = useAuth();
  const userId = user?.id || '';

  const [learnerState, setLearnerState] = useState<LearnerProgressState | null>(null);
  const [profile, setProfile] = useState<CompleteLearnerProfile | null>(null);
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);

  useEffect(() => {
    if (userId) {
      const state = getLearnerState(userId);
      setLearnerState(state);

      getLearnerProfile(userId).then((p) => {
        if (p) setProfile(p);
      });

      const res = getLatestAssessmentResult(userId);
      if (res) {
        setAssessmentScore(res.totalScorePercentage);
      } else {
        setAssessmentScore(null);
      }
    }
  }, [userId, location.pathname]);

  // Route title mapping
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes('/app/dashboard')) return 'Personalized Dashboard';
    if (path.includes('/app/roadmap')) return 'Career Roadmap';
    if (path.includes('/app/skill-analysis')) return 'Skill Gap Matrix & Diagnostics';
    if (path.includes('/app/learning')) return 'Curriculum & Courses';
    if (path.includes('/app/courses/')) return 'Course Overview';
    if (path.includes('/app/assessments')) return 'Diagnostic & Technical Assessments';
    if (path.includes('/app/code-challenge')) return 'Code IDE Sandbox';
    if (path.includes('/app/ai-mentor')) return 'AI Career Mentor';
    if (path.includes('/app/progress')) return 'Telemetry & Progress Tracking';
    if (path.includes('/app/profile')) return 'Learner Profile';
    if (path.includes('/app/settings')) return 'Platform Settings';
    if (path.includes('/app/onboarding')) return 'Student Onboarding & Setup';
    return 'Nexora Workspace';
  };

  const targetRole = profile?.careerGoal || user?.targetCareerId || 'Software Engineer';
  const streak = learnerState?.streakDays || 0;
  const progressPct = learnerState?.overallProgress || 0;
  const isDemo = learnerState?.isDemoAccount || false;

  return (
    <header className="h-20 bg-white border-b border-neutral-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-30 sticky top-0 font-sans">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title & Target Career */}
        <div>
          <h1 className="text-lg font-bold text-neutral-900 font-display tracking-tight leading-snug">
            {getHeaderTitle()}
          </h1>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Target Role:</span>
            <span className="font-semibold text-neutral-800">{targetRole}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            {isDemo ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Demo Account
              </span>
            ) : progressPct > 0 ? (
              <Badge variant="brand" className="py-0 text-[10px]">
                Active Sprint ({progressPct}%)
              </Badge>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                New Learner State
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Metrics & Quick Launch */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Streak chip - show real streak only */}
        {streak > 0 ? (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{streak} Day Streak</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-500 text-xs font-medium">
            <Flame className="w-4 h-4 text-neutral-400" />
            <span>Day 1</span>
          </div>
        )}

        {/* Readiness Score Chip */}
        {assessmentScore !== null ? (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>{assessmentScore}% Assessed Readiness</span>
          </div>
        ) : (
          <Link
            to="/app/assessments"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition"
          >
            <Zap className="w-4 h-4 text-neutral-400" />
            <span>0% (Diagnostic Needed)</span>
          </Link>
        )}

        {/* Quick Launch Sandbox button */}
        <Link to="/app/code-challenge/challenge-python-basics" className="hidden lg:block">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Terminal className="w-3.5 h-3.5 text-brand-600" />}
            className="text-xs font-semibold"
          >
            Open Sandbox
          </Button>
        </Link>

        {/* Quick Launch AI Mentor button */}
        <Link to="/app/ai-mentor" className="hidden xl:block">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Bot className="w-3.5 h-3.5 text-neutral-950" />}
            className="text-xs font-semibold"
          >
            Ask AI Mentor
          </Button>
        </Link>

        {/* Notifications Icon */}
        <button
          className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 relative transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};
