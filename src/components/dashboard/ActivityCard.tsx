import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';

const ActivityCard: React.FC = () => {
  const { getTodaySessions } = useUser();
  const todaySessions = getTodaySessions();

  // Calculate actual work time in minutes (from actualWorkTime in seconds)
  const totalMinutes = Math.round(todaySessions.reduce((sum, s) => sum + (s.actualWorkTime || 0), 0) / 60);
  const goalMinutes = 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
      className="flex-1 bg-white rounded-3xl p-5 border border-border shadow-sm flex flex-col"
    >
      <div className="inline-block px-3 py-1 bg-muted rounded-full mb-4 self-start">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Активность</span>
      </div>

      <div className="mt-auto">
        <div className="mb-1">
          <span className="text-5xl font-extralight text-foreground">
            {totalMinutes}
          </span>
          <span className="text-lg text-muted-foreground ml-2 font-medium">мин</span>
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          из {goalMinutes} мин
        </p>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
