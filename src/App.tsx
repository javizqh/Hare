import MainScreen from "./components/main/mainScreen.tsx";
import WelcomeScreen from "./components/welcome/WelcomeScreen";
import {useEffect} from 'react';

import { ContextMenuProvider } from "./components/main/contextMenu/contextMenuContext.tsx";
import {Procurator} from "./helpers/Procurator.ts";

import "./css/activitybar.css";
import "./css/contextMenu.css";
import "./css/dragbar.css";
import "./css/editor.css";
import "./css/sideBar.css";
import "./css/statusBar.css";
import "./css/miscellaneous.css";
import "./css/commands.css";
import ContextMenu from "./components/main/contextMenu/ContextMenu.tsx";

const App = () => {
    const procurator = Procurator.getInstance();
    // return (
    //     <><WelcomeScreen></WelcomeScreen></>
    // );

    return (
        <ContextMenuProvider>
            <div onKeyDown={(e:any) => procurator.onKeyPress(e)}>
                <MainScreen/>
            </div>
            <ContextMenu/>
        </ContextMenuProvider>
    );
};

export default App;
