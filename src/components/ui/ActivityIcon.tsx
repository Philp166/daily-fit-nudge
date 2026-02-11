import React from 'react';

interface ActivityIconProps {
  size?: number;
  className?: string;
}

const ActivityIcon: React.FC<ActivityIconProps> = ({ size = 24, className = '' }) => {
  const rendered = Math.round(size * 1.6);
  return (
    <picture>
      <source srcSet="/activity.webp" type="image/webp" />
      <img
        src="/activity.png"
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

export default ActivityIcon;
