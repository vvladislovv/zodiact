import React, { useState } from 'react';

interface CoffeeFormProps {
  onSelect: (question: string, photo: File | null) => void;
}

const CoffeeForm: React.FC<CoffeeFormProps> = ({ onSelect }) => {
  const [question, setQuestion] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect(question, photo);
    setQuestion('');
    setPhoto(null);
    // Reset the file input field
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <p className="text-sm mb-2 text-center text-gray-300">Гадание на кофе — древний способ получить ответы на ваши вопросы через символы в кофейной гуще. Задайте вопрос и загрузите фото для интерпретации.</p>
        <label htmlFor="question" className="block text-sm font-medium mb-1 text-center text-gray-300">
          Ваш вопрос
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/10 border border-purple-500/20 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/30"
          rows={3}
          placeholder="Введите ваш вопрос здесь..."
          required
        />
      </div>
      <div>
        <label htmlFor="photo" className="block text-sm font-medium mb-1 text-center text-gray-300">
          Загрузить фото
        </label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full p-3 rounded-lg bg-white/10 border border-purple-500/20 text-gray-100 cursor-pointer focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/30"
        />
        <p className="text-xs mt-1 text-center text-gray-400">Загрузите четкое фото кофейной гущи для точной интерпретации.</p>
        {photo && <p className="text-sm mt-1 text-center text-gray-300">Выбрано: {photo.name}</p>}
      </div>
      <button
        type="submit"
        className="w-full p-3 rounded-lg bg-purple-400 text-gray-100 font-cinzel text-base transition-all duration-200 hover:bg-purple-500 hover:scale-105 active:scale-95"
      >
        Отправить
      </button>
    </form>
  );
};

export default CoffeeForm;
