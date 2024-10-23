// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::{fs, io};

mod extensions;
use extensions::HareExtension;
mod file_system;
use file_system::hare_read_file;
use tauri::Manager;
// use std::io;

#[derive(Clone, serde::Serialize)]
struct FileStructure {
    context_value: String,
    file_name: String,
    url: String,
}

fn _list_dir(path: PathBuf) -> Result<Vec<FileStructure>, io::Error> {
    let mut vec = Vec::new();

    if !path.is_dir() {
        return Ok(vec);
    }

    for path_result in fs::read_dir(&path)? {
        let path_result = path_result?;
        let full_path = path_result.path();
        let relative_path: String = full_path
            .strip_prefix(path.clone())
            .ok()
            .unwrap()
            .to_str()
            .unwrap()
            .into();
        let context_val: String = if full_path.is_dir() {
            "folder".into()
        } else {
            "file".into()
        };

        vec.push(FileStructure {
            context_value: context_val,
            file_name: relative_path,
            url: full_path.to_str().unwrap().into(),
        });
    }
    Ok(vec)
}

#[tauri::command(rename_all = "snake_case")]
fn ls_project(project_dir: String) -> Result<Vec<FileStructure>, String> {
    let mut path = PathBuf::new();
    path.push(project_dir);
    let mut vec = _list_dir(path).ok().unwrap();
    vec.sort_by_key(|item| (item.context_value == "file", item.file_name.clone()));
    Ok(vec)
}

#[tauri::command(rename_all = "snake_case")]
fn read_file(file_path: String) -> Result<String, String> {
    return hare_read_file(file_path);
}

#[tauri::command(rename_all = "snake_case")]
fn create_file(file_path: String) -> Result<(), String> {
    let _ = fs::File::create(file_path).unwrap();
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn create_dir(file_path: String) -> Result<(), String> {
    let _ = fs::create_dir(file_path).unwrap();
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn delete_file(file_path: String) -> Result<(), String> {
    let _ = fs::remove_file(file_path).unwrap();
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn delete_dir(file_path: String) -> Result<(), String> {
    let _ = fs::remove_dir_all(file_path).unwrap();
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn load_extensions() -> Result<Vec<HareExtension>, String> {
    let mut vec: Vec<HareExtension> = Vec::new();
    // println!("{}", PathResolver::home_dir(PathResolver));
    vec.push(HareExtension::new(
        "/home/javier/.hare/extensions/hare.explorer/".into(),
    ));
    vec.push(HareExtension::new(
        "/home/javier/.hare/extensions/hare.basic-icon-pack/".into(),
    ));
    Ok(vec)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            ls_project,
            read_file,
            create_file,
            create_dir,
            delete_file,
            delete_dir,
            load_extensions
        ])  
        .setup(|app| {
            // TODO: Here load all the paths
            println!("{}",app.path().home_dir().unwrap().to_string_lossy());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
