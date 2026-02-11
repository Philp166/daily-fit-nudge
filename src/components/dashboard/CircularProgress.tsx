import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  delay?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 80,
  strokeWidth = 6,
  showValue = true,
  delay = 0,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const padding = 20; // Extra space for blur effect
  const svgSize = size + padding * 2;
  const centerOffset = padding + size / 2;

  return (
    <div className="relative" style={{ width: svgSize, height: svgSize }}>
      <svg width={svgSize} height={svgSize} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={centerOffset}
          cy={centerOffset}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <motion.circle
          cx={centerOffset}
          cy={centerOffset}
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay, ease: 'easeOut' }}
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
        />
      </svg>

      {/* Center value */}
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="text-lg font-bold text-white"
          >
            {Math.round(animatedValue)}%
          </motion.span>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
