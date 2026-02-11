import React from 'react';

interface ClockIconProps {
  size?: number;
  className?: string;
}

const ClockIcon: React.FC<ClockIconProps> = ({ size = 24, className = '' }) => {
  const rendered = Math.round(size * 1.6);
  return (
    <picture>
      <source srcSet={`${import.meta.env.BASE_URL}clock.webp`} type="image/webp" />
      <img
        src={`${import.meta.env.BASE_URL}clock.png`}
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
