import React from 'react';
import { motion } from 'framer-motion';

interface WidgetCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  children,
  className = '',
  onClick,
  delay = 0,
}) => {
  // Use a wrapper button for better mobile touch handling
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`glass rounded-3xl p-5 ${className}`}
    >
      {children}
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left active:scale-[0.98] transition-transform"
        style={{ touchAction: 'manipulation' }}
      >
        {content}
      </button>
    );
  }

  return content;
};

export default WidgetCard;
