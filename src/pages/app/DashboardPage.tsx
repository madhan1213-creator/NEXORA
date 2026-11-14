import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Terminal,
  Bot,
  Radar,
  Sparkles,
  Clock,
  BookOpen,
  AlertCircle,
  Play,
  RotateCcw,
  Layers,
  ChevronRight,
  Target,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  getLearnerState,
  getLearnerRoadmap,
} from '@/services/learning/learnerService';
import { getLevel1ProgressBreakdown } from '@/services/learning/progressCalculationService';
import { getLearnerProfile } from '@/services/onboarding/onboardingService';
import { getLatestAssessmentResult } from '@/services/assessment/assessmentService';
import { LearnerProgressState, PersonalizedRoadmap, LevelProgressReport } from '@/types/learner';
import { CompleteLearnerProfile } from '@/types';
import { AssessmentResult } from '@/types/assessment';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [learnerState, setLearnerState] = useState<LearnerProgressState | null>(null);
  const [profile, setProfile] = useState<CompleteLearnerProfile | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      if (userId) {
        const state = getLearnerState(userId);
        setLearnerState(state);

        const savedProfile = await getLearnerProfile(userId);
        setProfile(savedProfile);

        const pastAssessment = getLatestAssessmentResult(userId);
        setAssessmentResult(pastAssessment);

        const savedRoadmap = getLearnerRoadmap(userId);
        setRoadmap(savedRoadmap);
      }
      setIsLoading(false);
    }
    loadData();
  }, [userId]);

  if (isLoading || !learnerState) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-emerald-600 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-neutral-500">Loading Learner Cockpit...</span>
        </div>
      </div>
    );
  }

  const targetRole = profile?.careerGoal || user?.targetCareerId || 'Data Scientist';
  const isFreshUser = learnerState.overallProgress === 0 && learnerState.assessmentStatus === 'not_started';
  const isDemo = learnerState.isDemoAccount || false;
  const level1Report = getLevel1ProgressBreakdown(learnerState?.completedQuestions || []);

  return (
    <div className="space-y-8 font-sans animate-fadeIn">
      {/* Demo Account Indicator Banner */}
      {isDemo && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-bold bg-amber-200 text-amber-950 uppercase text-[10px]">
              Demo Account
            </span>
            <span>
              You are currently viewing the pre-filled sample demonstration profile for Alex Chen.
            </span>
          </div>
          <Link to="/signup" className="font-bold underline hover:text-amber-950">
            Create Fresh Account
          </Link>
        </div>
      )}

      {/* 1. USER STATUS BANNER */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-emerald-400 flex items-center justify-center font-display font-bold text-xl shadow-sm shrink-0">
            {user?.fullName?.substring(0, 2).toUpperCase() || 'SP'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 tracking-tight">
                Welcome back, {user?.fullName?.split(' ')[0] || 'Learner'}
              </h2>
              {isFreshUser ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200 uppercase">
                  New Learner
                </span>
              ) : (
                <Badge variant="brand" className="font-mono text-[10px] uppercase">
                  Active Sprint
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Target Career:{' '}
              <strong className="text-neutral-800">{targetRole}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {learnerState.hoursLogged > 0 ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{learnerState.hoursLogged} hrs logged this sprint</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-500 text-xs font-medium">
              <span>0 hours logged (Sprint Ready)</span>
            </div>
          )}

          {isFreshUser ? (
            <Link to="/app/assessments">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Zap className="w-3.5 h-3.5 text-neutral-950" />}
                className="font-bold shadow-sm text-xs"
              >
                Start Diagnostic
              </Button>
            </Link>
          ) : (
            <Link to="/app/learning">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<BookOpen className="w-3.5 h-3.5 text-neutral-950" />}
                className="font-bold shadow-sm text-xs"
              >
                Continue Curriculum
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 2. CORE METRICS BENTO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Circular Ring Widget (4 cols) */}
        <Card className="lg:col-span-4 p-6 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-4 font-semibold">
            Overall Curriculum Progress
          </span>

          <div className="relative w-44 h-44 mb-4 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#16e66b"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={`${264 * (1 - learnerState.overallProgress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-display font-extrabold text-neutral-900 leading-none">
                {learnerState.overallProgress}%
              </span>
              <span className="text-xs font-semibold text-neutral-500 mt-1">
                {learnerState.completedLessons.length} Lessons Completed
              </span>
            </div>
          </div>

          {isFreshUser ? (
            <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
              New Account: Take the diagnostic assessment to calibrate your baseline and unlock your roadmap.
            </p>
          ) : (
            <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
              Calculated dynamically from validated lesson completions.
            </p>
          )}
        </Card>

        {/* Diagnostic Assessment & Next Action Widget (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          {/* Diagnostic Assessment Status Card */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  assessmentResult ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {assessmentResult ? <CheckCircle2 className="w-6 h-6" /> : <Zap className="w-6 h-6 text-emerald-600" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-neutral-900 text-base">
                    Diagnostic Assessment Status
                  </h3>
                  {assessmentResult ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Completed ({assessmentResult.totalScorePercentage}%)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Not Started
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 mt-1 max-w-md leading-relaxed">
                  {assessmentResult
                    ? `Assessment completed on ${new Date(assessmentResult.completedAt).toLocaleDateString()}. Identifies ${assessmentResult.strongAreas.length} strengths and ${assessmentResult.weakAreas.length} skill gaps.`
                    : 'The diagnostic assessment evaluates your baseline across core domains. Your personalized roadmap is generated from these results.'}
                </p>
              </div>
            </div>

            <div className="self-end sm:self-auto shrink-0">
              {assessmentResult ? (
                <Link to="/app/assessments">
                  <Button variant="outline" size="sm" className="text-xs font-semibold">
                    View Assessment Report
                  </Button>
                </Link>
              ) : (
                <Link to="/app/assessments">
                  <Button variant="primary" size="sm" className="text-xs font-bold shadow-sm">
                    Start Diagnostic Assessment
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Next Recommended Topic or Getting Started Guide */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Next Recommended Activity
              </span>
              <Badge variant="brand" className="text-[10px] uppercase">
                Priority
              </Badge>
            </div>

            {roadmap?.recommendedNextTopic ? (
              <div className="space-y-2">
                <div className="text-base font-bold text-neutral-900">
                  {roadmap.recommendedNextTopic.topicName}
                </div>
                <p className="text-xs text-neutral-600">
                  Phase: {roadmap.recommendedNextTopic.phaseTitle}
                </p>
                <div className="pt-2">
                  <Link
                    to={`/app/courses/${roadmap.recommendedNextTopic.courseId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition"
                  >
                    <span>Launch Lesson & Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : isFreshUser ? (
              <div className="space-y-3">
                <div className="text-sm font-bold text-neutral-900">
                  Ready to map your learning path to {targetRole}?
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Nexora personalizes course order and skips topics you have already mastered. Take the diagnostic assessment to unlock your custom roadmap.
                </p>
                <div className="pt-1">
                  <Link to="/app/assessments">
                    <Button variant="primary" size="sm" className="text-xs font-bold shadow-sm">
                      Take 15-Minute Diagnostic
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-neutral-800">
                  All current lessons in Phase 1 completed!
                </div>
                <Link to="/app/roadmap" className="text-xs font-bold text-emerald-600 hover:underline">
                  View Full Career Roadmap →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2.5 LEVEL 1 FOUNDATIONAL PROGRESS WIDGET */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="brand" className="font-mono text-[10px] uppercase">
                Level 1 Curriculum
              </Badge>
              <span className="text-xs font-semibold text-neutral-500">
                {level1Report.completedTopics} of {level1Report.totalTopics} Topics Mastered
              </span>
            </div>
            <h3 className="font-bold text-neutral-900 text-lg mt-1">
              Level 1: Foundations of Scientific Computing & Data
            </h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-display font-extrabold text-neutral-900">
              {level1Report.percentage}%
            </span>
            <span className="text-xs font-semibold text-neutral-500 block">Level 1 Progress</span>
          </div>
        </div>

        {/* Level 1 Weighted Progress Bar */}
        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${level1Report.percentage}%` }}
          />
        </div>

        {/* 5 Topic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {level1Report.topics.map((t) => (
            <div
              key={t.topicId}
              className={`p-3 rounded-xl border transition-all ${
                t.isCompleted
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : t.percentage > 0
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-neutral-50/60 border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  {t.skill}
                </span>
                <span
                  className={`text-xs font-mono font-bold ${
                    t.isCompleted
                      ? 'text-emerald-700'
                      : t.percentage > 0
                      ? 'text-amber-700'
                      : 'text-neutral-500'
                  }`}
                >
                  {t.percentage}%
                </span>
              </div>
              <div className="text-xs font-bold text-neutral-900 truncate" title={t.topicName}>
                {t.topicName}
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                {t.completedQuestions}/{t.totalQuestions} Questions Done
              </div>
              <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    t.isCompleted ? 'bg-emerald-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${t.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ROADMAP PREVIEW & SKILLS OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Personalized Roadmap Overview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div>
              <h3 className="font-bold text-neutral-900 text-base">Personalized Learning Roadmap</h3>
              <p className="text-xs text-neutral-500">
                {roadmap ? `${roadmap.phases.length} Phases Calibrated for ${targetRole}` : 'Pending Diagnostic Assessment'}
              </p>
            </div>
            <Link
              to="/app/roadmap"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              <span>Explore Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {roadmap ? (
            <div className="space-y-3">
              {roadmap.phases.map((phase) => (
                <div
                  key={phase.id}
                  className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/60 hover:bg-neutral-50 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                        phase.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : phase.status === 'in_progress'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {phase.phaseNumber}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{phase.title}</div>
                      <div className="text-[11px] text-neutral-500 line-clamp-1">{phase.description}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-neutral-900">{phase.completionPercentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200 space-y-3">
              <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
              <div className="text-sm font-bold text-neutral-800">Roadmap Not Yet Generated</div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Your personalized learning journey will be generated automatically once your diagnostic assessment is completed.
              </p>
              <Link to="/app/assessments">
                <Button variant="primary" size="sm" className="text-xs font-bold shadow-sm">
                  Start Diagnostic Assessment
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Learning Activity Log (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <h3 className="font-bold text-neutral-900 text-base">Recent Learning Activity</h3>
            <span className="text-xs text-neutral-400">Real-time log</span>
          </div>

          {learnerState.learningActivity.length > 0 ? (
            <div className="space-y-3">
              {learnerState.learningActivity.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                    <span>{act.title}</span>
                    <span className="text-[10px] text-neutral-400 font-normal">{act.timestamp}</span>
                  </div>
                  {act.details && <p className="text-[11px] text-neutral-500">{act.details}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200 space-y-2">
              <Clock className="w-6 h-6 text-neutral-400 mx-auto" />
              <div className="text-xs font-bold text-neutral-700">No Activity Recorded Yet</div>
              <p className="text-[11px] text-neutral-400">
                Completed lessons, assessments, and quizzes will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
