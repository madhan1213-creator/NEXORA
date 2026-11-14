import React, { useState } from 'react';
import { AssessmentQuestion } from '@/types/assessment';
import {
  Code,
  Copy,
  Check,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface QuestionCardProps {
  question: AssessmentQuestion;
  currentAnswer: string | string[] | undefined;
  isFirst: boolean;
  isLast: boolean;
  onAnswerChange: (answer: string | string[]) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentAnswer,
  isFirst,
  isLast,
  onAnswerChange,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Toggle selection for multiple_select
  const handleToggleMultiSelect = (optionId: string) => {
    const currentList: string[] = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
    const index = currentList.indexOf(optionId);
    if (index > -1) {
      currentList.splice(index, 1);
    } else {
      currentList.push(optionId);
    }
    onAnswerChange(currentList);
  };

  // Single select for multiple_choice, true_false, scenario
  const handleSingleSelect = (optionId: string) => {
    onAnswerChange(optionId);
  };

  const handleClearAnswer = () => {
    if (question.type === 'multiple_select') {
      onAnswerChange([]);
    } else {
      onAnswerChange('');
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
      {/* Question Domain & Skill Metadata Header */}
      <div className="px-6 py-4 bg-neutral-50/70 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-900 text-white">
            {question.careerDomain}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200 text-neutral-800">
            {question.skill}
          </span>
          <span className="text-xs text-neutral-500 font-medium">
            Topic: <span className="text-neutral-700">{question.topic}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
          <span className="px-2 py-0.5 bg-emerald-100/70 text-emerald-800 rounded-md">
            +{question.marks} marks
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Scenario Context Box if present */}
        {question.scenarioContext && (
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 text-neutral-800 text-sm leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-xs text-blue-900 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Scenario Context
            </div>
            {question.scenarioContext}
          </div>
        )}

        {/* Question Text */}
        <div className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
          {question.questionText}
        </div>

        {/* Code Snippet Box if present */}
        {question.codeSnippet && (
          <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-800/90 border-b border-neutral-700/60 text-neutral-400">
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-neutral-300">Code Snippet</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(question.codeSnippet!)}
                className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-neutral-100 overflow-x-auto leading-relaxed">
              <code>{question.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Question Instructions / Helper notice */}
        {question.type === 'multiple_select' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5" />
            Multiple Selection: Choose all options that apply.
          </div>
        )}
        {question.type === 'code_output' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg">
            <HelpCircle className="w-3.5 h-3.5" />
            Predict exact standard output. Whitespace between tokens is evaluated.
          </div>
        )}

        {/* Answer Options Section */}
        <div className="space-y-3 pt-2">
          {/* Multiple Choice / True-False / Scenario */}
          {(question.type === 'multiple_choice' ||
            question.type === 'true_false' ||
            question.type === 'scenario') &&
            question.options && (
              <div className="grid grid-cols-1 gap-3">
                {question.options.map((opt, idx) => {
                  const isSelected = currentAnswer === opt.id;
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSingleSelect(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-900'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/80 text-neutral-900'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold shrink-0 flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-emerald-400 text-neutral-900'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {letter}
                      </span>
                      <div className="text-sm font-medium leading-relaxed pt-0.5">{opt.text}</div>
                    </button>
                  );
                })}
              </div>
            )}

          {/* Multiple Select */}
          {question.type === 'multiple_select' && question.options && (
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((opt, idx) => {
                const currentSelected = Array.isArray(currentAnswer) ? currentAnswer : [];
                const isSelected = currentSelected.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleMultiSelect(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 text-neutral-900 ring-1 ring-emerald-500'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 text-neutral-900'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md text-xs font-bold shrink-0 flex items-center justify-center border mt-0.5 transition ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-neutral-300 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <div className="text-sm font-medium leading-relaxed">{opt.text}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Code Output Prediction Input */}
          {question.type === 'code_output' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Predicted Terminal Output
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="e.g. 5 20"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition"
                />
              </div>
            </div>
          )}

          {/* Short Coding Question */}
          {question.type === 'short_code' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Your Code Solution
                </label>
                {question.codeStarter && (
                  <button
                    type="button"
                    onClick={() => onAnswerChange(question.codeStarter || '')}
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Starter Code
                  </button>
                )}
              </div>
              <textarea
                rows={6}
                value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Write your answer snippet or code logic..."
                className="w-full p-4 bg-neutral-900 text-neutral-100 border border-neutral-800 rounded-xl font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation & Submission Footer */}
      <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isFirst}
            onClick={onPrevious}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1.5 ${
              isFirst
                ? 'opacity-40 cursor-not-allowed bg-neutral-100 text-neutral-400'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentAnswer && (
            <button
              type="button"
              onClick={handleClearAnswer}
              className="px-3 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white font-semibold rounded-xl text-xs transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Review & Submit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
