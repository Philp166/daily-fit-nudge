import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Ruler, Weight, Calendar, Target, LogOut, ChevronRight, Edit2, Check } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const ProfileView: React.FC = () => {
  const { profile, setProfile, logout, workoutSessions } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: profile?.name || '',
    age: profile?.age || 25,
    height: profile?.height || 170,
    weight: profile?.weight || 70,
    goal: profile?.goal || 'maintain',
  });

  if (!profile) return null;

  const totalWorkouts = workoutSessions.length;
  const totalCalories = workoutSessions.reduce((sum, s) => sum + s.caloriesBurned, 0);
  const totalMinutes = workoutSessions.reduce((sum, s) => sum + s.duration, 0);

  const handleSave = () => {
    setProfile({
      ...editData,
      dailyCalorieGoal: profile.dailyCalorieGoal,
    } as typeof profile);
    setIsEditing(false);
  };

  const goals = {
    lose: { label: 'Похудеть', icon: '🔥' },
    maintain: { label: 'Поддержать форму', icon: '⚖️' },
    gain: { label: 'Набрать массу', icon: '💪' },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background px-5 pt-safe-top pb-32"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-title text-foreground">Профиль</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          {isEditing ? <Check size={20} /> : <Edit2 size={18} />}
        </motion.button>
      </div>

      {/* Avatar & Name */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
          <User size={40} className="text-primary-foreground" />
        </div>
        {isEditing ? (
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="text-title text-foreground bg-transparent border-b border-primary outline-none text-center"
          />
        ) : (
          <h2 className="text-title text-foreground">{profile.name}</h2>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-card rounded-2xl p-4 text-center">
          <p className="text-display-sm text-extralight text-foreground mb-1">
            {totalWorkouts}
          </p>
          <p className="text-badge text-muted-foreground">Тренировок</p>
        </div>
        <div className="bg-card rounded-2xl p-4 text-center">
          <p className="text-display-sm text-extralight text-foreground mb-1">
            {Math.round(totalCalories / 1000)}k
          </p>
          <p className="text-badge text-muted-foreground">Калорий</p>
        </div>
        <div className="bg-card rounded-2xl p-4 text-center">
          <p className="text-display-sm text-extralight text-foreground mb-1">
            {Math.round(totalMinutes / 60)}ч
          </p>
          <p className="text-badge text-muted-foreground">Времени</p>
        </div>
      </div>

      {/* Profile Data */}
      <div className="space-y-3 mb-8">
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Calendar size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-caption text-muted-foreground">Возраст</p>
              {isEditing ? (
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) => setEditData({ ...editData, age: parseInt(e.target.value) || 0 })}
                  className="text-body text-foreground bg-transparent outline-none w-full"
                />
              ) : (
                <p className="text-body text-foreground">{profile.age} лет</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Ruler size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-caption text-muted-foreground">Рост</p>
              {isEditing ? (
                <input
                  type="number"
                  value={editData.height}
                  onChange={(e) => setEditData({ ...editData, height: parseInt(e.target.value) || 0 })}
                  className="text-body text-foreground bg-transparent outline-none w-full"
                />
              ) : (
                <p className="text-body text-foreground">{profile.height} см</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Weight size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-caption text-muted-foreground">Вес</p>
              {isEditing ? (
                <input
                  type="number"
                  value={editData.weight}
                  onChange={(e) => setEditData({ ...editData, weight: parseInt(e.target.value) || 0 })}
                  className="text-body text-foreground bg-transparent outline-none w-full"
                />
              ) : (
                <p className="text-body text-foreground">{profile.weight} кг</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Target size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-caption text-muted-foreground">Цель</p>
              <p className="text-body text-foreground">
                {goals[profile.goal].icon} {goals[profile.goal].label}
              </p>
            </div>
            <p className="text-caption text-primary">{profile.dailyCalorieGoal} ккал/день</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={logout}
        className="w-full bg-destructive/10 rounded-2xl p-4 flex items-center gap-4 text-destructive"
      >
        <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
          <LogOut size={20} />
        </div>
        <span className="text-body flex-1 text-left">Выйти из аккаунта</span>
        <ChevronRight size={20} />
      </motion.button>
    </motion.div>
  );
};

export default ProfileView;
