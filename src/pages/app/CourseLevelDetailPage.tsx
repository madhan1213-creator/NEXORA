import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Terminal, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { getLearnerState } from '@/services/learning/learnerService';
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

      <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-2 shadow-sm">
        <Badge variant="brand" className="font-mono text-[10px] uppercase">
          Level {level.levelNumber} Modules
        </Badge>
        <h1 className="text-2xl font-display font-bold text-neutral-950 tracking-tight">
          {level.title}
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed">{level.summary}</p>
      </div>

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
