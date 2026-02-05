import { Card } from '../types';

export const availableCards: Card[] = [
  {
    id: 'giant',
    name: '巨人',
    type: 'troop',
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#ef4444',
    cost: 5,
    damage: 50,
    health: 200,
    description: '巨大的坦克单位，高血量但移动缓慢'
  },
  {
    id: 'archer',
    name: '弓箭手',
    type: 'troop',
    shape: [
      [1]
    ],
    color: '#22c55e',
    cost: 3,
    damage: 30,
    health: 80,
    description: '远程攻击单位，血量较低但伤害不错'
  },
  {
    id: 'knight',
    name: '骑士',
    type: 'troop',
    shape: [
      [1, 0],
      [1, 1]
    ],
    color: '#3b82f6',
    cost: 3,
    damage: 40,
    health: 120,
    description: '均衡的近战单位，攻防兼备'
  },
  {
    id: 'princess',
    name: '公主',
    type: 'troop',
    shape: [
      [1]
    ],
    color: '#ec4899',
    cost: 4,
    damage: 60,
    health: 60,
    description: '超远程攻击，但非常脆弱'
  },
  {
    id: 'skeleton',
    name: '骷髅兵',
    type: 'troop',
    shape: [
      [1]
    ],
    color: '#6b7280',
    cost: 1,
    damage: 20,
    health: 40,
    description: '廉价的人海单位，数量众多'
  },
  {
    id: 'wizard',
    name: '法师',
    type: 'troop',
    shape: [
      [1, 1]
    ],
    color: '#8b5cf6',
    cost: 5,
    damage: 80,
    health: 100,
    description: '范围伤害法师，对群体单位效果拔群'
  },
  {
    id: 'rage',
    name: '狂暴法术',
    type: 'spell',
    shape: [
      [1]
    ],
    color: '#f97316',
    cost: 2,
    damage: 0,
    health: 0,
    description: '提升范围内单位50%攻击速度和移动速度'
  },
  {
    id: 'fireball',
    name: '火球术',
    type: 'spell',
    shape: [
      [1, 1]
    ],
    color: '#dc2626',
    cost: 4,
    damage: 100,
    health: 0,
    description: '范围伤害法术，对建筑和单位都有效'
  },
  {
    id: 'cannon',
    name: '加农炮',
    type: 'building',
    shape: [
      [1]
    ],
    color: '#475569',
    cost: 3,
    damage: 40,
    health: 150,
    description: '防御建筑，对地面单位造成持续伤害'
  },
  {
    id: 'tesla',
    name: '特斯拉电塔',
    type: 'building',
    shape: [
      [1]
    ],
    color: '#eab308',
    cost: 4,
    damage: 60,
    health: 120,
    description: '电击防御塔，对空中和地面单位都有效'
  }
];

export const getCardById = (id: string): Card | undefined => {
  return availableCards.find(card => card.id === id);
};