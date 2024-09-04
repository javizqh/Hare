import MainScreen from "./components/main/mainScreen.tsx";
import WelcomeScreen from "./components/welcome/WelcomeScreen";
import * as Hare from "./API2.tsx"
import React, { useState, useEffect, useRef } from 'react';
import {Extension, RustExtension} from "./Extension";

import "./css/activitybar.css";
import "./css/contextMenu.css";
import "./css/dragbar.css";
import "./css/editor.css";
import "./css/sideBar.css";
import "./css/statusBar.css";
import "./css/miscellaneous.css";

const App = () => {
    const [extensions, setExtensions] = useState<Extension[]>([]);
    // return (
    //     <><WelcomeScreen></WelcomeScreen></>
    // );

    useEffect(()=>{
        Hare.load_extensions().then((new_extensions:RustExtension[]) => {
            new_extensions.forEach(extension => {
                let ext = new Extension(extension)
                setExtensions([
                    ext,
                    ...extensions // Put old items at the end
                ]);
            });
        })
        .catch((error:any) => {
            console.error(error);
        });
    }, [])

    return (
    
        <><MainScreen extensions={extensions}/></>
    );
};

export default App;
