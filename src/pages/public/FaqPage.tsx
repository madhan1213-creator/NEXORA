import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Nexora determine my skill gaps?',
      a: 'We use dynamic diagnostic assessments based on real enterprise code review standards. Your answers are evaluated across multiple competency vectors (e.g., algorithmic mechanics, distributed systems design, data modeling) to determine your true readiness delta.',
    },
    {
      q: 'Why is the curriculum engine separated from the recommendation engine?',
      a: 'A common flaw in AI learning tools is letting LLMs invent curricula on the fly, leading to disordered prerequisites and missing foundations. In Nexora, the curriculum is strictly codified and validated. The AI recommendation engine only determines which validated module or challenge you should tackle next.',
    },
    {
      q: 'What is Development Mode?',
      a: 'During current development, we provide a temporary development auth mode switcher in the bottom-right corner. You can freely toggle between Unauthenticated, Profile Incomplete, and Profile Complete states to inspect routing and protected features.',
    },
    {
      q: 'Are the coding challenges executed in a real sandbox?',
      a: 'Yes, code is executed against test assertions with deterministic limits on execution time and memory consumption.',
    },
    {
      q: 'Can I change my target career pathway later?',
      a: 'Absolutely. You can modify your target role at any time from your Learner Profile or Dashboard, and your roadmap will recalibrate automatically.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      <div className="text-center space-y-4">
        <Badge variant="brand" className="font-mono uppercase">
          Got Questions?
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-neutral-950 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          Everything you need to know about our learning methodology and platform architecture.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Card
              key={faq.q}
              className="overflow-hidden border border-neutral-200 cursor-pointer"
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <div className="p-6 flex items-center justify-between">
                <h4 className="text-base sm:text-lg font-semibold text-neutral-950 font-display">
                  {faq.q}
                </h4>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0" />
                )}
              </div>
              {isOpen && (
                <div className="px-6 pb-6 pt-0 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 mt-2 pt-4">
                  {faq.a}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
