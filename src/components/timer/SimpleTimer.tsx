import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pause, Play, RotateCcw, Plus, Minus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

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
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
        >
          <Minus size={24} />
        </motion.button>
        
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
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
        >
          <Plus size={24} />
        </motion.button>
      </div>
    </div>
  );
};

interface SimpleTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = 'work' | 'rest' | 'idle';

const SimpleTimer: React.FC<SimpleTimerProps> = ({ isOpen, onClose }) => {
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
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Average MET for general exercise (moderate intensity)
  const averageMET = 5.0;

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setPhase('idle');
      setIsRunning(false);
      setCurrentSet(1);
      setTimeLeft(0);
      setTotalCaloriesBurned(0);
      setWorkoutStartTime(null);
      setIsComplete(false);
    }
  }, [isOpen]);

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
      // Add calories during work phase
      if (phase === 'work') {
        setTotalCaloriesBurned(prev => prev + calculateCaloriesPerSecond());
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
    setWorkoutStartTime(new Date());
    setIsComplete(false);
  };

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setPhase('idle');
    setIsRunning(false);
    setCurrentSet(1);
    setTimeLeft(0);
    setTotalCaloriesBurned(0);
    setWorkoutStartTime(null);
    setIsComplete(false);
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
            phase === 'work' ? 'bg-blue-900' : phase === 'rest' ? 'bg-green-900' : 'bg-background'
          }`}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full flex flex-col overflow-y-auto pb-20"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-safe-top pb-4">
              <div>
                <p className="text-caption text-foreground/60 uppercase tracking-wide">
                  {phase === 'work' ? 'Работа' : phase === 'rest' ? 'Отдых' : 'Настройка'}
                </p>
                <h1 className="text-title text-foreground">Таймер</h1>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
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

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl bg-foreground text-background text-body"
                >
                  Готово
                </motion.button>
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
                  <NumberInput
                    label="Время работы (сек)"
                    value={workTime}
                    onChange={setWorkTime}
                    min={5}
                    max={300}
                    step={5}
                  />
                  <NumberInput
                    label="Время отдыха (сек)"
                    value={restTime}
                    onChange={setRestTime}
                    min={0}
                    max={180}
                    step={5}
                  />
                </div>

                {/* Start Button */}
                <div className="pb-8 pt-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={startTimer}
                    className="w-full py-4 rounded-2xl bg-primary text-primary-foreground text-body font-medium"
                  >
                    Начать тренировку
                  </motion.button>
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

                {/* Controls */}
                <div className="px-5 pb-safe-bottom mb-8">
                  <div className="flex items-center justify-center gap-6">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={resetTimer}
                      className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                    >
                      <RotateCcw size={24} />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePause}
                      className="w-20 h-20 rounded-3xl bg-foreground flex items-center justify-center"
                    >
                      {isRunning ? (
                        <Pause size={32} className="text-background" />
                      ) : (
                        <Play size={32} className="text-background ml-1" />
                      )}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                    >
                      <X size={24} />
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

export default SimpleTimer;
