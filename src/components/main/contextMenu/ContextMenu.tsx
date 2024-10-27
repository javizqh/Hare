import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Procurator, IHareMenuEntry, Context } from '../../../helpers/Procurator.ts';
import Command from '../commands/Command.tsx';
import { ContextMenuContext } from './contextMenuContext.tsx';
import { IHareCommand } from '@hare-ide/hare';

const procurator = Procurator.getInstance();

const ContextMenu = () => {
  const contextMenu = useContext(ContextMenuContext);
  const [menuEntries, setMenuEntries] = useState<IHareMenuEntry[]>([]);
  const [isOpen, open] = useState<boolean>(false);
  const overlayRef = useRef(null);

  useLayoutEffect(() => {
    if (!contextMenu.menuId || !contextMenu.isOpen) {
      open(false);
      return;
    }
    var menus = procurator.window.getMenuEntries(contextMenu.menuId);

    if (!menus) {
      open(false);
      return;
    }

    var ctx:Context = {};

    if (contextMenu.context) {
      ctx = contextMenu.context
    }

    var validMenus = menus.filter(function getWhen(menu) {
      return procurator.context.when(menu.when, ctx);
    });

    var hidden = validMenus.filter(function getVisibles(menu) {
      if (menu.group) {
        return menu.group.id !== "visible";
      }
      return true
    });

    setMenuEntries(hidden)
    open(true);
  }, [contextMenu])

  if (menuEntries.length === 0 || !isOpen) {
    return(<></>);
  }

  const clicked = (e:MouseEvent, cmd: IHareCommand) => {
    console.log("More actions", cmd)
    procurator.commands.executeCommand(cmd.id, procurator.context.selected);
    e.stopPropagation();
    procurator.context.unselect();
  }

  const close = (e:MouseEvent) => {
    if (overlayRef.current && overlayRef.current === e.target) {
      contextMenu.open(false);
      e.stopPropagation();
      e.preventDefault();
      procurator.context.unselect();
    }
  }

  return (
    <div ref={overlayRef} className='overlay' onClick={(e:any) => close(e)} onAuxClick={(e:any) => close(e)} onContextMenu={(e:any) => close(e)}>
      <div className='context-menu' style={{top: contextMenu.pos.y, left: contextMenu.pos.x}}>
        <ul className='group'>
        {menuEntries.map((entry:IHareMenuEntry) => {
          return (
            <li className='entry' onClick={(e:any) => clicked(e, entry.command)}>
              <div className='title'>
                {entry.command.title}
              </div>
              {/* <div className='keybind'>
                Ctrl+A
              </div> */}
            </li>
          )})
        }
        </ul>
        <div className='separator'/>
        <ul className='group'>
        {menuEntries.map((entry:IHareMenuEntry) => {
          return (
            <li className='entry' onClick={(e:any) => clicked(e, entry.command)}>
              <div className='title'>
                {entry.command.title}
              </div>
            </li>
          )})
        }
        </ul>
      </div>
    </div>
  );
};

export default ContextMenu;
