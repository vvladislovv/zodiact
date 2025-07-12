import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import { initializeTelegramApp } from './utils/telegram';
import Home from './features/Home/HomePage/Home';
import Profile from './features/Profile/ProfilePage/Profile';
import History from './features/History/HistoryPage/History';
import LoveReadings from './features/Categories/LoveReadings';
import SituationAnalysis from './features/Categories/SituationAnalysis';
import RelationshipStatus from './features/Categories/RelationshipStatus';
import CoffeeReading from './features/Categories/CoffeeReading';
import PersonalForecast from './features/Categories/PersonalForecast';
import SpiritualGrowth from './features/Categories/SpiritualGrowth';
import TarotReading from './features/Categories/TarotReading';
import Subscription from './features/Profile/Subscription/Subscription';
import NavigationMenu from './components/NavigationMenu';
import InfoButton from './components/InfoButton';
import NotFound from './features/NotFound/NotFound';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    initializeTelegramApp();
    // Redirect to Home page only on initial load or reload
    const isInitialLoad = localStorage.getItem('initialLoad') !== 'true';
    if (isInitialLoad && window.location.pathname !== '/') {
      navigate('/');
      localStorage.setItem('initialLoad', 'true');
    }
    return () => clearTimeout(timer);
  }, [navigate]);


  const getActiveTabFromPath = (pathname: string) => {
    const tabs = [
      { id: 'home', path: '/' },
      { id: 'subscriptions', path: '/subscription' },
      { id: 'profile', path: '/profile' },
      { id: 'history', path: '/history' }
    ];
    const tab = tabs.find(tab => tab.path === pathname);
    return tab ? tab.id : 'home';
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col bg-no-repeat bg-fixed w-full overflow-x-hidden relative" 
         style={{ backgroundImage: `url('/src/assets/backgrounds/FON.png')`, backgroundSize: 'cover' }}>
      <div className="absolute inset-0 bg-black bg-opacity-35 backdrop-blur-[5px] z-0"></div>
      
        <InfoButton onClick={() => {}} />

        <main className="p-2 sm:p-4 flex-grow overflow-hidden relative z-10">
          {isLoading ? (
            <div className="flex justify-center items-center h-screen">
              <LoadingSpinner />
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/subscription" element={<Subscription onSubscribe={() => {}} />} />
              <Route path="/history" element={<History />} />
              <Route path="/love-readings" element={<LoveReadings />} />
              <Route path="/situation-analysis" element={<SituationAnalysis />} />
              <Route path="/relationship-status" element={<RelationshipStatus />} />
              <Route path="/coffee-reading" element={<CoffeeReading />} />
              <Route path="/personal-forecast" element={<PersonalForecast />} />
              <Route path="/spiritual-growth" element={<SpiritualGrowth />} />
              <Route path="/tarot-reading" element={<TarotReading />} />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </main>

        <NavigationMenu activeTab={getActiveTabFromPath(location.pathname)} setActiveTab={(pageId) => {
          const tabs = [
            { id: 'home', path: '/' },
            { id: 'subscriptions', path: '/subscription' },
            { id: 'profile', path: '/profile' },
            { id: 'history', path: '/history' }
          ];
          const selectedTab = tabs.find(tab => tab.id === pageId);
          if (selectedTab) {
            navigate(selectedTab.path);
          } else {
            navigate('/not-found');
          }
        }} />
      </div>
  );
}

export default App;
