import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 font-sans">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
        <Compass className="w-8 h-8" />
      </div>
      <span className="font-mono text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-950 tracking-tight mb-3">
        Pathway Not Found
      </h1>
      <p className="text-sm text-neutral-600 max-w-md mb-8 leading-relaxed">
        The route you are navigating to does not exist or has been shifted in the curriculum graph.
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Nexora Home
        </Button>
      </Link>
    </div>
  );
};
