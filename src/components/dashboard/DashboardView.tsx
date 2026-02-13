import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import CircularProgress from '@/components/dashboard/CircularProgress';
import logoSvg from '@/assets/logo.svg';
import constructorImg from '@/assets/constructor-img.png';
import workoutsImg from '@/assets/workouts-img.png';

type Period = 'day' | 'week' | 'month';

const DashboardView: React.FC = () => {
  const { todayCalories, profile } = useUser();
  const goal = profile?.dailyCalorieGoal || 800;
  const progress = Math.min(Math.round((todayCalories / goal) * 100), 100);
  const [period, setPeriod] = useState<Period>('day');

  // Stagger animation config
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <motion.div
      className="min-h-screen bg-background px-4 pt-safe-top"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header: Logo + Period Selector */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-5 px-1">
        <img src={logoSvg} alt="Interfit" className="h-6 opacity-90" />

        <div className="flex items-center bg-[hsl(180,30%,20%)] rounded-full p-1">
          {(['day', 'week', 'month'] as Period[]).map((p) => {
            const label = p === 'day' ? 'Д' : p === 'week' ? 'Н' : 'М';
            const isActive = period === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-white/40'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="periodSelector"
                    className="absolute inset-0 bg-[hsl(180,30%,28%)] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Analytics Card */}
      <motion.div
        variants={fadeUp}
        className="glass rounded-3xl p-6 pb-8 mb-3 relative overflow-hidden"
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Top row: Calories + Ring */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.div
              className="text-7xl font-bold text-white leading-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {todayCalories}
            </motion.div>
            <p className="text-white/60 text-base mt-2">
              ккал из {goal}
            </p>
          </div>

          <div className="relative">
            <CircularProgress
              value={progress}
              size={80}
              strokeWidth={8}
              delay={0.4}
              showValue={false}
              color="#FF8A00"
              trackColor="rgba(255,255,255,0.1)"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-base font-semibold">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">0</span>
              <span className="text-lg text-white/70">трен.</span>
            </div>
            <p className="text-white/40 text-xs mt-0.5">физ.нагрузка</p>
          </div>

          <div className="flex-1 text-center">
            <div className="flex items-baseline gap-1 justify-center">
              <span className="text-3xl font-bold text-white">0</span>
              <span className="text-lg text-white/70">мин.</span>
            </div>
            <p className="text-white/40 text-xs mt-0.5">время активности</p>
          </div>

          <div className="flex-1 text-right">
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-3xl font-bold text-white">0</span>
              <span className="text-lg text-white/70">упр.</span>
            </div>
            <p className="text-white/40 text-xs mt-0.5">зоны роста</p>
          </div>
        </div>

        {/* Drag indicator */}
        <div className="flex justify-center mt-5">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
      </motion.div>

      {/* Constructor Card */}
      <motion.div
        variants={fadeUp}
        className="rounded-3xl overflow-hidden mb-3 relative"
        style={{ backgroundColor: '#F5941D' }}
        whileTap={{ scale: 0.975 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className="flex items-center justify-between min-h-[180px]">
          <div className="p-6 pr-0 flex-1 z-10">
            <h2 className="text-[28px] font-bold text-white leading-tight">
              Конструктор{'\n'}тренировок
            </h2>
          </div>
          <div className="w-[45%] h-full flex items-center justify-end">
            <img
              src={constructorImg}
              alt="Constructor"
              className="w-full h-[180px] object-cover object-center"
              style={{ borderTopRightRadius: '24px', borderBottomRightRadius: '24px' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Workouts Base Card */}
      <motion.div
        variants={fadeUp}
        className="rounded-3xl overflow-hidden mb-6 relative"
        style={{ backgroundColor: '#4ECDC4' }}
        whileTap={{ scale: 0.975 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className="flex items-center justify-between min-h-[180px]">
          <div className="p-6 pr-0 flex-1 z-10">
            <motion.div
              className="text-7xl font-bold text-[#0D3B3B] leading-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              150
            </motion.div>
            <p className="text-[#0D3B3B]/70 text-base font-medium mt-2">
              Готовых тренировок
            </p>
          </div>
          <div className="w-[45%] h-full flex items-center justify-end">
            <img
              src={workoutsImg}
              alt="Workouts"
              className="w-full h-[180px] object-cover object-center"
              style={{ borderTopRightRadius: '24px', borderBottomRightRadius: '24px' }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardView;
