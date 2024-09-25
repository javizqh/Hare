import React, { useState, useEffect, useRef } from 'react';

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

const FileTree = ({HARE, node, depth, EditorAPI, tree} : {HARE:any, node:any, depth:number, EditorAPI:any, tree:any}) => {
  const [subFiles, setSubFiles] = useState<any|FileStructure>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenInEditor, setOpenInEditor] = useState<boolean>(false);

  const handleClick = () => {
    if (node.is_dir) {
      node.open = !isOpen;
      setOpen(!isOpen);
      console.log(tree)
    } else {
      console.log('Open: ' + node.file_path)
      EditorAPI.openNewFile(EditorAPI.createFileInfo(node.file_path, node.file_name, 'monaco'));
    }
  }

  useEffect(() => {
    setOpen(node.open);
  }, []);

  useEffect(() => {
    let match = EditorAPI.openFiles.find((element:any) => {
      return element.path === node.file_path;
    })
    if (match) {
      setOpenInEditor(match.current);
    } else {
      setOpenInEditor(false);
    }
  }, [EditorAPI.openFiles]);


  useEffect(() => {
    if (isOpen) {
      if (node.files.length === 0) {
        HARE.readDir(node.file_path).then((message:any) => {
            setSubFiles(message);
            node.files = message;
        })
        .catch((error:any) => {
            console.error(error);
        });
      } else {
        setSubFiles(node.files);
      }
    }
  }, [isOpen]);

  const deleteAndRefresh = () => {
    if (node.is_dir) {
      HARE.deleteDir(node.file_path);
    } else {
      HARE.deleteFile(node.file_path);
    }
    // TODO: refresh parent folder
  }

  const renameFileAndRefresh = () => {
    // renameFile(node.file_path);
    // TODO: refresh parent folder
  }

  const handleKeyDown = (e:any) => {
    console.log(e)
    switch (e.keyCode) {
      case 46:
        // Delete
        deleteAndRefresh();
        break;
      case 113:
        // F2
        renameFileAndRefresh();
        break;
      default:
        break;
    }
  }

  return (
    <div className="sideBar-entry-content" key={node.file_path} title={node.file_path}>
      <div className={(isOpenInEditor) ? "sideBar-file-tree sideBar-file-tree-open" : "sideBar-file-tree"} onClick={() => {handleClick()}} tabIndex={1} onKeyDown={(e:any) => handleKeyDown(e)}>
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
      { (subFiles !== null && isOpen) &&
      Object.entries(subFiles).map((project) => {
        return (
          <FileTree HARE={HARE} node={project[1]} depth={depth+1} EditorAPI={EditorAPI} tree={tree}/>
        );
      })}
    </div>
  );
};

export default FileTree;
export type {FileStructure, TreeSaveStructure};
