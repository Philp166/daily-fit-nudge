import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Play, ChevronUp } from 'lucide-react';
import { getExerciseById, getExerciseIconComponent } from '@/data/exercises';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WorkoutExercise {
  id?: string;
  exerciseId: string;
  sets: number;
  workTime: number;
  restTime: number;
}

interface ActiveWorkoutWidgetProps {
  isVisible: boolean;
  workoutName: string;
  currentExercise: WorkoutExercise | null;
  currentSet: number;
  timeLeft: number;
  totalCalories: number;
  phase: 'work' | 'rest';
  onExpand: () => void;
  onCancel: () => void;
}

const ActiveWorkoutWidget: React.FC<ActiveWorkoutWidgetProps> = ({
  isVisible,
  workoutName,
  currentExercise,
  currentSet,
  timeLeft,
  totalCalories,
  phase,
  onExpand,
  onCancel,
}) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const exercise = currentExercise ? getExerciseById(currentExercise.exerciseId) : null;
  const ExerciseIcon = exercise ? getExerciseIconComponent(exercise.iconType) : Play;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    onCancel();
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 left-4 right-4 z-40"
          >
            <motion.div
              onClick={onExpand}
              className={`rounded-3xl p-4 shadow-2xl cursor-pointer transition-colors duration-300 ${
                phase === 'work' 
                  ? 'bg-blue-900/95 border border-blue-700/50' 
                  : 'bg-green-900/95 border border-green-700/50'
              }`}
              style={{ backdropFilter: 'blur(20px)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                {/* Exercise Icon */}
                <div className="w-12 h-12 rounded-2xl bg-foreground/10 flex items-center justify-center flex-shrink-0">
                  <ExerciseIcon size={24} className="text-foreground" strokeWidth={1.5} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-badge text-foreground/60 uppercase">
                      {phase === 'work' ? 'Работа' : 'Отдых'}
                    </span>
                    <span className="text-badge text-foreground/40">•</span>
                    <span className="text-badge text-foreground/60">
                      Подход {currentSet}/{currentExercise?.sets || 0}
                    </span>
                  </div>
                  <p className="text-body text-foreground truncate">
                    {exercise?.name || workoutName}
                  </p>
                </div>

                {/* Timer */}
                <div className="text-right flex-shrink-0">
                  <p className="text-title text-foreground font-mono">
                    {formatTime(timeLeft)}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <Flame size={12} className="text-primary" />
                    <span className="text-caption text-foreground/70">
                      {Math.round(totalCalories)} ккал
                    </span>
                  </div>
                </div>

                {/* Expand indicator */}
                <div className="flex-shrink-0 ml-1">
                  <ChevronUp size={20} className="text-foreground/50" />
                </div>

                {/* Close button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCancelClick}
                  className="w-8 h-8 rounded-xl bg-foreground/10 flex items-center justify-center flex-shrink-0"
                >
                  <X size={16} className="text-foreground/70" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Отменить тренировку?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Прогресс текущей тренировки будет потерян. Вы уверены?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-foreground border-0">
              Назад
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground"
            >
              Да, отменить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActiveWorkoutWidget;
