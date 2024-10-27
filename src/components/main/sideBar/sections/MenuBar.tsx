import { useContext } from 'react';
import { Procurator, IHareMenuEntry, Context } from '../../../../helpers/Procurator.ts';
import Command from '../../commands/Command.tsx';
import { ContextMenuContext } from '../../contextMenu/contextMenuContext.tsx';

const procurator = Procurator.getInstance();

const MenuBar = ({menuId, context} : {menuId:string, context:Context}) => {
  const menus = procurator.window.getMenuEntries(menuId);
  const contextMenu = useContext(ContextMenuContext);

  if (!menus) {
    return(<></>);
  }

  var validMenus = menus.filter(function getWhen(menu) {
    return procurator.context.when(menu.when, context);
  });

  var visibles = validMenus.filter(function getVisibles(menu) {
    if (menu.group) {
      return menu.group.id === "visible";
    }
  });

  var hidden = validMenus.filter(function getVisibles(menu) {
    if (menu.group) {
      return menu.group.id !== "visible";
    }
  });

  visibles = visibles.sort(function compareMenu(a, b) {
    if (a.group && b.group) {
      if (a.group.position && b.group.position) {
        return a.group.position - b.group.position
      }
    }
    return 0;
  });

  const clicked = (e:MouseEvent) => {
    console.log("More actions")
    e.stopPropagation();
    procurator.context.unselect();
  }

  const onContextMenu = (e:MouseEvent) => {
    contextMenu.setMenuId("view/title");
    contextMenu.setContext(context);
    contextMenu.setPos(e.clientX, e.clientY);
    contextMenu.open(true);
    e.stopPropagation();
  }

  return (
    <div className='sideBar-entry-menu'>
      {visibles.map((entry:IHareMenuEntry) => {
        return (
          <Command cmd={entry.command} />
        )})
      }
      {hidden.length !== 0 &&
        <li className="command-icon has-tooltip" onClick={(e:any) => {onContextMenu(e)}} title={"More actions"}>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path stroke="#fff" strokeLinecap="round" strokeWidth="2" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
          </svg>
          {/* <div className='tooltip'>{cmd.title}</div> */}
        </li>
      }
    </div>
  );
};

export default MenuBar;
