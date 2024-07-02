import { invoke } from '@tauri-apps/api/tauri'

export function readDir(): any {
  let returnData;
	return invoke('ls_project', {project_dir: '/home/javier/Code/Tauri/hare/Hare/src' })
  // console.log(returnData);
  // return returnData;
}

export function readFile(file_path:string): any {
	return invoke('read_file', {file_path: file_path })
  // console.log(returnData);
  // return returnData;
}