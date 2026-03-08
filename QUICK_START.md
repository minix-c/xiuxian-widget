# 悬浮修仙 - 快速开始指南

## 功能清单 ✅

| 功能 | 状态 | 说明 |
|------|------|------|
| 窗口拖动 | ✅ 完成 | 顶部30px区域可拖动 |
| 系统托盘 | ✅ 完成 | 右键菜单：显示/隐藏/自启动/退出 |
| 开机自启动 | ✅ 完成 | Windows注册表实现 |
| 数据持久化 | ✅ 完成 | SQLite本地存储 |

---

## 代码变更汇总

### 1. Cargo.toml - 添加依赖
```toml
[dependencies]
tauri = { version = "2", features = ["tray-icon"] }
tauri-plugin-shell = "2"
tauri-plugin-autostart = "2"
tauri-plugin-fs = "2"
dirs = "5.0"
winreg = "0.52"
```

### 2. tauri.conf.json - Tauri v2配置
- 添加 `trayIcon` 配置
- 添加 `security.capabilities` 权限配置
- 更新 `windows` 窗口配置

### 3. main.rs - 核心实现
- 整合所有Tauri命令
- 实现系统托盘 (`setup_tray`)
- 实现Windows自启动 (`set_windows_auto_start`)
- 实现悬浮窗设置 (`setup_floating_window`)
- 实现定时任务 (自动保存、修炼计时)

### 4. db.rs - 数据库模块
- 完善表结构定义
- 添加 `DailyStat` 和 `HistoryItem` 结构体
- 实现 `get_daily_stats` 和 `get_history` 方法
- 优化数据库性能 (WAL模式)

### 5. cultivation.rs - 修炼引擎
- 添加 `tick()` 方法用于每秒更新
- 扩展境界到渡劫期
- 完善功法效果

### 6. main.ts - 前端对接
- 使用 `@tauri-apps/api/core` 调用后端命令
- 监听 `tick` 和 `can-breakthrough` 事件
- 实现自动保存和UI更新

---

## 使用说明

### 窗口拖动
- 鼠标按住窗口顶部区域拖动
- 窗口会自动吸附到屏幕边缘

### 系统托盘
- **左键点击**：显示/隐藏窗口
- **右键点击**：打开菜单
  - 显示窗口
  - 隐藏窗口  
  - ─────────
  - 开机自启动 (✓/○)
  - ─────────
  - 退出

### 数据存储
- 存档位置：`%APPDATA%/xiuxian-widget/save.db`
- 自动保存：每30秒
- 退出时自动保存

### 修炼系统
- 每秒自动增加修为
- 修为满后长按窗口3秒突破
- 突破后进入下一境界

---

## 目录结构

```
xiuxian-widget/
├── src-tauri/
│   ├── Cargo.toml              # Rust依赖
│   ├── tauri.conf.json         # Tauri配置
│   ├── build.rs
│   └── src/
│       ├── main.rs             # 主入口
│       ├── db.rs               # 数据库
│       └── cultivation.rs      # 修炼引擎
├── src/
│   ├── main.ts                 # 前端主逻辑
│   └── types/
│       └── index.ts            # 类型定义
├── index.html                  # 前端HTML
├── package.json
├── BACKEND_IMPLEMENTATION.md   # 详细实现文档
└── QUICK_START.md              # 本文件
```

---

## 运行命令

```bash
# 开发模式
npm run tauri dev

# 构建生产包
npm run tauri build

# 仅构建前端
npm run build
```

---

## 技术栈

- **框架**: Tauri v2
- **后端**: Rust
- **数据库**: SQLite (rusqlite)
- **前端**: TypeScript + Vite
- **UI**: 原生HTML/CSS

---

## API文档

见 `BACKEND_IMPLEMENTATION.md` 中的 API命令列表 章节。

---

**状态**: 所有需求已实现，代码已准备就绪 ✅
