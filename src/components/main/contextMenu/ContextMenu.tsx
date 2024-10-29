import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Procurator, IHareMenuEntry} from '../../../helpers/Procurator.ts';
import Command from '../commands/Command.tsx';
import { ContextMenuContext } from './contextMenuContext.tsx';
import { IHareCommand } from '@hare-ide/hare';
import when, {Context} from '../../../helpers/functions/when.ts';

const procurator = Procurator.getInstance();

const ContextMenu = () => {
  const contextMenu = useContext(ContextMenuContext);
  const [menuEntries, setMenuEntries] = useState<IHareMenuEntry[]>([]);
  const [isOpen, open] = useState<boolean>(false);
  const overlayRef = useRef(null);
  const [style, setStyle] = useState({top: "", left:"", right:"", bottom:""});

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
      return when(menu.when, ctx);
    });

    var hidden = validMenus.filter(function getVisibles(menu) {
      if (menu.group) {
        return menu.group.id !== "visible";
      }
      return true
    });

    let newStyle = {top: "", left:"", right:"", bottom:""};

    if (contextMenu.pos.height === "top") {
      newStyle.top = contextMenu.pos.y.toString() + "px";
    } else {
      newStyle.bottom = contextMenu.pos.y.toString() + "px";
    }

    if (contextMenu.pos.width === "left") {
      newStyle.left = contextMenu.pos.x.toString() + "px";
    } else {
      newStyle.right = contextMenu.pos.x.toString() + "px";
    }

    setStyle(newStyle);
    setMenuEntries(hidden)
    open(true);
  }, [contextMenu])

  if (menuEntries.length === 0 || !isOpen) {
    return(<></>);
  }

  const clicked = (e:MouseEvent, cmd: IHareCommand) => {
    procurator.commands.executeCommand(cmd.id, procurator.context.selected);
    e.stopPropagation();
    procurator.context.unselect();
  }

  const close = (e:MouseEvent) => {
    if (overlayRef.current && overlayRef.current === e.target) {
      contextMenu.open(false);
      procurator.context.unselect();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  return (
    <div ref={overlayRef} className='overlay' onClick={(e:any) => close(e)} onAuxClick={(e:any) => close(e)} onContextMenu={(e:any) => close(e)}>
      <div className='context-menu' style={{top: style.top, bottom: style.bottom, right: style.right, left: style.left}}>
        <ul className='group' >
        {menuEntries.map((entry:IHareMenuEntry) => {
          return (
            <li className='entry' onClick={(e:any) => clicked(e, entry.command)}>
              <div className='title'>
                {entry.command.title}
              </div>
              <div className='keybind'>
                Keybind Here
              </div>
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
