import React, { useState, useEffect, useRef } from 'react';
import {hare} from "../../../../hare.d.ts";

const TreeItem = ({viewProvider, item, depth} : {viewProvider:hare.TreeViewProvider<any>, item: any, depth:number}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenInEditor, setOpenInEditor] = useState<boolean>(false);
  const node = viewProvider.getTreeItem(item);

  console.log(item)

  const handleClick = () => {
    // if (node.is_dir) {
    //   node.open = !isOpen;
      setOpen(!isOpen);
    //   console.log(tree)
    // } else {
    //   console.log('Open: ' + node.file_path)
    //   EditorAPI.openNewFile(EditorAPI.createFileInfo(node.file_path, node.file_name, 'monaco'));
    // }
  }

  // useEffect(() => {
  //   setOpen(node.open);
  // }, []);


  useEffect(() => {
    // if (isOpen) {
    //   if (node.files.length === 0) {
    //     HARE.readDir(node.file_path).then((message:any) => {
    //         setSubFiles(message);
    //         node.files = message;
    //     })
    //     .catch((error:any) => {
    //         console.error(error);
    //     });
    //   } else {
    //     setSubFiles(node.files);
    //   }
    // }
  }, [isOpen]);

  const handleKeyDown = (e:any) => {
    console.log(e)
    // switch (e.keyCode) {
    //   case 46:
    //     // Delete
    //     deleteAndRefresh();
    //     break;
    //   case 113:
    //     // F2
    //     renameFileAndRefresh();
    //     break;
    //   default:
    //     break;
    // }
  }

  return (
    <div className="sideBar-entry-content" key={node.label} title={node.label}>
      <div className={(isOpenInEditor) ? "sideBar-file-tree sideBar-file-tree-open" : "sideBar-file-tree"} onClick={() => {handleClick()}} tabIndex={1} onKeyDown={(e:any) => handleKeyDown(e)}>
        <div className="sideBar-file-tree-indent" style={{paddingLeft: depth*8 + 'px'}}/>
        { isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="sideBar-file-tree-arrow" viewBox="0 0 24 24">
            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="sideBar-file-tree-arrow" viewBox="0 0 24 24">
            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
          </svg>
        )}
        <label>
          {node.label}
        </label>
      </div>
      {isOpen && viewProvider.getChildren(item) &&
        <>
          {viewProvider.getChildren(item)!.map((entry:any) => {
            return (
              <TreeItem
                viewProvider={viewProvider}
                item={entry}
                depth={depth + 1}
              />
            )})
          }
        </>
      }
    </div>
  );
};

export default TreeItem;