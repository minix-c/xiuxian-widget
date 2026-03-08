import { RealmConfig, TechniqueConfig, Realm, Technique } from '../types';

// 境界配置 - MVP: 练气→筑基→金丹 (9阶段)
export const REALM_CONFIGS: Record<Realm, RealmConfig> = {
  // 练气期
  'lianqi-early': {
    id: 'lianqi-early',
    name: '练气·前期',
    color: '#00D4AA',
    maxQi: 1800,      // 30分钟 × 60秒 × 1灵气/秒
    minutesRequired: 30,
    description: '初入仙途，引气入体',
  },
  'lianqi-middle': {
    id: 'lianqi-middle',
    name: '练气·中期',
    color: '#00D4AA',
    maxQi: 3600,      // 45分钟 × 60秒 × 1.33灵气/秒
    minutesRequired: 45,
    description: '气息绵长，渐入佳境',
  },
  'lianqi-late': {
    id: 'lianqi-late',
    name: '练气·后期',
    color: '#00D4AA',
    maxQi: 6000,      // 60分钟 × 60秒 × 1.67灵气/秒
    minutesRequired: 60,
    description: '气贯全身，圆满在即',
  },
  // 筑基期
  'zhuji-early': {
    id: 'zhuji-early',
    name: '筑基·前期',
    color: '#4A90E2',
    maxQi: 14400,     // 120分钟 × 60秒 × 2灵气/秒
    minutesRequired: 120,
    description: '根基初筑，大道有望',
  },
  'zhuji-middle': {
    id: 'zhuji-middle',
    name: '筑基·中期',
    color: '#4A90E2',
    maxQi: 27000,     // 180分钟 × 60秒 × 2.5灵气/秒
    minutesRequired: 180,
    description: '道基稳固，修为渐深',
  },
  'zhuji-late': {
    id: 'zhuji-late',
    name: '筑基·后期',
    color: '#4A90E2',
    maxQi: 43200,     // 240分钟 × 60秒 × 3灵气/秒
    minutesRequired: 240,
    description: '筑基圆满，金丹可期',
  },
  // 金丹期
  'jindan-early': {
    id: 'jindan-early',
    name: '金丹·前期',
    color: '#FDCB6E',
    maxQi: 86400,     // 360分钟 × 60秒 × 4灵气/秒
    minutesRequired: 360,
    description: '金丹初成，寿元大增',
  },
  'jindan-middle': {
    id: 'jindan-middle',
    name: '金丹·中期',
    color: '#FDCB6E',
    maxQi: 162000,    // 540分钟 × 60秒 × 5灵气/秒
    minutesRequired: 540,
    description: '丹火纯青，神通初显',
  },
  'jindan-late': {
    id: 'jindan-late',
    name: '金丹·后期',
    color: '#FDCB6E',
    maxQi: 288000,    // 720分钟 × 60秒 × 6.67灵气/秒
    minutesRequired: 720,
    description: '金丹圆满，元婴将成',
  },
};

// 功法配置
export const TECHNIQUES: Record<Technique, TechniqueConfig> = {
  balanced: {
    id: 'balanced',
    name: '九转玄功',
    effect: '均衡发展',
    description: '道门正统，稳扎稳打，无明显短板',
    qiBonus: 1.0,
    hpMod: 1.0,
    atkMod: 1.0,
    defMod: 1.0,
  },
  blood: {
    id: 'blood',
    name: '血神经',
    effect: '生命+50%',
    description: '魔道秘传，以血养躯，愈战愈勇',
    qiBonus: 1.0,
    hpMod: 1.5,
    atkMod: 0.8,
    defMod: 1.0,
  },
  sword: {
    id: 'sword',
    name: '剑典',
    effect: '攻击+40%',
    description: '剑修至高典籍，极致输出，宁折不弯',
    qiBonus: 1.0,
    hpMod: 0.85,
    atkMod: 1.4,
    defMod: 0.95,
  },
  turtle: {
    id: 'turtle',
    name: '玄龟诀',
    effect: '防御+60%',
    description: '妖族传承，龟息养生，以守为攻',
    qiBonus: 1.0,
    hpMod: 1.0,
    atkMod: 0.9,
    defMod: 1.6,
  },
  free: {
    id: 'free',
    name: '逍遥游',
    effect: '灵气+80%',
    description: '散修心法，顺应自然，事半功倍',
    qiBonus: 1.8,
    hpMod: 0.95,
    atkMod: 0.95,
    defMod: 0.95,
  },
};

// 基础灵气产出
export const BASE_QI_RATE = 1; // 1灵气/秒
