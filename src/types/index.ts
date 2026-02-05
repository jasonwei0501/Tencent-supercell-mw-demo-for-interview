export interface Card {
  id: string;
  name: string;
  type: 'troop' | 'spell' | 'building';
  shape: number[][];
  color: string;
  cost: number;
  damage: number;
  health: number;
  description: string;
}

export interface GameState {
  phase: 'preparation' | 'battle' | 'result';
  playerGrid: (Card | null)[][];
  enemyGrid: (Card | null)[][];
  playerHealth: number;
  enemyHealth: number;
  gold: number;
  reputation: 'knight' | 'goblin';
  territories: Territory[];
  friends: Friend[];
}

export interface Territory {
  id: string;
  name: string;
  purified: boolean;
  owner: string;
  resourcesPerHour: number;
  defenseCards: Card[];
  position: { x: number; y: number };
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  reputation: 'knight' | 'goblin';
  lastInteraction: Date;
}

export interface BattleUnit {
  id: string;
  type: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  damage: number;
  team: 'player' | 'enemy';
  speed: number;
  lastAttack: number;
}

export interface BattleResult {
  winner: 'player' | 'enemy';
  playerDamage: number;
  enemyDamage: number;
  goldEarned: number;
  experienceEarned: number;
}