import React from 'react';
import { AssessmentQuestion } from '@/types/assessment';
import {
  X,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  questions: AssessmentQuestion[];
  responses: Record<string, string | string[]>;
  flaggedQuestionIds: string[];
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  onClose: () => void;
  onConfirmSubmit: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  questions,
  responses,
  flaggedQuestionIds,
  currentIndex,
  onSelectQuestion,
  onClose,
  onConfirmSubmit,
}) => {
  if (!isOpen) return null;

  const total = questions.length;
  const answeredCount = questions.filter((q) => {
    const val = responses[q.id];
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }).length;

  const flaggedCount = flaggedQuestionIds.length;
  const unansweredCount = total - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Assessment Review Matrix</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Review your answers, jump to any question, or confirm final submission.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Counts Summary */}
        <div className="px-6 py-3 bg-neutral-50/70 border-b border-neutral-100 grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-xl bg-white border border-neutral-200">
            <div className="text-xs text-neutral-500 font-medium">Answered</div>
            <div className="text-lg font-extrabold text-emerald-600">{answeredCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-white border border-neutral-200">
            <div className="text-xs text-neutral-500 font-medium">Flagged</div>
            <div className="text-lg font-extrabold text-amber-600">{flaggedCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-white border border-neutral-200">
            <div className="text-xs text-neutral-500 font-medium">Unanswered</div>
            <div className="text-lg font-extrabold text-neutral-700">{unansweredCount}</div>
          </div>
        </div>

        {/* Question Matrix Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {questions.map((q, idx) => {
              const resp = responses[q.id];
              const isAnswered =
                resp !== undefined && resp !== null && resp !== '' && (!Array.isArray(resp) || resp.length > 0);
              const isFlagged = flaggedQuestionIds.includes(q.id);
              const isCurrent = currentIndex === idx;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    onSelectQuestion(idx);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between relative ${
                    isCurrent
                      ? 'ring-2 ring-neutral-900 border-neutral-900 bg-neutral-50'
                      : 'hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Q{idx + 1}</span>
                    {isFlagged && (
                      <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 capitalize truncate max-w-[65px]">{q.skill}</span>
                    {isAnswered ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-neutral-400 font-medium flex items-center gap-0.5">
                        <HelpCircle className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {unansweredCount > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 leading-relaxed">
                <span className="font-bold">Notice:</span> You have{' '}
                <span className="font-extrabold">{unansweredCount} unanswered questions</span>. You may still submit, but unanswered questions will receive 0 marks and will be flagged as prerequisite review areas.
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-xl text-xs font-semibold transition"
          >
            Return to Questions
          </button>

          <button
            type="button"
            onClick={onConfirmSubmit}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>Confirm & Submit Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
