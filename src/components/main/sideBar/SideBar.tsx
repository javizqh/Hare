import React, { useState, useEffect, useContext,  Suspense, lazy } from 'react';
import { ContextMenuContext } from '../contextMenu/contextMenuContext';
import * as API from "../../../API2";
import * as BasicComponents from "./sections/BasicComponents";
import * as hare from "../../../api";
import {Extension} from "../../../Extension";

const SideBar = ({currentMenu, dragPosX, EditorAPI, extensions} : {currentMenu:any ,dragPosX:number, EditorAPI:any, extensions:Extension[]}) => {
		const [SideBarMenu, updateSideBarMenu] = useState<any>(null);
		const {menu, setMenu} = useContext(ContextMenuContext);
		const [sideBarEntries, setSideBarEntries] = useState<{ [id: string] : hare.sideBarMenu[]; }>({});

    useEffect(() => {
  		console.log(sideBarEntries)
			if (currentMenu) {
        if (currentMenu === 'explorer') {
					updateSideBarMenu(lazy(() => import("../../../extensions/hare.file-explorer/src/src").then((module) => ({ default: module.SideBar }))));
        } else {
					updateSideBarMenu(null)
				}
			}
    }, [currentMenu]);

    useEffect(() => {
			extensions.forEach((extension: Extension) => {
				extension.getSideBar().forEach((entry: hare.sideBarMenu) => {
					if (!sideBarEntries[entry.activityBarMenuId]) {
						sideBarEntries[entry.activityBarMenuId] = [entry];
					} else {
						sideBarEntries[entry.activityBarMenuId].push(entry);
					}
				})
			});
			setSideBarEntries(sideBarEntries)
    }, [extensions]);

    useEffect(() => {
			console.log(menu);
    }, [menu]);

		if (currentMenu) {
    return (
			<div id="sideBar" className="sideBar" style={{width: dragPosX - 48}} onContextMenu={(e) => {e.preventDefault(), setMenu(e)}}>
				<hare.HareSideBar data={sideBarEntries[currentMenu]}/>
				{/* { SideBarMenu &&
					<SideBarMenu HARE={API} EditorAPI={EditorAPI} BaseComponents={BasicComponents}/>
				} */}
			</div>
    );
		}
};

export default SideBar;
