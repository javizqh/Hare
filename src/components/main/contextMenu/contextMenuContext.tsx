import { createContext, useCallback, useEffect, useState } from 'react';
import { Context } from '../../../helpers/functions/when';

interface ContextMenu {
  isOpen: boolean,
  open: Function,
  pos: {x:number,y:number, height:string, width:string},
  setPos: Function,
  menuId?: string,
  setMenuId: Function,
  context?: Context,
  setContext: Function
}

const ContextMenuContext = createContext<ContextMenu>({
  isOpen: false,
  open: () => {},
  pos: {x:0,y:0, height:"top", width:"left"},
  setPos: () => {},
  setMenuId: () => {},
  setContext: () => {},
});

const ContextMenuProvider = ({ children } : {children:any}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [pos, setPos] = useState<{x:number,y:number, height:string, width:string}>({
    x: 0,
    y: 0,
    height:"top",
    width:"left"
  });
  const [menuId, setMenuId] = useState<string | undefined>(undefined);
  const [context, setContext] = useState<Context | undefined>(undefined);

  const changePos = (x:number,y:number) => {
    let height = "top";
    let width = "left"

    if (y > window.innerHeight / 2) {
      // Start menu at the bottom
      y = window.innerHeight - y;
      height = "bottom";
    }

    if (x > window.innerWidth / 2) {
      // Start menu at the bottom
      width = "right"
    }

    setPos({x: x, y: y, height: height, width: width});
  }

 return (
    <ContextMenuContext.Provider value={{
      isOpen: open,
      open: setOpen,
      pos: pos,
      setPos: changePos,
      menuId: menuId,
      setMenuId: setMenuId,
      context: context,
      setContext: setContext,
    }}>
      {children}
    </ContextMenuContext.Provider>
 );
};

export { ContextMenuContext, ContextMenuProvider };