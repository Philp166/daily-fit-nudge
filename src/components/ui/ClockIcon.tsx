import React from 'react';

interface ClockIconProps {
  size?: number;
  className?: string;
}

const ClockIcon: React.FC<ClockIconProps> = ({ size = 24, className = '' }) => {
  const rendered = Math.round(size * 1.6);
  return (
    <picture>
      <source srcSet="/clock.webp" type="image/webp" />
      <img
        src="/clock.png"
        alt=""
        width={rendered}
        height={rendered}
        className={className}
        style={{ objectFit: 'contain' }}
        draggable={false}
      />
    </picture>
  );
};

export default ClockIcon;
