import React from 'react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import { ListVideo, Star } from 'lucide-react';
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
    <WidgetCard gradient="workouts" className="flex-1" delay={0.6} onClick={onOpenWorkouts}>
      <Badge className="mb-4">
        <ListVideo size={12} className="mr-1.5" />
        Тренировки
      </Badge>

      <div className="mb-2">
        <span className="text-display-sm text-extralight text-foreground">
          {totalWorkouts}
        </span>
      </div>

      <p className="text-caption text-muted-white">
        готовых программ
      </p>

      {favoriteWorkouts.length > 0 && (
        <div className="mt-2 flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-badge text-muted-white">{favoriteWorkouts.length} избранных</span>
        </div>
      )}
    </WidgetCard>
  );
};

export default WorkoutsCard;
