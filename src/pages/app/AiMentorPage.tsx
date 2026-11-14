import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, Terminal, Code2, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { getLearnerState, getLearnerRoadmap } from '@/services/learning/learnerService';
import { getLearnerProfile } from '@/services/onboarding/onboardingService';

interface Message {
  id: string;
  sender: 'mentor' | 'user';
  text: string;
  timestamp: string;
  code?: string;
}

export const AiMentorPage: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.fullName?.split(' ')[0] || 'Learner';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'mentor',
      text: `Hello ${userName}! I'm your Nexora learning mentor. I track your diagnostic assessments, identified gaps, and roadmap milestones. How can I assist you with your learning goals or technical concepts today?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  const generateMentorResponse = (query: string): { text: string; code?: string } => {
    const q = query.toLowerCase();

    if (q.includes('roadmap') || q.includes('what next') || q.includes('study first')) {
      return {
        text: 'Based on your diagnostic baseline, I recommend focusing on your Phase 1 prerequisite modules first. Strengthening core data structures and mathematical foundations will make subsequent machine learning and systems topics significantly easier to master.',
      };
    }

    if (q.includes('attention') || q.includes('scale') || q.includes('sqrt')) {
      return {
        text: 'In Transformer scaled dot-product attention, scaling by 1/sqrt(d_k) prevents the dot products from growing excessively large as dimension d_k increases. Without scaling, large dot products push the softmax activation function into regions with near-zero gradients, severely halting backpropagation training.',
        code: '# Scaled Dot-Product Attention Formula\nscores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)\nattn_weights = torch.softmax(scores, dim=-1)\noutput = torch.matmul(attn_weights, V)',
      };
    }

    if (q.includes('generator') || q.includes('yield') || q.includes('lazy')) {
      return {
        text: 'Python generators implement lazy evaluation using the iterator protocol. Unlike list comprehensions that materialize the entire sequence in memory at once (O(N) memory), generators yield elements one at a time on demand, retaining an O(1) memory footprint.',
        code: '# Generator Expression:\ngen = (x * 2 for x in range(1_000_000)) # O(1) RAM\nprint(next(gen))',
      };
    }

    if (q.includes('sql') || q.includes('window') || q.includes('dense_rank')) {
      return {
        text: 'In SQL window functions, DENSE_RANK() assigns consecutive rankings without gaps when values tie (e.g., 1, 1, 2), whereas RANK() skips rankings according to the number of ties (e.g., 1, 1, 3). Standard ROW_NUMBER() assigns strictly unique arbitrary ranks.',
        code: 'SELECT emp_id, salary,\n       DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank,\n       RANK() OVER (ORDER BY salary DESC) as standard_rank\nFROM employees;',
      };
    }

    if (q.includes('diagnostic') || q.includes('assessment')) {
      return {
        text: 'The diagnostic assessment is designed as an empirical baseline test rather than an academic exam. Questions adapt dynamically based on your responses to identify verified strengths and missing prerequisites. Your results directly shape your custom roadmap.',
      };
    }

    return {
      text: `That's an insightful question about "${query}". To excel in your target career, focus on connecting theoretical principles to concrete, verifiable implementations. Feel free to ask about Python mechanics, Transformer attention, SQL window functions, or your roadmap pacing!`,
    };
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputVal;
    setInputVal('');

    setTimeout(() => {
      const reply = generateMentorResponse(currentInput);
      const mentorReply: Message = {
        id: String(Date.now() + 1),
        sender: 'mentor',
        text: reply.text,
        code: reply.code,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, mentorReply]);
    }, 500);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col font-sans max-w-4xl mx-auto -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-emerald-400 flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-neutral-900 tracking-tight">
                AI Career & Curriculum Mentor
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                Active
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Personalized guidance calibrated to your target career and diagnostic results.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-lg text-neutral-600 text-[11px] font-medium">
          <Info className="w-3.5 h-3.5 text-neutral-400" />
          <span>Curriculum Assistance Engine</span>
        </div>
      </div>

      {/* Message Chat Flow */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'mentor' && (
              <div className="w-8 h-8 rounded-xl bg-neutral-900 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-neutral-900 text-white rounded-tr-none'
                  : 'bg-white border border-neutral-200/90 text-neutral-800 shadow-sm rounded-tl-none'
              }`}
            >
              <p>{m.text}</p>

              {m.code && (
                <div className="mt-3 p-3 bg-neutral-950 text-neutral-100 rounded-xl font-mono text-[11px] overflow-x-auto border border-neutral-800">
                  <pre>
                    <code>{m.code}</code>
                  </pre>
                </div>
              )}

              <div
                className={`text-[10px] mt-2 font-mono ${
                  m.sender === 'user' ? 'text-neutral-400 text-right' : 'text-neutral-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Composer */}
      <form onSubmit={handleSend} className="pt-3 border-t border-neutral-200 shrink-0">
        <div className="flex items-center gap-2 bg-white border border-neutral-300 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-neutral-900 transition">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about your roadmap, diagnostic questions, or code concepts..."
            className="flex-1 px-3 py-1.5 text-xs text-neutral-900 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className={`p-2.5 rounded-xl transition ${
              inputVal.trim()
                ? 'bg-neutral-900 text-white hover:bg-black shadow-sm'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
