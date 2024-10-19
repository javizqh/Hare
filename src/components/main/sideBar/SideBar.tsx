import React, { useState, useEffect, useContext} from 'react';
import { ContextMenuContext } from '../contextMenu/contextMenuContext';
import * as BasicComponents from "./sections/BasicComponents";
import {IHareView, IHareViewContainers, ProviderResult, TreeItem, TreeItemState, TreeViewProvider} from "@hare-ide/hare"
import {Procurator} from "../../../types/Procurator";

import {readDir, readFile} from "../../../API2.tsx";

const SideBar = ({currentMenu, dragPosX} : {currentMenu:any ,dragPosX:number}) => {
    const procurator = Procurator.getInstance();
		const [containerView, setContainerView] = useState<IHareViewContainers|undefined>(undefined);
		const {menu, setMenu} = useContext(ContextMenuContext);

		procurator.window.registerTreeViewProvider("fileExplorer", new Test());

    useEffect(() => {
			setContainerView(procurator.window.getContainerView(currentMenu));
    }, [currentMenu]);

    useEffect(() => {
			console.log(menu);
    }, [menu]);

		if (currentMenu === '') {
			dragPosX = 0
		}
    return (
			<div id="sideBar" className="sideBar" style={{width: (currentMenu === '') ? 0: dragPosX - 48 }} onContextMenu={(e) => {e.preventDefault(), setMenu(e)}}>
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

interface entry {
	contextValue: string,
	fileName: string,
	url: string,
}

interface entryRust {
	context_value: string,
	file_name: string,
	url: string,
}

class Test implements TreeViewProvider<entry> {
	selectedCallback: Function;
	selected: string[];

	constructor() {
		const [selected, setSelected] = useState<string[]>([]);
		this.selectedCallback = setSelected
		this.selected = selected
	}

	async getChildren(element?: entry | undefined): ProviderResult<entry[]> {
		var childs: entry[] = [];
		var url: string = "/home/javier";

		if (element !== undefined) {
			url = element.url;
		}

		await readDir(url).then((content:entryRust[]) => {
			content.forEach((element:entryRust) => {
				childs.push({
					contextValue: element.context_value,
					fileName: element.file_name,
					url: element.url,
				})
			});
		})

		if (childs.length === 0) {
			return undefined
		}

		return childs;
	}

	async getTreeItem(element: entry): TreeItem | PromiseLike<TreeItem> {
		const treeItem: TreeItem = new TreeItem(element.fileName, (element.contextValue === "file") ? TreeItemState.None : TreeItemState.Collapsed);
		treeItem.contextValue = element.contextValue;
		treeItem.id = element.url;
		treeItem.tooltip = element.url;
		// treeItem.description = element.contextValue;
		if (treeItem.contextValue === "file") {
			treeItem.iconPath = "/home/javier/.hare/extensions/hare.explorer/media/file.svg";
		} else {
			treeItem.iconPath = "/home/javier/.hare/extensions/hare.explorer/media/folder.svg";
		}

		if (treeItem.contextValue === "file") {
			// treeItem.command = () => {
			// 	readFile(element.url).then((content:string) => {
			// 		console.log(content)
			// 	})
			// }
		} else {
			// treeItem.command = () => {}
		}

		return treeItem;
	}
}


export default SideBar;
