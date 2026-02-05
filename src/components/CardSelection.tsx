import React from 'react';
import { Card } from '../types';
import { availableCards } from '../data/cards';

interface CardSelectionProps {
  selectedCards: Card[];
  onCardSelect: (card: Card) => void;
  onCardDeselect: (cardId: string) => void;
  maxCost: number;
}

export const CardSelection: React.FC<CardSelectionProps> = ({
  selectedCards,
  onCardSelect,
  onCardDeselect,
  maxCost
}) => {
  const totalCost = selectedCards.reduce((sum, card) => sum + card.cost, 0);
  
  const renderCardShape = (card: Card) => {
    const { shape } = card;
    return (
      <div className="grid gap-0.5" style={{
        gridTemplateColumns: `repeat(${shape[0].length}, 12px)`,
        gridTemplateRows: `repeat(${shape.length}, 12px)`
      }}>
        {shape.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`${cell ? 'bg-current' : 'bg-transparent'}`}
              style={{ width: '10px', height: '10px' }}
            />
          ))
        )}
      </div>
    );
  };

  const isSelected = (cardId: string) => selectedCards.some(card => card.id === cardId);

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">选择卡牌</h3>
        <div className="text-white">
          费用: <span className={totalCost > maxCost ? 'text-red-500' : 'text-green-500'}>
            {totalCost}/{maxCost}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
        {availableCards.map(card => {
          const selected = isSelected(card.id);
          return (
            <div
              key={card.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selected 
                  ? 'border-blue-500 bg-blue-900 bg-opacity-30' 
                  : 'border-gray-600 bg-gray-800 hover:border-gray-500'
              } ${totalCost + card.cost > maxCost && !selected ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => selected ? onCardDeselect(card.id) : onCardSelect(card)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: card.color }}
                />
                <div className="text-white font-semibold text-sm">{card.name}</div>
              </div>
              
              {renderCardShape(card)}
              
              <div className="mt-2 text-xs text-gray-400">
                费用: {card.cost} | 伤害: {card.damage} | 血量: {card.health}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {card.description}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="border-t border-gray-700 pt-3">
        <h4 className="text-white font-semibold mb-2">已选择的卡牌:</h4>
        {selectedCards.length === 0 ? (
          <div className="text-gray-500 text-sm">还没有选择任何卡牌</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedCards.map(card => (
              <div
                key={card.id}
                className="px-3 py-1 rounded-full bg-gray-700 text-white text-sm flex items-center gap-2"
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: card.color }}
                />
                {card.name} ({card.cost})
                <button
                  onClick={() => onCardDeselect(card.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};