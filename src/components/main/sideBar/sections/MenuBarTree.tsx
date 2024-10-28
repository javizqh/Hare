import { Procurator, IHareMenuEntry, Context } from '../../../../helpers/Procurator.ts';
import Command from '../../commands/Command.tsx';

const procurator = Procurator.getInstance();

const MenuBarTree = ({menuId, context} : {menuId:string, context:Context}) => {
  const menus = procurator.window.getMenuEntries(menuId);

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

  visibles = visibles.sort(function compareMenu(a, b) {
    if (a.group && b.group) {
      if (a.group.position && b.group.position) {
        return a.group.position - b.group.position
      }
    }
    return 0;
  });

  return (
    <div className='tree-action-menu'>
      {visibles.map((entry:IHareMenuEntry) => {
        return (
          <Command cmd={entry.command} />
        )})
      }
    </div>
  );
};

export default MenuBarTree;
