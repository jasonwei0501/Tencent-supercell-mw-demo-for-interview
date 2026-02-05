import React, { useState, useCallback } from 'react';
import { Card } from '../types';
import { availableCards } from '../data/cards';
import { InventoryGrid } from './InventoryGrid';

interface DefenseSetupProps {
  territoryName: string;
  currentDefense: Card[];
  onSaveDefense: (defense: Card[]) => void;
  onCancel: () => void;
}

const GRID_SIZE = 6;

export const DefenseSetup: React.FC<DefenseSetupProps> = ({
  territoryName,
  currentDefense,
  onSaveDefense,
  onCancel
}) => {
  const [selectedCards, setSelectedCards] = useState<Card[]>(currentDefense);
  const [grid, setGrid] = useState<(Card | null)[][]>(() => {
    const initialGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    
    // Place current defense cards in the grid
    currentDefense.forEach((card, index) => {
      let placed = false;
      for (let row = 0; row < GRID_SIZE && !placed; row++) {
        for (let col = 0; col < GRID_SIZE && !placed; col++) {
          if (canPlaceCard(initialGrid, card, row, col)) {
            placeCardInGrid(initialGrid, card, row, col);
            placed = true;
          }
        }
      }
    });
    
    return initialGrid;
  });
  
  const [draggedCard, setDraggedCard] = useState<{ card: Card; row: number; col: number } | null>(null);

  const canPlaceCard = (grid: (Card | null)[][], card: Card, row: number, col: number): boolean => {
    const shape = card.shape;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j] === 1) {
          const gridRow = row + i;
          const gridCol = col + j;
          if (gridRow >= GRID_SIZE || gridCol >= GRID_SIZE || grid[gridRow][gridCol] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placeCardInGrid = (grid: (Card | null)[][], card: Card, row: number, col: number) => {
    const shape = card.shape;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j] === 1) {
          grid[row + i][col + j] = card;
        }
      }
    }
  };

  const removeCardFromGrid = (grid: (Card | null)[][], cardId: string) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j]?.id === cardId) {
          grid[i][j] = null;
        }
      }
    }
  };

  const handleCardSelect = useCallback((card: Card) => {
    if (selectedCards.length >= 5) {
      alert('最多只能放置5张防御卡牌！');
      return;
    }
    
    setSelectedCards(prev => [...prev, card]);
    
    // Try to place the card in the grid
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (canPlaceCard(newGrid, card, row, col)) {
            placeCardInGrid(newGrid, card, row, col);
            return newGrid;
          }
        }
      }
      
      return newGrid;
    });
  }, [selectedCards]);

  const handleCardDeselect = useCallback((cardId: string) => {
    setSelectedCards(prev => prev.filter(c => c.id !== cardId));
    
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      removeCardFromGrid(newGrid, cardId);
      return newGrid;
    });
  }, []);

  const handleCardPlace = useCallback((card: Card, row: number, col: number) => {
    if (!selectedCards.find(c => c.id === card.id)) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      
      // Remove existing instance of this card
      removeCardFromGrid(newGrid, card.id);
      
      // Place card at new position
      if (canPlaceCard(newGrid, card, row, col)) {
        placeCardInGrid(newGrid, card, row, col);
      }
      
      return newGrid;
    });
  }, [selectedCards]);

  const handleCardRemove = useCallback((row: number, col: number) => {
    const card = grid[row][col];
    if (!card) return;

    setSelectedCards(prev => prev.filter(c => c.id !== card.id));
    
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      removeCardFromGrid(newGrid, card.id);
      return newGrid;
    });
  }, [grid]);

  const handleDragStart = useCallback((card: Card, row: number, col: number) => {
    setDraggedCard({ card, row, col });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedCard(null);
  }, []);

  const handleSaveDefense = useCallback(() => {
    const placedCards = getPlacedCards();
    onSaveDefense(placedCards);
  }, [onSaveDefense]);

  const resetGrid = useCallback(() => {
    setSelectedCards([]);
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
  }, []);

  // Get the cards actually placed in the grid
  const getPlacedCards = (): Card[] => {
    const placedCardIds = new Set<string>();
    const placedCards: Card[] = [];
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const card = grid[i][j];
        if (card && !placedCardIds.has(card.id)) {
          placedCardIds.add(card.id);
          placedCards.push(card);
        }
      }
    }
    
    return placedCards;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            为{territoryName}设置防御
          </h2>
          <p className="text-gray-300">最多放置5张防御卡牌</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-bold text-white mb-4">选择防御卡牌</h3>
              <p className="text-gray-400 mb-4">只能使用单位和建筑卡牌进行防御</p>
              
              <div className="grid grid-cols-2 gap-3">
                {availableCards
                  .filter(card => card.type === 'troop' || card.type === 'building')
                  .map(card => {
                    const isSelected = selectedCards.some(c => c.id === card.id);
                    const isPlaced = getPlacedCards().some(c => c.id === card.id);
                    
                    return (
                      <div
                        key={card.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isPlaced
                            ? 'border-green-500 bg-green-900 bg-opacity-30'
                            : isSelected
                            ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                            : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                        }`}
                        onClick={() => {
                          if (isPlaced) {
                            handleCardDeselect(card.id);
                          } else if (isSelected) {
                            handleCardDeselect(card.id);
                          } else {
                            handleCardSelect(card);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: card.color }}
                          />
                          <div className="text-white font-semibold text-sm">{card.name}</div>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          费用: {card.cost} | 伤害: {card.damage} | 血量: {card.health}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {card.description}
                        </div>
                        
                        {isPlaced && (
                          <div className="mt-2 text-xs text-green-400">✅ 已放置</div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">防御布局</h3>
                <div className="flex gap-2">
                  <button
                    onClick={resetGrid}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    重置
                  </button>
                </div>
              </div>
              
              <InventoryGrid
                grid={grid}
                onCardPlace={handleCardPlace}
                onCardRemove={handleCardRemove}
                draggedCard={draggedCard?.card || null}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
              
              <div className="mt-4 text-sm text-gray-400">
                <p>• 拖拽卡牌到战场进行防御布置</p>
                <p>• 已放置: {getPlacedCards().length}/5 张卡牌</p>
                <p>• 合理布置防御阵型保护你的领土</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleSaveDefense}
            disabled={getPlacedCards().length === 0}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-bold"
          >
            保存防御 ({getPlacedCards().length}/5)
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};