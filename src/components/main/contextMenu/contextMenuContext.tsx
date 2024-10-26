import { createContext, useState } from 'react';
import { Context } from '../../../helpers/Procurator';

interface ContextMenu {
  isOpen: boolean,
  open: Function,
  pos: {x:number,y:number},
  setPos: Function,
  menuId?: string,
  setMenuId: Function,
  context?: Context,
  setContext: Function
}

const ContextMenuContext = createContext<ContextMenu>({
  isOpen: false,
  open: () => {},
  pos: {x:0,y:0},
  setPos: () => {},
  setMenuId: () => {},
  setContext: () => {},
});

const ContextMenuProvider = ({ children } : {children:any}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [pos, setPos] = useState<{x:number,y:number}>({
    x: 0,
    y: 0,
  });
  const [menuId, setMenuId] = useState<string | undefined>(undefined);
  const [context, setContext] = useState<Context | undefined>(undefined);
  
 return (
    <ContextMenuContext.Provider value={{
      isOpen: open,
      open: setOpen,
      pos: pos,
      setPos: setPos,
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