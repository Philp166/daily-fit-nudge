export interface Exercise {
  id: string;
  name: string;
  category: string;
  met: number; // Metabolic Equivalent of Task
  icon: string;
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
  { id: 'running', name: 'Бег на месте', category: 'Кардио', met: 8.0, icon: '🏃' },
  { id: 'jumping-jacks', name: 'Прыжки с разведением', category: 'Кардио', met: 8.0, icon: '⭐' },
  { id: 'high-knees', name: 'Высокие колени', category: 'Кардио', met: 8.0, icon: '🦵' },
  { id: 'burpees', name: 'Бёрпи', category: 'Кардио', met: 10.0, icon: '💪' },
  { id: 'mountain-climbers', name: 'Альпинист', category: 'Кардио', met: 8.0, icon: '🏔️' },
  { id: 'jump-rope', name: 'Скакалка', category: 'Кардио', met: 11.0, icon: '🪢' },
  { id: 'box-jumps', name: 'Прыжки на тумбу', category: 'Кардио', met: 8.0, icon: '📦' },

  // Силовые
  { id: 'push-ups', name: 'Отжимания', category: 'Силовые', met: 8.0, icon: '💪' },
  { id: 'squats', name: 'Приседания', category: 'Силовые', met: 5.0, icon: '🏋️' },
  { id: 'lunges', name: 'Выпады', category: 'Силовые', met: 5.0, icon: '🦿' },
  { id: 'deadlift', name: 'Становая тяга', category: 'Силовые', met: 6.0, icon: '🏋️' },
  { id: 'shoulder-press', name: 'Жим плечами', category: 'Силовые', met: 5.0, icon: '💪' },
  { id: 'bicep-curls', name: 'Сгибания на бицепс', category: 'Силовые', met: 4.0, icon: '💪' },
  { id: 'tricep-dips', name: 'Отжимания на трицепс', category: 'Силовые', met: 5.0, icon: '💪' },

  // Пресс
  { id: 'crunches', name: 'Скручивания', category: 'Пресс', met: 3.8, icon: '🎯' },
  { id: 'plank', name: 'Планка', category: 'Пресс', met: 4.0, icon: '🧘' },
  { id: 'leg-raises', name: 'Подъём ног', category: 'Пресс', met: 3.5, icon: '🦵' },
  { id: 'russian-twist', name: 'Русский твист', category: 'Пресс', met: 4.0, icon: '🔄' },
  { id: 'bicycle-crunches', name: 'Велосипед', category: 'Пресс', met: 4.5, icon: '🚴' },
  { id: 'side-plank', name: 'Боковая планка', category: 'Пресс', met: 4.0, icon: '🧘' },
  { id: 'flutter-kicks', name: 'Ножницы', category: 'Пресс', met: 4.0, icon: '✂️' },

  // Ноги
  { id: 'wall-sit', name: 'Стульчик у стены', category: 'Ноги', met: 3.5, icon: '🪑' },
  { id: 'calf-raises', name: 'Подъём на носки', category: 'Ноги', met: 2.8, icon: '🦶' },
  { id: 'sumo-squats', name: 'Сумо приседания', category: 'Ноги', met: 5.5, icon: '🏋️' },
  { id: 'glute-bridge', name: 'Ягодичный мост', category: 'Ноги', met: 4.0, icon: '🍑' },
  { id: 'step-ups', name: 'Шаги на платформу', category: 'Ноги', met: 6.0, icon: '🪜' },

  // Руки
  { id: 'diamond-push-ups', name: 'Алмазные отжимания', category: 'Руки', met: 8.0, icon: '💎' },
  { id: 'arm-circles', name: 'Круги руками', category: 'Руки', met: 3.0, icon: '🔄' },
  { id: 'pike-push-ups', name: 'Пайк отжимания', category: 'Руки', met: 6.0, icon: '🔺' },

  // Спина
  { id: 'superman', name: 'Супермен', category: 'Спина', met: 3.5, icon: '🦸' },
  { id: 'reverse-snow-angels', name: 'Обратные ангелы', category: 'Спина', met: 3.0, icon: '👼' },
  { id: 'back-extensions', name: 'Гиперэкстензия', category: 'Спина', met: 4.0, icon: '🔙' },

  // Грудь
  { id: 'wide-push-ups', name: 'Широкие отжимания', category: 'Грудь', met: 7.5, icon: '💪' },
  { id: 'chest-dips', name: 'Отжимания на брусьях', category: 'Грудь', met: 8.0, icon: '💪' },
  { id: 'incline-push-ups', name: 'Наклонные отжимания', category: 'Грудь', met: 6.0, icon: '📐' },

  // Растяжка
  { id: 'forward-fold', name: 'Наклон вперёд', category: 'Растяжка', met: 2.5, icon: '🙇' },
  { id: 'quad-stretch', name: 'Растяжка квадрицепса', category: 'Растяжка', met: 2.3, icon: '🦵' },
  { id: 'hamstring-stretch', name: 'Растяжка бицепса бедра', category: 'Растяжка', met: 2.3, icon: '🦿' },
  { id: 'shoulder-stretch', name: 'Растяжка плеч', category: 'Растяжка', met: 2.0, icon: '💪' },
  { id: 'hip-flexor', name: 'Растяжка бёдер', category: 'Растяжка', met: 2.5, icon: '🧘' },

  // Йога
  { id: 'downward-dog', name: 'Собака мордой вниз', category: 'Йога', met: 3.0, icon: '🐕' },
  { id: 'warrior-pose', name: 'Поза воина', category: 'Йога', met: 3.0, icon: '⚔️' },
  { id: 'tree-pose', name: 'Поза дерева', category: 'Йога', met: 2.5, icon: '🌳' },
  { id: 'cobra', name: 'Кобра', category: 'Йога', met: 2.5, icon: '🐍' },
  { id: 'childs-pose', name: 'Поза ребёнка', category: 'Йога', met: 2.0, icon: '👶' },

  // HIIT
  { id: 'squat-jumps', name: 'Приседания с прыжком', category: 'HIIT', met: 9.0, icon: '🦘' },
  { id: 'lunge-jumps', name: 'Выпады с прыжком', category: 'HIIT', met: 9.0, icon: '🏃' },
  { id: 'tuck-jumps', name: 'Группировки', category: 'HIIT', met: 10.0, icon: '🤸' },
  { id: 'skaters', name: 'Конькобежец', category: 'HIIT', met: 8.0, icon: '⛸️' },
  { id: 'sprint-in-place', name: 'Спринт на месте', category: 'HIIT', met: 11.0, icon: '🏃' },
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
  return Math.round(met * weightKg * durationHours);
};
