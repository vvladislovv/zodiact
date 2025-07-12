import React, { useState } from 'react';
import { getTarotReading, revealTarot } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import FanCards from '../../components/FanCards';
import Modal from '../../components/Modal';

const TarotReading: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const [selectedTimePeriods, setSelectedTimePeriods] = useState<{[key: string]: number[]}>({
    "Прошлое": [],
    "Настоящее": [],
    "Будущее": []
  });
  const [activePeriod, setActivePeriod] = useState<string>("Настоящее");
  const [selectedReadingType, setSelectedReadingType] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [revealedCards, setRevealedCards] = useState<{[key: number]: string}>({});

  const cardCount = 9;
  const cardsArray = Array.from({ length: cardCount }, (_, i) => i);

  const handleTimePeriodSelect = (period: string) => {
    setActivePeriod(period);
  };

  const handleCardSelect = (index: number, period: string) => {
    setSelectedTimePeriods(prev => {
      const updated = { ...prev };
      const currentCards = updated[period];
      if (currentCards.includes(index)) {
        updated[period] = currentCards.filter(i => i !== index);
      } else if (currentCards.length < 1) {
        updated[period] = [...currentCards, index];
      }
      return updated;
    });
  };

  const handleRevealButtonClick = async () => {
    const allSelectedCards = Object.values(selectedTimePeriods).flat();
    if (allSelectedCards.length === 3) {
      try {
        const timePeriods = [];
        if (selectedTimePeriods["Прошлое"].length > 0) timePeriods.push("Прошлое");
        if (selectedTimePeriods["Настоящее"].length > 0) timePeriods.push("Настоящее");
        if (selectedTimePeriods["Будущее"].length > 0) timePeriods.push("Будущее");
        const data = await revealTarot(allSelectedCards, timePeriods, selectedReadingType || '');
        const newRevealed = { ...revealedCards };
        allSelectedCards.forEach((cardIndex, position) => {
          newRevealed[cardIndex] = data.meanings[position];
        });
        setRevealedCards(newRevealed);
        let detailedMessage = `Раскрытие карт: ${data.message}\n\nВыбранные карты:\n`;
        if (selectedTimePeriods["Прошлое"].length > 0) {
          detailedMessage += `Прошлое: Карта ${selectedTimePeriods["Прошлое"][0] + 1}\n`;
        }
        if (selectedTimePeriods["Настоящее"].length > 0) {
          detailedMessage += `Настоящее: Карта ${selectedTimePeriods["Настоящее"][0] + 1}\n`;
        }
        if (selectedTimePeriods["Будущее"].length > 0) {
          detailedMessage += `Будущее: Карта ${selectedTimePeriods["Будущее"][0] + 1}\n`;
        }
        if (selectedReadingType) {
          detailedMessage += `\nТип гадания: ${selectedReadingType}`;
        }
        setModalContent(detailedMessage);
      } catch (error: any) {
        setModalContent(`Ошибка при раскрытии карт: ${error.message || 'Неизвестная ошибка'}`);
      }
      setModalOpen(true);
    } else {
      setModalContent("Пожалуйста, выберите по одной карте для каждого временного периода (Прошлое, Настоящее, Будущее).");
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-700/60 backdrop-blur-lg border border-purple-300/20 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_10px_rgba(147,51,234,0.1)] rounded-lg mx-auto my-4 max-w-4xl max-h-[calc(100vh-100px)] overflow-y-auto text-white" style={{ backgroundImage: 'url(/assets/backgrounds/backgroundFull.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <button 
        onClick={handleBack}
        className="mb-4 flex items-center text-purple-300 hover:text-purple-400 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>
      <h2 className="text-2xl mb-6 text-purple-300 text-center font-cinzel ">Гадание на Таро</h2>
      
      <div className="mt-6">
        <div className="flex justify-center mb-16 mt-10 relative">
          <FanCards
            cards={cardsArray}
            selected={Object.values(selectedTimePeriods).flat()}
            revealed={revealedCards}
            onSelect={(index) => {
              if (activePeriod) {
                handleCardSelect(index, activePeriod);
              } else {
                setModalContent("Пожалуйста, выберите временной период перед выбором карты.");
                setModalOpen(true);
              }
            }}
            width={500}
            height={150}
            cardWidth={80}
            cardHeight={120}
            backgroundImage={'/src/assets/backgrounds/category/Hands.jpg'}
            labelPrefix="Карта"
            allowMultiSelect={true}
          />
        </div>
        <div className="flex justify-between mb-4">
          {["Прошлое", "Настоящее", "Будущее"].map((period) => (
            <div
              key={period}
              className={`w-1/3 p-2 border rounded-lg text-center cursor-pointer transition-colors duration-200 ${
                activePeriod === period || selectedTimePeriods[period].length > 0
                  ? 'border-purple-400/60 bg-purple-400/10'
                  : 'border-yellow-500/30 hover:border-purple-400/40 hover:bg-purple-500/20'
              }`}
              onClick={() => handleTimePeriodSelect(period)}
            >
              <p className="text-purple-300 text-sm">{period}</p>
              <p className="text-gray-300 text-xs">
                {period === "Прошлое" ? "Что было в вашей жизни" : period === "Настоящее" ? "Текущее состояние" : "Перспективы"}
              </p>
              {selectedTimePeriods[period].length > 0 && (
                <p className="text-purple-400 text-xs">Карта: {selectedTimePeriods[period][0] + 1}</p>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 px-6 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 rounded-lg border border-purple-400/30 transition-colors duration-200" onClick={handleRevealButtonClick}>
          Раскрыть карты
        </button>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-purple-300 mb-3">Выберите тип гадания</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Общее предсказание", desc: "Получите общий взгляд на вашу жизнь." },
            { title: "Любовь и отношения", desc: "Узнайте о романтических перспективах." },
            { title: "Карьера и финансы", desc: "Получите прогноз по работе и деньгам." },
            { title: "Совет дня", desc: "Получите рекомендацию на сегодня." }
          ].map((item, index) => (
            <div 
              key={index}
              className={`p-4 bg-gray-800/80 border rounded-lg transition-colors duration-200 cursor-pointer ${
                selectedReadingType === item.title
                  ? 'border-purple-400/60 bg-purple-400/10'
                  : 'border-purple-400/20 hover:border-purple-400/40 hover:bg-purple-500/20'
              }`}
              onClick={() => setSelectedReadingType(item.title)}
            >
              <h4 className="text-purple-300 font-medium">{item.title}</h4>
              <p className="text-gray-300 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedReadingType && (
        <button 
          className="mt-4 px-6 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 rounded-lg border border-purple-400/30 transition-colors duration-200"
          onClick={async () => {
            try {
              const data = await getTarotReading(selectedReadingType);
              setModalContent(`Результат гадания на Таро для "${selectedReadingType}": ${data.result}`);
              setModalOpen(true);
            } catch (error: any) {
              setModalContent(`Ошибка при получении гадания для "${selectedReadingType}": ${error.message || 'Неизвестная ошибка'}`);
              setModalOpen(true);
            }
          }}
        >
          Получить результат гадания
        </button>
      )}
      {modalOpen && (
        <Modal open={modalOpen} onClose={closeModal}>
          <h3 className="text-purple-300 text-lg mb-4">Результат гадания</h3>
          <p className="text-white mb-4">{modalContent}</p>
        </Modal>
      )}
    </div>
  );
};

export default TarotReading;
