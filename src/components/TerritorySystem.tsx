import React, { useState } from 'react';
import { Territory, Card } from '../types';
import { availableCards } from '../data/cards';

interface TerritorySystemProps {
  gold: number;
  onGoldChange: (gold: number) => void;
}

export const TerritorySystem: React.FC<TerritorySystemProps> = ({
  gold,
  onGoldChange
}) => {
  const [territories, setTerritories] = useState<Territory[]>([
    {
      id: '1',
      name: '废弃的金矿',
      purified: false,
      owner: '哥布林',
      resourcesPerHour: 10,
      defenseCards: [],
      position: { x: 100, y: 100 }
    },
    {
      id: '2',
      name: '荒芜的村庄',
      purified: false,
      owner: '哥布林',
      resourcesPerHour: 15,
      defenseCards: [],
      position: { x: 300, y: 200 }
    },
    {
      id: '3',
      name: '黑暗森林',
      purified: false,
      owner: '哥布林',
      resourcesPerHour: 20,
      defenseCards: [],
      position: { x: 500, y: 150 }
    },
    {
      id: '4',
      name: '被遗忘的城堡',
      purified: false,
      owner: '哥布林',
      resourcesPerHour: 25,
      defenseCards: [],
      position: { x: 200, y: 300 }
    },
    {
      id: '5',
      name: '古老的神殿',
      purified: false,
      owner: '哥布林',
      resourcesPerHour: 30,
      defenseCards: [],
      position: { x: 600, y: 250 }
    }
  ]);

  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [defenseCards, setDefenseCards] = useState<Card[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const addBattleLog = (message: string) => {
    setBattleLog(prev => [message, ...prev.slice(0, 4)]);
  };

  const handleConquerTerritory = (territory: Territory) => {
    if (territory.purified && territory.owner === '玩家') {
      addBattleLog('这个领土已经是你的了！');
      return;
    }

    const battleCost = 100;
    if (gold < battleCost) {
      addBattleLog('金币不足！需要100金币才能攻占领土');
      return;
    }

    // Simulate battle
    onGoldChange(gold - battleCost);
    
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        setTerritories(prev => prev.map(t => 
          t.id === territory.id 
            ? { ...t, purified: true, owner: '玩家' }
            : t
        ));
        
        onGoldChange(prev => prev + 50); // Battle reward
        addBattleLog(`成功征服了${territory.name}！获得50金币奖励`);
        addBattleLog(`${territory.name}已净化，开始为你生产资源！`);
      } else {
        addBattleLog(`征服${territory.name}失败，损失100金币`);
        addBattleLog('需要重新组织军队再次挑战！');
      }
    }, 2000);
    
    addBattleLog(`正在攻占${territory.name}...`);
  };

  const handleSetupDefense = (territory: Territory) => {
    if (territory.owner !== '玩家') {
      addBattleLog('只能在自己的领土设置防御！');
      return;
    }
    
    setSelectedTerritory(territory);
    setDefenseCards(territory.defenseCards);
  };

  const handleAddDefenseCard = (card: Card) => {
    if (!selectedTerritory) return;
    
    if (defenseCards.length >= 3) {
      addBattleLog('最多只能放置3张防御卡牌！');
      return;
    }
    
    setDefenseCards(prev => [...prev, card]);
  };

  const handleRemoveDefenseCard = (cardId: string) => {
    setDefenseCards(prev => prev.filter(c => c.id !== cardId));
  };

  const handleSaveDefense = () => {
    if (!selectedTerritory) return;
    
    setTerritories(prev => prev.map(t => 
      t.id === selectedTerritory.id 
        ? { ...t, defenseCards }
        : t
    ));
    
    addBattleLog(`${selectedTerritory.name}的防御已更新！`);
    setSelectedTerritory(null);
    setDefenseCards([]);
  };

  const calculateTotalResources = () => {
    return territories
      .filter(t => t.purified && t.owner === '玩家')
      .reduce((sum, t) => sum + t.resourcesPerHour, 0);
  };

  // Simulate resource generation
  React.useEffect(() => {
    const interval = setInterval(() => {
      const totalResources = calculateTotalResources();
      if (totalResources > 0) {
        onGoldChange(prev => prev + totalResources / 60); // Per second
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [territories, onGoldChange]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">领土主权系统</h2>
        <p className="text-gray-300">收复河山，重建王国</p>
      </div>

      {/* Resource Overview */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">资源概览</h3>
            <div className="flex items-center gap-4">
              <span className="text-yellow-400">💰 当前金币: {gold}</span>
              <span className="text-green-400">📈 每小时产量: {calculateTotalResources()}</span>
            </div>
          </div>
          <div className="text-sm text-gray-300">
            已收复领土: {territories.filter(t => t.purified && t.owner === '玩家').length} / {territories.length}
          </div>
        </div>
      </div>

      {/* Territory Map */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">世界地图</h3>
        <div className="relative h-96 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg overflow-hidden">
          {/* Render territories as floating islands */}
          {territories.map(territory => {
            const isPurified = territory.purified;
            const isOwned = territory.owner === '玩家';
            
            return (
              <div
                key={territory.id}
                className={`absolute w-24 h-24 rounded-lg border-2 cursor-pointer transition-all hover:scale-110 ${
                  isPurified && isOwned 
                    ? 'bg-green-600 border-green-400 shadow-lg shadow-green-500/50' 
                    : isPurified 
                    ? 'bg-blue-600 border-blue-400'
                    : 'bg-gray-800 border-gray-600'
                }`}
                style={{
                  left: `${territory.position.x}px`,
                  top: `${territory.position.y}px`,
                  transform: `rotate(${Math.random() * 10 - 5}deg)`,
                  animation: isPurified && isOwned ? 'purify 1s ease-out' : 'none'
                }}
                onClick={() => handleConquerTerritory(territory)}
              >
                <div className="p-2 h-full flex flex-col justify-between">
                  <div className="text-xs text-white font-semibold">
                    {territory.name}
                  </div>
                  <div className="text-xs text-center">
                    {isPurified && isOwned ? '✅' : isPurified ? '🏰' : '💀'}
                  </div>
                  <div className="text-xs text-yellow-300">
                    +{territory.resourcesPerHour}/h
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Legend */}
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 p-2 rounded">
            <div>💀 未净化 | 🏰 他国领土 | ✅ 你的领土</div>
          </div>
        </div>
      </div>

      {/* Territory Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Territory List */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">领土详情</h3>
          <div className="space-y-2">
            {territories.map(territory => (
              <div 
                key={territory.id} 
                className="flex justify-between items-center p-3 bg-gray-700 rounded"
              >
                <div>
                  <div className="text-white font-semibold">{territory.name}</div>
                  <div className="text-sm text-gray-400">
                    状态: {territory.purified ? (territory.owner === '玩家' ? '✅ 已收复' : '🏰 他国') : '💀 未净化'}
                  </div>
                  <div className="text-sm text-gray-400">
                    产量: +{territory.resourcesPerHour}/小时
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConquerTerritory(territory)}
                    disabled={territory.purified && territory.owner === '玩家'}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-600 transition-colors"
                  >
                    {territory.purified && territory.owner === '玩家' ? '已拥有' : '征服 (100金币)'}
                  </button>
                  {territory.purified && territory.owner === '玩家' && (
                    <button
                      onClick={() => handleSetupDefense(territory)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      布防
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Battle Log */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">战斗记录</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {battleLog.length === 0 ? (
              <div className="text-gray-500 text-sm">暂无战斗记录</div>
            ) : (
              battleLog.map((log, index) => (
                <div key={index} className="text-sm text-gray-300 p-2 bg-gray-700 rounded">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Defense Setup Modal */}
      {selectedTerritory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              为{selectedTerritory.name}设置防御
            </h3>
            
            <div className="mb-4">
              <div className="text-white mb-2">选择防御卡牌 (最多3张):</div>
              <div className="grid grid-cols-3 gap-2">
                {availableCards.filter(card => card.type === 'troop' || card.type === 'building').map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleAddDefenseCard(card)}
                    disabled={defenseCards.some(c => c.id === card.id) || defenseCards.length >= 3}
                    className={`p-2 rounded text-white text-sm ${
                      defenseCards.some(c => c.id === card.id)
                        ? 'bg-gray-600 cursor-not-allowed'
                        : defenseCards.length >= 3
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                  >
                    {card.name} ({card.cost})
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-white mb-2">已选择的防御:</div>
              {defenseCards.length === 0 ? (
                <div className="text-gray-500 text-sm">还没有选择防御卡牌</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {defenseCards.map(card => (
                    <div
                      key={card.id}
                      className="px-3 py-1 rounded-full bg-gray-700 text-white text-sm flex items-center gap-2"
                    >
                      {card.name}
                      <button
                        onClick={() => handleRemoveDefenseCard(card.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSaveDefense}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                保存防御
              </button>
              <button
                onClick={() => {
                  setSelectedTerritory(null);
                  setDefenseCards([]);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};