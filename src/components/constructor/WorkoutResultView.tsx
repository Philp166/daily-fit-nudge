import React from 'react';
import { motion } from 'framer-motion';
import type { CompletedWorkout } from '@/contexts/WorkoutContext';

interface WorkoutResultViewProps {
  result: CompletedWorkout;
  onClose: () => void;
}

const WorkoutResultView: React.FC<WorkoutResultViewProps> = ({ result, onClose }) => {
  return (
    <div className="bg-white min-h-screen min-w-[390px] w-full flex flex-col pt-safe-top">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Анимированная иконка */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-32 h-32 rounded-full bg-[#fc7a18]/10 flex items-center justify-center mb-8"
        >
          <span className="text-6xl">🎉</span>
        </motion.div>

        {/* Заголовок */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-[#030032] mb-2 text-center"
        >
          Отличная работа!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[#030032]/50 text-base mb-10 text-center"
        >
          {result.name}
        </motion.p>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full rounded-3xl bg-[#006776] p-6 mb-6"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-white">{result.calories}</p>
              <p className="text-white/60 text-sm mt-1">ккал</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{result.duration}</p>
              <p className="text-white/60 text-sm mt-1">мин</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{result.exercises}</p>
              <p className="text-white/60 text-sm mt-1">упражн.</p>
            </div>
          </div>
        </motion.div>

        {/* Дата */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#030032]/40 text-sm"
        >
          {new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </motion.p>
      </div>

      {/* Кнопка закрыть */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="px-4 pb-6 pb-safe-bottom shrink-0"
      >
        <button
          type="button"
          onClick={onClose}
          className="w-full h-14 rounded-2xl bg-[#fc7a18] text-white font-semibold text-lg active:opacity-90"
          style={{ touchAction: 'manipulation' }}
        >
          На главную
        </button>
      </motion.div>
    </div>
  );
};

export default WorkoutResultView;
