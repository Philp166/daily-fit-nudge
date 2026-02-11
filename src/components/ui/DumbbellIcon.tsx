import React from 'react';

interface DumbbellIconProps {
  size?: number;
  className?: string;
}

const DumbbellIcon: React.FC<DumbbellIconProps> = ({ size = 24, className = '' }) => {
  const rendered = Math.round(size * 1.6);
  return (
    <picture>
      <source srcSet="/dumbbell.webp" type="image/webp" />
      <img
        src="/dumbbell.png"
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

export default DumbbellIcon;
