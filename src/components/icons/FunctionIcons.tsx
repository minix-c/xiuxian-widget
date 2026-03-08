import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// 设置图标
export const SettingsIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="settingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#74B9FF" />
        <stop offset="100%" stopColor="#0984E3" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="3" stroke="url(#settingsGrad)" strokeWidth="1.5" fill="none" />
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke="url(#settingsGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// 统计/趋势图标
export const StatsIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="statsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00D4AA" />
        <stop offset="100%" stopColor="#00B894" />
      </linearGradient>
    </defs>
    <path d="M18 20V10M12 20V4M6 20v-6" stroke="url(#statsGrad)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 功法/书籍图标
export const TechniqueIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A29BFE" />
        <stop offset="100%" stopColor="#6C5CE7" />
      </linearGradient>
    </defs>
    {/* 书本主体 */}
    <path
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      stroke="url(#techGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
      stroke="url(#techGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* 书页线条 */}
    <path d="M8 7h8M8 11h6" stroke="url(#techGrad)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// 突破/闪电图标
export const BreakthroughIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="breakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FDCB6E" />
        <stop offset="50%" stopColor="#E17055" />
        <stop offset="100%" stopColor="#D63031" />
      </linearGradient>
      <filter id="breakGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* 主闪电 */}
    <path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      fill="url(#breakGrad)"
      filter="url(#breakGlow)"
    />
  </svg>
);

// 关闭/X图标
export const CloseIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 展开图标
export const ExpandIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 收起/最小化图标
export const MinimizeIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="rotate(180 12 12)"
    />
  </svg>
);

// 收起/向下箭头
export const ChevronDownIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 向上箭头
export const ChevronUpIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 15l-6-6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 灵气/能量图标
export const QiIcon: React.FC<IconProps> = ({ size = 20, className = '', color = '#00D4AA' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="qiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#81ECEC" />
        <stop offset="100%" stopColor={color} />
      </linearGradient>
    </defs>
    {/* 火焰形状 */}
    <path
      d="M12 2C8 6 6 10 6 14C6 18.4 8.7 21 12 21C15.3 21 18 18.4 18 14C18 10 16 6 12 2Z"
      fill="url(#qiGrad)"
      opacity="0.3"
    />
    <path
      d="M12 5C9.5 8.5 8 11.5 8 14C8 17 10 19 12 19C14 19 16 17 16 14C16 11.5 14.5 8.5 12 5Z"
      fill="url(#qiGrad)"
    />
    {/* 内焰 */}
    <path
      d="M12 10C11 12 10.5 13.5 10.5 14.5C10.5 16 11.2 17 12 17C12.8 17 13.5 16 13.5 14.5C13.5 13.5 13 12 12 10Z"
      fill="white"
      opacity="0.6"
    />
  </svg>
);

// 时间/时钟图标
export const TimeIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M12 7v5l3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 播放/开始图标
export const PlayIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 3l14 9-14 9V3z" fill={color} />
  </svg>
);

// 暂停图标
export const PauseIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="6" y="4" width="4" height="16" rx="1" fill={color} />
    <rect x="14" y="4" width="4" height="16" rx="1" fill={color} />
  </svg>
);

// 导出所有图标
export default {
  SettingsIcon,
  StatsIcon,
  TechniqueIcon,
  BreakthroughIcon,
  CloseIcon,
  ExpandIcon,
  MinimizeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QiIcon,
  TimeIcon,
  PlayIcon,
  PauseIcon,
};
