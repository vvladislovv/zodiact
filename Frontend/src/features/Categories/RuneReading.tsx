import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RuneCards from '../../components/RuneCards';
import Modal from '../../components/Modal';
import { runicBlue, treeBackground } from '../../assets/images';

const RuneReading: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<{[key: number]: string}>({});
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");

  const cardCount = 7;
  const cardsArray = Array.from({ length: cardCount }, (_, i) => i);

  // Симуляция API для рун
  const getRuneReading = async (cards: number[], question: string) => {
    const runeNames = [
      'Феху', 'Уруз', 'Турисаз', 'Ансуз', 'Райдо', 'Кеназ', 'Гебо'
    ];
    
    const runeMeanings = [
      'Богатство и процветание ждут вас',
      'Сила и выносливость помогут преодолеть препятствия',
      'Защита и оборона от негативных влияний',
      'Мудрость и знания откроются вам',
      'Путешествие и движение к цели',
      'Творчество и вдохновение',
      'Дар и взаимный обмен энергией'
    ];

    return {
      message: `Руны дают ответ на ваш вопрос о ${question.toLowerCase()}`,
      meanings: cards.map(index => `${runeNames[index]}: ${runeMeanings[index]}`)
    };
  };

  const handleRevealCards = async () => {
    if (selectedCards.length === 3 && selectedQuestion) {
      try {
        const data = await getRuneReading(selectedCards, selectedQuestion);
        const newRevealed = { ...revealedCards };
        selectedCards.forEach((cardIndex, position) => {
          newRevealed[cardIndex] = data.meanings[position];
        });
        setRevealedCards(newRevealed);
        setModalContent(`${data.message}\n\nВыбранные руны:\n${data.meanings.join('\n')}`);
      } catch (error: any) {
        setModalContent(`Ошибка при получении толкования рун: ${error.message || 'Неизвестная ошибка'}`);
      }
      setModalOpen(true);
    } else {
      setModalContent('Пожалуйста, выберите ровно 3 руны и тип вопроса.');
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-900/70 backdrop-blur-lg border border-blue-600/30 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_15px_rgba(59,130,246,0.2)] rounded-xl mx-auto my-4 max-w-4xl max-h-[calc(100vh-100px)] overflow-y-auto text-white" style={{ backgroundImage: `url(${treeBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <button 
        onClick={handleBack}
        className="mb-4 flex items-center text-blue-300 hover:text-blue-400 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>
      <h2 className="text-2xl mb-6 text-blue-300 text-center font-serif font-bold" style={{textShadow: '0 0 10px #3b82f6'}}>Гадание на Рунах</h2>
      
      <div className="mt-6">
        <div className="flex justify-center mb-16 mt-10 relative">
          <RuneCards
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
            width={500}
            height={160}
            cardWidth={90}
            cardHeight={130}
            backgroundImage={runicBlue}
            labelPrefix="Руна"
            allowMultiSelect={true}
          />
        </div>
        
        <div className="text-center mb-6">
          <p className="text-blue-200 text-sm">
            Выбрано рун: {selectedCards.length}/3
          </p>
        </div>

        <button 
          className="mt-4 px-6 py-2 bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 rounded-lg border border-blue-600/50 transition-colors duration-200" 
          onClick={handleRevealCards}
        >
          Толковать руны
        </button>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-blue-300 mb-3">Выберите тип вопроса</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Прошлое, настоящее, будущее", desc: "Узнайте о влиянии прошлого, текущей ситуации и будущих перспективах." },
            { title: "Любовь и отношения", desc: "Получите совет по романтическим отношениям и личной жизни." },
            { title: "Карьера и успех", desc: "Узнайте о профессиональных перспективах и пути к успеху." },
            { title: "Духовный путь", desc: "Получите руководство по духовному развитию и самопознанию." }
          ].map((item, index) => (
            <div 
              key={index}
              className={`p-4 bg-gray-800/80 border rounded-lg transition-colors duration-200 cursor-pointer ${
                selectedQuestion === item.title
                  ? 'border-blue-600/60 bg-blue-600/20'
                  : 'border-blue-600/30 hover:border-blue-600/50 hover:bg-blue-600/10'
              }`}
              onClick={() => setSelectedQuestion(item.title)}
            >
              <h4 className="text-blue-300 font-medium">{item.title}</h4>
              <p className="text-gray-300 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <Modal open={modalOpen} onClose={closeModal}>
          <h3 className="text-blue-300 text-lg mb-4">Толкование рун</h3>
          <p className="text-white mb-4 whitespace-pre-line">{modalContent}</p>
        </Modal>
      )}
    </div>
  );
};

export default RuneReading;