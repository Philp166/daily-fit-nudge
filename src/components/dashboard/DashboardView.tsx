import React from 'react';
import { motion, useScroll, useTransform, useDragControls } from 'framer-motion';

import { useUser } from '@/contexts/UserContext';
import CaloriesWidget from '@/components/dashboard/CaloriesWidget';
import CircularProgress from '@/components/dashboard/CircularProgress';

interface CardData {
  id: number;
  background: string;
  badge?: string;
  icon: string;
  title?: string;
  description?: string;
  buttonText?: string;
  bigNumber?: string;
  bigNumberLabel?: string;
  showProgress?: boolean;
}

const cardData: CardData[] = [
  {
    id: 1,
    background: 'linear-gradient(to bottom right, #3699FF, #80BCFF)',
    icon: '💪',
    title: 'Создай свою тренировку',
    description: 'Собери идеальную тренировочную программу под себя',
    buttonText: 'Начать',
  },
  {
    id: 2,
    background: 'linear-gradient(to bottom right, #FF5353, #FFD48F)',
    badge: 'Готовые тренировки',
    icon: '🏃',
    bigNumber: '37',
    bigNumberLabel: 'готовых программ',
  },
  {
    id: 3,
    background: 'linear-gradient(to bottom right, #9DFF53, #C2FF95)',
    badge: 'Аналитика',
    showProgress: true,
  },
];

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

  const getDragControls = (cardId: number) => {
    if (cardId === 1) return dragControls1;
    if (cardId === 2) return dragControls2;
    return dragControls3;
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

  const renderCardContent = (card: CardData, controls: ReturnType<typeof useDragControls>) => {
    return (
      <>
        {/* Badge if exists */}
        {card.badge && (
          <div className={`inline-block px-4 py-2 bg-white/90 rounded-full ${card.title ? 'mb-6' : 'mb-8'}`}>
            <span className="text-sm font-medium text-gray-900">{card.badge}</span>
          </div>
        )}

        {/* Constructor card layout */}
        {card.title && (
          <>
            <div className="flex items-start gap-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <span className="text-5xl">{card.icon}</span>
              </div>
              <div className="flex-1 pt-2">
                <h2 className="text-3xl font-semibold text-white leading-tight">
                  {card.title}
                </h2>
              </div>
            </div>
            {card.description && (
              <p className="text-white/90 text-base mb-8 leading-relaxed">
                {card.description}
              </p>
            )}
            {card.buttonText && (
              <button
                type="button"
                className="w-full py-4 rounded-full bg-white text-blue-600 text-base font-semibold active:scale-[0.98] transition-all shadow-lg"
                style={{ touchAction: 'manipulation' }}
              >
                {card.buttonText}
              </button>
            )}
          </>
        )}

        {/* Big number layout */}
        {card.bigNumber && (
          <div className="flex items-center justify-between">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-5xl">{card.icon}</span>
            </div>
            <div className="text-right">
              <div className="text-[120px] font-extralight text-white leading-none">
                {card.bigNumber}
              </div>
              {card.bigNumberLabel && (
                <p className="text-white/90 text-lg font-medium mt-2">
                  {card.bigNumberLabel}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Progress layout */}
        {card.showProgress && (
          <div className="flex items-center justify-between">
            <div className="relative">
              <CircularProgress value={0} size={120} strokeWidth={10} delay={0.3} showValue={false} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-light text-white">0%</span>
              </div>
            </div>
            <div className="text-right flex-1 ml-6">
              <div className="text-[72px] font-extralight text-white leading-none mb-2">
                0<span className="text-5xl text-white/80">/2100</span>
              </div>
              <p className="text-white/90 text-lg font-medium">
                калорий за неделю
              </p>
            </div>
          </div>
        )}

        {/* Drag Handle Strip */}
        <div
          onPointerDown={(e) => controls.start(e)}
          className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,0.15), transparent)',
            borderBottomLeftRadius: '32px',
            borderBottomRightRadius: '32px'
          }}
        >
          <div className="w-12 h-1 bg-white/40 rounded-full" />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Calories Widget with padding */}
      <div className="px-5 pt-safe-top">
        <CaloriesWidget />
      </div>

      {/* Stacked Cards - full width, overlapping */}
      <div className="relative mt-6">
        {cardOrder.map((cardId, index) => {
          const card = cardData.find(c => c.id === cardId)!;
          const controls = getDragControls(cardId);

          return (
            <motion.div
              key={cardId}
              drag="y"
              dragListener={false}
              dragControls={controls}
              dragConstraints={{ top: -100, bottom: 100 }}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={() => handleDragStart(cardId)}
              onDragEnd={handleDragEnd}
              style={{
                zIndex: getZIndex(cardId)
              }}
              animate={{
                rotate: draggedCard === cardId ? 5 : 0,
                y: draggedCard === cardId ? undefined : 0
              }}
              transition={{ duration: 0.2 }}
              className={`relative ${index > 0 ? '-mt-16' : ''} ${index === cardOrder.length - 1 ? 'pb-16' : ''}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="rounded-[32px] p-8 shadow-xl select-none relative"
                style={{
                  background: card.background
                }}
              >
                {renderCardContent(card, controls)}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardView;
