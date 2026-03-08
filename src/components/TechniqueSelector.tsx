import React from 'react';
import { Technique, TechniqueConfig } from '../types';
import { TECHNIQUES } from '../config';
import { CloseIcon, TechniqueIcon } from './icons';

interface TechniqueSelectorProps {
  currentTechnique: Technique;
  onSelect: (technique: Technique) => void;
  onClose: () => void;
}

// 功法颜色映射
const TECH_COLORS: Record<Technique, string> = {
  balanced: '#9B59B6',
  blood: '#E74C3C',
  sword: '#3498DB',
  turtle: '#2ECC71',
  free: '#F39C12',
};

const TechniqueSelector: React.FC<TechniqueSelectorProps> = ({
  currentTechnique,
  onSelect,
  onClose,
}) => {
  const techniques = Object.values(TECHNIQUES) as TechniqueConfig[];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
         onClick={onClose}>
      <div className="w-[280px] rounded-2xl overflow-hidden backdrop-blur-xl border border-white/20
                    bg-[rgba(20,20,30,0.98)] shadow-2xl animate-pop-in"
           onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <TechniqueIcon size={18} />
            <span className="text-white font-bold text-sm">选择功法</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-90"
          >
            <CloseIcon size={16} className="text-white/60" />
          </button>
        </div>

        {/* 功法列表 */}
        <div className="p-3 max-h-[320px] overflow-y-auto">
          {techniques.map((tech, index) => {
            const techColor = TECH_COLORS[tech.id];
            const isSelected = currentTechnique === tech.id;
            
            return (
              <button
                key={tech.id}
                onClick={() => onSelect(tech.id)}
                className={`w-full text-left p-3 rounded-xl mb-2 transition-all duration-200
                          active:scale-[0.98] animate-slide-in-up group
                          ${isSelected 
                            ? 'bg-white/15 border border-white/30 shadow-lg' 
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  {/* 功法图标 */}
                  <div 
                    className={`w-11 h-11 rounded-full flex items-center justify-center 
                               text-white font-bold text-base transition-all duration-200
                               ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                    style={{
                      background: `linear-gradient(135deg, ${techColor}60, ${techColor})`,
                      boxShadow: isSelected ? `0 0 20px ${techColor}60` : 'none',
                    }}
                  >
                    {tech.name[0]}
                  </div>                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">{tech.name}</span>
                      {isSelected && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 
                                         text-green-400 font-medium">
                          修炼中
                        </span>
                      )}
                    </div>                    
                    <div 
                      className="text-[10px] font-medium mt-0.5"
                      style={{ color: techColor }}
                    >
                      {tech.effect}
                    </div>                    
                    <div className="text-[10px] text-white/40 mt-1 line-clamp-1">
                      {tech.description}
                    </div>
                    
                    {/* 属性加成 */}
                    <div className="flex gap-2 mt-2 text-[9px] text-white/30">
                      <span>灵:{(tech.qiBonus * 100).toFixed(0)}%</span>
                      <span>生:{(tech.hpMod * 100).toFixed(0)}%</span>
                      <span>攻:{(tech.atkMod * 100).toFixed(0)}%</span>
                      <span>防:{(tech.defMod * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* 底部提示 */}
        <div className="px-4 pb-4 text-center">
          <span className="text-[10px] text-white/30">
            功法决定修炼效率与属性成长
          </span>
        </div>
      </div>
    </div>
  );
};

export default TechniqueSelector;
