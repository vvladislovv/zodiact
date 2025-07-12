import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios'; // Импортируем axios для создания клиента API

// Тип для контекста приложения
interface AppContextType {
  refreshData: () => void;
  lastUpdate: number;
}

// Создаем контекст
const AppContext = createContext<AppContextType | undefined>(undefined);

// Хук для использования контекста
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Провайдер контекста
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Функция для обновления данных
  const refreshData = () => {
    setLastUpdate(Date.now());
  };

  // Создаем клиент API
  const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Подписываемся на успешные запросы API для автоматического обновления
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response: any) => {
        // При успешном ответе от API обновляем состояние
        setLastUpdate(Date.now());
        return response;
      },
      (error: any) => {
        // Если произошла ошибка, просто возвращаем ошибку
        return Promise.reject(error);
      }
    );

    return () => {
      // Удаляем перехватчик при размонтировании
      apiClient.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AppContext.Provider value={{ refreshData, lastUpdate }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
