import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, Plus, Minus, Search, GripVertical, Trash2, Clock, Flame, Star, Dumbbell, Activity, Heart, Zap, Target } from 'lucide-react';
import { exercises, exerciseCategories, getExerciseById, calculateCalories, getExerciseIconComponent, Exercise } from '@/data/exercises';
import { useUser } from '@/contexts/UserContext';

interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: number;
  workTime: number;
  restTime: number;
}

interface EditWorkoutData {
  id?: string;
  name: string;
  exercises: Array<{
    id?: string;
    exerciseId: string;
    sets: number;
    workTime: number;
    restTime: number;
  }>;
  isPreset?: boolean;
}

interface WorkoutConstructorProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout: (exercises: WorkoutExercise[], name: string) => void;
  editWorkout?: EditWorkoutData | null;
}

const WorkoutConstructor: React.FC<WorkoutConstructorProps> = ({
  isOpen,
  onClose,
  onStartWorkout,
  editWorkout = null,
}) => {
  const { profile, addCustomWorkout, customWorkouts } = useUser();
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [workoutName, setWorkoutName] = useState('Моя тренировка');
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [editingExercise, setEditingExercise] = useState<string | null>(null);

  // Load workout for editing
  useEffect(() => {
    if (editWorkout && isOpen) {
      setWorkoutName(editWorkout.name);
      setSelectedExercises(editWorkout.exercises.map(e => ({
        ...e,
        id: e.id || crypto.randomUUID(),
      })));
    } else if (isOpen && !editWorkout) {
      setSelectedExercises([]);
      setWorkoutName('Моя тренировка');
    }
  }, [editWorkout, isOpen]);

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      sets: 3,
      workTime: 45,
      restTime: 15,
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    setShowExerciseList(false);
    setSearchQuery('');
  };

  const removeExercise = (id: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== id));
  };

  const updateExercise = (id: string, field: keyof WorkoutExercise, value: number) => {
    setSelectedExercises(selectedExercises.map(ex =>
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const calculateTotalTime = () => {
    return selectedExercises.reduce((total, ex) => {
      return total + (ex.workTime + ex.restTime) * ex.sets;
    }, 0);
  };

  const calculateTotalCalories = () => {
    if (!profile) return 0;
    return selectedExercises.reduce((total, ex) => {
      const exercise = getExerciseById(ex.exerciseId);
      if (!exercise) return total;
      return total + calculateCalories(exercise.met, profile.weight, (ex.workTime * ex.sets) / 60);
    }, 0);
  };

  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) return;

    // Save to custom workouts history (last 3)
    const existingIndex = customWorkouts.findIndex(w => w.name === workoutName);
    if (existingIndex === -1) {
      addCustomWorkout({
        name: workoutName,
        exercises: selectedExercises.map(e => ({
          exerciseId: e.exerciseId,
          sets: e.sets,
          workTime: e.workTime,
          restTime: e.restTime,
        })),
        isFavorite: false,
      });
    }

    onStartWorkout(selectedExercises, workoutName);
  };

  const handleClose = () => {
    setShowExerciseList(false);
    setSearchQuery('');
    setEditingExercise(null);
    onClose();
  };

  const ExerciseIconDisplay = ({ iconType }: { iconType: Exercise['iconType'] }) => {
    const Icon = getExerciseIconComponent(iconType);
    return <Icon size={20} className="text-primary" strokeWidth={1.5} />;
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
              <div className="flex-1">
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="text-title text-foreground bg-transparent outline-none w-full"
                  placeholder="Название тренировки"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="w-10 h-10 rounded-2xl glass flex items-center justify-center ml-3"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Stats */}
            <div className="px-5 pb-4">
              <div className="flex gap-3">
                <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span className="text-caption text-foreground">
                    {Math.floor(calculateTotalTime() / 60)} мин
                  </span>
                </div>
                <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2">
                  <Flame size={16} className="text-primary" />
                  <span className="text-caption text-foreground">
                    ~{Math.round(calculateTotalCalories())} ккал
                  </span>
                </div>
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto px-5 hide-scrollbar">
              {selectedExercises.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center mb-4">
                    <Dumbbell size={32} className="text-primary" />
                  </div>
                  <p className="text-body text-muted-foreground mb-2">
                    Добавь упражнения
                  </p>
                  <p className="text-caption text-muted-foreground">
                    Нажми кнопку + внизу
                  </p>
                </div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={selectedExercises}
                  onReorder={setSelectedExercises}
                  className="space-y-3 pb-40"
                >
                  {selectedExercises.map((item) => {
                    const exercise = getExerciseById(item.exerciseId);
                    if (!exercise) return null;

                    const isEditing = editingExercise === item.id;

                    return (
                      <Reorder.Item key={item.id} value={item}>
                        <motion.div
                          layout
                          className="glass rounded-3xl p-4"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="cursor-grab active:cursor-grabbing">
                              <GripVertical size={20} className="text-muted-foreground" />
                            </div>
                            <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center">
                              <ExerciseIconDisplay iconType={exercise.iconType} />
                            </div>
                            <div className="flex-1">
                              <p className="text-body text-foreground">{exercise.name}</p>
                              <p className="text-badge text-muted-foreground">{exercise.category}</p>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setEditingExercise(isEditing ? null : item.id)}
                              className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
                            >
                              <Target size={18} className={isEditing ? 'text-primary' : 'text-muted-foreground'} />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeExercise(item.id)}
                              className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
                            >
                              <Trash2 size={18} className="text-destructive" />
                            </motion.button>
                          </div>

                          {/* Exercise Settings - Always visible but compact or expanded */}
                          <AnimatePresence>
                            {isEditing ? (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-4 pt-3 border-t border-border/50"
                              >
                                {/* Sets */}
                                <div className="glass rounded-2xl p-4">
                                  <p className="text-caption text-muted-foreground mb-3 text-center">Подходы</p>
                                  <div className="flex items-center justify-between">
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateExercise(item.id, 'sets', Math.max(1, item.sets - 1))}
                                      className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                                    >
                                      <Minus size={24} />
                                    </motion.button>
                                    <span className="text-display-sm text-extralight">{item.sets}</span>
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateExercise(item.id, 'sets', Math.min(20, item.sets + 1))}
                                      className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                                    >
                                      <Plus size={24} />
                                    </motion.button>
                                  </div>
                                </div>

                                {/* Work Time */}
                                <div className="glass rounded-2xl p-4">
                                  <p className="text-caption text-muted-foreground mb-3 text-center">Время работы (сек)</p>
                                  <div className="flex items-center justify-between">
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateExercise(item.id, 'workTime', Math.max(5, item.workTime - 5))}
                                      className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                                    >
                                      <Minus size={24} />
                                    </motion.button>
                                    <span className="text-display-sm text-extralight">{item.workTime}</span>
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateExercise(item.id, 'workTime', Math.min(300, item.workTime + 5))}
                                      className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                                    >
                                      <Plus size={24} />
                                    </motion.button>
                                  </div>
                                </div>

                                {/* Rest Time */}
                                <div className="glass rounded-2xl p-4">
                                  <p className="text-caption text-muted-foreground mb-3 text-center">Время отдыха (сек)</p>
                                  <div className="flex items-center justify-between">
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateExercise(item.id, 'restTime', Math.max(0, item.restTime - 5))}
                                      className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                                    >
                                      <Minus size={24} />
                                    </motion.button>
                                    <span className="text-display-sm text-extralight">{item.restTime}</span>
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateExercise(item.id, 'restTime', Math.min(180, item.restTime + 5))}
                                      className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                                    >
                                      <Plus size={24} />
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="flex gap-2 pt-2">
                                <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-1">
                                  <span className="text-badge text-muted-foreground">{item.sets} подх.</span>
                                </div>
                                <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-1">
                                  <span className="text-badge text-muted-foreground">{item.workTime}с</span>
                                </div>
                                <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-1">
                                  <span className="text-badge text-muted-foreground">{item.restTime}с отдых</span>
                                </div>
                              </div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-safe-bottom mb-4 pt-4 bg-gradient-to-t from-background via-background to-transparent">
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowExerciseList(true)}
                  className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                >
                  <Plus size={24} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartWorkout}
                  disabled={selectedExercises.length === 0}
                  className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground text-body disabled:opacity-50"
                >
                  Начать тренировку
                </motion.button>
              </div>
            </div>

            {/* Exercise Picker Modal */}
            <AnimatePresence>
              {showExerciseList && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background z-10"
                >
                  <div className="h-full flex flex-col">
                    {/* Search Header */}
                    <div className="px-5 pt-safe-top pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setShowExerciseList(false);
                            setSearchQuery('');
                          }}
                          className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
                        >
                          <X size={20} />
                        </motion.button>
                        <div className="flex-1 relative">
                          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск упражнений..."
                            className="w-full py-3 pl-12 pr-4 glass rounded-2xl text-foreground outline-none"
                          />
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="overflow-x-auto hide-scrollbar">
                        <div className="flex gap-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory('Все')}
                            className={`px-4 py-2 rounded-2xl text-caption whitespace-nowrap transition-colors ${
                              selectedCategory === 'Все'
                                ? 'bg-primary text-primary-foreground'
                                : 'glass text-foreground/70'
                            }`}
                          >
                            Все
                          </motion.button>
                          {exerciseCategories.map((category) => (
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
                    </div>

                    {/* Exercise Grid */}
                    <div className="flex-1 overflow-y-auto px-5 pb-8 hide-scrollbar">
                      <div className="space-y-2">
                        {filteredExercises.map((exercise) => (
                          <motion.button
                            key={exercise.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addExercise(exercise)}
                            className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left"
                          >
                            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
                              <ExerciseIconDisplay iconType={exercise.iconType} />
                            </div>
                            <div className="flex-1">
                              <p className="text-body text-foreground">{exercise.name}</p>
                              <p className="text-badge text-muted-foreground">{exercise.category}</p>
                            </div>
                            <Plus size={20} className="text-primary" />
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
