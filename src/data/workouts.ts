import { Exercise, getExerciseById } from './exercises';

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  workTime: number; // seconds
  restTime: number; // seconds
}

export interface Workout {
  id: string;
  name: string;
  category: string;
  exercises: WorkoutExercise[];
  totalDuration: number; // minutes (auto-computed)
  estimatedCalories: number; // based on 70kg person (auto-computed)
  difficulty: 'Лёгкая' | 'Средняя' | 'Сложная';
}

export const workoutCategories = [
  'Все',
  'HIIT',
  'Для ног',
  'Для пресса',
  'Для рук',
  'Для спины',
  'Единоборства',
  'Йога',
  'Кардио',
  'Плавание',
  'Полное тело',
  'Растяжка',
  'Силовая',
  'Утренняя зарядка',
  'Функциональные',
] as const;

// --- Auto-computation infrastructure ---

interface PresetDef {
  id: string;
  name: string;
  category: string;
  exercises: WorkoutExercise[];
  difficulty: 'Лёгкая' | 'Средняя' | 'Сложная';
}

const DEFAULT_WEIGHT_KG = 70;

function computeWorkout(def: PresetDef): Workout {
  const totalSeconds = def.exercises.reduce(
    (acc, ex) => acc + (ex.workTime + ex.restTime) * ex.sets, 0,
  );
  const totalDuration = Math.max(1, Math.round(totalSeconds / 60));
  const estimatedCalories = Math.round(
    def.exercises.reduce((acc, ex) => {
      const exercise = getExerciseById(ex.exerciseId);
      if (!exercise) return acc;
      const workTimeHours = (ex.workTime * ex.sets) / 3600;
      return acc + exercise.met * DEFAULT_WEIGHT_KG * workTimeHours;
    }, 0),
  );
  return { ...def, totalDuration, estimatedCalories };
}

/** MET-based calorie estimate for custom/favorite workouts */
export function computeWorkoutCalories(exercises: WorkoutExercise[], weightKg: number): number {
  return Math.round(
    exercises.reduce((acc, ex) => {
      const exercise = getExerciseById(ex.exerciseId);
      if (!exercise) return acc;
      const workTimeHours = (ex.workTime * ex.sets) / 3600;
      return acc + exercise.met * weightKg * workTimeHours;
    }, 0),
  );
}

// --- Preset definitions (without hardcoded totalDuration / estimatedCalories) ---

const presetDefs: PresetDef[] = [
  // ========== HIIT ==========
  {
    id: 'hiit-burner',
    name: 'HIIT Жиросжигание',
    category: 'HIIT',
    difficulty: 'Сложная',
    exercises: [
      { exerciseId: 'burpees', sets: 4, workTime: 40, restTime: 20 },
      { exerciseId: 'squat-jumps', sets: 4, workTime: 40, restTime: 20 },
      { exerciseId: 'mountain-climbers', sets: 4, workTime: 40, restTime: 20 },
      { exerciseId: 'lunge-jumps', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'sprint-in-place', sets: 3, workTime: 30, restTime: 15 },
    ],
  },
  {
    id: 'hiit-power',
    name: 'HIIT Мощь',
    category: 'HIIT',
    difficulty: 'Сложная',
    exercises: [
      { exerciseId: 'burpee-tuck-jump', sets: 3, workTime: 35, restTime: 20 },
      { exerciseId: 'power-jacks', sets: 4, workTime: 35, restTime: 15 },
      { exerciseId: 'lateral-bounds', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'broad-jumps', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'high-plank-jumps', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'switch-lunges', sets: 3, workTime: 35, restTime: 15 },
    ],
  },
  {
    id: 'quick-hiit',
    name: 'Быстрый HIIT',
    category: 'HIIT',
    difficulty: 'Сложная',
    exercises: [
      { exerciseId: 'burpees', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'squat-jumps', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'tuck-jumps', sets: 3, workTime: 25, restTime: 15 },
      { exerciseId: 'sprint-in-place', sets: 3, workTime: 30, restTime: 15 },
    ],
  },
  {
    id: 'tabata-classic',
    name: 'Табата классика',
    category: 'HIIT',
    difficulty: 'Сложная',
    exercises: [
      { exerciseId: 'burpees', sets: 4, workTime: 20, restTime: 10 },
      { exerciseId: 'squat-jumps', sets: 4, workTime: 20, restTime: 10 },
      { exerciseId: 'mountain-climbers', sets: 4, workTime: 20, restTime: 10 },
      { exerciseId: 'sprint-in-place', sets: 4, workTime: 20, restTime: 10 },
      { exerciseId: 'plyo-push-ups', sets: 4, workTime: 20, restTime: 10 },
      { exerciseId: 'tuck-jumps', sets: 4, workTime: 20, restTime: 10 },
    ],
  },

  // ========== Для ног ==========
  {
    id: 'leg-power',
    name: 'Взрывные ноги',
    category: 'Для ног',
    difficulty: 'Сложная',
    exercises: [
      { exerciseId: 'squat-jumps', sets: 4, workTime: 40, restTime: 20 },
      { exerciseId: 'lunge-jumps', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'pistol-squats', sets: 3, workTime: 35, restTime: 20 },
      { exerciseId: 'curtsy-lunges', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'step-ups', sets: 3, workTime: 45, restTime: 20 },
      { exerciseId: 'wall-sit', sets: 3, workTime: 45, restTime: 15 },
    ],
  },
  {
    id: 'leg-day',
    name: 'День ног',
    category: 'Для ног',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'squats', sets: 4, workTime: 45, restTime: 20 },
      { exerciseId: 'lunges', sets: 3, workTime: 50, restTime: 20 },
      { exerciseId: 'sumo-squats', sets: 3, workTime: 45, restTime: 20 },
      { exerciseId: 'glute-bridge', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'wall-sit', sets: 3, workTime: 45, restTime: 20 },
      { exerciseId: 'calf-raises', sets: 3, workTime: 40, restTime: 15 },
    ],
  },
  {
    id: 'leg-tone',
    name: 'Тонус ног',
    category: 'Для ног',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'squats', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'glute-bridge', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'donkey-kicks', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'fire-hydrants', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'side-lunges', sets: 2, workTime: 35, restTime: 15 },
    ],
  },

  // ========== Для пресса ==========
  {
    id: 'core-shred',
    name: 'Жёсткий пресс',
    category: 'Для пресса',
    difficulty: 'Сложная',
    exercises: [
      { exerciseId: 'v-ups', sets: 4, workTime: 40, restTime: 15 },
      { exerciseId: 'mountain-climber-cross', sets: 4, workTime: 35, restTime: 15 },
      { exerciseId: 'plank-shoulder-taps', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'hollow-body-hold', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'bicycle-crunches', sets: 3, workTime: 45, restTime: 15 },
      { exerciseId: 'side-plank', sets: 3, workTime: 35, restTime: 15 },
    ],
  },
  {
    id: 'core-power',
    name: 'Мощный пресс',
    category: 'Для пресса',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'plank', sets: 3, workTime: 45, restTime: 15 },
      { exerciseId: 'crunches', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'bicycle-crunches', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'leg-raises', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'russian-twist', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'flutter-kicks', sets: 2, workTime: 30, restTime: 10 },
    ],
  },
  {
    id: 'core-stability',
    name: 'Стабильный кор',
    category: 'Для пресса',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'plank', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'dead-bug', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'bird-dog', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'toe-touches', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'side-plank', sets: 2, workTime: 25, restTime: 10 },
    ],
  },

  // ========== Для рук ==========
  {
    id: 'arm-power',
    name: 'Мощные руки',
    category: 'Для рук',
    difficulty: 'Сложная',
    exercises: [
      { exerciseId: 'wrist-push-ups', sets: 4, workTime: 40, restTime: 20 },
      { exerciseId: 'reverse-grip-push-ups', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'diamond-push-ups', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'commando-push-ups', sets: 3, workTime: 35, restTime: 20 },
      { exerciseId: 'tricep-kickbacks', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'pike-push-ups', sets: 3, workTime: 35, restTime: 20 },
    ],
  },
  {
    id: 'arm-sculpt',
    name: 'Скульптура рук',
    category: 'Для рук',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'diamond-push-ups', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'pike-push-ups', sets: 3, workTime: 35, restTime: 20 },
      { exerciseId: 'tricep-dips', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'commando-push-ups', sets: 3, workTime: 35, restTime: 20 },
      { exerciseId: 'plank-up-downs', sets: 3, workTime: 30, restTime: 15 },
    ],
  },

  // ========== Для спины ==========
  {
    id: 'back-health',
    name: 'Здоровая спина',
    category: 'Для спины',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'superman', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'bird-dog', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'cat-cow', sets: 3, workTime: 30, restTime: 10 },
      { exerciseId: 'back-extensions', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'reverse-snow-angels', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'prone-y-raises', sets: 2, workTime: 30, restTime: 10 },
    ],
  },

  // ========== Единоборства ==========
  {
    id: 'combat-cardio',
    name: 'Боевое кардио',
    category: 'Единоборства',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'shadow-boxing', sets: 3, workTime: 45, restTime: 15 },
      { exerciseId: 'jab-cross', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'front-kicks', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'bob-and-weave', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'speed-bag', sets: 3, workTime: 40, restTime: 15 },
    ],
  },
  {
    id: 'boxing-basics',
    name: 'Бокс основы',
    category: 'Единоборства',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'shadow-boxing', sets: 3, workTime: 60, restTime: 20 },
      { exerciseId: 'jab-cross', sets: 4, workTime: 40, restTime: 15 },
      { exerciseId: 'hooks', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'uppercuts', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'bob-and-weave', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'combo-punches', sets: 3, workTime: 45, restTime: 20 },
    ],
  },
  {
    id: 'kickboxing-power',
    name: 'Кикбоксинг мощь',
    category: 'Единоборства',
    difficulty: 'Сложная',
    exercises: [
      { exerciseId: 'jab-cross', sets: 4, workTime: 40, restTime: 15 },
      { exerciseId: 'front-kicks', sets: 4, workTime: 40, restTime: 15 },
      { exerciseId: 'roundhouse-kicks', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'knee-strikes', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'elbow-strikes', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'combo-punches', sets: 3, workTime: 45, restTime: 20 },
    ],
  },

  // ========== Йога ==========
  {
    id: 'yoga-balance',
    name: 'Йога баланс',
    category: 'Йога',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'tree-pose', sets: 3, workTime: 45, restTime: 10 },
      { exerciseId: 'warrior-pose', sets: 3, workTime: 45, restTime: 10 },
      { exerciseId: 'half-moon', sets: 3, workTime: 40, restTime: 10 },
      { exerciseId: 'chair-pose', sets: 3, workTime: 40, restTime: 10 },
      { exerciseId: 'triangle-pose', sets: 2, workTime: 45, restTime: 10 },
      { exerciseId: 'bridge-pose', sets: 2, workTime: 40, restTime: 10 },
    ],
  },
  {
    id: 'yoga-flow',
    name: 'Йога поток',
    category: 'Йога',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'childs-pose', sets: 2, workTime: 60, restTime: 10 },
      { exerciseId: 'downward-dog', sets: 3, workTime: 45, restTime: 10 },
      { exerciseId: 'cobra', sets: 3, workTime: 30, restTime: 10 },
      { exerciseId: 'warrior-pose', sets: 2, workTime: 45, restTime: 10 },
      { exerciseId: 'tree-pose', sets: 2, workTime: 45, restTime: 10 },
    ],
  },
  {
    id: 'yoga-morning',
    name: 'Утренняя йога',
    category: 'Йога',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'mountain-pose', sets: 2, workTime: 40, restTime: 10 },
      { exerciseId: 'downward-dog', sets: 2, workTime: 40, restTime: 10 },
      { exerciseId: 'cobra', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'camel-pose', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'childs-pose', sets: 2, workTime: 45, restTime: 10 },
    ],
  },

  // ========== Кардио ==========
  {
    id: 'cardio-blast',
    name: 'Кардио взрыв',
    category: 'Кардио',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 4, workTime: 45, restTime: 15 },
      { exerciseId: 'high-knees', sets: 4, workTime: 40, restTime: 15 },
      { exerciseId: 'running', sets: 3, workTime: 60, restTime: 20 },
      { exerciseId: 'mountain-climbers', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'skaters', sets: 3, workTime: 40, restTime: 15 },
    ],
  },
  {
    id: 'cardio-endurance',
    name: 'Кардио выносливость',
    category: 'Кардио',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'running', sets: 4, workTime: 60, restTime: 20 },
      { exerciseId: 'butt-kicks', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'lateral-shuffle', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'star-jumps', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'fast-feet', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'jumping-jacks', sets: 3, workTime: 40, restTime: 15 },
    ],
  },
  {
    id: 'cardio-rhythm',
    name: 'Кардио ритм',
    category: 'Кардио',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'running', sets: 3, workTime: 45, restTime: 15 },
      { exerciseId: 'high-knees', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'butt-kicks', sets: 3, workTime: 30, restTime: 15 },
    ],
  },

  // ========== Плавание ==========
  {
    id: 'swim-power',
    name: 'Сила пловца',
    category: 'Плавание',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'arm-pull-sim', sets: 4, workTime: 40, restTime: 15 },
      { exerciseId: 'dolphin-kick', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'swim-arms', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'swimmer-rotation', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'streamline-hold', sets: 3, workTime: 35, restTime: 10 },
      { exerciseId: 'dry-flutter-kick', sets: 3, workTime: 40, restTime: 15 },
    ],
  },
  {
    id: 'swim-dryland',
    name: 'Сухое плавание',
    category: 'Плавание',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'swim-arms', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'dry-flutter-kick', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'streamline-hold', sets: 3, workTime: 30, restTime: 10 },
      { exerciseId: 'backstroke-arms', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'swimmer-rotation', sets: 2, workTime: 30, restTime: 10 },
    ],
  },

  // ========== Полное тело ==========
  {
    id: 'full-body-circuit',
    name: 'Круговая тренировка',
    category: 'Полное тело',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'running', sets: 3, workTime: 45, restTime: 15 },
      { exerciseId: 'push-ups', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'lunges', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'plank', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'superman', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'crunches', sets: 3, workTime: 35, restTime: 15 },
    ],
  },
  {
    id: 'full-body-basics',
    name: 'Полное тело базовый',
    category: 'Полное тело',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'push-ups', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'squats', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'plank', sets: 2, workTime: 30, restTime: 15 },
      { exerciseId: 'glute-bridge', sets: 2, workTime: 30, restTime: 10 },
    ],
  },
  {
    id: 'full-body-blast',
    name: 'Полное тело экстрим',
    category: 'Полное тело',
    difficulty: 'Сложная',
    exercises: [
      { exerciseId: 'burpees', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'push-ups', sets: 4, workTime: 45, restTime: 20 },
      { exerciseId: 'squat-jumps', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'plank', sets: 3, workTime: 45, restTime: 15 },
      { exerciseId: 'lunges', sets: 3, workTime: 50, restTime: 20 },
      { exerciseId: 'mountain-climbers', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'bicycle-crunches', sets: 3, workTime: 40, restTime: 15 },
    ],
  },

  // ========== Растяжка ==========
  {
    id: 'stretch-recovery',
    name: 'Восстановление',
    category: 'Растяжка',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'forward-fold', sets: 2, workTime: 45, restTime: 10 },
      { exerciseId: 'quad-stretch', sets: 2, workTime: 40, restTime: 10 },
      { exerciseId: 'hamstring-stretch', sets: 2, workTime: 40, restTime: 10 },
      { exerciseId: 'shoulder-stretch', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'hip-flexor', sets: 2, workTime: 45, restTime: 10 },
    ],
  },
  {
    id: 'deep-stretch',
    name: 'Глубокая растяжка',
    category: 'Растяжка',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'pigeon-pose', sets: 2, workTime: 50, restTime: 10 },
      { exerciseId: 'butterfly-stretch', sets: 2, workTime: 45, restTime: 10 },
      { exerciseId: 'seated-twist', sets: 2, workTime: 40, restTime: 10 },
      { exerciseId: 'spinal-twist', sets: 2, workTime: 45, restTime: 10 },
      { exerciseId: 'chest-opener', sets: 2, workTime: 40, restTime: 10 },
      { exerciseId: 'neck-stretch', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'cat-cow', sets: 2, workTime: 40, restTime: 10 },
    ],
  },

  // ========== Силовая ==========
  {
    id: 'upper-body',
    name: 'Верх тела',
    category: 'Силовая',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'push-ups', sets: 4, workTime: 45, restTime: 20 },
      { exerciseId: 'diamond-push-ups', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'pike-push-ups', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'tricep-dips', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'superman', sets: 3, workTime: 35, restTime: 15 },
    ],
  },
  {
    id: 'full-body-strength',
    name: 'Сила всего тела',
    category: 'Силовая',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'push-ups', sets: 4, workTime: 45, restTime: 20 },
      { exerciseId: 'squats', sets: 4, workTime: 45, restTime: 20 },
      { exerciseId: 'plank', sets: 3, workTime: 45, restTime: 15 },
      { exerciseId: 'lunges', sets: 3, workTime: 45, restTime: 20 },
      { exerciseId: 'tricep-dips', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'glute-bridge', sets: 3, workTime: 40, restTime: 15 },
    ],
  },
  {
    id: 'power-circuit',
    name: 'Силовой цикл',
    category: 'Силовая',
    difficulty: 'Сложная',
    exercises: [
      { exerciseId: 'push-ups', sets: 4, workTime: 50, restTime: 20 },
      { exerciseId: 'pistol-squats', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'archer-push-ups', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'hindu-push-ups', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'bodyweight-rows', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'plank-to-push-up', sets: 3, workTime: 40, restTime: 15 },
    ],
  },

  // ========== Утренняя зарядка ==========
  {
    id: 'morning-energy',
    name: 'Утренний заряд',
    category: 'Утренняя зарядка',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'push-ups', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'squats', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'plank', sets: 2, workTime: 40, restTime: 15 },
      { exerciseId: 'high-knees', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'forward-fold', sets: 2, workTime: 30, restTime: 10 },
    ],
  },
  {
    id: 'morning-warmup',
    name: 'Утренняя разминка',
    category: 'Утренняя зарядка',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'arm-circles', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'jumping-jacks', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'squats', sets: 2, workTime: 45, restTime: 15 },
      { exerciseId: 'forward-fold', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'high-knees', sets: 2, workTime: 30, restTime: 15 },
    ],
  },
  {
    id: 'morning-express',
    name: 'Экспресс-зарядка',
    category: 'Утренняя зарядка',
    difficulty: 'Лёгкая',
    exercises: [
      { exerciseId: 'arm-circles', sets: 2, workTime: 20, restTime: 10 },
      { exerciseId: 'squats', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'cat-cow', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'jumping-jacks', sets: 2, workTime: 30, restTime: 10 },
    ],
  },

  // ========== Функциональные ==========
  {
    id: 'functional-basics',
    name: 'Функционалка базовая',
    category: 'Функциональные',
    difficulty: 'Средняя',
    exercises: [
      { exerciseId: 'bear-crawl', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'inchworm', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'crab-walk', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'animal-flow', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'defensive-slides', sets: 3, workTime: 30, restTime: 15 },
    ],
  },
  {
    id: 'functional-extreme',
    name: 'Функционалка экстрим',
    category: 'Функциональные',
    difficulty: 'Сложная',
    exercises: [
      { exerciseId: 'bear-crawl', sets: 4, workTime: 35, restTime: 15 },
      { exerciseId: 'wall-walk', sets: 3, workTime: 30, restTime: 20 },
      { exerciseId: 'turkish-getup', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'shuttle-run', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'crawl-push-ups', sets: 3, workTime: 35, restTime: 15 },
      { exerciseId: 'agility-ladder', sets: 3, workTime: 30, restTime: 15 },
    ],
  },
];

// Auto-compute totalDuration & estimatedCalories from exercise data
export const presetWorkouts: Workout[] = presetDefs.map(computeWorkout);

export const getWorkoutsByCategory = (category: string): Workout[] => {
  if (category === 'Все') return presetWorkouts;
  return presetWorkouts.filter(w => w.category === category);
};

export const getWorkoutById = (id: string): Workout | undefined => {
  return presetWorkouts.find(w => w.id === id);
};
