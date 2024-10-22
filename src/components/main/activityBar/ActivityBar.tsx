import SettingsContainer from "./settings/SettingsContainer";
import React, { useState, useEffect, useRef } from 'react';
import ActivityBarEntry from "./ActivityBarEntry.tsx";

import {Procurator} from "../../../helpers/Procurator.ts";
import { IHareViewContainers } from "@hare-ide/hare";

const ActivityBar = ({setCurrentMenu, currentMenu} : {setCurrentMenu:any, currentMenu:any}) => {
    var containerViews:IHareViewContainers[]  = [];

    useEffect(() => {
    }, [])
    // TODO: update this on container views change
    var procurator = Procurator.getInstance();
    containerViews = procurator.window.getContainerViews(0);

    return (
        <div id = "activitybar" className="activitybar">
            <ul id="actions-container" className="actions-container">
                {containerViews.map((data:IHareViewContainers) => {
                    return (
                        <ActivityBarEntry
                            currentMenuId={currentMenu}
                            setCurrentMenuId={setCurrentMenu}
                            data={data}
                        />
                    )
                })}
            </ul>
            <SettingsContainer/>
        </div>
    );
};

export default ActivityBar;
