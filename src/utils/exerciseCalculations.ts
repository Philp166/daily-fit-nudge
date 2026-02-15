import type { Exercise, WorkoutExercise } from '@/types/exercise';
import { ParameterType } from '@/types/exercise';

// ============================================
// КОНСТАНТЫ
// ============================================

/**
 * Среднее время на одно повторение (секунды)
 */
const SECONDS_PER_REP = 3;

/**
 * Дефолтный отдых между подходами (секунды)
 */
const DEFAULT_REST_SECONDS = 90;

// ============================================
// РАСЧЕТ КАЛОРИЙ
// ============================================

/**
 * Рассчитывает калории для упражнения
 * Формула: Калории = MET × вес_кг × время_часы
 */
export function calculateExerciseCalories(
  exercise: Exercise,
  workoutExercise: WorkoutExercise,
  userWeight: number // вес пользователя в кг
): number {
  let finalMET = exercise.baseMET;

  // ===== Модификация MET =====

  // 1. По весу снаряда (для силовых упражнений)
  if (exercise.metModifiers?.byWeight?.enabled && workoutExercise.weight) {
    const weightModifier = exercise.metModifiers.byWeight.modifier;
    const weightRatio = workoutExercise.weight / userWeight;
    finalMET = exercise.baseMET + (weightRatio * weightModifier);
  }

  // 2. По скорости (для кардио)
  if (exercise.metModifiers?.bySpeed?.enabled && workoutExercise.speed) {
    const speedTable = exercise.metModifiers.bySpeed.speedTable;
    // Найти ближайшее значение в таблице
    const entry = speedTable
      .sort((a, b) => a.speed - b.speed)
      .find((s) => workoutExercise.speed! <= s.speed);
    finalMET = entry ? entry.met : exercise.baseMET;
  }

  // 3. По интенсивности
  if (exercise.metModifiers?.byIntensity?.enabled && workoutExercise.intensity) {
    const intensityTable = exercise.metModifiers.byIntensity.intensityTable;
    finalMET = intensityTable[workoutExercise.intensity];
  }

  // ===== Расчет времени упражнения =====
  const totalTimeSeconds = calculateExerciseDuration(exercise, workoutExercise);
  const totalTimeHours = totalTimeSeconds / 3600;

  // ===== Формула калорий =====
  const calories = finalMET * userWeight * totalTimeHours;

  return Math.round(calories);
}

// ============================================
// РАСЧЕТ ВРЕМЕНИ
// ============================================

/**
 * Рассчитывает общее время упражнения (в секундах)
 */
export function calculateExerciseDuration(
  exercise: Exercise,
  workoutExercise: WorkoutExercise
): number {
  const paramType = exercise.parameterType;

  // SETS_REPS и SETS_REPS_WEIGHT
  if (paramType === ParameterType.SETS_REPS || paramType === ParameterType.SETS_REPS_WEIGHT) {
    const sets = workoutExercise.sets ?? exercise.defaults.sets ?? 3;
    const reps = workoutExercise.reps ?? exercise.defaults.reps ?? 10;
    const rest = workoutExercise.rest ?? exercise.defaults.rest ?? DEFAULT_REST_SECONDS;

    const workTimePerSet = reps * SECONDS_PER_REP;
    const totalTime = sets * (workTimePerSet + rest) - rest; // последний отдых не считаем

    return totalTime;
  }

  // DURATION (планка, статика)
  if (paramType === ParameterType.DURATION) {
    const sets = workoutExercise.sets ?? exercise.defaults.sets ?? 1;
    const duration = workoutExercise.duration ?? exercise.defaults.duration ?? 60;
    const rest = workoutExercise.rest ?? exercise.defaults.rest ?? DEFAULT_REST_SECONDS;

    if (sets === 1) {
      return duration;
    }
    return sets * (duration + rest) - rest;
  }

  // DISTANCE_TIME (бег, плавание)
  if (paramType === ParameterType.DISTANCE_TIME) {
    return workoutExercise.duration ?? exercise.defaults.duration ?? 600;
  }

  // DISTANCE (прыжки в длину)
  if (paramType === ParameterType.DISTANCE) {
    const sets = workoutExercise.sets ?? exercise.defaults.sets ?? 6;
    const rest = workoutExercise.rest ?? exercise.defaults.rest ?? 180;

    // Предполагаем ~10 секунд на попытку
    const attemptTime = 10;
    return sets * (attemptTime + rest) - rest;
  }

  // ROUNDS_DURATION (бокс, раунды)
  if (paramType === ParameterType.ROUNDS_DURATION) {
    const sets = workoutExercise.sets ?? exercise.defaults.sets ?? 3;
    const duration = workoutExercise.duration ?? exercise.defaults.duration ?? 180; // 3 мин
    const rest = workoutExercise.rest ?? exercise.defaults.rest ?? 60;

    return sets * (duration + rest) - rest;
  }

  return 0;
}

// ============================================
// РАСЧЕТ ВСЕЙ ТРЕНИРОВКИ
// ============================================

/**
 * Рассчитывает общие калории для всей тренировки
 */
export function calculateWorkoutCalories(
  exercises: Array<{ exercise: Exercise; workoutExercise: WorkoutExercise }>,
  userWeight: number
): number {
  return exercises.reduce((total, { exercise, workoutExercise }) => {
    return total + calculateExerciseCalories(exercise, workoutExercise, userWeight);
  }, 0);
}

/**
 * Рассчитывает общую длительность тренировки (в минутах)
 */
export function calculateWorkoutDuration(
  exercises: Array<{ exercise: Exercise; workoutExercise: WorkoutExercise }>
): number {
  const totalSeconds = exercises.reduce((total, { exercise, workoutExercise }) => {
    return total + calculateExerciseDuration(exercise, workoutExercise);
  }, 0);

  return Math.round(totalSeconds / 60); // в минутах
}

// ============================================
// ХЕЛПЕРЫ
// ============================================

/**
 * Форматирует время (секунды → "Xмин Yсек")
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) {
    return `${secs}с`;
  }
  if (secs === 0) {
    return `${mins}м`;
  }
  return `${mins}м ${secs}с`;
}

/**
 * Форматирует расстояние (метры → "X км" или "X м")
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km}км`;
  }
  return `${meters}м`;
}

/**
 * Создает строку параметров упражнения для отображения
 * Например: "3 × 10 • 80 кг" или "5 км • 25:00"
 */
export function formatExerciseParams(
  exercise: Exercise,
  workoutExercise: WorkoutExercise
): string {
  const paramType = exercise.parameterType;

  if (paramType === ParameterType.SETS_REPS) {
    const sets = workoutExercise.sets ?? exercise.defaults.sets ?? 3;
    const reps = workoutExercise.reps ?? exercise.defaults.reps ?? 10;
    return `${sets} × ${reps}`;
  }

  if (paramType === ParameterType.SETS_REPS_WEIGHT) {
    const sets = workoutExercise.sets ?? exercise.defaults.sets ?? 3;
    const reps = workoutExercise.reps ?? exercise.defaults.reps ?? 10;
    const weight = workoutExercise.weight ?? exercise.defaults.weight;

    if (weight) {
      return `${sets} × ${reps} • ${weight} кг`;
    }
    return `${sets} × ${reps}`;
  }

  if (paramType === ParameterType.DURATION) {
    const duration = workoutExercise.duration ?? exercise.defaults.duration ?? 60;
    const sets = workoutExercise.sets ?? exercise.defaults.sets ?? 1;

    if (sets === 1) {
      return formatDuration(duration);
    }
    return `${sets} × ${formatDuration(duration)}`;
  }

  if (paramType === ParameterType.DISTANCE_TIME) {
    const distance = workoutExercise.distance ?? exercise.defaults.distance;
    const duration = workoutExercise.duration ?? exercise.defaults.duration;

    if (distance && duration) {
      const mins = Math.floor(duration / 60);
      const secs = duration % 60;
      return `${formatDistance(distance)} • ${mins}:${secs.toString().padStart(2, '0')}`;
    }
    if (distance) {
      return formatDistance(distance);
    }
    if (duration) {
      return formatDuration(duration);
    }
  }

  if (paramType === ParameterType.ROUNDS_DURATION) {
    const sets = workoutExercise.sets ?? exercise.defaults.sets ?? 3;
    const duration = workoutExercise.duration ?? exercise.defaults.duration ?? 180;
    return `${sets} раунд. × ${formatDuration(duration)}`;
  }

  return '';
}
