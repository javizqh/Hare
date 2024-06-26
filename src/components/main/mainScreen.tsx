import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import Draggable from 'react-draggable';
import ActivityBar from "./activityBar/ActivityBar";

import config from "./../../config/config.json";

const MainScreen = ({} : {}) => {

    const [dragPosX, setDragPosX] = useState(348);
    const [isEditorOpen, setEditorOpen] = useState(false);
    const [isSideBarOpen, setSideBarOpenEditorOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState("");

    useEffect(() => {
      setEditorOpen(true);
    }, []);

    useEffect(() => {
      setSideBarOpenEditorOpen(currentMenu !== "");
    }, [currentMenu]);

    const handleDrag = (e: any, data: any) => {
        // const { x, y } = this.state.deltaXyPos;
        data.node!.classList.add('resizing');
        let newX = e.x;

        if (newX < 48) newX = 48;
        else if (e.x > 1000) newX = 1000;
        setDragPosX(newX);
    };

    return (
    <>
      <div className = "vertical-container">
      <div className = "horiz-container">
        <ActivityBar 
          setCurrentMenu={setCurrentMenu}
          currentMenu={currentMenu}
          buttons={config.activitiesButtons}/>
        { isSideBarOpen &&
          <div id="sideBar" className="sideBar" style={{display: 'block', width: dragPosX - 48}}></div>
        }
        { isSideBarOpen &&
          <Draggable axis="x" onDrag={handleDrag} bounds={{left: 48, right: 1000}} position={{x: dragPosX , y:0}}>
            <div id = "sideBar-dragbar" className = "dragbar dragbar-horiz" style={{display: 'block'}}></div>
          </Draggable>
        }
        <div className = "main-view-container" style={isSideBarOpen ? {left: dragPosX, width: `calc(100% - ${dragPosX}px)`} : {left: '48px', width: `calc(100% - 48px)`}}>
          { isEditorOpen ?
            (<div id="editor-container" className = "editor-container">
              <div id="files-in-editor" className="files-in-editor"></div>
              <div id="editor" className="editor">
              <Editor height="100%" theme="vs-dark" defaultLanguage="javascript" defaultValue="// some comment" />
              </div>
            </div>) :
            (<svg id="splash-icon" className="splash-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" style={{display: 'none'}}>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"/>
            </svg>)
          }
          <div id = "editor-dragbar" className = "dragbar dragbar-vert"></div>
          <div id="terminal-container" className="terminal-container">
            <div className="terminal-tab-container"></div>
          </div>
        </div>
      </div>
      <div className="status-bar">
      </div>
    </div>
    </>
  );
}

export default MainScreen;