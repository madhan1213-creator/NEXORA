import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  Layers,
  Zap,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  getLearnerRoadmap,
  getLearnerState,
  generatePersonalizedRoadmap,
} from '@/services/learning/learnerService';
import { getLearnerProfile } from '@/services/onboarding/onboardingService';
import { getLatestAssessmentResult } from '@/services/assessment/assessmentService';
import { PersonalizedRoadmap, LearnerProgressState } from '@/types/learner';
import { CompleteLearnerProfile } from '@/types';

export const RoadmapPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [learnerState, setLearnerState] = useState<LearnerProgressState | null>(null);
  const [profile, setProfile] = useState<CompleteLearnerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      if (userId) {
        const state = getLearnerState(userId);
        setLearnerState(state);

        const prof = await getLearnerProfile(userId);
        setProfile(prof);

        const rm = getLearnerRoadmap(userId);
        setRoadmap(rm);
      }
      setIsLoading(false);
    }
    init();
  }, [userId]);

  const targetRole = profile?.careerGoal || user?.targetCareerId || 'Data Scientist';

  const handleGenerateFreshRoadmap = () => {
    if (!userId) return;
    const pastAssessment = getLatestAssessmentResult(userId);
    const newRoadmap = generatePersonalizedRoadmap(userId, targetRole, pastAssessment, profile);
    setRoadmap(newRoadmap);
    const updatedState = getLearnerState(userId);
    setLearnerState(updatedState);
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-emerald-600 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-neutral-500">Loading Career Roadmap...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <Badge variant="brand" className="font-mono uppercase text-[10px] mb-2">
            Personalized Career Roadmap
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 tracking-tight">
            {targetRole} Learning Path
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Engineered sequence based on your diagnostic results and demonstrated competency gaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {roadmap && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateFreshRoadmap}
              leftIcon={<RotateCcw className="w-3 h-3" />}
              className="text-xs font-semibold"
            >
              Recalibrate Sequence
            </Button>
          )}
          <Link to="/app/learning">
            <Button variant="primary" size="sm" className="text-xs font-bold shadow-sm">
              Course Catalog
            </Button>
          </Link>
        </div>
      </div>

      {/* When no roadmap has been generated yet (Fresh User) */}
      {!roadmap ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8 text-emerald-600" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-neutral-900">
              No Roadmap Generated Yet
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Nexora constructs your learning path according to demonstrated skills. Take the diagnostic assessment to calibrate your gaps and generate your custom step-by-step roadmap.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/app/assessments">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Zap className="w-4 h-4 text-neutral-950" />}
                className="font-bold shadow-sm"
              >
                Take Diagnostic Assessment
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              onClick={handleGenerateFreshRoadmap}
              className="text-xs font-semibold"
            >
              Generate Default Baseline Roadmap
            </Button>
          </div>
        </div>
      ) : (
        /* Render Active Personalized Roadmap Phases */
        <div className="space-y-6">
          {/* Progress Overview Bar */}
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Curriculum Trajectory
              </div>
              <div className="text-lg font-extrabold text-neutral-900 mt-0.5">
                {roadmap.completedLessonsCount} of {roadmap.totalLessonsCount} Lessons Completed ({roadmap.overallProgressPercentage}%)
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1">
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${roadmap.overallProgressPercentage}%` }}
                />
              </div>
              <div className="text-right text-[11px] text-neutral-500 font-semibold">
                {roadmap.overallProgressPercentage}% Overall
              </div>
            </div>
          </div>

          {/* Phases List */}
          {roadmap.phases.map((phase) => {
            const isCompleted = phase.status === 'completed';
            const isInProgress = phase.status === 'in_progress';

            return (
              <Card
                key={phase.id}
                className={`p-6 border transition-all ${
                  isInProgress
                    ? 'border-emerald-500 shadow-sm bg-white ring-1 ring-emerald-500/20'
                    : isCompleted
                    ? 'border-neutral-200 bg-neutral-50/50'
                    : 'border-neutral-200/70 bg-neutral-50/30'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-900 text-white">
                        PHASE 0{phase.phaseNumber}
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                      {isInProgress && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active Phase ({phase.completionPercentage}%)
                        </span>
                      )}
                      {phase.status === 'locked' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> ~{phase.estimatedWeeks} weeks
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900">{phase.title}</h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {phase.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {phase.skillsCovered.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
                    <span className="text-xs font-extrabold text-neutral-900">
                      {phase.completionPercentage}% Phase Progress
                    </span>
                  </div>
                </div>

                {/* Courses inside this phase */}
                <div className="mt-6 pt-5 border-t border-neutral-100 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Curriculum Modules
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {phase.courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-4 rounded-xl border border-neutral-200/80 bg-white hover:border-neutral-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900">{course.title}</span>
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                              {course.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 line-clamp-1">{course.description}</p>
                          <div className="text-[11px] text-neutral-400">
                            {course.lessons.length} lessons • ~{course.estimatedHours} hours
                          </div>
                        </div>

                        <Link
                          to={`/app/courses/${course.id}`}
                          className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition inline-flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-auto"
                        >
                          <span>Open Module</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
