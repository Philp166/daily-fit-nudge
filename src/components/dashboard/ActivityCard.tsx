import React from 'react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import { Clock } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const ActivityCard: React.FC = () => {
  const { getTodaySessions } = useUser();
  const todaySessions = getTodaySessions();
  
  const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  const displayValue = hours > 0 
    ? `${hours}.${Math.round((minutes / 60) * 10)}`
    : minutes.toString();
  
  const displayUnit = hours > 0 ? 'ч' : 'мин';
  
  // Goal: 60 min per day
  const goalMinutes = 60;
  const percentage = Math.min(Math.round((totalMinutes / goalMinutes) * 100), 100);

  return (
    <WidgetCard gradient="activity" className="flex-1" delay={0.5}>
      <Badge className="mb-4">
        <Clock size={12} className="mr-1.5" />
        Активность
      </Badge>

      <div className="mb-2">
        <span className="text-display-sm text-extralight text-foreground">
          {displayValue}
        </span>
        <span className="text-title text-light text-foreground/80 ml-1">
          {displayUnit}
        </span>
      </div>

      <p className="text-caption text-muted-white">
        {percentage}% от нормы
      </p>
    </WidgetCard>
  );
};

export default ActivityCard;
