import React from 'react';
import { motion } from 'framer-motion';
import { Home, Timer, User } from 'lucide-react';

type Tab = 'home' | 'timer' | 'profile';

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
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-safe-bottom z-50">
      <nav className="glass-strong rounded-full px-3 py-2 mb-4 mx-4 flex items-center gap-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-6 py-3 rounded-full transition-colors duration-200 ${
              activeTab === tab.id
                ? 'text-primary-foreground'
                : 'text-foreground/50 hover:text-foreground/70'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-foreground rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
