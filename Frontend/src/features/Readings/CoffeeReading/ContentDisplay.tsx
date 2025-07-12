import React from 'react';
import { type ReadingContent } from '../ReadingContent';

interface ContentDisplayProps {
  content: ReadingContent;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content }) => {
  return (
    <div className="mb-6 text-base text-gray-200 max-h-[30vh] overflow-y-auto pr-1">
      <p className="mb-3 font-light italic text-center">{content.description}</p>
      {content.details.map((detail, index) => (
        <div key={index} className="p-3 rounded-3xl mb-2 transition-all duration-300 hover:shadow-[0_0_10px_rgba(255,215,0,0.3)] hover:-translate-y-[2px]">
          <p className="font-normal text-center">{detail}</p>
        </div>
      ))}
    </div>
  );
};

export default ContentDisplay;
