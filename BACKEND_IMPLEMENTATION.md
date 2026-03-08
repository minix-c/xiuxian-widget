# 悬浮修仙 - 后端实现文档

## 已实现功能

### 1. 窗口拖动功能 ✅

**实现方式：**
- 前端HTML使用 `data-tauri-drag-region` 属性标记可拖动区域
- Tauri v2 原生支持通过 `core:window:allow-start-dragging` 权限实现拖动
- 无需额外的Rust代码，Tauri自动处理

**前端代码：**
```html
<div class="drag-region" data-tauri-drag-region></div>
```

**Tauri配置：**
```json
"permissions": [
  "core:window:allow-start-dragging"
]
```

---

### 2. 系统托盘 ✅

**实现文件：** `src-tauri/src/main.rs`

**功能：**
- 右键菜单：显示窗口 / 隐藏窗口 / 分隔线 / 开机自启动 / 退出
- 左键点击托盘图标切换窗口显示/隐藏
- 图标提示："悬浮修仙 - 挂机修炼中"

**代码位置：**
```rust
fn setup_tray(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>>
```

**菜单项：**
- 显示窗口 - 显示主窗口并获取焦点
- 隐藏窗口 - 隐藏主窗口
- 开机自启动 - 切换自启动状态
- 退出 - 保存游戏并退出应用

---

### 3. 开机自启动（Windows注册表）✅

**实现方式：** 直接操作Windows注册表

**注册表路径：**
```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
```

**注册表项：**
- 名称：`XiuxianWidget`
- 值：应用程序可执行文件完整路径

**相关命令：**
```rust
// 设置自启动
#[tauri::command]
fn set_auto_start(enabled: bool) -> Result<bool, String>

// 检查自启动状态
#[tauri::command]
fn is_auto_start_enabled() -> Result<bool, String>
```

**依赖：**
```toml
winreg = "0.52"
```

---

### 4. 数据持久化（SQLite）✅

**实现文件：** `src-tauri/src/db.rs`

**数据库路径：**
```
%APPDATA%/xiuxian-widget/save.db
```

**数据表：**

#### player_save - 玩家存档表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PRIMARY KEY | 固定为1 |
| realm | TEXT | 当前境界 |
| qi | REAL | 当前修为 |
| max_qi | REAL | 修为上限 |
| technique | TEXT | 当前功法 |
| qi_rate | REAL | 修为产出速率 |
| online_seconds | INTEGER | 累计在线时长 |
| today_seconds | INTEGER | 今日在线时长 |
| streak_days | INTEGER | 连续签到天数 |
| last_online | TEXT | 最后在线时间 |

#### daily_stats - 每日统计表
| 字段 | 类型 | 说明 |
|------|------|------|
| date | TEXT PRIMARY KEY | 日期 |
| online_seconds | INTEGER | 在线时长 |
| qi_gained | REAL | 修为获取量 |
| breakthroughs | INTEGER | 突破次数 |

#### chronicle - 编年史/历史记录表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PRIMARY KEY | 自增ID |
| event_type | TEXT | 事件类型 |
| event_data | TEXT | 事件数据 |
| created_at | INTEGER | 创建时间戳 |

**性能优化：**
- WAL模式 (Write-Ahead Logging)
- 内存临时存储
- 内存映射文件

---

## 架构设计

### 文件结构
```
src-tauri/
├── Cargo.toml          # 项目依赖配置
├── build.rs            # 构建脚本
├── tauri.conf.json     # Tauri v2 配置文件
└── src/
    ├── main.rs         # 主入口（整合所有功能）
    ├── db.rs           # SQLite数据库模块
    └── cultivation.rs  # 修炼引擎核心逻辑
```

### 核心模块

#### 1. main.rs
- Tauri应用构建和配置
- 系统托盘设置
- Windows注册表自启动
- 定时任务（自动保存、修炼计时器）
- Tauri命令定义

#### 2. db.rs
- 数据库连接管理
- 表结构定义和初始化
- CRUD操作
- 数据备份功能

#### 3. cultivation.rs
- 修炼引擎核心逻辑
- 境界系统
- 功法系统
- 修为计算

### 全局状态
```rust
// 全局数据库实例
static DB: Lazy<Mutex<Database>>

// 全局修炼引擎
static ENGINE: Lazy<Mutex<CultivationEngine>>
```

---

## API命令列表

| 命令 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| get_player_state | - | PlayerState | 获取玩家状态 |
| set_technique | technique: String | () | 设置功法 |
| breakthrough | - | PlayerState | 突破境界 |
| save_game | - | () | 保存游戏 |
| load_game | - | PlayerState | 加载游戏 |
| get_daily_stats | - | Vec<DailyStat> | 获取每日统计 |
| get_history | limit: i64 | Vec<HistoryItem> | 获取历史记录 |
| set_auto_start | enabled: bool | bool | 设置自启动 |
| is_auto_start_enabled | - | bool | 检查自启动状态 |
| hide_window | - | () | 隐藏窗口 |
| show_window | - | () | 显示窗口 |
| toggle_window | - | bool | 切换窗口显示状态 |

---

## 前端事件

| 事件名 | 说明 |
|--------|------|
| tick | 每秒触发，通知前端更新UI |
| can-breakthrough | 修为满时可触发突破 |

---

## 依赖项

### Rust依赖 (Cargo.toml)
```toml
[dependencies]
tauri = { version = "2", features = ["tray-icon"] }
tauri-plugin-shell = "2"
tauri-plugin-autostart = "2"
tauri-plugin-fs = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
rusqlite = { version = "0.31", features = ["bundled", "chrono"] }
chrono = { version = "0.4", features = ["serde"] }
once_cell = "1.19"
dirs = "5.0"
winreg = "0.52"
```

### 前端依赖 (package.json)
```json
{
  "@tauri-apps/api": "^2.10.1",
  "@tauri-apps/cli": "^2.0.0-beta"
}
```

---

## 构建说明

### 开发环境运行
```bash
# 1. 安装依赖
npm install

# 2. 运行开发服务器
npm run tauri dev
```

### 生产构建
```bash
# 构建Windows安装包
npm run tauri build
```

---

## 注意事项

1. **窗口拖动**：通过 `data-tauri-drag-region` 实现，已在HTML中标记顶部30px区域为可拖动

2. **系统托盘**：Tauri v2使用 `trayIcon` 配置和 `TrayIconBuilder` API

3. **自启动**：Windows下使用注册表实现，非Windows系统暂不支持

4. **数据存储**：SQLite数据库自动创建在用户数据目录，应用启动时自动初始化

5. **自动保存**：每30秒自动保存一次游戏进度

6. **修炼计时**：后台线程每秒更新修为，通过事件通知前端

---

## 已知问题

暂无已知问题。

---

## 后续优化建议

1. 添加更多境界和功法
2. 实现离线修炼收益计算
3. 添加成就系统
4. 实现数据云同步
5. 添加音效和特效
6. 实现战斗系统
