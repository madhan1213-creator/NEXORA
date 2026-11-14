import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getLearnerProfile } from '@/services/onboarding/onboardingService';
import {
  getBlueprintForCareer,
  getActiveSession,
  createSession,
  saveSession,
  submitAndEvaluateSession,
  getLatestAssessmentResult,
} from '@/services/assessment/assessmentService';
import {
  AssessmentBlueprint,
  AssessmentQuestion,
  AssessmentResult,
  AssessmentSession,
  DifficultyLevel,
} from '@/types/assessment';
import { CompleteLearnerProfile } from '@/types';
import { QUESTIONS_BANK } from '@/data/assessmentData';
import { calculateNextAdaptiveDifficulty, evaluateAnswer } from '@/services/assessment/scoringEngine';
import { recordAssessmentCompletion } from '@/services/learning/learnerService';
import { recordMultipleQuestionCompletions } from '@/services/learning/progressCalculationService';

import { AssessmentIntro } from '@/components/assessment/AssessmentIntro';
import { AssessmentHeader } from '@/components/assessment/AssessmentHeader';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { ReviewModal } from '@/components/assessment/ReviewModal';
import { DiagnosticResults } from '@/components/assessment/DiagnosticResults';

type AssessmentViewMode = 'intro' | 'testing' | 'results';

export const AssessmentsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'demo_learner_01';

  const [profile, setProfile] = useState<CompleteLearnerProfile | null>(null);
  const [careerGoal, setCareerGoal] = useState<string>('Data Scientist');
  const [blueprint, setBlueprint] = useState<AssessmentBlueprint>(getBlueprintForCareer('Data Scientist'));
  const [mode, setMode] = useState<AssessmentViewMode>('intro');

  // In-flight session state
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  // Result state
  const [activeResult, setActiveResult] = useState<AssessmentResult | null>(null);
  const [previousResult, setPreviousResult] = useState<AssessmentResult | null>(null);

  // Loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load learner profile and previous session/results on mount
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const savedProfile = await getLearnerProfile(userId);
        const goal = savedProfile?.careerGoal || user?.targetCareerId || 'Data Scientist';
        setProfile(savedProfile);
        setCareerGoal(goal);

        const bp = getBlueprintForCareer(goal);
        setBlueprint(bp);

        // Check for active in-flight session
        const inFlight = getActiveSession(userId);
        const pastResult = getLatestAssessmentResult(userId);
        setPreviousResult(pastResult);

        if (inFlight && !inFlight.isCompleted) {
          // Restore in-flight session
          const loadedQuestions = inFlight.questionIds
            .map((id) => QUESTIONS_BANK.find((q) => q.id === id))
            .filter((q): q is AssessmentQuestion => Boolean(q));

          setSession(inFlight);
          setCurrentQuestions(loadedQuestions);
          setCurrentIndex(inFlight.currentQuestionIndex);
          setResponses(inFlight.responses || {});
          setFlaggedIds(inFlight.flaggedQuestionIds || []);
          setTimeElapsed(inFlight.timeElapsedSeconds || 0);
          setMode('testing');
        } else if (pastResult) {
          // Default to results if already taken, or intro
          setActiveResult(pastResult);
          setMode('results');
        } else {
          setMode('intro');
        }
      } catch (err) {
        console.error('Error initializing assessment view:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [userId, user]);

  // Timer interval for active testing
  useEffect(() => {
    if (mode !== 'testing' || isPaused) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => {
        const next = prev + 1;
        // Autosave time in session state every 5 seconds
        if (session && next % 5 === 0) {
          saveSession({
            ...session,
            timeElapsedSeconds: next,
            currentQuestionIndex: currentIndex,
            responses,
            flaggedQuestionIds: flaggedIds,
          });
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isPaused, session, currentIndex, responses, flaggedIds]);

  // Start new diagnostic assessment
  const handleStartAssessment = () => {
    const newSession = createSession(userId, careerGoal, profile);
    const loadedQuestions = newSession.questionIds
      .map((id) => QUESTIONS_BANK.find((q) => q.id === id))
      .filter((q): q is AssessmentQuestion => Boolean(q));

    setSession(newSession);
    setCurrentQuestions(loadedQuestions);
    setCurrentIndex(0);
    setResponses({});
    setFlaggedIds([]);
    setTimeElapsed(0);
    setIsPaused(false);
    setMode('testing');
  };

  // Handle learner response change
  const handleAnswerChange = (answer: string | string[]) => {
    if (!currentQuestions[currentIndex]) return;
    const currentQ = currentQuestions[currentIndex];

    const updatedResponses = {
      ...responses,
      [currentQ.id]: answer,
    };
    setResponses(updatedResponses);

    // Save progress locally
    if (session) {
      const updatedSession: AssessmentSession = {
        ...session,
        currentQuestionIndex: currentIndex,
        responses: updatedResponses,
        flaggedQuestionIds: flaggedIds,
        timeElapsedSeconds: timeElapsed,
      };
      setSession(updatedSession);
      saveSession(updatedSession);
    }
  };

  // Toggle flag for current question
  const handleToggleFlag = () => {
    if (!currentQuestions[currentIndex]) return;
    const currentQ = currentQuestions[currentIndex];
    const isCurrentlyFlagged = flaggedIds.includes(currentQ.id);

    const updated = isCurrentlyFlagged
      ? flaggedIds.filter((id) => id !== currentQ.id)
      : [...flaggedIds, currentQ.id];

    setFlaggedIds(updated);
    if (session) {
      saveSession({
        ...session,
        flaggedQuestionIds: updated,
      });
    }
  };

  // Adaptive difficulty update upon proceeding to next question
  const handleNextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      // Calculate adaptive difficulty based on answers so far
      const answeredList = currentQuestions.slice(0, currentIndex + 1).map((q) => {
        const ans = responses[q.id];
        const evalRes = evaluateAnswer(q, ans);
        return { isCorrect: evalRes.isCorrect, difficulty: q.difficulty };
      });

      const currentDiff = currentQuestions[currentIndex].difficulty;
      const nextDiff = calculateNextAdaptiveDifficulty(currentDiff, answeredList);

      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      if (session) {
        saveSession({
          ...session,
          currentQuestionIndex: nextIdx,
          currentDifficulty: nextDiff,
          responses,
          flaggedQuestionIds: flaggedIds,
          timeElapsedSeconds: timeElapsed,
        });
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      if (session) {
        saveSession({
          ...session,
          currentQuestionIndex: prevIdx,
          responses,
          flaggedQuestionIds: flaggedIds,
          timeElapsedSeconds: timeElapsed,
        });
      }
    }
  };

  const handleSaveAndExit = () => {
    if (session) {
      saveSession({
        ...session,
        currentQuestionIndex: currentIndex,
        responses,
        flaggedQuestionIds: flaggedIds,
        timeElapsedSeconds: timeElapsed,
      });
    }
    setMode('intro');
  };

  // Final evaluation and submission
  const handleSubmitAssessment = async () => {
    if (!session) return;
    setIsReviewModalOpen(false);

    // Finalize session object
    const finalSession: AssessmentSession = {
      ...session,
      currentQuestionIndex: currentIndex,
      responses,
      flaggedQuestionIds: flaggedIds,
      timeElapsedSeconds: timeElapsed,
    };

    const result = await submitAndEvaluateSession(finalSession, profile);
    // Record verified correct questions in authoritative progress calculation engine
    const correctQuestionIds = (result.responses || [])
      .filter((r) => r.isCorrect)
      .map((r) => r.questionId);
    if (correctQuestionIds.length > 0) {
      recordMultipleQuestionCompletions(userId, correctQuestionIds);
    }
    // Automatically record completion in learner progress and generate personalized roadmap
    recordAssessmentCompletion(userId, result, profile);
    setActiveResult(result);
    setPreviousResult(result);
    setMode('results');
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-emerald-600 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-neutral-500">Loading Diagnostic Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Intro View */}
      {mode === 'intro' && (
        <AssessmentIntro
          blueprint={blueprint}
          careerGoal={careerGoal}
          previousResult={previousResult}
          onStart={handleStartAssessment}
          onViewPreviousResult={() => {
            if (previousResult) {
              setActiveResult(previousResult);
              setMode('results');
            }
          }}
        />
      )}

      {/* 2. Live Testing View */}
      {mode === 'testing' && currentQuestions.length > 0 && (
        <div className="space-y-6">
          <AssessmentHeader
            careerGoal={careerGoal}
            currentIndex={currentIndex}
            totalQuestions={currentQuestions.length}
            difficulty={currentQuestions[currentIndex]?.difficulty || 'beginner'}
            timeElapsedSeconds={timeElapsed}
            isPaused={isPaused}
            isFlagged={flaggedIds.includes(currentQuestions[currentIndex]?.id || '')}
            answeredCount={
              Object.keys(responses).filter((k) => responses[k] !== undefined && responses[k] !== '').length
            }
            flaggedCount={flaggedIds.length}
            onTogglePause={() => setIsPaused(!isPaused)}
            onToggleFlag={handleToggleFlag}
            onOpenReviewModal={() => setIsReviewModalOpen(true)}
            onSaveAndExit={handleSaveAndExit}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-0">
            {currentQuestions[currentIndex] && (
              <QuestionCard
                question={currentQuestions[currentIndex]}
                currentAnswer={responses[currentQuestions[currentIndex].id]}
                isFirst={currentIndex === 0}
                isLast={currentIndex === currentQuestions.length - 1}
                onAnswerChange={handleAnswerChange}
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                onSubmit={() => setIsReviewModalOpen(true)}
              />
            )}
          </div>

          <ReviewModal
            isOpen={isReviewModalOpen}
            questions={currentQuestions}
            responses={responses}
            flaggedQuestionIds={flaggedIds}
            currentIndex={currentIndex}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
            onClose={() => setIsReviewModalOpen(false)}
            onConfirmSubmit={handleSubmitAssessment}
          />
        </div>
      )}

      {/* 3. Diagnostic Results View */}
      {mode === 'results' && activeResult && (
        <DiagnosticResults
          result={activeResult}
          onRetake={handleStartAssessment}
        />
      )}
    </div>
  );
};
