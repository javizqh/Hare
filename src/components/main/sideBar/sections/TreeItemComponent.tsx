import { useState, useEffect, useRef, memo } from 'react';
import { readFile } from '../../../../API2.tsx';
import { TreeItemState, TreeViewProvider, TreeItem, ProviderResult, TreeItemSelectedState } from '@hare-ide/hare';
import { Procurator } from '../../../../helpers/Procurator.ts';

const procurator = Procurator.getInstance();

const TreeItemComponent = memo(({id, viewProvider, item, depth} : {id:string, viewProvider:TreeViewProvider<any>, item: any, depth:number}) => {
  //TODO: icon themes and move

  const componentRef = useRef(null);
  const ref = useRef(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [children, setChildren] = useState<any>(null);
  const [hasChildren, setHasChildren] = useState<any>(null);
  const [style, setStyle] = useState<any>(null);
  const [node, setNode] = useState<TreeItem |null>(null);
  const [dropActive, setDropActive] = useState<boolean>(false);

  const folderStyle = {
    position: "sticky",
    top: depth*22+"px",
    zIndex: 1000-depth,
    backgroundColor: "var(--sideBar-background)",
  };

  const padding = [];

  for (let i = 0; i < depth; i++) {
    padding.push(<div className="sideBar-file-tree-indent"/>);
  }

  useEffect(() => {
    Promise.resolve(viewProvider.getTreeItem(item)).then((newNode:TreeItem) => {
      setNode(newNode);
    })
  }, [])

  useEffect(() => {
    if (!node) {
      return
    }

    var state = node.collapsibleState;
    var raw_state = window.localStorage.getItem(id + "/" + node.id);
    setHasChildren(state !== TreeItemState.None)

    if (raw_state) {
      state = JSON.parse(raw_state);
    }
    setOpen(state === TreeItemState.Expanded);

    if (ref.current) {
      //TODO: icon packs
      // console.log(typeof node.iconPath === "string")
      if (typeof node.iconPath === 'string') {
        // console.log(node.iconPath)
        readFile(node.iconPath).then((content:string) => {
          // @ts-ignore
          ref.current.innerHTML = content;
        })
      }
    }
  }, [node]);

  const handleClick = (e:MouseEvent) => {
    if (!node) {
      return
    }

    if (node.id && selectRef.current) {
      procurator.context.select(node.id, selectRef.current, e)
    }

    if (hasChildren) {
      if (!isOpen) {
        node.collapsibleState = TreeItemState.Expanded
      } else {
        node.collapsibleState = TreeItemState.Collapsed
      }
      window.localStorage.setItem(id + "/" + node.id, String(node.collapsibleState));
      setOpen(node.collapsibleState === TreeItemState.Expanded);
    }

    if (node.command) {
      procurator.commands.executeCommand(node.command, node)
      if (e.button == 1) {
        procurator.commands.executeCommand(node.command, node)
      }
    }
    
  }

  useEffect(() => {
    if (isOpen) {
      Promise.resolve(viewProvider.getChildren(item))!.then((content:ProviderResult<any>) => {
        setChildren(content)
      })
      setStyle(folderStyle)
    } else {
      setStyle(null)
    }
  }, [isOpen]);

  //TODO: this should be reducing its size for each folder

  function allowDrop(ev:any) {
    if (componentRef.current) {
      // componentRef.current.c("drop-active", true);
      console.log(ev)
      setDropActive(true)
      ev.preventDefault();
    }
  }

  function onDragStart(event:any) {
      event.dataTransfer.setData('text/html', null); //cannot be empty string
      event.dataTransfer.dropEffect = "move";
  }

  const onFocus = () => {
    if (node && node.contextValue) {
      procurator.context.viewItem = node.contextValue;
    }
  }

  const onLostFocus = () => {
    procurator.context.viewItem = "";
  }

  return (
    <>
    {node &&
      <div className="sideBar-entry-content"
        key={node.label}
        ref={componentRef}
        onDragOver={(e) => allowDrop(e)}
        onDragLeave={() => setDropActive(false)}
        onDrop={() => setDropActive(false)}
        drop-active={dropActive.toString()}
      >
        <div id={node.id}
          ref={selectRef}
          className={"sideBar-file-tree"}
          onClick={(e:any) => {handleClick(e)}}
          onAuxClick={(e:any) => {handleClick(e)}}
          tabIndex={1}
          style={style}
          draggable="true"
          onDragStart={(e) => onDragStart(e)}
          onFocus={() => onFocus()}
          onBlur={() => onLostFocus()}
        >
          {padding}
          <ArrowIndicator hasChild={hasChildren} open={isOpen}/>
          <div ref={ref} className="sideBar-file-tree-icon" aria-hidden="true" />
          <label title={node.tooltip}>
            {node.label}
          </label>
          {node.description &&
            <label className='description'>
              {node.description}
            </label>
          }
        </div>
        {isOpen && children &&
          <>
            {children!.map((entry:any) => {
              return (
                <TreeItemComponent
                  id={id}
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
});

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

export default TreeItemComponent;