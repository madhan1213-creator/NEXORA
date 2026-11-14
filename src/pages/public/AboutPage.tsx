import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Target, Zap, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand" className="font-mono uppercase">
          Our Mission & Standards
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-neutral-950 tracking-tight">
          Democratizing Tier-1 Engineering Mentorship
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          Nexora was conceived to bridge the massive gap between academic coursework and modern enterprise software engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 border border-neutral-200">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-neutral-950 mb-2">Outcome-Centric</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            We don’t measure success in hours watched or badges collected. We measure success in working code commits, verified system builds, and job placement.
          </p>
        </Card>

        <Card className="p-8 border border-neutral-200">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-neutral-950 mb-2">High Velocity</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Eliminating redundant theory and passive video consumption in favor of fast feedback loops in live IDE sandboxes.
          </p>
        </Card>

        <Card className="p-8 border border-neutral-200">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-neutral-950 mb-2">Engineering Integrity</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Decoupling curriculum structures from AI recommendations prevents hallucinated learning paths and ensures strict prerequisite adherence.
          </p>
        </Card>
      </div>
    </div>
  );
};
