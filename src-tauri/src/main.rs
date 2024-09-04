// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;

mod extensions;
use extensions::HareExtension;
mod file_system;
use file_system::hare_read_file;
// use std::io;

#[derive(Clone, serde::Serialize)]
struct FileStructure {
    is_dir: bool,
    open: bool,
    file_name: String,
    file_path: String,
    files: Vec<bool>,
}

// fn _list_files(vec: &mut Vec<FileStructure>, path: PathBuf, orig_path: PathBuf) -> std::io::Result<()>  {
//     if path.is_dir() {
//         let paths = std::fs::read_dir(&path)?;
//         let mut newvec: Vec<FileStructure> = Vec::new();
//         for path_result in paths {
//             let full_path = path_result?.path();
//             // println!("{:?}", full_path.strip_prefix(orig_path.clone()));
//             let _ = _list_files(&mut newvec, full_path, path.clone());
//         }
//         vec.push(FileStructure {is_dir: true, file_name: path.strip_prefix(orig_path.clone()).ok().unwrap().to_str().unwrap().into(), file_path: path.to_str().unwrap().into(), files:newvec});
//     } else {
//         let newvec: Vec<FileStructure> = Vec::new();
//         vec.push( FileStructure {is_dir: false, file_name: path.strip_prefix(orig_path.clone()).ok().unwrap().to_str().unwrap().into(), file_path: path.to_str().unwrap().into(), files: newvec});
//     }
//     Ok(())
// }

fn _list_dir(
    vec: &mut Vec<FileStructure>,
    path: PathBuf,
    orig_path: PathBuf,
) -> std::io::Result<()> {
    if path.is_dir() {
        let paths = std::fs::read_dir(&path)?;
        for path_result in paths {
            let full_path = path_result?.path();
            let newvec: Vec<bool> = Vec::new();
            if full_path.is_dir() {
                let relative_path: String = full_path
                    .strip_prefix(orig_path.clone())
                    .ok()
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .into();
                if relative_path != ".git" {
                    vec.push(FileStructure {
                        is_dir: true,
                        open: false,
                        file_name: full_path
                            .strip_prefix(orig_path.clone())
                            .ok()
                            .unwrap()
                            .to_str()
                            .unwrap()
                            .into(),
                        file_path: full_path.to_str().unwrap().into(),
                        files: newvec,
                    });
                }
            } else {
                vec.push(FileStructure {
                    is_dir: false,
                    open: false,
                    file_name: full_path
                        .strip_prefix(orig_path.clone())
                        .ok()
                        .unwrap()
                        .to_str()
                        .unwrap()
                        .into(),
                    file_path: full_path.to_str().unwrap().into(),
                    files: newvec,
                });
            }
        }
    }
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn ls_project(project_dir: String) -> Result<Vec<FileStructure>, String> {
    let mut vec = Vec::new();
    let mut path = PathBuf::new();
    path.push(project_dir);
    let _ = _list_dir(&mut vec, path.clone(), path.clone());
    vec.sort_by_key(|item| (!item.is_dir, item.file_name.clone()));
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
    vec.push(HareExtension::new("/home/javier/Code/Tauri/hare/Hare/src/extensions/hare.file-explorer".into()));
    Ok(vec)
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            ls_project,
            read_file,
            create_file,
            create_dir,
            delete_file,
            delete_dir,
            load_extensions
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
