import React from 'react';
import { useNavigate } from 'react-router-dom';

const sampleSquares = [
  { 
    title: 'Анализ ситуации',
    path: '/situation-analysis',
    background: '/assets/backgrounds/backenCard.jpg',
    description: 'Получите глубокий анализ вашей текущей жизненной ситуации и советы для принятия решений.'
  },
  { 
    title: 'Состояние взаимоотношений',
    path: '/relationship-status',
    background: '/assets/backgrounds/backenCard.jpg',
    description: 'Узнайте, в каком состоянии находятся ваши отношения и получите рекомендации для их улучшения.'
  },
  { 
    title: 'Персональный прогноз',
    path: '/personal-forecast',
    background: '/assets/backgrounds/backenCard.jpg',
    description: 'Персональный прогноз на будущее: что вас ждет в ближайшее время и как подготовиться.'
  },
  { 
    title: 'Духовное развитие',
    path: '/spiritual-growth',
    background: '/assets/backgrounds/backenCard.jpg',
    description: 'Исследуйте свой духовный путь, получите совет и рекомендации для роста.'
  },
  { 
    title: 'Гадание на Таро',
    path: '/tarot-reading',
    background: '/assets/backgrounds/backenCard.jpg',
    description: 'Получите предсказание на Таро по интересующему вас вопросу или ситуации.'
  },
  {
    title: 'Гадание на кофе',
    path: '/coffee-reading',
    background: '/assets/backgrounds/backenCard.jpg',
    description: 'Уникальное гадание на кофейной гуще: откройте тайны будущего по символам на чашке.'
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleSquareClick = (path: string) => {
    navigate(path);
  };

  React.useEffect(() => {
    const elements = document.querySelectorAll('.square-item');
    elements.forEach((el, index) => {
      setTimeout(() => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, []);

  return (
    <div>
      {/* Заголовок */}
      <div className="pt-20 pb-4 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-cinzel text-purple-300">Zodiac</h2>
        <p className="mt-2 text-gray-200 text-base md:text-lg">
          Выберите категорию.
        </p>
      </div>

      {/* Основной контент с возможностью скролла */}
      <div className="flex-1 px-4 pb-12 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {sampleSquares.map((square, index) => (
            <div 
              key={index}
              className="square-item w-full h-48 md:h-56 relative text-white rounded-2xl shadow-lg cursor-pointer transform transition-all duration-300 hover:border-purple-300 hover:shadow-[0_0_10px_rgba(147,51,234,0.5)] border border-transparent hover:-translate-y-1 overflow-hidden"
              style={{ 
                opacity: 0, 
                transform: 'translateY(10px)', 
                transition: 'opacity 0.3s ease-out, transform 0.3s ease-out', 
                transitionDelay: `${index * 0.1}s`,
                backgroundImage: `url(${square.background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              onClick={() => handleSquareClick(square.path)}
            >
              {/* overlay for darkening */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                zIndex: 1,
                pointerEvents: 'none',
                borderRadius: '1rem',
              }} />
              <div 
                className="absolute inset-0 flex flex-col justify-center items-center px-2"
                style={{zIndex: 2}}
              >
                <h3 className="text-sm font-bold text-center mb-1">{square.title}</h3>
                <div className="w-full px-2 py-1 mt-1 rounded-lg">
                  <p className="text-xs text-gray-100 text-center font-semibold leading-snug" style={{textShadow: '0 0 4px #000'}}> {square.description} </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
