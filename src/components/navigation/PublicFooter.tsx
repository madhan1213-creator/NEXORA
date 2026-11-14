import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { NexoraLogo } from '@/components/common/NexoraLogo';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-900 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <NexoraLogo variant="white" size="md" showTagline={true} />
            </Link>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Learn Smarter. Build Your Future. Nexora helps you discover your career path, identify skill gaps, and follow a personalized learning journey built around your actual abilities.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-brand-400">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                NEXORA LEARNING INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Platform
            </h5>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/careers" className="hover:text-brand-400 transition-colors">
                  Career Pathways
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-brand-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-brand-400 transition-colors">
                  Core Features
                </Link>
              </li>
              <li>
                <Link to="/app/learning" className="hover:text-brand-400 transition-colors">
                  Curriculum Catalog
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-brand-400 transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources & Company */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Company
            </h5>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">
                  About Nexora
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-400 transition-colors inline-flex items-center gap-1"
                >
                  GitHub Repository <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Security & Trust */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Trust & System
            </h5>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <span className="text-neutral-500 text-xs">SOC2 Type II Compliant</span>
              </li>
              <li>
                <span className="text-neutral-500 text-xs">Deterministic Code Sandbox</span>
              </li>
              <li>
                <span className="text-neutral-500 text-xs">Zero Data Harvesting</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Nexora Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
