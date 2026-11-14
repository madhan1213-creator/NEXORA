import React from 'react';

interface NexoraLogoProps {
  variant?: 'dark' | 'light' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = false,
  showSubtitle = false,
  subtitleText = 'Learning Intelligence',
  className = '',
}) => {
  const isLight = variant === 'light' || variant === 'white';

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric Nexus Symbol */}
      <div
        className={`${iconSizes[size]} rounded-xl ${
          isLight ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-950 border border-neutral-900 shadow-sm'
        } flex items-center justify-center p-1.5 shrink-0 transition-transform hover:scale-105`}
      >
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          {/* Distinctive NEXORA Geometric Nexus Symbol */}
          <path
            d="M7 25V7L19 21V7"
            stroke="#16E66B"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 21L25 14V25"
            stroke={isLight ? '#FFFFFF' : '#16E66B'}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="7" r="2.5" fill="#16E66B" />
          <circle cx="19" cy="21" r="2.2" fill="#16E66B" />
          <circle cx="25" cy="14" r="2.2" fill={isLight ? '#FFFFFF' : '#16E66B'} />
        </svg>
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-extrabold tracking-tight ${textSizes[size]} ${
            isLight ? 'text-white' : 'text-neutral-950'
          }`}
        >
          NEXORA
        </span>
        {showSubtitle && (
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 mt-1 uppercase font-semibold">
            {subtitleText}
          </span>
        )}
        {showTagline && (
          <span className="text-[10px] text-neutral-500 font-medium tracking-normal mt-0.5">
            Learn Smarter. Build Your Future.
          </span>
        )}
      </div>
    </div>
  );
};
