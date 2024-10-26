import { memo } from 'react';
import { Procurator, IHareMenuEntry } from '../../../../helpers/Procurator.ts';
import Command from '../../commands/Command.tsx';

const procurator = Procurator.getInstance();

const MenuBar = memo(({menuId} : {menuId:string}) => {
  const menus = procurator.window.getMenuEntries(menuId);

  //TODO: separate visible from the rest

  if (!menus) {
    return(<></>);
  }

  return (
    <div className='sideBar-entry-menu'>
      {menus.map((entry:IHareMenuEntry) => {
        return (
          <Command cmd={entry.command} />
        )})
      }
    </div>
  );
});

export default MenuBar;
