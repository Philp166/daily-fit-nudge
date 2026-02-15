import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useUser, type DayStats } from '@/contexts/UserContext';
import CircularProgress from '@/components/dashboard/CircularProgress';
import logoSvg from '@/assets/logo.svg';
import constructorImg from '@/assets/constructor-img.png';
import workoutsImg from '@/assets/workouts-img.png';

type Period = 'day' | 'week' | 'month';

const HANDLE_STRIP_HEIGHT = 36;
const ANALYTICS_EXPANDED = 420 - HANDLE_STRIP_HEIGHT; // half-expanded: calories + stats
const ANALYTICS_COLLAPSED = 76 - HANDLE_STRIP_HEIGHT;
const OVERDRAG = 24;
const BOTTOM_RESERVED_PX = 112 + 16; // content pb-28 (112) + 16px gap above nav
const DRAG_SENSITIVITY = 1.3;

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 30, mass: 1 };

function getSnapTarget(
  current: number,
  collapsed: number,
  expanded: number,
  full: number
): number {
  const t1 = (collapsed + expanded) / 2;
  const t2 = (expanded + full) / 2;
  if (current < t1) return collapsed;
  if (current < t2) return expanded;
  return full;
}

const DashboardView: React.FC = () => {
  const {
    todayCalories,
    profile,
    getLast7Days,
    getLast4Weeks,
    getLast4WeeksForMonth,
  } = useUser();
  const goal = profile?.dailyCalorieGoal || 800;

  const [period, setPeriod] = useState<Period>('day');
  const [selectedChartIndex, setSelectedChartIndex] = useState(0);
  const [analyticsFull, setAnalyticsFull] = useState(600);

  useEffect(() => {
    const updateFull = () => {
      const reserved = BOTTOM_RESERVED_PX + HANDLE_STRIP_HEIGHT;
      setAnalyticsFull(Math.max(420, window.innerHeight - reserved));
    };
    updateFull();
    window.addEventListener('resize', updateFull);
    return () => window.removeEventListener('resize', updateFull);
  }, []);

  const ANALYTICS_FULL = analyticsFull;
  const MIN_HEIGHT = ANALYTICS_COLLAPSED - OVERDRAG;
  const MAX_HEIGHT = ANALYTICS_FULL + OVERDRAG;

  const chartData: DayStats[] =
    period === 'day'
      ? getLast7Days()
      : period === 'week'
        ? getLast4Weeks()
        : getLast4WeeksForMonth();

  useEffect(() => {
    setSelectedChartIndex((prev) => (prev >= chartData.length ? Math.max(0, chartData.length - 1) : prev));
  }, [period, chartData.length]);

  const selectedStats = chartData[selectedChartIndex] ?? chartData[0];
  const displayCalories = period === 'day' ? selectedStats?.calories ?? todayCalories : selectedStats?.calories ?? 0;
  const displayProgress = goal ? Math.min(Math.round((displayCalories / goal) * 100), 100) : 0;

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
  const chartOpacity = useTransform(
    panelHeight,
    [ANALYTICS_EXPANDED - 20, ANALYTICS_EXPANDED + 80, ANALYTICS_FULL],
    [0, 0.5, 1]
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
    [panelHeight, MIN_HEIGHT, MAX_HEIGHT]
  );

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      const el = handleRef.current;
      if (el) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        el.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerup', onPointerUp);
        el.removeEventListener('pointercancel', onPointerUp);
      }
      dragStateRef.current = null;
      const current = panelHeight.get();
      const target = getSnapTarget(current, ANALYTICS_COLLAPSED, ANALYTICS_EXPANDED, ANALYTICS_FULL);
      animate(panelHeight, target, SPRING);
    },
    [panelHeight, onPointerMove, ANALYTICS_COLLAPSED, ANALYTICS_EXPANDED, ANALYTICS_FULL]
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
                  {displayCalories}
                </div>
                <p className="text-white/70 text-lg mt-2">ккал из {goal}</p>
              </div>
              <div className="relative shrink-0">
                <CircularProgress
                  value={displayProgress}
                  size={90}
                  strokeWidth={9}
                  delay={0.4}
                  showValue={false}
                  color="#FF8A00"
                  trackColor="rgba(255,255,255,0.15)"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">{displayProgress}%</span>
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
                <span className="text-4xl font-bold text-white">{selectedStats?.workouts ?? 0}</span>
                <span className="text-xl text-white/80">трен.</span>
              </div>
              <p className="text-white/50 text-sm mt-1">физ.нагрузка</p>
            </div>
            <div className="flex-1 text-center">
              <div className="flex items-baseline gap-1 justify-center">
                <span className="text-4xl font-bold text-white">{selectedStats?.minutes ?? 0}</span>
                <span className="text-xl text-white/80">мин.</span>
              </div>
              <p className="text-white/50 text-sm mt-1">время активности</p>
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-4xl font-bold text-white">{selectedStats?.exercises ?? 0}</span>
                <span className="text-xl text-white/80">упр.</span>
              </div>
              <p className="text-white/50 text-sm mt-1">зоны роста</p>
            </div>
          </motion.div>

          <motion.div style={{ opacity: chartOpacity }} className="mt-2 h-[200px] w-full px-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.map((d, i) => ({ ...d, index: i }))}
                margin={{ top: 8, right: 8, left: 8, bottom: 4 }}
              >
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                />
                <YAxis hide domain={[0, (max: number) => Math.max(max, goal)]} />
                <Bar
                  dataKey="calories"
                  radius={[6, 6, 0, 0]}
                  cursor="pointer"
                  isAnimationActive={true}
                  onClick={(_: unknown, index: number) => setSelectedChartIndex(index)}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={index === selectedChartIndex ? '#FF8A00' : 'rgba(255,255,255,0.35)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
              <h2 className="text-4xl font-bold text-white leading-tight">
                Конструктор тренировок
              </h2>
            </div>
            <div className="w-[42%] flex items-center justify-center min-h-[120px] shrink-0 pr-2">
              <img src={constructorImg} alt="Constructor" className="max-w-[100px] max-h-[120px] w-auto h-auto object-contain object-center" />
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
              <p className="text-[#0D3B3B]/80 text-base sm:text-xl font-medium mt-2 whitespace-nowrap">Готовых тренировок</p>
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
