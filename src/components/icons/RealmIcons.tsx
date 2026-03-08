import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// 练气期 - 气旋/漩涡 (青色)
export const LianqiIcon: React.FC<IconProps> = ({ size = 24, className = '', color = '#00D4AA' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="lianqiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
        <stop offset="100%" stopColor={color} stopOpacity="1" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C14.5 2 16.5 3.5 17.5 5.5C18.5 7.5 18 10 16.5 11.5"
      stroke="url(#lianqiGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M12 22C9.5 22 7.5 20.5 6.5 18.5C5.5 16.5 6 14 7.5 12.5"
      stroke="url(#lianqiGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M8 6C9.5 5 11.5 5.5 12.5 7C13.5 8.5 13 10.5 11.5 11.5"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M16 18C14.5 19 12.5 18.5 11.5 17C10.5 15.5 11 13.5 12.5 12.5"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="12" cy="12" r="2.5" fill={color} />
    <circle cx="12" cy="4" r="1" fill={color} opacity="0.8" />
    <circle cx="20" cy="12" r="1" fill={color} opacity="0.6" />
    <circle cx="12" cy="20" r="1" fill={color} opacity="0.8" />
    <circle cx="4" cy="12" r="1" fill={color} opacity="0.6" />
  </svg>
);

// 筑基期 - 基石/塔基 (蓝色)
export const ZhujiIcon: React.FC<IconProps> = ({ size = 24, className = '', color = '#4A90E2' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="zhujiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.6" />
        <stop offset="50%" stopColor={color} stopOpacity="1" />
        <stop offset="100%" stopColor="#2C5AA0" stopOpacity="1" />
      </linearGradient>
    </defs>
    <path d="M4 18L6 14H18L20 18H4Z" fill="url(#zhujiGrad)" />
    <path d="M6 14L8 10H16L18 14H6Z" fill={color} opacity="0.8" />
    <path d="M8 10L10 6H14L16 10H8Z" fill={color} opacity="0.9" />
    <circle cx="12" cy="5" r="1.5" fill={color} />
    <path d="M11 8H13M11 12H13M11 16H13" stroke="white" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
  </svg>
);

// 金丹期 - 金丹/圆珠 (金色)
export const JindanIcon: React.FC<IconProps> = ({ size = 24, className = '', color = '#FDCB6E' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <radialGradient id="jindanGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFF9E6" />
        <stop offset="40%" stopColor={color} />
        <stop offset="100%" stopColor="#D4A84B" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill={color} opacity="0.15" />
    <circle cx="12" cy="12" r="8" fill={color} opacity="0.2" />
    <circle cx="12" cy="12" r="6" fill="url(#jindanGrad)" />
    <circle cx="12" cy="12" r="4" stroke="#B8942F" strokeWidth="0.5" fill="none" opacity="0.6" />
    <circle cx="12" cy="12" r="2.5" stroke="#B8942F" strokeWidth="0.5" fill="none" opacity="0.4" />
    <ellipse cx="10" cy="10" rx="2" ry="1.5" fill="white" opacity="0.4" />
    <circle cx="12" cy="3" r="1" fill={color} opacity="0.8" />
    <circle cx="21" cy="12" r="1" fill={color} opacity="0.6" />
    <circle cx="12" cy="21" r="1" fill={color} opacity="0.8" />
    <circle cx="3" cy="12" r="1" fill={color} opacity="0.6" />
  </svg>
);

// 元婴期 - 小人/元婴 (紫色)
export const YuanyingIcon: React.FC<IconProps> = ({ size = 24, className = '', color = '#9B59B6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="yuanyingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8D5F2" />
        <stop offset="50%" stopColor={color} />
        <stop offset="100%" stopColor="#6C3483" />
      </linearGradient>
    </defs>
    <ellipse cx="12" cy="12" rx="10" ry="3" fill={color} opacity="0.2" />
    <path
      d="M12 5C13.5 5 14.5 6 14.5 7.5C14.5 9 13.5 10 12 10C10.5 10 9.5 9 9.5 7.5C9.5 6 10.5 5 12 5Z"
      fill="url(#yuanyingGrad)"
    />
    <path d="M10 10.5H14L13 16H11L10 10.5Z" fill={color} opacity="0.9" />
    <path d="M10 12C9 12.5 8 14 8 15M14 12C15 12.5 16 14 16 15" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M6 16C6 16 8 14 12 14C16 14 18 16 18 16L16 19H8L6 16Z" fill={color} opacity="0.6" />
    <ellipse cx="8" cy="17" rx="2" ry="1" fill={color} opacity="0.5" />
    <ellipse cx="12" cy="17" rx="2.5" ry="1.2" fill={color} opacity="0.7" />
    <ellipse cx="16" cy="17" rx="2" ry="1" fill={color} opacity="0.5" />
  </svg>
);

// 化神期 - 神光/法相 (橙红色)
export const HuashenIcon: React.FC<IconProps> = ({ size = 24, className = '', color = '#E74C3C' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="huashenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor={color} />
        <stop offset="100%" stopColor="#C0392B" />
      </linearGradient>
    </defs>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <line
        key={angle}
        x1="12"
        y1="12"
        x2={12 + 9 * Math.cos((angle * Math.PI) / 180)}
        y2={12 + 9 * Math.sin((angle * Math.PI) / 180)}
        stroke="url(#huashenGrad)"
        strokeWidth="1"
        opacity={0.3 + (i % 2) * 0.3}
      />
    ))}
    <circle cx="12" cy="12" r="8" stroke="url(#huashenGrad)" strokeWidth="1" fill="none" opacity="0.6" />
    <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" fill="none" opacity="0.8" />
    <circle cx="12" cy="12" r="3" fill="url(#huashenGrad)" />
    <ellipse cx="12" cy="11" rx="1" ry="0.5" fill="white" opacity="0.6" />
  </svg>
);

// 渡劫期 - 雷电/天劫 (银白色)
export const DujieIcon: React.FC<IconProps> = ({ size = 24, className = '', color = '#E8E8E8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="dujieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor={color} />
        <stop offset="100%" stopColor="#7F8C8D" />
      </linearGradient>
    </defs>
    <path d="M4 10C4 7 6 5 9 5C10 5 11 5.5 12 6C13 5.5 14 5 15 5C18 5 20 7 20 10C20 12 18 14 15 14H9C6 14 4 12 4 10Z" fill="#5D6D7E" opacity="0.8" />
    <path d="M13 8L11 13H14L10 20L13 14H10L13 8Z" fill="url(#dujieGrad)" />
    <path d="M8 12L7 15H9L6 19" stroke={color} strokeWidth="1" fill="none" opacity="0.7" />
    <path d="M16 11L17 14H15L18 18" stroke={color} strokeWidth="1" fill="none" opacity="0.7" />
    <circle cx="13" cy="8" r="1" fill="white" opacity="0.9" />
    <circle cx="10" cy="20" r="0.8" fill={color} opacity="0.8" />
  </svg>
);

// 大乘期 - 圆满/佛光 (金色+彩虹)
export const DachengIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="dachengGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF6347" />
      </linearGradient>
      <linearGradient id="dachengGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="33%" stopColor="#4ECDC4" />
        <stop offset="66%" stopColor="#45B7D1" />
        <stop offset="100%" stopColor="#96CEB4" />
      </linearGradient>
    </defs>
    {[...Array(12)].map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 12 + 6 * Math.cos(angle);
      const y1 = 12 + 6 * Math.sin(angle);
      const x2 = 12 + 11 * Math.cos(angle);
      const y2 = 12 + 11 * Math.sin(angle);
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="url(#dachengGrad2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={0.7 + (i % 3) * 0.1}
        />
      );
    })}
    <circle cx="12" cy="12" r="7" stroke="url(#dachengGrad1)" strokeWidth="1.5" fill="none" opacity="0.8" />
    <g>
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 12 + 2.5 * Math.cos(rad);
        const cy = 12 + 2.5 * Math.sin(rad);
        return (
          <ellipse
            key={angle}
            cx={cx}
            cy={cy}
            rx="2"
            ry="3"
            fill="url(#dachengGrad1)"
            opacity="0.9"
            transform={`rotate(${angle + 90} ${cx} ${cy})`}
          />
        );
      })}
      <circle cx="12" cy="12" r="2" fill="#FFD700" />
    </g>
    <circle cx="12" cy="2" r="1" fill="#FFD700" opacity="0.8" />
    <circle cx="22" cy="12" r="1" fill="#4ECDC4" opacity="0.8" />
    <circle cx="12" cy="22" r="1" fill="#FF6B6B" opacity="0.8" />
    <circle cx="2" cy="12" r="1" fill="#96CEB4" opacity="0.8" />
  </svg>
);

// 根据境界获取对应图标组件
export const RealmIcon: React.FC<IconProps & { realm: string }> = ({ realm, ...props }) => {
  if (realm.includes('lianqi')) return <LianqiIcon {...props} />;
  if (realm.includes('zhuji')) return <ZhujiIcon {...props} color="#4A90E2" />;
  if (realm.includes('jindan')) return <JindanIcon {...props} color="#FDCB6E" />;
  if (realm.includes('yuanying')) return <YuanyingIcon {...props} color="#9B59B6" />;
  if (realm.includes('huashen')) return <HuashenIcon {...props} color="#E74C3C" />;
  if (realm.includes('dujie')) return <DujieIcon {...props} color="#E8E8E8" />;
  if (realm.includes('dacheng')) return <DachengIcon {...props} />;
  return <LianqiIcon {...props} />;
};

// 导出获取图标的函数（用于render props场景）
export const getRealmIcon = (realm: string, size?: number, className?: string): React.ReactNode => {
  const props = { size, className };
  if (realm.includes('lianqi')) return <LianqiIcon {...props} />;
  if (realm.includes('zhuji')) return <ZhujiIcon {...props} color="#4A90E2" />;
  if (realm.includes('jindan')) return <JindanIcon {...props} color="#FDCB6E" />;
  if (realm.includes('yuanying')) return <YuanyingIcon {...props} color="#9B59B6" />;
  if (realm.includes('huashen')) return <HuashenIcon {...props} color="#E74C3C" />;
  if (realm.includes('dujie')) return <DujieIcon {...props} color="#E8E8E8" />;
  if (realm.includes('dacheng')) return <DachengIcon {...props} />;
  return <LianqiIcon {...props} />;
};

// 默认导出
export default {
  LianqiIcon,
  ZhujiIcon,
  JindanIcon,
  YuanyingIcon,
  HuashenIcon,
  DujieIcon,
  DachengIcon,
  RealmIcon,
  getRealmIcon,
};
