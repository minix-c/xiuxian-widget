import React from 'react';
import { Realm } from '../types';
import { REALM_CONFIGS } from '../config';
import { RealmIcon } from './icons';

interface RealmBadgeProps {
  realm: Realm;
  size?: 'sm' | 'md' | 'lg';
  showGlow?: boolean;
  animate?: boolean;
}

const RealmBadge: React.FC<RealmBadgeProps> = ({ 
  realm, 
  size = 'md', 
  showGlow = false,
  animate = true,
}) => {
  const config = REALM_CONFIGS[realm];
  
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center
                 relative transition-all duration-300
                 ${animate ? 'hover:scale-110' : ''}`}
      style={{ 
        background: `linear-gradient(135deg, ${config.color}30, ${config.color}60)`,
        boxShadow: showGlow ? `0 0 20px ${config.color}50, inset 0 0 10px ${config.color}30` : 'none',
      }}
    >
      {/* 光晕效果 */}
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full animate-realm-breathe"
          style={{
            background: `radial-gradient(circle, ${config.color}40, transparent 70%)`,
          }}
        />
      )}
      
      {/* 境界图标 */}
      <div className="relative z-10">
        <RealmIcon realm={realm} size={iconSizes[size]} color={config.color} />
      </div>
      
      {/* 装饰光环 */}
      {showGlow && (
        <div
          className="absolute inset-[-2px] rounded-full border border-dashed animate-realm-rotate"
          style={{
            borderColor: `${config.color}40`,
          }}
        />
      )}
    </div>
  );
};

export default RealmBadge;
