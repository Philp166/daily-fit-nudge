import React, { useState } from 'react';
import { UserProvider, useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/layout/BottomNav';
import DashboardView from '@/components/dashboard/DashboardView';
import ProfileView from '@/components/profile/ProfileView';
import Onboarding from '@/components/onboarding/Onboarding';
import WorkoutsList from '@/components/workouts/WorkoutsList';
import WorkoutConstructor from '@/components/workouts/WorkoutConstructor';
import WorkoutTimer from '@/components/timer/WorkoutTimer';
import SimpleTimer from '@/components/timer/SimpleTimer';
import ActiveWorkoutWidget from '@/components/workout/ActiveWorkoutWidget';
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

interface ActiveWorkoutState {
  exercises: WorkoutExercise[];
  workoutName: string;
  currentExerciseIndex: number;
  currentSet: number;
  timeLeft: number;
  totalCalories: number;
  phase: 'work' | 'rest';
  isMinimized: boolean;
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
  
  // Active workout widget state
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null);

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

  // Handle minimizing workout timer
  const handleMinimizeWorkout = (state: {
    currentExerciseIndex: number;
    currentSet: number;
    timeLeft: number;
    totalCalories: number;
    phase: 'work' | 'rest';
  }) => {
    setActiveWorkout({
      exercises: timerExercises,
      workoutName: timerWorkoutName,
      ...state,
      isMinimized: true,
    });
    setShowTimer(false);
  };

  // Handle expanding workout widget
  const handleExpandWorkout = () => {
    if (activeWorkout) {
      setShowTimer(true);
      setActiveWorkout(prev => prev ? { ...prev, isMinimized: false } : null);
    }
  };

  // Handle cancelling workout from widget
  const handleCancelWorkout = () => {
    setActiveWorkout(null);
    setShowTimer(false);
  };

  // Handle workout timer close
  const handleTimerClose = () => {
    setShowTimer(false);
    setActiveWorkout(null);
  };

  // Update widget state from timer
  const handleTimerStateUpdate = (state: {
    currentExerciseIndex: number;
    currentSet: number;
    timeLeft: number;
    totalCalories: number;
    phase: 'work' | 'rest';
  }) => {
    if (activeWorkout?.isMinimized) {
      setActiveWorkout(prev => prev ? { ...prev, ...state } : null);
    }
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

      {/* Active Workout Widget - shows on all screens when minimized */}
      <ActiveWorkoutWidget
        isVisible={activeWorkout?.isMinimized || false}
        workoutName={activeWorkout?.workoutName || ''}
        currentExercise={activeWorkout ? timerExercises[activeWorkout.currentExerciseIndex] : null}
        currentSet={activeWorkout?.currentSet || 1}
        timeLeft={activeWorkout?.timeLeft || 0}
        totalCalories={activeWorkout?.totalCalories || 0}
        phase={activeWorkout?.phase || 'work'}
        onExpand={handleExpandWorkout}
        onCancel={handleCancelWorkout}
      />

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
        onClose={handleTimerClose}
        exercises={timerExercises}
        workoutName={timerWorkoutName}
        onMinimize={handleMinimizeWorkout}
        onStateUpdate={handleTimerStateUpdate}
        initialState={activeWorkout?.isMinimized === false ? {
          currentExerciseIndex: activeWorkout.currentExerciseIndex,
          currentSet: activeWorkout.currentSet,
          timeLeft: activeWorkout.timeLeft,
          totalCalories: activeWorkout.totalCalories,
          phase: activeWorkout.phase,
        } : undefined}
      />

      <SimpleTimer
        isOpen={showSimpleTimer}
        onClose={() => setShowSimpleTimer(false)}
      />
    </div>
  );
};

const Index: React.FC = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default Index;

