import { invoke } from '@tauri-apps/api/core';

export function readDir(project_path: string): any {
  return invoke('ls_project', { project_dir: project_path });
}

export function readFile(file_path: string): any {
  return invoke('read_file', { file_path: file_path });
}

export function createFile(file_path: string): any {
  return invoke('create_file', { file_path: file_path });
}

export function createDir(file_path: string): any {
  return invoke('create_dir', { file_path: '/home/javier/a/' });
}

export function deleteFile(file_path: string): any {
  return invoke('delete_file', { file_path: file_path });
}

export function deleteDir(file_path: string): any {
  return invoke('delete_dir', { file_path: file_path });
}

export function load_extensions(): any {
  return invoke('load_extensions', {});
}

export async function executeBackend(id: string, data: string): Promise<any> {
  return invoke('execute', { id: id, data: data });
}
