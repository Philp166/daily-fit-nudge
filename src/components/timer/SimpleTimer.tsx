import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, Square, SkipForward, Minimize2, Plus, Minus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import TimeInput from '@/components/ui/TimeInput';
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

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, min, max, step = 1, label }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      onChange(Math.max(min, Math.min(max, parsed)));
    } else {
      setInputValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="glass rounded-3xl p-6">
      <p className="text-caption text-foreground/60 mb-4 text-center">{label}</p>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-14 h-14 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          <Minus size={24} />
        </button>

        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-24 text-center text-display text-extralight bg-transparent outline-none border-b-2 border-primary text-foreground"
            min={min}
            max={max}
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="text-display text-extralight text-foreground cursor-pointer hover:text-primary transition-colors"
          >
            {value}
          </span>
        )}
        
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-14 h-14 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export interface SimpleTimerMinimizedState {
  currentSet: number;
  timeLeft: number;
  phase: 'work' | 'rest';
  sets: number;
  workTime: number;
  restTime: number;
  totalCalories: number;
}

interface SimpleTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: (state: SimpleTimerMinimizedState) => void;
  isMinimized?: boolean;
  onStateUpdate?: (state: SimpleTimerMinimizedState) => void;
}

type Phase = 'work' | 'rest' | 'idle';

const SimpleTimer: React.FC<SimpleTimerProps> = ({ isOpen, onClose, onMinimize, isMinimized = false, onStateUpdate }) => {
  const { profile, addWorkoutSession } = useUser();
  
  // Settings
  const [sets, setSets] = useState(3);
  const [workTime, setWorkTime] = useState(45);
  const [restTime, setRestTime] = useState(15);
  
  // Timer state
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [actualWorkSeconds, setActualWorkSeconds] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);

  // Average MET for general exercise (moderate intensity)
  const averageMET = 5.0;

  // Reset when closed (but NOT when minimized)
  useEffect(() => {
    if (!isOpen && !isMinimized) {
      setPhase('idle');
      setIsRunning(false);
      setCurrentSet(1);
      setTimeLeft(0);
      setTotalCaloriesBurned(0);
      setActualWorkSeconds(0);
      setWorkoutStartTime(null);
      setIsComplete(false);
    }
  }, [isOpen, isMinimized]);

  // Синхронизация состояния в виджет при свёрнутом таймере
  useEffect(() => {
    if (isMinimized && (phase === 'work' || phase === 'rest') && onStateUpdate) {
      onStateUpdate({
        currentSet,
        timeLeft,
        phase,
        sets,
        workTime,
        restTime,
        totalCalories: totalCaloriesBurned,
      });
    }
  }, [isMinimized, phase, currentSet, timeLeft, sets, workTime, restTime, totalCaloriesBurned, onStateUpdate]);

  // Блокируем скролл страницы, когда открыт таймер — скролл только внутри панели
  useEffect(() => {
    if (isOpen && !isMinimized) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMinimized]);

  // Calculate calories per second during work
  const calculateCaloriesPerSecond = useCallback(() => {
    if (!profile || phase !== 'work') return 0;
    // Calories = MET × weight(kg) × time(hours)
    // Per second = MET × weight × (1/3600)
    return (averageMET * profile.weight) / 3600;
  }, [profile, phase]);

  // Timer logic
  useEffect(() => {
    if (!isRunning || phase === 'idle' || isComplete) return;

    const interval = setInterval(() => {
      // Add calories and track actual work time during work phase
      if (phase === 'work') {
        setTotalCaloriesBurned(prev => prev + calculateCaloriesPerSecond());
        setActualWorkSeconds(prev => prev + 1);
      }

      setTimeLeft(prev => {
        if (prev <= 1) {
          // Phase complete
          if (phase === 'work') {
            if (currentSet < sets && restTime > 0) {
              setPhase('rest');
              return restTime;
            } else if (currentSet < sets) {
              setCurrentSet(s => s + 1);
              return workTime;
            } else {
              handleComplete();
              return 0;
            }
          } else if (phase === 'rest') {
            if (currentSet < sets) {
              setCurrentSet(s => s + 1);
              setPhase('work');
              return workTime;
            } else {
              handleComplete();
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, currentSet, sets, workTime, restTime, isComplete, calculateCaloriesPerSecond]);

  const handleComplete = () => {
    setIsComplete(true);
    setIsRunning(false);
    setPhase('idle');

    if (workoutStartTime && profile) {
      const duration = Math.round(
        (new Date().getTime() - workoutStartTime.getTime()) / 60000
      );

      addWorkoutSession({
        name: 'Интервальная тренировка',
        duration: Math.max(1, duration),
        actualWorkTime: actualWorkSeconds,
        caloriesBurned: Math.round(totalCaloriesBurned),
        exercisesCount: 1,
        setsCount: sets,
      });
    }
  };

  const startTimer = () => {
    setPhase('work');
    setTimeLeft(workTime);
    setIsRunning(true);
    setCurrentSet(1);
    setTotalCaloriesBurned(0);
    setActualWorkSeconds(0);
    setWorkoutStartTime(new Date());
    setIsComplete(false);
  };

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const confirmStopTimer = () => {
    if (workoutStartTime && totalCaloriesBurned > 0 && profile) {
      const duration = Math.round(
        (new Date().getTime() - workoutStartTime.getTime()) / 60000
      );
      addWorkoutSession({
        name: 'Интервальная тренировка',
        duration: Math.max(1, duration),
        actualWorkTime: actualWorkSeconds,
        caloriesBurned: Math.round(totalCaloriesBurned),
        exercisesCount: 1,
        setsCount: currentSet,
      });
    }
    setPhase('idle');
    setIsRunning(false);
    setWorkoutStartTime(null);
    setShowStopDialog(false);
    onClose();
  };

  const stopTimer = () => {
    setShowStopDialog(true);
  };

  const skipToNextSet = () => {
    if (phase === 'rest') {
      if (currentSet < sets) {
        setCurrentSet((s) => s + 1);
        setPhase('work');
        setTimeLeft(workTime);
      }
    } else {
      if (currentSet < sets && restTime > 0) {
        setPhase('rest');
        setTimeLeft(restTime);
      } else if (currentSet < sets) {
        setCurrentSet((s) => s + 1);
        setTimeLeft(workTime);
      } else {
        handleComplete();
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const total = Math.min(seconds, 59 * 60 + 59);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show timer UI when open and not minimized
  const shouldShowUI = isOpen && !isMinimized;

  return (
    <AnimatePresence>
      {(isOpen || isMinimized) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: shouldShowUI ? 1 : 0 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 transition-colors duration-500 overflow-hidden flex flex-col ${
            phase === 'work' ? 'bg-primary' : phase === 'rest' ? 'bg-muted' : 'bg-background'
          } ${!shouldShowUI ? 'pointer-events-none' : ''}`}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full min-h-0 flex flex-col flex-1 overflow-y-auto overscroll-contain pb-20 hide-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Header: на главном экране (idle) кнопки справа нет; в работающем таймере — только «Свернуть» */}
            <div className="flex items-center justify-between px-5 pt-safe-top pb-4">
              <div>
                <p className="text-caption text-foreground/60 uppercase tracking-wide">
                  {phase === 'work' ? 'Работа' : phase === 'rest' ? 'Отдых' : ''}
                </p>
                <h1 className="text-title text-foreground">Таймер</h1>
              </div>
              {phase !== 'idle' && (
                <div className="flex gap-2">
                  {onMinimize && (
                    <button
                      type="button"
                      onClick={() => onMinimize({
                        currentSet,
                        timeLeft,
                        phase: phase === 'work' ? 'work' : 'rest',
                        sets,
                        workTime,
                        restTime,
                        totalCalories: totalCaloriesBurned,
                      })}
                      className="w-10 h-10 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="Свернуть"
                    >
                      <Minimize2 size={20} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Main Content */}
            {isComplete ? (
              <div className="flex-1 flex flex-col items-center justify-center px-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-3xl glass flex items-center justify-center mb-6"
                >
                  <span className="text-4xl">✨</span>
                </motion.div>
                <h2 className="text-display-sm text-extralight text-foreground mb-2">
                  Отлично!
                </h2>
                <p className="text-body text-foreground/70 mb-8">Тренировка завершена</p>

                <div className="w-full space-y-3 mb-8">
                  <div className="glass rounded-2xl p-4 flex justify-between">
                    <span className="text-body text-foreground/70">Калорий сожжено</span>
                    <span className="text-body text-foreground">{Math.round(totalCaloriesBurned)} ккал</span>
                  </div>
                  <div className="glass rounded-2xl p-4 flex justify-between">
                    <span className="text-body text-foreground/70">Подходов</span>
                    <span className="text-body text-foreground">{sets}</span>
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
            ) : phase === 'idle' ? (
              /* Settings Mode */
              <div className="flex-1 flex flex-col px-5">
                <div className="flex-1 space-y-4 mt-4">
                  <NumberInput
                    label="Подходы"
                    value={sets}
                    onChange={setSets}
                    min={1}
                    max={20}
                  />
                  <TimeInput
                    label="Время работы"
                    value={workTime}
                    onChange={setWorkTime}
                    minSeconds={5}
                    maxSeconds={59 * 60 + 59}
                  />
                  <TimeInput
                    label="Время отдыха"
                    value={restTime}
                    onChange={setRestTime}
                    minSeconds={0}
                    maxSeconds={59 * 60 + 59}
                  />
                </div>

                {/* Start Button */}
                <div className="pb-8 pt-4">
                  <button
                    type="button"
                    onClick={startTimer}
                    className="w-full py-4 rounded-2xl bg-primary text-primary-foreground text-body font-medium active:scale-95 transition-transform"
                    style={{ touchAction: 'manipulation' }}
                  >
                    Начать тренировку
                  </button>
                </div>
              </div>
            ) : (
              /* Timer Running */
              <>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <p className="text-body text-foreground/60 mb-2">
                    Подход {currentSet} из {sets}
                  </p>

                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-display text-extralight text-foreground mb-8"
                    style={{ fontSize: '5rem' }}
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

                {/* Controls — как в таймере из конструктора: Стоп | Пауза | След. подход */}
                <div className="px-5 pb-safe-bottom mb-8">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      aria-label="Стоп"
                      onClick={stopTimer}
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
                      {isRunning ? (
                        <Pause size={32} className="text-background" />
                      ) : (
                        <Play size={32} className="text-background ml-1" />
                      )}
                    </button>
                    <button
                      type="button"
                      aria-label="Следующий подход"
                      onClick={skipToNextSet}
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
            <AlertDialogAction onClick={confirmStopTimer} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Да, остановить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatePresence>
  );
};

export default SimpleTimer;
