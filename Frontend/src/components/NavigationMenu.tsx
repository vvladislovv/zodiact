import React from 'react';

interface NavigationMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Главная', path: '/' },
    { id: 'subscriptions', label: 'Подписки', path: '/subscription' },
    { id: 'profile', label: 'Профиль', path: '/profile' },
    { id: 'history', label: 'История', path: '/history' }
  ];

  return (
    <div className="flex justify-center bg-gray-900/60 backdrop-blur-xl border-t border-purple-300/5 shadow-[0_-4px_6px_rgba(0,0,0,0.03),0_0_3px_rgba(147,51,234,0.03)] px-1 sm:px-2 py-1 fixed bottom-0 left-0 right-0 z-50 md:px-4 md:py-2">
      <div className="flex overflow-x-auto space-x-0.5 sm:space-x-1 md:space-x-2 max-w-full">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-2 sm:px-4 py-4 sm:py-6 text-sm sm:text-base transition-all duration-200 md:px-4 md:py-2 md:text-lg min-w-[60px] sm:min-w-[80px] ${
              activeTab === tab.id
                ? 'text-purple-300'
                : 'text-white hover:bg-gray-800/30'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationMenu;
