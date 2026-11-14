import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Radar,
  GraduationCap,
  CheckSquare,
  Terminal,
  Bot,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { NexoraLogo } from '@/components/common/NexoraLogo';

interface AppSidebarProps {
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    if (onCloseMobile) onCloseMobile();
  };

  const navGroups = [
    {
      groupTitle: 'Core Pathway',
      items: [
        { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
        { label: 'Career Roadmap', path: '/app/roadmap', icon: Compass },
        { label: 'Skill Gap Analysis', path: '/app/skill-analysis', icon: Radar },
      ],
    },
    {
      groupTitle: 'Academy & Lab',
      items: [
        { label: 'Courses & Levels', path: '/app/learning', icon: GraduationCap },
        { label: 'Assessments', path: '/app/assessments', icon: CheckSquare },
        {
          label: 'Code IDE Sandbox',
          path: '/app/code-challenge/challenge-attention-head',
          icon: Terminal,
          badge: 'Live',
        },
      ],
    },
    {
      groupTitle: 'Intelligence',
      items: [
        {
          label: 'AI Mentor',
          path: '/app/ai-mentor',
          icon: Bot,
          badge: 'Online',
        },
        { label: 'Progress & Velocity', path: '/app/progress', icon: TrendingUp },
      ],
    },
    {
      groupTitle: 'Preferences',
      items: [
        { label: 'Learner Profile', path: '/app/profile', icon: User },
        { label: 'Settings', path: '/app/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 h-full bg-neutral-950 text-white flex flex-col border-r border-neutral-900 select-none">
      {/* App Header Brand */}
      <div className="h-20 px-5 flex items-center justify-between border-b border-neutral-900">
        <Link to="/app/dashboard" className="flex items-center group" onClick={onCloseMobile}>
          <NexoraLogo variant="white" size="sm" showSubtitle={true} subtitleText="Learning Intelligence" />
        </Link>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-brand-400">
          v4.2
        </span>
      </div>

      {/* Nav Link Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-mono font-semibold tracking-wider text-neutral-500 uppercase">
              {group.groupTitle}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-500/15 text-brand-400 font-semibold border border-brand-500/25 shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <Badge variant="brand" className="text-[9px] py-0 px-1.5 uppercase font-mono">
                      {item.badge}
                    </Badge>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-neutral-500" />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Onboarding Quick Link (if incomplete) */}
      {!user?.isProfileComplete && (
        <div className="p-3 mx-3 mb-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            Profile Incomplete
          </div>
          <p className="text-[11px] text-amber-200/80">Complete onboarding to unlock your custom roadmap.</p>
          <Link
            to="/app/onboarding"
            onClick={onCloseMobile}
            className="block text-center py-1 rounded bg-amber-500 text-neutral-950 font-semibold text-[11px] hover:bg-amber-400 transition-colors"
          >
            Finish Setup →
          </Link>
        </div>
      )}

      {/* User Footer & Logout */}
      <div className="p-3 border-t border-neutral-900 bg-neutral-950/60">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-900 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-9 h-9 rounded-xl object-cover border border-neutral-700"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-brand-500 text-neutral-950 font-bold flex items-center justify-center text-sm">
                {user?.fullName?.substring(0, 2).toUpperCase() || 'NX'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                {user?.fullName || 'Active Learner'}
              </div>
              <div className="text-[11px] text-neutral-400 truncate">
                {user?.email || 'learner@nexora.ai'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
