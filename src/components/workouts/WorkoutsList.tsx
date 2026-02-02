import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flame, ListChecks, ChevronRight, Star, Edit2, Dumbbell } from 'lucide-react';
import Badge from '../dashboard/Badge';
import { presetWorkouts, workoutCategories, Workout } from '@/data/workouts';
import { getExerciseById } from '@/data/exercises';
import { useUser } from '@/contexts/UserContext';

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
  const { customWorkouts, toggleFavorite } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [activeTab, setActiveTab] = useState<'preset' | 'favorites'>('preset');

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

  const handleEditWorkout = (workout: Workout, e: React.MouseEvent) => {
    e.stopPropagation();
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
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="px-5 pb-4">
              <div className="glass rounded-2xl p-1 flex">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('preset')}
                  className={`flex-1 py-3 rounded-xl text-caption transition-colors ${
                    activeTab === 'preset'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  Готовые
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 py-3 rounded-xl text-caption transition-colors flex items-center justify-center gap-2 ${
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
                </motion.button>
              </div>
            </div>

            {activeTab === 'preset' && (
              <>
                {/* Categories */}
                <div className="px-5 pb-4 overflow-x-auto hide-scrollbar">
                  <div className="flex gap-2">
                    {workoutCategories.map((category) => (
                      <motion.button
                        key={category}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-2xl text-caption whitespace-nowrap transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'glass text-foreground/70'
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Workouts List */}
                <div className="flex-1 overflow-y-auto px-5 pb-24 hide-scrollbar">
                  <div className="space-y-3">
                    {filteredWorkouts.map((workout, index) => (
                      <motion.div
                        key={workout.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelectWorkout(workout)}
                        className="glass rounded-3xl p-4 card-interactive"
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
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleEditWorkout(workout, e)}
                                className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
                              >
                                <Edit2 size={16} className="text-muted-foreground" />
                              </motion.button>
                            )}
                            <ChevronRight size={20} className="text-muted-foreground mt-2.5" />
                          </div>
                        </div>

                        <div className="flex gap-4 text-caption text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
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
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'favorites' && (
              <div className="flex-1 overflow-y-auto px-5 pb-24 hide-scrollbar">
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
                                <Dumbbell size={20} className="text-primary" />
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
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleFavorite(workout.id)}
                              className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
                            >
                              <Star size={18} className="text-yellow-400 fill-yellow-400" />
                            </motion.button>
                          </div>

                          <div className="flex gap-3 text-caption text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {Math.round(totalDuration)} мин
                            </span>
                            <span className="flex items-center gap-1">
                              <ListChecks size={14} />
                              {workout.exercises.length} упр.
                            </span>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              const workoutData: Workout = {
                                id: workout.id,
                                name: workout.name,
                                category: 'Избранное',
                                difficulty: 'Средняя',
                                exercises: workout.exercises,
                                totalDuration: Math.round(totalDuration),
                                estimatedCalories: 0,
                              };
                              onSelectWorkout(workoutData);
                            }}
                            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground text-caption"
                          >
                            Начать тренировку
                          </motion.button>
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
