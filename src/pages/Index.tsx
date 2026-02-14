import React, { useState } from 'react';
import { UserProvider, useUser } from '@/contexts/UserContext';
import BottomNav, { type Tab } from '@/components/layout/BottomNav';
import DashboardView from '@/components/dashboard/DashboardView';
import ProfileView from '@/components/profile/ProfileView';
import Onboarding from '@/components/onboarding/Onboarding';
import WelcomeScreen from '@/components/welcome/WelcomeScreen';

const TimerPlaceholder: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-6">
    <div className="text-center">
      <div className="text-5xl mb-4">⏱</div>
      <h2 className="text-xl font-semibold text-white mb-2">Таймер</h2>
      <p className="text-white/40 text-sm">Скоро здесь появится таймер тренировок</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { isOnboarded } = useUser();
  const [showWelcome, setShowWelcome] = useState(!isOnboarded);
  const [activeTab, setActiveTab] = useState<Tab>('home');

  // TEMPORARY: Skip onboarding during dashboard development
  // Show welcome screen for first-time users
  // if (showWelcome && !isOnboarded) {
  //   return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  // }

  // Show onboarding for users who haven't completed it
  // if (!isOnboarded) {
  //   return <Onboarding />;
  // }

  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col">
      <div className="flex-1 overflow-hidden pb-24 pb-safe-bottom flex flex-col">
        {activeTab === 'home' && (
          <DashboardView />
        )}

        {activeTab === 'timer' && (
          <TimerPlaceholder />
        )}

        {activeTab === 'profile' && (
          <ProfileView />
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

const Index: React.FC = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default Index;
