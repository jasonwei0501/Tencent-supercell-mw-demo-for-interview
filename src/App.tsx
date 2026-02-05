import React, { useState } from 'react';
import { Card } from './types';
import { PreparationPhase } from './components/PreparationPhase';
import { BattlePhase } from './components/BattlePhase';
import { SocialSystem } from './components/SocialSystem';
import { TerritorySystem } from './components/TerritorySystem';
import { Button, AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Home, MilitaryTech, People, Map, Settings } from '@mui/icons-material';

type GamePhase = 'menu' | 'preparation' | 'battle' | 'social' | 'territory';
type BattleResult = 'victory' | 'defeat' | null;

interface GameState {
  phase: GamePhase;
  playerGrid: (Card | null)[][];
  battleResult: BattleResult;
  gold: number;
  reputation: 'knight' | 'goblin';
}

const GRID_SIZE = 6;

function App() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'menu',
    playerGrid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)),
    battleResult: null,
    gold: 500,
    reputation: 'knight'
  });

  const handleStartPreparation = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'preparation',
      playerGrid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)),
      battleResult: null
    }));
  };

  const handleStartBattle = (grid: (Card | null)[][]) => {
    setGameState(prev => ({
      ...prev,
      phase: 'battle',
      playerGrid: grid
    }));
  };

  const handleBattleEnd = (result: 'victory' | 'defeat') => {
    const goldReward = result === 'victory' ? 150 : 50;
    setGameState(prev => ({
      ...prev,
      phase: 'menu',
      battleResult: result,
      gold: prev.gold + goldReward
    }));
  };

  const handleReputationChange = (reputation: 'knight' | 'goblin') => {
    setGameState(prev => ({
      ...prev,
      reputation
    }));
  };

  const handleGoldChange = (gold: number) => {
    setGameState(prev => ({
      ...prev,
      gold: Math.max(0, gold)
    }));
  };

  const renderNavigation = () => (
    <AppBar position="static" sx={{ backgroundColor: '#1e3c72' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          皇室战争：失落王国
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography sx={{ color: '#fbbf24' }}>
            💰 {gameState.gold}
          </Typography>
          <Typography sx={{ 
            color: gameState.reputation === 'knight' ? '#3b82f6' : '#ef4444',
            fontWeight: 'bold'
          }}>
            {gameState.reputation === 'knight' ? '🛡️ 皇家骑士' : '👹 哥布林'}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );

  const renderMainMenu = () => (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
          皇室战争：失落王国
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ color: '#cbd5e1', mb: 6 }}>
          背包整理 | 百人同屏 | 社交整活 | 领土征服
        </Typography>
        
        {gameState.battleResult && (
          <Box sx={{ mb: 4, p: 2, backgroundColor: gameState.battleResult === 'victory' ? '#065f46' : '#7f1d1d', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {gameState.battleResult === 'victory' ? '🎉 胜利！' : '😔 战败'}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 400, mx: 'auto' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<MilitaryTech />}
            onClick={handleStartPreparation}
            sx={{ 
              py: 2, 
              fontSize: '1.1rem',
              backgroundColor: '#dc2626',
              '&:hover': { backgroundColor: '#b91c1c' }
            }}
          >
            开始战斗
          </Button>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<People />}
            onClick={() => setGameState(prev => ({ ...prev, phase: 'social' }))}
            sx={{ 
              py: 2, 
              fontSize: '1.1rem',
              backgroundColor: '#7c3aed',
              '&:hover': { backgroundColor: '#6d28d9' }
            }}
          >
            社交系统
          </Button>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<Map />}
            onClick={() => setGameState(prev => ({ ...prev, phase: 'territory' }))}
            sx={{ 
              py: 2, 
              fontSize: '1.1rem',
              backgroundColor: '#059669',
              '&:hover': { backgroundColor: '#047857' }
            }}
          >
            领土征服
          </Button>
        </Box>

        <Box sx={{ mt: 6, p: 3, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>游戏特色</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2, textAlign: 'left' }}>
            <Typography sx={{ color: '#cbd5e1' }}>
              🧩 背包整理备战 - 动脑不动手的策略乐趣
            </Typography>
            <Typography sx={{ color: '#cbd5e1' }}>
              ⚔️ 百人同屏战斗 - 史诗级战场体验
            </Typography>
            <Typography sx={{ color: '#cbd5e1' }}>
              👥 社交背叛机制 - 微信群狼人杀
            </Typography>
            <Typography sx={{ color: '#cbd5e1' }}>
              🗺️ 箱庭探索 - 收复失落的王国
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );

  const renderCurrentPhase = () => {
    switch (gameState.phase) {
      case 'preparation':
        return (
          <PreparationPhase
            onStartBattle={handleStartBattle}
          />
        );
      case 'battle':
        return (
          <BattlePhase
            playerGrid={gameState.playerGrid}
            onBattleEnd={handleBattleEnd}
          />
        );
      case 'social':
        return (
          <Container maxWidth="lg" sx={{ pt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => setGameState(prev => ({ ...prev, phase: 'menu' }))}
              sx={{ mb: 3, color: 'white', borderColor: 'white' }}
            >
              ← 返回主菜单
            </Button>
            <SocialSystem
              reputation={gameState.reputation}
              gold={gameState.gold}
              onReputationChange={handleReputationChange}
              onGoldChange={handleGoldChange}
            />
          </Container>
        );
      case 'territory':
        return (
          <Container maxWidth="xl" sx={{ pt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => setGameState(prev => ({ ...prev, phase: 'menu' }))}
              sx={{ mb: 3, color: 'white', borderColor: 'white' }}
            >
              ← 返回主菜单
            </Button>
            <TerritorySystem
              gold={gameState.gold}
              onGoldChange={handleGoldChange}
            />
          </Container>
        );
      default:
        return renderMainMenu();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {renderNavigation()}
      {renderCurrentPhase()}
    </div>
  );
}

export default App;