import React from 'react';
import { motion } from 'framer-motion';

import { useUser } from '@/contexts/UserContext';
import CaloriesWidget from '@/components/dashboard/CaloriesWidget';
import CircularProgress from '@/components/dashboard/CircularProgress';

const DashboardView: React.FC = () => {
  const { profile } = useUser();

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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full"
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
                  Скоро здесь появится конструктор тренировок
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Workouts Card - Orange Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full"
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
                <p className="text-sm text-white/90 mt-3">
                  Скоро здесь появится библиотека тренировок
                </p>
              </div>
            </div>
          </div>
        </motion.div>

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
                    <span className="text-5xl font-extralight text-white">0</span>
                    <span className="text-white/80 text-lg ml-2 font-medium">/ {(profile?.dailyCalorieGoal || 500) * 7}</span>
                  </div>
                  <p className="text-sm text-white/90 font-medium">
                    ккал сожжено за неделю
                  </p>
                </div>
              </div>

              <div className="ml-4">
                <CircularProgress value={0} size={90} strokeWidth={8} delay={0.3} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
