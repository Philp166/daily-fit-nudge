import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import CircularProgress from '@/components/dashboard/CircularProgress';
import logoSvg from '@/assets/logo.svg';
import constructorImg from '@/assets/constructor-img.png';
import workoutsImg from '@/assets/workouts-img.png';

type Period = 'day' | 'week' | 'month';

const ANALYTICS_EXPANDED = 340; // full height: header + stats + handle
const ANALYTICS_COLLAPSED = 44; // just the handle visible
const SNAP_THRESHOLD = 180;

const DashboardView: React.FC = () => {
  const { todayCalories, profile } = useUser();
  const goal = profile?.dailyCalorieGoal || 800;
  const progress = Math.min(Math.round((todayCalories / goal) * 100), 100);
  const [period, setPeriod] = useState<Period>('day');

  const analyticsHeight = useMotionValue(ANALYTICS_EXPANDED);
  const contentOpacity = useTransform(
    analyticsHeight,
    [ANALYTICS_COLLAPSED, ANALYTICS_COLLAPSED + 80, ANALYTICS_EXPANDED],
    [0, 0, 1]
  );
  const dragStartY = useRef(0);

  const handleDragStart = () => {
    dragStartY.current = analyticsHeight.get();
  };

  const handleDrag = (_: any, info: PanInfo) => {
    const newHeight = Math.max(
      ANALYTICS_COLLAPSED,
      Math.min(ANALYTICS_EXPANDED, dragStartY.current + info.offset.y)
    );
    analyticsHeight.set(newHeight);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const currentHeight = analyticsHeight.get();
    const velocity = info.velocity.y;

    if (velocity < -400 || (velocity < 200 && currentHeight < SNAP_THRESHOLD)) {
      animate(analyticsHeight, ANALYTICS_COLLAPSED, { type: 'spring', stiffness: 400, damping: 35 });
    } else {
      animate(analyticsHeight, ANALYTICS_EXPANDED, { type: 'spring', stiffness: 400, damping: 35 });
    }
  };

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">

      {/* Analytics block — collapsible, rounded bottom */}
      <motion.div
        style={{ height: analyticsHeight }}
        className="shrink-0 glass rounded-b-3xl overflow-hidden relative"
      >
        {/* Content that fades */}
        <motion.div style={{ opacity: contentOpacity }} className="px-5 pt-safe-top h-full flex flex-col">

          {/* Header: Logo + Period Selector */}
          <div className="flex items-center justify-between mb-4 pt-2">
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
                        transition={{ type: 'spring' as const, stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calories + Ring */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-7xl font-bold text-white leading-none">
                {todayCalories}
              </div>
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
        </motion.div>

        {/* Drag handle — always visible at bottom of analytics */}
        <motion.div
          onPanStart={handleDragStart}
          onPan={handleDrag}
          onPanEnd={handleDragEnd}
          className="absolute bottom-0 left-0 right-0 flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none z-10"
        >
          <div className="w-10 h-1 bg-white/25 rounded-full" />
        </motion.div>
      </motion.div>

      {/* Cards section — fills remaining space */}
      <div className="flex flex-col flex-1 min-h-0 gap-3 px-4 py-3">
        {/* Constructor Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 30, delay: 0.15 }}
          className="rounded-3xl overflow-hidden relative flex-1"
          style={{ backgroundColor: '#F5941D' }}
          whileTap={{ scale: 0.985 }}
        >
          <div className="flex items-center justify-between h-full">
            <div className="p-6 pr-0 flex-1 z-10">
              <h2 className="text-[28px] font-bold text-white leading-tight">
                Конструктор{'\n'}тренировок
              </h2>
            </div>
            <div className="w-[40%] flex items-center justify-center p-4">
              <img
                src={constructorImg}
                alt="Constructor"
                className="max-h-full object-contain"
                style={{ maxHeight: '140px' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Workouts Base Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 30, delay: 0.25 }}
          className="rounded-3xl overflow-hidden relative flex-1"
          style={{ backgroundColor: '#4ECDC4' }}
          whileTap={{ scale: 0.985 }}
        >
          <div className="flex items-center justify-between h-full">
            <div className="p-6 pr-0 flex-1 z-10">
              <div className="text-7xl font-bold text-[#0D3B3B] leading-none">
                150
              </div>
              <p className="text-[#0D3B3B]/70 text-base font-medium mt-2">
                Готовых тренировок
              </p>
            </div>
            <div className="w-[40%] flex items-center justify-center p-4">
              <img
                src={workoutsImg}
                alt="Workouts"
                className="max-h-full object-contain"
                style={{ maxHeight: '120px' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardView;
