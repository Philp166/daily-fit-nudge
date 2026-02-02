import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flame, ListChecks, ChevronRight } from 'lucide-react';
import Badge from '../dashboard/Badge';
import { presetWorkouts, workoutCategories, Workout } from '@/data/workouts';
import { getExerciseById } from '@/data/exercises';

interface WorkoutsListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWorkout: (workout: Workout) => void;
}

const WorkoutsList: React.FC<WorkoutsListProps> = ({ isOpen, onClose, onSelectWorkout }) => {
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const filteredWorkouts = selectedCategory === 'Все'
    ? presetWorkouts
    : presetWorkouts.filter(w => w.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Лёгкая': return 'bg-green-500/20 text-green-400';
      case 'Средняя': return 'bg-yellow-500/20 text-yellow-400';
      case 'Сложная': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted text-muted-foreground';
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
                className="w-10 h-10 rounded-full glass flex items-center justify-center"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Categories */}
            <div className="px-5 pb-4 overflow-x-auto hide-scrollbar">
              <div className="flex gap-2">
                {workoutCategories.map((category) => (
                  <motion.button
                    key={category}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-caption whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
                    className="bg-card rounded-2xl p-4 card-interactive"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-body font-normal text-foreground mb-1">
                          {workout.name}
                        </h3>
                        <span className={`text-badge px-2 py-0.5 rounded-full ${getDifficultyColor(workout.difficulty)}`}>
                          {workout.difficulty}
                        </span>
                      </div>
                      <ChevronRight size={20} className="text-muted-foreground" />
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkoutsList;
