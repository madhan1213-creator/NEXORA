import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { NexoraLogo } from '@/components/common/NexoraLogo';

export const AuthLayout: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-brand-500 selection:text-neutral-950">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Brand Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-block group">
          <NexoraLogo size="lg" showTagline={true} />
        </Link>
      </div>

      {/* Auth Card Outlet */}
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sm:mx-auto sm:w-full sm:max-w-md px-4"
      >
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-neutral-200/90 shadow-card">
          <Outlet />
        </div>

        {/* Bottom trust footer */}
        <p className="mt-6 text-center text-xs text-neutral-500">
          Protected by enterprise-grade cryptographic sessions. Zero telemetry sales.
        </p>
      </motion.div>
    </div>
  );
};
