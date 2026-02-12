import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {

  // Данные для карточек упражнений с точными позициями для хаотичности
  const exerciseCards = [
    { emoji: '🏊', name: 'Плавание', rotation: -15, left: '2%', bottom: '15%' },
    { emoji: '💪', name: 'Приседания', rotation: 8, left: '15%', bottom: '8%' },
    { emoji: '🏈', name: 'Регби', rotation: -8, left: '35%', bottom: '12%' },
    { emoji: '🥊', name: 'Бокс', rotation: 12, left: '55%', bottom: '5%' },
    { emoji: '🧘', name: 'Пилатес', rotation: -12, left: '10%', bottom: '25%' },
    { emoji: '🧘‍♀️', name: 'Йога', rotation: 5, left: '45%', bottom: '22%' },
    { emoji: '⚽', name: 'Футбол', rotation: -6, left: '65%', bottom: '18%' },
    { emoji: '🏃', name: 'Отжимания', rotation: 10, left: '25%', bottom: '32%' },
    { emoji: '🏐', name: 'Волейбол', rotation: -10, left: '75%', bottom: '28%' },
    { emoji: '🤼', name: 'Вольная борьба', rotation: 14, left: '55%', bottom: '35%' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{
      background: 'linear-gradient(180deg, #4A9EFF 0%, #7BC4FF 100%)',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Верхняя часть с лого и текстом */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-40 pt-20">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15
          }}
          className="mb-10"
        >
          <div className="w-28 h-28 bg-white/20 backdrop-blur-lg rounded-[32px] flex items-center justify-center border border-white/40 shadow-2xl">
            <img
              src={`${import.meta.env.BASE_URL}logotyp.png`}
              alt="Interfit"
              className="w-20 h-20 object-contain"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-center text-[32px] font-semibold mb-10 leading-tight px-4"
        >
          Interfit <span className="font-normal">- твой помощник<br />в организации тренировок</span>
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full max-w-[calc(100%-4rem)] py-5 rounded-full bg-white text-gray-900 text-lg font-semibold active:scale-[0.98] transition-all shadow-xl"
          style={{ touchAction: 'manipulation' }}
        >
          Старт
        </motion.button>
      </div>

      {/* Хаотичные карточки внизу */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] pointer-events-none overflow-hidden">
        {exerciseCards.map((card, index) => (
          <motion.div
            key={card.name}
            initial={{
              y: 200,
              opacity: 0,
              rotate: 0,
              scale: 0.5
            }}
            animate={{
              y: 0,
              opacity: 0.95,
              rotate: card.rotation,
              scale: 1
            }}
            transition={{
              delay: index * 0.08,
              type: 'spring',
              damping: 14,
              stiffness: 80,
              mass: 0.8
            }}
            className="absolute bg-gray-100/95 backdrop-blur-md rounded-full px-4 py-3 shadow-xl flex items-center gap-3 border border-white/50"
            style={{
              left: card.left,
              bottom: card.bottom,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
              <span className="text-xl">{card.emoji}</span>
            </div>
            <span className="text-gray-800 font-medium whitespace-nowrap text-base">{card.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
