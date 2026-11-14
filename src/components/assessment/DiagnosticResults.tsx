import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AssessmentResult, AssessmentQuestion } from '@/types/assessment';
import { QUESTIONS_BANK } from '@/data/assessmentData';
import {
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Brain,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Check,
} from 'lucide-react';

interface DiagnosticResultsProps {
  result: AssessmentResult;
  onRetake: () => void;
}

export const DiagnosticResults: React.FC<DiagnosticResultsProps> = ({ result, onRetake }) => {
  const [showQuestionReview, setShowQuestionReview] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const getReadinessRating = (score: number) => {
    if (score >= 85) return { title: 'Advanced Ready', desc: 'Demonstrated deep competency across core prerequisites and specialized domains.', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 70) return { title: 'Proficient Baseline', desc: 'Demonstrated solid understanding of essential workflows with minor conceptual gaps.', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (score >= 50) return { title: 'Developing Competency', desc: 'Capable in foundational syntax but requires targeted reinforcement on intermediate patterns.', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { title: 'Foundational Phase', desc: 'Recommended to begin with structured fundamentals and core prerequisite modules.', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const rating = getReadinessRating(result.totalScorePercentage);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  // Get question details for review
  const getQuestion = (qId: string): AssessmentQuestion | undefined => {
    return QUESTIONS_BANK.find((q) => q.id === qId);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* 1. Executive Diagnostic Banner */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm overflow-hidden relative">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Diagnostic Baseline Report
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
            <Clock className="w-4 h-4 text-neutral-400" />
            Time invested: {formatTime(result.timeSpentSeconds)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Score donut / gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-neutral-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.totalScorePercentage / 100)}`}
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-neutral-900 tracking-tight">
                  {result.totalScorePercentage}%
                </span>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mt-0.5">
                  Readiness
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs font-bold text-neutral-700">
                {result.totalMarksAwarded} / {result.totalPossibleMarks} Marks Awarded
              </span>
            </div>
          </div>

          {/* Role & Rating info */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Target Role</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                {result.careerGoal}
              </h1>
            </div>

            <div className={`p-4 rounded-xl border ${rating.color}`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                <Award className="w-4 h-4" />
                <span>Diagnostic Assessment: {rating.title}</span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">{rating.desc}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="text-[11px] text-neutral-500 font-medium">Strong Skills</div>
                <div className="text-lg font-bold text-emerald-600 mt-0.5">
                  {result.strongAreas.length}
                </div>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="text-[11px] text-neutral-500 font-medium">Identified Gaps</div>
                <div className="text-lg font-bold text-amber-600 mt-0.5">
                  {result.weakAreas.length}
                </div>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-neutral-500 font-medium">Missing Prereqs</div>
                <div className="text-lg font-bold text-purple-600 mt-0.5">
                  {result.missingPrerequisites.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 5 Roadmap notice as strictly required */}
        <div className="mt-8 pt-6 border-t border-neutral-100">
          <div className="p-4 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-800 text-emerald-400 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Next Step in Learning Journey
                </div>
                <div className="text-sm font-semibold text-white">
                  This diagnostic identifies your current baseline. The personalized learning roadmap will be generated in the next step based on these results.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/app/roadmap"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>View Personalized Roadmap</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={onRetake}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl transition inline-flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Demonstrated vs Self-Reported Skill Calibration Matrix */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Demonstrated vs. Self-Reported Skill Calibration
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Comparing self-reported proficiency from your onboarding profile against demonstrated knowledge on empirical test problems.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Skill Domain</th>
                <th className="py-3 px-4">Self-Reported</th>
                <th className="py-3 px-4">Demonstrated</th>
                <th className="py-3 px-4">Assessed Level</th>
                <th className="py-3 px-4">Calibration Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {result.skillEstimates.map((skillItem, idx) => {
                // Calibration interpretation
                let calibrationLabel = 'Calibrated';
                let calibrationColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

                if (skillItem.status === 'not_assessed') {
                  calibrationLabel = 'Not Yet Assessed';
                  calibrationColor = 'text-neutral-500 bg-neutral-100 border-neutral-200';
                } else if (
                  (skillItem.selfReportedProficiency === 'advanced' || skillItem.selfReportedProficiency === 'intermediate') &&
                  skillItem.demonstratedProficiency < 50
                ) {
                  calibrationLabel = 'Knowledge Gap Detected';
                  calibrationColor = 'text-amber-700 bg-amber-50 border-amber-200';
                } else if (
                  skillItem.selfReportedProficiency === 'beginner' &&
                  skillItem.demonstratedProficiency >= 75
                ) {
                  calibrationLabel = 'Hidden Strength';
                  calibrationColor = 'text-blue-700 bg-blue-50 border-blue-200';
                }

                return (
                  <tr key={idx} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      {skillItem.skill}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-medium text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md">
                        {skillItem.selfReportedProficiency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      {skillItem.status === 'not_assessed' ? (
                        <span className="text-neutral-400">—</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{skillItem.demonstratedProficiency}%</span>
                          <span className="text-[10px] text-neutral-400 font-sans">
                            ({skillItem.questionsCorrect}/{skillItem.questionsAttempted} correct)
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold px-2.5 py-1 rounded-md ${
                          skillItem.status === 'not_assessed'
                            ? 'bg-neutral-100 text-neutral-400'
                            : skillItem.status === 'strong'
                            ? 'bg-emerald-100 text-emerald-800'
                            : skillItem.status === 'weak'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {skillItem.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold border ${calibrationColor}`}>
                        {calibrationLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Domain & Difficulty Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Domain Breakdown */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Performance by Domain
          </h2>

          <div className="space-y-4">
            {Object.keys(result.domainBreakdown).map((domain) => {
              const stat = result.domainBreakdown[domain];
              return (
                <div key={domain} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-neutral-800">{domain}</span>
                    <span className="font-bold text-neutral-900">
                      {stat.percentage}% ({stat.correct}/{stat.attempted})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        stat.percentage >= 75
                          ? 'bg-emerald-500'
                          : stat.percentage >= 50
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-600" />
            Performance by Difficulty Tier
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => {
              const stat = result.difficultyBreakdown[diff];
              return (
                <div key={diff} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 capitalize">
                    {diff}
                  </div>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    {stat.percentage}%
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    {stat.correct}/{stat.attempted} correct
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed pt-2">
            The adaptive engine adjusts subsequent difficulty when multiple consecutive questions are answered correctly or incorrectly.
          </p>
        </div>
      </div>

      {/* 4. Missing Prerequisites & Revision Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Prerequisites */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Missing Prerequisites Flagged
          </div>
          <p className="text-xs text-neutral-600">
            Based on failed assessment problems, our dependency graph flagged the following foundational concepts:
          </p>

          {result.missingPrerequisites.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.missingPrerequisites.map((p, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold"
                >
                  {p}
                </span>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium">
              No missing prerequisites detected! You demonstrated competence across fundamental requirements.
            </div>
          )}
        </div>

        {/* Recommended Revision Topics */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-base">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Recommended Immediate Study Topics
          </div>
          <p className="text-xs text-neutral-600">
            Target these specific topics to close demonstrated gaps before moving into advanced roadmap tracks:
          </p>

          {result.recommendedRevisionTopics.length > 0 ? (
            <ul className="space-y-2 text-xs">
              {result.recommendedRevisionTopics.slice(0, 5).map((topic, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 font-medium text-neutral-800 flex items-center justify-between"
                >
                  <span>{topic}</span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">High Priority</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium">
              All tested topics answered accurately! You are ready for advanced applied modules.
            </div>
          )}
        </div>
      </div>

      {/* 5. Detailed Question Review Accordion */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Question-by-Question Diagnostic Review
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Inspect answer explanations and verified solutions for each question.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowQuestionReview(!showQuestionReview)}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition inline-flex items-center gap-1.5"
          >
            <span>{showQuestionReview ? 'Hide Solutions' : 'View Detailed Solutions'}</span>
            {showQuestionReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showQuestionReview && (
          <div className="space-y-4 pt-4 border-t border-neutral-100 animate-fadeIn">
            {result.responses.map((resp, idx) => {
              const q = getQuestion(resp.questionId);
              if (!q) return null;
              const isExpanded = expandedQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className="border border-neutral-200 rounded-2xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="w-full text-left p-4 bg-neutral-50/70 hover:bg-neutral-50 flex items-center justify-between gap-4 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-neutral-200/80 text-neutral-800 text-xs font-bold flex items-center justify-center">
                        Q{idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 line-clamp-1">
                          {q.questionText}
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {q.careerDomain} • {q.topic}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {resp.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          +{resp.awardedMarks} pts
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                          <XCircle className="w-3.5 h-3.5" />
                          0 pts
                        </span>
                      )}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-6 bg-white space-y-4 border-t border-neutral-100 text-xs leading-relaxed animate-fadeIn">
                      <div>
                        <span className="font-bold text-neutral-700">Question: </span>
                        <span className="text-neutral-900">{q.questionText}</span>
                      </div>

                      {q.codeSnippet && (
                        <pre className="p-3 bg-neutral-900 text-neutral-100 rounded-xl font-mono overflow-x-auto text-[11px]">
                          <code>{q.codeSnippet}</code>
                        </pre>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                            Your Submitted Answer
                          </span>
                          <span className={`font-semibold ${resp.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {Array.isArray(resp.answer)
                              ? resp.answer.join(', ') || 'No answer submitted'
                              : resp.answer || 'No answer submitted'}
                          </span>
                        </div>

                        <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                            Correct Verified Solution
                          </span>
                          <span className="font-semibold text-emerald-900">
                            {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                        <span className="font-bold text-neutral-900 block mb-1">Technical Explanation:</span>
                        <p className="text-neutral-700">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
