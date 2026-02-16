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
  getDaysOfWeek: (weekOffset: number) => DayStats[];
  getDaysOfMonth: (monthOffset: number) => DayStats[];
  getDaysOfMonthSampled: (monthOffset: number) => DayStats[];
  getWeekLabel: (weekOffset: number) => string;
  getMonthLabel: (monthOffset: number) => string;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const getLocalDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

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
    const todayKey = getLocalDateKey(new Date());
    const h = getHistory();
    h[todayKey] = { calories: todayCalories };
    setHistory(h);
  }, [todayCalories]);

  const setTodayCaloriesState = (value: number | ((prev: number) => number)) => {
    setTodayCalories(typeof value === 'function' ? value(todayCalories) : value);
  };

  const dayLabelsShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const getLast7Days = (): DayStats[] => {
    const todayKey = getLocalDateKey(new Date());
    const h = getHistory();
    const result: DayStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = getLocalDateKey(d);
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

  // Monday = first day of week (ISO). weekOffset 0 = current week, 1 = previous week, etc.
  const getMondayOfWeek = (weekOffset: number): Date => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff - weekOffset * 7);
    return d;
  };

  const getISOWeekNumber = (date: Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7));
  };

  const monthNamesShort: Record<number, string> = {
    0: 'Янв.', 1: 'Февр.', 2: 'Март', 3: 'Апр.', 4: 'Май', 5: 'Июнь',
    6: 'Июль', 7: 'Авг.', 8: 'Сент.', 9: 'Окт.', 10: 'Нояб.', 11: 'Дек.',
  };

  const getDaysOfWeek = (weekOffset: number): DayStats[] => {
    const todayKey = getLocalDateKey(new Date());
    const h = getHistory();
    const monday = getMondayOfWeek(weekOffset);
    const result: DayStats[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const key = getLocalDateKey(d);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const calories = key === todayKey ? todayCalories : (h[key]?.calories ?? 0);
      result.push({
        date: key,
        label: `${dd}/${mm}`,
        calories,
      });
    }
    return result;
  };

  const getWeekLabel = (weekOffset: number): string => {
    const monday = getMondayOfWeek(weekOffset);
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
    const monthsShort = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const d1 = monday.getDate();
    const d2 = sunday.getDate();
    const m1 = monthsShort[monday.getMonth()];
    const m2 = monthsShort[sunday.getMonth()];
    if (monday.getMonth() === sunday.getMonth()) {
      return `${d1}–${d2} ${m2}`;
    }
    return `${d1} ${m1} – ${d2} ${m2}`;
  };

  const getDaysOfMonth = (monthOffset: number): DayStats[] => {
    const todayKey = getLocalDateKey(new Date());
    const h = getHistory();
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() - monthOffset;
    const normalizedYear = year + Math.floor(month / 12);
    const normalizedMonth = ((month % 12) + 12) % 12;
    const daysInMonth = new Date(normalizedYear, normalizedMonth + 1, 0).getDate();
    const result: DayStats[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(normalizedYear, normalizedMonth, day);
      const key = getLocalDateKey(d);
      const calories = key === todayKey ? todayCalories : (h[key]?.calories ?? 0);
      result.push({
        date: key,
        label: String(day).padStart(2, '0'),
        calories,
      });
    }
    return result;
  };

  const getDaysOfMonthSampled = (monthOffset: number): DayStats[] => {
    const all = getDaysOfMonth(monthOffset);
    if (all.length <= 10) return all;
    const step = Math.ceil(all.length / 8);
    const indices = [0];
    for (let i = step; i < all.length; i += step) indices.push(i);
    if (indices[indices.length - 1] !== all.length - 1) indices.push(all.length - 1);
    return indices.map((i) => all[i]);
  };

  const getMonthLabel = (monthOffset: number): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() - monthOffset;
    const normalizedYear = year + Math.floor(month / 12);
    const normalizedMonth = ((month % 12) + 12) % 12;
    const name = monthNamesShort[normalizedMonth];
    const shortYear = String(normalizedYear).slice(-2);
    return `${name} '${shortYear}`;
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
        getDaysOfWeek,
        getDaysOfMonth,
        getDaysOfMonthSampled,
        getWeekLabel,
        getMonthLabel,
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
