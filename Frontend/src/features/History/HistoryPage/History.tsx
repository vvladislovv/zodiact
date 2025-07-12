import React from 'react';
import HistoryComponent from '../HistoryComponent/HistoryComponent';

const History: React.FC = () => {
  return (
    <div className="page-content text-gray-200 p-6 mx-auto mt-20 mb-6 max-h-[calc(100vh-100px)] overflow-y-auto max-w-3xl">
      <HistoryComponent />
    </div>
  );
};

export default History;
