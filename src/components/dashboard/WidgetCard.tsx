import React from 'react';
import { motion } from 'framer-motion';

interface WidgetCardProps {
  children: React.ReactNode;
  gradient: 'workout' | 'activity' | 'workouts' | 'analysis' | 'constructor';
  className?: string;
  onClick?: () => void;
  delay?: number;
}

const gradientClasses = {
  workout: 'gradient-workout',
  activity: 'gradient-activity',
  workouts: 'gradient-workouts',
  analysis: 'gradient-analysis',
  constructor: 'gradient-constructor',
};

const WidgetCard: React.FC<WidgetCardProps> = ({
  children,
  gradient,
  className = '',
  onClick,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      onClick={onClick}
      className={`
        ${gradientClasses[gradient]}
        rounded-3xl p-5
        card-interactive
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default WidgetCard;
