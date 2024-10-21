import { useState, useEffect, useContext} from 'react';
import { ContextMenuContext } from '../contextMenu/contextMenuContext';
import * as BasicComponents from "./sections/BasicComponents";
import {IHareView, IHareViewContainers} from "@hare-ide/hare"
import {Procurator} from "../../../types/Procurator";

const SideBar = ({currentMenu, dragPosX} : {currentMenu:any ,dragPosX:number}) => {
    const procurator = Procurator.getInstance();
		const [containerView, setContainerView] = useState<IHareViewContainers|undefined>(undefined);
		// const {menu, setMenu} = useContext(ContextMenuContext);

    useEffect(() => {
			setContainerView(procurator.window.getContainerView(currentMenu));
    }, [currentMenu]);

		if (currentMenu === '') {
			dragPosX = 0
		}
    return (
			<div id="sideBar" className="sideBar" style={{width: (currentMenu === '') ? 0: dragPosX - 48 }} onContextMenu={(e) => {e.preventDefault()}}>
				{containerView &&
					<>
					<BasicComponents.TitleBar title={containerView.title}/>
					<div className="sideBar-content">
						{containerView.views.map((entry:IHareView) => {
								return (
									<BasicComponents.CollapsableSection
										data={entry} 
										parent={currentMenu}
									/>
								)
						})}
					</div>
					</>
				}
			</div>
    );
};

export default SideBar;
