import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Award, Clock, Calendar, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { getLearnerState, getLearnerRoadmap } from '@/services/learning/learnerService';
import { getLevel1ProgressBreakdown } from '@/services/learning/progressCalculationService';
import { LearnerProgressState, PersonalizedRoadmap } from '@/types/learner';

export const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [learnerState, setLearnerState] = useState<LearnerProgressState | null>(null);
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);

  useEffect(() => {
    if (userId) {
      setLearnerState(getLearnerState(userId));
      setRoadmap(getLearnerRoadmap(userId));
    }
  }, [userId]);

  const streak = learnerState?.streakDays || 0;
  const hours = learnerState?.hoursLogged || 0;
  const lessonsDone = learnerState?.completedLessons.length || 0;
  const totalLessons = roadmap?.totalLessonsCount || 0;
  const progressPct = learnerState?.overallProgress || 0;
  const isDemo = learnerState?.isDemoAccount || false;
  const earnedXP = lessonsDone * 150 + (learnerState?.assessmentStatus === 'completed' ? 500 : 0);
  const level1Report = getLevel1ProgressBreakdown(learnerState?.completedQuestions || []);

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto animate-fadeIn">
      {/* Demo Account Indicator */}
      {isDemo && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span className="font-semibold">Demo Account: Showing sample telemetry metrics for Alex Chen.</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <Badge variant="brand" className="font-mono uppercase text-[10px] mb-2">
            Telemetry & Progress Tracking
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 tracking-tight">
            Study Velocity & Learning Metrics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Real-time tracking of milestones, validated lesson completions, and streak consistency.
          </p>
        </div>

        <Link to="/app/learning">
          <Button variant="primary" size="sm" className="text-xs font-bold shadow-sm">
            Continue Learning
          </Button>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4 border border-neutral-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-mono uppercase font-semibold">Active Streak</span>
            <div className="text-2xl font-display font-bold text-neutral-900">
              {streak} Days
            </div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border border-neutral-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-mono uppercase font-semibold">Hours Logged</span>
            <div className="text-2xl font-display font-bold text-neutral-900">
              {hours} hrs
            </div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border border-neutral-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-mono uppercase font-semibold">Lessons Done</span>
            <div className="text-2xl font-display font-bold text-neutral-900">
              {lessonsDone} {totalLessons > 0 ? `of ${totalLessons}` : ''}
            </div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border border-neutral-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-mono uppercase font-semibold">Earned XP</span>
            <div className="text-2xl font-display font-bold text-neutral-900">
              {earnedXP} XP
            </div>
          </div>
        </Card>
      </div>

      {/* Level 1 Foundational Progress Breakdown */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="brand" className="font-mono text-[10px] uppercase">
                Curriculum Hierarchy
              </Badge>
              <span className="text-xs font-semibold text-neutral-500">
                {level1Report.completedTopics} of {level1Report.totalTopics} Topics Completed
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

        {/* Level 1 Progress Bar */}
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${level1Report.percentage}%` }}
          />
        </div>

        {/* 5 Topic Progress Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {level1Report.topics.map((t) => (
            <div
              key={t.topicId}
              className={`p-3.5 rounded-xl border ${
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
              <div className="text-[10px] text-neutral-500 mt-1">
                {t.completedQuestions}/{t.totalQuestions} Questions Done
              </div>
              <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${t.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real Completion Velocity & Log */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <h3 className="font-bold text-neutral-900 text-base">Overall Curriculum Completion</h3>
            <span className="text-xs font-bold text-emerald-700">{progressPct}% Complete</span>
          </div>

          <div className="space-y-2">
            <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-500">
              <span>0% Baseline</span>
              <span>100% Industry Mastery</span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <p className="text-xs text-neutral-600 leading-relaxed">
              Progress increments each time you study a topic, verify your code in practice labs, and complete milestone assessments.
            </p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <h3 className="font-bold text-neutral-900 text-base">Activity Feed</h3>
            <span className="text-xs text-neutral-400">Authenticated log</span>
          </div>

          {learnerState && learnerState.learningActivity.length > 0 ? (
            <div className="space-y-2.5">
              {learnerState.learningActivity.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs space-y-0.5">
                  <div className="font-bold text-neutral-900">{act.title}</div>
                  <div className="text-[11px] text-neutral-500">{act.timestamp}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-500 space-y-2">
              <Clock className="w-6 h-6 text-neutral-400 mx-auto" />
              <div className="font-bold text-neutral-700">No Learning Activity Yet</div>
              <p className="text-[11px]">
                Complete your first assessment or lesson to start logging telemetry.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
