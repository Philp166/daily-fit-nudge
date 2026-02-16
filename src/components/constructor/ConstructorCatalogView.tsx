import React, { useState, useMemo } from 'react';
import { X, Plus } from 'lucide-react';
import type { Exercise } from '@/types/exercise';
import { MuscleGroup } from '@/types/exercise';
import { MUSCLE_GROUP_META } from '@/data/exercises';

const CATEGORY_CHIPS: { id: MuscleGroup | 'all'; label: string }[] = [
  { id: MuscleGroup.LEGS, label: 'Ноги' },
  { id: MuscleGroup.BACK, label: 'Спина' },
  { id: MuscleGroup.CHEST, label: 'Грудь' },
  { id: MuscleGroup.SHOULDERS, label: 'Плечи' },
  { id: MuscleGroup.BICEPS, label: 'Руки' },
  { id: MuscleGroup.TRICEPS, label: 'Трицепс' },
  { id: MuscleGroup.CORE, label: 'Пресс' },
  { id: MuscleGroup.CARDIO, label: 'Кардио' },
  { id: 'all', label: 'Все' },
];

interface ConstructorCatalogViewProps {
  exercises: Exercise[];
  onClose: () => void;
  onAddExercise?: (exercise: Exercise) => void;
}

const ConstructorCatalogView: React.FC<ConstructorCatalogViewProps> = ({
  exercises,
  onClose,
  onAddExercise,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MuscleGroup | 'all'>(
    MuscleGroup.LEGS
  );

  const displayList = useMemo(() => {
    if (selectedCategory === 'all') return exercises;
    return exercises.filter((ex) => ex.muscleGroup === selectedCategory);
  }, [exercises, selectedCategory]);

  return (
    <div className="exsizes bg-white min-h-screen min-w-[390px] w-full relative flex flex-col pt-safe-top">
      {/* Кнопка закрытия — по макету: top 70px, right */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-[70px] z-10 flex h-8 w-8 items-center justify-center rounded-2xl bg-[#f4f4f4] text-[#030032] active:opacity-80"
        aria-label="Закрыть"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>

      {/* Чипы категорий — по макету: top 118px, горизонтальный скролл */}
      <div className="flex gap-2 overflow-x-auto px-4 pt-[118px] pb-4 hide-scrollbar">
        {CATEGORY_CHIPS.map((chip) => {
          const isActive =
            chip.id === 'all'
              ? selectedCategory === 'all'
              : selectedCategory === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setSelectedCategory(chip.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-base font-medium transition-colors ${
                isActive
                  ? 'bg-[#fc7a18] text-white'
                  : 'bg-[#efefef] text-[#030032]'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Список упражнений — по макету: gap 8px, карточки 99px, rounded 32px */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-28">
        {displayList.length === 0 ? (
          <p className="py-8 text-center text-[#030032]/60">
            Нет упражнений в этой категории. Загрузите базу в каталог.
          </p>
        ) : (
          displayList.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center gap-2.5 rounded-[32px] bg-[#efefef] p-4 min-h-[99px]"
            >
              {/* Иконка — по макету: 67x67, белый круг */}
              <div className="flex h-[67px] w-[67px] shrink-0 items-center justify-center rounded-[33.5px] bg-white text-2xl">
                {exercise.emoji}
              </div>
              {/* Название и подпись */}
              <div className="min-w-0 flex-1 flex flex-col gap-2">
                <p className="truncate text-[24px] leading-6 text-[#030032] font-normal">
                  {exercise.name}
                </p>
                <p className="text-base leading-4 text-[#030032] opacity-60">
                  {exercise.muscleGroup
                    ? MUSCLE_GROUP_META[exercise.muscleGroup].name
                    : '—'}
                </p>
              </div>
              {/* Кнопка добавить — по макету: 36x36, #fc7a18, rounded 18px */}
              <button
                type="button"
                onClick={() => onAddExercise?.(exercise)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-[#fc7a18] text-white active:opacity-90"
                aria-label={`Добавить ${exercise.name}`}
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConstructorCatalogView;
