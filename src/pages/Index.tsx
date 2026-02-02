import React, { useState } from 'react';
import { UserProvider, useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/layout/BottomNav';
import DashboardView from '@/components/dashboard/DashboardView';
import ProfileView from '@/components/profile/ProfileView';
import Onboarding from '@/components/onboarding/Onboarding';
import WorkoutsList from '@/components/workouts/WorkoutsList';
import WorkoutConstructor from '@/components/workouts/WorkoutConstructor';
import WorkoutTimer from '@/components/timer/WorkoutTimer';
import { Workout } from '@/data/workouts';

type Tab = 'home' | 'timer' | 'profile';

interface WorkoutExercise {
  id?: string;
  exerciseId: string;
  sets: number;
  workTime: number;
  restTime: number;
}

const AppContent: React.FC = () => {
  const { isOnboarded } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [showConstructor, setShowConstructor] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerExercises, setTimerExercises] = useState<WorkoutExercise[]>([]);
  const [timerWorkoutName, setTimerWorkoutName] = useState('');

  if (!isOnboarded) {
    return <Onboarding />;
  }

  const handleSelectWorkout = (workout: Workout) => {
    setTimerExercises(workout.exercises);
    setTimerWorkoutName(workout.name);
    setShowWorkouts(false);
    setShowTimer(true);
  };

  const handleStartWorkout = (exercises: WorkoutExercise[], name: string) => {
    setTimerExercises(exercises);
    setTimerWorkoutName(name);
    setShowConstructor(false);
    setShowTimer(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {activeTab === 'home' && (
        <DashboardView
          onOpenConstructor={() => setShowConstructor(true)}
          onOpenWorkouts={() => setShowWorkouts(true)}
          onSelectWorkout={handleSelectWorkout}
        />
      )}

      {activeTab === 'timer' && (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
          <div className="text-6xl mb-6">⏱️</div>
          <h2 className="text-title text-foreground mb-2">Таймер тренировок</h2>
          <p className="text-body text-muted-foreground text-center mb-8">
            Выбери тренировку, чтобы начать
          </p>
          <button
            onClick={() => setShowWorkouts(true)}
            className="py-4 px-8 rounded-2xl bg-primary text-primary-foreground text-body"
          >
            Выбрать тренировку
          </button>
        </div>
      )}

      {activeTab === 'profile' && <ProfileView />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <WorkoutsList
        isOpen={showWorkouts}
        onClose={() => setShowWorkouts(false)}
        onSelectWorkout={handleSelectWorkout}
      />

      <WorkoutConstructor
        isOpen={showConstructor}
        onClose={() => setShowConstructor(false)}
        onStartWorkout={handleStartWorkout}
      />

      <WorkoutTimer
        isOpen={showTimer}
        onClose={() => setShowTimer(false)}
        exercises={timerExercises}
        workoutName={timerWorkoutName}
      />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default Index;
