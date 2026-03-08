import React from 'react';
import { DailyStats } from '../types';
import { CloseIcon, TimeIcon, StatsIcon, BreakthroughIcon, QiIcon } from './icons';

interface DailyStatsProps {
  stats: DailyStats;
  onClose: () => void;
}

const DailyStatsPanel: React.FC<DailyStatsProps> = ({ stats, onClose }) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}小时${mins}分钟`;
    return `${mins}分钟`;
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    return num.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
         onClick={onClose}>
      <div className="w-[280px] rounded-2xl overflow-hidden backdrop-blur-xl border border-white/20
                    bg-[rgba(20,20,30,0.98)] shadow-2xl animate-pop-in"
           onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <StatsIcon size={18} color="#00D4AA" />
            <span className="text-white font-bold text-sm">今日道心</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-90"
          >
            <CloseIcon size={16} className="text-white/60" />
          </button>
        </div>

        {/* 统计内容 */}
        <div className="p-4 space-y-3">
          {/* 在线时长 */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent
                        border border-blue-500/20 hover:border-blue-500/30 transition-colors duration-200">
            <div className="w-11 h-11 rounded-full bg-blue-500/20 flex items-center justify-center
                          animate-icon-float">
              <TimeIcon size={20} color="#60A5FA" />
            </div>            
            <div className="flex-1">
              <div className="text-[10px] text-blue-400 font-medium">今日修炼</div>
              <div className="text-white font-bold text-base">{formatTime(stats.onlineSeconds)}</div>
            </div>          </div>

          {/* 修为获取 */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-teal-500/10 to-transparent
                        border border-teal-500/20 hover:border-teal-500/30 transition-colors duration-200">
            <div className="w-11 h-11 rounded-full bg-teal-500/20 flex items-center justify-center
                          animate-icon-float">
              <QiIcon size={20} color="#2DD4BF" />
            </div>            
            <div className="flex-1">
              <div className="text-[10px] text-teal-400 font-medium">获得修为</div>
              <div className="text-white font-bold text-base">{formatNumber(Math.floor(stats.qiGained))}</div>
            </div>          </div>

          {/* 突破次数 */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-yellow-500/10 to-transparent
                        border border-yellow-500/20 hover:border-yellow-500/30 transition-colors duration-200">
            <div className="w-11 h-11 rounded-full bg-yellow-500/20 flex items-center justify-center
                          animate-icon-float">
              <BreakthroughIcon size={20} />
            </div>            
            <div className="flex-1">
              <div className="text-[10px] text-yellow-400 font-medium">突破境界</div>
              <div className="flex items-baseline gap-1">
                <span className="text-white font-bold text-base">{stats.breakthroughs}</span>
                <span className="text-white/50 text-xs">次</span>
              </div>
            </div>          </div>
        </div>

        {/* 日期与额外信息 */}
        <div className="px-4 pb-4">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-[10px] text-white/30 mb-1">{stats.date}</div>            
            <div className="flex items-center justify-center gap-1">
              <div className={`w-2 h-2 rounded-full ${stats.breakthroughs > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-[10px] text-white/40">
                {stats.breakthroughs > 0 ? '今日已有突破' : '今日尚未突破'}
              </span>
            </div>          </div>        </div>      </div>    </div>
  );
};

export default DailyStatsPanel;
