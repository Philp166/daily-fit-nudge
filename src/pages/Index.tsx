import React, { useState } from 'react';
import { UserProvider, useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/layout/BottomNav';
import DashboardView from '@/components/dashboard/DashboardView';
import ProfileView from '@/components/profile/ProfileView';
import Onboarding from '@/components/onboarding/Onboarding';
import WelcomeScreen from '@/components/welcome/WelcomeScreen';

type Tab = 'home' | 'profile';

const AppContent: React.FC = () => {
  const { isOnboarded } = useUser();
  const [showWelcome, setShowWelcome] = useState(!isOnboarded);
  const [activeTab, setActiveTab] = useState<Tab>('home');

  // Show welcome screen for first-time users
  if (showWelcome && !isOnboarded) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  // Show onboarding for users who haven't completed it
  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto pb-28 pb-safe-bottom overscroll-contain">
        {activeTab === 'home' && (
          <>
            <DashboardView />
            <div className="min-h-[8rem] shrink-0" aria-hidden="true" />
          </>
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
