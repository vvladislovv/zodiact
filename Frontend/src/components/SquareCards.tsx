import React from "react";
import cards2 from "../assets/images/cards/cards2.jpg";

interface SquareCardsProps {
  cards: number[];
  selected: number[];
  revealed: { [key: number]: string };
  onSelect: (index: number) => void;
  cardSize?: number;
  backgroundImages?: string[];
  labelPrefix?: string;
  allowMultiSelect?: boolean;
  columns?: number;
}

const SquareCards: React.FC<SquareCardsProps> = ({
  cards,
  selected,
  revealed,
  onSelect,
  cardSize = 120,
  backgroundImages = [],
  labelPrefix = "Карта",
  allowMultiSelect = false,
  columns = 3,
}) => {
  const defaultImage = cards2;

  return (
    <div
      className="grid gap-4 justify-center mb-8"
      style={{
        gridTemplateColumns: `repeat(${columns}, ${cardSize}px)`,
        maxWidth: `${columns * (cardSize + 16)}px`,
        margin: "0 auto",
      }}
    >
      {cards.map((card, index) => {
        const backgroundImage = backgroundImages[index] || defaultImage;

        return (
          <div
            key={index}
            className={`border-2 border-purple-400/60 bg-black/40 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 select-none relative overflow-hidden ${
              selected.includes(index)
                ? "border-purple-400 bg-purple-400/10 scale-105 z-20"
                : "hover:border-purple-300/80 z-10"
            }`}
            style={{
              width: cardSize,
              height: cardSize,
              boxShadow: selected.includes(index)
                ? "0 0 16px 4px #a78bfaee"
                : "none",
            }}
            onClick={() => onSelect(index)}
          >
            {/* Background image with proper square cropping and blur */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.7,
                filter: "blur(2px)",
              }}
            />

            {/* Overlay for better text readability with additional blur */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />

            {/* Content */}
            <div className="relative z-10 text-center px-2">
              {revealed[index] ? (
                <span
                  className="text-white text-sm font-extrabold text-center break-words"
                  style={{ textShadow: "0 0 8px #000, 0 0 2px #fff" }}
                >
                  {revealed[index]}
                </span>
              ) : (
                <span
                  className="text-white text-sm font-extrabold text-center break-words"
                  style={{ textShadow: "0 0 8px #000, 0 0 2px #fff" }}
                >
                  {labelPrefix} {card + 1}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SquareCards;
