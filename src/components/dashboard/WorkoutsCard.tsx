import React from 'react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import { ListVideo } from 'lucide-react';
import { presetWorkouts } from '@/data/workouts';

interface WorkoutsCardProps {
  onOpenWorkouts: () => void;
}

const WorkoutsCard: React.FC<WorkoutsCardProps> = ({ onOpenWorkouts }) => {
  const totalWorkouts = presetWorkouts.length;

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
    </WidgetCard>
  );
};

export default WorkoutsCard;
