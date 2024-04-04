import MainScreen from "./components/main/mainScreen";
import WelcomeScreen from "./components/welcome/WelcomeScreen";

import "./css/activitybar.css";
import "./css/contextMenu.css";
import "./css/dragbar.css";
import "./css/editor.css";
import "./css/sideBar.css";
import "./css/statusBar.css";
import "./css/miscellaneous.css";



// function hideMenu() { 
//   let contextMenus = document.getElementsByClassName("context-menu") ;
//   for (let menu of contextMenus) {
//     menu.style.visibility = "hidden";
//   }
// }


const App = () => {
    return (
        <><WelcomeScreen></WelcomeScreen></>
    );

    return (
        <><MainScreen></MainScreen></>
    );
};

export default App;
