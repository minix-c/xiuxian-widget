// 类型定义 - MVP: 练气→筑基→金丹 (9阶段)

export type Realm = 
  | 'lianqi-early' | 'lianqi-middle' | 'lianqi-late'
  | 'zhuji-early' | 'zhuji-middle' | 'zhuji-late'
  | 'jindan-early' | 'jindan-middle' | 'jindan-late';

export type Technique = 'balanced' | 'blood' | 'sword' | 'turtle' | 'free';

export interface RealmConfig {
  id: Realm;
  name: string;
  color: string;
  maxQi: number;
  minutesRequired: number;
  description?: string;
}

export interface TechniqueConfig {
  id: Technique;
  name: string;
  effect: string;
  description: string;
  qiBonus: number;
  hpMod: number;
  atkMod: number;
  defMod: number;
}

export interface DailyStats {
  date: string;
  onlineSeconds: number;
  qiGained: number;
  breakthroughs: number;
}

export interface PlayerState {
  realm: Realm;
  qi: number;
  maxQi: number;
  technique: Technique;
  qiRate: number;
  onlineSeconds: number;
  todaySeconds: number;
  streakDays: number;
  dailyStats: DailyStats;
}

export const REALM_ORDER: Realm[] = [
  'lianqi-early', 'lianqi-middle', 'lianqi-late',
  'zhuji-early', 'zhuji-middle', 'zhuji-late',
  'jindan-early', 'jindan-middle', 'jindan-late',
];

export const REALM_NAMES: Record<Realm, string> = {
  'lianqi-early': '炼气期·初期',
  'lianqi-middle': '炼气期·中期',
  'lianqi-late': '炼气期·后期',
  'zhuji-early': '筑基期·初期',
  'zhuji-middle': '筑基期·中期',
  'zhuji-late': '筑基期·后期',
  'jindan-early': '金丹期·初期',
  'jindan-middle': '金丹期·中期',
  'jindan-late': '金丹期·后期',
};

export const TECHNIQUE_NAMES: Record<Technique, string> = {
  'balanced': '均衡之道',
  'blood': '血炼大法',
  'sword': '剑修心法',
  'turtle': '龟息术',
  'free': '逍遥游',
};
