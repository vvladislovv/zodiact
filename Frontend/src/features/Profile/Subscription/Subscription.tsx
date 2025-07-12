import React, { useState } from 'react';
import { createPayment } from '../../../utils/api';
import NotificationModal from '../../../components/NotificationModal';

interface SubscriptionProps {
  onSubscribe: (plan: string, price: number) => void;
}

const userAgreementText = `Пользовательское соглашение (ZodiacBot)

1. Общие положения
1.1. Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения между пользователем и владельцем сервиса ZodiacBot (далее — Сервис).
1.2. Пользователь обязуется соблюдать условия, изложенные в настоящем Соглашении.

2. Услуги и оплата
2.1. Подписка: 10 карт для общего пользования.
2.2. Варианты подписки:
• День: 40 руб. (доступно 1 день)
• Неделя: 99 руб. (доступно 7 дней)
• Месяц: 300 руб. (доступно 30 дней)
2.3. Автоплатеж:
• Автоматическое продление включается сразу после любой оплаты подписки (День, Неделя, Месяц)
• Включает: автоматическое списание, доступ к функциям
• Пользователь вправе отменить автопродление в личном кабинете

3. Использование сервиса
3.1. Пользователь обязуется:
• Не использовать сервис незаконно
• Не нарушать права других пользователей
3.2. Запрещено:
• Использовать для рассылки спама
• Использовать для сбора личных данных
• Для публикации запрещённого контента
3.3. Сервис может быть интегрирован с Telegram для расширения функциональности.

4. Возврат средств
4.1. Не производится:
• После оплаты (40/99/300 руб.)
• В случае технических сбоев
4.2. Исключение: индивидуальное рассмотрение по заявлению пользователя.

5. Ответственность сторон
5.1. Сервис:
• Предоставляет доступ к функциям при активной подписке
• Не несёт ответственности за действия пользователей
• Не гарантирует постоянную доступность сервиса

6. Персональные данные
6.1. Сбор: осуществляется по email для целей подписки.
6.2. Хранение: защищено [...данные не передаются третьим лицам...]
6.3. Удаление по запросу пользователя. Обращение на email поддержки или через интерфейс.`;

const Subscription: React.FC<SubscriptionProps> = ({ onSubscribe }) => {
  const handleSubscribe = (plan: string, price: number) => {
    setNotificationTitle('Успех');
    setNotificationMessage(`Вы подписались на ${plan} за ${price} руб.`);
    setIsError(false);
    setIsNotificationModalOpen(true);
    onSubscribe(plan, price);
  };
  const [showAgreement, setShowAgreement] = useState(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    return getCookie('userAgreementAccepted') !== 'true';
  });
  const [agreementAccepted, setAgreementAccepted] = useState(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    return getCookie('userAgreementAccepted') === 'true';
  });
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isError, setIsError] = useState(true);



  const handlePurchase = async (plan: string, price: number) => {
    if (!agreementAccepted) {
      setShowAgreement(true);
      return;
    }
    try {
      const data = await createPayment(plan, price);
      if (data.confirmation_url) {
        window.open(data.confirmation_url, '_blank');
        handleSubscribe(plan, price);
      } else {
        setNotificationTitle('Ошибка');
        setNotificationMessage('Ошибка при создании платежа. Попробуйте снова.');
        setIsError(true);
        setIsNotificationModalOpen(true);
      }
    } catch (error) {
      setNotificationTitle('Ошибка');
      setNotificationMessage('Произошла ошибка при обработке покупки. Попробуйте снова.');
      setIsError(true);
      setIsNotificationModalOpen(true);
    }
  };

  const handleAgreementContinue = () => {
    if (agreementAccepted) {
      const setCookie = (name: string, value: string, days: number) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
      };
      setCookie('userAgreementAccepted', 'true', 365); // Cookie valid for 1 year
      setShowAgreement(false);
    }
  };

  return (
    <div className="mt-32 page-content text-gray-200 p-1 rounded-lg max-w-[90%] mx-auto h-full min-h-[calc(100vh-150px)] flex flex-col">
      <h3 className="text-xl font-bold text-purple-300 text-center mb-4 font-cinzel ">Подписка</h3>
      <p className="text-gray-200 text-center mb-4">Получите полный доступ к приложению с подпиской.</p>
      
      {/* Модальное окно пользовательского соглашения */}
      {showAgreement && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg border border-purple-300/30 max-w-lg w-full relative">
            <h3 className="text-purple-300 text-lg mb-4">Пользовательское соглашение</h3>
            <div className="overflow-y-auto max-h-96 text-sm text-gray-200 whitespace-pre-line mb-4" style={{fontFamily: 'inherit'}}>
              {userAgreementText}
            </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" id="agreement-accept" className="mr-2" checked={agreementAccepted} onChange={e => setAgreementAccepted(e.target.checked)} />
              <label htmlFor="agreement-accept" className="text-gray-200 text-sm">Я принимаю условия пользовательского соглашения</label>
            </div>
            <button className={`font-bold py-2 px-4 rounded mr-2 ${agreementAccepted ? 'bg-purple-500 hover:bg-purple-600 text-gray-900 transition-all duration-200' : 'bg-gray-500 text-gray-700 cursor-not-allowed pointer-events-none'}`} onClick={handleAgreementContinue} disabled={!agreementAccepted}>
              Продолжить
            </button>
            <button className="text-gray-400 hover:text-gray-200 ml-2" onClick={() => { setShowAgreement(false); setAgreementAccepted(false); }}>
              Отклонить
            </button>
          </div>
        </div>
      )}

      <div className="flex-grow overflow-y-auto mb-6 pr-2 max-h-[80vh] md:max-h-[60vh]">
        <div className="bg-white/5 border border-purple-300/10 rounded-lg p-4 mb-4 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(147,51,234,0.2)] hover:bg-purple-400/10">
          <h4 className="text-lg text-purple-300 text-center mb-2 font-cinzel">Месяц - 300 руб</h4>
          <p className="text-gray-200 text-center mb-3">Полный доступ ко всем функциям приложения на 30 дней.</p>
          <button 
            className="bg-purple-500 hover:bg-purple-600 text-gray-900 font-bold py-2 px-4 rounded cursor-pointer transition-all duration-200 mx-auto block w-4/5 max-w-xs hover:scale-105 active:scale-95 font-cinzel text-sm"
            onClick={() => handlePurchase('Месяц', 300)}
            disabled={!agreementAccepted}
          >
            Купить
          </button>
        </div>
        <div className="bg-white/5 border border-purple-300/10 rounded-lg p-4 mb-4 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(147,51,234,0.2)] hover:bg-purple-400/10">
          <h4 className="text-lg text-purple-300 text-center mb-2 font-cinzel">Неделя - 99 руб</h4>
          <p className="text-gray-200 text-center mb-3">Полный доступ ко всем функциям приложения на 7 дней.</p>
          <button 
            className="bg-purple-500 hover:bg-purple-600 text-gray-900 font-bold py-2 px-4 rounded cursor-pointer transition-all duration-200 mx-auto block w-4/5 max-w-xs hover:scale-105 active:scale-95 font-cinzel text-sm"
            onClick={() => handlePurchase('Неделя', 99)}
            disabled={!agreementAccepted}
          >
            Купить
          </button>
        </div>
          <div className="bg-white/5 border border-purple-300/10 rounded-lg p-4 mb-4 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(147,51,234,0.2)] hover:bg-purple-400/10">
          <h4 className="text-lg text-purple-300 text-center mb-2 font-cinzel">День - 40 руб</h4>
          <p className="text-gray-200 text-center mb-3">Полный доступ ко всем функциям приложения на 1 день.</p>
          <button 
            className="bg-purple-500 hover:bg-purple-600 text-gray-900 font-bold py-2 px-4 rounded cursor-pointer transition-all duration-200 mx-auto block w-4/5 max-w-xs hover:scale-105 active:scale-95 font-cinzel text-sm"
            onClick={() => handlePurchase('День', 40)}
            disabled={!agreementAccepted}
          >
            Купить
          </button>
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

export default Subscription;
