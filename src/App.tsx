import MainScreen from "./components/main/mainScreen.tsx";
import WelcomeScreen from "./components/welcome/WelcomeScreen";
import {useEffect} from 'react';

import {Procurator} from "./helpers/Procurator.ts";

import "./css/activitybar.css";
import "./css/contextMenu.css";
import "./css/dragbar.css";
import "./css/editor.css";
import "./css/sideBar.css";
import "./css/statusBar.css";
import "./css/miscellaneous.css";

const App = () => {
    const procurator = Procurator.getInstance();
    // return (
    //     <><WelcomeScreen></WelcomeScreen></>
    // );

    return (
        <div onKeyDown={(e:any) => procurator.onKeyPress(e)}>
            <MainScreen/>
        </div>
    );
};

export default App;
