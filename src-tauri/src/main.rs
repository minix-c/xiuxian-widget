// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use once_cell::sync::Lazy;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Manager, AppHandle, WindowEvent, Emitter
};

#[cfg(target_os = "windows")]
use winreg::enums::*;
#[cfg(target_os = "windows")]
use winreg::RegKey;

mod db;
mod cultivation;

use db::Database;
use cultivation::{CultivationEngine, PlayerState};

// 全局数据库实例
static DB: Lazy<Mutex<Database>> = Lazy::new(|| {
    Mutex::new(Database::new().expect("Failed to initialize database"))
});

// 全局修炼引擎
static ENGINE: Lazy<Mutex<CultivationEngine>> = Lazy::new(|| {
    Mutex::new(CultivationEngine::new())
});

// ==================== Tauri Commands ====================

/// 获取玩家状态
#[tauri::command]
fn get_player_state() -> Result<PlayerState, String> {
    let engine = ENGINE.lock().map_err(|e| e.to_string())?;
    Ok(engine.get_state().clone())
}

/// 设置功法
#[tauri::command]
fn set_technique(technique: String) -> Result<(), String> {
    let mut engine = ENGINE.lock().map_err(|e| e.to_string())?;
    engine.set_technique(&technique)
        .map_err(|e| e.to_string())
}

/// 突破境界
#[tauri::command]
fn breakthrough() -> Result<PlayerState, String> {
    let mut engine = ENGINE.lock().map_err(|e| e.to_string())?;
    engine.breakthrough()
        .map_err(|e| e.to_string())?;
    Ok(engine.get_state().clone())
}

/// 保存游戏
#[tauri::command]
fn save_game() -> Result<(), String> {
    let engine = ENGINE.lock().map_err(|e| e.to_string())?;
    let state = engine.get_state();
    
    let db = DB.lock().map_err(|e| e.to_string())?;
    db.save_player_state(state)
        .map_err(|e| e.to_string())
}

/// 加载游戏
#[tauri::command]
fn load_game() -> Result<PlayerState, String> {
    let db = DB.lock().map_err(|e| e.to_string())?;
    let state = db.load_player_state()
        .map_err(|e| e.to_string())?;
    
    let mut engine = ENGINE.lock().map_err(|e| e.to_string())?;
    engine.load_state(state.clone());
    
    Ok(state)
}

/// 获取每日统计
#[tauri::command]
fn get_daily_stats(limit: Option<i64>) -> Result<Vec<db::DailyStat>, String> {
    let db = DB.lock().map_err(|e| e.to_string())?;
    db.get_daily_stats(limit)
        .map_err(|e| e.to_string())
}

/// 获取历史记录
#[tauri::command]
fn get_history(limit: i64) -> Result<Vec<db::HistoryItem>, String> {
    let db = DB.lock().map_err(|e| e.to_string())?;
    db.get_history(limit)
        .map_err(|e| e.to_string())
}

/// 设置开机自启动（Windows注册表）
#[tauri::command]
fn set_auto_start(enabled: bool) -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        set_windows_auto_start(enabled)
            .map_err(|e| format!("设置开机自启动失败: {}", e))?;
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        // 非Windows系统使用Tauri插件
        return Err("当前系统不支持注册表方式设置自启动".to_string());
    }
    
    Ok(enabled)
}

/// 检查开机自启动状态
#[tauri::command]
fn is_auto_start_enabled() -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        check_windows_auto_start()
            .map_err(|e| format!("检查自启动状态失败: {}", e))
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        Ok(false)
    }
}

/// 隐藏窗口
#[tauri::command]
fn hide_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// 显示窗口
#[tauri::command]
fn show_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// 切换窗口显示/隐藏
#[tauri::command]
fn toggle_window(app: AppHandle) -> Result<bool, String> {
    if let Some(window) = app.get_webview_window("main") {
        let is_visible = window.is_visible().map_err(|e| e.to_string())?;
        if is_visible {
            window.hide().map_err(|e| e.to_string())?;
            Ok(false)
        } else {
            window.show().map_err(|e| e.to_string())?;
            window.set_focus().map_err(|e| e.to_string())?;
            Ok(true)
        }
    } else {
        Err("窗口不存在".to_string())
    }
}

// ==================== Windows Registry Auto Start ====================

#[cfg(target_os = "windows")]
fn set_windows_auto_start(enabled: bool) -> Result<(), Box<dyn std::error::Error>> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let run_key = hkcu.open_subkey_with_flags(
        r"Software\Microsoft\Windows\CurrentVersion\Run",
        KEY_WRITE
    )?;
    
    let app_name = "XiuxianWidget";
    
    if enabled {
        // 获取当前可执行文件路径
        let exe_path = std::env::current_exe()?;
        let exe_path_str = exe_path.to_string_lossy();
        run_key.set_value(app_name, &exe_path_str.to_string())?;
    } else {
        // 删除注册表项
        let _ = run_key.delete_value(app_name);
    }
    
    Ok(())
}

#[cfg(target_os = "windows")]
fn check_windows_auto_start() -> Result<bool, Box<dyn std::error::Error>> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let run_key = hkcu.open_subkey_with_flags(
        r"Software\Microsoft\Windows\CurrentVersion\Run",
        KEY_READ
    )?;
    
    let app_name = "XiuxianWidget";
    let value: Result<String, _> = run_key.get_value(app_name);
    
    Ok(value.is_ok())
}

// ==================== System Tray ====================

/// 设置系统托盘
fn setup_tray(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    // 创建菜单项
    let show_item = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
    let hide_item = MenuItem::with_id(app, "hide", "隐藏窗口", true, None::<&str>)?;
    let separator = MenuItem::with_id(app, "sep", "-", true, None::<&str>)?;
    let autostart_item = MenuItem::with_id(app, "autostart", "开机自启动", true, None::<&str>)?;
    let separator2 = MenuItem::with_id(app, "sep2", "-", true, None::<&str>)?;
    let quit_item = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    
    // 创建菜单
    let menu = Menu::with_items(app, &[
        &show_item,
        &hide_item,
        &separator,
        &autostart_item,
        &separator2,
        &quit_item,
    ])?;
    
    // 获取图标
    let icon = app.default_window_icon()
        .cloned()
        .ok_or("No default icon found")?;
    
    // 创建托盘图标
    let _tray = TrayIconBuilder::new()
        .icon(icon)
        .tooltip("悬浮修仙 - 挂机修炼中")
        .menu(&menu)
        .on_menu_event(|app, event| {
            match event.id().as_ref() {
                "show" => {
                    let _ = show_window(app.clone());
                }
                "hide" => {
                    let _ = hide_window(app.clone());
                }
                "autostart" => {
                    // 切换自启动状态
                    let current = is_auto_start_enabled().unwrap_or(false);
                    let _ = set_auto_start(!current);
                }
                "quit" => {
                    // 退出前保存
                    let _ = save_game();
                    app.exit(0);
                }
                _ => {}
            }
        })
        .on_tray_icon_event(|tray, event| {
            // 左键点击切换窗口显示
            if let TrayIconEvent::Click { button: MouseButton::Left, .. } = event {
                let app = tray.app_handle();
                let _ = toggle_window(app.clone());
            }
        })
        .build(app)?;
    
    Ok(())
}

// ==================== Floating Window Setup ====================

/// 设置悬浮窗口属性
fn setup_floating_window(window: &tauri::WebviewWindow) -> Result<(), Box<dyn std::error::Error>> {
    // 基础窗口设置
    window.set_decorations(false)?;
    window.set_always_on_top(true)?;
    window.set_skip_taskbar(true)?;
    
    // 设置窗口大小
    window.set_size(tauri::Size::Logical(tauri::LogicalSize {
        width: 280.0,
        height: 120.0,
    }))?;
    
    // 设置窗口位置（右下角）
    if let Ok(Some(monitor)) = window.primary_monitor() {
        let size = monitor.size();
        window.set_position(tauri::Position::Logical(tauri::LogicalPosition {
            x: (size.width as f64) - 300.0,
            y: (size.height as f64) - 150.0,
        }))?;
    }
    
    // Windows特定设置（透明背景等）
    // 注意：这需要前端CSS配合设置透明背景
    
    Ok(())
}

// ==================== Main ====================

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--silent"])
        ))
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_player_state,
            set_technique,
            breakthrough,
            save_game,
            load_game,
            get_daily_stats,
            get_history,
            set_auto_start,
            is_auto_start_enabled,
            hide_window,
            show_window,
            toggle_window,
        ])
        .setup(|app| {
            let app_handle = app.handle();
            
            // 初始化数据库
            {
                let db = DB.lock().unwrap();
                if let Err(e) = db.init() {
                    eprintln!("数据库初始化失败: {}", e);
                } else {
                    println!("数据库初始化成功");
                    
                    // 尝试加载存档
                    if let Ok(state) = db.load_player_state() {
                        let mut engine = ENGINE.lock().unwrap();
                        engine.load_state(state);
                        println!("存档加载成功");
                    }
                }
            }
            
            // 设置系统托盘
            if let Err(e) = setup_tray(&app_handle) {
                eprintln!("托盘设置失败: {}", e);
            } else {
                println!("系统托盘设置成功");
            }
            
            // 设置悬浮窗口
            if let Some(window) = app_handle.get_webview_window("main") {
                if let Err(e) = setup_floating_window(&window) {
                    eprintln!("悬浮窗设置失败: {}", e);
                } else {
                    println!("悬浮窗设置成功");
                }
                
                // 处理启动参数（静默启动）
                let args: Vec<String> = std::env::args().collect();
                let should_hide = args.contains(&"--silent".to_string()) 
                    || args.contains(&"--minimized".to_string());
                
                if should_hide {
                    let _ = window.hide();
                }
            }
            
            // 启动定时保存任务
            start_auto_save_task(app_handle.clone());
            
            // 启动修炼计时器
            start_cultivation_timer(app_handle.clone());
            
            println!("悬浮修仙启动成功！");
            Ok(())
        })
        .on_window_event(|window, event| {
            match event {
                WindowEvent::CloseRequested { .. } => {
                    // 关闭时保存游戏
                    let _ = save_game();
                }
                WindowEvent::Focused(focused) => {
                    // 窗口获得/失去焦点时的事件
                    if *focused {
                        // 可以在这里触发UI刷新
                    }
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// 启动自动保存任务（每30秒保存一次）
fn start_auto_save_task(app: AppHandle) {
    std::thread::spawn(move || {
        loop {
            std::thread::sleep(std::time::Duration::from_secs(30));
            
            // 检查应用是否还在运行
            if app.get_webview_window("main").is_some() {
                if let Err(e) = save_game() {
                    eprintln!("自动保存失败: {}", e);
                } else {
                    println!("自动保存成功");
                }
            } else {
                break;
            }
        }
    });
}

/// 启动修炼计时器（每秒更新一次修为）
fn start_cultivation_timer(app: AppHandle) {
    std::thread::spawn(move || {
        loop {
            std::thread::sleep(std::time::Duration::from_secs(1));
            
            // 检查应用是否还在运行
            if let Some(window) = app.get_webview_window("main") {
                // 更新修炼引擎（每秒增加修为）
                {
                    let mut engine = ENGINE.lock().unwrap();
                    engine.tick(1); // 增加1秒的修为
                    
                    // 检查是否可以突破
                    let state = engine.get_state();
                    if state.qi >= state.max_qi {
                        // 可以触发前端显示突破提示
                        let _ = window.emit("can-breakthrough", ());
                    }
                }
                
                // 通知前端更新UI
                let _ = window.emit("tick", ());
            } else {
                break;
            }
        }
    });
}
