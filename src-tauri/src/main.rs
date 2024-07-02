// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{path::{Path, PathBuf}};
use std::fs;
use std::io;

#[derive(Clone, serde::Serialize)]
struct FileStructure {
  is_dir: bool,
  file_name: String,
  file_path: String,
  files: Vec<FileStructure>,
}

fn _list_files(vec: &mut Vec<FileStructure>, path: PathBuf, orig_path: PathBuf) -> std::io::Result<()>  {
    if path.is_dir() {
        let paths = std::fs::read_dir(&path)?;
        let mut newvec: Vec<FileStructure> = Vec::new();
        for path_result in paths {
            let full_path = path_result?.path();
            // println!("{:?}", full_path.strip_prefix(orig_path.clone()));
            let _ = _list_files(&mut newvec, full_path, path.clone());
        }
        vec.push(FileStructure {is_dir: true, file_name: path.strip_prefix(orig_path.clone()).ok().unwrap().to_str().unwrap().into(), file_path: path.to_str().unwrap().into(), files:newvec});
    } else {
        let newvec: Vec<FileStructure> = Vec::new();
        vec.push( FileStructure {is_dir: false, file_name: path.strip_prefix(orig_path.clone()).ok().unwrap().to_str().unwrap().into(), file_path: path.to_str().unwrap().into(), files: newvec});
    }
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn ls_project(project_dir: String) -> Result<Vec<FileStructure>, String> {
  // This will return an error
  // std::fs::File::open("path/that/does/not/exist").map_err(|err| err.to_string())?;

  // let binding = homedir::get_my_home().unwrap().unwrap();
  // let home_dir: &Path = project_dir.as_path();

  let mut vec = Vec::new();
  let mut path = PathBuf::new();
  path.push(project_dir);
  let _ = _list_files(&mut vec, path.clone(), path.clone());
  Ok(vec)
}

#[tauri::command(rename_all = "snake_case")]
fn read_file(file_path: String) -> Result<String, String> {
    match fs::metadata(file_path.clone()) {
        Ok(metadata) => {
            if metadata.is_file() {
                let file_contents = fs::read_to_string(file_path).unwrap();
                return Ok(file_contents);
            } else {
                println!("Path exists, but it's not a file.");
                return Err("Path exists, but it's not a file.".into());
                // Handle the case where the path exists but is not a file
            }
        }
        Err(_) => {
            println!("File does not exist.");
            return Err("File does not exist.".into());
            // Handle the case where the file does not exist
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ls_project, read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
