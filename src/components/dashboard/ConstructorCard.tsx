import React from 'react';
import { motion } from 'framer-motion';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import { Dumbbell, Clock, Star, ChevronRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface ConstructorCardProps {
  onOpenConstructor: () => void;
  onRepeatWorkout: (workoutId: string) => void;
}

const ConstructorCard: React.FC<ConstructorCardProps> = ({
  onOpenConstructor,
  onRepeatWorkout,
}) => {
  const { customWorkouts, toggleFavorite } = useUser();
  
  // Get last 3 workouts
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
                className="px-3 py-2 text-caption glass rounded-2xl hover:bg-foreground/20 transition-colors flex items-center gap-2"
              >
                {workout.isFavorite && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                {workout.name}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="mt-3 pt-3 border-t border-foreground/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg glass flex items-center justify-center">
              <Star size={12} className="text-yellow-400" />
            </div>
            <p className="text-badge text-muted-white">
              Избранное: {favorites.length}
            </p>
          </div>
        </div>
      )}
    </WidgetCard>
  );
};

export default ConstructorCard;
