import React from 'react';
import { runicBlue } from '../assets/images';

interface RuneCardsProps {
  cards: number[];
  selected: number[];
  revealed: { [key: number]: string };
  onSelect: (index: number) => void;
  width?: number;
  height?: number;
  cardWidth?: number;
  cardHeight?: number;
  backgroundImage?: string;
  labelPrefix?: string;
  allowMultiSelect?: boolean;
}

const RuneCards: React.FC<RuneCardsProps> = ({
  cards,
  selected,
  revealed,
  onSelect,
  width = 600,
  height = 220,
  cardWidth = 100,
  cardHeight = 140,
  backgroundImage = runicBlue,
  labelPrefix = 'Руна',
  allowMultiSelect = false,
}) => {
  const total = cards.length;
  const center = Math.floor(total / 2);
  const maxRotate = 25;
  const maxTranslateX = 60;
  const maxTranslateY = 20;

  return (
    <div
      className="flex justify-center mb-4 relative"
      style={{ width, height, margin: '0 auto', marginBottom: '48px' }}
    >
      {cards.map((card, index) => {
        const offset = index - center;
        const rotate = (offset / center) * maxRotate;
        const translateY = Math.abs(offset) * (maxTranslateY / center) + 6;
        const translateX = offset * (maxTranslateX / center);
        
        return (
          <div
            key={index}
            className={`border-2 bg-black/60 rounded-lg absolute flex items-center justify-center cursor-pointer transition-all duration-200 select-none overflow-hidden ${
              selected.includes(index)
                ? 'border-blue-400 bg-blue-400/20 scale-110 z-20'
                : 'border-blue-600/60 hover:border-blue-400/80 z-10'
            }`}
            style={{
              width: cardWidth,
              height: cardHeight,
              left: '50%',
              top: 0,
              transform: `translate(-50%, ${translateY}px) rotate(${rotate}deg) translateX(${translateX}px)`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              boxShadow: selected.includes(index)
                ? '0 0 20px 6px #3b82f6ee'
                : '0 4px 8px rgba(0,0,0,0.3)',
              opacity: 0.95,
            }}
            onClick={() => onSelect(index)}
          >
            {/* Background with tree texture and blur */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.6,
                filter: "blur(1.5px)",
              }}
            />
            
            {/* Additional blur overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            
            {/* Mystical overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-transparent to-blue-900/30" />
            
            {/* Ancient border effect */}
            <div className="absolute inset-1 border border-blue-600/40 rounded-md" />
            
            {/* Content */}
            <div className="relative z-10 text-center px-1">
              {revealed[index] ? (
                <span
                  className="text-blue-100 text-sm font-bold text-center break-words leading-tight"
                  style={{ 
                    textShadow: '0 0 10px #000, 0 0 4px #3b82f6, 1px 1px 2px #000',
                    fontFamily: 'serif'
                  }}
                >
                  {revealed[index]}
                </span>
              ) : (
                <span
                  className="text-blue-200 text-sm font-bold text-center break-words leading-tight"
                  style={{ 
                    textShadow: '0 0 10px #000, 0 0 4px #3b82f6, 1px 1px 2px #000',
                    fontFamily: 'serif'
                  }}
                >
                  {labelPrefix} {card + 1}
                </span>
              )}
            </div>
            
            {/* Mystical glow effect for selected cards */}
            {selected.includes(index) && (
              <div className="absolute inset-0 bg-blue-400/10 rounded-lg animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RuneCards;