import React, { useState } from 'react';
import { analyzeSituation } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import FanCards from '../../components/FanCards';
import Modal from '../../components/Modal';
import { cards2, handsBackground } from '../../assets/images';

const SituationAnalysis: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<{[key: number]: string}>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");

  const cardCount = 5;
  const cardsArray = Array.from({ length: cardCount }, (_, i) => i);

  const handleRevealCards = async (category: string = '') => {
    if (selectedCards.length === 5) {
      try {
        const data = await analyzeSituation(selectedCards, category);
        const newRevealed = { ...revealedCards };
        selectedCards.forEach((cardIndex, position) => {
          newRevealed[cardIndex] = data.meanings[position];
        });
        setRevealedCards(newRevealed);
        setModalContent(`Результат анализа${category ? ` (${category})` : ''}: ${data.message}`);
      } catch (error: any) {
        setModalContent(`Ошибка при анализе: ${error.message || 'Неизвестная ошибка'}`);
      }
      setModalOpen(true);
    } else {
      setModalContent('Пожалуйста, выберите ровно 5 карт для анализа.');
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-700/60 backdrop-blur-lg border border-purple-300/20 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_10px_rgba(147,51,234,0.1)] rounded-xl mx-auto my-4 max-w-4xl max-h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden text-white" style={{ backgroundImage: `url(${handsBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <button 
        onClick={handleBack}
        className="mb-4 flex items-center text-purple-300 hover:text-purple-400 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>
      <h2 className="text-2xl mb-6 text-purple-300 text-center font-cinzel ">Анализ ситуации</h2>
     
      
      <div className="mt-6">
       
        <div className="flex justify-center mb-16 mt-10 relative">
          <FanCards
            cards={cardsArray}
            selected={selectedCards}
            revealed={revealedCards}
            onSelect={(index) => {
              if (selectedCards.includes(index)) {
                setSelectedCards(selectedCards.filter(i => i !== index));
              } else if (selectedCards.length < 5) {
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
        </div>
        <div className="flex justify-between mb-4 overflow-x-hidden">
          <button className="flex-1 p-1 border border-purple-400/30 rounded-lg text-center mx-1 min-w-0 bg-purple-400/20 hover:bg-purple-400/30 transition-colors duration-200" onClick={() => handleRevealCards('Причина')}>
            <p className="text-purple-300 text-xs truncate">Причина</p>
          </button>
          <button className="flex-1 p-1 border border-purple-400/30 rounded-lg text-center mx-1 min-w-0 bg-purple-400/20 hover:bg-purple-400/30 transition-colors duration-200" onClick={() => handleRevealCards('Суть')}>
            <p className="text-purple-300 text-xs truncate">Суть</p>
          </button>
          <button className="flex-1 p-1 border border-purple-400/30 rounded-lg text-center mx-1 min-w-0 bg-purple-400/20 hover:bg-purple-400/30 transition-colors duration-200" onClick={() => handleRevealCards('Совет')}>
            <p className="text-purple-300 text-xs truncate">Совет</p>
          </button>
          <button className="flex-1 p-1 border border-purple-400/30 rounded-lg text-center mx-1 min-w-0 bg-purple-400/20 hover:bg-purple-400/30 transition-colors duration-200" onClick={() => handleRevealCards('Итог')}>
            <p className="text-purple-300 text-xs truncate">Итог</p>
          </button>
          <button className="flex-1 p-1 border border-purple-400/30 rounded-lg text-center mx-1 min-w-0 bg-purple-400/20 hover:bg-purple-400/30 transition-colors duration-200" onClick={() => handleRevealCards('Дополнительно')}>
            <p className="text-purple-300 text-xs truncate">Дополнительно</p>
          </button>
        </div>
        <button className="mt-4 px-6 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 rounded-lg border border-purple-400/30 transition-colors duration-200" onClick={() => handleRevealCards()}>
          Интерпретировать все карты
        </button>
      </div>
      
      {modalOpen && (
        <Modal open={modalOpen} onClose={closeModal}>
          <h3 className="text-purple-300 text-lg mb-4">Результат анализа</h3>
          <p className="text-white mb-4">{modalContent}</p>
        </Modal>
      )}
    </div>
  );
};

export default SituationAnalysis;
