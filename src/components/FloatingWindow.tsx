import { useState } from 'react';
import { PlayerState, Realm, Technique } from '../types';
import { REALM_CONFIGS, TECHNIQUES } from '../config';
import RealmBadge from './RealmBadge';
import ProgressBar from './ProgressBar';
import TechniqueSelector from './TechniqueSelector';
import DailyStats from './DailyStats';
import { 
  SettingsIcon, 
  StatsIcon, 
  TechniqueIcon, 
  BreakthroughIcon,
  ChevronDownIcon,
  QiIcon,
  TimeIcon,
} from './icons';

interface FloatingWindowProps {
  playerState: PlayerState;
  onTechniqueChange: (technique: Technique) => void;
  onBreakthrough: () => void;
}

// 获取境界对应的动画类名
const getRealmGlowClass = (realm: Realm): string => {
  if (realm.includes('lianqi')) return 'animate-lianqi-glow';
  if (realm.includes('zhuji')) return 'animate-zhuji-glow';
  if (realm.includes('jindan')) return 'animate-jindan-glow';
  if (realm.includes('yuanying')) return 'animate-yuanying-glow';
  if (realm.includes('huashen')) return 'animate-huashen-glow';
  if (realm.includes('dujie')) return 'animate-dujie-glow';
  if (realm.includes('dacheng')) return 'animate-dacheng-glow';
  return 'animate-lianqi-glow';
};

// 获取境界颜色
const getRealmColor = (realm: Realm): string => {
  if (realm.includes('lianqi')) return '#00D4AA';
  if (realm.includes('zhuji')) return '#4A90E2';
  if (realm.includes('jindan')) return '#FDCB6E';
  if (realm.includes('yuanying')) return '#9B59B6';
  if (realm.includes('huashen')) return '#E74C3C';
  if (realm.includes('dujie')) return '#E8E8E8';
  if (realm.includes('dacheng')) return '#FFD700';
  return '#00D4AA';
};

const FloatingWindow: React.FC<FloatingWindowProps> = ({
  playerState,
  onTechniqueChange,
  onBreakthrough,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTechniqueModal, setShowTechniqueModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [isBreakthroughAnimating, setIsBreakthroughAnimating] = useState(false);

  const realmConfig = REALM_CONFIGS[playerState.realm];
  const progress = (playerState.qi / realmConfig.maxQi) * 100;
  const canBreakthrough = playerState.qi >= realmConfig.maxQi;
  const realmColor = getRealmColor(playerState.realm);
  const realmGlowClass = getRealmGlowClass(playerState.realm);

  // 处理突破
  const handleBreakthrough = () => {
    setIsBreakthroughAnimating(true);
    setTimeout(() => {
      onBreakthrough();
      setTimeout(() => setIsBreakthroughAnimating(false), 1500);
    }, 500);
  };

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}时${mins}分`;
    return `${mins}分`;
  };

  if (!isExpanded) {
    // 收起状态 - 180x60px
    return (
      <div
        className={`fixed bottom-4 right-4 w-[180px] h-[60px] rounded-xl cursor-pointer select-none
                   backdrop-blur-md border border-white/20 flex items-center px-3 gap-2
                   transition-all duration-300 shadow-2xl overflow-visible
                   ${realmGlowClass} hover:scale-105 active:scale-95`}
        style={{ 
          backgroundColor: 'rgba(20, 20, 30, 0.95)',
        }}
        onClick={() => setIsExpanded(true)}
      >
        {/* 境界光晕背景 */}
        <div 
          className="absolute inset-0 rounded-xl animate-realm-breathe"
          style={{ 
            background: `radial-gradient(circle at 30% 50%, ${realmColor}30, transparent 70%)`,
          }}
        />
        
        {/* 境界徽章 */}
        <div className="relative z-10 animate-icon-float" style={{ animationDuration: '3s' }}>
          <RealmBadge realm={playerState.realm} size="md" showGlow />
        </div>
        
        {/* 进度信息 */}
        <div className="flex-1 relative z-10 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs text-white/90 font-medium truncate">
              {realmConfig.name}
            </span>          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${realmColor}80, ${realmColor})`,
                boxShadow: `0 0 10px ${realmColor}50`,
              }}
            >
              {/* 进度条闪光效果 */}
              <div className="absolute inset-0 animate-progress-shimmer" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-0.5">
            <span className="text-[10px] text-white/50">
              {Math.floor(progress)}%
            </span>
            <span className="text-[10px] text-white/40 flex items-center gap-0.5">
              <QiIcon size={10} color={realmColor} />
              {playerState.qiRate.toFixed(1)}/s
            </span>
          </div>
        </div>

        {/* 可突破提示 */}
        {canBreakthrough && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 
                        rounded-full flex items-center justify-center shadow-lg animate-attention">
            <BreakthroughIcon size={12} color="white" />
          </div>
        )}
      </div>
    );
  }

  // 展开状态 - 300x420px
  return (
    <div
      className={`fixed bottom-4 right-4 w-[300px] rounded-2xl overflow-hidden
                 backdrop-blur-xl border border-white/20 shadow-2xl animate-widget-expand
                 ${realmGlowClass}`}
      style={{ 
        backgroundColor: 'rgba(20, 20, 30, 0.95)',
      }}
    >
      {/* 突破动画覆盖层 */}
      {isBreakthroughAnimating && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {/* 闪光效果 */}
          <div 
            className="absolute inset-0 animate-breakthrough-flash"
            style={{ background: `radial-gradient(circle, ${realmColor}80, transparent)` }}
          />
          {/* 波纹效果 */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-20 h-20 rounded-full border-2 animate-breakthrough-ripple"
                style={{ 
                  borderColor: realmColor,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          {/* 突破文字 */}
          <div 
            className="absolute inset-0 flex items-center justify-center animate-breakthrough-text"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                突破成功！
              </div>
              <div className="text-lg text-white/80 mt-2">
                {realmConfig.name}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 relative">
        {/* 背景光晕 */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            background: `radial-gradient(circle at 20% 50%, ${realmColor}40, transparent 60%)`,
          }}
        />
        
        <div className="flex items-center gap-3 relative z-10">
          <RealmBadge realm={playerState.realm} size="lg" showGlow />
          <div>
            <div className="text-white font-bold text-sm">{realmConfig.name}</div>
            <div className="text-[10px] text-white/50">{realmConfig.description}</div>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 
                     active:scale-90 relative z-10 group"
        >
          <ChevronDownIcon size={18} className="text-white/60 group-hover:text-white/90" />
        </button>
      </div>

      {/* 修为进度 */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <QiIcon size={14} color={realmColor} />
            <span className="text-xs text-white/70">修为进度</span>
          </div>
          <span className="text-xs text-white/60 font-mono">
            {Math.floor(playerState.qi)} / {realmConfig.maxQi.toLocaleString()}
          </span>
        </div>        
        <ProgressBar 
          progress={progress} 
          color={realmColor}
          showGlow
          animated
        />
        
        {/* 灵气产出 */}
        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-white/40">
          <span className="flex items-center gap-1">
            <QiIcon size={12} color={realmColor} />
            灵气: {playerState.qiRate.toFixed(1)}/秒
          </span>
          <span className="flex items-center gap-1">
            <TimeIcon size={12} />
            已修炼: {formatTime(playerState.todaySeconds)}
          </span>
        </div>
      </div>

      {/* 突破按钮 */}
      {canBreakthrough && (
        <div className="px-4 pb-3">
          <button
            onClick={handleBreakthrough}
            disabled={isBreakthroughAnimating}
            className="w-full py-3 rounded-xl font-bold text-sm relative overflow-hidden
                     animate-breakthrough-btn transition-all duration-300
                     hover:scale-[1.02] active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500
                     text-white shadow-lg"
          >
            {/* 背景闪光 */}
            <div className="absolute inset-0 animate-progress-shimmer opacity-50" />            
            <span className="relative z-10 flex items-center justify-center gap-2">
              <BreakthroughIcon size={18} color="white" />
              <span>突破境界</span>
            </span>
          </button>
        </div>
      )}

      {/* 功能按钮 */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        <button
          onClick={() => setShowTechniqueModal(true)}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl
                   bg-white/5 hover:bg-white/10 transition-all duration-200
                   active:scale-95 group"
        >
          <div className="group-hover:scale-110 transition-transform duration-200">
            <TechniqueIcon size={22} />
          </div>
          <span className="text-[11px] text-white/70 group-hover:text-white/90">功法</span>
        </button>
        
        <button
          onClick={() => setShowStatsModal(true)}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl
                   bg-white/5 hover:bg-white/10 transition-all duration-200
                   active:scale-95 group"
        >
          <div className="group-hover:scale-110 transition-transform duration-200">
            <StatsIcon size={22} />
          </div>
          <span className="text-[11px] text-white/70 group-hover:text-white/90">统计</span>
        </button>
        
        <button
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl
                   bg-white/5 hover:bg-white/10 transition-all duration-200
                   active:scale-95 group"
        >
          <div className="group-hover:scale-110 transition-transform duration-200">
            <SettingsIcon size={22} />
          </div>
          <span className="text-[11px] text-white/70 group-hover:text-white/90">设置</span>
        </button>
      </div>

      {/* 当前功法显示 */}
      <div className="px-4 pb-4">
        <div className="text-[10px] text-white/40 mb-1.5 flex items-center gap-1">
          <TechniqueIcon size={10} />
          当前功法
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 
                      transition-colors duration-200">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white 
                      text-sm font-bold animate-icon-shine"
            style={{
              background: `linear-gradient(135deg, ${realmColor}60, ${realmColor})`,
              boxShadow: `0 0 15px ${realmColor}40`,
            }}
          >
            {TECHNIQUES[playerState.technique].name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white/80 font-medium truncate">
              {TECHNIQUES[playerState.technique].name}
            </div>
            <div className="text-[10px] text-white/50">
              {TECHNIQUES[playerState.technique].effect}
            </div>
          </div>
        </div>
      </div>

      {/* 弹窗 */}
      {showTechniqueModal && (
        <TechniqueSelector
          currentTechnique={playerState.technique}
          onSelect={(t) => {
            onTechniqueChange(t);
            setShowTechniqueModal(false);
          }}
          onClose={() => setShowTechniqueModal(false)}
        />
      )}
      
      {showStatsModal && (
        <DailyStats
          stats={playerState.dailyStats}
          onClose={() => setShowStatsModal(false)}
        />
      )}
    </div>
  );
};

export default FloatingWindow;
