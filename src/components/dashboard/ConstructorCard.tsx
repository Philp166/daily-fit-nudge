import React from 'react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import { ChevronRight } from 'lucide-react';

interface ConstructorCardProps {
  onOpenConstructor: () => void;
}

const ConstructorCard: React.FC<ConstructorCardProps> = ({
  onOpenConstructor,
}) => {
  return (
    <WidgetCard gradient="constructor" delay={0.4} onClick={onOpenConstructor}>
      <div className="flex justify-between items-start mb-4">
        <Badge>Конструктор</Badge>
        <ChevronRight size={20} className="text-foreground/50" />
      </div>

      <h3 className="text-title text-foreground mb-2">Создай свою тренировку</h3>
      <p className="text-caption text-secondary-white">
        Собери идеальную программу из 50+ упражнений
      </p>
    </WidgetCard>
  );
};

export default ConstructorCard;
