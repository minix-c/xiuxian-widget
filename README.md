# 修仙悬浮窗 - MVP项目

## 项目结构

```
xiuxian-widget/
├── index.html              # 前端主页面（悬浮窗UI）
├── package.json            # Node.js依赖配置
├── tsconfig.json           # TypeScript配置
├── vite.config.ts          # Vite构建配置
├── src/
│   └── main.ts             # 前端游戏逻辑（修炼系统、数据库交互）
└── src-tauri/
    ├── Cargo.toml          # Rust项目配置
    ├── build.rs            # 构建脚本
    ├── tauri.conf.json     # Tauri应用配置（窗口、托盘、权限）
    ├── capabilities/       # 权限配置
    │   └── default.json
    ├── icons/              # 应用图标
    └── src/
        ├── main.rs         # Rust入口
        └── lib.rs          # 后端逻辑（托盘、数据库初始化、命令）
```

## 已实现功能

### 1. 悬浮窗窗口
- ✅ 置顶显示 (`alwaysOnTop: true`)
- ✅ 透明背景 (`transparent: true`)
- ✅ 无边框 (`decorations: false`)
- ✅ 可拖动 (`data-tauri-drag-region`)
- ✅ 固定尺寸 280x120px

### 2. SQLite存储层
- ✅ 使用 `tauri-plugin-sql` SQLite
- ✅ WAL模式启用（性能优化）
- ✅ 三张数据表：
  - `player_save` - 玩家存档（境界、修为）
  - `daily_stats` - 每日统计
  - `history` - 突破历史

### 3. 系统托盘
- ✅ 左键点击显示/隐藏窗口
- ✅ 右键菜单：显示/隐藏/退出
- ✅ 托盘图标和提示

### 4. 开机自启动
- ✅ `tauri-plugin-autostart` 集成
- ✅ 支持静默启动参数 (`--silent`)

### 5. 核心玩法
- ✅ 自动修炼（每秒+修为）
- ✅ 境界系统（炼气→渡劫）
- ✅ 长按突破（3秒蓄力）
- ✅ 实时UI更新（进度条、在线时间）

## 启动命令

```bash
# 开发模式
npm install
cargo tauri dev

# 构建发行版
cargo tauri build
```

## 技术栈

- **前端**: TypeScript + Vanilla JS + Vite
- **后端**: Rust + Tauri v2
- **数据库**: SQLite (WAL模式)
- **窗口**: Tauri原生窗口API

## 窗口特性

| 特性 | 配置 |
|------|------|
| 尺寸 | 280 x 120 px |
| 置顶 | 始终置顶 |
| 透明 | 支持（亚克力背景） |
| 边框 | 无原生边框 |
| 任务栏 | 显示 |
| 调整大小 | 禁止 |

## 数据库Schema

```sql
-- 玩家存档
CREATE TABLE player_save (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  realm INTEGER DEFAULT 0,           -- 境界
  level INTEGER DEFAULT 1,           -- 层数
  exp INTEGER DEFAULT 0,             -- 修为
  total_cultivation INTEGER DEFAULT 0,
  updated_at INTEGER
);

-- 每日统计
CREATE TABLE daily_stats (
  date TEXT PRIMARY KEY,
  cultivation_amount INTEGER DEFAULT 0,
  online_seconds INTEGER DEFAULT 0,
  breakthrough_count INTEGER DEFAULT 0
);

-- 历史记录
CREATE TABLE history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT,
  content TEXT,
  created_at INTEGER
);
```

## 下一步开发建议

1. **境界显化** - 窗口外观随境界变色
2. **机缘气泡** - 随机微事件（每15-30分钟）
3. **时辰修炼** - 特定时段修炼加成
4. **道痕留声** - 突破留言系统
