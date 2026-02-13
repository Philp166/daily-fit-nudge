import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import CircularProgress from '@/components/dashboard/CircularProgress';
import logoSvg from '@/assets/logo.svg';
import constructorImg from '@/assets/constructor-img.png';
import workoutsImg from '@/assets/workouts-img.png';

type Period = 'day' | 'week' | 'month';

const ANALYTICS_EXPANDED = 260;
const ANALYTICS_COLLAPSED = 0;
const SNAP_THRESHOLD = 130;

const DashboardView: React.FC = () => {
  const { todayCalories, profile } = useUser();
  const goal = profile?.dailyCalorieGoal || 800;
  const progress = Math.min(Math.round((todayCalories / goal) * 100), 100);
  const [period, setPeriod] = useState<Period>('day');
  const [isExpanded, setIsExpanded] = useState(true);

  const analyticsHeight = useMotionValue(ANALYTICS_EXPANDED);
  const analyticsOpacity = useTransform(analyticsHeight, [0, ANALYTICS_EXPANDED * 0.4, ANALYTICS_EXPANDED], [0, 0.3, 1]);
  const dragStartY = useRef(0);

  const handleDragStart = () => {
    dragStartY.current = analyticsHeight.get();
  };

  const handleDrag = (_: any, info: PanInfo) => {
    const newHeight = Math.max(ANALYTICS_COLLAPSED, Math.min(ANALYTICS_EXPANDED, dragStartY.current - info.offset.y));
    analyticsHeight.set(newHeight);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const currentHeight = analyticsHeight.get();
    const velocity = info.velocity.y;

    // Snap based on velocity or position
    if (velocity > 300 || (velocity > -300 && currentHeight > SNAP_THRESHOLD)) {
      // Expand
      animate(analyticsHeight, ANALYTICS_EXPANDED, { type: 'spring', stiffness: 400, damping: 35 });
      setIsExpanded(true);
    } else {
      // Collapse
      animate(analyticsHeight, ANALYTICS_COLLAPSED, { type: 'spring', stiffness: 400, damping: 35 });
      setIsExpanded(false);
    }
  };

  const toggleExpanded = () => {
    if (isExpanded) {
      animate(analyticsHeight, ANALYTICS_COLLAPSED, { type: 'spring', stiffness: 400, damping: 35 });
      setIsExpanded(false);
    } else {
      animate(analyticsHeight, ANALYTICS_EXPANDED, { type: 'spring', stiffness: 400, damping: 35 });
      setIsExpanded(true);
    }
  };

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
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } }
  };

  return (
    <motion.div
      className="h-full bg-background px-4 pt-safe-top flex flex-col"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header: Logo + Period Selector */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-4 px-1 shrink-0">
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

      {/* Unified expandable block */}
      <motion.div variants={fadeUp} className="flex flex-col flex-1 min-h-0 mb-4">

        {/* Analytics section — collapsible */}
        <div className="glass rounded-t-3xl overflow-hidden shrink-0">
          <motion.div
            style={{ height: analyticsHeight, opacity: analyticsOpacity }}
            className="overflow-hidden px-6 pt-6"
          >
            {/* Top row: Calories + Ring */}
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
            <div className="flex items-start justify-between pb-2">
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

          {/* Drag handle */}
          <motion.div
            onPanStart={handleDragStart}
            onPan={handleDrag}
            onPanEnd={handleDragEnd}
            onTap={toggleExpanded}
            className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
          >
            <div className="w-10 h-1 bg-white/25 rounded-full" />
          </motion.div>
        </div>

        {/* Cards section — fills remaining space */}
        <div className="flex flex-col flex-1 min-h-0 gap-3 mt-3">
          {/* Constructor Card */}
          <motion.div
            className="rounded-3xl overflow-hidden relative flex-1"
            style={{ backgroundColor: '#F5941D' }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
            className="rounded-3xl overflow-hidden relative flex-1"
            style={{ backgroundColor: '#4ECDC4' }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
      </motion.div>
    </motion.div>
  );
};

export default DashboardView;
