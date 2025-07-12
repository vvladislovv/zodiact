import React, { useState } from 'react';
import { getCoffeeFortune } from '../../../utils/api';
import { type ReadingContent, CoffeeContent } from '../ReadingContent';
import CoffeeForm from './CoffeeForm';
import ContentDisplay from './ContentDisplay';

interface CoffeeReadingProps {
  title: string;
  description: string;
  onSelect?: (question: string, photo: File | null) => Promise<void>;
}

const CoffeeReading: React.FC<CoffeeReadingProps> = ({ title, description, onSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState<{ interpretation: string, date: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const content: ReadingContent = { title: title || CoffeeContent.title, description: description || CoffeeContent.description, details: CoffeeContent.details };

  const handleFormSubmit = async (question: string, photo: File | null) => {
    if (!question || !photo) {
      setError('Пожалуйста, введите вопрос и загрузите фотографию.');
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Convert photo to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const responseData = await getCoffeeFortune('7300593025', question, base64String);
        setResponse(responseData);
        setIsModalOpen(true);
        setIsLoading(false);
      };
      reader.readAsDataURL(photo);
    } catch (err) {
      setError('Ошибка при получении ответа от сервера. Попробуйте снова.');
      setIsModalOpen(true);
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setResponse(null);
    setError(null);
  };

  return (
    <div className="backdrop-blur-lg border border-purple-500/20 shadow-[0_8px_16px_rgba(0,0,0,0.2),0_0_15px_rgba(147,51,234,0.15)] rounded-3xl p-8 mb-6 max-w-lg mx-auto min-h-[50vh] max-h-[80vh] overflow-y-auto text-gray-200 flex flex-col items-center animate-fadeIn">
      
        <CoffeeForm onSelect={onSelect || handleFormSubmit} />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-purple-500/20 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto text-white relative">
            <button 
              className="absolute top-2 right-2 bg-transparent text-purple-400 text-lg transition-all duration-200 hover:text-purple-500 hover:scale-110"
              onClick={handleCloseModal}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-purple-400">Ответ на ваш вопрос</h3>
            {isLoading ? (
              <p className="text-gray-200">Загрузка...</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : response ? (
              <>
                <p className="text-gray-200 mb-2"><strong>Дата:</strong> {new Date(response.date).toLocaleString('ru-RU')}</p>
                <p className="text-gray-200"><strong>Интерпретация:</strong> {response.interpretation}</p>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoffeeReading;
