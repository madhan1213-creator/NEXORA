import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PublicNavbar } from '@/components/navigation/PublicNavbar';
import { PublicFooter } from '@/components/navigation/PublicFooter';
import { motion, useReducedMotion } from 'framer-motion';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const pageVariants = {
    initial: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -8 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-brand-500 selection:text-neutral-950">
      <PublicNavbar />
      <main className="flex-1 pt-20">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <PublicFooter />
    </div>
  );
};
