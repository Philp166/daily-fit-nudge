import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const ProfileView: React.FC = () => {
  const { profile, logout } = useUser();

  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background px-5 pt-safe-top flex flex-col items-center justify-center"
    >
      {/* Profile Header */}
      <div className="text-center mb-12">
        <img
          src={`${import.meta.env.BASE_URL}avatars/${profile.avatar}.webp`}
          alt=""
          className="w-32 h-32 rounded-full object-cover mx-auto mb-6 shadow-lg"
          draggable={false}
        />
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {profile.name}
        </h1>
        <p className="text-body text-muted-foreground">
          {profile.age} лет • {profile.height} см • {profile.weight} кг
        </p>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={logout}
        className="w-full max-w-sm glass rounded-3xl p-5 flex items-center justify-center gap-4 text-destructive active:scale-[0.98] transition-transform"
        style={{ touchAction: 'manipulation' }}
      >
        <LogOut size={20} />
        <span className="text-body font-medium">Выйти из аккаунта</span>
      </button>

      {/* Info */}
      <p className="text-caption text-muted-foreground text-center mt-8 max-w-xs">
        Нажмите "Выйти", чтобы сбросить все данные и начать заново
      </p>
    </motion.div>
  );
};

export default ProfileView;
