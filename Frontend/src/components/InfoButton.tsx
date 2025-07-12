import React, { useState } from 'react';

interface InfoButtonProps {
  onClick?: () => void;
}

const InfoButton: React.FC<InfoButtonProps> = ({ onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visitedButtons, setVisitedButtons] = useState<{ [key: string]: boolean }>({
    description: false,
    instructions: false,
    errors: false,
  });
  const [activeTab, setActiveTab] = useState<string>('description');

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (onClick) {
      onClick();
    }
  };

  const handleButtonClick = (tab: string) => {
    setActiveTab(tab);
    setVisitedButtons(prev => ({
      ...prev,
      [tab]: true,
    }));
  };

  const areAllVisited = Object.values(visitedButtons).every(value => value === true);

  return (
    <div className="fixed top-2 right-2 z-50">
      <button
        className="bg-purple-400 text-gray-900 rounded-full p-2 transition-all duration-200 hover:bg-purple-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
        onClick={handleToggleModal}
      >
        <img 
          src="https://fonts.gstatic.com/s/i/materialicons/info/v12/24px.svg" 
          alt="Информация" 
          className="w-6 h-6"
        />
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-300/20 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto text-white relative">
            <button 
              className="absolute top-2 right-2 bg-transparent text-purple-300 text-lg transition-all duration-200 hover:text-purple-400 hover:scale-110"
              onClick={handleToggleModal}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-purple-300">Информация</h3>
            <p className="text-gray-200 mb-4">Добро пожаловать! Здесь вы найдете полезную информацию о картах Таро, натальных картах и гадании на кофейной гуще, а также инструкции и советы по устранению ошибок.</p>
            <div className="sticky-header mb-4">
              <div className="header-container">
                <h2 className="text-lg text-purple-300">Информация</h2>
                <div className="slider-container">
                  <div className="slider-buttons flex space-x-2">
                    <button 
                      id="descriptionButton" 
                      className={`slider-button ${activeTab === 'description' && visitedButtons.description ? 'active bg-purple-400 text-gray-900' : 'bg-gray-700 text-gray-200'} px-3 py-1 rounded-full`}
                      onClick={() => {
                        handleButtonClick('description');
                        const descriptionContent = document.getElementById('descriptionContent');
                        const instructionsContent = document.getElementById('instructionsContent');
                        const errorsContent = document.getElementById('errorsContent');
                        if (descriptionContent) descriptionContent.style.display = 'block';
                        if (instructionsContent) instructionsContent.style.display = 'none';
                        if (errorsContent) errorsContent.style.display = 'none';
                      }}
                      title="Описание"
                    >
                      ℹ️
                    </button>
                    <button 
                      id="instructionsButton" 
                      className={`slider-button ${activeTab === 'instructions' && visitedButtons.instructions ? 'active bg-purple-400 text-gray-900' : 'bg-gray-700 text-gray-200'} px-3 py-1 rounded-full`}
                      onClick={() => {
                        handleButtonClick('instructions');
                        const descriptionContent = document.getElementById('descriptionContent');
                        const instructionsContent = document.getElementById('instructionsContent');
                        const errorsContent = document.getElementById('errorsContent');
                        if (descriptionContent) descriptionContent.style.display = 'none';
                        if (instructionsContent) instructionsContent.style.display = 'block';
                        if (errorsContent) errorsContent.style.display = 'none';
                      }}
                      title="Инструкция"
                    >
                      📖
                    </button>
                    <button 
                      id="errorsButton" 
                      className={`slider-button ${activeTab === 'errors' && visitedButtons.errors ? 'active bg-purple-400 text-gray-900' : 'bg-gray-700 text-gray-200'} px-3 py-1 rounded-full`}
                      onClick={() => {
                        handleButtonClick('errors');
                        const descriptionContent = document.getElementById('descriptionContent');
                        const instructionsContent = document.getElementById('instructionsContent');
                        const errorsContent = document.getElementById('errorsContent');
                        if (descriptionContent) descriptionContent.style.display = 'none';
                        if (instructionsContent) instructionsContent.style.display = 'none';
                        if (errorsContent) errorsContent.style.display = 'block';
                      }}
                      title="Частые ошибки"
                    >
                      ⚠️
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div id="descriptionContent" className="text-gray-200">
              <h2 className="text-lg font-semibold mb-2">ℹ️ Информация о картах Таро и натальных картах</h2>
              <div className="info-subsection mb-3">
                <h3 className="text-md font-medium text-purple-300">Карты Таро</h3>
                <p>Карты Таро — это набор из 78 карт, используемых для гадания и самопознания. Каждая карта имеет своё значение и символику, которые могут помочь в понимании текущих ситуаций и принятии решений. Таро часто используется как инструмент для медитации и саморефлексии. Погрузитесь в мир символов и интуиции, где каждая карта — это ключ к пониманию вашего внутреннего "я" и внешнего мира. Раскройте тайны прошлого, настоящего и будущего, используя мудрость древних символов.</p>
              </div>
              <div className="info-subsection mb-3">
                <h3 className="text-md font-medium text-purple-300">Натальные карты</h3>
                <p>Натальные карты, также известные как астрологические карты, представляют собой карту небесной сферы в момент Вашего рождения. Они показывают расположение планет и знаков зодиака, что может дать представление о Ваших личных качествах, сильных и слабых сторонах, а также о жизненных путях. Позвольте звездам осветить ваш путь и помочь вам принять важные решения. Узнайте, как планеты влияют на вашу личность, отношения и карьеру. Погрузитесь в мир астрологии и откройте для себя новые грани своей судьбы.</p>
              </div>
              <div className="info-subsection mb-3">
                <h3 className="text-md font-medium text-purple-300">Гадание на кофейной гуще</h3>
                <p>Гадание на кофейной гуще — это древний ритуал, который позволяет увидеть скрытые знаки и символы в кофейной гуще. Каждый символ — это послание из мира бессознательного, которое может дать ответы на ваши вопросы и помочь вам принять важные решения. Позвольте кофейной гуще раскрыть тайны вашего подсознания и показать вам скрытые возможности. Погрузитесь в мир символов и интуиции, где каждый знак — это ключ к пониманию вашего внутреннего мира.</p>
              </div>
              <p>Использование карт Таро, натальных карт и гадания на кофейной гуще может помочь Вам лучше понять себя и окружающий мир, а также найти ответы на важные вопросы.</p>
            </div>
            <div id="instructionsContent" className="text-gray-200" style={{ display: 'none' }}>
              <h2 className="text-lg font-semibold mb-2 text-purple-300">Как пользоваться</h2>
              <div className="info-subsection mb-3">
                <h3 className="text-md font-medium text-purple-300">Карты Таро</h3>
                <p>Чтобы погадать на картах Таро, введите ваш вопрос в поле ввода и нажмите кнопку "Перемешать". Затем выберите три карты из колоды, кликнув по ним. Каждая карта раскроет свой смысл и даст ответ на ваш вопрос.</p>
              </div>
              <div className="info-subsection mb-3">
                <h3 className="text-md font-medium text-purple-300">Натальные карты</h3>
                <p>Чтобы построить натальную карту, введите дату, время и город вашего рождения. Нажмите кнопку "Получить прогноз", чтобы узнать, как планеты влияют на вашу судьбу.</p>
              </div>
              <div className="info-subsection mb-3">
                <h3 className="text-md font-medium text-purple-300">Гадание на кофейной гуще</h3>
                <p>Чтобы погадать на кофейной гуще, загрузите фотографию кофейной гущи и введите ваш вопрос. Нажмите кнопку "Отправить", чтобы получить ответ. Пример фото для загрузки</p>
                <img src="/images/cofe.jpg" alt="Пример фото кофейной гущи" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            </div>
            <div id="errorsContent" className="text-gray-200" style={{ display: 'none' }}>
              <h2 className="text-lg font-semibold mb-2">Частые ошибки</h2>
              <div className="info-subsection mb-3">
                <h3 className="text-md font-medium text-purple-300">Ошибка 503 (Service Unavailable)</h3>
                <p>Эта ошибка указывает на то, что сервер временно недоступен. Это может быть связано с техническими работами или перегрузкой сервера.</p>
                <p><strong>Решение:</strong></p>
                <p>Попробуйте обновить страницу или приложение через несколько минут. Убедитесь, что у вас стабильное интернет-соединение. Если ошибка повторяется, возможно, проблема на стороне сервера. В этом случае, пожалуйста, свяжитесь с нашей службой поддержки.</p>
              </div>
              <div className="info-subsection mb-3">
                <h3 className="text-md font-medium text-purple-300">Ошибка в разделе кофе</h3>
                <p>Если у вас возникли проблемы с загрузкой фотографии, это может быть вызвано несколькими причинами.</p>
                <p><strong>Решение:</strong></p>
                <p>Проверьте, стабильное ли у вас интернет-соединение. Убедитесь, что формат и размер фотографии соответствуют требованиям приложения. Попробуйте перезапустить приложение и повторить попытку загрузки. Если проблема сохраняется, попробуйте отправить фотографию позже. Перезагрузите ваше устройство. Проверьте, достаточно ли свободного места на вашем устройстве.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoButton;
