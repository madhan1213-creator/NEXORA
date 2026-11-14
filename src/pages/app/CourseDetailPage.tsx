import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  BookOpen,
  Code,
  HelpCircle,
  Sparkles,
  Check,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import {
  getLearnerRoadmap,
  getLearnerState,
  markLessonComplete,
} from '@/services/learning/learnerService';
import { mockCourses } from '@/data/mockData';
import { RoadmapCourse, RoadmapLesson, LearnerProgressState } from '@/types/learner';

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const userId = user?.id || '';

  const [course, setCourse] = useState<RoadmapCourse | null>(null);
  const [activeLesson, setActiveLesson] = useState<RoadmapLesson | null>(null);
  const [learnerState, setLearnerState] = useState<LearnerProgressState | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [justCompletedToast, setJustCompletedToast] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const state = getLearnerState(userId);
    setLearnerState(state);

    // Look for course in user's roadmap
    const roadmap = getLearnerRoadmap(userId);
    let matchedCourse: RoadmapCourse | null = null;

    if (roadmap) {
      for (const phase of roadmap.phases) {
        const found = phase.courses.find((c) => c.id === courseId);
        if (found) {
          matchedCourse = found;
          break;
        }
      }
    }

    // Fallback to catalog course if not found in personalized roadmap
    if (!matchedCourse) {
      const mock = mockCourses.find((c) => c.id === courseId) || mockCourses[0];
      // Convert mockCourse to RoadmapCourse structure
      const flattenedLessons: RoadmapLesson[] = [];
      mock.levels.forEach((lvl) => {
        lvl.modules.forEach((mod) => {
          flattenedLessons.push({
            id: mod.id,
            title: mod.title,
            estimatedMinutes: mod.estimatedMinutes,
            type: mod.type === 'concept' ? 'concept' : mod.type === 'quiz' ? 'quiz' : 'code_challenge',
            summary: `${lvl.title} — ${mod.title}`,
            practicePrompt: 'Apply this concept in your active sandbox environment.',
            quizQuestion: {
              question: `How does ${mod.title} optimize overall pipeline performance?`,
              options: [
                'Reduces computational overhead and prevents redundant operations',
                'Forces all tensors to allocate on CPU RAM',
                'Bypasses reverse autograd differentiation',
                'Disables asynchronous event loop polling',
              ],
              correctIndex: 0,
              explanation: 'This architecture focuses on reducing redundant computation and memory footprint.',
            },
          });
        });
      });

      matchedCourse = {
        id: mock.id,
        title: mock.title,
        slug: mock.slug,
        description: mock.description,
        estimatedHours: mock.estimatedHours,
        difficulty: mock.difficulty as any,
        topics: mock.topics,
        prerequisites: mock.prerequisites,
        lessons: flattenedLessons.length > 0 ? flattenedLessons : [
          {
            id: 'mod-def-1',
            title: 'Core Architectural Introduction',
            estimatedMinutes: 25,
            type: 'concept',
            summary: mock.description,
          },
        ],
      };
    }

    setCourse(matchedCourse);
    if (matchedCourse.lessons.length > 0) {
      setActiveLesson(matchedCourse.lessons[0]);
    }
  }, [courseId, userId]);

  const handleLessonSelect = (lesson: RoadmapLesson) => {
    setActiveLesson(lesson);
    setSelectedQuizAnswer(null);
    setIsQuizSubmitted(false);
  };

  const handleMarkComplete = (lesson: RoadmapLesson) => {
    if (!userId || !course) return;

    const updated = markLessonComplete(userId, course.id, lesson.id, lesson.title);
    setLearnerState(updated);
    setJustCompletedToast(`Lesson Completed! Overall Progress: ${updated.overallProgress}%`);
    setTimeout(() => setJustCompletedToast(null), 4000);
  };

  if (!course || !activeLesson) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-emerald-600 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-neutral-500">Loading Course Studio...</span>
        </div>
      </div>
    );
  }

  const isCurrentLessonCompleted = learnerState?.completedLessons.includes(activeLesson.id);

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto animate-fadeIn">
      {/* Back breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/app/roadmap"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Roadmap
        </Link>
        <span className="text-xs text-neutral-500 font-medium">
          Overall Progress:{' '}
          <strong className="text-emerald-700">{learnerState?.overallProgress || 0}%</strong>
        </span>
      </div>

      {/* Completion Toast Notification */}
      {justCompletedToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{justCompletedToast}</span>
          </div>
          <Link to="/app/dashboard" className="underline hover:text-black">
            View Dashboard
          </Link>
        </div>
      )}

      {/* Course Overview Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-900 text-white">
            {course.difficulty} Module
          </span>
          <span className="text-xs text-neutral-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {course.estimatedHours} Hours Total
          </span>
          <span className="text-neutral-300">•</span>
          <span className="text-xs text-neutral-500 font-medium">
            {course.lessons.length} Step-by-Step Lessons
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          {course.title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-3xl leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Studio Grid: Lessons Sidebar (4 cols) + Lesson Workspace (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lessons Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Module Lessons
            </span>
            <span className="text-xs font-semibold text-neutral-600">
              {course.lessons.filter((l) => learnerState?.completedLessons.includes(l.id)).length}/
              {course.lessons.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {course.lessons.map((lesson, idx) => {
              const isSelected = activeLesson.id === lesson.id;
              const isDone = learnerState?.completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleLessonSelect(lesson)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-900'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold shrink-0 flex items-center justify-center mt-0.5 ${
                      isDone
                        ? isSelected
                          ? 'bg-emerald-400 text-neutral-950'
                          : 'bg-emerald-100 text-emerald-800'
                        : isSelected
                        ? 'bg-neutral-800 text-neutral-200'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                  </span>

                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-bold truncate leading-snug">{lesson.title}</div>
                    <div
                      className={`text-[10px] capitalize ${
                        isSelected ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      {lesson.type.replace('_', ' ')} • ~{lesson.estimatedMinutes} mins
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lesson Workspace & Practice Arena */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Active Topic
              </span>
              <h2 className="text-xl font-bold text-neutral-900 mt-0.5">{activeLesson.title}</h2>
            </div>

            {isCurrentLessonCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Lesson Completed
              </span>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleMarkComplete(activeLesson)}
                leftIcon={<Check className="w-3.5 h-3.5 text-neutral-950" />}
                className="font-bold shadow-sm text-xs"
              >
                Mark Complete (+Progress)
              </Button>
            )}
          </div>

          {/* Lesson Concept Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Core Concept & Theoretical Foundation
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-200/80">
              {activeLesson.summary}
            </p>

            <div className="p-4 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-neutral-400 text-[11px] pb-1 border-b border-neutral-800">
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interactive Verification Snippet</span>
              </div>
              <pre className="overflow-x-auto leading-relaxed">
                <code>
                  {`# Nexora Verified Implementation\nimport torch\nimport numpy as np\n\ndef verify_pipeline_layer(inputs, weights):\n    """Calculates forward activation under deterministic precision."""\n    return torch.matmul(inputs, weights.T)`}
                </code>
              </pre>
            </div>
          </div>

          {/* Interactive Knowledge Practice / Quiz */}
          {activeLesson.quizQuestion && (
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/90 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                Knowledge Check Challenge
              </div>

              <div className="text-sm font-semibold text-neutral-900">
                {activeLesson.quizQuestion.question}
              </div>

              <div className="space-y-2">
                {activeLesson.quizQuestion.options.map((opt, idx) => {
                  const isSelected = selectedQuizAnswer === idx;
                  const isCorrect = idx === activeLesson.quizQuestion!.correctIndex;

                  let optStyles = 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800';
                  if (isQuizSubmitted) {
                    if (isCorrect) {
                      optStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                    } else if (isSelected && !isCorrect) {
                      optStyles = 'border-rose-400 bg-rose-50 text-rose-950';
                    }
                  } else if (isSelected) {
                    optStyles = 'border-neutral-900 bg-neutral-900 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isQuizSubmitted}
                      onClick={() => setSelectedQuizAnswer(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between ${optStyles}`}
                    >
                      <span>{opt}</span>
                      {isQuizSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!isQuizSubmitted ? (
                <button
                  type="button"
                  disabled={selectedQuizAnswer === null}
                  onClick={() => setIsQuizSubmitted(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                    selectedQuizAnswer !== null
                      ? 'bg-neutral-900 hover:bg-black text-white'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  Verify Answer
                </button>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-1">
                  <div className="font-bold text-neutral-900">Explanation:</div>
                  <p>{activeLesson.quizQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Mark Complete & Next Navigation */}
          <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/app/roadmap"
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
            >
              ← Back to Roadmap
            </Link>

            <div className="flex items-center gap-3">
              {!isCurrentLessonCompleted ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleMarkComplete(activeLesson)}
                  className="font-bold shadow-sm text-xs"
                >
                  Mark Lesson Complete (+Progress)
                </Button>
              ) : (
                <Link
                  to="/app/dashboard"
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Return to Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
