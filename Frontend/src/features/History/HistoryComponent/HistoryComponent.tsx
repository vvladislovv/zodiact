import React, { useState, useEffect } from 'react';
import { getTarotHistory, deleteTarotHistory } from '../../../utils/api';
import { HistoryTexts } from './HistoryContent';
import { type HistoryEntry } from './types';

const HistoryComponent: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Attempt to load history from API using the centralized function
        const data = await getTarotHistory();
        const apiHistory = data.map((entry: any, index: number) => {
          // Ensure cards is an array or convert to string if not
          let cardsData = entry.cards;
          if (!Array.isArray(cardsData)) {
            console.warn('Non-array cards data found:', cardsData);
            cardsData = typeof cardsData === 'string' ? cardsData.split(',') : [];
          }
          return {
            id: (Date.now() + index).toString(),
            date: new Date(entry.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            question: entry.question || 'Вопрос не указан',
            cards: cardsData,
            summary: entry.summary || entry.interpretation || 'Нет описания',
          };
        });
        setHistory(apiHistory);
        localStorage.setItem('tarotHistory', JSON.stringify(apiHistory));
      } catch (err: any) {
        if (err.response && err.response.status === 403) {
          setError('Доступ запрещен: ошибка 403. Проверьте API-ключ или настройки сервера.');
        } else {
          setError('Ошибка при загрузке истории с сервера.');
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []); // Загружаем данные только при монтировании компонента

  // Функция для ручного обновления данных удалена по запросу пользователя

  // Check for weekly clearing
  useEffect(() => {
    const lastClearDate = localStorage.getItem('lastClearDate');
    const currentDate = new Date();
    if (!lastClearDate || isMoreThanAWeekAgo(new Date(lastClearDate), currentDate)) {
      clearHistory();
      localStorage.setItem('lastClearDate', currentDate.toISOString());
    }
  }, []);

  const isMoreThanAWeekAgo = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  };

  const clearHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteTarotHistory('all'); // Assuming 'all' as a placeholder for clearing all history
      setHistory([]);
      localStorage.removeItem('tarotHistory');
    } catch (err) {
      setError('Не удалось очистить историю. Пожалуйста, попробуйте снова.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    // Replace **text** with <strong>text</strong> for bold
    const boldRegex = /\*\*(.*?)\*\*/g;
    const htmlText = text.replace(boldRegex, '<strong>$1</strong>');
    return { __html: htmlText };
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-lg border border-purple-500/20 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_10px_rgba(147,51,234,0.1)] rounded-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-1xl text-center" style={{ color: '#c084fc', textShadow: '0 0 5px rgba(147, 51, 234, 0.5)' }}>{HistoryTexts.title}</h2>
      </div>
      {isLoading ? (
        <p className="text-gray-400 text-center mb-4">Загрузка...</p>
      ) : error ? (
        <p className="text-red-400 text-center mb-4">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-gray-400 text-center mb-4">{HistoryTexts.emptyMessage}</p>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-4">
          {history.map((entry) => (
            <div key={entry.id} className="bg-gray-700/50 border border-purple-500/10 rounded-lg p-4 shadow-sm">
              <div className="mb-2 text-purple-300 font-semibold text-sm">{entry.date}</div>
              <div className="mb-2 text-purple-200 font-medium">{entry.question}</div>
              <div className="mb-2 text-gray-300 text-sm">
                <span className="font-semibold text-purple-300">Карты:</span> {Array.isArray(entry.cards) ? entry.cards.join(', ') : (entry.cards || 'Не указаны')}
              </div>
              <div className="text-gray-300 text-sm line-clamp-3 overflow-hidden">
                <span className="font-semibold text-purple-300">Интерпретация:</span> 
                <span dangerouslySetInnerHTML={renderMarkdown(entry.summary || '')} />
              </div>
<button 
  className="mt-2 text-purple-300 text-xs hover:underline"
                onClick={() => {
                  setSelectedEntry(entry);
                  setIsModalOpen(true);
                }}
              >
                Читать полностью
              </button>
            </div>
          ))}
        </div>
      )}
<button 
  className="w-full p-3 bg-purple-400 text-gray-900 rounded-lg font-cinzel text-base transition-all duration-200 hover:bg-purple-500 hover:scale-105 active:scale-95"
        onClick={clearHistory}
      >
        {HistoryTexts.clearButton}
      </button>
      {isModalOpen && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-purple-500/20 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl text-purple-300 font-semibold mb-4">{selectedEntry.question}</h3>
            <div className="mb-4 text-gray-300 text-sm">
              <span className="font-semibold text-purple-300">Дата:</span> {selectedEntry.date}
            </div>
            <div className="mb-4 text-gray-300 text-sm">
              <span className="font-semibold text-purple-300">Карты:</span> {Array.isArray(selectedEntry.cards) ? selectedEntry.cards.join(', ') : (selectedEntry.cards || 'Не указаны')}
            </div>
            <div className="text-purple-200 text-base mb-6 whitespace-pre-line">
              <span className="font-semibold text-purple-300">Полная интерпретация:</span> 
              <span dangerouslySetInnerHTML={renderMarkdown(selectedEntry.summary || '')} />
            </div>
<button
  className="w-full p-2 bg-purple-400 text-gray-900 rounded-lg font-cinzel text-base transition-all duration-200 hover:bg-purple-500 hover:scale-105 active:scale-95"
              onClick={() => setIsModalOpen(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryComponent;
