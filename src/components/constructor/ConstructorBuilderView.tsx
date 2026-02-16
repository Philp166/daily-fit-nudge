import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Save, Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { useWorkout, type BuilderExercise } from '@/contexts/WorkoutContext';
import { getExerciseById, MUSCLE_GROUP_META } from '@/data/exercises';
import { ParameterType } from '@/types/exercise';

interface ConstructorBuilderViewProps {
  onClose: () => void;
  onStartWorkout: () => void;
  onOpenCatalog: () => void;
}

/** Компактная строка параметров для карточки */
function shortParams(b: BuilderExercise): string {
  const ex = getExerciseById(b.exerciseId);
  if (!ex) return '';
  const pt = ex.parameterType;

  if (pt === ParameterType.SETS_REPS || pt === ParameterType.SETS_REPS_WEIGHT) {
    let s = `${b.sets} × ${b.reps}`;
    if (pt === ParameterType.SETS_REPS_WEIGHT && b.weight > 0) s += ` • ${b.weight} кг`;
    return s;
  }
  if (pt === ParameterType.DURATION) {
    const mins = Math.floor(b.duration / 60);
    const secs = b.duration % 60;
    const t = mins > 0 ? (secs > 0 ? `${mins}м ${secs}с` : `${mins}м`) : `${secs}с`;
    return b.sets > 1 ? `${b.sets} × ${t}` : t;
  }
  if (pt === ParameterType.DISTANCE_TIME) {
    const d = b.distance >= 1000 ? `${b.distance / 1000}км` : `${b.distance}м`;
    const mins = Math.floor(b.duration / 60);
    const secs = b.duration % 60;
    return `${d} • ${mins}:${secs.toString().padStart(2, '0')}`;
  }
  if (pt === ParameterType.ROUNDS_DURATION) {
    const mins = Math.floor(b.duration / 60);
    const secs = b.duration % 60;
    const t = mins > 0 ? (secs > 0 ? `${mins}м ${secs}с` : `${mins}м`) : `${secs}с`;
    return `${b.sets} р. × ${t}`;
  }
  return '';
}

/** Инлайн-редактор числового поля */
function NumericField({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-[#030032]/50">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-7 h-7 rounded-full bg-[#efefef] flex items-center justify-center text-[#030032] active:bg-[#ddd]"
          style={{ touchAction: 'manipulation' }}
        >
          −
        </button>
        <span className="text-base font-medium text-[#030032] min-w-[32px] text-center">
          {value}{suffix ?? ''}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + step)}
          className="w-7 h-7 rounded-full bg-[#efefef] flex items-center justify-center text-[#030032] active:bg-[#ddd]"
          style={{ touchAction: 'manipulation' }}
        >
          +
        </button>
      </div>
    </div>
  );
}

const ConstructorBuilderView: React.FC<ConstructorBuilderViewProps> = ({
  onClose,
  onStartWorkout,
  onOpenCatalog,
}) => {
  const {
    builderExercises,
    removeFromBuilder,
    updateBuilderExercise,
    reorderBuilder,
    clearBuilder,
    saveWorkout,
    getTotalBuilderCalories,
    getTotalBuilderDuration,
  } = useWorkout();

  const [expandedUid, setExpandedUid] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workoutName, setWorkoutName] = useState('');

  const totalCalories = getTotalBuilderCalories();
  const totalDuration = getTotalBuilderDuration();

  const handleSave = () => {
    if (!workoutName.trim()) return;
    saveWorkout(workoutName.trim());
    setShowSaveDialog(false);
    setWorkoutName('');
  };

  const handleStart = () => {
    if (builderExercises.length === 0) return;
    onStartWorkout();
  };

  return (
    <div className="bg-white min-h-screen min-w-[390px] w-full flex flex-col pt-safe-top">
      {/* Шапка */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex items-center justify-between px-4 pt-6 pb-2 shrink-0"
      >
        <h1 className="text-xl font-semibold text-[#030032]">Сборка тренировки</h1>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[#f4f4f4] text-[#030032] active:opacity-80"
          aria-label="Закрыть"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </motion.div>

      {/* Сводка: калории + время */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.05 }}
        className="mx-4 mb-3 p-4 rounded-2xl bg-[#006776] flex items-center justify-between"
      >
        <div>
          <p className="text-white/60 text-sm">Всего</p>
          <p className="text-2xl font-bold text-white">{totalCalories} ккал</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-sm">Время</p>
          <p className="text-2xl font-bold text-white">~{totalDuration} мин</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-sm">Упражн.</p>
          <p className="text-2xl font-bold text-white">{builderExercises.length}</p>
        </div>
      </motion.div>

      {/* Список упражнений */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-44">
        <AnimatePresence mode="popLayout">
          {builderExercises.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <p className="text-4xl mb-3">🏋️</p>
              <p className="text-[#030032]/60 text-base">Добавьте упражнения из каталога</p>
            </motion.div>
          ) : (
            builderExercises.map((b, index) => {
              const ex = getExerciseById(b.exerciseId);
              if (!ex) return null;
              const isExpanded = expandedUid === b.uid;
              const pt = ex.parameterType;

              return (
                <motion.div
                  key={b.uid}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="mb-3 rounded-3xl bg-[#efefef] overflow-hidden"
                >
                  {/* Основная строка */}
                  <div
                    className="flex items-center gap-2.5 p-4 min-h-[72px] cursor-pointer"
                    onClick={() => setExpandedUid(isExpanded ? null : b.uid)}
                  >
                    {/* Порядковый номер */}
                    <span className="text-sm font-medium text-[#030032]/40 w-5 text-center shrink-0">
                      {index + 1}
                    </span>
                    {/* Emoji */}
                    <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-white text-[22px]">
                      {ex.emoji}
                    </div>
                    {/* Название + параметры */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base text-[#030032] font-normal">{ex.name}</p>
                      <p className="text-sm text-[#030032]/50 mt-0.5">{shortParams(b)}</p>
                    </div>
                    {/* Перемещение */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index > 0) reorderBuilder(index, index - 1);
                        }}
                        disabled={index === 0}
                        className="w-6 h-6 flex items-center justify-center text-[#030032]/30 disabled:opacity-20"
                        style={{ touchAction: 'manipulation' }}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index < builderExercises.length - 1) reorderBuilder(index, index + 1);
                        }}
                        disabled={index === builderExercises.length - 1}
                        className="w-6 h-6 flex items-center justify-center text-[#030032]/30 disabled:opacity-20"
                        style={{ touchAction: 'manipulation' }}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Развернутый редактор */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-[#030032]/10">
                          <div className="flex flex-wrap gap-4 justify-center py-3">
                            {/* Sets — всегда показываем для repeatable */}
                            {(pt === ParameterType.SETS_REPS ||
                              pt === ParameterType.SETS_REPS_WEIGHT ||
                              pt === ParameterType.DURATION ||
                              pt === ParameterType.ROUNDS_DURATION) && (
                              <NumericField
                                label={pt === ParameterType.ROUNDS_DURATION ? 'Раунды' : 'Подходы'}
                                value={b.sets}
                                onChange={(v) => updateBuilderExercise(b.uid, { sets: v })}
                                min={1}
                              />
                            )}

                            {/* Reps */}
                            {(pt === ParameterType.SETS_REPS ||
                              pt === ParameterType.SETS_REPS_WEIGHT) && (
                              <NumericField
                                label="Повторения"
                                value={b.reps}
                                onChange={(v) => updateBuilderExercise(b.uid, { reps: v })}
                                min={1}
                              />
                            )}

                            {/* Weight */}
                            {pt === ParameterType.SETS_REPS_WEIGHT && (
                              <NumericField
                                label="Вес (кг)"
                                value={b.weight}
                                onChange={(v) => updateBuilderExercise(b.uid, { weight: v })}
                                min={0}
                                step={2.5}
                              />
                            )}

                            {/* Duration */}
                            {(pt === ParameterType.DURATION ||
                              pt === ParameterType.DISTANCE_TIME ||
                              pt === ParameterType.ROUNDS_DURATION) && (
                              <NumericField
                                label="Время (сек)"
                                value={b.duration}
                                onChange={(v) => updateBuilderExercise(b.uid, { duration: v })}
                                min={5}
                                step={pt === ParameterType.ROUNDS_DURATION ? 30 : 10}
                              />
                            )}

                            {/* Distance */}
                            {pt === ParameterType.DISTANCE_TIME && (
                              <NumericField
                                label="Дист. (м)"
                                value={b.distance}
                                onChange={(v) => updateBuilderExercise(b.uid, { distance: v })}
                                min={0}
                                step={100}
                              />
                            )}

                            {/* Rest */}
                            <NumericField
                              label="Отдых (сек)"
                              value={b.rest}
                              onChange={(v) => updateBuilderExercise(b.uid, { rest: v })}
                              min={0}
                              step={15}
                            />
                          </div>

                          {/* Интенсивность */}
                          <div className="flex gap-2 justify-center mt-2 mb-2">
                            {(['light', 'moderate', 'vigorous'] as const).map((level) => {
                              const labels = { light: 'Легко', moderate: 'Средне', vigorous: 'Тяжело' };
                              const active = b.intensity === level;
                              return (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => updateBuilderExercise(b.uid, { intensity: level })}
                                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    active
                                      ? 'bg-[#fc7a18] text-white'
                                      : 'bg-white text-[#030032]/60'
                                  }`}
                                  style={{ touchAction: 'manipulation' }}
                                >
                                  {labels[level]}
                                </button>
                              );
                            })}
                          </div>

                          {/* Удалить */}
                          <button
                            type="button"
                            onClick={() => removeFromBuilder(b.uid)}
                            className="flex items-center gap-1.5 mx-auto mt-2 text-sm text-red-500 active:opacity-70"
                            style={{ touchAction: 'manipulation' }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Удалить
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Фиксированная панель снизу */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#030032]/10 px-4 py-3 pb-safe-bottom z-50">
        <div className="flex gap-3">
          {/* Добавить упражнение */}
          <button
            type="button"
            onClick={onOpenCatalog}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#efefef] text-[#030032] active:bg-[#ddd]"
            style={{ touchAction: 'manipulation' }}
            aria-label="Добавить упражнение"
          >
            <Plus className="h-5 w-5" />
          </button>

          {/* Сохранить */}
          <button
            type="button"
            onClick={() => {
              if (builderExercises.length > 0) setShowSaveDialog(true);
            }}
            disabled={builderExercises.length === 0}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#efefef] text-[#030032] active:bg-[#ddd] disabled:opacity-30"
            style={{ touchAction: 'manipulation' }}
            aria-label="Сохранить тренировку"
          >
            <Save className="h-5 w-5" />
          </button>

          {/* Очистить */}
          <button
            type="button"
            onClick={() => {
              if (builderExercises.length > 0) clearBuilder();
            }}
            disabled={builderExercises.length === 0}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#efefef] text-red-500 active:bg-[#ddd] disabled:opacity-30"
            style={{ touchAction: 'manipulation' }}
            aria-label="Очистить"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          {/* Начать */}
          <button
            type="button"
            onClick={handleStart}
            disabled={builderExercises.length === 0}
            className="flex-1 h-12 rounded-2xl bg-[#fc7a18] text-white font-semibold text-base flex items-center justify-center gap-2 active:opacity-90 disabled:opacity-30"
            style={{ touchAction: 'manipulation' }}
          >
            <Play className="h-5 w-5" fill="white" />
            Начать тренировку
          </button>
        </div>
      </div>

      {/* Диалог сохранения */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center px-6"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
            >
              <h3 className="text-lg font-semibold text-[#030032] mb-4">Название тренировки</h3>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Например: Грудь + Трицепс"
                className="w-full rounded-2xl bg-[#efefef] px-4 py-3 text-[#030032] placeholder:text-[#030032]/40 text-base outline-none mb-4"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 h-11 rounded-2xl bg-[#efefef] text-[#030032] font-medium"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!workoutName.trim()}
                  className="flex-1 h-11 rounded-2xl bg-[#fc7a18] text-white font-medium disabled:opacity-30"
                >
                  Сохранить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConstructorBuilderView;
