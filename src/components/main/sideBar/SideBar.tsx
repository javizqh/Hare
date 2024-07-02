import React, { useState, useEffect, useRef } from 'react';
import {readDir} from "../../../API";
import FileTree from "./FileTree";

interface FileStructure {
input: boolean;
file_name: string;
file_path: string;
files: [];
}

const SideBar = ({currentMenu, dragPosX, setFile} : {currentMenu:string ,dragPosX:number, setFile:any}) => {

    const [files, setFiles] = useState<any|FileStructure>();

    useEffect(() => {
        readDir().then((message:any) => {
			setFiles(message);
        })
        .catch((error:any) => {
            console.error(error);
        });
    }, [currentMenu]);

    return (
        <div id="sideBar" className="sideBar" style={{display: 'block', width: dragPosX - 48}}>
            <div className="sideBar-title">{currentMenu}</div>
            { currentMenu === 'fileExplorer' && files !== undefined &&
            Object.entries(files[0]!.files).map((project) => {
                console.log(project[1].is_dir)
                return (
                    <FileTree node={project[1]} depth={0} setFile={setFile}/>
                )
            })}
        </div>
    );
};

export default SideBar;
