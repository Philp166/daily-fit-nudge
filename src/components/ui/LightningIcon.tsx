import React from 'react';

interface LightningIconProps {
  size?: number;
  className?: string;
}

const LightningIcon: React.FC<LightningIconProps> = ({ size = 24, className = '' }) => {
  const rendered = Math.round(size * 1.6);
  return (
    <picture>
      <source srcSet={`${import.meta.env.BASE_URL}lightning.webp`} type="image/webp" />
      <img
        src={`${import.meta.env.BASE_URL}lightning.png`}
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

export default LightningIcon;
