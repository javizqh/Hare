import React, { useState, useEffect, useRef } from 'react';
import {readDir} from "../../../API";
import FileTree from "./FileTree";
import TitleBar from "./sections/TitleBar";
import CollapsableSection from "./sections/CollapsableSection";

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

const SideBar = ({currentMenu, dragPosX, openFileInEditor, editorFileTabs} : {currentMenu:any ,dragPosX:number, openFileInEditor:any, editorFileTabs:any}) => {

    const [tree, setTree] = useState<any|TreeSaveStructure>(null);

    useEffect(() => {
			if (currentMenu) {
        if (currentMenu.id === 'fileExplorer') {
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
			}
    }, [currentMenu]);

    useEffect(() => {
        savedTree = tree;
    }, [tree]);

		if (currentMenu) {
    return (
			<div id="sideBar" className="sideBar" style={{width: dragPosX - 48}}>
				<TitleBar title={currentMenu.name}/>
				<div className="sideBar-content">
					<CollapsableSection title={"Hare"} menu={"a"}>
						{ currentMenu.id === 'fileExplorer' && tree &&
						Object.entries(tree.entry).map((project) => {
							return (
								<FileTree node={project[1]} depth={0} openFileInEditor={openFileInEditor} editorFileTabs={editorFileTabs} tree={savedTree}/>
							)
						})}
					</CollapsableSection>
				</div>
			</div>
    );
		}
};

export default SideBar;
