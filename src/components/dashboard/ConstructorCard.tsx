import React from 'react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import { ChevronRight } from 'lucide-react';
import DumbbellIcon from '@/components/ui/DumbbellIcon';

interface ConstructorCardProps {
  onOpenConstructor: () => void;
}

const ConstructorCard: React.FC<ConstructorCardProps> = ({
  onOpenConstructor,
}) => {
  return (
    <WidgetCard delay={0.4} onClick={onOpenConstructor}>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 -m-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <DumbbellIcon size={28} />
          </div>

          <div className="flex-1">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full mb-3">
              <span className="text-xs font-semibold text-white uppercase tracking-wide">Конструктор</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Создай свою тренировку</h3>
            <p className="text-sm text-white/90">
              Собери идеальную программу из 50+ упражнений
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenConstructor(); }}
          className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-full font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          style={{ touchAction: 'manipulation' }}
        >
          Начать
          <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    </WidgetCard>
  );
};

export default ConstructorCard;
