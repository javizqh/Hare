import React, { useState, useEffect, useRef } from 'react';
import {readDir} from "../../../API";
import FileTree from "./FileTree";

interface FileStructure {
is_dir: boolean;
file_name: string;
file_path: string;
open: boolean;
files: FileStructure[];
}

interface TreeSaveStructure {
    entry: FileStructure[];
}

let savedTree:TreeSaveStructure|null = null;

const SideBar = ({currentMenu, dragPosX, openFileInEditor, editorFileTabs} : {currentMenu:string ,dragPosX:number, openFileInEditor:any, editorFileTabs:any}) => {

    const [tree, setTree] = useState<any|TreeSaveStructure>(null);

    useEffect(() => {
        if (currentMenu === 'fileExplorer') {
            console.log(tree)
            if (tree === null) {
                if (savedTree) {
                    setTree(savedTree);
                    return;
                }
                readDir('/home/javier/Code/Tauri/hare/Hare').then((message:any) => {
                    let newTree:TreeSaveStructure = {entry: message};
                    setTree(newTree);
                })
                .catch((error:any) => {
                    console.error(error);
                });
            }
        }
    }, [currentMenu]);

    useEffect(() => {
        savedTree = tree;
    }, [tree]);

    return (
        <div id="sideBar" className="sideBar" style={{display: 'block', width: dragPosX - 48}}>
            <div className="sideBar-title">{currentMenu}</div>
            { currentMenu === 'fileExplorer' && tree &&
            Object.entries(tree.entry).map((project) => {
                return (
                    <FileTree node={project[1]} depth={0} openFileInEditor={openFileInEditor} editorFileTabs={editorFileTabs} tree={savedTree}/>
                )
            })}
        </div>
    );
};

export default SideBar;
