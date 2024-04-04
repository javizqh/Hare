import ActionsContainer from "./actions/ActionsContainer";
import SettingsContainer from "./settings/SettingsContainer";

const ActivityBar = (props: any) => {
    return (
        <>
        <div id = "activitybar" className="activitybar">
            <ActionsContainer buttons={props.buttons}/>
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
