import React from 'react';
import { motion, useScroll, useTransform, useDragControls } from 'framer-motion';

import { useUser } from '@/contexts/UserContext';
import CaloriesWidget from '@/components/dashboard/CaloriesWidget';
import CircularProgress from '@/components/dashboard/CircularProgress';

const DashboardView: React.FC = () => {
  const { profile } = useUser();
  const { scrollY } = useScroll();
  const [cardOrder, setCardOrder] = React.useState([1, 2, 3]);
  const [draggedCard, setDraggedCard] = React.useState<number | null>(null);

  // Drag controls для каждой карточки
  const dragControls1 = useDragControls();
  const dragControls2 = useDragControls();
  const dragControls3 = useDragControls();

  const getZIndex = (cardId: number) => {
    if (draggedCard === cardId) return 50;
    const position = cardOrder.indexOf(cardId);
    return 30 - position * 10;
  };

  const getOrder = (cardId: number) => {
    return cardOrder.indexOf(cardId);
  };

  const handleDragStart = (cardId: number) => {
    setDraggedCard(cardId);
  };

  const handleDragEnd = () => {
    if (draggedCard) {
      // Циклическая ротация: первая карточка уходит в конец
      setCardOrder(prev => [...prev.slice(1), prev[0]]);
    }
    setDraggedCard(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Calories Widget with padding */}
      <div className="px-5 pt-safe-top">
        <CaloriesWidget />
      </div>

      {/* Stacked Cards - full width, overlapping */}
      <div className="relative mt-6 flex flex-col">
        {/* Constructor Card - Blue */}
        <motion.div
          drag="y"
          dragListener={false}
          dragControls={dragControls1}
          dragConstraints={{ top: -100, bottom: 100 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragStart={() => handleDragStart(1)}
          onDragEnd={handleDragEnd}
          style={{
            zIndex: getZIndex(1),
            order: getOrder(1)
          }}
          animate={{
            rotate: draggedCard === 1 ? 5 : 0,
            y: draggedCard === 1 ? undefined : 0
          }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-[32px] p-8 shadow-xl select-none relative"
            style={{
              background: 'linear-gradient(to bottom right, #3699FF, #80BCFF)'
            }}
          >
            {/* Drag Handle Strip */}
            <div
              onPointerDown={(e) => dragControls1.start(e)}
              className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
              style={{
                background: 'linear-gradient(to top, rgba(255,255,255,0.15), transparent)',
                borderBottomLeftRadius: '32px',
                borderBottomRightRadius: '32px'
              }}
            >
              <div className="w-12 h-1 bg-white/40 rounded-full" />
            </div>

            {/* Icon and content */}
            <div className="flex items-start gap-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <span className="text-5xl">💪</span>
              </div>

              <div className="flex-1 pt-2">
                <h2 className="text-3xl font-semibold text-white leading-tight">
                  Создай свою тренировку
                </h2>
              </div>
            </div>

            <p className="text-white/90 text-base mb-8 leading-relaxed">
              Собери идеальную тренировочную программу под себя
            </p>

            <button
              type="button"
              className="w-full py-4 rounded-full bg-white text-blue-600 text-base font-semibold active:scale-[0.98] transition-all shadow-lg"
              style={{ touchAction: 'manipulation' }}
            >
              Начать
            </button>
          </motion.div>
        </motion.div>

        {/* Workouts Card - Orange/Coral */}
        <motion.div
          drag="y"
          dragListener={false}
          dragControls={dragControls2}
          dragConstraints={{ top: -100, bottom: 100 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragStart={() => handleDragStart(2)}
          onDragEnd={handleDragEnd}
          style={{
            zIndex: getZIndex(2),
            order: getOrder(2)
          }}
          animate={{
            rotate: draggedCard === 2 ? 5 : 0,
            y: draggedCard === 2 ? undefined : 0
          }}
          transition={{ duration: 0.2 }}
          className="relative -mt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-[32px] p-8 shadow-xl select-none relative"
            style={{
              background: 'linear-gradient(to bottom right, #FF5353, #FFD48F)'
            }}
          >
            {/* White pill badge */}
            <div className="inline-block px-4 py-2 bg-white/90 rounded-full mb-6">
              <span className="text-sm font-medium text-gray-900">Готовые тренировки</span>
            </div>

            <div className="flex items-center justify-between">
              {/* Icon */}
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-5xl">🏃</span>
              </div>

              {/* Big number */}
              <div className="text-right">
                <div className="text-[120px] font-extralight text-white leading-none">
                  37
                </div>
                <p className="text-white/90 text-lg font-medium mt-2">
                  готовых программ
                </p>
              </div>
            </div>

            {/* Drag Handle Strip */}
            <div
              onPointerDown={(e) => dragControls2.start(e)}
              className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
              style={{
                background: 'linear-gradient(to top, rgba(255,255,255,0.15), transparent)',
                borderBottomLeftRadius: '32px',
                borderBottomRightRadius: '32px'
              }}
            >
              <div className="w-12 h-1 bg-white/40 rounded-full" />
            </div>
          </motion.div>
        </motion.div>

        {/* Analytics Card - Green */}
        <motion.div
          drag="y"
          dragListener={false}
          dragControls={dragControls3}
          dragConstraints={{ top: -100, bottom: 100 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragStart={() => handleDragStart(3)}
          onDragEnd={handleDragEnd}
          style={{
            zIndex: getZIndex(3),
            order: getOrder(3)
          }}
          animate={{
            rotate: draggedCard === 3 ? 5 : 0,
            y: draggedCard === 3 ? undefined : 0
          }}
          transition={{ duration: 0.2 }}
          className="relative -mt-16 pb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-[32px] p-8 shadow-xl select-none relative"
            style={{
              background: 'linear-gradient(to bottom right, #9DFF53, #C2FF95)'
            }}
          >
            {/* White pill badge */}
            <div className="inline-block px-4 py-2 bg-white/90 rounded-full mb-8">
              <span className="text-sm font-medium text-gray-900">Аналитика</span>
            </div>

            <div className="flex items-center justify-between">
              {/* Circular progress */}
              <div className="relative">
                <CircularProgress value={0} size={120} strokeWidth={10} delay={0.3} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-light text-white">0%</span>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right flex-1 ml-6">
                <div className="text-[72px] font-extralight text-white leading-none mb-2">
                  0<span className="text-5xl text-white/80">/2100</span>
                </div>
                <p className="text-white/90 text-lg font-medium">
                  калорий за неделю
                </p>
              </div>
            </div>

            {/* Drag Handle Strip */}
            <div
              onPointerDown={(e) => dragControls3.start(e)}
              className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
              style={{
                background: 'linear-gradient(to top, rgba(255,255,255,0.15), transparent)',
                borderBottomLeftRadius: '32px',
                borderBottomRightRadius: '32px'
              }}
            >
              <div className="w-12 h-1 bg-white/40 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardView;
