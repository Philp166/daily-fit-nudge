import React from 'react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import { ChevronRight, Dumbbell } from 'lucide-react';

interface ConstructorCardProps {
  onOpenConstructor: () => void;
}

const ConstructorCard: React.FC<ConstructorCardProps> = ({
  onOpenConstructor,
}) => {
  return (
    <WidgetCard delay={0.4} onClick={onOpenConstructor}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shrink-0">
          <Dumbbell size={24} className="text-primary" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <Badge>Конструктор</Badge>
            <ChevronRight size={20} className="text-foreground/50" />
          </div>

          <h3 className="text-title text-foreground mb-1">Создай свою тренировку</h3>
          <p className="text-caption text-muted-white">
            Собери идеальную программу из 50+ упражнений
          </p>
        </div>
      </div>
    </WidgetCard>
  );
};

export default ConstructorCard;
