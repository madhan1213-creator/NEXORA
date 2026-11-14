import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      <div className="pb-4 border-b border-neutral-200">
        <Badge variant="neutral" className="font-mono uppercase text-[10px] mb-2">
          Configuration
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-950 tracking-tight">
          Platform & Account Settings
        </h1>
      </div>

      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-950">
            Telemetry & Data Privacy
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Configure how your coding challenge test runs and diagnostic results are utilized by the recommendation engine.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <div>
              <div className="text-xs font-semibold text-neutral-900">Adaptive Re-ranking</div>
              <div className="text-[11px] text-neutral-500">Recalculate milestone order automatically after assessments</div>
            </div>
            <span className="text-xs font-mono font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
              Enabled
            </span>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-950">
            Editor Sandbox Preferences
          </h3>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <div>
              <div className="text-xs font-semibold text-neutral-900">Vim Keybindings</div>
              <div className="text-[11px] text-neutral-500">Toggle modal Vim navigation in the in-browser IDE</div>
            </div>
            <span className="text-xs font-mono text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
              Standard
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};
