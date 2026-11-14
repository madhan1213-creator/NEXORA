import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Terminal, HelpCircle, FileText, ArrowRight, Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { getLearnerState } from '@/services/learning/learnerService';
import { getLevel1ProgressBreakdown } from '@/services/learning/progressCalculationService';
import { mockCourses } from '@/data/mockData';
import { LearnerProgressState } from '@/types/learner';

export const CourseLevelDetailPage: React.FC = () => {
  const { courseId, levelId } = useParams<{ courseId: string; levelId: string }>();
  const { user } = useAuth();
  const userId = user?.id || '';

  const [learnerState, setLearnerState] = useState<LearnerProgressState | null>(null);

  useEffect(() => {
    if (userId) {
      setLearnerState(getLearnerState(userId));
    }
  }, [userId]);

  const course = mockCourses.find((c) => c.id === courseId) || mockCourses[0];
  const level = course.levels.find((l) => l.id === levelId) || course.levels[0];
  const isLevel1 = level.levelNumber === 1 || levelId === 'lvl-1';
  const level1Report = getLevel1ProgressBreakdown(learnerState?.completedQuestions || []);
  const levelProgress = isLevel1
    ? level1Report.percentage
    : Math.round(
        (level.modules.filter((m) => learnerState?.completedLessons.includes(m.id)).length /
          Math.max(1, level.modules.length)) *
          100
      );

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto animate-fadeIn">
      <div>
        <Link
          to={`/app/courses/${course.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to {course.title}
        </Link>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Badge variant="brand" className="font-mono text-[10px] uppercase">
              Level {level.levelNumber} Modules
            </Badge>
            <h1 className="text-2xl font-display font-bold text-neutral-950 tracking-tight mt-1">
              {level.title}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-2xl font-display font-extrabold text-neutral-900">
              {levelProgress}%
            </span>
            <span className="text-xs font-semibold text-neutral-500 block">Level Progress</span>
          </div>
        </div>

        <p className="text-sm text-neutral-600 leading-relaxed">{level.summary}</p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      {/* If Level 1: Display Required Topics Breakdown */}
      {isLevel1 && (
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-display font-bold text-neutral-950">
                Level 1 Required Curriculum Topics
              </h2>
              <p className="text-xs text-neutral-500">
                Calculated from all 5 required Level 1 topics (weighted 20% each). All topics must be completed to achieve 100% Level 1 mastery.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700">
              {level1Report.completedTopics}/{level1Report.totalTopics} Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {level1Report.topics.map((t) => (
              <div
                key={t.topicId}
                className={`p-3.5 rounded-xl border transition-all ${
                  t.isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200'
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
      )}

      <div className="space-y-4">
        <h2 className="text-base font-display font-bold text-neutral-950">
          Modules & Interactive Tasks
        </h2>

        <div className="space-y-3">
          {level.modules.map((mod) => {
            const isCompleted = learnerState?.completedLessons.includes(mod.id);

            return (
              <Card
                key={mod.id}
                className="p-5 border border-neutral-200 flex items-center justify-between hover:border-neutral-300 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                    {mod.type === 'concept' && <FileText className="w-4 h-4 text-blue-600" />}
                    {mod.type === 'code_challenge' && (
                      <Terminal className="w-4 h-4 text-emerald-600" />
                    )}
                    {mod.type === 'quiz' && <HelpCircle className="w-4 h-4 text-purple-600" />}
                    {mod.type === 'interactive_lab' && (
                      <Terminal className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-neutral-900">{mod.title}</span>
                      <Badge variant="neutral" className="text-[9px] uppercase font-mono py-0">
                        {mod.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <span className="text-xs text-neutral-500">
                      Estimated: {mod.estimatedMinutes} mins
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <Link to={`/app/courses/${course.id}`}>
                      <Button variant="primary" size="sm" className="text-xs font-semibold h-8 py-0">
                        Launch Module →
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
