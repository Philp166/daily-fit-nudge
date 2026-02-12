import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { useUser } from '@/contexts/UserContext';
import CaloriesWidget from '@/components/dashboard/CaloriesWidget';
import CircularProgress from '@/components/dashboard/CircularProgress';

const DashboardView: React.FC = () => {
  const { profile } = useUser();
  const { scrollY } = useScroll();
  const [cardOrder, setCardOrder] = React.useState([1, 2, 3]);
  const [draggedCard, setDraggedCard] = React.useState<number | null>(null);
  const [targetCard, setTargetCard] = React.useState<number | null>(null);

  // Параллакс эффекты для карточек при скролле (отключаются при драге)
  const card1Y = useTransform(scrollY, [0, 300], [0, -50]);
  const card2Y = useTransform(scrollY, [0, 300], [0, -100]);
  const card3Y = useTransform(scrollY, [0, 300], [0, -150]);

  const card1Scale = useTransform(scrollY, [0, 150], [1, 0.95]);
  const card2Scale = useTransform(scrollY, [0, 200], [1, 0.95]);

  const getZIndex = (cardId: number) => {
    if (draggedCard === cardId) return 50;
    const position = cardOrder.indexOf(cardId);
    return 30 - position * 10;
  };

  const handleDragStart = (cardId: number) => {
    setDraggedCard(cardId);
  };

  const handleDrag = (_event: any, info: any) => {
    // Определяем, над какой карточкой находится перетаскиваемая
    const dragY = info.point.y;

    // Простая логика: если тянем вверх, target - предыдущая карточка, если вниз - следующая
    if (draggedCard) {
      const currentIndex = cardOrder.indexOf(draggedCard);

      if (info.offset.y < -80 && currentIndex > 0) {
        // Тянем вверх - меняемся с предыдущей
        setTargetCard(cardOrder[currentIndex - 1]);
      } else if (info.offset.y > 80 && currentIndex < cardOrder.length - 1) {
        // Тянем вниз - меняемся со следующей
        setTargetCard(cardOrder[currentIndex + 1]);
      } else {
        setTargetCard(null);
      }
    }
  };

  const handleDragEnd = () => {
    if (draggedCard && targetCard) {
      // Меняем карточки местами
      setCardOrder(prev => {
        const newOrder = [...prev];
        const draggedIndex = newOrder.indexOf(draggedCard);
        const targetIndex = newOrder.indexOf(targetCard);
        [newOrder[draggedIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[draggedIndex]];
        return newOrder;
      });
    }

    setDraggedCard(null);
    setTargetCard(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Calories Widget with padding */}
      <div className="px-5 pt-safe-top">
        <CaloriesWidget />
      </div>

      {/* Stacked Cards - full width, overlapping */}
      <div className="relative mt-6">
        {/* Constructor Card - Blue */}
        <motion.div
          drag="y"
          dragConstraints={{ top: -200, bottom: 200 }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => handleDragStart(1)}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{
            y: draggedCard === 1 ? 0 : card1Y,
            scale: draggedCard === 1 ? 1 : card1Scale,
            zIndex: getZIndex(1)
          }}
          animate={{
            rotate: draggedCard === 1 ? 5 : 0,
            opacity: targetCard === 1 ? 0.5 : 1
          }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-[32px] p-8 shadow-xl cursor-grab active:cursor-grabbing"
            style={{
              background: 'linear-gradient(to bottom right, #3699FF, #80BCFF)'
            }}
          >
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
          dragConstraints={{ top: -200, bottom: 200 }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => handleDragStart(2)}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{
            y: draggedCard === 2 ? 0 : card2Y,
            scale: draggedCard === 2 ? 1 : card2Scale,
            zIndex: getZIndex(2)
          }}
          animate={{
            rotate: draggedCard === 2 ? 5 : 0,
            opacity: targetCard === 2 ? 0.5 : 1
          }}
          transition={{ duration: 0.2 }}
          className="relative -mt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-[32px] p-8 shadow-xl cursor-grab active:cursor-grabbing"
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
          </motion.div>
        </motion.div>

        {/* Analytics Card - Green */}
        <motion.div
          drag="y"
          dragConstraints={{ top: -200, bottom: 200 }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => handleDragStart(3)}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{
            y: draggedCard === 3 ? 0 : card3Y,
            scale: draggedCard === 3 ? 1 : 1,
            zIndex: getZIndex(3)
          }}
          animate={{
            rotate: draggedCard === 3 ? 5 : 0,
            opacity: targetCard === 3 ? 0.5 : 1
          }}
          transition={{ duration: 0.2 }}
          className="relative -mt-16 pb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-[32px] p-8 shadow-xl cursor-grab active:cursor-grabbing"
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardView;
