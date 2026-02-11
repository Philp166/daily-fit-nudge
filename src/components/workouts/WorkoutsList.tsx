import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, ListChecks, ChevronRight, Star, Edit2 } from 'lucide-react';
import DumbbellIcon from '@/components/ui/DumbbellIcon';
import ClockIcon from '@/components/ui/ClockIcon';
import Badge from '../dashboard/Badge';
import { presetWorkouts, workoutCategories, Workout, computeWorkoutCalories } from '@/data/workouts';
import { getExerciseById } from '@/data/exercises';
import { useUser } from '@/contexts/UserContext';

/** Карточка пресета: тап по карточке открывает тренировку, скролл не триггерит. */
function WorkoutCard({
  workout,
  index,
  getDifficultyColor,
  onSelectWorkout,
  onEditWorkout,
  handleEditWorkout,
}: {
  workout: Workout;
  index: number;
  getDifficultyColor: (d: string) => string;
  onSelectWorkout: (w: Workout) => void;
  onEditWorkout?: (w: Workout) => void;
  handleEditWorkout: (w: Workout, e: React.MouseEvent | React.TouchEvent) => void;
}) {
  const touchRef = useRef({ startY: 0, moved: false });

  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current.startY = e.touches[0].clientY;
    touchRef.current.moved = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (Math.abs(e.touches[0].clientY - touchRef.current.startY) > 10) {
      touchRef.current.moved = true;
    }
  };
  const handleCardClick = () => {
    if (touchRef.current.moved) return;
    onSelectWorkout(workout);
  };
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (touchRef.current.moved) return;
    if (onEditWorkout) onEditWorkout(workout);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div
        role="button"
        tabIndex={0}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onClick={handleCardClick}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelectWorkout(workout); }}
        className="w-full text-left glass rounded-3xl p-4 active:scale-[0.98] transition-transform cursor-pointer"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-body font-normal text-foreground mb-1">
              {workout.name}
            </h3>
            <span className={`text-badge px-2 py-0.5 rounded-xl ${getDifficultyColor(workout.difficulty)}`}>
              {workout.difficulty}
            </span>
          </div>
          <div className="flex gap-2">
            {onEditWorkout && (
              <div
                role="button"
                tabIndex={0}
                className="w-10 h-10 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                onClick={handleEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onEditWorkout) onEditWorkout(workout);
                  }
                }}
                aria-label="Редактировать"
              >
                <Edit2 size={16} className="text-muted-foreground" />
              </div>
            )}
            <ChevronRight size={20} className="text-muted-foreground mt-2.5" />
          </div>
        </div>

        <div className="flex gap-4 text-caption text-muted-foreground">
          <span className="flex items-center gap-1">
            <ClockIcon size={14} />
            {workout.totalDuration} мин
          </span>
          <span className="flex items-center gap-1">
            <Flame size={14} />
            {workout.estimatedCalories} ккал
          </span>
          <span className="flex items-center gap-1">
            <ListChecks size={14} />
            {workout.exercises.length} упр.
          </span>
        </div>
      </div>
    </motion.div>
  );
}

interface WorkoutsListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWorkout: (workout: Workout) => void;
  onEditWorkout?: (workout: Workout) => void;
}

const WorkoutsList: React.FC<WorkoutsListProps> = ({
  isOpen,
  onClose,
  onSelectWorkout,
  onEditWorkout
}) => {
  const { customWorkouts, toggleFavorite, profile } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [activeTab, setActiveTab] = useState<'preset' | 'favorites'>('preset');

  // Body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const filteredWorkouts = selectedCategory === 'Все'
    ? presetWorkouts
    : presetWorkouts.filter(w => w.category === selectedCategory);

  const favoriteWorkouts = customWorkouts.filter(w => w.isFavorite);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Лёгкая': return 'bg-green-500/20 text-green-400';
      case 'Средняя': return 'bg-yellow-500/20 text-yellow-400';
      case 'Сложная': return 'bg-red-500/20 text-red-400';
      default: return 'glass text-muted-foreground';
    }
  };

  const handleEditWorkout = (workout: Workout, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEditWorkout) {
      onEditWorkout(workout);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background"
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
              <h1 className="text-title text-foreground">Тренировки</h1>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-5 pb-4">
              <div className="glass rounded-2xl p-1 flex">
                <button
                  type="button"
                  data-workout-tab="preset"
                  onClick={() => setActiveTab('preset')}
                  style={{ touchAction: 'manipulation' }}
                  className={`flex-1 py-3 rounded-xl text-caption transition-colors active:scale-[0.98] ${
                    activeTab === 'preset'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  Готовые
                </button>
                <button
                  type="button"
                  data-workout-tab="favorites"
                  onClick={() => setActiveTab('favorites')}
                  style={{ touchAction: 'manipulation' }}
                  className={`flex-1 py-3 rounded-xl text-caption transition-colors flex items-center justify-center gap-2 active:scale-[0.98] ${
                    activeTab === 'favorites'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Star size={14} />
                  Избранное
                  {favoriteWorkouts.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-foreground/20 text-badge flex items-center justify-center">
                      {favoriteWorkouts.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {activeTab === 'preset' && (
              <>
                {/* Categories */}
                <div className="px-5 pb-4 overflow-x-auto hide-scrollbar">
                  <div className="flex gap-2">
                    {workoutCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        data-workout-category={category}
                        onClick={() => setSelectedCategory(category)}
                        style={{ touchAction: 'manipulation' }}
                        className={`px-4 py-2 rounded-2xl text-caption whitespace-nowrap transition-colors active:scale-95 ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'glass text-foreground/70'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Workouts List */}
                <div className="flex-1 overflow-y-auto px-5 pb-safe-bottom hide-scrollbar">
                  <div className="space-y-3">
                    {filteredWorkouts.map((workout, index) => (
                      <WorkoutCard
                        key={workout.id}
                        workout={workout}
                        index={index}
                        getDifficultyColor={getDifficultyColor}
                        onSelectWorkout={onSelectWorkout}
                        onEditWorkout={onEditWorkout}
                        handleEditWorkout={handleEditWorkout}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'favorites' && (
              <div className="flex-1 overflow-y-auto px-5 pb-safe-bottom hide-scrollbar">
                {favoriteWorkouts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center mb-4">
                      <Star size={32} className="text-primary" />
                    </div>
                    <p className="text-body text-muted-foreground mb-2">
                      Нет избранных тренировок
                    </p>
                    <p className="text-caption text-muted-foreground">
                      Создай тренировку в конструкторе и добавь в избранное
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favoriteWorkouts.map((workout, index) => {
                      const totalDuration = workout.exercises.reduce((acc, ex) =>
                        acc + (ex.workTime + ex.restTime) * ex.sets, 0
                      ) / 60;
                      const estimatedCalories = computeWorkoutCalories(workout.exercises, profile?.weight || 70);

                      return (
                        <motion.div
                          key={workout.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="glass rounded-3xl p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center">
                                <DumbbellIcon size={20} />
                              </div>
                              <div>
                                <h3 className="text-body font-normal text-foreground">
                                  {workout.name}
                                </h3>
                                <p className="text-badge text-muted-foreground">
                                  {workout.exercises.length} упражнений
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleFavorite(workout.id)}
                              className="w-10 h-10 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
                            >
                              <Star size={18} className="text-yellow-400 fill-yellow-400" />
                            </button>
                          </div>

                          <div className="flex gap-3 text-caption text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <ClockIcon size={14} />
                              {Math.round(totalDuration)} мин
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame size={14} />
                              {estimatedCalories} ккал
                            </span>
                            <span className="flex items-center gap-1">
                              <ListChecks size={14} />
                              {workout.exercises.length} упр.
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const workoutData: Workout = {
                                id: workout.id,
                                name: workout.name,
                                category: 'Избранное',
                                difficulty: 'Средняя',
                                exercises: workout.exercises,
                                totalDuration: Math.round(totalDuration),
                                estimatedCalories,
                              };
                              onSelectWorkout(workoutData);
                            }}
                            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground text-caption active:scale-[0.98] transition-transform"
                          >
                            Начать тренировку
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkoutsList;
