import React from 'react';
import { type HistoryEntry } from './types';

interface HistoryEntryProps {
  entry: HistoryEntry;
}

const HistoryEntryComponent: React.FC<HistoryEntryProps> = ({ entry }) => {
  return (
    <div className="bg-gray-800/60 backdrop-blur-lg border border-yellow-500/20 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_10px_rgba(255,215,0,0.1)] p-4 rounded-lg mb-3 transition-all duration-300 hover:bg-gray-700/60">
      <p className="text-sm text-gray-400 mb-1">{entry.date}</p>
      <p className="font-medium text-yellow-400">{entry.readingType}</p>
      <p className="text-gray-200 mt-2">{entry.result}</p>
    </div>
  );
};

export default HistoryEntryComponent;
