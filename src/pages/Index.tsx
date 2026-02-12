import React, { useState } from 'react';
import { UserProvider, useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/layout/BottomNav';
import DashboardView from '@/components/dashboard/DashboardView';
import ProfileView from '@/components/profile/ProfileView';
import Onboarding from '@/components/onboarding/Onboarding';
import WelcomeScreen from '@/components/welcome/WelcomeScreen';
import WorkoutsList from '@/components/workouts/WorkoutsList';
import WorkoutConstructor from '@/components/workouts/WorkoutConstructor';
import WorkoutTimer from '@/components/timer/WorkoutTimer';
import SimpleTimer, { type SimpleTimerMinimizedState } from '@/components/timer/SimpleTimer';
import SimpleTimerWidget from '@/components/timer/SimpleTimerWidget';
import ActiveWorkoutWidget from '@/components/workout/ActiveWorkoutWidget';
import { Workout } from '@/data/workouts';
import { generateId } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const [showWelcome, setShowWelcome] = useState(!isOnboarded);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [showConstructor, setShowConstructor] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerExercises, setTimerExercises] = useState<WorkoutExercise[]>([]);
  const [timerWorkoutName, setTimerWorkoutName] = useState('');
  const [editWorkout, setEditWorkout] = useState<EditWorkoutData | null>(null);

  // Active workout widget state
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null);
  // Universal (navbar) timer minimized state — свёрнут в виджет как в конструкторе
  const [simpleTimerMinimizedState, setSimpleTimerMinimizedState] = useState<SimpleTimerMinimizedState | null>(null);
  const [simpleTimerResetKey, setSimpleTimerResetKey] = useState(0);

  // Timer conflict dialog state
  const [showTimerConflictDialog, setShowTimerConflictDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Show welcome screen for first-time users
  if (showWelcome && !isOnboarded) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  if (!isOnboarded) {
    return <Onboarding />;
  }

  const handleSelectWorkout = (workout: Workout) => {
    // Check for timer conflict
    if (simpleTimerMinimizedState) {
      setPendingAction(() => () => {
        handleCancelSimpleTimer();
        if (activeTab === 'timer') {
          setActiveTab('home');
        }
        setTimerExercises(workout.exercises.map(e => ({
          id: generateId(),
          exerciseId: e.exerciseId,
          sets: e.sets,
          workTime: e.workTime,
          restTime: e.restTime,
        })));
        setTimerWorkoutName(workout.name);
        setShowWorkouts(false);
        setShowTimer(true);
      });
      setShowTimerConflictDialog(true);
      return;
    }

    if (activeTab === 'timer') {
      setActiveTab('home');
    }

    setTimerExercises(workout.exercises.map(e => ({
      id: generateId(),
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
    // Check for timer conflict
    if (simpleTimerMinimizedState) {
      setPendingAction(() => () => {
        handleCancelSimpleTimer();
        if (activeTab === 'timer') {
          setActiveTab('home');
        }
        setTimerExercises(exercises.map(e => ({
          id: e.id || generateId(),
          exerciseId: e.exerciseId,
          sets: e.sets,
          workTime: e.workTime,
          restTime: e.restTime,
        })));
        setTimerWorkoutName(name);
        setShowConstructor(false);
        setEditWorkout(null);
        setShowTimer(true);
      });
      setShowTimerConflictDialog(true);
      return;
    }

    if (activeTab === 'timer') {
      setActiveTab('home');
    }

    setTimerExercises(exercises.map(e => ({
      id: e.id || generateId(),
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
        id: generateId(),
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

  const handleMinimizeSimpleTimer = (state: SimpleTimerMinimizedState) => {
    setSimpleTimerMinimizedState(state);
    setActiveTab('home'); // Return to home when minimizing timer
  };
  const handleExpandSimpleTimer = () => {
    setSimpleTimerMinimizedState(null);
    setActiveTab('timer'); // Switch back to timer tab when expanding
  };
  const handleCancelSimpleTimer = () => {
    setSimpleTimerMinimizedState(null);
    setSimpleTimerResetKey((k) => k + 1);
  };

  const handleConfirmTimerConflict = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowTimerConflictDialog(false);
  };

  const handleCancelTimerConflict = () => {
    setPendingAction(null);
    setShowTimerConflictDialog(false);
  };

  // Update widget state from timer
  const handleTimerStateUpdate = (state: {
    currentExerciseIndex: number;
    currentSet: number;
    timeLeft: number;
    totalCalories: number;
    phase: 'work' | 'rest';
  }) => {
    if (activeWorkout) {
      setActiveWorkout(prev => prev ? { ...prev, ...state } : null);
    }
  };

  // Handle tab change and stop conflicting timers
  const handleTabChange = (tab: Tab) => {
    if (tab === 'timer') {
      // Check for workout timer conflict
      if (activeWorkout || showTimer) {
        setPendingAction(() => () => {
          handleCancelWorkout();
          setActiveTab('timer');
        });
        setShowTimerConflictDialog(true);
        return;
      }
    }
    setActiveTab(tab);
  };


  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col">
      <div
        className={`flex-1 flex flex-col min-h-0 ${activeTab === 'timer' ? 'overflow-hidden' : 'overflow-y-auto pb-28 pb-safe-bottom overscroll-contain'}`}
        style={activeTab !== 'timer' ? { WebkitOverflowScrolling: 'touch' } : undefined}
      >
        {activeTab === 'home' && (
          <>
            <DashboardView
              onOpenConstructor={() => {
                setEditWorkout(null);
                setShowConstructor(true);
              }}
              onOpenWorkouts={() => setShowWorkouts(true)}
              onSelectWorkout={handleSelectWorkout}
            />
            <div className="min-h-[8rem] shrink-0" aria-hidden="true" />
          </>
        )}

        {activeTab === 'timer' && (
          <>
            {simpleTimerMinimizedState && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 rounded-3xl glass mb-6 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <h2 className="text-title text-foreground mb-2">Идет работа</h2>
                <p className="text-body text-muted-foreground">Таймер работает в фоне</p>
              </div>
            )}
          </>
        )}

        {/* SimpleTimer - always mounted when active, but hidden when minimized */}
        <SimpleTimer
          key={simpleTimerResetKey}
          isOpen={activeTab === 'timer' || !!simpleTimerMinimizedState}
          onClose={() => setActiveTab('home')}
          onMinimize={handleMinimizeSimpleTimer}
          isMinimized={!!simpleTimerMinimizedState}
          onStateUpdate={setSimpleTimerMinimizedState}
        />

        {activeTab === 'profile' && (
          <ProfileView />
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Universal timer widget — свёрнутый таймер из навбара (как в конструкторе) */}
      <SimpleTimerWidget
        isVisible={!!simpleTimerMinimizedState}
        state={simpleTimerMinimizedState}
        onExpand={handleExpandSimpleTimer}
        onCancel={handleCancelSimpleTimer}
      />

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
        isOpen={showTimer || (activeWorkout?.isMinimized || false)}
        onClose={handleTimerClose}
        exercises={timerExercises}
        workoutName={timerWorkoutName}
        onMinimize={handleMinimizeWorkout}
        onStateUpdate={handleTimerStateUpdate}
        isMinimized={activeWorkout?.isMinimized || false}
      />

      {/* Timer Conflict Dialog */}
      <AlertDialog open={showTimerConflictDialog} onOpenChange={setShowTimerConflictDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Таймер уже работает</AlertDialogTitle>
            <AlertDialogDescription>
              В приложении может работать только один таймер одновременно. Остановить текущий таймер и начать новый?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelTimerConflict}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTimerConflict}>Остановить и начать новый</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const Index: React.FC = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default Index;

