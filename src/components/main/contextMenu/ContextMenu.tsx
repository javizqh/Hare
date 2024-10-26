import { useContext, useEffect, useState } from 'react';
import { Procurator, IHareMenuEntry, Context } from '../../../helpers/Procurator.ts';
import Command from '../commands/Command.tsx';
import { ContextMenuContext } from './contextMenuContext.tsx';

const procurator = Procurator.getInstance();

const ContextMenu = () => {
  const contextMenu = useContext(ContextMenuContext);
  const [menuEntries, setMenuEntries] = useState<IHareMenuEntry[]>([]);
  const [isOpen, open] = useState<boolean>(false);

  useEffect(() => {
    if (!contextMenu.menuId) {
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

  const clicked = (e:MouseEvent) => {
    console.log("More actions")
    e.stopPropagation();
    procurator.context.unselect();
  }

  return (
    <div>
      {menuEntries.map((entry:IHareMenuEntry) => {
        return (
          <h2>{entry.command.title}</h2>
        )})
      }
    </div>
  );
};

export default ContextMenu;
