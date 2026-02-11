import React from 'react';

interface FlameIconProps {
  size?: number;
  className?: string;
}

const FlameIcon: React.FC<FlameIconProps> = ({ size = 24, className = '' }) => {
  const rendered = Math.round(size * 1.6);
  return (
    <picture>
      <source srcSet={`${import.meta.env.BASE_URL}flame.webp`} type="image/webp" />
      <img
        src={`${import.meta.env.BASE_URL}flame.png`}
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

export default FlameIcon;
