import React, { useState, useCallback } from 'react';
import { Card } from '../types';
import { CardSelection } from './CardSelection';
import { InventoryGrid } from './InventoryGrid';

interface PreparationPhaseProps {
  onStartBattle: (grid: (Card | null)[][]) => void;
}

const GRID_SIZE = 6;

export const PreparationPhase: React.FC<PreparationPhaseProps> = ({ onStartBattle }) => {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [grid, setGrid] = useState<(Card | null)[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  const [draggedCard, setDraggedCard] = useState<{ card: Card; row: number; col: number } | null>(null);

  const handleCardSelect = useCallback((card: Card) => {
    setSelectedCards(prev => [...prev, card]);
  }, []);

  const handleCardDeselect = useCallback((cardId: string) => {
    setSelectedCards(prev => prev.filter(c => c.id !== cardId));
    // Remove from grid if present
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newGrid[i][j]?.id === cardId) {
            newGrid[i][j] = null;
          }
        }
      }
      return newGrid;
    });
  }, []);

  const handleCardPlace = useCallback((card: Card, row: number, col: number) => {
    if (!selectedCards.find(c => c.id === card.id)) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      
      // Remove existing instance of this card
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newGrid[i][j]?.id === card.id) {
            newGrid[i][j] = null;
          }
        }
      }
      
      // Place card at new position
      const shape = card.shape;
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          if (shape[i][j] === 1) {
            newGrid[row + i][col + j] = card;
          }
        }
      }
      
      return newGrid;
    });
  }, [selectedCards]);

  const handleCardRemove = useCallback((row: number, col: number) => {
    const card = grid[row][col];
    if (!card) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      
      // Remove all parts of this card shape
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newGrid[i][j]?.id === card.id) {
            newGrid[i][j] = null;
          }
        }
      }
      
      return newGrid;
    });
  }, [grid]);

  const handleDragStart = useCallback((card: Card, row: number, col: number) => {
    setDraggedCard({ card, row, col });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedCard(null);
  }, []);

  const handleStartBattle = useCallback(() => {
    if (selectedCards.length === 0) {
      alert('请至少选择一张卡牌！');
      return;
    }
    
    // Check if at least one card is placed on the grid
    const hasPlacedCards = grid.some(row => row.some(cell => cell !== null));
    if (!hasPlacedCards) {
      alert('请至少将一张卡牌放置在战场上！');
      return;
    }
    
    onStartBattle(grid);
  }, [selectedCards, grid, onStartBattle]);

  const resetGrid = useCallback(() => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
  }, []);

  return (
    <div className="game-container p-6 max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">皇室战争：失落王国</h1>
        <p className="text-gray-300">准备阶段 - 选择并放置你的卡牌</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <CardSelection
            selectedCards={selectedCards}
            onCardSelect={handleCardSelect}
            onCardDeselect={handleCardDeselect}
            maxCost={10}
          />
        </div>
        
        <div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">战场布置</h3>
              <div className="flex gap-2">
                <button
                  onClick={resetGrid}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  重置
                </button>
                <button
                  onClick={handleStartBattle}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-bold"
                >
                  开始战斗
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
              <p>• 拖拽卡牌到战场进行布置</p>
              <p>• 不同形状的卡牌占用不同格子</p>
              <p>• 点击已放置的卡牌可以移除</p>
              <p>• 布置完成后点击"开始战斗"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};