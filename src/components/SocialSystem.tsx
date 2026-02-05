import React, { useState } from 'react';
import { Friend } from '../types';

interface SocialSystemProps {
  reputation: 'knight' | 'goblin';
  gold: number;
  onReputationChange: (reputation: 'knight' | 'goblin') => void;
  onGoldChange: (gold: number) => void;
}

export const SocialSystem: React.FC<SocialSystemProps> = ({
  reputation,
  gold,
  onReputationChange,
  onGoldChange
}) => {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      name: '张三',
      avatar: '👤',
      reputation: 'knight',
      lastInteraction: new Date()
    },
    {
      id: '2',
      name: '李四',
      avatar: '👥',
      reputation: 'goblin',
      lastInteraction: new Date()
    },
    {
      id: '3',
      name: '王五',
      avatar: '👨',
      reputation: 'knight',
      lastInteraction: new Date()
    }
  ]);

  const [betrayalDialog, setBetrayalDialog] = useState<{
    friend: Friend | null;
    type: 'help' | 'betray' | null;
  }>({ friend: null, type: null });

  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev.slice(0, 4)]);
  };

  const handleHelpFriend = (friend: Friend) => {
    const goldCost = 50;
    if (gold < goldCost) {
      addNotification('金币不足，无法帮助好友！');
      return;
    }
    
    onGoldChange(gold - goldCost);
    setFriends(prev => prev.map(f => 
      f.id === friend.id 
        ? { ...f, lastInteraction: new Date() }
        : f
    ));
    
    addNotification(`你帮助了${friend.name}，获得了好感度！`);
    addNotification(`${friend.name}感谢你的帮助！`);
  };

  const handleBetrayFriend = (friend: Friend) => {
    const goldSteal = 100;
    
    onGoldChange(gold + goldSteal);
    setFriends(prev => prev.map(f => 
      f.id === friend.id 
        ? { ...f, lastInteraction: new Date() }
        : f
    ));
    
    addNotification(`你背叛了${friend.name}，夺走了${goldSteal}金币！`);
    addNotification(`${friend.name}: "你这个叛徒！我要在群里揭发你！"`);

    // Simulate group notification
    setTimeout(() => {
      addNotification('微信群消息：有人被背叛了！大家小心这个叛徒！');
    }, 2000);
  };

  const switchToKnight = () => {
    onReputationChange('knight');
    addNotification('你加入了皇家骑士阵营！获得群体红包特权！');
  };

  const switchToGoblin = () => {
    onReputationChange('goblin');
    addNotification('你加入了哥布林阵营！获得背刺加成！');
  };

  const sendGroupRedPacket = () => {
    if (reputation !== 'knight') {
      addNotification('只有皇家骑士才能发送群体红包！');
      return;
    }
    
    const packetAmount = 200;
    if (gold < packetAmount) {
      addNotification('金币不足，无法发送红包！');
      return;
    }
    
    onGoldChange(gold - packetAmount);
    addNotification(`你在微信群发送了${packetAmount}金币的大红包！`);
    addNotification('群成员纷纷感谢你的慷慨！');
  };

  const becomeWorldBoss = () => {
    if (reputation !== 'goblin') {
      addNotification('只有哥布林才能成为世界BOSS！');
      return;
    }
    
    addNotification('你成为了全服通缉的世界BOSS！');
    addNotification('所有玩家击败你都有双倍奖励！');
    addNotification('快来体验举世皆敌的刺激感！');
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">社交系统</h2>
        <p className="text-gray-300">背叛与联盟的微信生态</p>
      </div>

      {/* Reputation Status */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">当前阵营</h3>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-white font-bold ${
                reputation === 'knight' ? 'bg-blue-600' : 'bg-red-600'
              }`}>
                {reputation === 'knight' ? '皇家骑士' : '哥布林'}
              </span>
              <span className="text-yellow-400">💰 {gold} 金币</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={switchToKnight}
              disabled={reputation === 'knight'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 transition-colors"
            >
              加入骑士
            </button>
            <button
              onClick={switchToGoblin}
              disabled={reputation === 'goblin'}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-600 transition-colors"
            >
              加入哥布林
            </button>
          </div>
        </div>

        {/* Faction Abilities */}
        <div className="mt-4 p-3 bg-gray-700 rounded">
          <h4 className="text-white font-semibold mb-2">阵营特权</h4>
          {reputation === 'knight' ? (
            <div className="space-y-2">
              <button
                onClick={sendGroupRedPacket}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                🎁 发送群体红包 (200金币)
              </button>
              <div className="text-sm text-gray-300">
                • 享有教父般受人敬仰的荣耀<br/>
                • 可以给新人发放免死金牌<br/>
                • 获得额外的社交奖励
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={becomeWorldBoss}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                👹 成为世界BOSS
              </button>
              <div className="text-sm text-gray-300">
                • 背刺获得双倍金币奖励<br/>
                • 体验举世皆敌的刺激感<br/>
                • 成为全服通缉的焦点
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Friends List */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">好友列表</h3>
        <div className="space-y-3">
          {friends.map(friend => (
            <div key={friend.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{friend.avatar}</span>
                <div>
                  <div className="text-white font-semibold">{friend.name}</div>
                  <div className="text-sm text-gray-400">
                    {friend.reputation === 'knight' ? '皇家骑士' : '哥布林'}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleHelpFriend(friend)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  帮助 (50金币)
                </button>
                <button
                  onClick={() => handleBetrayFriend(friend)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  背刺 (+100金币)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">社交动态</h3>
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="text-gray-500 text-sm">暂无社交动态</div>
          ) : (
            notifications.map((notification, index) => (
              <div key={index} className="text-sm text-gray-300 p-2 bg-gray-700 rounded">
                {notification}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 提示：背叛好友会在微信群引发激烈讨论，带来黑红流量！
      </div>
    </div>
  );
};