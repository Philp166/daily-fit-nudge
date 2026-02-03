import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Clock, Dumbbell, TrendingUp } from 'lucide-react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import CircularProgress from './CircularProgress';
import { useUser } from '@/contexts/UserContext';

const AnalysisCard: React.FC = () => {
  const { getWeekProgress, workoutSessions, profile } = useUser();
  const { current, goal } = getWeekProgress();
  const percentage = goal > 0 
    ? Math.min(Math.round((current / goal) * 100), 100) 
    : 0;
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Calculate week stats
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weekSessions = workoutSessions.filter(
    s => new Date(s.completedAt) >= startOfWeek
  );

  const totalDuration = weekSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalExercises = weekSessions.reduce((sum, s) => sum + s.exercisesCount, 0);
  const avgCaloriesPerWorkout = weekSessions.length > 0 
    ? Math.round(current / weekSessions.length) 
    : 0;

  return (
    <>
      <WidgetCard 
        delay={0.7} 
        onClick={() => setIsDetailOpen(true)}
        className="cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Badge className="mb-4">Анализ недели</Badge>

            <div className="mt-6">
              <div className="text-title text-foreground mb-1">
                <span className="text-display-sm text-extralight">{current}</span>
                <span className="text-muted-white text-body"> / {goal}</span>
              </div>
              <p className="text-caption text-muted-white">
                ккал сожжено за неделю
              </p>
            </div>
          </div>

          <div className="ml-4">
            <CircularProgress value={percentage} size={90} strokeWidth={8} delay={0.3} />
          </div>
        </div>
      </WidgetCard>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setIsDetailOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-card rounded-t-3xl p-6 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-6" />
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-title text-foreground">Анализ недели</h2>
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center"
                >
                  <X size={18} className="text-foreground/70" />
                </button>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <CircularProgress value={percentage} size={140} strokeWidth={10} delay={0} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-display-sm text-extralight text-foreground">{percentage}%</span>
                    <span className="text-caption text-muted-foreground">выполнено</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame size={16} className="text-primary" />
                    <span className="text-caption text-muted-foreground">Сожжено</span>
                  </div>
                  <div className="text-title text-foreground">{current} <span className="text-body text-muted-foreground">ккал</span></div>
                </div>

                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-primary" />
                    <span className="text-caption text-muted-foreground">Цель</span>
                  </div>
                  <div className="text-title text-foreground">{goal} <span className="text-body text-muted-foreground">ккал</span></div>
                </div>

                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-primary" />
                    <span className="text-caption text-muted-foreground">Время</span>
                  </div>
                  <div className="text-title text-foreground">{totalDuration} <span className="text-body text-muted-foreground">мин</span></div>
                </div>

                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell size={16} className="text-primary" />
                    <span className="text-caption text-muted-foreground">Тренировок</span>
                  </div>
                  <div className="text-title text-foreground">{weekSessions.length}</div>
                </div>
              </div>

              {/* Additional Info */}
              {weekSessions.length > 0 && (
                <div className="glass rounded-2xl p-4">
                  <p className="text-caption text-muted-foreground mb-1">Среднее за тренировку</p>
                  <p className="text-body text-foreground">{avgCaloriesPerWorkout} ккал</p>
                </div>
              )}

              {weekSessions.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-body text-muted-foreground">Начни тренировку, чтобы увидеть статистику</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnalysisCard;
