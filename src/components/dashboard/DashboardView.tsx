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
      className="min-h-screen bg-background px-5 pt-safe-top"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center gap-4"
      >
        {profile?.avatar && (
          <img
            src={`/avatars/${profile.avatar}.webp`}
            alt=""
            className="w-14 h-14 rounded-full object-cover shrink-0"
            draggable={false}
          />
        )}
        <div>
          <p className="text-sm text-muted-foreground mb-1 font-medium">С возвращением!</p>
          <h1 className="text-3xl font-bold text-foreground">
            {profile?.name || 'Атлет'}
          </h1>
        </div>
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
