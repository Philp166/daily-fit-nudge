import React from 'react';
import { motion } from 'framer-motion';
import { Home, User } from 'lucide-react';

type Tab = 'home' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'home', icon: <Home size={22} strokeWidth={1.5} />, label: 'Главная' },
  { id: 'profile', icon: <User size={22} strokeWidth={1.5} />, label: 'Профиль' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-safe-bottom z-50">
      <nav className="bg-white/95 backdrop-blur-lg rounded-full px-4 py-3 mb-4 mx-4 flex items-center gap-2 shadow-2xl border border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative px-7 py-3.5 rounded-full transition-all duration-200 active:scale-95 ${
              activeTab === tab.id
                ? 'text-background'
                : 'text-foreground/40 hover:text-foreground/60'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-foreground rounded-full shadow-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
