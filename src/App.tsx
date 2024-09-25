import MainScreen from "./components/main/mainScreen.tsx";
import WelcomeScreen from "./components/welcome/WelcomeScreen";
import * as Hare from "./API2.tsx"
import React, { useState, useEffect, useRef } from 'react';
import {Extension, RustExtension} from "./types/Extension.ts";

import {Procurator} from "./types/Procurator";
import {hare} from "./hare.d.ts";

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
            var procurator = Procurator.getInstance();
            new_extensions.forEach(extension => {
                extension.activity_bar_menus.forEach(viewContainer => {
                    procurator.window.registerContainerView(hare.HareViewPanel.PrimaryBar, viewContainer);
                })
                extension.views.forEach(view => {
                    procurator.window.registerView(view);
                })
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
