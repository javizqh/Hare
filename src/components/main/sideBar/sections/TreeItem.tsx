import React, { useState, useEffect, useRef } from 'react';
import {hare} from "../../../../hare.d.ts";
import { readFile } from '../../../../API2.tsx';

const TreeItem = ({viewProvider, item, depth} : {viewProvider:hare.TreeViewProvider<any>, item: any, depth:number}) => {
  const ref = React.useRef(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenInEditor, setOpenInEditor] = useState<boolean>(false);
  const [children, setChildren] = useState<any>(null);
  const [hasChildren, setHasChildren] = useState<any>(null);
  const [style, setStyle] = useState<any>(null);
  const [node, setNode] = useState<hare.TreeItem |null>(null);

  const folderStyle = {
    position: "sticky",
    top: depth*22+"px",
    zIndex: 1000-depth,
  };

  const padding = [];

  for (let i = 0; i < depth; i++) {
    padding.push(<div className="sideBar-file-tree-indent"/>);
  }

  useEffect(() => {
    viewProvider.getTreeItem(item).then((newNode:hare.TreeItem) => {
      setNode(newNode);
    })
  }, [])

  useEffect(() => {
    if (node) {
      var state = node.collapsibleState;
      var raw_state = window.localStorage.getItem(node.id);
      setHasChildren(state !== hare.TreeItemState.None)
      if (raw_state) {
        state = JSON.parse(raw_state);
      }
      setOpen(state === hare.TreeItemState.Expanded);
    }
    if (ref.current) {
      readFile(node.iconPath).then((content:string) => {
        // @ts-ignore
        ref.current.innerHTML = content;
      })
    }
  }, [node]);

  const handleClick = () => {
    if (hasChildren) {
      if (!isOpen) {
        node.collapsibleState = hare.TreeItemState.Expanded
      } else {
        node.collapsibleState = hare.TreeItemState.Collapsed
      }
      window.localStorage.setItem(node.id, node.collapsibleState);
      setOpen(node.collapsibleState === hare.TreeItemState.Expanded);
    }
    node.command();
    // if (node.is_dir) {
    //   node.open = !isOpen;
    //   console.log(tree)
    // } else {
    //   console.log('Open: ' + node.file_path)
    //   EditorAPI.openNewFile(EditorAPI.createFileInfo(node.file_path, node.file_name, 'monaco'));
    // }
  }

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
    if (isOpen) {
      viewProvider.getChildren(item).then((content:hare.ProviderResult<any>) => {
        setChildren(content)
      })
      setStyle(folderStyle)
    } else {
      setStyle(null)
    }
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
    <>
    {node &&
      <div className="sideBar-entry-content" key={node.label} title={node.label}>
        <div id={node.id} className={(isOpenInEditor) ? "sideBar-file-tree sideBar-file-tree-open" : "sideBar-file-tree"} onClick={() => {handleClick()}} tabIndex={1} onKeyDown={(e:any) => handleKeyDown(e)} style={style}>
          {padding}
          <ArrowIndicator hasChild={hasChildren} open={isOpen}/>
          <div ref={ref} className="sideBar-file-tree-icon" aria-hidden="true" />
          <label>
            {node.label}
          </label>
        </div>
        {isOpen && children &&
          <>
            {children!.map((entry:any) => {
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
    }
    </>
  );
};

const ArrowIndicator = ({hasChild, open}: {hasChild:boolean, open:boolean}) => {

  if (!hasChild) {
    return <div className="sideBar-file-tree-arrow"/>
  }

  if (open) {
    return (          
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="sideBar-file-tree-arrow" viewBox="0 0 24 24">
        <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
      </svg>
    )
  } else {
    return (          
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="sideBar-file-tree-arrow" viewBox="0 0 24 24">
        <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
      </svg>
    )
  }
}

export default TreeItem;