import React, { useState } from 'react';
import { getPersonalForecast } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import FanCards from '../../components/FanCards';
import SquareCards from '../../components/SquareCards';
import Modal from '../../components/Modal';
import { cards2, handsBackground } from '../../assets/images';

const PersonalForecast: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<{[key: number]: string}>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [useSquareCards, setUseSquareCards] = useState(false);

  const cardCount = 5;
  const cardsArray = Array.from({ length: cardCount }, (_, i) => i);


  const handleRevealCards = async () => {
    if (selectedCards.length === 3) {
      try {
        const data = await getPersonalForecast(selectedCards, selectedCategory || '', '7300593025');
        const newRevealed = { ...revealedCards };
        selectedCards.forEach((cardIndex, position) => {
          newRevealed[cardIndex] = data.meanings[position];
        });
        setRevealedCards(newRevealed);
        setModalContent(`Результат прогноза${selectedCategory ? ` (${selectedCategory})` : ''}: ${data.message}`);
      } catch (error: any) {
        setModalContent(`Ошибка при получении прогноза: ${error.message || 'Неизвестная ошибка'}`);
      }
      setModalOpen(true);
    } else {
      setModalContent('Пожалуйста, выберите ровно 3 карты для прогноза.');
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-900/60 backdrop-blur-lg border border-purple-300/20 rounded-xl mx-auto my-4 max-w-4xl max-h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden text-white" style={{ backgroundImage: `url(${handsBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <button 
        onClick={handleBack}
        className="mb-4 flex items-center text-purple-300 hover:text-purple-400 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>
      <h2 className="text-2xl mb-6 text-purple-300 text-center font-cinzel ">Персональный прогноз</h2>
      
      
      <div className="mt-6">
        {/* Toggle button for card layout */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setUseSquareCards(!useSquareCards)}
            className="px-4 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 rounded-lg border border-purple-400/30 transition-colors duration-200 text-sm"
          >
            {useSquareCards ? 'Веерные карты' : 'Квадратные карты'}
          </button>
        </div>
       
        <div className="flex justify-center mb-16 mt-10 relative">
          {useSquareCards ? (
            <SquareCards
              cards={cardsArray}
              selected={selectedCards}
              revealed={revealedCards}
              onSelect={(index) => {
                if (selectedCards.includes(index)) {
                  setSelectedCards(selectedCards.filter(i => i !== index));
                } else if (selectedCards.length < 3) {
                  setSelectedCards([...selectedCards, index]);
                }
              }}
              cardSize={100}
              backgroundImages={[
                cards2,
                cards2,
                cards2,
                cards2,
                cards2
              ]}
              labelPrefix="Карта"
              allowMultiSelect={true}
              columns={5}
            />
          ) : (
            <FanCards
              cards={cardsArray}
              selected={selectedCards}
              revealed={revealedCards}
              onSelect={(index) => {
                if (selectedCards.includes(index)) {
                  setSelectedCards(selectedCards.filter(i => i !== index));
                } else if (selectedCards.length < 3) {
                  setSelectedCards([...selectedCards, index]);
                }
              }}
              width={440}
              height={130}
              cardWidth={70}
              cardHeight={105}
              backgroundImage={cards2}
              labelPrefix="Карта"
              allowMultiSelect={true}
            />
          )}
        </div>
        <div className="flex justify-between mb-4 overflow-x-hidden">
          <button className={`flex-1 p-1 border rounded-lg text-center mx-1 min-w-0 transition-colors duration-200 ${selectedCategory === 'Причина' ? 'border-purple-400/60 bg-purple-400/30' : 'border-purple-400/30 bg-purple-400/20 hover:bg-purple-400/30'}`} onClick={() => setSelectedCategory('Причина')}>
            <p className="text-purple-300 text-xs truncate">Причина</p>
          </button>
          <button className={`flex-1 p-1 border rounded-lg text-center mx-1 min-w-0 transition-colors duration-200 ${selectedCategory === 'Суть' ? 'border-purple-400/60 bg-purple-400/30' : 'border-purple-400/30 bg-purple-400/20 hover:bg-purple-400/30'}`} onClick={() => setSelectedCategory('Суть')}>
            <p className="text-purple-300 text-xs truncate">Суть</p>
          </button>
          <button className={`flex-1 p-1 border rounded-lg text-center mx-1 min-w-0 transition-colors duration-200 ${selectedCategory === 'Совет' ? 'border-purple-400/60 bg-purple-400/30' : 'border-purple-400/30 bg-purple-400/20 hover:bg-purple-400/30'}`} onClick={() => setSelectedCategory('Совет')}>
            <p className="text-purple-300 text-xs truncate">Совет</p>
          </button>
          <button className={`flex-1 p-1 border rounded-lg text-center mx-1 min-w-0 transition-colors duration-200 ${selectedCategory === 'Итог' ? 'border-purple-400/60 bg-purple-400/30' : 'border-purple-400/30 bg-purple-400/20 hover:bg-purple-400/30'}`} onClick={() => setSelectedCategory('Итог')}>
            <p className="text-purple-300 text-xs truncate">Итог</p>
          </button>
          <button className={`flex-1 p-1 border rounded-lg text-center mx-1 min-w-0 transition-colors duration-200 ${selectedCategory === 'Дополнительно' ? 'border-purple-400/60 bg-purple-400/30' : 'border-purple-400/30 bg-purple-400/20 hover:bg-purple-400/30'}`} onClick={() => setSelectedCategory('Дополнительно')}>
            <p className="text-purple-300 text-xs truncate">Дополнительно</p>
          </button>
          <button className={`flex-1 p-1 border rounded-lg text-center mx-1 min-w-0 transition-colors duration-200 ${selectedCategory === 'Перспектива' ? 'border-purple-400/60 bg-purple-400/30' : 'border-purple-400/30 bg-purple-400/20 hover:bg-purple-400/30'}`} onClick={() => setSelectedCategory('Перспектива')}>
            <p className="text-purple-300 text-xs truncate">Перспектива</p>
          </button>
        </div>
        <button className="mt-4 px-6 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 rounded-lg border border-purple-400/30 transition-colors duration-200" onClick={handleRevealCards}>
          Интерпретировать карты
        </button>
      </div>
      
      {modalOpen && (
        <Modal open={modalOpen} onClose={closeModal}>
          <h3 className="text-purple-300 text-lg mb-4">Результат прогноза</h3>
          <p className="text-white mb-4">{modalContent}</p>
        </Modal>
      )}
    </div>
  );
};

export default PersonalForecast;
