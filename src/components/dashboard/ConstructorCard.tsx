import React from 'react';
import { motion } from 'framer-motion';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import { Dumbbell, Clock, Flame, ChevronRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface ConstructorCardProps {
  onOpenConstructor: () => void;
  onRepeatWorkout: (workoutId: string) => void;
}

const ConstructorCard: React.FC<ConstructorCardProps> = ({
  onOpenConstructor,
  onRepeatWorkout,
}) => {
  const { customWorkouts } = useUser();
  
  const recentWorkouts = customWorkouts.slice(0, 3);
  const favorites = customWorkouts.filter(w => w.isFavorite);

  return (
    <WidgetCard gradient="constructor" delay={0.4} onClick={onOpenConstructor}>
      <div className="flex justify-between items-start mb-4">
        <Badge>
          <Dumbbell size={12} className="mr-1.5" />
          Конструктор
        </Badge>
        <ChevronRight size={20} className="text-foreground/50" />
      </div>

      <h3 className="text-title text-foreground mb-2">Создай свою тренировку</h3>
      <p className="text-caption text-secondary-white mb-4">
        Собери идеальную программу из 50+ упражнений
      </p>

      {recentWorkouts.length > 0 && (
        <div className="space-y-2">
          <p className="text-badge text-muted-white uppercase tracking-wide">Последние</p>
          <div className="flex gap-2 flex-wrap">
            {recentWorkouts.map((workout) => (
              <motion.button
                key={workout.id}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRepeatWorkout(workout.id);
                }}
                className="px-3 py-1.5 text-caption bg-foreground/10 rounded-full hover:bg-foreground/20 transition-colors"
              >
                {workout.name}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="mt-3 pt-3 border-t border-foreground/10">
          <p className="text-badge text-muted-white uppercase tracking-wide mb-2">
            ⭐ Избранное: {favorites.length}
          </p>
        </div>
      )}
    </WidgetCard>
  );
};

export default ConstructorCard;
