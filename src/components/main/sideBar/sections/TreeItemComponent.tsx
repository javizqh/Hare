import { useState, useEffect, useRef, memo, useContext } from 'react';
import { readFile } from '../../../../API2.tsx';
import { TreeItemState, TreeViewProvider, TreeItem, ProviderResult, TreeItemSelectedState } from '@hare-ide/hare';
import { Procurator } from '../../../../helpers/Procurator.ts';
import { ContextMenuContext } from '../../contextMenu/contextMenuContext.tsx';
import MenuBarTree from './MenuBarTree.tsx';
import { Context } from '../../../../helpers/functions/when.ts';

const procurator = Procurator.getInstance();

const TreeItemComponent = memo(({id, viewProvider, item, depth, context} : {id:string, viewProvider:TreeViewProvider<any>, item: any, depth:number, context:Context}) => {
  //TODO: move

  const componentRef = useRef(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [children, setChildren] = useState<any>(null);
  const [hasChildren, setHasChildren] = useState<any>(null);
  const [style, setStyle] = useState<any>(null);
  const [node, setNode] = useState<TreeItem |null>(null);
  const [dropActive, setDropActive] = useState<boolean>(false);
  const contextMenu = useContext(ContextMenuContext);

  const folderStyle = {
    position: "sticky",
    top: depth*22+"px",
    zIndex: 1000-depth,
    backgroundColor: "var(--sideBar-background)",
  };

  const padding = [];

  for (let i = 0; i < depth; i++) {
    padding.push(<div className="tree-indent"/>);
  }

  useEffect(() => {
    Promise.resolve(viewProvider.getTreeItem(item)).then((newNode:TreeItem) => {
      setNode(newNode);
      if (newNode.contextValue) {
        context["viewItem"] = newNode.contextValue;
      }
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
      node.collapsibleState = state;
    }
    setOpen(state === TreeItemState.Expanded);

    loadIcon();
  }, [node]);

  const loadIcon = () => {
    if (!node) {
      return
    }

    if (ref.current) {
      //TODO: icon packs
      //TODO: if no icon pack and default do not load from file
      let iconSVG;

      if (!node.iconPath) {
        iconSVG = procurator.window.substituteIcon("", (node.contextValue) ? node.contextValue : "", node.label, node.collapsibleState)
      } else {
        if (typeof node.iconPath === 'string') {
          iconSVG = procurator.window.substituteIcon(node.iconPath, (node.contextValue) ? node.contextValue : "", node.label, node.collapsibleState);
        } else {
          iconSVG = node.iconPath.dark //TODO: do this properly using when
        }
      }

      if (typeof iconSVG === 'string') {
        readFile(iconSVG).then((content:string) => {
          // @ts-ignore
          ref.current.innerHTML = content;
        })
      } else {
        ref.current.childNodes.forEach(element => {
          ref.current!.removeChild(element);
        });
        ref.current.appendChild(iconSVG)
      }
    }
  }

  const handleClick = (e:MouseEvent) => {
    if (e.button == 2) {
      return;
    }

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
      loadIcon();
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


  function allowDrop(ev:any) {
    //TODO: this should be reducing its size for each folder
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

  const onContextMenu = (e:MouseEvent) => {
    if (node && node.contextValue) {
      context["viewItem"] = node.contextValue

      contextMenu.setMenuId("view/item/context");
      contextMenu.setContext(context);
      contextMenu.setPos(e.clientX, e.clientY);
      contextMenu.open(true);
    }
    e.preventDefault();
  }

  return (
    <>
    {node &&
      <div className="view-content"
        key={node.label}
        ref={componentRef}
        onDragOver={(e) => allowDrop(e)}
        onDragLeave={() => setDropActive(false)}
        onDrop={() => setDropActive(false)}
        drop-active={dropActive.toString()}
      >
        <div id={node.id}
          ref={selectRef}
          className={"tree-entry"}
          onClick={(e:any) => {handleClick(e)}}
          onAuxClick={(e:any) => {handleClick(e)}}
          tabIndex={1}
          style={style}
          draggable="true"
          onDragStart={(e) => onDragStart(e)}
          onContextMenu={(e:any) => onContextMenu(e)}
        >
          {padding}
          <ArrowIndicator hasChild={hasChildren} open={isOpen}/>
          <div ref={ref} className="icon" aria-hidden="true"/>
          <label title={node.tooltip}>
            {node.label}
          </label>
          {node.description &&
            <label className='description'>
              {node.description}
            </label>
          }
          <MenuBarTree menuId={"view/item/context"} context={context}/>
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
                  context={{view: context.view}}
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
    return <div className="collapse-indicator"/>
  }

  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="collapse-indicator" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
      </svg>
    )
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="collapse-indicator" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
      </svg>
    )
  }
}

export default TreeItemComponent;