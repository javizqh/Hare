import { invoke } from '@tauri-apps/api/tauri'

export function readDir(project_path:string): any {
	return invoke('ls_project', {project_dir: project_path })
}

export function readFile(file_path:string): any {
	return invoke('read_file', {file_path: file_path })
}

export function createFile(file_path:string): any {
	return invoke('create_file', {file_path: file_path })
}

export function createDir(file_path:string): any {
	return invoke('create_dir', {file_path: "/home/javier/a/" })
}

export function deleteFile(file_path:string): any {
	return invoke('delete_file', {file_path: file_path })
}

export function deleteDir(file_path:string): any {
	return invoke('delete_dir', {file_path: file_path })
}

export function load_extensions(): any {
	return invoke('load_extensions', {})
}

export function renameFile(old_path:string, new_path:string): any {
}

export function renameDir(old_path:string, new_path:string): any {
}

export function saveFile(file_path:string, contents:string): any {
}
