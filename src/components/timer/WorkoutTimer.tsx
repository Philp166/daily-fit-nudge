import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, SkipForward, Square, ChevronRight, Flame, Target, Trophy, Minimize2 } from 'lucide-react';
import DumbbellIcon from '@/components/ui/DumbbellIcon';
import ActivityIcon from '@/components/ui/ActivityIcon';
import { Exercise, getExerciseById, calculateCalories, getExerciseIconComponent } from '@/data/exercises';
import { useUser } from '@/contexts/UserContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WorkoutExercise {
  id?: string;
  exerciseId: string;
  sets: number;
  workTime: number;
  restTime: number;
}

interface TimerState {
  currentExerciseIndex: number;
  currentSet: number;
  timeLeft: number;
  totalCalories: number;
  phase: 'work' | 'rest';
}

interface WorkoutTimerProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: WorkoutExercise[];
  workoutName: string;
  onMinimize?: (state: TimerState) => void;
  onStateUpdate?: (state: TimerState) => void;
  isMinimized?: boolean;
}

type Phase = 'work' | 'rest';

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  isOpen,
  onClose,
  exercises,
  workoutName,
  onMinimize,
  onStateUpdate,
  isMinimized = false,
}) => {
  const { profile, addWorkoutSession } = useUser();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<Phase>('work');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [actualWorkSeconds, setActualWorkSeconds] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [totalSetsCompleted, setTotalSetsCompleted] = useState(0);
  const [showStopDialog, setShowStopDialog] = useState(false);

  const currentWorkoutExercise = exercises[currentExerciseIndex];
  const currentExercise = currentWorkoutExercise
    ? getExerciseById(currentWorkoutExercise.exerciseId)
    : undefined;

  const nextExercise = exercises[currentExerciseIndex + 1]
    ? getExerciseById(exercises[currentExerciseIndex + 1].exerciseId)
    : undefined;

  // Initialize and start timer when opened
  useEffect(() => {
    if (isOpen && !isMinimized && exercises.length > 0 && !isRunning) {
      // Start the timer
      setIsRunning(true);
      if (!workoutStartTime) {
        setWorkoutStartTime(new Date());
      }
      // Set initial time if not already set
      if (timeLeft === 0) {
        setTimeLeft(Math.min(exercises[0].workTime, 59 * 60 + 59));
      }
    }
  }, [isOpen, isMinimized, exercises, isRunning, workoutStartTime, timeLeft]);

  // Reset all state when timer fully closes (not minimized)
  useEffect(() => {
    if (!isOpen && !isMinimized) {
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
      setPhase('work');
      setTimeLeft(0);
      setIsRunning(false);
      setIsPaused(false);
      setTotalCaloriesBurned(0);
      setActualWorkSeconds(0);
      setWorkoutStartTime(null);
      setIsComplete(false);
      setTotalSetsCompleted(0);
    }
  }, [isOpen, isMinimized]);

  // Update parent state continuously when minimized
  useEffect(() => {
    if (isMinimized && onStateUpdate) {
      onStateUpdate({
        currentExerciseIndex,
        currentSet,
        timeLeft,
        totalCalories: totalCaloriesBurned,
        phase,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMinimized, currentExerciseIndex, currentSet, timeLeft, totalCaloriesBurned, phase]);

  // Calculate calories per second during work
  const calculateCaloriesPerSecond = useCallback(() => {
    if (!currentExercise || !profile || phase !== 'work') return 0;
    // Calories = MET × weight(kg) × time(hours)
    // Per second = MET × weight × (1/3600)
    return (currentExercise.met * profile.weight) / 3600;
  }, [currentExercise, profile, phase]);

  // Timer logic
  useEffect(() => {
    if (!isRunning || isPaused || isComplete) return;

    const interval = setInterval(() => {
      // Add calories and track actual work time during work phase
      if (phase === 'work') {
        setTotalCaloriesBurned(prev => prev + calculateCaloriesPerSecond());
        setActualWorkSeconds(prev => prev + 1);
      }

      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - move to next phase
          if (phase === 'work') {
            // Check if there's a rest phase
            if (currentWorkoutExercise.restTime > 0) {
              setPhase('rest');
              return Math.min(currentWorkoutExercise.restTime, maxTimerSeconds);
            } else {
              // No rest, go to next set/exercise
              return handleNextSetOrExercise();
            }
          } else {
            // Rest phase complete
            return handleNextSetOrExercise();
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, phase, currentExerciseIndex, currentSet, isComplete, calculateCaloriesPerSecond]);

  const maxTimerSeconds = 59 * 60 + 59;
  const handleNextSetOrExercise = (): number => {
    if (currentSet < currentWorkoutExercise.sets) {
      // More sets remaining
      setCurrentSet((prev) => prev + 1);
      setTotalSetsCompleted((prev) => prev + 1);
      setPhase('work');
      return Math.min(currentWorkoutExercise.workTime, maxTimerSeconds);
    } else if (currentExerciseIndex < exercises.length - 1) {
      // More exercises remaining
      setTotalSetsCompleted((prev) => prev + 1);
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSet(1);
      setPhase('work');
      return Math.min(exercises[currentExerciseIndex + 1].workTime, maxTimerSeconds);
    } else {
      // Workout complete!
      setTotalSetsCompleted((prev) => prev + 1);
      handleWorkoutComplete();
      return 0;
    }
  };

  const handleWorkoutComplete = () => {
    setIsComplete(true);
    setIsRunning(false);

    if (workoutStartTime) {
      const duration = Math.round(
        (new Date().getTime() - workoutStartTime.getTime()) / 60000
      );
      addWorkoutSession({
        name: workoutName,
        duration: Math.max(1, duration),
        actualWorkTime: actualWorkSeconds,
        caloriesBurned: Math.round(totalCaloriesBurned),
        exercisesCount: exercises.length,
        setsCount: totalSetsCompleted,
      });
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const skipPhase = () => {
    if (phase === 'work') {
      if (currentWorkoutExercise.restTime > 0) {
        setPhase('rest');
        setTimeLeft(Math.min(currentWorkoutExercise.restTime, maxTimerSeconds));
      } else {
        const nextTime = handleNextSetOrExercise();
        setTimeLeft(nextTime);
      }
    } else {
      const nextTime = handleNextSetOrExercise();
      setTimeLeft(nextTime);
    }
  };

  const handlePrevSetOrExercise = () => {
    if (phase === 'rest') {
      setPhase('work');
      setTimeLeft(Math.min(currentWorkoutExercise.workTime, maxTimerSeconds));
      return;
    }
    if (currentSet > 1) {
      setCurrentSet((prev) => prev - 1);
      setPhase('work');
      setTimeLeft(Math.min(currentWorkoutExercise.workTime, maxTimerSeconds));
    } else if (currentExerciseIndex > 0) {
      const prevEx = exercises[currentExerciseIndex - 1];
      setCurrentExerciseIndex((prev) => prev - 1);
      setCurrentSet(prevEx.sets);
      setPhase('work');
      setTimeLeft(Math.min(prevEx.workTime, maxTimerSeconds));
    }
  };


  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize({
        currentExerciseIndex,
        currentSet,
        timeLeft,
        totalCalories: totalCaloriesBurned,
        phase,
      });
    }
  };

  const confirmStopWorkout = () => {
    if (workoutStartTime && totalCaloriesBurned > 0) {
      const duration = Math.round(
        (new Date().getTime() - workoutStartTime.getTime()) / 60000
      );

      addWorkoutSession({
        name: workoutName,
        duration: Math.max(1, duration),
        actualWorkTime: actualWorkSeconds,
        caloriesBurned: Math.round(totalCaloriesBurned),
        exercisesCount: currentExerciseIndex + 1,
        setsCount: totalSetsCompleted,
      });
    }
    setShowStopDialog(false);
    onClose();
  };

  const stopWorkout = () => {
    setShowStopDialog(true);
  };

  const formatTime = (seconds: number): string => {
    const total = Math.min(seconds, 59 * 60 + 59);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get exercise icon component
  const ExerciseIcon = currentExercise ? getExerciseIconComponent(currentExercise.iconType) : DumbbellIcon;
  const NextExerciseIcon = nextExercise ? getExerciseIconComponent(nextExercise.iconType) : DumbbellIcon;

  // Show timer UI when open and not minimized
  const shouldShowUI = isOpen && !isMinimized;

  return (
    <AnimatePresence>
      {(isOpen || isMinimized) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: shouldShowUI ? 1 : 0 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 transition-colors duration-500 ${
            isComplete ? 'bg-background' : phase === 'work' ? 'bg-primary' : 'bg-muted'
          } ${!shouldShowUI ? 'pointer-events-none' : ''}`}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-safe-top pb-4">
              <div>
                <p className="text-caption text-foreground/60 uppercase tracking-wide">
                  {phase === 'work' ? 'Работа' : 'Отдых'}
                </p>
                <h1 className="text-title text-foreground">{workoutName}</h1>
              </div>
              <div className="flex gap-2">
                {onMinimize && (
                  <button
                    type="button"
                    onClick={handleMinimize}
                    className="w-10 h-10 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
                    style={{ touchAction: 'manipulation' }}
                    aria-label="Свернуть"
                  >
                    <Minimize2 size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Main Content */}
            {isComplete ? (
              <div className="flex-1 flex flex-col items-center justify-center px-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-3xl glass flex items-center justify-center mb-6"
                >
                  <Trophy size={40} className="text-primary" />
                </motion.div>
                <h2 className="text-display-sm text-extralight text-foreground mb-2">
                  Отлично!
                </h2>
                <p className="text-body text-foreground/70 mb-8">Тренировка завершена</p>

                <div className="w-full space-y-3 mb-8">
                  <div className="glass rounded-3xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center">
                        <Flame size={20} className="text-primary" />
                      </div>
                      <span className="text-body text-foreground/70">Калорий сожжено</span>
                    </div>
                    <span className="text-title text-foreground">{Math.round(totalCaloriesBurned)} ккал</span>
                  </div>
                  <div className="glass rounded-3xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center">
                        <ActivityIcon size={20} />
                      </div>
                      <span className="text-body text-foreground/70">Упражнений</span>
                    </div>
                    <span className="text-title text-foreground">{exercises.length}</span>
                  </div>
                  <div className="glass rounded-3xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center">
                        <Target size={20} className="text-primary" />
                      </div>
                      <span className="text-body text-foreground/70">Подходов</span>
                    </div>
                    <span className="text-title text-foreground">{totalSetsCompleted}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl bg-foreground text-background text-body active:scale-95 transition-transform"
                  style={{ touchAction: 'manipulation' }}
                >
                  Готово
                </button>
              </div>
            ) : (
              <>
                {/* Timer Display */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  {currentExercise && (
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 rounded-3xl glass mx-auto mb-4 flex items-center justify-center">
                        <ExerciseIcon size={40} className="text-primary" strokeWidth={1.5} />
                      </div>
                      <h2 className="text-title text-foreground mb-2">
                        {currentExercise.name}
                      </h2>
                      <p className="text-body text-foreground/60">
                        Подход {currentSet} из {currentWorkoutExercise.sets}
                      </p>
                    </div>
                  )}

                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-display text-extralight text-foreground mb-8"
                    style={{ fontSize: '5rem' }}
                  >
                    {formatTime(timeLeft)}
                  </motion.div>

                  <div className="glass rounded-2xl px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Flame size={20} className="text-primary" />
                      <span className="text-title text-foreground">
                        {Math.round(totalCaloriesBurned)} ккал
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Exercise Preview */}
                {nextExercise && currentSet === currentWorkoutExercise.sets && (
                  <div className="px-5 mb-4">
                    <div className="glass rounded-3xl p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
                        <NextExerciseIcon size={24} className="text-foreground/70" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <p className="text-badge text-foreground/50">Следующее</p>
                        <p className="text-body text-foreground">{nextExercise.name}</p>
                      </div>
                      <ChevronRight size={20} className="text-foreground/50" />
                    </div>
                  </div>
                )}

                {/* Controls — как на референсе: Стоп | Пауза | След. подход */}
                <div className="px-5 pb-safe-bottom mb-8">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={stopWorkout}
                      className="w-14 h-14 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <Square size={24} />
                    </button>
                    <button
                      type="button"
                      onClick={togglePause}
                      className="w-20 h-20 rounded-3xl bg-foreground flex items-center justify-center active:scale-90 transition-transform shadow-md"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {isPaused ? (
                        <Play size={32} className="text-background ml-1" />
                      ) : (
                        <Pause size={32} className="text-background" />
                      )}
                    </button>
                    <button
                      type="button"
                      aria-label="Следующий подход"
                      onClick={skipPhase}
                      className="w-14 h-14 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <SkipForward size={24} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Stop Confirmation Dialog */}
      <AlertDialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Остановить тренировку?</AlertDialogTitle>
            <AlertDialogDescription>
              Прогресс тренировки будет сохранен. Вы уверены, что хотите остановить таймер?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStopWorkout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Да, остановить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatePresence>
  );
};

export default WorkoutTimer;
