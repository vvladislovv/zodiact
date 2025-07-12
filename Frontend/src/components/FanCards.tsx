import React from 'react';

interface FanCardsProps {
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

const FanCards: React.FC<FanCardsProps> = ({
  cards,
  selected,
  revealed,
  onSelect,
  width = 600,
  height = 220,
  cardWidth = 140,
  cardHeight = 200,
  backgroundImage = '/src/assets/backgrounds/category/Hands.jpg',
  labelPrefix = 'Карта',
  allowMultiSelect = false,
}) => {
  const total = cards.length;
  const center = Math.floor(total / 2);
  const maxRotate = 32;
  const maxTranslateX = 80;
  const maxTranslateY = 32;

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
            className={`border-2 border-purple-400/60 bg-black/40 rounded-xl absolute flex items-center justify-center cursor-pointer transition-all duration-200 select-none ${
              selected.includes(index)
                ? 'border-purple-400 bg-purple-400/10 scale-105 z-20'
                : 'hover:border-purple-300/80 z-10'
            }`}
            style={{
              width: cardWidth,
              height: cardHeight,
              left: '50%',
              top: 0,
              transform: `translate(-50%, ${translateY}px) rotate(${rotate}deg) translateX(${translateX}px)`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              boxShadow: selected.includes(index)
                ? '0 0 16px 4px #a78bfaee'
                : 'none',
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.98,
            }}
            onClick={() => {
              if (allowMultiSelect) {
                onSelect(index);
              } else {
                onSelect(index);
              }
            }}
          >
            {revealed[index] ? (
              <span
                className="text-white text-lg font-extrabold text-center break-words px-1"
                style={{ textShadow: '0 0 8px #000, 0 0 2px #fff' }}
              >
                {revealed[index]}
              </span>
            ) : (
              <span
                className="text-white text-lg font-extrabold text-center break-words px-1"
                style={{ textShadow: '0 0 8px #000, 0 0 2px #fff' }}
              >
                {labelPrefix} {card + 1}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FanCards; 