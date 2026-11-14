import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { NexoraLogo } from '@/components/common/NexoraLogo';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { status, user } = useAuth();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Careers', path: '/careers', badge: '6 Paths' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Features', path: '/features' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group">
          <NexoraLogo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive(link.path)
                  ? 'text-neutral-950 font-semibold bg-neutral-100/80'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <Badge variant="brand" className="text-[10px] py-0 px-2 font-mono">
                  {link.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {status !== 'unauthenticated' ? (
            <Link to={user?.isProfileComplete ? '/app/dashboard' : '/app/onboarding'}>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-semibold shadow-sm"
              >
                Go to Workspace
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-neutral-950" />}
                  className="shadow-sm font-semibold"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-b border-neutral-200 bg-white px-4 pt-2 pb-6 space-y-3"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-neutral-100 text-neutral-950 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && <Badge variant="brand">{link.badge}</Badge>}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
              {status !== 'unauthenticated' ? (
                <Link
                  to={user?.isProfileComplete ? '/app/dashboard' : '/app/onboarding'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="primary" className="w-full">
                    Go to Workspace
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
