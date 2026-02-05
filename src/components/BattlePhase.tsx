import React, { useState, useEffect, useCallback } from 'react';
import { Card, BattleUnit } from '../types';

interface BattlePhaseProps {
  playerGrid: (Card | null)[][];
  onBattleEnd: (result: 'victory' | 'defeat') => void;
}

const BATTLEFIELD_WIDTH = 800;
const BATTLEFIELD_HEIGHT = 400;
const UNIT_SCALE = 0.3; // Scale down units for "10x" visual effect

export const BattlePhase: React.FC<BattlePhaseProps> = ({ playerGrid, onBattleEnd }) => {
  const [units, setUnits] = useState<BattleUnit[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [battleTime, setBattleTime] = useState(0);

  // Initialize battle units from grid
  useEffect(() => {
    const playerUnits: BattleUnit[] = [];
    const enemyUnits: BattleUnit[] = [];
    
    // Create player units (scaled for "百人同屏" effect)
    playerGrid.forEach((row, rowIdx) => {
      row.forEach((card, colIdx) => {
        if (card) {
          const unitCount = card.type === 'troop' ? 20 : 5; // 20 units for troops, 5 for buildings
          for (let i = 0; i < unitCount; i++) {
            playerUnits.push({
              id: `player-${card.id}-${i}`,
              type: card.id,
              x: 100 + Math.random() * 200,
              y: 50 + Math.random() * 300,
              health: card.health,
              maxHealth: card.health,
              damage: card.damage / unitCount, // Distribute damage
              team: 'player',
              speed: card.type === 'troop' ? 1 : 0,
              lastAttack: 0
            });
          }
        }
      });
    });
    
    // Create enemy units (AI generated)
    const enemyCards = ['giant', 'archer', 'skeleton', 'wizard'];
    enemyCards.forEach((cardType, index) => {
      const unitCount = 15;
      for (let i = 0; i < unitCount; i++) {
        enemyUnits.push({
          id: `enemy-${cardType}-${i}`,
          type: cardType,
          x: 500 + Math.random() * 200,
          y: 50 + Math.random() * 300,
          health: 100,
          maxHealth: 100,
          damage: 10,
          team: 'enemy',
          speed: 1,
          lastAttack: 0
        });
      }
    });
    
    setUnits([...playerUnits, ...enemyUnits]);
    setBattleLog(['战斗开始！', `我方部署了 ${playerUnits.length} 个单位`, `敌方部署了 ${enemyUnits.length} 个单位`]);
  }, [playerGrid]);

  // Battle simulation
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setBattleTime(prev => prev + 1);
      
      setUnits(prevUnits => {
        const newUnits = [...prevUnits];
        const newLog: string[] = [];
        
        // Move units towards enemies
        newUnits.forEach(unit => {
          if (unit.team === 'player' && unit.speed > 0) {
            unit.x = Math.min(unit.x + unit.speed, BATTLEFIELD_WIDTH - 50);
          } else if (unit.team === 'enemy' && unit.speed > 0) {
            unit.x = Math.max(unit.x - unit.speed, 50);
          }
        });
        
        // Combat
        const aliveUnits = newUnits.filter(u => u.health > 0);
        const playerUnits = aliveUnits.filter(u => u.team === 'player');
        const enemyUnits = aliveUnits.filter(u => u.team === 'enemy');
        
        if (playerUnits.length === 0) {
          setBattleLog(prev => [...prev, '战斗失败！']);
          setTimeout(() => onBattleEnd('defeat'), 1000);
          return aliveUnits;
        }
        
        if (enemyUnits.length === 0) {
          setBattleLog(prev => [...prev, '战斗胜利！']);
          setTimeout(() => onBattleEnd('victory'), 1000);
          return aliveUnits;
        }
        
        // Find and attack nearest enemies
        aliveUnits.forEach(attacker => {
          const enemies = aliveUnits.filter(u => u.team !== attacker.team);
          if (enemies.length === 0) return;
          
          const nearestEnemy = enemies.reduce((nearest, enemy) => {
            const distToEnemy = Math.abs(attacker.x - enemy.x) + Math.abs(attacker.y - enemy.y);
            const distToNearest = Math.abs(attacker.x - nearest.x) + Math.abs(attacker.y - nearest.y);
            return distToEnemy < distToNearest ? enemy : nearest;
          });
          
          const distance = Math.abs(attacker.x - nearestEnemy.x);
          if (distance < 50 && Date.now() - attacker.lastAttack > 1000) {
            nearestEnemy.health -= attacker.damage;
            attacker.lastAttack = Date.now();
            
            if (nearestEnemy.health <= 0) {
              newLog.push(`${attacker.type === 'giant' ? '巨人' : 
                           attacker.type === 'archer' ? '弓箭手' :
                           attacker.type === 'skeleton' ? '骷髅兵' :
                           attacker.type === 'wizard' ? '法师' : '单位'} 击败了敌方单位！`);
            }
          }
        });
        
        if (newLog.length > 0) {
          setBattleLog(prev => [...prev.slice(-4), ...newLog]);
        }
        
        return aliveUnits;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPaused, onBattleEnd]);

  const getUnitColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'giant': '#ef4444',
      'archer': '#22c55e',
      'skeleton': '#6b7280',
      'wizard': '#8b5cf6',
      'knight': '#3b82f6',
      'princess': '#ec4899'
    };
    return colors[type] || '#6b7280';
  };

  const renderUnit = (unit: BattleUnit) => {
    const size = 8 * UNIT_SCALE;
    return (
      <div
        key={unit.id}
        className="battle-unit absolute"
        style={{
          left: `${unit.x}px`,
          top: `${unit.y}px`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: getUnitColor(unit.type),
          borderRadius: '50%',
          border: unit.team === 'player' ? '1px solid #3b82f6' : '1px solid #ef4444',
          opacity: unit.health / unit.maxHealth,
          transform: `scale(${UNIT_SCALE})`,
          zIndex: Math.floor(unit.y)
        }}
      />
    );
  };

  return (
    <div className="game-container p-6 max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">战斗进行中</h1>
        <p className="text-gray-300">百人同屏 - 观看史诗级战斗</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="text-white">
                <span className="text-blue-400">我方单位: {units.filter(u => u.team === 'player' && u.health > 0).length}</span>
                <span className="mx-4 text-gray-500">VS</span>
                <span className="text-red-400">敌方单位: {units.filter(u => u.team === 'enemy' && u.health > 0).length}</span>
              </div>
              <div className="text-white">
                时间: {battleTime}s
              </div>
            </div>
            
            <div 
              className="relative bg-gradient-to-b from-green-900 to-green-700 rounded-lg overflow-hidden"
              style={{ width: '100%', height: '400px' }}
            >
              <div className="absolute inset-0">
                {units.filter(u => u.health > 0).map(renderUnit)}
              </div>
              
              {/* Battle field decorations */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-4 left-4 text-blue-400 font-bold">我方阵地</div>
                <div className="absolute top-4 right-4 text-red-400 font-bold">敌方阵地</div>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {isPaused ? '继续' : '暂停'}
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">战斗记录</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {battleLog.map((log, index) => (
                <div 
                  key={index}
                  className="text-sm text-gray-300 p-2 bg-gray-800 rounded"
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-2">战斗统计</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>我方存活: {units.filter(u => u.team === 'player' && u.health > 0).length}</div>
              <div>敌方存活: {units.filter(u => u.team === 'enemy' && u.health > 0).length}</div>
              <div>战斗时长: {battleTime}秒</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};