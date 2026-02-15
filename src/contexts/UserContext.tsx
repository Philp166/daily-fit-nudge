import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  gender: 'male' | 'female';
  avatar: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  goal: 'lose' | 'maintain' | 'gain';
  dailyCalorieGoal: number;
}

export interface DayStats {
  date: string; // YYYY-MM-DD
  label: string; // e.g. "Пн" or "12 фев"
  calories: number;
  workouts?: number;
  minutes?: number;
  exercises?: number;
}

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  isOnboarded: boolean;
  todayCalories: number;
  setTodayCalories: (value: number | ((prev: number) => number)) => void;
  getWeekProgress: () => { current: number; goal: number };
  getLast7Days: () => DayStats[];
  getLast4Weeks: () => DayStats[];
  getLast4WeeksForMonth: () => DayStats[];
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Calculate daily BURN goal (calories to burn through exercise)
// Uses Mifflin-St Jeor equation for BMR, then adjusts based on goal
const calculateDailyBurnGoal = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  goal: 'lose' | 'maintain' | 'gain'
): number => {
  // Calculate BMR using Mifflin-St Jeor equation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Calculate TDEE (Total Daily Energy Expenditure) assuming sedentary lifestyle
  // Sedentary multiplier: 1.2
  const tdee = bmr * 1.2;

  // Calculate daily burn goal based on fitness goal
  switch (goal) {
    case 'lose':
      // For weight loss: burn 400-600 kcal/day through exercise
      // This creates a ~500 calorie deficit when combined with diet
      return Math.round(Math.max(400, Math.min(600, tdee * 0.25)));
    case 'gain':
      // For muscle gain: burn 200-350 kcal/day through exercise
      // Lower burn to preserve calories for muscle building
      return Math.round(Math.max(200, Math.min(350, tdee * 0.15)));
    default:
      // Maintain: moderate burn 300-450 kcal/day
      return Math.round(Math.max(300, Math.min(450, tdee * 0.20)));
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [todayCalories, setTodayCalories] = useState(0);

  const DAILY_HISTORY_KEY = 'interfit_daily_history';
  const getHistory = (): Record<string, { calories: number }> => {
    try {
      const raw = localStorage.getItem(DAILY_HISTORY_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };
  const setHistory = (h: Record<string, { calories: number }>) => {
    localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(h));
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('interfit_profile');
    const savedCalories = localStorage.getItem('interfit_today_calories');
    const savedDate = localStorage.getItem('interfit_calories_date');

    if (savedProfile) {
      setProfileState(JSON.parse(savedProfile));
    }

    const today = new Date().toDateString();
    if (savedCalories && savedDate === today) {
      setTodayCalories(parseInt(savedCalories, 10));
    } else {
      setTodayCalories(0);
      localStorage.setItem('interfit_calories_date', today);
    }
  }, []);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('interfit_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('interfit_today_calories', todayCalories.toString());
    const todayKey = new Date().toISOString().slice(0, 10);
    const h = getHistory();
    h[todayKey] = { calories: todayCalories };
    setHistory(h);
  }, [todayCalories]);

  const setTodayCaloriesState = (value: number | ((prev: number) => number)) => {
    setTodayCalories(typeof value === 'function' ? value(todayCalories) : value);
  };

  const dayLabelsShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const getLast7Days = (): DayStats[] => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const h = getHistory();
    const result: DayStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayOfWeek = d.getDay();
      const calories = key === todayKey ? todayCalories : (h[key]?.calories ?? 0);
      result.push({
        date: key,
        label: dayLabelsShort[dayOfWeek],
        calories,
      });
    }
    return result;
  };

  const getLast4Weeks = (): DayStats[] => {
    const h = getHistory();
    const result: DayStats[] = [];
    const now = new Date();
    for (let w = 3; w >= 0; w--) {
      const start = new Date(now);
      start.setDate(start.getDate() - start.getDay() - 7 * w);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      let weekCal = 0;
      for (let d = 0; d < 7; d++) {
        const day = new Date(start);
        day.setDate(day.getDate() + d);
        const key = day.toISOString().slice(0, 10);
        weekCal += h[key]?.calories ?? 0;
      }
      result.push({
        date: start.toISOString().slice(0, 10),
        label: `Н${4 - w}`,
        calories: weekCal,
      });
    }
    return result;
  };

  const getLast4WeeksForMonth = (): DayStats[] => {
    return getLast4Weeks();
  };

  const setProfile = (newProfile: UserProfile) => {
    const dailyCalorieGoal = calculateDailyBurnGoal(
      newProfile.weight,
      newProfile.height,
      newProfile.age,
      newProfile.gender,
      newProfile.goal
    );
    setProfileState({ ...newProfile, dailyCalorieGoal });
  };

  const getWeekProgress = () => {
    // Weekly goal = daily burn goal × 7 days
    const weeklyGoal = (profile?.dailyCalorieGoal || 300) * 7;
    const current = 0; // No workout sessions yet, always 0

    return {
      current,
      goal: Math.round(weeklyGoal),
    };
  };

  const logout = () => {
    setProfileState(null);
    setTodayCalories(0);
    // Clear all app data from localStorage
    localStorage.clear();
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        setProfile,
        isOnboarded: !!profile,
        todayCalories,
        setTodayCalories: setTodayCaloriesState,
        getWeekProgress,
        getLast7Days,
        getLast4Weeks,
        getLast4WeeksForMonth,
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
