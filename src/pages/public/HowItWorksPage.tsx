import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Radar, Compass, Terminal, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Target Role Selection',
      desc: 'Choose your desired engineering destination, such as AI & Data Specialist or Modern Full-Stack Architect.',
      icon: Target,
    },
    {
      step: '02',
      title: 'AI Diagnostic Assessment',
      desc: 'Take an adaptive diagnostic test that stress-tests algorithms, systems design, and syntax without fluff.',
      icon: Radar,
    },
    {
      step: '03',
      title: 'Automated Gap Mapping',
      desc: 'Our engine contrasts your benchmark scores against industry requirements and generates your bespoke roadmap.',
      icon: Compass,
    },
    {
      step: '04',
      title: 'Sprint-Based Mastery',
      desc: 'Work through interactive code challenges and verified course levels in our integrated sandbox.',
      icon: Terminal,
    },
    {
      step: '05',
      title: 'Verified Portfolio & Placement',
      desc: 'Graduate with peer-reviewed code artifacts, demonstrable system builds, and verified telemetry.',
      icon: Award,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand" className="font-mono uppercase">
          Autonomous Architecture
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-neutral-950 tracking-tight">
          How Nexora Transforms Tech Learning
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          From diagnostic analysis to production verification in five scientific stages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.step} className="p-8 border border-neutral-200 hoverEffect flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xl font-bold text-neutral-300">{s.step}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-950 mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200 text-center max-w-4xl mx-auto space-y-6">
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-neutral-950">
          Ready to experience autonomous career acceleration?
        </h3>
        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
          Start your diagnostic evaluation today. It takes less than 10 minutes to map your baseline.
        </p>
        <Link to="/signup" className="inline-block">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Begin Free Diagnostic
          </Button>
        </Link>
      </div>
    </div>
  );
};
