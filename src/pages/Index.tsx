import React, { useState } from 'react';
import { UserProvider, useUser, CustomWorkout } from '@/contexts/UserContext';
import BottomNav from '@/components/layout/BottomNav';
import DashboardView from '@/components/dashboard/DashboardView';
import ProfileView from '@/components/profile/ProfileView';
import Onboarding from '@/components/onboarding/Onboarding';
import WorkoutsList from '@/components/workouts/WorkoutsList';
import WorkoutConstructor from '@/components/workouts/WorkoutConstructor';
import WorkoutTimer from '@/components/timer/WorkoutTimer';
import SimpleTimer from '@/components/timer/SimpleTimer';
import { Workout } from '@/data/workouts';


type Tab = 'home' | 'timer' | 'profile';

interface WorkoutExercise {
  id?: string;
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

const AppContent: React.FC = () => {
  const { isOnboarded, customWorkouts } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [showConstructor, setShowConstructor] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showSimpleTimer, setShowSimpleTimer] = useState(false);
  const [timerExercises, setTimerExercises] = useState<WorkoutExercise[]>([]);
  const [timerWorkoutName, setTimerWorkoutName] = useState('');
  const [editWorkout, setEditWorkout] = useState<EditWorkoutData | null>(null);

  if (!isOnboarded) {
    return <Onboarding />;
  }

  const handleSelectWorkout = (workout: Workout) => {
    setTimerExercises(workout.exercises.map(e => ({
      id: crypto.randomUUID(),
      exerciseId: e.exerciseId,
      sets: e.sets,
      workTime: e.workTime,
      restTime: e.restTime,
    })));
    setTimerWorkoutName(workout.name);
    setShowWorkouts(false);
    setShowTimer(true);
  };

  const handleStartWorkout = (exercises: WorkoutExercise[], name: string) => {
    setTimerExercises(exercises.map(e => ({
      id: e.id || crypto.randomUUID(),
      exerciseId: e.exerciseId,
      sets: e.sets,
      workTime: e.workTime,
      restTime: e.restTime,
    })));
    setTimerWorkoutName(name);
    setShowConstructor(false);
    setEditWorkout(null);
    setShowTimer(true);
  };

  const handleRepeatWorkout = (workoutId: string) => {
    const workout = customWorkouts.find(w => w.id === workoutId);
    if (workout) {
      setTimerExercises(workout.exercises.map(e => ({
        id: crypto.randomUUID(),
        exerciseId: e.exerciseId,
        sets: e.sets,
        workTime: e.workTime,
        restTime: e.restTime,
      })));
      setTimerWorkoutName(workout.name);
      setShowTimer(true);
    }
  };

  const handleEditPresetWorkout = (workout: Workout) => {
    setEditWorkout({
      name: workout.name,
      exercises: workout.exercises.map(e => ({
        id: crypto.randomUUID(),
        exerciseId: e.exerciseId,
        sets: e.sets,
        workTime: e.workTime,
        restTime: e.restTime,
      })),
      isPreset: true,
    });
    setShowWorkouts(false);
    setShowConstructor(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {activeTab === 'home' && (
        <DashboardView
          onOpenConstructor={() => {
            setEditWorkout(null);
            setShowConstructor(true);
          }}
          onOpenWorkouts={() => setShowWorkouts(true)}
          onSelectWorkout={handleSelectWorkout}
        />
      )}

      {activeTab === 'timer' && (
        <SimpleTimer isOpen={true} onClose={() => setActiveTab('home')} />
      )}

      {activeTab === 'profile' && <ProfileView />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <WorkoutsList
        isOpen={showWorkouts}
        onClose={() => setShowWorkouts(false)}
        onSelectWorkout={handleSelectWorkout}
        onEditWorkout={handleEditPresetWorkout}
      />

      <WorkoutConstructor
        isOpen={showConstructor}
        onClose={() => {
          setShowConstructor(false);
          setEditWorkout(null);
        }}
        onStartWorkout={handleStartWorkout}
        editWorkout={editWorkout}
      />

      <WorkoutTimer
        isOpen={showTimer}
        onClose={() => setShowTimer(false)}
        exercises={timerExercises}
        workoutName={timerWorkoutName}
      />

      <SimpleTimer
        isOpen={showSimpleTimer}
        onClose={() => setShowSimpleTimer(false)}
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
