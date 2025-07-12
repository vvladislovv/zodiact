import React, { useState, useRef, useEffect } from 'react';
import { revealRunes } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import FanCards from '../../components/FanCards';

const RelationshipStatus: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedRuneAspect, setSelectedRuneAspect] = useState<string | null>(null);
  const [selectedRelationshipAspect, setSelectedRelationshipAspect] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [selectedRunes, setSelectedRunes] = useState<number[]>([]);
  const [revealedRunes, setRevealedRunes] = useState<{[key: number]: string}>({});

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [modalOpen]);

  const handleButtonClick = (readingType: string) => {
    setSelectedRelationshipAspect(readingType);
  };

    const handleRuneButtonClick = async (aspect: string = '') => {
    if (aspect) {
      setSelectedRuneAspect(aspect);
      return;
    }
    if (selectedRunes.length === 3) {
      try {
        const data = await revealRunes(selectedRunes, selectedRuneAspect || '', selectedRelationshipAspect || '');
        const newRevealed = { ...revealedRunes };
        selectedRunes.forEach((runeIndex, position) => {
          newRevealed[runeIndex] = data.meanings[position];
        });
        setRevealedRunes(newRevealed);
        let aspectText = '';
        if (selectedRuneAspect) {
          aspectText += ` (${selectedRuneAspect})`;
        }
        if (selectedRelationshipAspect) {
          aspectText += `${aspectText ? ',' : ' ('} ${selectedRelationshipAspect})`;
        }
        setModalContent(`Толкование рун${aspectText}: ${data.message}`);
      } catch (error: any) {
        setModalContent(`Ошибка при толковании рун: ${error.message || 'Неизвестная ошибка'}`);
      }
      setModalOpen(true);
    } else {
      setModalContent("Пожалуйста, выберите ровно 3 руны для расклада.");
      setModalOpen(true);
    }
  };

  const handleRuneSelect = (index: number) => {
    if (selectedRunes.includes(index)) {
      setSelectedRunes(selectedRunes.filter(i => i !== index));
    } else if (selectedRunes.length < 3) {
      setSelectedRunes([...selectedRunes, index]);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const cardCount = 9;
  const cardsArray = Array.from({ length: cardCount }, (_, i) => i);

  return (
    <div className="min-h-screen flex flex-col flex-grow p-6 pb-28 bg-gray-900/60 backdrop-blur-lg border border-purple-300/20 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_10px_rgba(147,51,234,0.1)] rounded-xl mx-auto max-w-4xl w-full overflow-y-auto text-white" style={{ backgroundImage: 'url(/assets/backgrounds/backgroundFull.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <button 
        onClick={handleBack}
        className="mb-4 flex items-center text-purple-300 hover:text-purple-400 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>
      <h2 className="text-2xl mb-6 text-purple-300 text-center font-cinzel ">Состояние взаимоотношений</h2>
    
      
      <div className="mt-6">
       
        <div className="flex justify-center mb-16 mt-10 relative">
          <FanCards
            cards={cardsArray}
            selected={selectedRunes}
            revealed={revealedRunes}
            onSelect={handleRuneSelect}
            width={420}
            height={120}
            cardWidth={60}
            cardHeight={90}
            backgroundImage={'/src/assets/backgrounds/category/Hands.jpg'}
            labelPrefix="Руна"
            allowMultiSelect={true}
          />
        </div>
        <div className="flex justify-between mb-4">
          <button className={`w-1/3 p-2 border rounded-lg text-center transition-colors duration-200 ${selectedRuneAspect === 'Вы' ? 'border-purple-400/60 bg-purple-400/30' : 'border-purple-400/30 bg-purple-400/20 hover:bg-purple-400/30'}`} onClick={() => handleRuneButtonClick('Вы')}>
            <p className="text-purple-300 text-sm">Вы</p>
            <p className="text-gray-300 text-xs">Ваше состояние в отношениях</p>
          </button>
          <button className={`w-1/3 p-2 border rounded-lg text-center transition-colors duration-200 ${selectedRuneAspect === 'Партнер' ? 'border-purple-400/60 bg-purple-400/30' : 'border-purple-400/30 bg-purple-400/20 hover:bg-purple-400/30'}`} onClick={() => handleRuneButtonClick('Партнер')}>
            <p className="text-purple-300 text-sm">Партнер</p>
            <p className="text-gray-300 text-xs">Состояние партнера</p>
          </button>
          <button className={`w-1/3 p-2 border rounded-lg text-center transition-colors duration-200 ${selectedRuneAspect === 'Связь' ? 'border-purple-400/60 bg-purple-400/30' : 'border-purple-400/30 bg-purple-400/20 hover:bg-purple-400/30'}`} onClick={() => handleRuneButtonClick('Связь')}>
            <p className="text-purple-300 text-sm">Связь</p>
            <p className="text-gray-300 text-xs">Динамика между вами</p>
          </button>
        </div>
        <button className="mt-4 px-6 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 rounded-lg border border-purple-400/30 transition-colors duration-200" onClick={() => handleRuneButtonClick()}>
          Толковать все руны
        </button>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-purple-300 mb-3">Выберите аспект отношений</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Текущее состояние", desc: "Узнайте, в каком состоянии находятся ваши отношения сейчас." },
            { title: "Потенциальные проблемы", desc: "Выявите возможные трудности в отношениях." },
            { title: "Советы по улучшению", desc: "Получите рекомендации для укрепления отношений." },
            { title: "Будущее отношений", desc: "Узнайте перспективы развития ваших отношений." }
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
          <h3 className="text-purple-300 text-lg mb-4">Результат анализа</h3>
          <p className="text-white mb-4">{modalContent}</p>
        </Modal>
      )}
    </div>
  );
};

export default RelationshipStatus;
