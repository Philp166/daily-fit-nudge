import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1.5
        text-badge text-foreground/90
        badge-blur
        rounded-full
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
