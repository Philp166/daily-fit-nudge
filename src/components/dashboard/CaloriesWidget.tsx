import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';

const CaloriesWidget: React.FC = () => {
  const { todayCalories, profile } = useUser();
  const [displayedCalories, setDisplayedCalories] = useState(0);
  const goal = profile?.dailyCalorieGoal || 500;
  const progress = Math.min((todayCalories / goal) * 100, 100);

  // Animated counter effect
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = todayCalories / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= todayCalories) {
        setDisplayedCalories(todayCalories);
        clearInterval(timer);
      } else {
        setDisplayedCalories(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [todayCalories]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="p-6 text-center mb-4"
    >
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Сожжено сегодня</p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-6xl font-extralight text-foreground mb-2"
      >
        {displayedCalories}
      </motion.div>

      <p className="text-sm text-muted-foreground mb-6 font-medium">
        Цель: {goal} ккал
      </p>

      {/* Progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 bg-primary rounded-full shadow-sm"
        />

        {/* Glowing dot at the end */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ left: `${progress}%` }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-sm"
        />
      </div>
    </motion.div>
  );
};

export default CaloriesWidget;
