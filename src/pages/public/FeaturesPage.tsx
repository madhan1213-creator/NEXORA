import React from 'react';
import { Link } from 'react-router-dom';
import { Radar, Compass, Terminal, Bot, TrendingUp, CheckCircle, ArrowRight, Cpu, Layers, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const FeaturesPage: React.FC = () => {
  const featureList = [
    {
      title: 'Multidimensional Skill Radar',
      desc: 'Visualize your capabilities across 12 distinct engineering axes, contrasting your scores directly against tier-1 enterprise candidate cohorts.',
      icon: Radar,
      tag: 'Analysis',
    },
    {
      title: 'Decoupled Curriculum & Recommendation Engine',
      desc: 'Our curriculum engine structures courses and prerequisites, while our recommendation engine analyzes dynamic mastery to guide your next best sprint.',
      icon: Cpu,
      tag: 'Intelligence',
    },
    {
      title: 'In-Browser Code IDE Sandbox',
      desc: 'Write code directly in browser with deterministic execution, edge test cases, unit testing evaluation, and real-time syntax linting.',
      icon: Terminal,
      tag: 'Practice',
    },
    {
      title: 'Context-Aware AI Career Mentor',
      desc: 'An AI mentor that inspects your actual code challenges, points out edge cases, and provides surgical guidance without spoiling solutions.',
      icon: Bot,
      tag: 'Mentorship',
    },
    {
      title: 'Granular Progress Telemetry',
      desc: 'Track weekly study velocity, milestone completion rates, and benchmark readiness metrics in a unified telemetry view.',
      icon: TrendingUp,
      tag: 'Analytics',
    },
    {
      title: 'Modular Prerequisite Tree',
      desc: 'Guaranteed sequential learning. Never hit a brick wall trying to understand transformers without mastering matrix multiplication first.',
      icon: Layers,
      tag: 'Curriculum',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand" className="font-mono uppercase">
          Engineered Capabilities
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-neutral-950 tracking-tight">
          Everything You Need to Reach Senior Competency
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          Built from the ground up for technical clarity, relentless velocity, and real engineering rigor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.title} className="p-8 border border-neutral-200 hoverEffect flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="neutral" className="text-[10px] font-mono">
                    {f.tag}
                  </Badge>
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-950 mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 text-center max-w-4xl mx-auto space-y-6">
        <h3 className="text-2xl sm:text-3xl font-display font-bold">
          Experience the platform in action
        </h3>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto">
          Sign up today to test all features with temporary development mode enabled.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup">
            <Button variant="primary" size="lg">
              Sign Up
            </Button>
          </Link>
          <Link to="/app/dashboard">
            <Button variant="secondary" size="lg">
              Preview App Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
