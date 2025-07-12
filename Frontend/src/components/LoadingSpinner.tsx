import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 shadow-[0_0_10px_rgba(147,51,234,0.5)]"></div>
    </div>
  );
};

export default LoadingSpinner;
