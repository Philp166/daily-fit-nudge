import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useUser, getLocalDateKey, type DayStats } from '@/contexts/UserContext';
import { useWorkout, type CompletedWorkout } from '@/contexts/WorkoutContext';
import CircularProgress from '@/components/dashboard/CircularProgress';
import logoSvg from '@/assets/logo.svg';
import constructorImg from '@/assets/constructor-img.png';
import workoutsImg from '@/assets/workouts-img.png';
import ConstructorCatalogView from '@/components/constructor/ConstructorCatalogView';
import ConstructorCategoryView from '@/components/constructor/ConstructorCategoryView';
import ConstructorBuilderView from '@/components/constructor/ConstructorBuilderView';
import WorkoutExecutionView from '@/components/constructor/WorkoutExecutionView';
import WorkoutResultView from '@/components/constructor/WorkoutResultView';
import { ALL_EXERCISES } from '@/data/exercises';
import { ActivityType } from '@/types/exercise';
import type { Exercise } from '@/types/exercise';

type Period = 'day' | 'week' | 'month';

const HANDLE_STRIP_HEIGHT = 36;
const ANALYTICS_EXPANDED = 420 - HANDLE_STRIP_HEIGHT; // half-expanded: calories + stats
const ANALYTICS_COLLAPSED = 76 - HANDLE_STRIP_HEIGHT;
const OVERDRAG = 24;
const BOTTOM_RESERVED_PX = 112; // content pb-28 (112) for nav area
const GAP_ABOVE_NAV_PX = 16; // gap between expanded analytics and navbar
const DRAG_SENSITIVITY = 1.3;

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 30, mass: 1 };

type BarShapeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  index: number;
};
function AnimatedBarShape(props: BarShapeProps & { selected: boolean }) {
  const { x, y, width, height, fill = 'rgba(255,255,255,0.35)', selected } = props;
  const rx = Math.min(6, width / 2, height / 2);
  return (
    <motion.g
      style={{ transformOrigin: `${x + width / 2}px ${y + height}px` }}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rx}
        ry={rx}
        fill={fill}
        style={{ transformOrigin: `${width / 2}px ${height / 2}px` }}
        animate={{ scale: selected ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </motion.g>
  );
}

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

interface DashboardViewProps {
  onConstructorScreenChange?: (isOpen: boolean) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onConstructorScreenChange }) => {
  const {
    todayCalories,
    profile,
    getLast7Days,
    getDaysOfWeek,
    getDaysOfMonth,
    getDaysOfMonthSampled,
    getWeekLabel,
    getMonthLabel,
  } = useUser();
  const goal = profile?.dailyCalorieGoal || 800;

  const [period, setPeriod] = useState<Period>('day');
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedChartIndex, setSelectedChartIndex] = useState(0);
  const [analyticsFull, setAnalyticsFull] = useState(600);
  const [constructorScreen, setConstructorScreen] = useState<'categories' | 'catalog' | 'builder' | 'execution' | 'result' | null>(null);
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType | null>(null);
  const [workoutResult, setWorkoutResult] = useState<CompletedWorkout | null>(null);

  const { builderExercises, addToBuilder, startSession, finishSession, cancelSession } = useWorkout();

  const todayKey = getLocalDateKey(new Date());

  useEffect(() => {
    const updateFull = () => {
      const reserved = BOTTOM_RESERVED_PX + HANDLE_STRIP_HEIGHT + GAP_ABOVE_NAV_PX;
      setAnalyticsFull(Math.max(420, window.innerHeight - reserved));
    };
    updateFull();
    window.addEventListener('resize', updateFull);
    return () => window.removeEventListener('resize', updateFull);
  }, []);

  useEffect(() => {
    onConstructorScreenChange?.(constructorScreen !== null);
  }, [constructorScreen, onConstructorScreenChange]);

  const ANALYTICS_FULL = analyticsFull;
  const MIN_HEIGHT = ANALYTICS_COLLAPSED - OVERDRAG;
  const MAX_HEIGHT = ANALYTICS_FULL + OVERDRAG;

  const chartData: DayStats[] =
    period === 'day'
      ? getLast7Days()
      : period === 'week'
        ? getDaysOfWeek(weekOffset)
        : getDaysOfMonthSampled(monthOffset);
  const monthFullData = period === 'month' ? getDaysOfMonth(monthOffset) : [];

  useEffect(() => {
    setSelectedChartIndex((prev) => (prev >= chartData.length ? Math.max(0, chartData.length - 1) : prev));
  }, [period, chartData.length, weekOffset, monthOffset]);

  useEffect(() => {
    if (period === 'day') {
      const todayIndex = chartData.findIndex((d) => d.date === todayKey);
      if (todayIndex >= 0) setSelectedChartIndex(todayIndex);
    }
  }, [period]);

  const selectedStats = chartData[selectedChartIndex] ?? chartData[0];
  const displayCalories =
    period === 'day'
      ? (selectedStats?.calories ?? todayCalories)
      : period === 'week'
        ? chartData.reduce((sum, d) => sum + (d.calories ?? 0), 0)
        : monthFullData.reduce((sum, d) => sum + (d.calories ?? 0), 0);
  const periodGoal =
    period === 'day' ? goal : period === 'week' ? goal * 7 : goal * (monthFullData.length || 1);
  const displayProgress =
    periodGoal ? Math.min(Math.round((displayCalories / periodGoal) * 100), 100) : 0;

  const periodSubtitle =
    period === 'day'
      ? selectedStats?.date === todayKey
        ? 'Сегодня'
        : (() => {
            const d = selectedStats?.date;
            if (!d) return 'ккал';
            const [y, m, day] = d.split('-').map(Number);
            const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
            return `${day} ${months[(m ?? 1) - 1]}`;
          })()
      : period === 'week'
        ? getWeekLabel(weekOffset)
        : getMonthLabel(monthOffset);

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
  const chartContainerHeight = useTransform(
    panelHeight,
    [ANALYTICS_EXPANDED, ANALYTICS_FULL],
    [0, 180]
  );
  const chartOpacity = useTransform(
    panelHeight,
    [ANALYTICS_EXPANDED, ANALYTICS_EXPANDED + 60, ANALYTICS_FULL],
    [0, 0, 1]
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

  // Экран выбора категории
  if (constructorScreen === 'categories') {
    return (
      <ConstructorCategoryView
        onSelectType={(type) => {
          setSelectedActivityType(type);
          setConstructorScreen('catalog');
        }}
        onClose={() => {
          // Если есть упражнения в билдере — возврат к билдеру, иначе на главную
          if (builderExercises.length > 0) {
            setConstructorScreen('builder');
          } else {
            setConstructorScreen(null);
          }
          setSelectedActivityType(null);
        }}
      />
    );
  }

  // Экран каталога упражнений
  if (constructorScreen === 'catalog') {
    const filteredExercises = selectedActivityType
      ? ALL_EXERCISES.filter((ex) => ex.activityType === selectedActivityType)
      : ALL_EXERCISES;

    return (
      <ConstructorCatalogView
        exercises={filteredExercises}
        initialActivityType={selectedActivityType || undefined}
        onBack={() => {
          setConstructorScreen('categories');
          setSelectedActivityType(null);
        }}
        onClose={() => {
          setConstructorScreen('builder');
          setSelectedActivityType(null);
        }}
        onAddExercise={(exercise) => {
          addToBuilder(exercise);
        }}
      />
    );
  }

  // Экран сборки тренировки
  if (constructorScreen === 'builder') {
    return (
      <ConstructorBuilderView
        onClose={() => {
          setConstructorScreen(null);
        }}
        onStartWorkout={() => {
          startSession('Моя тренировка');
          setConstructorScreen('execution');
        }}
        onOpenCatalog={() => {
          setConstructorScreen('categories');
        }}
      />
    );
  }

  // Экран выполнения тренировки
  if (constructorScreen === 'execution') {
    return (
      <WorkoutExecutionView
        onFinish={() => {
          const result = finishSession();
          setWorkoutResult(result);
          setConstructorScreen('result');
        }}
        onCancel={() => {
          cancelSession();
          setConstructorScreen(null);
        }}
      />
    );
  }

  // Экран результата
  if (constructorScreen === 'result' && workoutResult) {
    return (
      <WorkoutResultView
        result={workoutResult}
        onClose={() => {
          setWorkoutResult(null);
          setConstructorScreen(null);
        }}
      />
    );
  }

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
            <div className="flex items-center gap-1">
              {period === 'week' && (
                <button
                  type="button"
                  onClick={() => setWeekOffset((o) => o + 1)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  style={{ touchAction: 'manipulation' }}
                  aria-label="Предыдущая неделя"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
              )}
              {period === 'month' && (
                <button
                  type="button"
                  onClick={() => setMonthOffset((o) => o + 1)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  style={{ touchAction: 'manipulation' }}
                  aria-label="Предыдущий месяц"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
              )}
              <div className="flex items-center bg-[#005563] rounded-full p-1">
                {(['day', 'week', 'month'] as Period[]).map((p) => {
                  const label = p === 'day' ? 'Д' : p === 'week' ? 'Н' : 'М';
                  const isActive = period === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                      setPeriod(p);
                      if (p === 'day') setSelectedChartIndex(6);
                      if (p === 'week') setWeekOffset(0);
                      if (p === 'month') setMonthOffset(0);
                    }}
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
              {period === 'week' && (
                <button
                  type="button"
                  onClick={() => setWeekOffset((o) => Math.max(0, o - 1))}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
                  style={{ touchAction: 'manipulation' }}
                  aria-label="Ближе к текущей"
                  disabled={weekOffset <= 0}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              )}
              {period === 'month' && (
                <button
                  type="button"
                  onClick={() => setMonthOffset((o) => Math.max(0, o - 1))}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
                  style={{ touchAction: 'manipulation' }}
                  aria-label="Ближе к текущему месяцу"
                  disabled={monthOffset <= 0}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              )}
            </div>
          </motion.div>

          {/* Spacer above chart: pushes chart + calories + metrics to the bottom when fully expanded */}
          <div className="flex-1 min-h-0" aria-hidden />

          <motion.div
            style={{ height: chartContainerHeight, opacity: chartOpacity }}
            className="mb-1 w-full overflow-hidden shrink-0 px-1 flex flex-col justify-end touch-none"
            onPanEnd={(_, info) => {
              const { offset, velocity } = info;
              if (Math.abs(offset.x) < Math.abs(offset.y)) return;
              const v = velocity.x;
              if (period === 'week') {
                if (v < -200) setWeekOffset((o) => Math.max(0, o - 1));
                else if (v > 200) setWeekOffset((o) => o + 1);
              } else if (period === 'month') {
                if (v < -200) setMonthOffset((o) => Math.max(0, o - 1));
                else if (v > 200) setMonthOffset((o) => o + 1);
              }
            }}
          >
            <div className={`h-full min-h-[140px] flex ${chartData.length === 1 ? 'w-full justify-start' : 'w-full'}`}>
              <ResponsiveContainer
                width={chartData.length === 1 ? 60 : '100%'}
                height="100%"
                className={chartData.length === 1 ? '!min-w-0 shrink-0' : ''}
              >
                <BarChart
                  data={chartData.map((d, i) => ({ ...d, index: i, barValue: Math.max(d.calories, 1) }))}
                  margin={{ top: 8, right: 8, left: 8, bottom: 4 }}
                  barCategoryGap={12}
                  barSize={24}
                >
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    padding={chartData.length === 1 ? { left: 0, right: 0 } : undefined}
                  />
                  <YAxis hide domain={[0, (max: number) => Math.max(max, goal, 50)]} />
                  <Bar
                    dataKey="barValue"
                    cursor="pointer"
                    isAnimationActive={false}
                    minPointSize={8}
                    onClick={(_: unknown, index: number) => setSelectedChartIndex(index)}
                    shape={(shapeProps: BarShapeProps) => (
                      <AnimatedBarShape
                        {...shapeProps}
                        selected={shapeProps.index === selectedChartIndex}
                        fill={
                          shapeProps.index === selectedChartIndex
                            ? '#FF8A00'
                            : 'rgba(255,255,255,0.35)'
                        }
                      />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: contentOpacity }}
            className="bg-[#004D5C] rounded-2xl p-5 mb-4 shrink-0"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-8xl font-bold text-white leading-none tracking-tight">
                  {displayCalories}
                </div>
                <p className="text-white/70 text-lg mt-2">
                  {period === 'day' ? `ккал из ${goal} • ${periodSubtitle}` : `ккал • ${periodSubtitle}`}
                </p>
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
            className="flex items-start justify-between px-2 shrink-0"
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
          role="button"
          tabIndex={0}
          onClick={() => setConstructorScreen('categories')}
          onKeyDown={(e) => e.key === 'Enter' && setConstructorScreen('categories')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 30, delay: 0.15 }}
          className="rounded-3xl overflow-hidden relative flex-1 cursor-pointer"
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
