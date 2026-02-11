import React from 'react';

interface HeartIconProps {
  size?: number;
  className?: string;
}

const HeartIcon: React.FC<HeartIconProps> = ({ size = 24, className = '' }) => {
  const rendered = Math.round(size * 1.6);
  return (
    <picture>
      <source srcSet={`${import.meta.env.BASE_URL}heart.webp`} type="image/webp" />
      <img
        src={`${import.meta.env.BASE_URL}heart.png`}
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

export default HeartIcon;
