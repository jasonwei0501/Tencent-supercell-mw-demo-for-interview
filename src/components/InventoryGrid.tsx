import React from 'react';
import { Card } from '../types';

interface InventoryGridProps {
  grid: (Card | null)[][];
  onCardPlace: (card: Card, row: number, col: number) => void;
  onCardRemove: (row: number, col: number) => void;
  draggedCard: Card | null;
  onDragStart: (card: Card, row: number, col: number) => void;
  onDragEnd: () => void;
}

const GRID_SIZE = 6;

export const InventoryGrid: React.FC<InventoryGridProps> = ({
  grid,
  onCardPlace,
  onCardRemove,
  draggedCard,
  onDragStart,
  onDragEnd
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (draggedCard) {
      // Check if the card fits at this position
      if (canPlaceCard(grid, draggedCard, row, col)) {
        onCardPlace(draggedCard, row, col);
      }
    }
    onDragEnd();
  };

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

  const renderCard = (card: Card | null, row: number, col: number) => {
    if (!card) return null;

    const cardSize = {
      width: `${card.shape[0].length * 60}px`,
      height: `${card.shape.length * 60}px`,
      backgroundColor: card.color,
      position: 'absolute' as const,
      top: '0',
      left: '0',
      zIndex: row * GRID_SIZE + col + 1
    };

    return (
      <div
        key={`${card.id}-${row}-${col}`}
        className="card-piece rounded-lg border-2 border-white shadow-lg flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform"
        style={cardSize}
        draggable
        onDragStart={() => onDragStart(card, row, col)}
        onClick={() => onCardRemove(row, col)}
      >
        <div className="text-center">
          <div className="text-xs">{card.name}</div>
          <div className="text-lg">{card.cost}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="battle-grid grid grid-cols-6 gap-1 p-4 rounded-lg bg-gray-800">
      {Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => {
          const hasCard = grid[row][col] !== null;
          const isOccupied = hasCard && grid[row][col]?.shape[0].length === 1 && grid[row][col]?.shape.length === 1;
          
          return (
            <div
              key={`${row}-${col}`}
              className="grid-cell w-16 h-16 border border-gray-600 rounded relative bg-gray-700 hover:bg-gray-600 transition-colors"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, row, col)}
            >
              {hasCard && !isOccupied && renderCard(grid[row][col]!, row, col)}
              {isOccupied && renderCard(grid[row][col]!, row, col)}
            </div>
          );
        })
      )}
    </div>
  );
};