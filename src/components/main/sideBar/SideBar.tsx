import { useState, useEffect } from 'react';
import * as BasicComponents from './sections/BasicComponents';
import { IHareView, IHareViewContainers } from '@hare-ide/hare';
import { Procurator } from '../../../helpers/Procurator';

const SideBar = ({ currentMenu, dragPosX }: { currentMenu: any; dragPosX: number }) => {
  const procurator = Procurator.getInstance();
  const [containerView, setContainerView] = useState<IHareViewContainers | undefined>(undefined);

  useEffect(() => {
    setContainerView(procurator.window.getContainerView(currentMenu));
  }, [currentMenu]);

  if (currentMenu === '') {
    dragPosX = 0;
  }
  return (
    <div
      id="sideBar"
      className="sideBar"
      style={{ width: currentMenu === '' ? 0 : dragPosX - 48 }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      {containerView && (
        <>
          <BasicComponents.TitleBar title={containerView.title} />
          <div className="content">
            {containerView.views.map((entry: IHareView) => {
              return <BasicComponents.CollapsableSection data={entry} parent={currentMenu} />;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
