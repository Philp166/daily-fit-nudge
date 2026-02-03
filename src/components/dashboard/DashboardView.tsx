import React from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import CaloriesWidget from '@/components/dashboard/CaloriesWidget';
import ConstructorCard from '@/components/dashboard/ConstructorCard';
import ActivityCard from '@/components/dashboard/ActivityCard';
import WorkoutsCard from '@/components/dashboard/WorkoutsCard';
import AnalysisCard from '@/components/dashboard/AnalysisCard';
import { Workout } from '@/data/workouts';

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
  const { profile } = useUser();


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
        <h1 className="text-title text-foreground">
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
        {/* Constructor Card */}
        <ConstructorCard onOpenConstructor={onOpenConstructor} />

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
