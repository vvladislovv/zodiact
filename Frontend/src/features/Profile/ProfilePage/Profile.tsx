import React, { useState, useEffect } from 'react';
import { getUserProfile, updateAutopayment } from '../../../utils/api';
import NotificationModal from '../../../components/NotificationModal';
import './Profile.css';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [autoPaymentEnabled, setAutoPaymentEnabled] = useState(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    return getCookie('autoPaymentEnabled') === 'true';
  });
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isError, setIsError] = useState(true);

  const toggleAutoPayment = async () => {
    const newState = !autoPaymentEnabled;
    setAutoPaymentEnabled(newState);
    const setCookie = (name: string, value: string, days: number) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    };
    setCookie('autoPaymentEnabled', newState.toString(), 365);
    setNotificationTitle(newState ? 'Автоплатеж включен' : 'Автоплатеж отключен');
    setNotificationMessage(newState ? 'Автоплатеж успешно включен.' : 'Автоплатеж успешно отключен.');
    setIsError(false);
    setIsNotificationModalOpen(true);

    try {
      await updateAutopayment(newState, profileData.user_id || '7300593025');
    } catch (error) {
      setNotificationTitle('Ошибка');
      setNotificationMessage('Не удалось обновить статус автоплатежа на сервере. Попробуйте снова.');
      setIsError(true);
      setIsNotificationModalOpen(true);
      setAutoPaymentEnabled(!newState); // Revert state on error
      setCookie('autoPaymentEnabled', (!newState).toString(), 365);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUserProfile();
        setProfileData(data);
      } catch (err: any) {
        if (err.response && err.response.status === 403) {
          setError('Доступ запрещен: ошибка 403.');
        } else {
          setError('Ошибка при загрузке данных профиля. Попробуйте снова.');
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (!isLoading && !error && profileData) {
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isLoading, error, profileData]);

  if (isLoading) {
    return <div className="text-gray-300 text-center p-6">Загрузка...</div>;
  }
  if (error) {
    return <div className="text-red-400 text-center p-6">{error}</div>;
  }
  if (!profileData) {
    return <div className="text-gray-300 text-center p-6">Данные профиля недоступны.</div>;
  }

  return (
    <div
      className="profile-container w-full text-gray-200 overflow-y-auto animate-fadeIn"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
      }}
    >
      <div className="w-full flex justify-center">
        <h2 className="text-xl text-center font-bold"
            style={{
              color: '#c084fc',
              textShadow: '0 0 5px rgba(147, 51, 234, 0.5)',
              fontFamily: 'Arial, sans-serif'
            }}>
          Профиль
        </h2>
      </div>
      <div className="w-full mt-8 flex justify-center">
        <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl shadow-lg border border-purple-300/20 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2 text-purple-300">Личная информация</h3>
          {profileData.user_id && <p><strong>User ID:</strong> {profileData.user_id}</p>}
          {profileData.telegram_name && <p><strong>Telegram Name:</strong> {profileData.telegram_name}</p>}
          {profileData.joined &&
            <p><strong>Дата регистрации:</strong> {new Date(profileData.joined).toLocaleDateString('ru-RU')}</p>}
        </div>
      </div>
      <div className="w-full mt-6 flex justify-center">
        <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl shadow-lg border border-purple-300/20 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2 text-purple-300">Настройка автоплатежа</h3>
          <div className="flex items-center mb-3">
            <span className={`mr-3 ${autoPaymentEnabled ? 'text-gray-200' : 'text-red-500'}`}>Автоплатеж: {autoPaymentEnabled ? 'Включен' : 'Отключен'}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPaymentEnabled}
                onChange={toggleAutoPayment}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:bg-purple-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
          <p className="text-gray-400 text-sm">Вы можете включить или отключить автоматическое продление подписки.</p>
        </div>
      </div>
      <NotificationModal 
        title={notificationTitle}
        message={notificationMessage} 
        isOpen={isNotificationModalOpen} 
        onClose={() => setIsNotificationModalOpen(false)}
        isError={isError}
      />
    </div>
  );
};

export default Profile;
