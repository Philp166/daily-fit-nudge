import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Clock, Dumbbell, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import WidgetCard from './WidgetCard';
import Badge from './Badge';
import CircularProgress from './CircularProgress';
import { useUser } from '@/contexts/UserContext';

interface WeekData {
  weekStart: Date;
  calories: number;
  duration: number;
  workouts: number;
  label: string;
}

const AnalysisCard: React.FC = () => {
  const { getWeekProgress, workoutSessions, profile } = useUser();
  const { current, goal } = getWeekProgress();
  const percentage = goal > 0 
    ? Math.min(Math.round((current / goal) * 100), 100) 
    : 0;
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isDetailOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDetailOpen]);

  // Calculate stats for last 4 weeks
  const weeksData = useMemo(() => {
    const weeks: WeekData[] = [];
    const now = new Date();
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now);
      // Fix: Monday-based weeks (Sunday = go back 6 days to previous Monday)
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      weekStart.setDate(now.getDate() - daysToMonday - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      const weekSessions = workoutSessions.filter(s => {
        const date = new Date(s.completedAt);
        return date >= weekStart && date < weekEnd;
      });
      
      const calories = weekSessions.reduce((sum, s) => sum + s.caloriesBurned, 0);
      const duration = weekSessions.reduce((sum, s) => sum + s.duration, 0);
      
      // Week label
      let label = '';
      if (i === 0) label = 'Эта';
      else if (i === 1) label = 'Прош.';
      else label = `${i + 1} нед.`;
      
      weeks.push({
        weekStart,
        calories,
        duration,
        workouts: weekSessions.length,
        label,
      });
    }
    
    return weeks.reverse(); // Oldest first for chart
  }, [workoutSessions]);

  // Current and previous week for comparison
  const currentWeek = weeksData[3]; // Last item is current week
  const previousWeek = weeksData[2]; // Second to last is previous week

  // Calculate comparison percentages
  const caloriesDiff = previousWeek.calories > 0 
    ? Math.round(((currentWeek.calories - previousWeek.calories) / previousWeek.calories) * 100)
    : currentWeek.calories > 0 ? 100 : 0;
  
  const durationDiff = previousWeek.duration > 0
    ? Math.round(((currentWeek.duration - previousWeek.duration) / previousWeek.duration) * 100)
    : currentWeek.duration > 0 ? 100 : 0;

  const workoutsDiff = previousWeek.workouts > 0
    ? Math.round(((currentWeek.workouts - previousWeek.workouts) / previousWeek.workouts) * 100)
    : currentWeek.workouts > 0 ? 100 : 0;

  // Max value for chart scaling
  const maxCalories = Math.max(...weeksData.map(w => w.calories), goal);

  // Trend icon component
  const TrendIndicator = ({ diff, inverted = false }: { diff: number; inverted?: boolean }) => {
    const isPositive = inverted ? diff < 0 : diff > 0;
    const isNeutral = diff === 0;
    
    if (isNeutral) {
      return <Minus size={14} className="text-muted-foreground" />;
    }
    
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {diff > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span className="text-badge">{Math.abs(diff)}%</span>
      </div>
    );
  };

  // Summary text
  const getSummaryText = () => {
    if (currentWeek.workouts === 0 && previousWeek.workouts === 0) {
      return 'Начни тренироваться, чтобы увидеть прогресс';
    }
    if (currentWeek.workouts === 0) {
      return 'На этой неделе пока нет тренировок';
    }
    if (previousWeek.workouts === 0) {
      return 'Отличное начало! Продолжай в том же духе';
    }
    if (caloriesDiff > 20) {
      return `На ${caloriesDiff}% больше калорий чем на прошлой неделе 🔥`;
    }
    if (caloriesDiff < -20) {
      return `На ${Math.abs(caloriesDiff)}% меньше активности — не сдавайся!`;
    }
    return 'Стабильный прогресс, так держать!';
  };

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
              className="w-full max-w-lg bg-card rounded-t-3xl p-6 pb-10 max-h-[90vh] overflow-y-auto"
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
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <CircularProgress value={percentage} size={120} strokeWidth={10} delay={0} showValue={false} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extralight text-foreground">{percentage}%</span>
                    <span className="text-badge text-muted-foreground">выполнено</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="glass rounded-2xl p-4 mb-6 text-center">
                <p className="text-body text-foreground">{getSummaryText()}</p>
              </div>

              {/* Mini Chart - 4 weeks */}
              <div className="glass rounded-2xl p-4 mb-6">
                <p className="text-caption text-muted-foreground mb-4">Последние 4 недели</p>
                <div className="flex items-end justify-between gap-2 h-24">
                  {weeksData.map((week, index) => {
                    const height = maxCalories > 0 ? (week.calories / maxCalories) * 100 : 0;
                    const isCurrentWeek = index === 3;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full h-20 flex items-end justify-center">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(height, 4)}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`w-full max-w-8 rounded-t-lg ${
                              isCurrentWeek ? 'bg-primary' : 'bg-primary/30'
                            }`}
                          />
                        </div>
                        <span className="text-badge text-muted-foreground">{week.label}</span>
                      </div>
                    );
                  })}
                </div>
                {/* Goal line indicator */}
                <div className="relative mt-2">
                  <div className="border-t border-dashed border-primary/50 w-full" />
                  <span className="absolute right-0 -top-3 text-badge text-primary/70">цель</span>
                </div>
              </div>

              {/* Comparison with previous week */}
              <div className="glass rounded-2xl p-4 mb-6">
                <p className="text-caption text-muted-foreground mb-3">Сравнение с прошлой неделей</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame size={16} className="text-primary" />
                      <span className="text-body text-foreground">Калории</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-body text-foreground">{currentWeek.calories}</span>
                      <TrendIndicator diff={caloriesDiff} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      <span className="text-body text-foreground">Время</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-body text-foreground">{currentWeek.duration} мин</span>
                      <TrendIndicator diff={durationDiff} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Dumbbell size={16} className="text-primary" />
                      <span className="text-body text-foreground">Тренировок</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-body text-foreground">{currentWeek.workouts}</span>
                      <TrendIndicator diff={workoutsDiff} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnalysisCard;
