import React, { useState } from 'react';
import { getSpiritualGrowthAdvice } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import FanCards from '../../components/FanCards';
import Modal from '../../components/Modal';
import { cards2, handsBackground } from '../../assets/images';

const SpiritualGrowth: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedAspect, setSelectedAspect] = useState<number | null>(null);
  const [revealedCards, setRevealedCards] = useState<{[key: number]: string}>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");

  const cardCount = 5;
  const cardsArray = Array.from({ length: cardCount }, (_, i) => i);

  const handleAspectSelect = (index: number) => {
    setSelectedAspect(index);
  };

  const handleRevealCards = async () => {
    if (selectedCard !== null && selectedAspect !== null) {
      try {
        const aspects = [
          "Текущий уровень",
          "Препятствия на пути",
          "Следующий шаг",
          "Духовная цель"
        ];
        const selectedAspectString = aspects[selectedAspect] || "";
        const data = await getSpiritualGrowthAdvice([selectedCard], selectedAspectString);
        const newRevealed = { ...revealedCards };
        newRevealed[selectedCard] = data.meanings[0];
        setRevealedCards(newRevealed);
        setModalContent(`Результат духовного анализа: ${data.message}`);
      } catch (error: any) {
        setModalContent(`Ошибка при получении духовного анализа: ${error.message || 'Неизвестная ошибка'}`);
      }
      setModalOpen(true);
    } else {
      setModalContent('Пожалуйста, выберите одну карту и один аспект для совета.');
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-900/60 backdrop-blur-lg border border-purple-300/20 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_10px_rgba(147,51,234,0.1)] rounded-xl mx-auto my-4 max-w-4xl max-h-[calc(100vh-100px)] overflow-y-auto text-white" style={{ backgroundImage: `url(${handsBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <button 
        onClick={handleBack}
        className="mb-4 flex items-center text-purple-300 hover:text-purple-400 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>
      <h2 className="text-2xl mb-6 text-white text-center font-cinzel font-extrabold" style={{textShadow: '0 0 8px #000, 0 0 2px #fff'}}>Духовное развитие</h2>
      
      
      <div className="mt-6">
        <div className="flex justify-center mb-8 mt-10 relative">
          <FanCards
            cards={cardsArray}
            selected={selectedCard !== null ? [selectedCard] : []}
            revealed={revealedCards}
            onSelect={(index) => setSelectedCard(index)}
            width={400}
            height={120}
            cardWidth={65}
            cardHeight={95}
            backgroundImage={cards2}
            labelPrefix="Карта"
            allowMultiSelect={false}
          />
        </div>
        <button className="mt-4 px-6 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 rounded-lg border border-purple-400/30 transition-colors duration-200" onClick={handleRevealCards}>
          Получить совет
        </button>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-purple-300 mb-3">Выберите аспект духовного роста</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Текущий уровень", desc: "Оцените ваш текущий уровень духовного развития." },
            { title: "Препятствия на пути", desc: "Узнайте, что мешает вашему духовному росту." },
            { title: "Следующий шаг", desc: "Получите руководство для дальнейшего развития." },
            { title: "Духовная цель", desc: "Определите вашу высшую духовную цель." }
          ].map((item, index) => (
            <div 
              key={index}
              className={`p-4 bg-gray-800/80 border rounded-lg transition-colors duration-200 cursor-pointer ${
                selectedAspect === index 
                  ? 'border-purple-400/60 bg-purple-400/10' 
                  : 'border-purple-400/20 hover:border-purple-400/40 hover:bg-purple-500/20'
              }`}
              onClick={() => {
                handleAspectSelect(index);
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
          <h3 className="text-purple-300 text-lg mb-4">Результат анализа</h3>
          <p className="text-white mb-4">{modalContent}</p>
        </Modal>
      )}
    </div>
  );
};

export default SpiritualGrowth;
