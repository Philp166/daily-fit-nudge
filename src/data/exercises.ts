import { Target } from 'lucide-react';
import DumbbellIcon from '@/components/ui/DumbbellIcon';
import LightningIcon from '@/components/ui/LightningIcon';
import FlameIcon from '@/components/ui/FlameIcon';
import HeartIcon from '@/components/ui/HeartIcon';
import ActivityIcon from '@/components/ui/ActivityIcon';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  met: number; // Metabolic Equivalent of Task
  iconType: 'dumbbell' | 'activity' | 'heart' | 'zap' | 'target' | 'flame';
  description?: string;
}

export const exerciseCategories = [
  'HIIT',
  'Грудь',
  'Единоборства',
  'Йога',
  'Кардио',
  'Ноги',
  'Плавание',
  'Пресс',
  'Растяжка',
  'Руки',
  'Силовые',
  'Спина',
  'Функциональные',
] as const;

export type ExerciseCategory = typeof exerciseCategories[number];

export const exercises: Exercise[] = [
  // HIIT
  { id: 'burpee-tuck-jump', name: 'Бёрпи с группировкой', category: 'HIIT', met: 11.0, iconType: 'flame' },
  { id: 'lateral-bounds', name: 'Боковые прыжки', category: 'HIIT', met: 9.0, iconType: 'zap' },
  { id: 'lunge-jumps', name: 'Выпады с прыжком', category: 'HIIT', met: 9.0, iconType: 'flame' },
  { id: 'tuck-jumps', name: 'Группировки', category: 'HIIT', met: 10.0, iconType: 'flame' },
  { id: 'skaters', name: 'Конькобежец', category: 'HIIT', met: 8.0, iconType: 'zap' },
  { id: 'plyo-push-ups', name: 'Плио отжимания', category: 'HIIT', met: 10.0, iconType: 'flame' },
  { id: 'switch-lunges', name: 'Попеременные выпады', category: 'HIIT', met: 9.0, iconType: 'flame' },
  { id: 'squat-jumps', name: 'Приседания с прыжком', category: 'HIIT', met: 9.0, iconType: 'flame' },
  { id: 'broad-jumps', name: 'Прыжки в длину', category: 'HIIT', met: 9.0, iconType: 'zap' },
  { id: 'high-plank-jumps', name: 'Прыжки из планки', category: 'HIIT', met: 9.5, iconType: 'flame' },
  { id: 'power-jacks', name: 'Силовые прыжки', category: 'HIIT', met: 9.5, iconType: 'flame' },
  { id: 'sprint-in-place', name: 'Спринт на месте', category: 'HIIT', met: 11.0, iconType: 'flame' },

  // Грудь
  { id: 'archer-push-ups', name: 'Лучник', category: 'Грудь', met: 8.5, iconType: 'dumbbell' },
  { id: 'incline-push-ups', name: 'Наклонные отжимания', category: 'Грудь', met: 6.0, iconType: 'dumbbell' },
  { id: 'push-up-rotation', name: 'Отжимание с ротацией', category: 'Грудь', met: 7.0, iconType: 'dumbbell' },
  { id: 'chest-dips', name: 'Отжимания на брусьях', category: 'Грудь', met: 8.0, iconType: 'dumbbell' },
  { id: 'decline-push-ups', name: 'Отжимания с возвышенности', category: 'Грудь', met: 8.0, iconType: 'dumbbell' },
  { id: 'clap-push-ups', name: 'Хлопковые отжимания', category: 'Грудь', met: 9.0, iconType: 'dumbbell' },
  { id: 'wide-push-ups', name: 'Широкие отжимания', category: 'Грудь', met: 7.5, iconType: 'dumbbell' },

  // Единоборства
  { id: 'uppercuts', name: 'Апперкоты', category: 'Единоборства', met: 7.0, iconType: 'flame' },
  { id: 'shadow-boxing', name: 'Бой с тенью', category: 'Единоборства', met: 5.5, iconType: 'activity' },
  { id: 'jab-cross', name: 'Джеб-кросс', category: 'Единоборства', met: 7.0, iconType: 'flame' },
  { id: 'roundhouse-kicks', name: 'Маваши', category: 'Единоборства', met: 7.0, iconType: 'flame' },
  { id: 'front-kicks', name: 'Прямые удары ногой', category: 'Единоборства', met: 6.5, iconType: 'activity' },
  { id: 'combo-punches', name: 'Связки ударов', category: 'Единоборства', met: 8.0, iconType: 'flame' },
  { id: 'speed-bag', name: 'Скоростная груша', category: 'Единоборства', met: 6.0, iconType: 'zap' },
  { id: 'knee-strikes', name: 'Удары коленом', category: 'Единоборства', met: 7.0, iconType: 'flame' },
  { id: 'elbow-strikes', name: 'Удары локтем', category: 'Единоборства', met: 6.5, iconType: 'flame' },
  { id: 'bob-and-weave', name: 'Уклоны', category: 'Единоборства', met: 5.0, iconType: 'activity' },
  { id: 'hooks', name: 'Хуки', category: 'Единоборства', met: 7.0, iconType: 'flame' },

  // Йога
  { id: 'cobra', name: 'Кобра', category: 'Йога', met: 2.5, iconType: 'heart' },
  { id: 'camel-pose', name: 'Поза верблюда', category: 'Йога', met: 3.0, iconType: 'heart' },
  { id: 'warrior-pose', name: 'Поза воина', category: 'Йога', met: 3.0, iconType: 'target' },
  { id: 'mountain-pose', name: 'Поза горы', category: 'Йога', met: 2.0, iconType: 'heart' },
  { id: 'tree-pose', name: 'Поза дерева', category: 'Йога', met: 2.5, iconType: 'heart' },
  { id: 'bridge-pose', name: 'Поза моста', category: 'Йога', met: 3.0, iconType: 'heart' },
  { id: 'childs-pose', name: 'Поза ребёнка', category: 'Йога', met: 2.0, iconType: 'heart' },
  { id: 'chair-pose', name: 'Поза стула', category: 'Йога', met: 3.5, iconType: 'target' },
  { id: 'triangle-pose', name: 'Поза треугольника', category: 'Йога', met: 3.0, iconType: 'heart' },
  { id: 'half-moon', name: 'Полумесяц', category: 'Йога', met: 3.0, iconType: 'heart' },
  { id: 'downward-dog', name: 'Собака мордой вниз', category: 'Йога', met: 3.0, iconType: 'heart' },

  // Кардио
  { id: 'mountain-climbers', name: 'Альпинист', category: 'Кардио', met: 8.0, iconType: 'activity' },
  { id: 'running', name: 'Бег на месте', category: 'Кардио', met: 8.0, iconType: 'activity' },
  { id: 'burpees', name: 'Бёрпи', category: 'Кардио', met: 10.0, iconType: 'flame' },
  { id: 'lateral-shuffle', name: 'Боковой шаг', category: 'Кардио', met: 7.0, iconType: 'activity' },
  { id: 'fast-feet', name: 'Быстрые ноги', category: 'Кардио', met: 8.0, iconType: 'activity' },
  { id: 'high-knees', name: 'Высокие колени', category: 'Кардио', met: 8.0, iconType: 'activity' },
  { id: 'butt-kicks', name: 'Захлёст голени', category: 'Кардио', met: 8.0, iconType: 'activity' },
  { id: 'star-jumps', name: 'Прыжки звезда', category: 'Кардио', met: 9.0, iconType: 'zap' },
  { id: 'box-jumps', name: 'Прыжки на тумбу', category: 'Кардио', met: 8.0, iconType: 'zap' },
  { id: 'jumping-jacks', name: 'Прыжки с разведением', category: 'Кардио', met: 8.0, iconType: 'zap' },
  { id: 'jump-rope', name: 'Скакалка', category: 'Кардио', met: 11.0, iconType: 'zap' },

  // Ноги
  { id: 'side-lunges', name: 'Боковые выпады', category: 'Ноги', met: 5.0, iconType: 'dumbbell' },
  { id: 'donkey-kicks', name: 'Махи ногой назад', category: 'Ноги', met: 3.5, iconType: 'dumbbell' },
  { id: 'curtsy-lunges', name: 'Перекрёстные выпады', category: 'Ноги', met: 5.0, iconType: 'dumbbell' },
  { id: 'calf-raises', name: 'Подъём на носки', category: 'Ноги', met: 2.8, iconType: 'dumbbell' },
  { id: 'fire-hydrants', name: 'Пожарный гидрант', category: 'Ноги', met: 3.5, iconType: 'dumbbell' },
  { id: 'single-leg-deadlift', name: 'Румынская на одной ноге', category: 'Ноги', met: 4.5, iconType: 'dumbbell' },
  { id: 'wall-sit', name: 'Стульчик у стены', category: 'Ноги', met: 3.5, iconType: 'dumbbell' },
  { id: 'sumo-squats', name: 'Сумо приседания', category: 'Ноги', met: 5.5, iconType: 'dumbbell' },
  { id: 'step-ups', name: 'Шаги на платформу', category: 'Ноги', met: 6.0, iconType: 'activity' },
  { id: 'glute-bridge', name: 'Ягодичный мост', category: 'Ноги', met: 4.0, iconType: 'dumbbell' },

  // Плавание (сухие упражнения)
  { id: 'dolphin-kick', name: 'Дельфин', category: 'Плавание', met: 5.0, iconType: 'activity' },
  { id: 'swim-arms', name: 'Имитация гребков', category: 'Плавание', met: 4.0, iconType: 'activity' },
  { id: 'backstroke-arms', name: 'Имитация на спине', category: 'Плавание', met: 4.0, iconType: 'activity' },
  { id: 'dry-flutter-kick', name: 'Ножницы пловца', category: 'Плавание', met: 4.0, iconType: 'activity' },
  { id: 'swimmer-rotation', name: 'Ротация корпуса', category: 'Плавание', met: 3.5, iconType: 'activity' },
  { id: 'streamline-hold', name: 'Стрела (стримлайн)', category: 'Плавание', met: 3.0, iconType: 'target' },
  { id: 'arm-pull-sim', name: 'Тяга пловца', category: 'Плавание', met: 4.5, iconType: 'dumbbell' },

  // Пресс
  { id: 'v-ups', name: 'V-скручивания', category: 'Пресс', met: 4.5, iconType: 'target' },
  { id: 'mountain-climber-cross', name: 'Альпинист с поворотом', category: 'Пресс', met: 7.0, iconType: 'target' },
  { id: 'side-plank', name: 'Боковая планка', category: 'Пресс', met: 4.0, iconType: 'target' },
  { id: 'bicycle-crunches', name: 'Велосипед', category: 'Пресс', met: 4.5, iconType: 'target' },
  { id: 'toe-touches', name: 'Касания носков', category: 'Пресс', met: 3.5, iconType: 'target' },
  { id: 'hollow-body-hold', name: 'Лодочка', category: 'Пресс', met: 4.0, iconType: 'target' },
  { id: 'dead-bug', name: 'Мёртвый жук', category: 'Пресс', met: 3.5, iconType: 'target' },
  { id: 'flutter-kicks', name: 'Ножницы', category: 'Пресс', met: 4.0, iconType: 'target' },
  { id: 'plank', name: 'Планка', category: 'Пресс', met: 4.0, iconType: 'target' },
  { id: 'plank-shoulder-taps', name: 'Планка с касанием плеч', category: 'Пресс', met: 5.0, iconType: 'target' },
  { id: 'leg-raises', name: 'Подъём ног', category: 'Пресс', met: 3.5, iconType: 'target' },
  { id: 'russian-twist', name: 'Русский твист', category: 'Пресс', met: 4.0, iconType: 'target' },
  { id: 'crunches', name: 'Скручивания', category: 'Пресс', met: 3.8, iconType: 'target' },

  // Растяжка
  { id: 'butterfly-stretch', name: 'Бабочка', category: 'Растяжка', met: 2.3, iconType: 'heart' },
  { id: 'cat-cow', name: 'Кошка-корова', category: 'Растяжка', met: 2.5, iconType: 'heart' },
  { id: 'side-bend', name: 'Наклон в сторону', category: 'Растяжка', met: 2.5, iconType: 'heart' },
  { id: 'forward-fold', name: 'Наклон вперёд', category: 'Растяжка', met: 2.5, iconType: 'heart' },
  { id: 'pigeon-pose', name: 'Поза голубя', category: 'Растяжка', met: 2.5, iconType: 'heart' },
  { id: 'chest-opener', name: 'Раскрытие грудной клетки', category: 'Растяжка', met: 2.0, iconType: 'heart' },
  { id: 'hip-flexor', name: 'Растяжка бёдер', category: 'Растяжка', met: 2.5, iconType: 'heart' },
  { id: 'hamstring-stretch', name: 'Растяжка бицепса бедра', category: 'Растяжка', met: 2.3, iconType: 'heart' },
  { id: 'quad-stretch', name: 'Растяжка квадрицепса', category: 'Растяжка', met: 2.3, iconType: 'heart' },
  { id: 'shoulder-stretch', name: 'Растяжка плеч', category: 'Растяжка', met: 2.0, iconType: 'heart' },
  { id: 'neck-stretch', name: 'Растяжка шеи', category: 'Растяжка', met: 2.0, iconType: 'heart' },
  { id: 'spinal-twist', name: 'Скрутка лёжа', category: 'Растяжка', met: 2.3, iconType: 'heart' },
  { id: 'seated-twist', name: 'Скручивание сидя', category: 'Растяжка', met: 2.3, iconType: 'heart' },

  // Руки
  { id: 'diamond-push-ups', name: 'Алмазные отжимания', category: 'Руки', met: 8.0, iconType: 'dumbbell' },
  { id: 'commando-push-ups', name: 'Коммандо', category: 'Руки', met: 7.0, iconType: 'dumbbell' },
  { id: 'arm-circles', name: 'Круги руками', category: 'Руки', met: 3.0, iconType: 'activity' },
  { id: 'reverse-grip-push-ups', name: 'Обратный хват', category: 'Руки', met: 7.0, iconType: 'dumbbell' },
  { id: 'wrist-push-ups', name: 'Отжимания на кулаках', category: 'Руки', met: 8.0, iconType: 'dumbbell' },
  { id: 'pike-push-ups', name: 'Пайк отжимания', category: 'Руки', met: 6.0, iconType: 'dumbbell' },
  { id: 'plank-up-downs', name: 'Планка вверх-вниз', category: 'Руки', met: 6.0, iconType: 'dumbbell' },
  { id: 'tricep-kickbacks', name: 'Разгибание трицепса', category: 'Руки', met: 4.0, iconType: 'dumbbell' },

  // Силовые
  { id: 'lunges', name: 'Выпады', category: 'Силовые', met: 5.0, iconType: 'dumbbell' },
  { id: 'bodyweight-rows', name: 'Горизонтальные подтягивания', category: 'Силовые', met: 5.0, iconType: 'dumbbell' },
  { id: 'shoulder-press', name: 'Жим плечами', category: 'Силовые', met: 5.0, iconType: 'dumbbell' },
  { id: 'hindu-push-ups', name: 'Индусские отжимания', category: 'Силовые', met: 7.0, iconType: 'dumbbell' },
  { id: 'push-ups', name: 'Отжимания', category: 'Силовые', met: 8.0, iconType: 'dumbbell' },
  { id: 'tricep-dips', name: 'Отжимания на трицепс', category: 'Силовые', met: 5.0, iconType: 'dumbbell' },
  { id: 'pistol-squats', name: 'Пистолетик', category: 'Силовые', met: 6.0, iconType: 'dumbbell' },
  { id: 'plank-to-push-up', name: 'Планка-отжимание', category: 'Силовые', met: 6.5, iconType: 'dumbbell' },
  { id: 'squats', name: 'Приседания', category: 'Силовые', met: 5.0, iconType: 'dumbbell' },
  { id: 'bicep-curls', name: 'Сгибания на бицепс', category: 'Силовые', met: 4.0, iconType: 'dumbbell' },
  { id: 'deadlift', name: 'Становая тяга', category: 'Силовые', met: 6.0, iconType: 'dumbbell' },
  { id: 'close-grip-push-ups', name: 'Узкие отжимания', category: 'Силовые', met: 7.5, iconType: 'dumbbell' },

  // Спина
  { id: 'prone-y-raises', name: 'Y-подъёмы лёжа', category: 'Спина', met: 3.0, iconType: 'dumbbell' },
  { id: 'back-extensions', name: 'Гиперэкстензия', category: 'Спина', met: 4.0, iconType: 'dumbbell' },
  { id: 'good-mornings', name: 'Гуд морнинг', category: 'Спина', met: 4.0, iconType: 'dumbbell' },
  { id: 'scapular-push-ups', name: 'Лопаточные отжимания', category: 'Спина', met: 4.0, iconType: 'dumbbell' },
  { id: 'reverse-snow-angels', name: 'Обратные ангелы', category: 'Спина', met: 3.0, iconType: 'heart' },
  { id: 'bird-dog', name: 'Птица-собака', category: 'Спина', met: 3.5, iconType: 'heart' },
  { id: 'superman', name: 'Супермен', category: 'Спина', met: 3.5, iconType: 'zap' },
  { id: 'swimmer-pulls', name: 'Тяга лёжа', category: 'Спина', met: 4.5, iconType: 'dumbbell' },

  // Функциональные
  { id: 'inchworm', name: 'Гусеница', category: 'Функциональные', met: 5.5, iconType: 'activity' },
  { id: 'defensive-slides', name: 'Защитные перемещения', category: 'Функциональные', met: 7.0, iconType: 'activity' },
  { id: 'animal-flow', name: 'Звериная пластика', category: 'Функциональные', met: 5.5, iconType: 'activity' },
  { id: 'agility-ladder', name: 'Координационная лестница', category: 'Функциональные', met: 8.0, iconType: 'zap' },
  { id: 'crab-walk', name: 'Краб', category: 'Функциональные', met: 5.0, iconType: 'activity' },
  { id: 'bear-crawl', name: 'Медвежья походка', category: 'Функциональные', met: 8.0, iconType: 'activity' },
  { id: 'crawl-push-ups', name: 'Отжимания с выходом', category: 'Функциональные', met: 7.0, iconType: 'dumbbell' },
  { id: 'turkish-getup', name: 'Турецкий подъём', category: 'Функциональные', met: 6.0, iconType: 'dumbbell' },
  { id: 'wall-walk', name: 'Ходьба по стене', category: 'Функциональные', met: 6.0, iconType: 'dumbbell' },
  { id: 'shuttle-run', name: 'Челночный бег', category: 'Функциональные', met: 9.0, iconType: 'activity' },
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
    dumbbell: DumbbellIcon,
    activity: ActivityIcon,
    heart: HeartIcon,
    zap: LightningIcon,
    target: Target,
    flame: FlameIcon,
  };
  return iconMap[iconType];
};
