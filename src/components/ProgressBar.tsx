import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
  showGlow?: boolean;
  height?: string;
  animated?: boolean;
  striped?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = '#00D4AA',
  showGlow = false,
  height = 'h-2.5',
  animated = true,
  striped = false,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div 
      className={`w-full ${height} bg-white/10 rounded-full overflow-hidden relative
                 ${animated ? 'transition-all duration-300' : ''}`}
    >
      {/* 进度条背景渐变 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)`,
        }}
      />      
      {/* 进度条主体 */}
      <div
        className={`h-full rounded-full relative overflow-hidden ${animated ? 'transition-all duration-1000 ease-out' : ''}`}
        style={{ 
          width: `${clampedProgress}%`,
          background: `linear-gradient(90deg, ${color}60, ${color})`,
          boxShadow: showGlow ? `0 0 15px ${color}60, 0 0 30px ${color}30` : 'none',
        }}
      >
        {/* 条纹效果 */}
        {striped && (
          <div
            className="absolute inset-0 animate-progress-shimmer"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
              )`,
              backgroundSize: '28px 28px',
            }}
          />
        )}
        
        {/* 顶部高光 */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)`,
          }}
        />
        
        {/* 闪光动画 */}
        {showGlow && animated && (
          <div
            className="absolute inset-0 animate-progress-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        )}
        
        {/* 进度点 */}
        {clampedProgress > 0 && clampedProgress < 100 && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white"
            style={{
              boxShadow: `0 0 10px white, 0 0 20px ${color}`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
