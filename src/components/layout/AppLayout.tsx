import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppMobileNav } from '@/components/navigation/AppMobileNav';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const pageVariants = {
    initial: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -6 },
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-neutral-50 text-neutral-900 font-sans selection:bg-brand-500 selection:text-neutral-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm"
            />
            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl"
            >
              <AppSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AppHeader onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation */}
      <AppMobileNav />
    </div>
  );
};
