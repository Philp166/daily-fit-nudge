import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import CircularProgress from '@/components/dashboard/CircularProgress';
import logoSvg from '@/assets/logo.svg';
import constructorImg from '@/assets/constructor-img.png';
import workoutsImg from '@/assets/workouts-img.png';

type Period = 'day' | 'week' | 'month';

const HANDLE_STRIP_HEIGHT = 36; // Taller = easier to grab, more sensitive feel
const ANALYTICS_EXPANDED = 420 - HANDLE_STRIP_HEIGHT; // 392 — content only, stats row always visible
const ANALYTICS_COLLAPSED = 76 - HANDLE_STRIP_HEIGHT;  // 48 — content only
const OVERDRAG = 24;
const MIN_HEIGHT = ANALYTICS_COLLAPSED - OVERDRAG;
const MAX_HEIGHT = ANALYTICS_EXPANDED + OVERDRAG;
const SNAP_THRESHOLD = (ANALYTICS_COLLAPSED + ANALYTICS_EXPANDED) / 2; // ~220
const DRAG_SENSITIVITY = 1.3;

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 30, mass: 1 };

const DashboardView: React.FC = () => {
  const { todayCalories, profile } = useUser();
  const goal = profile?.dailyCalorieGoal || 800;
  const progress = Math.min(Math.round((todayCalories / goal) * 100), 100);
  const [period, setPeriod] = useState<Period>('day');

  const panelHeight = useMotionValue(ANALYTICS_EXPANDED);

  const headerOpacity = useTransform(
    panelHeight,
    [ANALYTICS_COLLAPSED, ANALYTICS_COLLAPSED + 70, 220, ANALYTICS_EXPANDED],
    [0, 0.4, 1, 1]
  );
  const contentOpacity = useTransform(
    panelHeight,
    [ANALYTICS_COLLAPSED, ANALYTICS_COLLAPSED + 56, 220, ANALYTICS_EXPANDED],
    [0, 0.3, 1, 1]
  );

  const handleRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ startClientY: number; startPanelHeight: number } | null>(null);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const state = dragStateRef.current;
      if (!state) return;
      const deltaY = e.clientY - state.startClientY;
      const raw = state.startPanelHeight + deltaY * DRAG_SENSITIVITY;
      const clamped = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, raw));
      panelHeight.set(clamped);
    },
    [panelHeight]
  );

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      const el = handleRef.current;
      if (el) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          // ignore if already released
        }
        el.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerup', onPointerUp);
        el.removeEventListener('pointercancel', onPointerUp);
      }
      dragStateRef.current = null;
      const current = panelHeight.get();
      const target = current < SNAP_THRESHOLD ? ANALYTICS_COLLAPSED : ANALYTICS_EXPANDED;
      animate(panelHeight, target, SPRING);
    },
    [panelHeight, onPointerMove]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = handleRef.current;
      if (!el || e.button !== 0) return;
      dragStateRef.current = {
        startClientY: e.clientY,
        startPanelHeight: panelHeight.get(),
      };
      el.setPointerCapture(e.pointerId);
      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerUp);
    },
    [panelHeight, onPointerMove, onPointerUp]
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 flex flex-col">
        <motion.div
          style={{ height: panelHeight, backgroundColor: '#006776' }}
          className="shrink-0 overflow-hidden relative pt-safe-top"
        >
        <div className="h-full px-5 pb-3 flex flex-col overflow-y-auto min-h-0 hide-scrollbar">
          <motion.div
            style={{ opacity: headerOpacity }}
            className="flex items-center justify-between mb-4 pt-3"
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

          <motion.div
            style={{ opacity: contentOpacity }}
            className="bg-[#004D5C] rounded-2xl p-5 mb-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-8xl font-bold text-white leading-none tracking-tight">
                  {todayCalories}
                </div>
                <p className="text-white/70 text-lg mt-2">ккал из {goal}</p>
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
        </motion.div>

        <motion.div
          ref={handleRef}
          onPointerDown={handlePointerDown}
          className="shrink-0 rounded-b-3xl bg-[#006776] flex justify-center items-center cursor-grab active:cursor-grabbing touch-none select-none"
          style={{ height: HANDLE_STRIP_HEIGHT, touchAction: 'none' }}
        >
          <div className="w-12 h-1.5 bg-white/35 rounded-full pointer-events-none" />
        </motion.div>
      </div>

      {/* Cards — clear gap below handle strip */}
      <div className="flex flex-col flex-1 min-h-0 gap-3 px-4 pt-6 pb-4 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 30, delay: 0.15 }}
          className="rounded-3xl overflow-hidden relative flex-1"
          style={{ backgroundColor: '#F5941D' }}
          whileTap={{ scale: 0.985 }}
        >
          <div className="flex items-center justify-between h-full px-6 py-6">
            <div className="flex-1 pr-4">
              <h2 className="text-5xl font-bold text-white leading-tight">
                Конструктор тренировок
              </h2>
            </div>
            <div className="w-[42%] flex items-center justify-center min-h-[140px] shrink-0">
              <img src={constructorImg} alt="Constructor" className="w-full h-full min-h-[120px] max-h-[200px] object-contain object-right" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 30, delay: 0.25 }}
          className="rounded-3xl overflow-hidden relative flex-1"
          style={{ backgroundColor: '#4ECDC4' }}
          whileTap={{ scale: 0.985 }}
        >
          <div className="flex items-center justify-between h-full px-6 py-6">
            <div className="flex-1 pr-4">
              <div className="text-8xl font-bold text-[#0D3B3B] leading-none tracking-tight">150</div>
              <p className="text-[#0D3B3B]/80 text-xl font-medium mt-2">Готовых тренировок</p>
            </div>
            <div className="w-[42%] flex items-center justify-center min-h-[140px] shrink-0">
              <img src={workoutsImg} alt="Workouts" className="w-full h-full min-h-[120px] max-h-[200px] object-contain" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardView;
