import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radar,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  BarChart3,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { getLatestAssessmentResult } from '@/services/assessment/assessmentService';
import { getLearnerProfile } from '@/services/onboarding/onboardingService';
import { getLearnerState } from '@/services/learning/learnerService';
import { getAllLevel1TopicReports, getLevel1ProgressBreakdown } from '@/services/learning/progressCalculationService';
import { AssessmentResult } from '@/types/assessment';
import { CompleteLearnerProfile } from '@/types';
import { LearnerProgressState } from '@/types/learner';

export const SkillAnalysisPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [profile, setProfile] = useState<CompleteLearnerProfile | null>(null);
  const [learnerState, setLearnerState] = useState<LearnerProgressState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      if (userId) {
        setLearnerState(getLearnerState(userId));
        const prof = await getLearnerProfile(userId);
        setProfile(prof);
        const res = getLatestAssessmentResult(userId);
        setAssessmentResult(res);
      }
      setIsLoading(false);
    }
    init();
  }, [userId]);

  const targetRole = profile?.careerGoal || user?.targetCareerId || 'Data Scientist';

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-emerald-600 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-neutral-500">Analyzing Skill Telemetry...</span>
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
            Skill Analyzer & Diagnostics
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 tracking-tight">
            Competency Gap Matrix
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Empirical benchmark comparing your verified abilities against {targetRole} industry requirements.
          </p>
        </div>

        <Link to="/app/assessments">
          <Button variant="primary" size="sm" className="text-xs font-bold shadow-sm">
            {assessmentResult ? 'Retake Diagnostic' : 'Take Diagnostic Assessment'}
          </Button>
        </Link>
      </div>

      {/* Fresh State Notice if no assessment completed */}
      {!assessmentResult && (
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Self-Reported Baseline (Empirical Assessment Needed)
              </h2>
              <p className="text-xs text-neutral-600">
                The skills listed below are self-reported from your onboarding questionnaire. Take the diagnostic assessment to verify your actual demonstrated competency.
              </p>
            </div>
          </div>

          {profile && profile.skills.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {profile.skills.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-0.5">
                    Self-Reported
                  </span>
                  <div className="font-bold text-neutral-900">{s.skill}</div>
                  <div className="capitalize text-emerald-700 font-semibold mt-1">
                    {s.proficiency.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <Link to="/app/assessments">
              <Button variant="primary" size="sm" className="font-bold text-xs shadow-sm">
                Begin Diagnostic Assessment →
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* When Assessment Results Are Available */}
      {assessmentResult && (
        <div className="space-y-6">
          {/* Executive Calibration Banner */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Demonstrated Baseline Score
              </span>
              <div className="text-3xl font-extrabold text-neutral-900 mt-1">
                {assessmentResult.totalScorePercentage}% Readiness
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Completed on {new Date(assessmentResult.completedAt).toLocaleDateString()} for {assessmentResult.careerGoal}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs text-neutral-500 font-medium">Strong Domains</div>
                <div className="text-lg font-extrabold text-emerald-700">
                  {assessmentResult.strongAreas.length}
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-xs text-neutral-500 font-medium">Knowledge Gaps</div>
                <div className="text-lg font-extrabold text-amber-700">
                  {assessmentResult.weakAreas.length}
                </div>
              </div>
            </div>
          </div>

          {/* Skill Proficiency Matrix Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-neutral-900 text-base">Demonstrated Skill Proficiency Matrix</h3>
              <p className="text-xs text-neutral-500">
                Verified from test problems and cross-referenced with your onboarding baseline.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Skill Domain</th>
                    <th className="py-3 px-4">Self-Reported</th>
                    <th className="py-3 px-4">Demonstrated</th>
                    <th className="py-3 px-4">Assessed Tier</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {assessmentResult.skillEstimates.map((s, idx) => {
                    const verifiedScore =
                      learnerState?.skillProficiency[s.skill] !== undefined
                        ? learnerState.skillProficiency[s.skill]
                        : s.demonstratedProficiency;

                    return (
                      <tr key={idx} className="hover:bg-neutral-50 transition">
                        <td className="py-3 px-4 font-bold text-neutral-900">{s.skill}</td>
                        <td className="py-3 px-4 capitalize text-neutral-600">{s.selfReportedProficiency}</td>
                        <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                          {verifiedScore}%
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                            {verifiedScore >= 90 ? 'Advanced' : verifiedScore >= 70 ? 'Proficient' : verifiedScore >= 45 ? 'Developing' : 'Novice'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              verifiedScore >= 70
                                ? 'bg-emerald-100 text-emerald-800'
                                : verifiedScore > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {verifiedScore >= 70 ? 'Verified Strength' : verifiedScore > 0 ? 'In Progress' : 'Not Started'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Level 1 Curriculum Topic Mastery Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Level 1 Topic Competency Breakdown</h3>
                <p className="text-xs text-neutral-500">
                  Each topic has 10 required questions and 20% weight towards Level 1. Incomplete topics remain at their actual progress.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-neutral-100 px-3 py-1 rounded-full text-neutral-800">
                Level 1: {getLevel1ProgressBreakdown(learnerState?.completedQuestions || []).percentage}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {getAllLevel1TopicReports(learnerState?.completedQuestions || []).map((t) => (
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

          {/* Missing Prerequisites Alert */}
          {assessmentResult.missingPrerequisites.length > 0 && (
            <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                <AlertCircle className="w-4 h-4 text-rose-700" />
                Missing Prerequisites Detected by Assessment Engine
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                The following fundamental concepts were failed on the diagnostic. Your personalized roadmap schedules these prerequisites first before advanced coursework:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {assessmentResult.missingPrerequisites.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-rose-300 text-rose-900 rounded-lg text-xs font-bold"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
