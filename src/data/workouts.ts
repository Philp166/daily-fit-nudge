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
  totalDuration: number; // minutes
  estimatedCalories: number; // based on 70kg person
  difficulty: 'Лёгкая' | 'Средняя' | 'Сложная';
}

export const workoutCategories = [
  'Все',
  'Утренняя зарядка',
  'Кардио',
  'Силовая',
  'HIIT',
  'Растяжка',
  'Йога',
  'Для пресса',
  'Для ног',
  'Полное тело',
] as const;

export const presetWorkouts: Workout[] = [
  {
    id: 'morning-warmup',
    name: 'Утренняя разминка',
    category: 'Утренняя зарядка',
    difficulty: 'Лёгкая',
    totalDuration: 15,
    estimatedCalories: 85,
    exercises: [
      { exerciseId: 'arm-circles', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'jumping-jacks', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'squats', sets: 2, workTime: 45, restTime: 15 },
      { exerciseId: 'forward-fold', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'high-knees', sets: 2, workTime: 30, restTime: 15 },
    ],
  },
  {
    id: 'hiit-burner',
    name: 'HIIT Жиросжигание',
    category: 'HIIT',
    difficulty: 'Сложная',
    totalDuration: 25,
    estimatedCalories: 280,
    exercises: [
      { exerciseId: 'burpees', sets: 4, workTime: 40, restTime: 20 },
      { exerciseId: 'squat-jumps', sets: 4, workTime: 40, restTime: 20 },
      { exerciseId: 'mountain-climbers', sets: 4, workTime: 40, restTime: 20 },
      { exerciseId: 'lunge-jumps', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'sprint-in-place', sets: 3, workTime: 30, restTime: 15 },
    ],
  },
  {
    id: 'core-power',
    name: 'Мощный пресс',
    category: 'Для пресса',
    difficulty: 'Средняя',
    totalDuration: 20,
    estimatedCalories: 120,
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
    id: 'leg-day',
    name: 'День ног',
    category: 'Для ног',
    difficulty: 'Средняя',
    totalDuration: 30,
    estimatedCalories: 200,
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
    id: 'full-body-strength',
    name: 'Сила всего тела',
    category: 'Силовая',
    difficulty: 'Средняя',
    totalDuration: 35,
    estimatedCalories: 250,
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
    id: 'cardio-blast',
    name: 'Кардио взрыв',
    category: 'Кардио',
    difficulty: 'Средняя',
    totalDuration: 25,
    estimatedCalories: 220,
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 4, workTime: 45, restTime: 15 },
      { exerciseId: 'high-knees', sets: 4, workTime: 40, restTime: 15 },
      { exerciseId: 'running', sets: 3, workTime: 60, restTime: 20 },
      { exerciseId: 'mountain-climbers', sets: 3, workTime: 40, restTime: 15 },
      { exerciseId: 'skaters', sets: 3, workTime: 40, restTime: 15 },
    ],
  },
  {
    id: 'yoga-flow',
    name: 'Йога поток',
    category: 'Йога',
    difficulty: 'Лёгкая',
    totalDuration: 20,
    estimatedCalories: 70,
    exercises: [
      { exerciseId: 'childs-pose', sets: 2, workTime: 60, restTime: 10 },
      { exerciseId: 'downward-dog', sets: 3, workTime: 45, restTime: 10 },
      { exerciseId: 'cobra', sets: 3, workTime: 30, restTime: 10 },
      { exerciseId: 'warrior-pose', sets: 2, workTime: 45, restTime: 10 },
      { exerciseId: 'tree-pose', sets: 2, workTime: 45, restTime: 10 },
    ],
  },
  {
    id: 'stretch-recovery',
    name: 'Восстановление',
    category: 'Растяжка',
    difficulty: 'Лёгкая',
    totalDuration: 15,
    estimatedCalories: 40,
    exercises: [
      { exerciseId: 'forward-fold', sets: 2, workTime: 45, restTime: 10 },
      { exerciseId: 'quad-stretch', sets: 2, workTime: 40, restTime: 10 },
      { exerciseId: 'hamstring-stretch', sets: 2, workTime: 40, restTime: 10 },
      { exerciseId: 'shoulder-stretch', sets: 2, workTime: 30, restTime: 10 },
      { exerciseId: 'hip-flexor', sets: 2, workTime: 45, restTime: 10 },
    ],
  },
  {
    id: 'upper-body',
    name: 'Верх тела',
    category: 'Силовая',
    difficulty: 'Средняя',
    totalDuration: 25,
    estimatedCalories: 180,
    exercises: [
      { exerciseId: 'push-ups', sets: 4, workTime: 45, restTime: 20 },
      { exerciseId: 'diamond-push-ups', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'pike-push-ups', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'tricep-dips', sets: 3, workTime: 40, restTime: 20 },
      { exerciseId: 'superman', sets: 3, workTime: 35, restTime: 15 },
    ],
  },
  {
    id: 'quick-hiit',
    name: 'Быстрый HIIT',
    category: 'HIIT',
    difficulty: 'Сложная',
    totalDuration: 15,
    estimatedCalories: 180,
    exercises: [
      { exerciseId: 'burpees', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'squat-jumps', sets: 3, workTime: 30, restTime: 15 },
      { exerciseId: 'tuck-jumps', sets: 3, workTime: 25, restTime: 15 },
      { exerciseId: 'sprint-in-place', sets: 3, workTime: 30, restTime: 15 },
    ],
  },
  {
    id: 'full-body-blast',
    name: 'Полное тело экстрим',
    category: 'Полное тело',
    difficulty: 'Сложная',
    totalDuration: 40,
    estimatedCalories: 350,
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
];

export const getWorkoutsByCategory = (category: string): Workout[] => {
  if (category === 'Все') return presetWorkouts;
  return presetWorkouts.filter(w => w.category === category);
};

export const getWorkoutById = (id: string): Workout | undefined => {
  return presetWorkouts.find(w => w.id === id);
};
