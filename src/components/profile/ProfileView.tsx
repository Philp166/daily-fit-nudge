import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Ruler, Weight, Calendar, Target, LogOut, Edit2, Check, Scale, X } from 'lucide-react';
import DumbbellIcon from '@/components/ui/DumbbellIcon';
import FlameIcon from '@/components/ui/FlameIcon';
import ActivityIcon from '@/components/ui/ActivityIcon';
import ClockIcon from '@/components/ui/ClockIcon';
import { useUser } from '@/contexts/UserContext';
import { WheelPicker } from '@/components/ui/WheelPicker';
import WidgetCard from '@/components/dashboard/WidgetCard';

const ProfileView: React.FC = () => {
  const { profile, setProfile, logout, workoutSessions } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: profile?.name || '',
    gender: profile?.gender || 'male' as 'male' | 'female',
    avatar: profile?.avatar || 'male-1',
    age: profile?.age || 25,
    height: profile?.height || 170,
    weight: profile?.weight || 70,
    goal: profile?.goal || 'maintain',
  });
  const [pickerOpen, setPickerOpen] = useState<'age' | 'height' | 'weight' | null>(null);
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const avatarOptions = [1, 2, 3, 4, 5, 6].map(n => `${editData.gender}-${n}`);

  const closeAllPickers = () => {
    setPickerOpen(null);
    setShowGoalPicker(false);
    setShowGenderPicker(false);
    setShowAvatarPicker(false);
  };

  const openPicker = (type: 'goal' | 'gender' | 'avatar' | 'age' | 'height' | 'weight') => {
    closeAllPickers();
    if (type === 'goal') setShowGoalPicker(true);
    else if (type === 'gender') setShowGenderPicker(true);
    else if (type === 'avatar') setShowAvatarPicker(true);
    else setPickerOpen(type);
  };

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

  const genderInfo = {
    male: { label: 'Мужской', emoji: '♂' },
    female: { label: 'Женский', emoji: '♀' },
  };

  const goalInfo = {
    lose: { label: 'Похудеть', icon: <FlameIcon size={20} /> },
    maintain: { label: 'Поддержать форму', icon: <Scale size={20} className="text-primary" /> },
    gain: { label: 'Набрать массу', icon: <DumbbellIcon size={20} /> },
  };

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
        className="mb-6"
      >
        <p className="text-sm text-muted-foreground mb-1 font-medium">Мой профиль</p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={isEditing ? () => openPicker('avatar') : undefined}
            className={`shrink-0 ${isEditing ? 'active:scale-95 transition-transform' : ''}`}
            style={{ touchAction: 'manipulation' }}
            disabled={!isEditing}
          >
            <img
              src={
                profile.avatar === 'custom' && profile.customAvatar
                  ? profile.customAvatar
                  : `${import.meta.env.BASE_URL}avatars/${isEditing ? editData.avatar : (profile.avatar || 'male-1')}.webp`
              }
              alt=""
              className={`w-16 h-16 rounded-full object-cover ${isEditing ? 'ring-2 ring-primary' : ''}`}
              draggable={false}
            />
          </button>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                className="text-3xl font-bold text-foreground bg-transparent border-b-2 border-primary outline-none w-full"
                placeholder="Ваше имя"
              />
            ) : (
              <h1 className="text-3xl font-bold text-foreground">
                {profile?.name || 'Атлет'}
              </h1>
            )}
          </div>
          <button
            type="button"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="w-10 h-10 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform shrink-0"
            style={{ touchAction: 'manipulation' }}
          >
            {isEditing ? <Check size={20} /> : <Edit2 size={18} />}
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <WidgetCard className="aspect-square">
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl glass mb-3 flex items-center justify-center">
                <ActivityIcon size={20} />
              </div>
              <p className="text-display-sm text-extralight text-foreground mb-1">
                {totalWorkouts}
              </p>
              <p className="text-badge text-muted-foreground">Тренировок</p>
            </div>
          </WidgetCard>

          <WidgetCard className="aspect-square">
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl glass mb-3 flex items-center justify-center">
                <FlameIcon size={20} />
              </div>
              <p className="text-display-sm text-extralight text-foreground mb-1">
                {totalCalories >= 1000 ? `${Math.round(totalCalories / 1000)}k` : totalCalories}
              </p>
              <p className="text-badge text-muted-foreground">Калорий</p>
            </div>
          </WidgetCard>

          <WidgetCard className="aspect-square">
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl glass mb-3 flex items-center justify-center">
                <ClockIcon size={20} />
              </div>
              <p className="text-display-sm text-extralight text-foreground mb-1">
                {totalMinutes >= 60 ? `${Math.round(totalMinutes / 60)}ч` : `${totalMinutes}м`}
              </p>
              <p className="text-badge text-muted-foreground">Времени</p>
            </div>
          </WidgetCard>
        </div>

        {/* Profile Info Cards */}
        <div className="flex gap-3">
          <WidgetCard
            className={`flex-1 ${isEditing ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
            onClick={isEditing ? () => openPicker('gender') : undefined}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shrink-0">
                <User size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption text-muted-foreground">Пол</p>
                <p className="text-body text-foreground">
                  {genderInfo[isEditing ? editData.gender : (profile.gender || 'male')].label}
                </p>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shrink-0">
                <Calendar size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption text-muted-foreground">Возраст</p>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => openPicker('age')}
                    className="text-body text-foreground bg-transparent outline-none w-full text-left"
                  >
                    {editData.age} лет
                  </button>
                ) : (
                  <p className="text-body text-foreground">{profile.age} лет</p>
                )}
              </div>
            </div>
          </WidgetCard>
        </div>

        <div className="flex gap-3">
          <WidgetCard className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shrink-0">
                <Ruler size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption text-muted-foreground">Рост</p>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => openPicker('height')}
                    className="text-body text-foreground bg-transparent outline-none w-full text-left"
                  >
                    {editData.height} см
                  </button>
                ) : (
                  <p className="text-body text-foreground">{profile.height} см</p>
                )}
              </div>
            </div>
          </WidgetCard>

          <WidgetCard>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shrink-0">
                <Weight size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-caption text-muted-foreground">Вес</p>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => openPicker('weight')}
                    className="text-body text-foreground bg-transparent outline-none w-full text-left"
                  >
                    {editData.weight} кг
                  </button>
                ) : (
                  <p className="text-body text-foreground">{profile.weight} кг</p>
                )}
              </div>
            </div>
          </WidgetCard>
        </div>

        <WidgetCard
          onClick={isEditing ? () => openPicker('goal') : undefined}
          className={isEditing ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shrink-0">
              <Target size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-caption text-muted-foreground">Цель</p>
              <p className="text-body text-foreground">{goalInfo[isEditing ? editData.goal : profile.goal].label}</p>
            </div>
            <p className="text-caption font-medium text-foreground">{profile.dailyCalorieGoal} ккал/день</p>
          </div>
        </WidgetCard>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="w-full glass rounded-3xl p-5 flex items-center gap-4 text-destructive active:scale-[0.98] transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
            <LogOut size={20} />
          </div>
          <span className="text-body flex-1 text-left">Выйти из аккаунта</span>
        </button>
      </div>

      {/* Goal Picker Modal — portalled to body to escape stacking context */}
      {createPortal(
        <AnimatePresence>
          {showGoalPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[70] flex items-end"
              onClick={() => setShowGoalPicker(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full bg-background rounded-t-3xl p-5 pb-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-title text-foreground">Выберите цель</h3>
                  <button
                    type="button"
                    onClick={() => setShowGoalPicker(false)}
                    className="w-10 h-10 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  {(Object.keys(goalInfo) as Array<keyof typeof goalInfo>).map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => {
                        setEditData({ ...editData, goal });
                        setShowGoalPicker(false);
                      }}
                      className={`w-full glass rounded-3xl p-5 flex items-center gap-4 active:scale-[0.98] transition-all ${
                        editData.goal === goal ? 'ring-2 ring-primary' : ''
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
                        {goalInfo[goal].icon}
                      </div>
                      <span className="text-body text-foreground flex-1 text-left">
                        {goalInfo[goal].label}
                      </span>
                      {editData.goal === goal && (
                        <Check size={20} className="text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Gender Picker Modal — portalled to body to escape stacking context */}
      {createPortal(
        <AnimatePresence>
          {showGenderPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[70] flex items-end"
              onClick={() => setShowGenderPicker(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full bg-background rounded-t-3xl p-5 pb-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-title text-foreground">Выберите пол</h3>
                  <button
                    type="button"
                    onClick={() => setShowGenderPicker(false)}
                    className="w-10 h-10 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  {(Object.keys(genderInfo) as Array<keyof typeof genderInfo>).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => {
                        setEditData({ ...editData, gender, avatar: `${gender}-1` });
                        setShowGenderPicker(false);
                      }}
                      className={`w-full glass rounded-3xl p-5 flex items-center gap-4 active:scale-[0.98] transition-all ${
                        editData.gender === gender ? 'ring-2 ring-primary' : ''
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
                        <span className="text-2xl">{genderInfo[gender].emoji}</span>
                      </div>
                      <span className="text-body text-foreground flex-1 text-left">
                        {genderInfo[gender].label}
                      </span>
                      {editData.gender === gender && (
                        <Check size={20} className="text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Avatar Picker Modal — portalled to body to escape stacking context */}
      {createPortal(
        <AnimatePresence>
          {showAvatarPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[70] flex items-end"
              onClick={() => setShowAvatarPicker(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full bg-background rounded-t-3xl p-5 pb-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-title text-foreground">Выберите аватар</h3>
                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker(false)}
                    className="w-10 h-10 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {avatarOptions.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        setEditData({ ...editData, avatar: av });
                        setShowAvatarPicker(false);
                      }}
                      className={`aspect-square rounded-full overflow-hidden border-4 transition-all active:scale-[0.95] ${
                        editData.avatar === av
                          ? 'border-primary shadow-lg scale-105'
                          : 'border-transparent'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}avatars/${av}.webp`}
                        alt=""
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Wheel Pickers */}
      <WheelPicker
        isOpen={pickerOpen === 'age'}
        onClose={() => setPickerOpen(null)}
        value={editData.age}
        onChange={(age) => setEditData({ ...editData, age })}
        min={14}
        max={100}
        label="Возраст"
        unit="лет"
      />
      <WheelPicker
        isOpen={pickerOpen === 'height'}
        onClose={() => setPickerOpen(null)}
        value={editData.height}
        onChange={(height) => setEditData({ ...editData, height })}
        min={140}
        max={220}
        label="Рост"
        unit="см"
      />
      <WheelPicker
        isOpen={pickerOpen === 'weight'}
        onClose={() => setPickerOpen(null)}
        value={editData.weight}
        onChange={(weight) => setEditData({ ...editData, weight })}
        min={40}
        max={200}
        label="Вес"
        unit="кг"
      />
    </motion.div>
  );
};

export default ProfileView;
