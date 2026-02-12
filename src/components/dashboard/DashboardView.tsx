import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

import { useUser } from '@/contexts/UserContext';
import CaloriesWidget from '@/components/dashboard/CaloriesWidget';
import CircularProgress from '@/components/dashboard/CircularProgress';
import { Workout } from '@/data/workouts';
import { presetWorkouts } from '@/data/workouts';

interface DashboardViewProps {
  onOpenConstructor: () => void;
  onOpenWorkouts: () => void;
  onSelectWorkout: (workout: Workout) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenConstructor,
  onOpenWorkouts,
  onSelectWorkout,
}) => {
  const { customWorkouts, getWeekProgress } = useUser();
  const favoriteWorkouts = customWorkouts.filter(w => w.isFavorite);
  const totalWorkouts = presetWorkouts.length + favoriteWorkouts.length;
  const { current, goal } = getWeekProgress();
  const percentage = goal > 0
    ? Math.min(Math.round((current / goal) * 100), 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background px-5 pt-safe-top pb-24"
    >
      {/* Calories Widget */}
      <CaloriesWidget />

      {/* Stacked Cards */}
      <div className="space-y-4 mt-6">
        {/* Constructor Card - Blue Gradient */}
        <motion.button
          type="button"
          onClick={onOpenConstructor}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full text-left active:scale-[0.98] transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <span className="text-3xl">💪</span>
              </div>

              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full mb-3">
                  <span className="text-xs font-semibold text-white uppercase tracking-wide">Конструктор</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Создай свою тренировку</h3>
                <p className="text-sm text-white/90">
                  Собери идеальную программу из 50+ упражнений
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onOpenConstructor(); }}
              className="w-full py-3 px-6 bg-white text-blue-600 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              style={{ touchAction: 'manipulation' }}
            >
              Начать
              <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </motion.button>

        {/* Workouts Card - Orange Gradient */}
        <motion.button
          type="button"
          onClick={onOpenWorkouts}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full text-left active:scale-[0.98] transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <span className="text-3xl">🏃</span>
              </div>

              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full mb-3">
                  <span className="text-xs font-semibold text-white uppercase tracking-wide">Тренировки</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Готовые тренировки</h3>
                <div className="mt-3">
                  <span className="text-5xl font-extralight text-white">
                    {totalWorkouts}
                  </span>
                  <p className="text-sm text-white/90 mt-2">
                    готовых программ
                  </p>
                  {favoriteWorkouts.length > 0 && (
                    <p className="text-xs text-white/80 mt-1">
                      {favoriteWorkouts.length} избранных
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.button>

        {/* Analytics Card - Green Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full"
        >
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <span className="text-3xl">📊</span>
                  </div>

                  <div className="flex-1">
                    <div className="inline-block px-3 py-1 bg-white/20 rounded-full mb-3">
                      <span className="text-xs font-semibold text-white uppercase tracking-wide">Аналитика</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Анализ недели</h3>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-2">
                    <span className="text-5xl font-extralight text-white">{current}</span>
                    <span className="text-white/80 text-lg ml-2 font-medium">/ {goal}</span>
                  </div>
                  <p className="text-sm text-white/90 font-medium">
                    ккал сожжено за неделю
                  </p>
                </div>
              </div>

              <div className="ml-4">
                <CircularProgress value={percentage} size={90} strokeWidth={8} delay={0.3} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
