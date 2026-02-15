import type { Exercise, ExerciseFilters } from '@/types/exercise';
import { ActivityType, MuscleGroup, SportDiscipline } from '@/types/exercise';

// ============================================
// ИМПОРТЫ УПРАЖНЕНИЙ ПО КАТЕГОРИЯМ
// ============================================

// Спортзал
import { chestExercises } from './gym/chest';
import { backExercises } from './gym/back';
import { legsExercises } from './gym/legs';
import { shouldersExercises } from './gym/shoulders';
import { bicepsExercises } from './gym/biceps';
import { tricepsExercises } from './gym/triceps';
import { coreExercises } from './gym/core';
import { cardioExercises } from './gym/cardio';

// Единоборства
import { boxingExercises } from './combat/boxing';

// Легкая атлетика
import { sprintExercises } from './athletics/sprint';

// ============================================
// ОБЪЕДИНЕННАЯ БАЗА УПРАЖНЕНИЙ
// ============================================

/**
 * Полная база всех упражнений
 */
export const ALL_EXERCISES: Exercise[] = [
  // Спортзал
  ...chestExercises,
  ...backExercises,
  ...legsExercises,
  ...shouldersExercises,
  ...bicepsExercises,
  ...tricepsExercises,
  ...coreExercises,
  ...cardioExercises,

  // Единоборства
  ...boxingExercises,

  // Легкая атлетика
  ...sprintExercises,
];

// ============================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С УПРАЖНЕНИЯМИ
// ============================================

/**
 * Получить упражнение по ID
 */
export function getExerciseById(id: string): Exercise | undefined {
  return ALL_EXERCISES.find((ex) => ex.id === id);
}

/**
 * Фильтрация упражнений
 */
export function filterExercises(filters: ExerciseFilters): Exercise[] {
  return ALL_EXERCISES.filter((exercise) => {
    // Фильтр по типу активности
    if (filters.activityType && exercise.activityType !== filters.activityType) {
      return false;
    }

    // Фильтр по группе мышц
    if (filters.muscleGroup && exercise.muscleGroup !== filters.muscleGroup) {
      return false;
    }

    // Фильтр по дисциплине
    if (filters.discipline && exercise.discipline !== filters.discipline) {
      return false;
    }

    // Фильтр по сложности
    if (filters.difficulty && exercise.difficulty !== filters.difficulty) {
      return false;
    }

    // Фильтр по оборудованию
    if (filters.equipment && exercise.equipment !== filters.equipment) {
      return false;
    }

    // Поиск по названию
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const nameMatch = exercise.name.toLowerCase().includes(query);
      const nameEnMatch = exercise.nameEn?.toLowerCase().includes(query);
      const tagsMatch = exercise.tags?.some((tag) => tag.toLowerCase().includes(query));

      if (!nameMatch && !nameEnMatch && !tagsMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Получить упражнения по типу активности
 */
export function getExercisesByActivity(activityType: ActivityType): Exercise[] {
  return filterExercises({ activityType });
}

/**
 * Получить упражнения по группе мышц
 */
export function getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Exercise[] {
  return filterExercises({ muscleGroup });
}

/**
 * Получить упражнения по дисциплине
 */
export function getExercisesByDiscipline(discipline: SportDiscipline): Exercise[] {
  return filterExercises({ discipline });
}

/**
 * Поиск упражнений
 */
export function searchExercises(query: string): Exercise[] {
  return filterExercises({ searchQuery: query });
}

// ============================================
// КОНСТАНТЫ ДЛЯ UI
// ============================================

/**
 * Метаданные для типов активности (для UI)
 */
export const ACTIVITY_TYPE_META: Record<
  ActivityType,
  { name: string; nameEn: string; emoji: string; color: string }
> = {
  [ActivityType.GYM]: {
    name: 'Спортзал',
    nameEn: 'Gym',
    emoji: '🏋️',
    color: '#F5941D',
  },
  [ActivityType.COMBAT]: {
    name: 'Единоборства',
    nameEn: 'Combat',
    emoji: '🥊',
    color: '#E74C3C',
  },
  [ActivityType.ATHLETICS]: {
    name: 'Легкая атлетика',
    nameEn: 'Athletics',
    emoji: '🏃',
    color: '#3498DB',
  },
  [ActivityType.AQUATIC]: {
    name: 'Водные виды',
    nameEn: 'Aquatic',
    emoji: '🏊',
    color: '#1ABC9C',
  },
  [ActivityType.CYCLING]: {
    name: 'Велоспорт',
    nameEn: 'Cycling',
    emoji: '🚴',
    color: '#9B59B6',
  },
  [ActivityType.ROWING]: {
    name: 'Гребля',
    nameEn: 'Rowing',
    emoji: '🚣',
    color: '#34495E',
  },
  [ActivityType.GYMNASTICS]: {
    name: 'Гимнастика',
    nameEn: 'Gymnastics',
    emoji: '🤸',
    color: '#E67E22',
  },
  [ActivityType.TEAM_SPORTS]: {
    name: 'Командные игры',
    nameEn: 'Team Sports',
    emoji: '⚽',
    color: '#27AE60',
  },
  [ActivityType.TRIATHLON]: {
    name: 'Триатлон',
    nameEn: 'Triathlon',
    emoji: '🏊‍♂️',
    color: '#16A085',
  },
  [ActivityType.FUNCTIONAL]: {
    name: 'Функциональный',
    nameEn: 'Functional',
    emoji: '🔥',
    color: '#FF5722',
  },
};

/**
 * Метаданные для групп мышц (для UI)
 */
export const MUSCLE_GROUP_META: Record<
  MuscleGroup,
  { name: string; nameEn: string; emoji: string; color: string }
> = {
  [MuscleGroup.CHEST]: {
    name: 'Грудь',
    nameEn: 'Chest',
    emoji: '💪',
    color: '#F5941D',
  },
  [MuscleGroup.BACK]: {
    name: 'Спина',
    nameEn: 'Back',
    emoji: '🦾',
    color: '#4A9EFF',
  },
  [MuscleGroup.LEGS]: {
    name: 'Ноги',
    nameEn: 'Legs',
    emoji: '🦵',
    color: '#4ECDC4',
  },
  [MuscleGroup.SHOULDERS]: {
    name: 'Плечи',
    nameEn: 'Shoulders',
    emoji: '🏋️',
    color: '#9B59B6',
  },
  [MuscleGroup.BICEPS]: {
    name: 'Бицепс',
    nameEn: 'Biceps',
    emoji: '💪',
    color: '#E74C3C',
  },
  [MuscleGroup.TRICEPS]: {
    name: 'Трицепс',
    nameEn: 'Triceps',
    emoji: '💪',
    color: '#E74C3C',
  },
  [MuscleGroup.CORE]: {
    name: 'Пресс',
    nameEn: 'Core',
    emoji: '🧘',
    color: '#F39C12',
  },
  [MuscleGroup.CARDIO]: {
    name: 'Кардио',
    nameEn: 'Cardio',
    emoji: '🏃',
    color: '#2ECC71',
  },
  [MuscleGroup.FULL_BODY]: {
    name: 'Все тело',
    nameEn: 'Full Body',
    emoji: '🔥',
    color: '#FF5722',
  },
};

/**
 * Получить количество упражнений по категориям
 */
export function getExerciseStats() {
  const stats = {
    total: ALL_EXERCISES.length,
    byActivityType: {} as Record<ActivityType, number>,
    byMuscleGroup: {} as Record<MuscleGroup, number>,
    byDiscipline: {} as Record<SportDiscipline, number>,
  };

  ALL_EXERCISES.forEach((exercise) => {
    // По типу активности
    stats.byActivityType[exercise.activityType] =
      (stats.byActivityType[exercise.activityType] || 0) + 1;

    // По группе мышц
    if (exercise.muscleGroup) {
      stats.byMuscleGroup[exercise.muscleGroup] =
        (stats.byMuscleGroup[exercise.muscleGroup] || 0) + 1;
    }

    // По дисциплине
    if (exercise.discipline) {
      stats.byDiscipline[exercise.discipline] =
        (stats.byDiscipline[exercise.discipline] || 0) + 1;
    }
  });

  return stats;
}
