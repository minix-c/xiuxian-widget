use rusqlite::{Connection, Result, params};
use std::path::PathBuf;
use crate::cultivation::PlayerState;

/// 每日统计数据
#[derive(Debug, serde::Serialize)]
pub struct DailyStat {
    pub date: String,
    pub online_seconds: i64,
    pub qi_gained: f64,
    pub breakthroughs: i32,
}

/// 历史记录项
#[derive(Debug, serde::Serialize)]
pub struct HistoryItem {
    pub id: i64,
    pub r#type: String,
    pub content: String,
    pub created_at: i64,
}

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new() -> Result<Self> {
        let db_path = Self::get_db_path()?;
        let conn = Connection::open(db_path)?;
        Ok(Database { conn })
    }
    
    fn get_db_path() -> Result<PathBuf> {
        let mut path = dirs::data_dir()
            .ok_or_else(|| rusqlite::Error::InvalidPath(PathBuf::from("data_dir not found")))?;
        path.push("xiuxian-widget");
        std::fs::create_dir_all(&path)
            .map_err(|e| rusqlite::Error::InvalidPath(PathBuf::from(format!("Failed to create dir: {}", e))))?;
        path.push("save.db");
        Ok(path)
    }
    
    pub fn init(&self) -> Result<()> {
        // 创建玩家存档表
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS player_save (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                realm TEXT NOT NULL DEFAULT 'lianqi-early',
                qi REAL NOT NULL DEFAULT 0,
                max_qi REAL NOT NULL DEFAULT 1800,
                technique TEXT NOT NULL DEFAULT 'balanced',
                qi_rate REAL NOT NULL DEFAULT 1.0,
                online_seconds INTEGER DEFAULT 0,
                today_seconds INTEGER DEFAULT 0,
                streak_days INTEGER DEFAULT 1,
                last_online TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;
        
        // 创建每日统计表
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS daily_stats (
                date TEXT PRIMARY KEY,
                online_seconds INTEGER DEFAULT 0,
                qi_gained REAL DEFAULT 0,
                breakthroughs INTEGER DEFAULT 0
            )",
            [],
        )?;
        
        // 创建编年史/历史记录表
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS chronicle (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_type TEXT NOT NULL,
                event_data TEXT NOT NULL,
                created_at INTEGER DEFAULT (unixepoch())
            )",
            [],
        )?;
        
        // 创建修炼统计表
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS cultivation_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                technique TEXT NOT NULL,
                qi_amount REAL NOT NULL,
                duration_seconds INTEGER NOT NULL,
                timestamp INTEGER DEFAULT (unixepoch())
            )",
            [],
        )?;
        
        // 启用WAL模式提升性能
        self.conn.execute("PRAGMA journal_mode = WAL;", [])?;
        self.conn.execute("PRAGMA synchronous = NORMAL;", [])?;
        self.conn.execute("PRAGMA temp_store = MEMORY;", [])?;
        self.conn.execute("PRAGMA mmap_size = 30000000000;", [])?;
        
        // 初始化默认玩家数据
        self.conn.execute(
            "INSERT OR IGNORE INTO player_save (id, realm, qi, max_qi, technique, qi_rate, last_online)
             VALUES (1, 'lianqi-early', 0, 1800, 'balanced', 1.0, datetime('now'))",
            [],
        )?;
        
        Ok(())
    }
    
    /// 保存玩家状态
    pub fn save_player_state(&self, state: &PlayerState) -> Result<()> {
        let now = chrono::Local::now().to_rfc3339();
        let today = chrono::Local::now().format("%Y-%m-%d").to_string();
        
        self.conn.execute(
            "INSERT OR REPLACE INTO player_save 
             (id, realm, qi, max_qi, technique, qi_rate, online_seconds, today_seconds, streak_days, last_online, updated_at)
             VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
            params![
                state.realm,
                state.qi,
                state.max_qi,
                state.technique,
                state.qi_rate,
                state.online_seconds as i64,
                state.today_seconds as i64,
                state.streak_days as i64,
                now,
                now,
            ],
        )?;
        
        // 更新每日统计
        self.conn.execute(
            "INSERT INTO daily_stats (date, online_seconds, qi_gained, breakthroughs)
             VALUES (?1, ?2, ?3, ?4)
             ON CONFLICT(date) DO UPDATE SET
                online_seconds = excluded.online_seconds,
                qi_gained = excluded.qi_gained,
                breakthroughs = excluded.breakthroughs",
            params![
                today,
                state.daily_stats.online_seconds as i64,
                state.daily_stats.qi_gained,
                state.daily_stats.breakthroughs as i64,
            ],
        )?;
        
        Ok(())
    }
    
    /// 加载玩家状态
    pub fn load_player_state(&self) -> Result<PlayerState> {
        let mut stmt = self.conn.prepare(
            "SELECT realm, qi, max_qi, technique, qi_rate, online_seconds, today_seconds, streak_days 
             FROM player_save WHERE id = 1"
        )?;
        
        let state = stmt.query_row([], |row| {
            Ok(PlayerState {
                realm: row.get(0)?,
                qi: row.get(1)?,
                max_qi: row.get(2)?,
                technique: row.get(3)?,
                qi_rate: row.get(4)?,
                online_seconds: row.get::<_, i64>(5)? as u64,
                today_seconds: row.get::<_, i64>(6)? as u64,
                streak_days: row.get::<_, i64>(7)? as u32,
                daily_stats: crate::cultivation::DailyStats {
                    date: chrono::Local::now().format("%Y-%m-%d").to_string(),
                    online_seconds: 0,
                    qi_gained: 0.0,
                    breakthroughs: 0,
                },
            })
        })?;
        
        Ok(state)
    }
    
    /// 获取每日统计列表
    pub fn get_daily_stats(&self, limit: Option<i64>) -> Result<Vec<DailyStat>> {
        let limit = limit.unwrap_or(30);
        
        let mut stmt = self.conn.prepare(
            "SELECT date, online_seconds, qi_gained, breakthroughs 
             FROM daily_stats 
             ORDER BY date DESC 
             LIMIT ?"
        )?;
        
        let stats = stmt.query_map([limit], |row| {
            Ok(DailyStat {
                date: row.get(0)?,
                online_seconds: row.get(1)?,
                qi_gained: row.get(2)?,
                breakthroughs: row.get(3)?,
            })
        })?;
        
        stats.collect()
    }
    
    /// 获取历史记录
    pub fn get_history(&self, limit: i64) -> Result<Vec<HistoryItem>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, event_type, event_data, created_at 
             FROM chronicle 
             ORDER BY created_at DESC 
             LIMIT ?"
        )?;
        
        let items = stmt.query_map([limit], |row| {
            Ok(HistoryItem {
                id: row.get(0)?,
                r#type: row.get(1)?,
                content: row.get(2)?,
                created_at: row.get(3)?,
            })
        })?;
        
        items.collect()
    }
    
    /// 添加历史记录
    #[allow(dead_code)]
    pub fn add_history(&self, event_type: &str, event_data: &str) -> Result<()> {
        self.conn.execute(
            "INSERT INTO chronicle (event_type, event_data) VALUES (?1, ?2)",
            params![event_type, event_data],
        )?;
        Ok(())
    }
    
    /// 更新在线时间
    #[allow(dead_code)]
    pub fn update_online_time(&self, seconds: u64) -> Result<()> {
        let today = chrono::Local::now().format("%Y-%m-%d").to_string();
        
        self.conn.execute(
            "UPDATE player_save SET online_seconds = online_seconds + ?1, today_seconds = today_seconds + ?1 WHERE id = 1",
            params![seconds as i64],
        )?;
        
        self.conn.execute(
            "INSERT INTO daily_stats (date, online_seconds) VALUES (?1, ?2)
             ON CONFLICT(date) DO UPDATE SET online_seconds = online_seconds + excluded.online_seconds",
            params![today, seconds as i64],
        )?;
        
        Ok(())
    }
    
    /// 获取总修炼时长
    #[allow(dead_code)]
    pub fn get_total_online_seconds(&self) -> Result<u64> {
        let count: i64 = self.conn.query_row(
            "SELECT COALESCE(SUM(online_seconds), 0) FROM daily_stats",
            [],
            |row| row.get(0),
        )?;
        Ok(count as u64)
    }
    
    /// 备份数据库
    #[allow(dead_code)]
    pub fn backup(&self) -> Result<PathBuf> {
        let backup_path = Self::get_db_path()?.with_extension("db.backup");
        let _ = self.conn.execute(
            "VACUUM INTO ?1",
            params![backup_path.to_string_lossy()],
        )?;
        Ok(backup_path)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_database_init() {
        let db = Database::new().unwrap();
        assert!(db.init().is_ok());
    }
}
