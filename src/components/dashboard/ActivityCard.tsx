import React from 'react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import CircularProgress from './CircularProgress';
import { useUser } from '@/contexts/UserContext';

const ActivityCard: React.FC = () => {
  const { getTodaySessions } = useUser();
  const todaySessions = getTodaySessions();
  
  const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  
  // Goal: 60 min per day
  const goalMinutes = 60;
  const percentage = Math.min(Math.round((totalMinutes / goalMinutes) * 100), 100);

  return (
    <WidgetCard gradient="activity" className="flex-1" delay={0.5}>
      <Badge className="mb-3">Активность</Badge>

      <div className="flex items-center justify-between">
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
        
        <CircularProgress 
          value={percentage} 
          size={56} 
          strokeWidth={5} 
          showValue={false}
          delay={0.6} 
        />
      </div>
    </WidgetCard>
  );
};

export default ActivityCard;
