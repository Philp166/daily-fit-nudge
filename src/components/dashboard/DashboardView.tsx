import React from 'react';
import { motion } from 'framer-motion';

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
      className="min-h-screen bg-background px-5 pt-safe-top pb-40"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2"
      >
        <h1 className="text-title text-foreground">
          Привет, {profile?.name || 'Атлет'}!
        </h1>
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
