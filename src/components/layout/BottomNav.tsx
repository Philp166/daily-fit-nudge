import React from 'react';
import { motion } from 'framer-motion';
import { Home, Timer, User } from 'lucide-react';

export type Tab = 'home' | 'timer' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'home', icon: <Home size={22} strokeWidth={1.5} />, label: 'Главная' },
  { id: 'timer', icon: <Timer size={22} strokeWidth={1.5} />, label: 'Таймер' },
  { id: 'profile', icon: <User size={22} strokeWidth={1.5} />, label: 'Профиль' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center safe-nav-bottom z-50">
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.5 }}
        className="bg-[#006776] backdrop-blur-lg rounded-full px-3 py-2.5 mb-4 mx-4 flex items-center gap-1 shadow-2xl border border-white/10"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative px-7 py-3 rounded-full transition-all duration-200 active:scale-95 ${
              activeTab === tab.id
                ? 'text-[#0D3B3B]'
                : 'text-white/40 hover:text-white/60'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-full shadow-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
          </button>
        ))}
      </motion.nav>
    </div>
  );
};

export default BottomNav;
