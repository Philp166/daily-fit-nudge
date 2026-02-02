import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pause, Play, SkipForward, Square, ChevronRight } from 'lucide-react';
import { Exercise, getExerciseById, calculateCalories } from '@/data/exercises';
import { useUser } from '@/contexts/UserContext';

interface WorkoutExercise {
  id?: string;
  exerciseId: string;
  sets: number;
  workTime: number;
  restTime: number;
}

interface WorkoutTimerProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: WorkoutExercise[];
  workoutName: string;
}

type Phase = 'work' | 'rest';

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  isOpen,
  onClose,
  exercises,
  workoutName,
}) => {
  const { profile, addWorkoutSession } = useUser();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<Phase>('work');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [totalSetsCompleted, setTotalSetsCompleted] = useState(0);

  const currentWorkoutExercise = exercises[currentExerciseIndex];
  const currentExercise = currentWorkoutExercise
    ? getExerciseById(currentWorkoutExercise.exerciseId)
    : undefined;

  const nextExercise = exercises[currentExerciseIndex + 1]
    ? getExerciseById(exercises[currentExerciseIndex + 1].exerciseId)
    : undefined;

  // Initialize timer
  useEffect(() => {
    if (isOpen && exercises.length > 0 && !isRunning) {
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
      setPhase('work');
      setTimeLeft(exercises[0].workTime);
      setIsRunning(true);
      setIsPaused(false);
      setTotalCaloriesBurned(0);
      setWorkoutStartTime(new Date());
      setIsComplete(false);
      setTotalSetsCompleted(0);
    }
  }, [isOpen, exercises]);

  // Calculate calories in real-time
  const calculateCurrentCalories = useCallback(() => {
    if (!currentExercise || !profile || phase !== 'work') return 0;
    // Calories per second
    return calculateCalories(currentExercise.met, profile.weight, 1 / 60);
  }, [currentExercise, profile, phase]);

  // Timer logic
  useEffect(() => {
    if (!isRunning || isPaused || isComplete) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - move to next phase
          if (phase === 'work') {
            // Add calories for completed work phase
            if (currentExercise && profile) {
              const calories = calculateCalories(
                currentExercise.met,
                profile.weight,
                currentWorkoutExercise.workTime / 60
              );
              setTotalCaloriesBurned((prev) => prev + calories);
            }

            // Check if there's a rest phase
            if (currentWorkoutExercise.restTime > 0) {
              setPhase('rest');
              return currentWorkoutExercise.restTime;
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

      // Track calories in real-time during work phase
      if (phase === 'work') {
        setTotalCaloriesBurned((prev) => prev + calculateCurrentCalories());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, phase, currentExerciseIndex, currentSet, isComplete]);

  const handleNextSetOrExercise = (): number => {
    if (currentSet < currentWorkoutExercise.sets) {
      // More sets remaining
      setCurrentSet((prev) => prev + 1);
      setTotalSetsCompleted((prev) => prev + 1);
      setPhase('work');
      return currentWorkoutExercise.workTime;
    } else if (currentExerciseIndex < exercises.length - 1) {
      // More exercises remaining
      setTotalSetsCompleted((prev) => prev + 1);
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSet(1);
      setPhase('work');
      return exercises[currentExerciseIndex + 1].workTime;
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
        duration,
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
        setTimeLeft(currentWorkoutExercise.restTime);
      } else {
        const nextTime = handleNextSetOrExercise();
        setTimeLeft(nextTime);
      }
    } else {
      const nextTime = handleNextSetOrExercise();
      setTimeLeft(nextTime);
    }
  };

  const stopWorkout = () => {
    if (workoutStartTime && totalCaloriesBurned > 0) {
      const duration = Math.round(
        (new Date().getTime() - workoutStartTime.getTime()) / 60000
      );

      addWorkoutSession({
        name: workoutName,
        duration: Math.max(1, duration),
        caloriesBurned: Math.round(totalCaloriesBurned),
        exercisesCount: currentExerciseIndex + 1,
        setsCount: totalSetsCompleted,
      });
    }
    onClose();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 transition-colors duration-500 ${
            phase === 'work' ? 'bg-blue-900' : 'bg-green-900'
          }`}
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
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={stopWorkout}
                className="w-10 h-10 rounded-full glass flex items-center justify-center"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Main Content */}
            {isComplete ? (
              <div className="flex-1 flex flex-col items-center justify-center px-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-6"
                >
                  🎉
                </motion.div>
                <h2 className="text-display-sm text-extralight text-foreground mb-2">
                  Отлично!
                </h2>
                <p className="text-body text-foreground/70 mb-8">Тренировка завершена</p>

                <div className="w-full space-y-4 mb-8">
                  <div className="bg-foreground/10 rounded-2xl p-4 flex justify-between">
                    <span className="text-body text-foreground/70">Калорий сожжено</span>
                    <span className="text-body text-foreground">{Math.round(totalCaloriesBurned)} ккал</span>
                  </div>
                  <div className="bg-foreground/10 rounded-2xl p-4 flex justify-between">
                    <span className="text-body text-foreground/70">Упражнений</span>
                    <span className="text-body text-foreground">{exercises.length}</span>
                  </div>
                  <div className="bg-foreground/10 rounded-2xl p-4 flex justify-between">
                    <span className="text-body text-foreground/70">Подходов</span>
                    <span className="text-body text-foreground">{totalSetsCompleted}</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl bg-foreground text-background text-body"
                >
                  Готово
                </motion.button>
              </div>
            ) : (
              <>
                {/* Timer Display */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  {currentExercise && (
                    <div className="text-center mb-8">
                      <span className="text-6xl mb-4 block">{currentExercise.icon}</span>
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
                  >
                    {formatTime(timeLeft)}
                  </motion.div>

                  <div className="text-center">
                    <p className="text-caption text-foreground/50 mb-1">Калории</p>
                    <p className="text-title text-foreground">
                      {Math.round(totalCaloriesBurned)} ккал
                    </p>
                  </div>
                </div>

                {/* Next Exercise Preview */}
                {nextExercise && currentSet === currentWorkoutExercise.sets && (
                  <div className="px-5 mb-4">
                    <div className="bg-foreground/10 rounded-2xl p-4 flex items-center gap-3">
                      <span className="text-2xl">{nextExercise.icon}</span>
                      <div className="flex-1">
                        <p className="text-badge text-foreground/50">Следующее</p>
                        <p className="text-body text-foreground">{nextExercise.name}</p>
                      </div>
                      <ChevronRight size={20} className="text-foreground/50" />
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="px-5 pb-safe-bottom mb-8">
                  <div className="flex items-center justify-center gap-6">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={stopWorkout}
                      className="w-14 h-14 rounded-full glass flex items-center justify-center"
                    >
                      <Square size={24} />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePause}
                      className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center"
                    >
                      {isPaused ? (
                        <Play size={32} className="text-background ml-1" />
                      ) : (
                        <Pause size={32} className="text-background" />
                      )}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={skipPhase}
                      className="w-14 h-14 rounded-full glass flex items-center justify-center"
                    >
                      <SkipForward size={24} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkoutTimer;
