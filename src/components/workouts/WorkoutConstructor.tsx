import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, Plus, Search, GripVertical, Minus, Play, Save, Star } from 'lucide-react';
import { exercises, exerciseCategories, Exercise, calculateCalories } from '@/data/exercises';
import { useUser } from '@/contexts/UserContext';

interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: number;
  workTime: number;
  restTime: number;
}

interface WorkoutConstructorProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout: (exercises: WorkoutExercise[], name: string) => void;
}

const WorkoutConstructor: React.FC<WorkoutConstructorProps> = ({
  isOpen,
  onClose,
  onStartWorkout,
}) => {
  const { profile, addCustomWorkout } = useUser();
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [workoutName, setWorkoutName] = useState('Моя тренировка');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showExerciseList, setShowExerciseList] = useState(false);

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getExercise = (id: string): Exercise | undefined => {
    return exercises.find(ex => ex.id === id);
  };

  const addExercise = (exercise: Exercise) => {
    setWorkoutExercises(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        exerciseId: exercise.id,
        sets: 3,
        workTime: 40,
        restTime: 20,
      },
    ]);
    setShowExerciseList(false);
  };

  const updateExercise = (id: string, updates: Partial<WorkoutExercise>) => {
    setWorkoutExercises(prev =>
      prev.map(ex => (ex.id === id ? { ...ex, ...updates } : ex))
    );
  };

  const removeExercise = (id: string) => {
    setWorkoutExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const calculateTotalTime = () => {
    return workoutExercises.reduce((total, ex) => {
      return total + ex.sets * (ex.workTime + ex.restTime);
    }, 0);
  };

  const calculateTotalCalories = () => {
    const weight = profile?.weight || 70;
    return workoutExercises.reduce((total, ex) => {
      const exercise = getExercise(ex.exerciseId);
      if (!exercise) return total;
      const totalWorkTime = (ex.sets * ex.workTime) / 60; // minutes
      return total + calculateCalories(exercise.met, weight, totalWorkTime);
    }, 0);
  };

  const handleSave = () => {
    if (workoutExercises.length === 0) return;
    
    addCustomWorkout({
      name: workoutName,
      exercises: workoutExercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        workTime: ex.workTime,
        restTime: ex.restTime,
      })),
      isFavorite: false,
    });
    
    onClose();
  };

  const handleStart = () => {
    if (workoutExercises.length === 0) return;
    onStartWorkout(workoutExercises, workoutName);
  };

  const totalSeconds = calculateTotalTime();
  const totalMinutes = Math.ceil(totalSeconds / 60);
  const totalCalories = calculateTotalCalories();

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
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="text-title text-foreground bg-transparent border-none outline-none flex-1"
                placeholder="Название тренировки"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full glass flex items-center justify-center ml-2"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Stats */}
            <div className="px-5 pb-4">
              <div className="flex gap-4 text-caption text-muted-foreground">
                <span>⏱ {totalMinutes} мин</span>
                <span>🔥 {totalCalories} ккал</span>
                <span>📋 {workoutExercises.length} упр.</span>
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto px-5 pb-32 hide-scrollbar">
              <Reorder.Group
                axis="y"
                values={workoutExercises}
                onReorder={setWorkoutExercises}
                className="space-y-3"
              >
                {workoutExercises.map((item) => {
                  const exercise = getExercise(item.exerciseId);
                  if (!exercise) return null;

                  return (
                    <Reorder.Item
                      key={item.id}
                      value={item}
                      className="bg-card rounded-2xl p-4 cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-start gap-3">
                        <GripVertical size={20} className="text-muted-foreground mt-1 flex-shrink-0" />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{exercise.icon}</span>
                            <span className="text-body text-foreground">{exercise.name}</span>
                            <button
                              onClick={() => removeExercise(item.id)}
                              className="ml-auto text-destructive/50 hover:text-destructive"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-muted rounded-xl p-2 text-center">
                              <p className="text-badge text-muted-foreground mb-1">Подходы</p>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => updateExercise(item.id, { sets: Math.max(1, item.sets - 1) })}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-body text-foreground w-6">{item.sets}</span>
                                <button
                                  onClick={() => updateExercise(item.id, { sets: item.sets + 1 })}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="bg-muted rounded-xl p-2 text-center">
                              <p className="text-badge text-muted-foreground mb-1">Работа</p>
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => updateExercise(item.id, { workTime: Math.max(10, item.workTime - 5) })}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-body text-foreground w-8">{item.workTime}с</span>
                                <button
                                  onClick={() => updateExercise(item.id, { workTime: item.workTime + 5 })}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="bg-muted rounded-xl p-2 text-center">
                              <p className="text-badge text-muted-foreground mb-1">Отдых</p>
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => updateExercise(item.id, { restTime: Math.max(5, item.restTime - 5) })}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-body text-foreground w-8">{item.restTime}с</span>
                                <button
                                  onClick={() => updateExercise(item.id, { restTime: item.restTime + 5 })}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>

              {/* Add Exercise Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowExerciseList(true)}
                className="w-full mt-4 py-4 rounded-2xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground flex items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors"
              >
                <Plus size={20} />
                Добавить упражнение
              </motion.button>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-5 pb-safe-bottom glass">
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={workoutExercises.length === 0}
                  className="flex-1 py-4 rounded-2xl bg-muted text-foreground flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  Сохранить
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  disabled={workoutExercises.length === 0}
                  className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Play size={20} />
                  Начать
                </motion.button>
              </div>
            </div>

            {/* Exercise Selection Modal */}
            <AnimatePresence>
              {showExerciseList && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background z-10"
                >
                  <div className="h-full flex flex-col">
                    <div className="flex items-center gap-3 px-5 pt-safe-top pb-4">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowExerciseList(false)}
                        className="w-10 h-10 rounded-full glass flex items-center justify-center"
                      >
                        <X size={20} />
                      </motion.button>
                      <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Поиск упражнений..."
                          className="w-full py-3 pl-10 pr-4 bg-muted rounded-xl text-foreground text-body outline-none"
                        />
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="px-5 pb-4 overflow-x-auto hide-scrollbar">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className={`px-3 py-1.5 rounded-full text-caption whitespace-nowrap transition-colors ${
                            !selectedCategory
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          Все
                        </button>
                        {exerciseCategories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 rounded-full text-caption whitespace-nowrap transition-colors ${
                              selectedCategory === category
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Exercise List */}
                    <div className="flex-1 overflow-y-auto px-5 pb-8 hide-scrollbar">
                      <div className="grid grid-cols-2 gap-3">
                        {filteredExercises.map((exercise) => (
                          <motion.button
                            key={exercise.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addExercise(exercise)}
                            className="bg-card rounded-2xl p-4 text-left card-interactive"
                          >
                            <span className="text-2xl mb-2 block">{exercise.icon}</span>
                            <p className="text-caption text-foreground mb-1">{exercise.name}</p>
                            <p className="text-badge text-muted-foreground">{exercise.category}</p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkoutConstructor;
