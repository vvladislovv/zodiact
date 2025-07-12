import React, { useState } from 'react';
import { revealTarot } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import FanCards from '../../components/FanCards';
import Modal from '../../components/Modal';

const LoveReadings: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [selectedTarotCards, setSelectedTarotCards] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<{[key: number]: string}>({});

  const cardCount = 9;
  const cardsArray = Array.from({ length: cardCount }, (_, i) => i);

  const handleButtonClick = (readingType: string) => {
    setModalContent(`Результат расклада на любовь для "${readingType}": Карты указывают на гармонию в отношениях.`);
    setModalOpen(true);
  };

  const handleRevealButtonClick = async () => {
    if (selectedTarotCards.length === 3) {
      try {
        const data = await revealTarot(selectedTarotCards);
        const newRevealed = { ...revealedCards };
        selectedTarotCards.forEach((cardIndex, position) => {
          newRevealed[cardIndex] = data.meanings[position];
        });
        setRevealedCards(newRevealed);
        setModalContent(`Раскрытие карт: ${data.message}`);
      } catch (error: any) {
        setModalContent(`Ошибка при раскрытии карт: ${error.message || 'Неизвестная ошибка'}`);
      }
      setModalOpen(true);
    } else {
      setModalContent("Пожалуйста, выберите ровно 3 карты для расклада.");
      setModalOpen(true);
    }
  };

  const handleCardSelect = (index: number) => {
    if (selectedTarotCards.includes(index)) {
      setSelectedTarotCards(selectedTarotCards.filter(i => i !== index));
    } else if (selectedTarotCards.length < 3) {
      setSelectedTarotCards([...selectedTarotCards, index]);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-900/60 backdrop-blur-lg border border-purple-300/20 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_10px_rgba(147,51,234,0.1)] rounded-xl mx-auto my-4 max-w-4xl max-h-[calc(100vh-100px)] overflow-y-auto text-white" style={{ backgroundImage: 'url(/assets/backgrounds/backgroundFull.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <button 
        onClick={handleBack}
        className="mb-4 flex items-center text-purple-300 hover:text-purple-400 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>
      <h2 className="text-2xl mb-6 text-purple-300 text-center font-cinzel shadow-[0_0_5px_rgba(147,51,234,0.5)]">Расклады на любовь</h2>
      <p className="text-gray-200">Узнайте о романтических перспективах.</p>
      
      <div className="mt-6">
        <h3 className="text-lg font-extrabold text-white mb-3" style={{textShadow: '0 0 8px #000, 0 0 2px #fff'}}>Расклад Таро на любовь</h3>
        <p className="text-white mb-4 font-semibold" style={{textShadow: '0 0 8px #000, 0 0 2px #fff'}}>Выберите 3 карты для расклада.</p>
        <div className="flex justify-center mb-8 mt-10 relative">
          <FanCards
            cards={cardsArray}
            selected={selectedTarotCards}
            revealed={revealedCards}
            onSelect={handleCardSelect}
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
          <div className="w-1/3 p-2 border border-purple-400/30 rounded-lg text-center">
            <p className="text-purple-300 text-sm">Прошлое</p>
            <p className="text-gray-300 text-xs">Что было в ваших отношениях</p>
          </div>
          <div className="w-1/3 p-2 border border-purple-400/30 rounded-lg text-center">
            <p className="text-purple-300 text-sm">Настоящее</p>
            <p className="text-gray-300 text-xs">Текущее состояние любви</p>
          </div>
          <div className="w-1/3 p-2 border border-purple-400/30 rounded-lg text-center">
            <p className="text-purple-300 text-sm">Будущее</p>
            <p className="text-gray-300 text-xs">Перспективы отношений</p>
          </div>
        </div>
        <button className="mt-4 px-6 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 rounded-lg border border-purple-400/30 transition-colors duration-200" onClick={handleRevealButtonClick}>
          Раскрыть карты
        </button>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-purple-300 mb-3">Выберите расклад на любовь</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Будущее отношений", desc: "Узнайте, что ждет ваши отношения в будущем." },
            { title: "Чувства партнера", desc: "Поймите, что чувствует ваш партнер к вам." },
            { title: "Совместимость", desc: "Оцените вашу совместимость с партнером." },
            { title: "Совет в любви", desc: "Получите рекомендацию для улучшения отношений." }
          ].map((item, index) => (
            <div 
              key={index}
              className={`p-4 bg-gray-800/80 border rounded-lg transition-colors duration-200 cursor-pointer ${
                selectedCard === index 
                  ? 'border-purple-400/60 bg-purple-400/10' 
                  : 'border-purple-400/20 hover:border-purple-400/40 hover:bg-purple-500/20'
              }`}
              onClick={() => {
                setSelectedCard(index);
                handleButtonClick(item.title);
              }}
            >
              <h4 className="text-purple-300 font-medium">{item.title}</h4>
              <p className="text-gray-300 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {modalOpen && (
        <Modal open={modalOpen} onClose={closeModal}>
          <h3 className="text-purple-300 text-lg mb-4">Результат расклада</h3>
          <p className="text-white mb-4">{modalContent}</p>
        </Modal>
      )}
    </div>
  );
};

export default LoveReadings;
