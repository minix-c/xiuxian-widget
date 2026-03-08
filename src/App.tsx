import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import FloatingWindow from './components/FloatingWindow';
import { PlayerState, Realm, Technique, REALM_ORDER } from './types';
import { REALM_CONFIGS, TECHNIQUES } from './config';
import './styles/globals.css';

// 初始状态
const getInitialState = (): PlayerState => ({
  realm: 'lianqi-early',
  qi: 0,
  maxQi: REALM_CONFIGS['lianqi-early'].maxQi,
  technique: 'balanced',
  qiRate: 1,
  onlineSeconds: 0,
  todaySeconds: 0,
  streakDays: 1,
  dailyStats: {
    date: new Date().toISOString().split('T')[0],
    onlineSeconds: 0,
    qiGained: 0,
    breakthroughs: 0,
  },
});

function App() {
  const [playerState, setPlayerState] = useState<PlayerState>(getInitialState());


  // 从后端加载状态
  useEffect(() => {
    invoke<PlayerState>('load_game')
      .then(state => setPlayerState(state))
      .catch(() => setPlayerState(getInitialState()));
  }, []);

  // 计算灵气产出速率
  const calculateQiRate = useCallback((technique: Technique, realm: Realm) => {
    const baseRate = 1;
    const techBonus = TECHNIQUES[technique].qiBonus;
    const realmIndex = REALM_ORDER.indexOf(realm);
    const realmBonus = 1 + (realmIndex * 0.1);
    return baseRate * techBonus * realmBonus;
  }, []);

  // 定时同步后端状态
  useEffect(() => {
    const interval = setInterval(() => {
      invoke<PlayerState>('get_player_state')
        .then(state => setPlayerState(state))
        .catch(console.error);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 处理突破
  const handleBreakthrough = useCallback(async () => {
    try {
      const newState = await invoke<PlayerState>('breakthrough');
      setPlayerState(newState);
    } catch (e) {
      console.error('突破失败:', e);
    }
  }, []);

  // 切换功法
  const handleTechniqueChange = useCallback(async (technique: Technique) => {
    try {
      await invoke('set_technique', { technique });
      setPlayerState(prev => ({
        ...prev,
        technique,
        qiRate: calculateQiRate(technique, prev.realm),
      }));
    } catch (e) {
      console.error('切换功法失败:', e);
    }
  }, [calculateQiRate]);

  return (
    <div className="min-h-screen bg-transparent">
      <FloatingWindow
        playerState={playerState}
        onTechniqueChange={handleTechniqueChange}
        onBreakthrough={handleBreakthrough}
      />
    </div>
  );
}

export default App;
