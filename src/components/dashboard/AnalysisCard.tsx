import React from 'react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import CircularProgress from './CircularProgress';
import { TrendingUp } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const AnalysisCard: React.FC = () => {
  const { getWeekProgress } = useUser();
  const { current, goal } = getWeekProgress();
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <WidgetCard gradient="analysis" delay={0.7}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Badge className="mb-4">
            <TrendingUp size={12} className="mr-1.5" />
            Анализ недели
          </Badge>

          <div className="mt-6">
            <div className="text-title text-foreground mb-1">
              <span className="text-display-sm text-extralight">{current}</span>
              <span className="text-muted-white text-body"> / {goal}</span>
            </div>
            <p className="text-caption text-muted-white">
              ккал сожжено за неделю
            </p>
          </div>
        </div>

        <div className="ml-4">
          <CircularProgress value={percentage} size={90} delay={0.8} />
        </div>
      </div>
    </WidgetCard>
  );
};

export default AnalysisCard;
