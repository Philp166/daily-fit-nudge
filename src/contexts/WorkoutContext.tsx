import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Exercise, WorkoutExercise } from '@/types/exercise';
import { getExerciseById } from '@/data/exercises';
import { calculateExerciseCalories, calculateExerciseDuration } from '@/utils/exerciseCalculations';
import { useUser, getLocalDateKey } from '@/contexts/UserContext';

// ============================================
// ТИПЫ
// ============================================

/** Упражнение в билдере (ещё не запущено) */
export interface BuilderExercise {
  uid: string; // уникальный ID в билдере (crypto.randomUUID)
  exerciseId: string; // ссылка на Exercise.id
  sets: number;
  reps: number;
  duration: number; // секунды
  rest: number; // секунды
  weight: number; // кг
  distance: number; // метры
  speed: number; // км/ч
  intensity: 'light' | 'moderate' | 'vigorous';
}

/** Сохранённая тренировка (шаблон) */
export interface SavedWorkout {
  id: string;
  name: string;
  exercises: BuilderExercise[];
  createdAt: string;
}

/** Активная сессия выполнения */
export interface WorkoutSession {
  workoutName: string;
  exercises: BuilderExercise[];
  currentExerciseIndex: number;
  currentSet: number;
  phase: 'exercise' | 'rest' | 'done';
  startedAt: number; // timestamp
  completedExercises: number; // сколько упражнений завершено
  totalCalories: number;
  elapsedSeconds: number;
}

/** Запись о завершённой тренировке */
export interface CompletedWorkout {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  exercises: number;
  duration: number; // минуты
  calories: number;
}

// ============================================
// КОНТЕКСТ
// ============================================

interface WorkoutContextType {
  // Билдер
  builderExercises: BuilderExercise[];
  addToBuilder: (exercise: Exercise) => void;
  removeFromBuilder: (uid: string) => void;
  updateBuilderExercise: (uid: string, updates: Partial<BuilderExercise>) => void;
  reorderBuilder: (fromIndex: number, toIndex: number) => void;
  clearBuilder: () => void;

  // Сохранённые тренировки
  savedWorkouts: SavedWorkout[];
  saveWorkout: (name: string) => SavedWorkout;
  deleteSavedWorkout: (id: string) => void;
  loadWorkout: (workout: SavedWorkout) => void;

  // Сессия выполнения
  session: WorkoutSession | null;
  startSession: (name: string) => void;
  nextSet: () => void;
  skipExercise: () => void;
  finishSession: () => CompletedWorkout;
  cancelSession: () => void;
  tickSession: () => void; // обновляет elapsedSeconds

  // История
  completedWorkouts: CompletedWorkout[];

  // Хелперы
  getExerciseForBuilder: (builderEx: BuilderExercise) => Exercise | undefined;
  getBuilderCalories: (builderEx: BuilderExercise, userWeight: number) => number;
  getBuilderDuration: (builderEx: BuilderExercise) => number;
  getTotalBuilderCalories: () => number;
  getTotalBuilderDuration: () => number;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// ============================================
// LOCALSTORAGE KEYS
// ============================================

const LS_SAVED_WORKOUTS = 'interfit_saved_workouts';
const LS_COMPLETED_WORKOUTS = 'interfit_completed_workouts';

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// ============================================
// ХЕЛПЕР: BuilderExercise → WorkoutExercise
// ============================================

function toWorkoutExercise(b: BuilderExercise): WorkoutExercise {
  return {
    id: b.uid,
    exerciseId: b.exerciseId,
    order: 0,
    sets: b.sets,
    reps: b.reps,
    duration: b.duration,
    rest: b.rest,
    weight: b.weight,
    distance: b.distance,
    speed: b.speed,
    intensity: b.intensity,
  };
}

// ============================================
// PROVIDER
// ============================================

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile, setTodayCalories } = useUser();
  const userWeight = profile?.weight ?? 70;

  const [builderExercises, setBuilderExercises] = useState<BuilderExercise[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>(() =>
    loadJSON(LS_SAVED_WORKOUTS, [])
  );
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>(() =>
    loadJSON(LS_COMPLETED_WORKOUTS, [])
  );
  const [session, setSession] = useState<WorkoutSession | null>(null);

  // Persist
  useEffect(() => {
    localStorage.setItem(LS_SAVED_WORKOUTS, JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);

  useEffect(() => {
    localStorage.setItem(LS_COMPLETED_WORKOUTS, JSON.stringify(completedWorkouts));
  }, [completedWorkouts]);

  // ---- Хелперы ----

  const getExerciseForBuilder = useCallback((b: BuilderExercise): Exercise | undefined => {
    return getExerciseById(b.exerciseId);
  }, []);

  const getBuilderCalories = useCallback((b: BuilderExercise, weight: number): number => {
    const ex = getExerciseById(b.exerciseId);
    if (!ex) return 0;
    return calculateExerciseCalories(ex, toWorkoutExercise(b), weight);
  }, []);

  const getBuilderDuration = useCallback((b: BuilderExercise): number => {
    const ex = getExerciseById(b.exerciseId);
    if (!ex) return 0;
    return calculateExerciseDuration(ex, toWorkoutExercise(b));
  }, []);

  const getTotalBuilderCalories = useCallback((): number => {
    return builderExercises.reduce((sum, b) => sum + getBuilderCalories(b, userWeight), 0);
  }, [builderExercises, userWeight, getBuilderCalories]);

  const getTotalBuilderDuration = useCallback((): number => {
    const totalSec = builderExercises.reduce((sum, b) => sum + getBuilderDuration(b), 0);
    return Math.round(totalSec / 60);
  }, [builderExercises, getBuilderDuration]);

  // ---- Билдер ----

  const addToBuilder = useCallback((exercise: Exercise) => {
    const b: BuilderExercise = {
      uid: crypto.randomUUID(),
      exerciseId: exercise.id,
      sets: exercise.defaults.sets ?? 3,
      reps: exercise.defaults.reps ?? 10,
      duration: exercise.defaults.duration ?? 60,
      rest: exercise.defaults.rest ?? 90,
      weight: exercise.defaults.weight ?? 0,
      distance: exercise.defaults.distance ?? 0,
      speed: exercise.defaults.speed ?? 0,
      intensity: exercise.defaults.intensity ?? 'moderate',
    };
    setBuilderExercises((prev) => [...prev, b]);
  }, []);

  const removeFromBuilder = useCallback((uid: string) => {
    setBuilderExercises((prev) => prev.filter((b) => b.uid !== uid));
  }, []);

  const updateBuilderExercise = useCallback((uid: string, updates: Partial<BuilderExercise>) => {
    setBuilderExercises((prev) =>
      prev.map((b) => (b.uid === uid ? { ...b, ...updates } : b))
    );
  }, []);

  const reorderBuilder = useCallback((fromIndex: number, toIndex: number) => {
    setBuilderExercises((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr;
    });
  }, []);

  const clearBuilder = useCallback(() => {
    setBuilderExercises([]);
  }, []);

  // ---- Сохранённые тренировки ----

  const saveWorkout = useCallback((name: string): SavedWorkout => {
    const workout: SavedWorkout = {
      id: crypto.randomUUID(),
      name,
      exercises: [...builderExercises],
      createdAt: new Date().toISOString(),
    };
    setSavedWorkouts((prev) => [workout, ...prev]);
    return workout;
  }, [builderExercises]);

  const deleteSavedWorkout = useCallback((id: string) => {
    setSavedWorkouts((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const loadWorkout = useCallback((workout: SavedWorkout) => {
    setBuilderExercises(workout.exercises.map((e) => ({ ...e, uid: crypto.randomUUID() })));
  }, []);

  // ---- Сессия выполнения ----

  const startSession = useCallback((name: string) => {
    if (builderExercises.length === 0) return;
    setSession({
      workoutName: name,
      exercises: [...builderExercises],
      currentExerciseIndex: 0,
      currentSet: 1,
      phase: 'exercise',
      startedAt: Date.now(),
      completedExercises: 0,
      totalCalories: 0,
      elapsedSeconds: 0,
    });
  }, [builderExercises]);

  const nextSet = useCallback(() => {
    setSession((prev) => {
      if (!prev || prev.phase === 'done') return prev;

      const currentBEx = prev.exercises[prev.currentExerciseIndex];
      const exercise = getExerciseById(currentBEx.exerciseId);
      if (!exercise) return prev;

      const totalSets = currentBEx.sets;

      if (prev.phase === 'rest') {
        // Отдых закончен → следующий подход
        return { ...prev, phase: 'exercise', currentSet: prev.currentSet + 1 };
      }

      // Завершён подход
      if (prev.currentSet < totalSets) {
        // Есть ещё подходы → отдых
        return { ...prev, phase: 'rest' };
      }

      // Все подходы завершены → калории за упражнение
      const cals = calculateExerciseCalories(exercise, toWorkoutExercise(currentBEx), userWeight);
      const nextIndex = prev.currentExerciseIndex + 1;

      if (nextIndex >= prev.exercises.length) {
        // Тренировка завершена
        return {
          ...prev,
          phase: 'done',
          completedExercises: prev.completedExercises + 1,
          totalCalories: prev.totalCalories + cals,
        };
      }

      // Следующее упражнение
      return {
        ...prev,
        currentExerciseIndex: nextIndex,
        currentSet: 1,
        phase: 'exercise',
        completedExercises: prev.completedExercises + 1,
        totalCalories: prev.totalCalories + cals,
      };
    });
  }, [userWeight]);

  const skipExercise = useCallback(() => {
    setSession((prev) => {
      if (!prev || prev.phase === 'done') return prev;

      const nextIndex = prev.currentExerciseIndex + 1;
      if (nextIndex >= prev.exercises.length) {
        return { ...prev, phase: 'done' };
      }
      return {
        ...prev,
        currentExerciseIndex: nextIndex,
        currentSet: 1,
        phase: 'exercise',
      };
    });
  }, []);

  const finishSession = useCallback((): CompletedWorkout => {
    const s = session!;
    const elapsed = Math.round((Date.now() - s.startedAt) / 1000);
    const completed: CompletedWorkout = {
      id: crypto.randomUUID(),
      name: s.workoutName,
      date: getLocalDateKey(new Date()),
      exercises: s.completedExercises,
      duration: Math.round(elapsed / 60),
      calories: s.totalCalories,
    };

    setCompletedWorkouts((prev) => [completed, ...prev]);
    setTodayCalories((prev: number) => prev + s.totalCalories);
    setSession(null);
    return completed;
  }, [session, setTodayCalories]);

  const cancelSession = useCallback(() => {
    setSession(null);
  }, []);

  const tickSession = useCallback(() => {
    setSession((prev) => {
      if (!prev || prev.phase === 'done') return prev;
      return { ...prev, elapsedSeconds: Math.round((Date.now() - prev.startedAt) / 1000) };
    });
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        builderExercises,
        addToBuilder,
        removeFromBuilder,
        updateBuilderExercise,
        reorderBuilder,
        clearBuilder,
        savedWorkouts,
        saveWorkout,
        deleteSavedWorkout,
        loadWorkout,
        session,
        startSession,
        nextSet,
        skipExercise,
        finishSession,
        cancelSession,
        tickSession,
        completedWorkouts,
        getExerciseForBuilder,
        getBuilderCalories,
        getBuilderDuration,
        getTotalBuilderCalories,
        getTotalBuilderDuration,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = (): WorkoutContextType => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider');
  return ctx;
};
