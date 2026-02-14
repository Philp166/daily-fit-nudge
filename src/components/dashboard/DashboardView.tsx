import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import CircularProgress from '@/components/dashboard/CircularProgress';
import logoSvg from '@/assets/logo.svg';
import constructorImg from '@/assets/constructor-img.png';
import workoutsImg from '@/assets/workouts-img.png';

type Period = 'day' | 'week' | 'month';

const ANALYTICS_EXPANDED = 380;
const ANALYTICS_COLLAPSED = 60;
const SNAP_THRESHOLD = 200;

const DashboardView: React.FC = () => {
  const { todayCalories, profile } = useUser();
  const goal = profile?.dailyCalorieGoal || 800;
  const progress = Math.min(Math.round((todayCalories / goal) * 100), 100);
  const [period, setPeriod] = useState<Period>('day');

  const analyticsHeight = useMotionValue(ANALYTICS_EXPANDED);

  const headerOpacity = useTransform(
    analyticsHeight,
    [ANALYTICS_COLLAPSED, ANALYTICS_COLLAPSED + 80, ANALYTICS_EXPANDED],
    [0, 0, 1]
  );
  const contentOpacity = useTransform(
    analyticsHeight,
    [ANALYTICS_COLLAPSED, ANALYTICS_COLLAPSED + 120, ANALYTICS_EXPANDED],
    [0, 0.3, 1]
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

    if (velocity < -300 || (velocity > -100 && currentHeight < SNAP_THRESHOLD)) {
      animate(analyticsHeight, ANALYTICS_COLLAPSED, {
        type: 'spring',
        stiffness: 300,
        damping: 30
      });
    } else {
      animate(analyticsHeight, ANALYTICS_EXPANDED, {
        type: 'spring',
        stiffness: 300,
        damping: 30
      });
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#006776' }}>

      {/* Analytics block */}
      <motion.div
        style={{ height: analyticsHeight }}
        className="shrink-0 rounded-b-3xl overflow-hidden relative bg-[#006776] pt-safe-top"
      >
        <div className="h-full px-5 pb-3 flex flex-col pt-3">

          {/* Header: Logo + Period Selector */}
          <motion.div
            style={{ opacity: headerOpacity }}
            className="flex items-center justify-between mb-4"
          >
            <img src={logoSvg} alt="Interfit" className="h-7 opacity-95" />

            <div className="flex items-center bg-[#005563] rounded-full p-1">
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
                        className="absolute inset-0 bg-[#00677A] rounded-full"
                        transition={{ type: 'spring' as const, stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Dark nested container for Calories + Ring */}
          <motion.div
            style={{ opacity: contentOpacity }}
            className="bg-[#004D5C] rounded-2xl p-5 mb-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-8xl font-bold text-white leading-none tracking-tight">
                  {todayCalories}
                </div>
                <p className="text-white/70 text-lg mt-2">
                  ккал из {goal}
                </p>
              </div>

              <div className="relative shrink-0">
                <CircularProgress
                  value={progress}
                  size={90}
                  strokeWidth={9}
                  delay={0.4}
                  showValue={false}
                  color="#FF8A00"
                  trackColor="rgba(255,255,255,0.15)"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">{progress}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            style={{ opacity: contentOpacity }}
            className="flex items-start justify-between px-2"
          >
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">0</span>
                <span className="text-xl text-white/80">трен.</span>
              </div>
              <p className="text-white/50 text-sm mt-1">физ.нагрузка</p>
            </div>

            <div className="flex-1 text-center">
              <div className="flex items-baseline gap-1 justify-center">
                <span className="text-4xl font-bold text-white">0</span>
                <span className="text-xl text-white/80">мин.</span>
              </div>
              <p className="text-white/50 text-sm mt-1">время активности</p>
            </div>

            <div className="flex-1 text-right">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-4xl font-bold text-white">0</span>
                <span className="text-xl text-white/80">упр.</span>
              </div>
              <p className="text-white/50 text-sm mt-1">зоны роста</p>
            </div>
          </motion.div>
        </div>

        {/* Drag handle */}
        <motion.div
          onPanStart={handleDragStart}
          onPan={handleDrag}
          onPanEnd={handleDragEnd}
          className="absolute bottom-0 left-0 right-0 flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none z-10"
        >
          <div className="w-12 h-1.5 bg-white/30 rounded-full" />
        </motion.div>
      </motion.div>

      {/* Cards section */}
      <div className="flex flex-col flex-1 min-h-0 gap-3 px-4 py-4 bg-background">
        {/* Constructor Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 30, delay: 0.15 }}
          className="rounded-3xl overflow-hidden relative flex-1 min-h-[200px]"
          style={{ backgroundColor: '#F5941D' }}
          whileTap={{ scale: 0.985 }}
        >
          <div className="flex items-center justify-between h-full px-7 py-7">
            <div className="flex-1 pr-3">
              <h2 className="text-[40px] font-bold text-white leading-[1.1]">
                Конструктор тренировок
              </h2>
            </div>
            <div className="w-[42%] flex items-center justify-center shrink-0">
              <img
                src={constructorImg}
                alt="Constructor"
                className="w-full h-auto max-h-[200px] object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* Workouts Base Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 30, delay: 0.25 }}
          className="rounded-3xl overflow-hidden relative flex-1 min-h-[200px]"
          style={{ backgroundColor: '#4ECDC4' }}
          whileTap={{ scale: 0.985 }}
        >
          <div className="flex items-center justify-between h-full px-7 py-7">
            <div className="flex-1 pr-3">
              <div className="text-[90px] font-bold text-[#0D3B3B] leading-none tracking-tight">
                150
              </div>
              <p className="text-[#0D3B3B]/80 text-xl font-medium mt-2">
                Готовых тренировок
              </p>
            </div>
            <div className="w-[42%] flex items-center justify-center shrink-0">
              <img
                src={workoutsImg}
                alt="Workouts"
                className="w-full h-auto max-h-[180px] object-contain"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardView;
