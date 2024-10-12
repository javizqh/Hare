import React, { useState, useEffect, useContext} from 'react';
import { ContextMenuContext } from '../contextMenu/contextMenuContext';
import * as BasicComponents from "./sections/BasicComponents";
import {hare} from "../../../hare.d.ts";
import {Procurator} from "../../../types/Procurator";

import {readDir, readFile} from "../../../API2.tsx";

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

// class Test implements hare.TreeViewProvider<number> {
// 	constructor() {

// 	}

// 	getChildren(element?: number | undefined): hare.ProviderResult<number[]> {
// 		if (element === undefined) {
// 			return [0,1]
// 		}

// 		if (element === 5) {
// 			return undefined
// 		}

// 		readDir("/home/javier").then((content:any) => {
// 			console.log(content)
// 		})

// 		return [5,6,7];
// 	}

// 	getTreeItem(element: number): hare.TreeItem | PromiseLike<hare.TreeItem> {
// 		const treeItem: hare.TreeItem = new hare.TreeItem("Number: " + element.toString(), hare.TreeItemState.Expanded);
// 		return treeItem;
// 	}
// }

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

class Test implements hare.TreeViewProvider<entry> {
	constructor() {

	}

	async getChildren(element?: entry | undefined): hare.ProviderResult<entry[]> {
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

	async getTreeItem(element: entry): hare.TreeItem | PromiseLike<hare.TreeItem> {
		const treeItem: hare.TreeItem = new hare.TreeItem(element.fileName.toString(), hare.TreeItemState.Expanded);
		treeItem.contextValue = element.contextValue;
		if (treeItem.contextValue === "file") {
			treeItem.iconPath = "/home/javier/.hare/extensions/hare.explorer/media/file.svg";
		} else {
			treeItem.iconPath = "/home/javier/.hare/extensions/hare.explorer/media/folder.svg";
		}

		if (treeItem.contextValue === "file") {
			treeItem.command = () => {
				readFile(element.url).then((content:string) => {
					console.log(content)
				})
			}
		} else {
			treeItem.command = () => {}
		}

		return treeItem;
	}
}


export default SideBar;
