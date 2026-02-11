import React from 'react';
import { motion } from 'framer-motion';
import { presetWorkouts } from '@/data/workouts';
import { useUser } from '@/contexts/UserContext';

interface WorkoutsCardProps {
  onOpenWorkouts: () => void;
}

const WorkoutsCard: React.FC<WorkoutsCardProps> = ({ onOpenWorkouts }) => {
  const { customWorkouts } = useUser();
  const favoriteWorkouts = customWorkouts.filter(w => w.isFavorite);
  const totalWorkouts = presetWorkouts.length + favoriteWorkouts.length;

  return (
    <button
      type="button"
      onClick={onOpenWorkouts}
      className="flex-1 text-left active:scale-[0.98] transition-transform"
      style={{ touchAction: 'manipulation' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
        className="bg-white rounded-3xl p-5 border border-border shadow-sm flex flex-col h-full"
      >
        <div className="inline-block px-3 py-1 bg-muted rounded-full mb-4 self-start">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Тренировки</span>
        </div>

        <div className="mt-auto">
          <div className="mb-2">
            <span className="text-5xl font-extralight text-foreground">
              {totalWorkouts}
            </span>
          </div>

          <p className="text-sm text-muted-foreground font-medium">
            готовых программ
          </p>

          {favoriteWorkouts.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground font-medium">
              {favoriteWorkouts.length} избранных
            </p>
          )}
        </div>
      </motion.div>
    </button>
  );
};

export default WorkoutsCard;
