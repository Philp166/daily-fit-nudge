import React, { useState, useMemo } from 'react';
import { X, Plus, Search, ArrowLeft } from 'lucide-react';
import type { Exercise } from '@/types/exercise';
import { MuscleGroup, ActivityType } from '@/types/exercise';
import { MUSCLE_GROUP_META } from '@/data/exercises';

const ALL_CHIP_EMOJI = '✨';

function getCategoryChips(): { id: MuscleGroup | 'all'; label: string; emoji: string }[] {
  const groups = (Object.keys(MUSCLE_GROUP_META) as MuscleGroup[]).map((id) => ({
    id,
    label: MUSCLE_GROUP_META[id].name,
    emoji: MUSCLE_GROUP_META[id].emoji,
  }));
  groups.sort((a, b) => a.label.localeCompare(b.label, 'ru'));
  return [{ id: 'all', label: 'Все', emoji: ALL_CHIP_EMOJI }, ...groups];
}

interface ConstructorCatalogViewProps {
  exercises: Exercise[];
  onClose: () => void;
  onAddExercise?: (exercise: Exercise) => void;
  initialActivityType?: ActivityType;
  onBack?: () => void;
}

const ConstructorCatalogView: React.FC<ConstructorCatalogViewProps> = ({
  exercises,
  onClose,
  onAddExercise,
  initialActivityType,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MuscleGroup | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Для спортзала показываем чипы по группам мышц, для остальных - только "Все"
  const showMuscleGroupChips = initialActivityType === ActivityType.GYM;
  const categoryChips = useMemo(() => {
    if (!showMuscleGroupChips) {
      return [{ id: 'all' as const, label: 'Все', emoji: ALL_CHIP_EMOJI }];
    }
    return getCategoryChips();
  }, [showMuscleGroupChips]);

  const displayList = useMemo(() => {
    let list = selectedCategory === 'all' ? exercises : exercises.filter((ex) => ex.muscleGroup === selectedCategory);
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (ex) =>
          ex.name.toLowerCase().includes(q) ||
          (ex.nameEn?.toLowerCase().includes(q) ?? false) ||
          (ex.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
      );
    }
    return list;
  }, [exercises, selectedCategory, searchQuery]);

  return (
    <div className="exsizes bg-white min-h-screen min-w-[390px] w-full relative flex flex-col pt-safe-top">
      {/* Шапка: назад (если есть), название слева, закрыть справа */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[#f4f4f4] text-[#030032] active:opacity-80"
              aria-label="Назад к типам"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
          <h1 className="text-xl font-semibold text-[#030032] truncate">
            Собери свою тренировку
          </h1>
        </div>
        {!onBack && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[#f4f4f4] text-[#030032] active:opacity-80 ml-2"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Чипы категорий: «Все» первый, остальные по алфавиту из MUSCLE_GROUP_META */}
      <div className="flex gap-2 overflow-x-auto px-4 pt-2 pb-4 hide-scrollbar">
        {categoryChips.map((chip) => {
          const isActive =
            chip.id === 'all'
              ? selectedCategory === 'all'
              : selectedCategory === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setSelectedCategory(chip.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full pl-2 pr-4 py-2 text-base font-medium transition-colors ${
                isActive
                  ? 'bg-[#006776] text-white'
                  : 'bg-[#efefef] text-[#030032]'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg ${
                  isActive ? 'bg-white/25' : 'bg-white'
                }`}
                aria-hidden
              >
                {chip.emoji}
              </span>
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Поиск */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-2xl bg-[#efefef] px-4 py-2.5">
          <Search className="h-5 w-5 shrink-0 text-[#030032]/50" strokeWidth={1.8} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск упражнений..."
            className="min-w-0 flex-1 bg-transparent text-[#030032] placeholder:text-[#030032]/50 text-base outline-none"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Список упражнений — стили как на главном экране */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pt-6 pb-28">
        {displayList.length === 0 ? (
          <p className="py-8 text-center text-[#030032]/60">
            {searchQuery.trim() ? 'Ничего не найдено' : 'Нет упражнений в этой категории. Загрузите базу в каталог.'}
          </p>
        ) : (
          displayList.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center gap-2.5 rounded-3xl bg-[#efefef] p-4 min-h-[99px]"
            >
              {/* Иконка — 67x67, белый фон, emoji чуть крупнее */}
              <div className="flex h-[67px] w-[67px] shrink-0 items-center justify-center rounded-[33.5px] bg-white text-[28px] leading-none">
                {exercise.emoji}
              </div>
              {/* Название и подпись — шрифт названия меньше */}
              <div className="min-w-0 flex-1 flex flex-col gap-2">
                <p className="truncate text-base leading-5 text-[#030032] font-normal">
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
