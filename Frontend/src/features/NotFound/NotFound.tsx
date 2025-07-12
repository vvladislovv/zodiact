import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div key="not-found" className="text-center p-0 bg-transparent border-none shadow-none rounded-none mx-0 mt-0 mb-0 w-full h-screen min-h-screen overflow-hidden flex flex-col items-center justify-center text-white">
      <div className="flex-grow flex items-center justify-center pt-0 mt-0 w-full">
        <div className="bg-gray-800/60 backdrop-blur-lg border border-purple-500/20 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_10px_rgba(147,51,234,0.1)] rounded-lg p-6 max-w-md">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Ошибка 404</h3>
          <p className="text-gray-300">Проверьте правильность введенного адреса или вернитесь на главную страницу.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
