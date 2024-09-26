import React, { useState, useEffect, useContext} from 'react';
import { ContextMenuContext } from '../contextMenu/contextMenuContext';
import * as BasicComponents from "./sections/BasicComponents";
import {hare} from "../../../hare.d.ts";
import {Procurator} from "../../../types/Procurator";

const SideBar = ({currentMenu, dragPosX} : {currentMenu:any ,dragPosX:number}) => {
    const procurator = Procurator.getInstance();
		const [containerView, setContainerView] = useState<hare.IHareViewContainers|undefined>(undefined);
		const {menu, setMenu} = useContext(ContextMenuContext);

		procurator.window.registerTreeViewProvider("jsonOutline", new Test());

    useEffect(() => {
			setContainerView(procurator.window.getContainerView(currentMenu));
    }, [currentMenu]);

    useEffect(() => {
			console.log(menu);
    }, [menu]);

		if (currentMenu) {
    return (
			<div id="sideBar" className="sideBar" style={{width: dragPosX - 48}} onContextMenu={(e) => {e.preventDefault(), setMenu(e)}}>
				{containerView &&
					<>
					<BasicComponents.TitleBar title={containerView.title}/>
					<div className="sideBar-content">
						{containerView.views.map((entry:hare.IHareView) => {
								return (
									<BasicComponents.CollapsableSection data={entry}>
									{/* TODO: Tree is a json: 'folder':{...} */}
									</BasicComponents.CollapsableSection>
								)
						})}
					</div>
					</>
				}
			</div>
    );
		}
};

class Test implements hare.TreeViewProvider<number> {
	constructor() {

	}

	getChildren(element?: number | undefined): hare.ProviderResult<number[]> {
		if (element === undefined) {
			return [0,1]
		}

		if (element === 5) {
			return undefined
		}

		return [5,6,7];
	}

	getTreeItem(element: number): hare.TreeItem | PromiseLike<hare.TreeItem> {
		const treeItem: hare.TreeItem = new hare.TreeItem(element.toString(), hare.TreeItemState.Expanded);
		return treeItem;
	}
}

export default SideBar;
