import { Dumbbell, Activity, Heart, Zap, Target, Flame } from 'lucide-react';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  met: number; // Metabolic Equivalent of Task
  iconType: 'dumbbell' | 'activity' | 'heart' | 'zap' | 'target' | 'flame';
  description?: string;
}

export const exerciseCategories = [
  'Кардио',
  'Силовые',
  'Растяжка',
  'Йога',
  'HIIT',
  'Пресс',
  'Ноги',
  'Руки',
  'Спина',
  'Грудь',
] as const;

export type ExerciseCategory = typeof exerciseCategories[number];

export const exercises: Exercise[] = [
  // Кардио
  { id: 'running', name: 'Бег на месте', category: 'Кардио', met: 8.0, iconType: 'activity' },
  { id: 'jumping-jacks', name: 'Прыжки с разведением', category: 'Кардио', met: 8.0, iconType: 'zap' },
  { id: 'high-knees', name: 'Высокие колени', category: 'Кардио', met: 8.0, iconType: 'activity' },
  { id: 'burpees', name: 'Бёрпи', category: 'Кардио', met: 10.0, iconType: 'flame' },
  { id: 'mountain-climbers', name: 'Альпинист', category: 'Кардио', met: 8.0, iconType: 'activity' },
  { id: 'jump-rope', name: 'Скакалка', category: 'Кардио', met: 11.0, iconType: 'zap' },
  { id: 'box-jumps', name: 'Прыжки на тумбу', category: 'Кардио', met: 8.0, iconType: 'zap' },

  // Силовые
  { id: 'push-ups', name: 'Отжимания', category: 'Силовые', met: 8.0, iconType: 'dumbbell' },
  { id: 'squats', name: 'Приседания', category: 'Силовые', met: 5.0, iconType: 'dumbbell' },
  { id: 'lunges', name: 'Выпады', category: 'Силовые', met: 5.0, iconType: 'dumbbell' },
  { id: 'deadlift', name: 'Становая тяга', category: 'Силовые', met: 6.0, iconType: 'dumbbell' },
  { id: 'shoulder-press', name: 'Жим плечами', category: 'Силовые', met: 5.0, iconType: 'dumbbell' },
  { id: 'bicep-curls', name: 'Сгибания на бицепс', category: 'Силовые', met: 4.0, iconType: 'dumbbell' },
  { id: 'tricep-dips', name: 'Отжимания на трицепс', category: 'Силовые', met: 5.0, iconType: 'dumbbell' },

  // Пресс
  { id: 'crunches', name: 'Скручивания', category: 'Пресс', met: 3.8, iconType: 'target' },
  { id: 'plank', name: 'Планка', category: 'Пресс', met: 4.0, iconType: 'target' },
  { id: 'leg-raises', name: 'Подъём ног', category: 'Пресс', met: 3.5, iconType: 'target' },
  { id: 'russian-twist', name: 'Русский твист', category: 'Пресс', met: 4.0, iconType: 'target' },
  { id: 'bicycle-crunches', name: 'Велосипед', category: 'Пресс', met: 4.5, iconType: 'target' },
  { id: 'side-plank', name: 'Боковая планка', category: 'Пресс', met: 4.0, iconType: 'target' },
  { id: 'flutter-kicks', name: 'Ножницы', category: 'Пресс', met: 4.0, iconType: 'target' },

  // Ноги
  { id: 'wall-sit', name: 'Стульчик у стены', category: 'Ноги', met: 3.5, iconType: 'dumbbell' },
  { id: 'calf-raises', name: 'Подъём на носки', category: 'Ноги', met: 2.8, iconType: 'dumbbell' },
  { id: 'sumo-squats', name: 'Сумо приседания', category: 'Ноги', met: 5.5, iconType: 'dumbbell' },
  { id: 'glute-bridge', name: 'Ягодичный мост', category: 'Ноги', met: 4.0, iconType: 'dumbbell' },
  { id: 'step-ups', name: 'Шаги на платформу', category: 'Ноги', met: 6.0, iconType: 'activity' },

  // Руки
  { id: 'diamond-push-ups', name: 'Алмазные отжимания', category: 'Руки', met: 8.0, iconType: 'dumbbell' },
  { id: 'arm-circles', name: 'Круги руками', category: 'Руки', met: 3.0, iconType: 'activity' },
  { id: 'pike-push-ups', name: 'Пайк отжимания', category: 'Руки', met: 6.0, iconType: 'dumbbell' },

  // Спина
  { id: 'superman', name: 'Супермен', category: 'Спина', met: 3.5, iconType: 'zap' },
  { id: 'reverse-snow-angels', name: 'Обратные ангелы', category: 'Спина', met: 3.0, iconType: 'heart' },
  { id: 'back-extensions', name: 'Гиперэкстензия', category: 'Спина', met: 4.0, iconType: 'dumbbell' },

  // Грудь
  { id: 'wide-push-ups', name: 'Широкие отжимания', category: 'Грудь', met: 7.5, iconType: 'dumbbell' },
  { id: 'chest-dips', name: 'Отжимания на брусьях', category: 'Грудь', met: 8.0, iconType: 'dumbbell' },
  { id: 'incline-push-ups', name: 'Наклонные отжимания', category: 'Грудь', met: 6.0, iconType: 'dumbbell' },

  // Растяжка
  { id: 'forward-fold', name: 'Наклон вперёд', category: 'Растяжка', met: 2.5, iconType: 'heart' },
  { id: 'quad-stretch', name: 'Растяжка квадрицепса', category: 'Растяжка', met: 2.3, iconType: 'heart' },
  { id: 'hamstring-stretch', name: 'Растяжка бицепса бедра', category: 'Растяжка', met: 2.3, iconType: 'heart' },
  { id: 'shoulder-stretch', name: 'Растяжка плеч', category: 'Растяжка', met: 2.0, iconType: 'heart' },
  { id: 'hip-flexor', name: 'Растяжка бёдер', category: 'Растяжка', met: 2.5, iconType: 'heart' },

  // Йога
  { id: 'downward-dog', name: 'Собака мордой вниз', category: 'Йога', met: 3.0, iconType: 'heart' },
  { id: 'warrior-pose', name: 'Поза воина', category: 'Йога', met: 3.0, iconType: 'target' },
  { id: 'tree-pose', name: 'Поза дерева', category: 'Йога', met: 2.5, iconType: 'heart' },
  { id: 'cobra', name: 'Кобра', category: 'Йога', met: 2.5, iconType: 'heart' },
  { id: 'childs-pose', name: 'Поза ребёнка', category: 'Йога', met: 2.0, iconType: 'heart' },

  // HIIT
  { id: 'squat-jumps', name: 'Приседания с прыжком', category: 'HIIT', met: 9.0, iconType: 'flame' },
  { id: 'lunge-jumps', name: 'Выпады с прыжком', category: 'HIIT', met: 9.0, iconType: 'flame' },
  { id: 'tuck-jumps', name: 'Группировки', category: 'HIIT', met: 10.0, iconType: 'flame' },
  { id: 'skaters', name: 'Конькобежец', category: 'HIIT', met: 8.0, iconType: 'zap' },
  { id: 'sprint-in-place', name: 'Спринт на месте', category: 'HIIT', met: 11.0, iconType: 'flame' },
];

export const getExercisesByCategory = (category: string): Exercise[] => {
  return exercises.filter(ex => ex.category === category);
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(ex => ex.id === id);
};

// Calculate calories burned
// Formula: Calories = MET × weight(kg) × time(hours)
export const calculateCalories = (met: number, weightKg: number, durationMinutes: number): number => {
  const durationHours = durationMinutes / 60;
  return met * weightKg * durationHours;
};

// Get icon component based on iconType
export const getExerciseIconComponent = (iconType: Exercise['iconType']) => {
  const iconMap = {
    dumbbell: Dumbbell,
    activity: Activity,
    heart: Heart,
    zap: Zap,
    target: Target,
    flame: Flame,
  };
  return iconMap[iconType];
};
