import React from 'react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
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
    <WidgetCard className="flex-1" delay={0.6} onClick={onOpenWorkouts}>
      <Badge className="mb-4">Тренировки</Badge>

      <div className="mb-2">
        <span className="text-display-sm text-extralight text-foreground">
          {totalWorkouts}
        </span>
      </div>

      <p className="text-caption text-muted-white">
        готовых программ
      </p>

      {favoriteWorkouts.length > 0 && (
        <p className="mt-2 text-badge text-muted-white">
          {favoriteWorkouts.length} избранных
        </p>
      )}
    </WidgetCard>
  );
};

export default WorkoutsCard;
