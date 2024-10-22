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
    // return (
    //     <><WelcomeScreen></WelcomeScreen></>
    // );

    useEffect(()=>{
        Procurator.getInstance(); // Initialize procurator
    }, [])

    return (
    
        <><MainScreen/></>
    );
};

export default App;
