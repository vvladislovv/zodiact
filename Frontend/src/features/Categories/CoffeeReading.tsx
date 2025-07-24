import React from 'react';
import { useNavigate } from 'react-router-dom';
import CoffeeReadingComponent from '../Readings/CoffeeReading/CoffeeReading';
import { coffeeAstrology } from '../../assets/images';

const CoffeeReading: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="p-6 bg-gray-900/60 backdrop-blur-lg border border-purple-300/20 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_10px_rgba(147,51,234,0.1)] rounded-xl mx-auto my-4 max-w-4xl min-h-screen overflow-y-auto text-white" style={{ backgroundImage: `url(${coffeeAstrology})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <button 
        onClick={handleBack}
        className="mb-4 flex items-center text-purple-300 hover:text-purple-400 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>
      <h2 className="text-2xl mb-6 text-purple-300 text-center font-cinzel">Гадание на кофе</h2>
      <CoffeeReadingComponent title="Гадание на кофе" description="Задайте вопрос и загрузите фото кофейной гущи для интерпретации." />
      <div className="mb-20" />
    </div>
  );
};

export default CoffeeReading;
