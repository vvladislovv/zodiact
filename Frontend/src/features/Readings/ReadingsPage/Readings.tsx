import React, { useState } from 'react';
import { getCoffeeFortune } from '../../../utils/api';
import CoffeeReading from '../CoffeeReading/CoffeeReading';

interface ReadingsProps {
  onAddHistoryEntry: (readingType: string, result: string) => void;
}

const Readings: React.FC<ReadingsProps> = ({ onAddHistoryEntry }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleCoffeeSelect = async (question: string, photo: File | null) => {
    setIsLoading(true);
    setError(null);
    try {
      let photoBase64 = '';
      if (photo) {
        const reader = new FileReader();
        reader.readAsDataURL(photo);
        photoBase64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
        });
      }
      const data = await getCoffeeFortune('', question, photoBase64);
      const result = `Гадание на кофе: ${question} - ${data.interpretation}`;
      onAddHistoryEntry('Гадание на кофе', result);
    } catch (err: unknown) {
      setError('Ошибка при получении гадания на кофе. Попробуйте снова.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div key="readings" className="p-6 bg-gray-800/60 backdrop-blur-lg border border-yellow-500/20 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_10px_rgba(255,215,0,0.1)] rounded-3xl mx-auto my-4 max-w-4xl min-h-[calc(100vh-100px)] overflow-y-auto flex flex-col">
      {isLoading && <p className="text-gray-300 text-center">Загрузка...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}
      <div className="flex-grow flex flex-col items-center justify-center">
      <div className="flex-grow flex flex-col items-center justify-center">
        <CoffeeReading 
          title="Гадание на кофе" 
          description="Задайте вопрос и загрузите фото для гадания на кофейной гуще." 
          onSelect={(question: string, photo: File | null) => handleCoffeeSelect(question, photo)}
        />
      </div>
      </div>
    </div>
  );
};

export default Readings;
