import React from 'react';
import { DifficultyLevel } from '@/types/assessment';
import { Clock, Bookmark, Pause, Play, Grid, Save, AlertCircle } from 'lucide-react';

interface AssessmentHeaderProps {
  careerGoal: string;
  currentIndex: number;
  totalQuestions: number;
  difficulty: DifficultyLevel;
  timeElapsedSeconds: number;
  isPaused: boolean;
  isFlagged: boolean;
  answeredCount: number;
  flaggedCount: number;
  onTogglePause: () => void;
  onToggleFlag: () => void;
  onOpenReviewModal: () => void;
  onSaveAndExit: () => void;
}

export const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({
  careerGoal,
  currentIndex,
  totalQuestions,
  difficulty,
  timeElapsedSeconds,
  isPaused,
  isFlagged,
  answeredCount,
  flaggedCount,
  onTogglePause,
  onToggleFlag,
  onOpenReviewModal,
  onSaveAndExit,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const getDifficultyBadge = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'beginner':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Beginner Tier
          </span>
        );
      case 'intermediate':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Intermediate Tier
          </span>
        );
      case 'advanced':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Advanced Tier
          </span>
        );
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="bg-white border-b border-neutral-200 sticky top-16 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 space-y-3">
        {/* Top line: Role, Difficulty, Timer, Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {careerGoal} Diagnostic
            </div>
            {getDifficultyBadge(difficulty)}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-lg text-neutral-700 text-xs font-mono font-semibold">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>{formatTime(timeElapsedSeconds)}</span>
              <button
                type="button"
                onClick={onTogglePause}
                title={isPaused ? 'Resume timer' : 'Pause timer'}
                className="ml-1 p-0.5 hover:text-neutral-900 transition text-neutral-400"
              >
                {isPaused ? <Play className="w-3 h-3 text-emerald-600" /> : <Pause className="w-3 h-3" />}
              </button>
            </div>

            {/* Flag for review button */}
            <button
              type="button"
              onClick={onToggleFlag}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition border ${
                isFlagged
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-600' : ''}`} />
              <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Flag'}</span>
            </button>

            {/* Review Question Matrix */}
            <button
              type="button"
              onClick={onOpenReviewModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-medium transition"
            >
              <Grid className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">Overview</span>
              <span className="px-1.5 py-0.2 bg-neutral-100 text-neutral-600 rounded text-[11px] font-bold">
                {answeredCount}/{totalQuestions}
              </span>
            </button>

            {/* Save & Exit */}
            <button
              type="button"
              onClick={onSaveAndExit}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
              title="Save progress and exit to dashboard"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Question Counter */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-neutral-900">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-neutral-500 font-medium">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Paused banner notice */}
        {isPaused && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Assessment is paused. Take your time; timer will resume when unpaused.</span>
            </div>
            <button
              type="button"
              onClick={onTogglePause}
              className="font-bold underline hover:text-amber-900"
            >
              Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
