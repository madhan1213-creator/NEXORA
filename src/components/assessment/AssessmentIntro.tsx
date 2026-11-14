import React from 'react';
import { AssessmentBlueprint, AssessmentResult } from '@/types/assessment';
import {
  Clock,
  Target,
  Brain,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';

interface AssessmentIntroProps {
  blueprint: AssessmentBlueprint;
  careerGoal: string;
  previousResult: AssessmentResult | null;
  onStart: () => void;
  onViewPreviousResult?: () => void;
}

export const AssessmentIntro: React.FC<AssessmentIntroProps> = ({
  blueprint,
  careerGoal,
  previousResult,
  onStart,
  onViewPreviousResult,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptive Diagnostic Engine
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero-pressure evaluation • Baseline profiling
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          {blueprint.careerTitle}
        </h1>
        <p className="mt-2 text-neutral-600 text-base leading-relaxed max-w-2xl">
          {blueprint.description}
        </p>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">Target Role</div>
              <div className="text-sm font-bold text-neutral-900">{careerGoal}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Layers className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">Questions</div>
              <div className="text-sm font-bold text-neutral-900">{blueprint.totalQuestions} Adaptive</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">Pacing</div>
              <div className="text-sm font-bold text-neutral-900">~{blueprint.estimatedMinutes} Mins (Untimed)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Brain className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">Difficulty</div>
              <div className="text-sm font-bold text-neutral-900">Adaptive (1-3 Tiers)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Result Notice if available */}
      {previousResult && (
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900">
                Previous Assessment Recorded: {previousResult.totalScorePercentage}% Overall Score
              </div>
              <p className="text-xs text-neutral-600 mt-0.5">
                Completed on {new Date(previousResult.completedAt).toLocaleDateString()} with {previousResult.strongAreas.length} strong domains identified.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onViewPreviousResult && (
              <button
                type="button"
                onClick={onViewPreviousResult}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
              >
                View Past Report
              </button>
            )}
            <button
              type="button"
              onClick={onStart}
              className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-200/70 hover:bg-emerald-200 rounded-lg transition inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Diagnostic
            </button>
          </div>
        </div>
      )}

      {/* Domain Coverage Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-900 mb-2">Diagnostic Domains & Skill Coverage</h2>
        <p className="text-sm text-neutral-600 mb-6">
          This assessment evaluates demonstrated competency across the foundational pillars required for professional {careerGoal} roles:
        </p>

        <div className="space-y-4">
          {blueprint.domains.map((dom, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-700 flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{dom.domain}</div>
                  <div className="text-xs text-neutral-500">Core Skill: {dom.skill}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    {dom.weight}% Weight
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules and Guidance Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">How this Diagnostic Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Adaptive Sequencing</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Questions adjust to your performance in real time. Getting questions correct unlocks higher difficulty tiers; struggles route to core fundamentals.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-800 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Deterministic Scoring</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every question is scored strictly against deterministic ground truth. Correct answers and detailed explanations are revealed upon final submission.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100/80 text-purple-800 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Prerequisite Mapping</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Failed questions trigger prerequisite dependency flags so you know exactly which underlying math, syntax, or concepts require reinforcement.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Your progress is automatically saved locally. You may pause or resume at any time.
          </div>
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 hover:bg-black text-white font-semibold rounded-xl transition shadow-sm hover:shadow inline-flex items-center justify-center gap-2 group"
          >
            <span>Start Diagnostic Assessment</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
