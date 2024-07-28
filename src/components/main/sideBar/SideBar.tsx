import React, { useState, useEffect, useRef,  Suspense, lazy } from 'react';
import * as API from "../../../API";
import * as BasicComponents from "./sections/BasicComponents";


const SideBar = ({currentMenu, dragPosX, EditorAPI} : {currentMenu:any ,dragPosX:number, EditorAPI:any}) => {
		const [SideBarMenu, updateSideBarMenu] = useState<any>(null);
    useEffect(() => {
			if (currentMenu) {
        if (currentMenu.id === 'fileExplorer') {
					updateSideBarMenu(lazy(() => import("../../../extensions/hare.file-explorer/src/src").then((module) => ({ default: module.SideBar }))));
        } else {
					updateSideBarMenu(null)
				}
			}
    }, [currentMenu]);

		if (currentMenu) {
    return (
			<div id="sideBar" className="sideBar" style={{width: dragPosX - 48}}>
				{ SideBarMenu &&
					<SideBarMenu HARE={API} EditorAPI={EditorAPI} BaseComponents={BasicComponents}/>
				}
			</div>
    );
		}
};

export default SideBar;
