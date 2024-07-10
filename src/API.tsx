import { invoke } from '@tauri-apps/api/tauri'

export function readDir(project_path:string): any {
	return invoke('ls_project', {project_dir: project_path })
}

export function readFile(file_path:string): any {
	return invoke('read_file', {file_path: file_path })
}