import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  goal: 'lose' | 'maintain' | 'gain';
  dailyCalorieGoal: number;
}

export interface WorkoutSession {
  id: string;
  name: string;
  duration: number; // minutes
  caloriesBurned: number;
  exercisesCount: number;
  setsCount: number;
  completedAt: Date;
}

export interface CustomWorkout {
  id: string;
  name: string;
  exercises: {
    exerciseId: string;
    sets: number;
    workTime: number;
    restTime: number;
  }[];
  isFavorite: boolean;
  createdAt: Date;
}

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  isOnboarded: boolean;
  todayCalories: number;
  addCalories: (calories: number) => void;
  workoutSessions: WorkoutSession[];
  addWorkoutSession: (session: Omit<WorkoutSession, 'id' | 'completedAt'>) => void;
  customWorkouts: CustomWorkout[];
  addCustomWorkout: (workout: Omit<CustomWorkout, 'id' | 'createdAt'>) => void;
  toggleFavorite: (workoutId: string) => void;
  deleteCustomWorkout: (workoutId: string) => void;
  getTodaySessions: () => WorkoutSession[];
  getWeekProgress: () => { current: number; goal: number };
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Calculate daily BURN goal (calories to burn through exercise)
// Based on weight and fitness goal - realistic exercise targets
const calculateDailyBurnGoal = (weight: number, goal: 'lose' | 'maintain' | 'gain'): number => {
  // Base burn goal scaled by weight (heavier people burn more)
  const baseGoal = weight * 4; // ~4 kcal per kg as baseline
  
  switch (goal) {
    case 'lose':
      // Higher burn goal for weight loss: 400-600 kcal/day
      return Math.round(Math.max(400, Math.min(600, baseGoal * 1.5)));
    case 'gain':
      // Lower burn goal for muscle gain: 200-350 kcal/day
      return Math.round(Math.max(200, Math.min(350, baseGoal * 0.8)));
    default:
      // Maintain: moderate burn: 300-450 kcal/day
      return Math.round(Math.max(300, Math.min(450, baseGoal)));
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [todayCalories, setTodayCalories] = useState(0);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [customWorkouts, setCustomWorkouts] = useState<CustomWorkout[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('interfit_profile');
    const savedCalories = localStorage.getItem('interfit_today_calories');
    const savedDate = localStorage.getItem('interfit_calories_date');
    const savedSessions = localStorage.getItem('interfit_sessions');
    const savedCustomWorkouts = localStorage.getItem('interfit_custom_workouts');

    if (savedProfile) {
      setProfileState(JSON.parse(savedProfile));
    }

    // Reset calories if it's a new day
    const today = new Date().toDateString();
    if (savedCalories && savedDate === today) {
      setTodayCalories(parseInt(savedCalories, 10));
    } else {
      setTodayCalories(0);
      localStorage.setItem('interfit_calories_date', today);
    }

    if (savedSessions) {
      setWorkoutSessions(JSON.parse(savedSessions).map((s: WorkoutSession) => ({
        ...s,
        completedAt: new Date(s.completedAt),
      })));
    }

    if (savedCustomWorkouts) {
      setCustomWorkouts(JSON.parse(savedCustomWorkouts).map((w: CustomWorkout) => ({
        ...w,
        createdAt: new Date(w.createdAt),
      })));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem('interfit_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('interfit_today_calories', todayCalories.toString());
  }, [todayCalories]);

  useEffect(() => {
    localStorage.setItem('interfit_sessions', JSON.stringify(workoutSessions));
  }, [workoutSessions]);

  useEffect(() => {
    localStorage.setItem('interfit_custom_workouts', JSON.stringify(customWorkouts));
  }, [customWorkouts]);

  const setProfile = (newProfile: UserProfile) => {
    const dailyCalorieGoal = calculateDailyBurnGoal(newProfile.weight, newProfile.goal);
    setProfileState({ ...newProfile, dailyCalorieGoal });
  };

  const addCalories = (calories: number) => {
    setTodayCalories(prev => prev + calories);
  };

  const addWorkoutSession = (session: Omit<WorkoutSession, 'id' | 'completedAt'>) => {
    const newSession: WorkoutSession = {
      ...session,
      id: crypto.randomUUID(),
      completedAt: new Date(),
    };
    setWorkoutSessions(prev => [newSession, ...prev]);
    addCalories(session.caloriesBurned);
  };

  const addCustomWorkout = (workout: Omit<CustomWorkout, 'id' | 'createdAt'>) => {
    const newWorkout: CustomWorkout = {
      ...workout,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setCustomWorkouts(prev => [newWorkout, ...prev]);
  };

  const toggleFavorite = (workoutId: string) => {
    setCustomWorkouts(prev =>
      prev.map(w =>
        w.id === workoutId ? { ...w, isFavorite: !w.isFavorite } : w
      )
    );
  };

  const deleteCustomWorkout = (workoutId: string) => {
    setCustomWorkouts(prev => prev.filter(w => w.id !== workoutId));
  };

  const getTodaySessions = (): WorkoutSession[] => {
    const today = new Date().toDateString();
    return workoutSessions.filter(
      s => new Date(s.completedAt).toDateString() === today
    );
  };

  const getWeekProgress = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekSessions = workoutSessions.filter(
      s => new Date(s.completedAt) >= startOfWeek
    );

    // Weekly goal = daily burn goal × 7 days
    const weeklyGoal = (profile?.dailyCalorieGoal || 300) * 7;
    const current = weekSessions.reduce((sum, s) => sum + s.caloriesBurned, 0);

    return {
      current,
      goal: Math.round(weeklyGoal),
    };
  };

  const logout = () => {
    setProfileState(null);
    setTodayCalories(0);
    setWorkoutSessions([]);
    setCustomWorkouts([]);
    localStorage.removeItem('interfit_profile');
    localStorage.removeItem('interfit_today_calories');
    localStorage.removeItem('interfit_sessions');
    localStorage.removeItem('interfit_custom_workouts');
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        setProfile,
        isOnboarded: !!profile,
        todayCalories,
        addCalories,
        workoutSessions,
        addWorkoutSession,
        customWorkouts,
        addCustomWorkout,
        toggleFavorite,
        deleteCustomWorkout,
        getTodaySessions,
        getWeekProgress,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
