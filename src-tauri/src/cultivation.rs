#![allow(dead_code)]

use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayerState {
    pub realm: String,
    pub qi: f64,
    pub max_qi: f64,
    pub technique: String,
    pub qi_rate: f64,
    pub online_seconds: u64,
    pub today_seconds: u64,
    pub streak_days: u32,
    pub daily_stats: DailyStats,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DailyStats {
    pub date: String,
    pub online_seconds: u64,
    pub qi_gained: f64,
    pub breakthroughs: u32,
}

pub struct CultivationEngine {
    state: PlayerState,
}

impl CultivationEngine {
    pub fn new() -> Self {
        let today = chrono::Local::now().format("%Y-%m-%d").to_string();
        CultivationEngine {
            state: PlayerState {
                realm: "lianqi-early".to_string(),
                qi: 0.0,
                max_qi: 1800.0,
                technique: "balanced".to_string(),
                qi_rate: 1.0,
                online_seconds: 0,
                today_seconds: 0,
                streak_days: 1,
                daily_stats: DailyStats {
                    date: today,
                    online_seconds: 0,
                    qi_gained: 0.0,
                    breakthroughs: 0,
                },
            },
        }
    }
    
    pub fn get_state(&self) -> &PlayerState {
        &self.state
    }
    
    pub fn load_state(&mut self, state: PlayerState) {
        self.state = state;
        self.recalculate_max_qi();
        self.recalculate_qi_rate();
    }
    
    /// 每秒定时更新（核心挂机逻辑）
    pub fn tick(&mut self, seconds: u64) {
        // 增加在线时长
        self.state.online_seconds += seconds;
        self.state.today_seconds += seconds;
        self.state.daily_stats.online_seconds += seconds;
        
        // 增加修为（每秒增加qi_rate点）
        let qi_gain = self.state.qi_rate * seconds as f64;
        self.state.qi += qi_gain;
        self.state.daily_stats.qi_gained += qi_gain;
        
        // 检查是否达到上限
        if self.state.qi > self.state.max_qi {
            self.state.qi = self.state.max_qi;
        }
    }
    
    /// 设置功法
    pub fn set_technique(&mut self, technique: &str) -> Result<(), String> {
        let valid_techniques = ["balanced", "blood", "sword", "turtle", "free"];
        if !valid_techniques.contains(&technique) {
            return Err(format!("Invalid technique: {}. Valid options: {:?}", technique, valid_techniques));
        }
        self.state.technique = technique.to_string();
        self.recalculate_qi_rate();
        Ok(())
    }
    
    /// 突破境界
    pub fn breakthrough(&mut self) -> Result<(), String> {
        if self.state.qi < self.state.max_qi {
            return Err(format!("修为不足，当前: {:.0}/{:.0}", self.state.qi, self.state.max_qi));
        }
        
        // 境界顺序
        let realms = vec![
            "lianqi-early", "lianqi-middle", "lianqi-late",
            "zhuji-early", "zhuji-middle", "zhuji-late",
            "jindan-early", "jindan-middle", "jindan-late",
            "yuanying-early", "yuanying-middle", "yuanying-late",
            "huashen-early", "huashen-middle", "huashen-late",
            "lianxu-early", "lianxu-middle", "lianxu-late",
            "heti-early", "heti-middle", "heti-late",
            "dacheng-early", "dacheng-middle", "dacheng-late",
            "dujie"
        ];
        
        if let Some(current_idx) = realms.iter().position(|r| r == &self.state.realm) {
            if current_idx + 1 < realms.len() {
                self.state.realm = realms[current_idx + 1].to_string();
                self.state.qi = 0.0;
                self.recalculate_max_qi();
                self.recalculate_qi_rate();
                self.state.daily_stats.breakthroughs += 1;
                Ok(())
            } else {
                Err("已达到最高境界".to_string())
            }
        } else {
            Err("Invalid realm".to_string())
        }
    }
    
    /// 获取境界中文名称
    pub fn get_realm_name(realm: &str) -> String {
        let names = [
            ("lianqi-early", "炼气期·初期"),
            ("lianqi-middle", "炼气期·中期"),
            ("lianqi-late", "炼气期·后期"),
            ("zhuji-early", "筑基期·初期"),
            ("zhuji-middle", "筑基期·中期"),
            ("zhuji-late", "筑基期·后期"),
            ("jindan-early", "金丹期·初期"),
            ("jindan-middle", "金丹期·中期"),
            ("jindan-late", "金丹期·后期"),
            ("yuanying-early", "元婴期·初期"),
            ("yuanying-middle", "元婴期·中期"),
            ("yuanying-late", "元婴期·后期"),
            ("huashen-early", "化神期·初期"),
            ("huashen-middle", "化神期·中期"),
            ("huashen-late", "化神期·后期"),
            ("lianxu-early", "炼虚期·初期"),
            ("lianxu-middle", "炼虚期·中期"),
            ("lianxu-late", "炼虚期·后期"),
            ("heti-early", "合体期·初期"),
            ("heti-middle", "合体期·中期"),
            ("heti-late", "合体期·后期"),
            ("dacheng-early", "大乘期·初期"),
            ("dacheng-middle", "大乘期·中期"),
            ("dacheng-late", "大乘期·后期"),
            ("dujie", "渡劫期"),
        ];
        
        names.iter()
            .find(|(k, _)| k == &realm)
            .map(|(_, v)| v.to_string())
            .unwrap_or_else(|| realm.to_string())
    }
    
    /// 获取功法中文名称
    pub fn get_technique_name(technique: &str) -> String {
        match technique {
            "balanced" => "均衡之道".to_string(),
            "blood" => "血炼大法".to_string(),
            "sword" => "剑修心法".to_string(),
            "turtle" => "龟息术".to_string(),
            "free" => "逍遥游".to_string(),
            _ => technique.to_string(),
        }
    }
    
    /// 计算最大灵气（根据境界）
    fn recalculate_max_qi(&mut self) {
        self.state.max_qi = match self.state.realm.as_str() {
            "lianqi-early" => 1800.0,
            "lianqi-middle" => 3600.0,
            "lianqi-late" => 6000.0,
            "zhuji-early" => 14400.0,
            "zhuji-middle" => 27000.0,
            "zhuji-late" => 43200.0,
            "jindan-early" => 86400.0,
            "jindan-middle" => 162000.0,
            "jindan-late" => 288000.0,
            "yuanying-early" => 576000.0,
            "yuanying-middle" => 1080000.0,
            "yuanying-late" => 1920000.0,
            "huashen-early" => 3840000.0,
            "huashen-middle" => 7200000.0,
            "huashen-late" => 12800000.0,
            "lianxu-early" => 25600000.0,
            "lianxu-middle" => 48000000.0,
            "lianxu-late" => 85000000.0,
            "heti-early" => 170000000.0,
            "heti-middle" => 320000000.0,
            "heti-late" => 560000000.0,
            "dacheng-early" => 1120000000.0,
            "dacheng-middle" => 2100000000.0,
            "dacheng-late" => 3800000000.0,
            "dujie" => 10000000000.0,
            _ => 1800.0,
        };
    }
    
    /// 计算灵气产出速率（修为/秒）
    fn recalculate_qi_rate(&mut self) {
        let base_rate = 1.0;
        
        // 功法加成
        let tech_bonus = match self.state.technique.as_str() {
            "balanced" => 1.0,   // 均衡之道：无加成，但突破时额外收益
            "blood" => 1.3,      // 血炼大法：+30%速度
            "sword" => 1.2,      // 剑修心法：+20%速度
            "turtle" => 0.7,     // 龟息术：-30%速度，但突破成功率加成（暂不实现）
            "free" => 1.8,       // 逍遥游：+80%速度
            _ => 1.0,
        };
        
        // 境界加成（每境界+10%）
        let realms = vec![
            "lianqi-early", "lianqi-middle", "lianqi-late",
            "zhuji-early", "zhuji-middle", "zhuji-late",
            "jindan-early", "jindan-middle", "jindan-late",
            "yuanying-early", "yuanying-middle", "yuanying-late",
            "huashen-early", "huashen-middle", "huashen-late",
            "lianxu-early", "lianxu-middle", "lianxu-late",
            "heti-early", "heti-middle", "heti-late",
            "dacheng-early", "dacheng-middle", "dacheng-late",
            "dujie"
        ];
        let realm_idx = realms.iter().position(|r| r == &self.state.realm).unwrap_or(0);
        let realm_bonus = 1.0 + (realm_idx as f64 * 0.1);
        
        self.state.qi_rate = base_rate * tech_bonus * realm_bonus;
    }
    
    /// 获取突破进度百分比
    pub fn get_breakthrough_progress(&self) -> f64 {
        (self.state.qi / self.state.max_qi * 100.0).min(100.0)
    }
    
    /// 检查是否可以突破
    pub fn can_breakthrough(&self) -> bool {
        self.state.qi >= self.state.max_qi
    }
    
    /// 获取格式化后的在线时长
    pub fn format_online_time(seconds: u64) -> String {
        let hours = seconds / 3600;
        let minutes = (seconds % 3600) / 60;
        let secs = seconds % 60;
        
        if hours > 0 {
            format!("{:02}:{:02}:{:02}", hours, minutes, secs)
        } else {
            format!("{:02}:{:02}", minutes, secs)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_cultivation_tick() {
        let mut engine = CultivationEngine::new();
        let initial_qi = engine.state.qi;
        
        engine.tick(1);
        assert!(engine.state.qi > initial_qi);
        assert_eq!(engine.state.online_seconds, 1);
    }
    
    #[test]
    fn test_breakthrough() {
        let mut engine = CultivationEngine::new();
        engine.state.qi = engine.state.max_qi; // 充满修为
        
        let old_realm = engine.state.realm.clone();
        assert!(engine.breakthrough().is_ok());
        assert_ne!(engine.state.realm, old_realm);
    }
}
