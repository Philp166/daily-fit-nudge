import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SkipForward, Check, Pause, Play } from 'lucide-react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { getExerciseById } from '@/data/exercises';
import { formatDuration } from '@/utils/exerciseCalculations';

interface WorkoutExecutionViewProps {
  onFinish: () => void;
  onCancel: () => void;
}

const WorkoutExecutionView: React.FC<WorkoutExecutionViewProps> = ({ onFinish, onCancel }) => {
  const { session, nextSet, skipExercise, tickSession } = useWorkout();
  const [paused, setPaused] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Тик таймера каждую секунду
  useEffect(() => {
    if (paused || !session || session.phase === 'done') {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
      return;
    }
    tickRef.current = setInterval(tickSession, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [paused, session?.phase, tickSession]);

  // Авто-переход при «done»
  useEffect(() => {
    if (session?.phase === 'done') {
      onFinish();
    }
  }, [session?.phase, onFinish]);

  if (!session) return null;

  const currentBEx = session.exercises[session.currentExerciseIndex];
  const exercise = currentBEx ? getExerciseById(currentBEx.exerciseId) : undefined;
  const totalExercises = session.exercises.length;
  const progress = totalExercises > 0
    ? Math.round(((session.completedExercises) / totalExercises) * 100)
    : 0;

  const isRest = session.phase === 'rest';

  return (
    <div className="bg-white min-h-screen min-w-[390px] w-full flex flex-col pt-safe-top">
      {/* Шапка */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex items-center justify-between px-4 pt-6 pb-2 shrink-0"
      >
        <h1 className="text-xl font-semibold text-[#030032] truncate flex-1">
          {session.workoutName}
        </h1>
        <button
          type="button"
          onClick={() => setShowCancelConfirm(true)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[#f4f4f4] text-[#030032] active:opacity-80 ml-2"
          aria-label="Отменить тренировку"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </motion.div>

      {/* Прогресс-бар */}
      <div className="px-4 pb-2 shrink-0">
        <div className="h-2 rounded-full bg-[#efefef] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#fc7a18]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-[#030032]/50">
            {session.completedExercises}/{totalExercises} упражнений
          </span>
          <span className="text-xs text-[#030032]/50">
            {formatDuration(session.elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Главная область */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${session.currentExerciseIndex}-${session.phase}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full flex flex-col items-center"
          >
            {isRest ? (
              /* --- Фаза отдыха --- */
              <>
                <div className="w-28 h-28 rounded-full bg-[#006776]/10 flex items-center justify-center mb-6">
                  <span className="text-5xl">😮‍💨</span>
                </div>
                <h2 className="text-2xl font-bold text-[#030032] mb-2">Отдых</h2>
                <p className="text-[#030032]/50 text-base mb-1">
                  {currentBEx.rest} сек
                </p>
                <p className="text-[#030032]/40 text-sm">
                  Следующий: подход {session.currentSet + 1} из {currentBEx.sets}
                </p>
              </>
            ) : (
              /* --- Фаза упражнения --- */
              <>
                <div className="w-28 h-28 rounded-full bg-[#fc7a18]/10 flex items-center justify-center mb-6">
                  <span className="text-5xl">{exercise?.emoji ?? '💪'}</span>
                </div>
                <h2 className="text-2xl font-bold text-[#030032] mb-2 text-center">
                  {exercise?.name ?? 'Упражнение'}
                </h2>
                <p className="text-[#fc7a18] text-lg font-semibold mb-1">
                  Подход {session.currentSet} из {currentBEx.sets}
                </p>
                {currentBEx.reps > 0 && (
                  <p className="text-[#030032]/60 text-base">
                    {currentBEx.reps} повторений
                    {currentBEx.weight > 0 ? ` • ${currentBEx.weight} кг` : ''}
                  </p>
                )}
                {currentBEx.duration > 0 && currentBEx.reps === 0 && (
                  <p className="text-[#030032]/60 text-base">
                    {formatDuration(currentBEx.duration)}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Информация внизу: калории */}
      <div className="px-6 mb-4 shrink-0">
        <div className="flex items-center justify-between rounded-2xl bg-[#efefef] p-4">
          <div>
            <p className="text-xs text-[#030032]/50">Калории</p>
            <p className="text-lg font-bold text-[#030032]">{session.totalCalories} ккал</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#030032]/50">Время</p>
            <p className="text-lg font-bold text-[#030032]">{formatDuration(session.elapsedSeconds)}</p>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="px-4 pb-6 pb-safe-bottom shrink-0">
        <div className="flex gap-3">
          {/* Пауза */}
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#efefef] text-[#030032] active:bg-[#ddd]"
            style={{ touchAction: 'manipulation' }}
            aria-label={paused ? 'Продолжить' : 'Пауза'}
          >
            {paused ? (
              <Play className="h-6 w-6" fill="#030032" />
            ) : (
              <Pause className="h-6 w-6" fill="#030032" />
            )}
          </button>

          {/* Пропустить упражнение */}
          <button
            type="button"
            onClick={skipExercise}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#efefef] text-[#030032] active:bg-[#ddd]"
            style={{ touchAction: 'manipulation' }}
            aria-label="Пропустить"
          >
            <SkipForward className="h-6 w-6" />
          </button>

          {/* Готово / Далее */}
          <motion.button
            type="button"
            onClick={nextSet}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 h-14 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 ${
              isRest
                ? 'bg-[#006776] text-white'
                : 'bg-[#fc7a18] text-white'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <Check className="h-6 w-6" />
            {isRest ? 'Начать подход' : 'Готово'}
          </motion.button>
        </div>
      </div>

      {/* Диалог отмены */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center px-6"
            onClick={() => setShowCancelConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
            >
              <h3 className="text-lg font-semibold text-[#030032] mb-2">Завершить тренировку?</h3>
              <p className="text-[#030032]/60 text-sm mb-5">
                Прогресс за завершённые упражнения будет сохранён.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 h-11 rounded-2xl bg-[#efefef] text-[#030032] font-medium"
                >
                  Продолжить
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelConfirm(false);
                    onCancel();
                  }}
                  className="flex-1 h-11 rounded-2xl bg-red-500 text-white font-medium"
                >
                  Завершить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutExecutionView;
