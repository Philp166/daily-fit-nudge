import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { useUser } from '@/contexts/UserContext';
import CaloriesWidget from '@/components/dashboard/CaloriesWidget';
import CircularProgress from '@/components/dashboard/CircularProgress';

const DashboardView: React.FC = () => {
  const { profile } = useUser();
  const { scrollY } = useScroll();
  const [cardOrder, setCardOrder] = React.useState([1, 2, 3]);
  const [activeCard, setActiveCard] = React.useState<number | null>(null);

  // Параллакс эффекты для карточек при скролле
  const card1Y = useTransform(scrollY, [0, 300], [0, -50]);
  const card2Y = useTransform(scrollY, [0, 300], [0, -100]);
  const card3Y = useTransform(scrollY, [0, 300], [0, -150]);

  const card1Scale = useTransform(scrollY, [0, 150], [1, 0.95]);
  const card2Scale = useTransform(scrollY, [0, 200], [1, 0.95]);

  const getZIndex = (cardId: number) => {
    if (activeCard === cardId) return 50;
    const position = cardOrder.indexOf(cardId);
    return 30 - position * 10;
  };

  const rotateCards = (cardId: number) => {
    setActiveCard(cardId);
    // Циклическая ротация: первая карточка уходит в конец
    setCardOrder(prev => [...prev.slice(1), prev[0]]);
    setTimeout(() => setActiveCard(null), 300);
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
          style={{
            y: card1Y,
            scale: card1Scale,
            zIndex: getZIndex(1)
          }}
          className="relative"
          onTapStart={() => rotateCards(1)}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-[32px] p-8 shadow-xl cursor-pointer"
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
          style={{
            y: card2Y,
            scale: card2Scale,
            zIndex: getZIndex(2)
          }}
          className="relative -mt-16"
          onTapStart={() => rotateCards(2)}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-[32px] p-8 shadow-xl cursor-pointer"
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
          style={{
            y: card3Y,
            zIndex: getZIndex(3)
          }}
          className="relative -mt-16 pb-16"
          onTapStart={() => rotateCards(3)}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-[32px] p-8 shadow-xl cursor-pointer"
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
