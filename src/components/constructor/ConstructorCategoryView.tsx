import React from 'react';
import { X } from 'lucide-react';
import { ActivityType } from '@/types/exercise';
import { ACTIVITY_TYPE_DISPLAY } from '@/data/exercises';
import gymIcon from '@/assets/constructor-categories/gym.png';
import fightIcon from '@/assets/constructor-categories/fight.png';
import legatlIcon from '@/assets/constructor-categories/legatl.png';
import swimIcon from '@/assets/constructor-categories/swim.png';
import bikeIcon from '@/assets/constructor-categories/bike.png';
import grebIcon from '@/assets/constructor-categories/greb.png';
import functionalIcon from '@/assets/constructor-categories/functional.png';

// Маппинг иконок
const ICON_MAP: Record<ActivityType, string> = {
  [ActivityType.GYM]: gymIcon,
  [ActivityType.COMBAT]: fightIcon,
  [ActivityType.ATHLETICS]: legatlIcon,
  [ActivityType.AQUATIC]: swimIcon,
  [ActivityType.CYCLING]: bikeIcon,
  [ActivityType.ROWING]: grebIcon,
  [ActivityType.FUNCTIONAL]: functionalIcon,
  [ActivityType.GYMNASTICS]: functionalIcon,
  [ActivityType.TEAM_SPORTS]: functionalIcon,
  [ActivityType.TRIATHLON]: functionalIcon,
};

// Порядок отображения категорий
const CATEGORY_ORDER: ActivityType[] = [
  ActivityType.GYM,
  ActivityType.COMBAT,
  ActivityType.ATHLETICS,
  ActivityType.AQUATIC,
  ActivityType.CYCLING,
  ActivityType.ROWING,
  ActivityType.FUNCTIONAL,
];

interface ConstructorCategoryViewProps {
  onSelectType: (type: ActivityType) => void;
  onClose: () => void;
}

const ConstructorCategoryView: React.FC<ConstructorCategoryViewProps> = ({
  onSelectType,
  onClose,
}) => {
  return (
    <div className="bg-white min-h-screen min-w-[390px] w-full flex flex-col pt-safe-top">
      {/* Шапка: название слева, закрыть справа */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2 shrink-0">
        <h1 className="text-xl font-semibold text-[#030032]">
          Тип тренировки
        </h1>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[#f4f4f4] text-[#030032] active:opacity-80"
          aria-label="Закрыть"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      {/* Список карточек категорий */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-28">
        <div className="flex flex-col gap-4">
          {CATEGORY_ORDER.map((type) => {
            const meta = ACTIVITY_TYPE_DISPLAY[type];
            const iconSrc = ICON_MAP[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => onSelectType(type)}
                className="relative flex items-center flex-1 min-h-[186px] rounded-[32px] overflow-hidden active:opacity-90 transition-opacity w-full"
                style={{
                  backgroundColor: meta.color,
                }}
              >
                {/* Текст слева - четкий отступ 24px */}
                <div className="flex-1 min-w-0 pl-6 flex items-center">
                  <h2 className="text-[32px] font-bold text-white leading-tight" style={{ fontFamily: 'Ubuntu, sans-serif' }}>
                    {meta.name}
                  </h2>
                </div>

                {/* Иконка справа - фиксированная колонка для визуального выравнивания */}
                <div className="w-[150px] shrink-0 pr-2 flex items-center justify-end">
                  <div className="h-[125px] w-[140px] flex items-center justify-center">
                    <img
                      src={iconSrc}
                      alt={meta.name}
                      className="max-h-full max-w-full object-contain object-right"
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConstructorCategoryView;
