import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Clock, Flame, ListChecks, Dumbbell } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import CaloriesWidget from '@/components/dashboard/CaloriesWidget';
import ConstructorCard from '@/components/dashboard/ConstructorCard';
import ActivityCard from '@/components/dashboard/ActivityCard';
import WorkoutsCard from '@/components/dashboard/WorkoutsCard';
import AnalysisCard from '@/components/dashboard/AnalysisCard';
import WidgetCard from '@/components/dashboard/WidgetCard';
import Badge from '@/components/dashboard/Badge';
import { presetWorkouts, Workout } from '@/data/workouts';

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
  const { profile, customWorkouts } = useUser();

  // Pick a random featured workout
  const featuredWorkout = presetWorkouts[0];

  const handleRepeatWorkout = (workoutId: string) => {
    const workout = customWorkouts.find(w => w.id === workoutId);
    if (workout) {
      const workoutData: Workout = {
        id: workout.id,
        name: workout.name,
        category: 'Пользовательская',
        difficulty: 'Средняя',
        exercises: workout.exercises,
        totalDuration: Math.round(
          workout.exercises.reduce((acc, ex) => acc + (ex.workTime + ex.restTime) * ex.sets, 0) / 60
        ),
        estimatedCalories: 0,
      };
      onSelectWorkout(workoutData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background px-5 pt-safe-top pb-32"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-2"
      >
        <h1 className="text-display-sm text-extralight text-foreground">
          Привет, {profile?.name || 'Атлет'}!
        </h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
        >
          <Share2 size={18} className="text-foreground/70" />
        </motion.button>
      </motion.div>

      {/* Calories Widget */}
      <CaloriesWidget />

      {/* Cards Grid */}
      <div className="space-y-4">
        {/* Featured Workout */}
        <WidgetCard
          gradient="workout"
          delay={0.3}
          onClick={() => onSelectWorkout(featuredWorkout)}
        >
          <div className="flex justify-between items-start mb-16">
            <Badge>{featuredWorkout.category}</Badge>
          </div>
          
          <h3 className="text-title text-foreground mb-2">{featuredWorkout.name}</h3>
          <div className="flex gap-4 text-caption text-foreground/70">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {featuredWorkout.totalDuration} мин
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Flame size={14} />
              {featuredWorkout.estimatedCalories} ккал
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ListChecks size={14} />
              {featuredWorkout.exercises.length} упр.
            </span>
          </div>
        </WidgetCard>

        {/* Constructor Card */}
        <ConstructorCard
          onOpenConstructor={onOpenConstructor}
          onRepeatWorkout={handleRepeatWorkout}
        />

        {/* Two small cards */}
        <div className="flex gap-4">
          <ActivityCard />
          <WorkoutsCard onOpenWorkouts={onOpenWorkouts} />
        </div>

        {/* Analysis Card */}
        <AnalysisCard />
      </div>
    </motion.div>
  );
};

export default DashboardView;
