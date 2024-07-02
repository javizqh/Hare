import React, { useState, useEffect, useRef } from 'react';
import {readFile} from "../../../API";

const FileTree = ({node, depth, setFile} : {node:any, depth:number, setFile:any}) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    if (node.is_dir) {
      setOpen(!isOpen);
    } else {
      console.log('Open: ' + node.file_path)
      setFile(node.file_path);
    }
  }

  return (
    <div className="sideBar-content" key={node.file_path}>
      <div className="sideBar-file-tree" onClick={() => {handleClick()}}>
        <div className="sideBar-file-tree-indent" style={{paddingLeft: depth*8 + 'px'}}/>
        { node.is_dir ? (
        <>
          { isOpen ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="sideBar-file-tree-arrow" viewBox="0 0 24 24">
              <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ff9100" className="sideBar-file-tree-icon" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 .087.586l2.977-7.937A1 1 0 0 1 6 10h12V9a2 2 0 0 0-2-2h-4.532l-1.9-2.28A2 2 0 0 0 8.032 4H4Zm2.693 8H6.5l-3 8H18l3-8H6.693Z" clip-rule="evenodd"/>
            </svg>
          </>
          ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="sideBar-file-tree-arrow" viewBox="0 0 24 24">
              <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ff9100" className="sideBar-file-tree-icon" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M3 6a2 2 0 0 1 2-2h5.532a2 2 0 0 1 1.536.72l1.9 2.28H3V6Zm0 3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Z" clip-rule="evenodd"/>
            </svg>
          </>
          )
          }
        </>
          ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" className="sideBar-file-tree-arrow" viewBox="0 0 16 16">
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" className="bi bi-file-earmark-code-fill" viewBox="0 0 16 16">
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.646 7.646a.5.5 0 1 1 .708.708L5.707 10l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708zm2.708 0 2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 10 8.646 8.354a.5.5 0 1 1 .708-.708"/>
          </svg>  
        </>
          )
        }
        <label>
          {node.file_name}
        </label>
      </div>
      { (node.files !== undefined && isOpen) &&
      Object.entries(node.files).map((project) => {
        return (
          <FileTree node={project[1]} depth={depth+1} setFile={setFile}/>
        );
      })}
    </div>
  );
};

export default FileTree;
