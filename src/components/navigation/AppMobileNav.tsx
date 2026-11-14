import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Radar,
  GraduationCap,
  Bot,
} from 'lucide-react';

export const AppMobileNav: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Roadmap', path: '/app/roadmap', icon: Compass },
    { label: 'Skills', path: '/app/skill-analysis', icon: Radar },
    { label: 'Courses', path: '/app/learning', icon: GraduationCap },
    { label: 'Mentor', path: '/app/ai-mentor', icon: Bot },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800 px-2 py-2 flex items-center justify-around font-sans">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-brand-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] mt-1 font-medium tracking-tight">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-brand-400 mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
