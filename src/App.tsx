import MainScreen from "./components/main/mainScreen.tsx";
import WelcomeScreen from "./components/welcome/WelcomeScreen";
// import Bar from "/home/javier/.hare/extensions/test/src/src.tsx";
// import Bar from "./extensions/file-explorer/src/src.tsx";
import * as API from "./API.tsx";

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

    return (
    
        <><MainScreen></MainScreen></>
    );
};

export default App;
