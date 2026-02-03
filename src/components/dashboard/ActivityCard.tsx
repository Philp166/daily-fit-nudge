import React from 'react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import { useUser } from '@/contexts/UserContext';

const ActivityCard: React.FC = () => {
  const { getTodaySessions } = useUser();
  const todaySessions = getTodaySessions();
  
  const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const goalMinutes = 60;

  return (
    <WidgetCard gradient="activity" className="flex-1" delay={0.5}>
      <Badge className="mb-3">Активность</Badge>

      <div>
        <div className="mb-1">
          <span className="text-display-sm text-extralight text-foreground">
            {totalMinutes}
          </span>
          <span className="text-body text-foreground/80 ml-1">мин</span>
        </div>
        <p className="text-caption text-muted-white">
          из {goalMinutes} мин
        </p>
      </div>
    </WidgetCard>
  );
};

export default ActivityCard;
