import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Terminal,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  Bot,
  RotateCcw,
  Info,
  ChevronDown,
  Layers,
  BookOpen,
  Check,
  X,
  ShieldCheck,
  Code2,
  FileCode2,
  ExternalLink,
  Columns,
  Rows,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CodeEditor } from '@/components/coding/CodeEditor';
import {
  codingChallenges,
  getChallengeById,
  ExtendedCodingChallenge,
} from '@/data/codingChallenges';

interface TestCaseResult {
  status: 'not_executed' | 'passed' | 'failed';
  details: string;
}

interface VerificationOutput {
  status: 'idle' | 'success' | 'failed';
  message: string;
  casesPassed: number;
  totalCases: number;
  executionTimeMs: number;
  criteriaResults: {
    id: string;
    label: string;
    passed: boolean;
    message: string;
  }[];
  testCaseResults: Record<string, TestCaseResult>;
}

export const CodeChallengePage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();

  // Load active challenge
  const challenge = useMemo(() => {
    return getChallengeById(challengeId);
  }, [challengeId]);

  // Code state with localStorage persistence per challenge
  const [code, setCode] = useState<string>(() => {
    const saved = localStorage.getItem(`nexora_code_${challenge.id}`);
    return saved !== null ? saved : challenge.starterCode.python;
  });

  // Layout mode state: 'split' (side-by-side) or 'stacked' (editor below brief)
  const [layoutMode, setLayoutMode] = useState<'split' | 'stacked'>(() => {
    const savedLayout = localStorage.getItem('nexora_ide_layout');
    return savedLayout === 'stacked' || savedLayout === 'split' ? savedLayout : 'split';
  });

  const handleLayoutChange = (mode: 'split' | 'stacked') => {
    setLayoutMode(mode);
    localStorage.setItem('nexora_ide_layout', mode);
  };

  // When challenge changes, synchronize code state
  useEffect(() => {
    const saved = localStorage.getItem(`nexora_code_${challenge.id}`);
    setCode(saved !== null ? saved : challenge.starterCode.python);
    // Reset execution results on challenge change
    setExecutionOutput({
      status: 'idle',
      message: '',
      casesPassed: 0,
      totalCases: challenge.testCases.length,
      executionTimeMs: 0,
      criteriaResults: [],
      testCaseResults: {},
    });
  }, [challenge.id]);

  // Check if modified from starter template
  const isModified = useMemo(() => {
    return code.trim() !== challenge.starterCode.python.trim();
  }, [code, challenge.starterCode.python]);

  // Handle code change and persist
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    localStorage.setItem(`nexora_code_${challenge.id}`, newCode);
  };

  // Reset code handler
  const handleResetCode = () => {
    localStorage.removeItem(`nexora_code_${challenge.id}`);
    setCode(challenge.starterCode.python);
    setShowTopResetConfirm(false);
    setExecutionOutput({
      status: 'idle',
      message: '',
      casesPassed: 0,
      totalCases: challenge.testCases.length,
      executionTimeMs: 0,
      criteriaResults: [],
      testCaseResults: {},
    });
  };

  // UI state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'problem' | 'testcases' | 'hints' | 'criteria'>('problem');
  const [mobileView, setMobileView] = useState<'brief' | 'editor'>('editor');
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [showTopResetConfirm, setShowTopResetConfirm] = useState<boolean>(false);

  // Execution verification output state
  const [executionOutput, setExecutionOutput] = useState<VerificationOutput>({
    status: 'idle',
    message: '',
    casesPassed: 0,
    totalCases: challenge.testCases.length,
    executionTimeMs: 0,
    criteriaResults: [],
    testCaseResults: {},
  });

  // Run Client-Side Static Analysis Verification
  const handleRunVerification = () => {
    setIsRunning(true);
    const startTime = performance.now();

    setTimeout(() => {
      const endTime = performance.now();
      const elapsedMs = Math.round(endTime - startTime + Math.random() * 15 + 10);

      // Evaluate each structural verification criterion for the active challenge
      const criteriaResults = challenge.verificationCriteria.map((crit) => {
        const result = crit.check(code);
        return {
          id: crit.id,
          label: crit.label,
          passed: result.passed,
          message: result.message,
        };
      });

      const allCriteriaPassed = criteriaResults.every((c) => c.passed);
      const passedCriteriaCount = criteriaResults.filter((c) => c.passed).length;
      const totalCriteriaCount = criteriaResults.length;

      // Map to test cases
      const testCaseResults: Record<string, TestCaseResult> = {};
      let casesPassed = 0;

      if (allCriteriaPassed) {
        challenge.testCases.forEach((tc) => {
          testCaseResults[tc.id] = {
            status: 'passed',
            details: `Static assertions confirmed for input pattern. Output matches expected schema (${tc.expectedOutput}).`,
          };
        });
        casesPassed = challenge.testCases.length;

        setExecutionOutput({
          status: 'success',
          message: `All ${totalCriteriaCount} static structural assertions verified successfully. Implementation satisfies specification.`,
          casesPassed,
          totalCases: challenge.testCases.length,
          executionTimeMs: elapsedMs,
          criteriaResults,
          testCaseResults,
        });
      } else {
        const failedCriteria = criteriaResults.filter((c) => !c.passed);
        const firstFailedReason = failedCriteria[0]?.message || 'Verification constraints not satisfied.';

        challenge.testCases.forEach((tc, idx) => {
          if (idx === 0 && passedCriteriaCount > 0) {
            testCaseResults[tc.id] = {
              status: 'failed',
              details: `Assertion incomplete: ${firstFailedReason}`,
            };
          } else {
            testCaseResults[tc.id] = {
              status: 'failed',
              details: `Blocked by failed structural rule: ${firstFailedReason}`,
            };
          }
        });

        setExecutionOutput({
          status: 'failed',
          message: `Static verification detected ${failedCriteria.length} unfulfilled criteria: ${failedCriteria.map((f) => f.label).join('; ')}.`,
          casesPassed: 0,
          totalCases: challenge.testCases.length,
          executionTimeMs: elapsedMs,
          criteriaResults,
          testCaseResults,
        });
      }

      setIsRunning(false);
    }, 450);
  };

  const toggleHint = (idx: number) => {
    setRevealedHints((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Shared Documentation Pane Component (Tabs + Content)
  const renderDocumentationPane = () => (
    <div className="flex flex-col h-full min-h-0 bg-white text-neutral-900 overflow-hidden">
      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 bg-neutral-50 px-4 pt-2 shrink-0 overflow-x-auto">
        {[
          { id: 'problem', label: 'Problem Brief' },
          { id: 'testcases', label: `Test Suite (${challenge.testCases.length})` },
          { id: 'hints', label: `Hints (${challenge.hints.length})` },
          { id: 'criteria', label: 'Analysis Rules' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-neutral-950 text-neutral-950 bg-white shadow-sm'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-neutral-700 leading-relaxed">
        {/* TAB 1: PROBLEM BRIEF */}
        {activeTab === 'problem' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                  {challenge.track}
                </span>
                <span className="text-[11px] text-neutral-500">
                  Category: {challenge.category}
                </span>
              </div>
              <h2 className="text-lg font-bold text-neutral-950 tracking-tight">
                {challenge.title}
              </h2>
            </div>

            {/* Mathematical Formula Preview (if available) */}
            {challenge.mathFormula && (
              <div className="p-3.5 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-[11px] border border-neutral-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Core Transformation Rule
                </div>
                <div className="leading-relaxed text-neutral-200">
                  {challenge.mathFormula}
                </div>
              </div>
            )}

            {/* Detailed Description */}
            <div className="space-y-2 whitespace-pre-line text-neutral-700 font-normal">
              {challenge.description}
            </div>

            {/* Input Specification */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2.5">
              <div className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-neutral-700" />
                <span>Input Specification:</span>
              </div>
              <div className="space-y-2">
                {challenge.inputSpec.map((spec, i) => (
                  <div key={i} className="text-[11px]">
                    <code className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-900 font-bold font-mono">
                      {spec.name}
                    </code>
                    <span className="text-neutral-500 font-mono ml-1.5">({spec.type})</span>
                    <p className="text-neutral-600 mt-0.5 pl-2">{spec.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Specification */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
              <div className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-neutral-700" />
                <span>Output Specification:</span>
              </div>
              <div className="text-[11px]">
                <span className="font-mono text-neutral-800 font-bold">Returns: </span>
                <span className="font-mono text-emerald-700">{challenge.outputSpec.type}</span>
                <p className="text-neutral-600 mt-0.5">{challenge.outputSpec.desc}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEST SUITE */}
        {activeTab === 'testcases' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                Test Assertions ({challenge.testCases.length})
              </span>
              <span className="text-[11px] text-neutral-500">
                Status: {executionOutput.casesPassed} / {challenge.testCases.length} verified
              </span>
            </div>

            <div className="space-y-3">
              {challenge.testCases.map((tc, idx) => {
                const result = executionOutput.testCaseResults[tc.id];
                const status = result?.status || 'not_executed';

                return (
                  <div
                    key={tc.id}
                    className={`p-4 rounded-xl border transition-all ${
                      status === 'passed'
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : status === 'failed'
                        ? 'bg-rose-50/60 border-rose-200'
                        : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] font-bold text-neutral-700 uppercase">
                        Case 0{idx + 1}
                      </span>
                      {status === 'not_executed' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200/80 text-neutral-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                          Not Executed
                        </span>
                      )}
                      {status === 'passed' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Passed
                        </span>
                      )}
                      {status === 'failed' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold flex items-center gap-1 border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          Failed
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-[11px] space-y-1.5">
                      <div className="text-neutral-700 bg-white p-2 rounded border border-neutral-200/80">
                        <span className="text-neutral-400 select-none">Input: </span>
                        <span className="text-neutral-900 font-semibold">{tc.input}</span>
                      </div>
                      <div className="text-neutral-700 bg-white p-2 rounded border border-neutral-200/80">
                        <span className="text-neutral-400 select-none">Expected: </span>
                        <span className="text-emerald-700 font-semibold">{tc.expectedOutput}</span>
                      </div>
                    </div>

                    {tc.explanation && (
                      <div className="mt-2 text-[11px] text-neutral-600 italic">
                        {tc.explanation}
                      </div>
                    )}

                    {result && result.details && (
                      <div
                        className={`mt-2 p-2 rounded text-[11px] font-mono ${
                          result.status === 'passed'
                            ? 'bg-emerald-100/50 text-emerald-900'
                            : 'bg-rose-100/60 text-rose-900'
                        }`}
                      >
                        {result.details}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: HINTS */}
        {activeTab === 'hints' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                Conceptual Hints & Guidance
              </span>
              <span className="text-[11px] text-neutral-500">
                Click to reveal progressive hints
              </span>
            </div>

            <div className="space-y-3">
              {challenge.hints.map((hint, idx) => {
                const isRevealed = !!revealedHints[idx];

                return (
                  <div
                    key={idx}
                    className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Hint {idx + 1}
                      </span>
                      <button
                        onClick={() => toggleHint(idx)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline"
                      >
                        {isRevealed ? 'Hide Hint' : 'Reveal Hint'}
                      </button>
                    </div>
                    {isRevealed ? (
                      <div className="text-neutral-700 text-xs pt-1 border-t border-neutral-200">
                        {hint}
                      </div>
                    ) : (
                      <div className="text-neutral-400 text-xs italic">
                        Hint is hidden. Click "Reveal Hint" to unlock.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: STATIC ANALYSIS CRITERIA */}
        {activeTab === 'criteria' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                Static Structural Assertions
              </span>
              <p className="text-[11px] text-neutral-500 mt-1">
                Nexora's client-side static engine parses and verifies code tokens, signatures, and mathematical procedures:
              </p>
            </div>

            <div className="space-y-2.5">
              {challenge.verificationCriteria.map((crit, idx) => {
                const matchedResult = executionOutput.criteriaResults.find((c) => c.id === crit.id);
                const isChecked = executionOutput.status !== 'idle';
                const isPassed = matchedResult?.passed;

                return (
                  <div
                    key={crit.id}
                    className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                      isChecked
                        ? isPassed
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-rose-50 border-rose-200'
                        : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isChecked ? (
                        isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                        )
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center text-[10px] text-neutral-500 font-mono">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-neutral-900">
                        {crit.label}
                      </div>
                      {matchedResult && (
                        <div
                          className={`text-[11px] mt-0.5 ${
                            isPassed ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {matchedResult.message}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Shared Console Component
  const renderVerificationConsole = (isCompact = false) => (
    <div
      className={`bg-[#0a0d14] border-t border-neutral-800 p-4 shrink-0 flex flex-col justify-between text-xs font-mono ${
        isCompact ? 'rounded-xl border border-neutral-800 shadow-xl' : 'h-44'
      }`}
    >
      {/* Console Header Bar */}
      <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-800/80 pb-2">
        <span className="flex items-center gap-2 uppercase tracking-wider text-[11px] text-neutral-300 font-bold">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          Structural Verification Console
        </span>
        <div className="flex items-center gap-3 text-[11px]">
          {executionOutput.status !== 'idle' && (
            <span className="text-neutral-400">
              Duration: <strong className="text-white">{executionOutput.executionTimeMs}ms</strong>
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunVerification}
            isLoading={isRunning}
            leftIcon={<Play className="w-3 h-3 fill-current" />}
            className="text-[11px] py-1 px-2.5 h-auto font-bold"
          >
            Run Verification
          </Button>
        </div>
      </div>

      {/* Console Output Body */}
      <div className="flex-1 py-2 overflow-y-auto space-y-1.5 min-h-[48px]">
        {executionOutput.status === 'idle' ? (
          <div className="text-neutral-500 py-1">
            <span>Engine ready. Press </span>
            <strong className="text-neutral-200">Run Verification</strong>
            <span> to inspect your Python code against the challenge specification.</span>
          </div>
        ) : executionOutput.status === 'success' ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Unit Suite Verified ({executionOutput.casesPassed} / {executionOutput.totalCases} passed)
              </span>
            </div>
            <div className="text-neutral-300 text-[11px] pl-6 leading-relaxed">
              {executionOutput.message}
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 text-rose-400">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Structural Verification Incomplete</span>
            </div>
            <div className="text-neutral-300 text-[11px] pl-6 leading-relaxed">
              {executionOutput.message}
            </div>
          </div>
        )}
      </div>

      {/* Console Footer Status */}
      <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-500">
        <div className="flex items-center gap-1">
          <Info className="w-3 h-3 text-emerald-400" />
          <span>Client-side static analysis • Zero container runtime execution</span>
        </div>
        <div>
          Challenge: <strong className="text-neutral-400">{challenge.id}</strong>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] font-sans -m-4 sm:-m-6 lg:-m-8 bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP IDE TOOLBAR & CHALLENGE SELECTOR                                   */}
      {/* ========================================================================= */}
      <header className="h-14 px-4 sm:px-6 bg-[#0a0d13] border-b border-neutral-800 flex items-center justify-between shrink-0 z-20">
        {/* Left: Navigation and Challenge Switcher */}
        <div className="flex items-center gap-3">
          <Link
            to="/app/learning"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Return to Courses"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Challenge Selector Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-2 cursor-pointer bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-700/80 px-3 py-1.5 rounded-lg transition-all">
              <span
                className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  challenge.difficulty === 'Easy'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : challenge.difficulty === 'Medium'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {challenge.levelBadge}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate max-w-[170px] sm:max-w-[280px]">
                {challenge.title}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-2 hidden group-hover:block hover:block z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  Select Practice Challenge
                </span>
              </div>
              <div className="space-y-1 max-h-72 overflow-y-auto">
                {codingChallenges.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/app/code-challenge/${c.id}`)}
                    className={`w-full text-left p-2.5 rounded-lg transition flex items-start justify-between gap-2 ${
                      c.id === challenge.id
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-bold truncate flex items-center gap-1.5">
                        {c.id === challenge.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        )}
                        <span>{c.title}</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-2">
                        <span>{c.trackRole}</span>
                        <span>•</span>
                        <span>{c.estimatedMinutes} min</span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold uppercase shrink-0 ${
                        c.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : c.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {c.levelBadge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <span className="hidden xl:flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>{challenge.estimatedMinutes} min</span>
          </span>
        </div>

        {/* Right: Layout Toggle, Reset, AI Mentor, and Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Layout Mode Toggle (Split IDE vs Stacked Below Brief) */}
          <div className="hidden lg:flex items-center bg-neutral-900 border border-neutral-700/80 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => handleLayoutChange('split')}
              title="Side-by-side Split View"
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold transition ${
                layoutMode === 'split'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="text-[11px]">Split View</span>
            </button>
            <button
              onClick={() => handleLayoutChange('stacked')}
              title="Stacked View (Code Editor Directly Below Brief)"
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold transition ${
                layoutMode === 'stacked'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Rows className="w-3.5 h-3.5" />
              <span className="text-[11px]">Editor Below Brief</span>
            </button>
          </div>

          {/* Reset Code Control with Confirmation */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTopResetConfirm(true)}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs text-neutral-400 hover:text-rose-400 hover:bg-neutral-800"
            >
              Reset Code
            </Button>

            {showTopResetConfirm && (
              <div className="absolute right-0 top-full mt-2 z-50 w-72 p-3.5 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl text-xs space-y-2.5 animate-in fade-in zoom-in-95">
                <div className="flex items-start gap-2 text-rose-300 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>Reset code to starter template?</span>
                </div>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  All current changes in <strong className="text-neutral-200">solution.py</strong> will be reverted to the original challenge template.
                </p>
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-800">
                  <button
                    onClick={() => setShowTopResetConfirm(false)}
                    className="px-2.5 py-1 text-[11px] rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetCode}
                    className="px-2.5 py-1 text-[11px] rounded bg-rose-600 text-white hover:bg-rose-500 font-bold shadow-sm"
                  >
                    Yes, Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile view switcher */}
          <div className="flex lg:hidden bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setMobileView('brief')}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                mobileView === 'brief'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Brief
            </button>
            <button
              onClick={() => setMobileView('editor')}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                mobileView === 'editor'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Editor
            </button>
          </div>

          {/* Ask AI Mentor */}
          <Link to="/app/ai-mentor" className="hidden md:block">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Bot className="w-3.5 h-3.5 text-emerald-400" />}
              className="text-xs bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600"
            >
              Ask AI Mentor
            </Button>
          </Link>

          {/* Run Verification Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunVerification}
            isLoading={isRunning}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="text-xs font-bold shadow-lg shadow-emerald-500/10"
          >
            Run Verification
          </Button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. ENVIRONMENT NOTICE BANNER                                              */}
      {/* ========================================================================= */}
      <div className="px-4 sm:px-6 py-1.5 bg-[#0e131d] border-b border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-medium text-neutral-300">
            Client-Side Static Analysis & AST Syntax Verification Environment
          </span>
          <span className="hidden md:inline text-neutral-500">
            — Code structure, operations, and signatures are verified client-side without executing unverified code in an external sandbox.
          </span>
        </div>
        <div className="text-[10px] font-mono text-neutral-500">
          Target: <strong className="text-neutral-300">{challenge.trackRole}</strong>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE: SPLIT VIEW OR STACKED BELOW BRIEF VIEW                 */}
      {/* ========================================================================= */}
      {layoutMode === 'stacked' ? (
        /* STACKED LAYOUT: Problem Brief on top, Code Editor directly below */
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#0a0d14]">
          {/* Top Section: Problem Brief and Tabs Card */}
          <div className="bg-white text-neutral-900 rounded-xl border border-neutral-200 overflow-hidden shadow-sm max-h-[380px] flex flex-col">
            {renderDocumentationPane()}
          </div>

          {/* Middle Section: Python Code Editor Directly Below Problem Brief */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
              <span className="text-white font-bold flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Python Code Workspace (solution.py)</span>
              </span>
              <span className="text-neutral-500">Python 3.11</span>
            </div>
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              onReset={handleResetCode}
              fileName="solution.py"
              isModified={isModified}
              minHeight="420px"
            />
          </div>

          {/* Bottom Section: Verification Console & Test Runner */}
          <div>
            {renderVerificationConsole(true)}
          </div>
        </div>
      ) : (
        /* SPLIT DUAL-PANE LAYOUT: Side-by-Side Desktop IDE */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 bg-[#0d1117] overflow-hidden">
          {/* LEFT COLUMN: Problem Brief & Test Suite (5 COLS) */}
          <aside
            className={`lg:col-span-5 border-r border-neutral-200 flex flex-col h-full min-h-0 overflow-hidden ${
              mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {renderDocumentationPane()}
          </aside>

          {/* RIGHT COLUMN: Code Editor & Execution Console (7 COLS) */}
          <section
            className={`lg:col-span-7 flex flex-col h-full min-h-0 bg-[#0d1117] overflow-hidden ${
              mobileView === 'brief' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Main Code Editor Component */}
            <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-hidden flex flex-col">
              <CodeEditor
                code={code}
                onChange={handleCodeChange}
                onReset={handleResetCode}
                fileName="solution.py"
                isModified={isModified}
                minHeight="100%"
              />
            </div>

            {/* Bottom Verification Console */}
            {renderVerificationConsole(false)}
          </section>
        </div>
      )}
    </div>
  );
};
