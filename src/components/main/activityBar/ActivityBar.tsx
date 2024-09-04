import SettingsContainer from "./settings/SettingsContainer";
import * as hare from "../../../api";
import {Extension} from "../../../Extension";

const ActivityBar = ({setCurrentMenu, currentMenu, buttons, extensions} : {setCurrentMenu:any, currentMenu:any ,buttons:any, extensions:Extension[]}) => {

    return (
        <>
        <div id = "activitybar" className="activitybar">
            {/* <ul id="actions-container" className="actions-container">
                {buttons.map((data: any) => {
                    return (
                        <li id={data.id} className="action-item" onClick={() => {clicked(data.id, data.tipData)}}>
                            <svg id='icon' className={(currentMenu && currentMenu.id === data.id) ? "inside-button icon active" : "inside-button icon"} aria-hidden="true" fill={data.icon.fill} viewBox={data.icon.viewBox}>
                                {Parser().parse(data.icon.svg)}
                            </svg>
                            <div className={(currentMenu && currentMenu.id === data.id) ? "inside-button active-indicator active" : "inside-button active-indicator"}></div>
                            <div className='inside-button hidden-element'>{data.tipData}</div>
                        </li>
                    )})}
            </ul> */}
            <ul id="actions-container" className="actions-container">
                {extensions.map((extension: Extension) => {
                    return (
                        extension.getActivityBar().map((data:hare.activityBarMenu) => {
                        console.log(data)
                        return (
                            <hare.HareActivityBarMenu
                                currentMenuId={currentMenu}
                                setCurrentMenuId={setCurrentMenu}
                                data={data}
                            />
                    )}))})}
            </ul>
            <SettingsContainer/>
        </div>

        <div id="contextMenuActivityBar" className="context-menu" style={{visibility: 'hidden'}}> 
            <ul> 
                <li><a href="#">Element-1</a></li>
                <li><a href="#">Element-2</a></li> 
                <li><a href="#">Element-3</a></li> 
                <li><a href="#">Element-4</a></li> 
                <li><a href="#">Element-5</a></li> 
                <li><a href="#">Element-6</a></li> 
                <li className="separator"></li>
                <li><a href="#">Element-7</a></li> 
            </ul> 
        </div>
        </>
    );
};

export default ActivityBar;
