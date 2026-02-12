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

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  isOnboarded: boolean;
  todayCalories: number;
  getWeekProgress: () => { current: number; goal: number };
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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('interfit_profile');
    const savedCalories = localStorage.getItem('interfit_today_calories');
    const savedDate = localStorage.getItem('interfit_calories_date');

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
