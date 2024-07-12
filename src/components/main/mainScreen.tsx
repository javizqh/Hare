import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import ActivityBar from "./activityBar/ActivityBar";
import SideBar from "./sideBar/SideBar";
import EditorView from "./editorView/EditorView";

import config from "../../config/config.json";

interface EditorTab {
  path: string;
  name: string;
  type: string;
  current: boolean;
  age: number; // Lowest == Newer
}

interface MenuEntry {
  id: string;
  name: string;
}

const MainScreen = ({} : {}) => {

    const [dragPosX, setDragPosX] = useState(348);
    const [isEditorOpen, setEditorOpen] = useState(false);
    const [isSideBarOpen, setSideBarOpenEditorOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState<null|MenuEntry>(null);
    const [editorFileTabs, setEditorFileTabs] = useState<EditorTab[]>([]);

    useEffect(() => {
      setEditorOpen(true);
    }, []);

    useEffect(() => {
      setSideBarOpenEditorOpen(currentMenu !== null);
    }, [currentMenu]);

    const openFileInEditor = (new_tab: EditorTab) =>{
      editorFileTabs.forEach( (tab:any) => {
        tab.age = tab.age + 1;
        if (tab.path !== new_tab.path) {
          tab.current = false;
        }
      });

      // Check if already opened
      let match = editorFileTabs.find((element:any) => {
        return element.path === new_tab.path;
      })
      if (match) {
        match.current = true;
        match.age = 0;
        setEditorFileTabs([
          ...editorFileTabs
        ]);
        return;
      }

      setEditorFileTabs([
        ...editorFileTabs,
        new_tab
      ]);
    }

    const closeFileInEditor = (close_tab: EditorTab) =>{
      let latest:any = null;
      editorFileTabs.forEach( (tab:any) => {
        if ( tab.path == close_tab.path ) {return}
        if (latest === null ) {
          latest = tab;
        } else if (latest.age > tab.age) {
          latest = tab;
        }
        tab.age = tab.age - 1;
      });

      if (latest) {
        latest.current = true;
      }

      setEditorFileTabs(
        editorFileTabs.filter(a => a.path !== close_tab.path)
      );
    }

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
        <SideBar
          currentMenu={currentMenu}
          dragPosX={dragPosX}
          openFileInEditor={openFileInEditor}
          editorFileTabs={editorFileTabs}
        />
        { isSideBarOpen &&
          <Draggable axis="x" onDrag={handleDrag} bounds={{left: 48, right: 1000}} position={{x: dragPosX , y:0}}>
            <div id = "sideBar-dragbar" className = "dragbar dragbar-horiz" style={{display: 'block'}}></div>
          </Draggable>
        }
        <div className = "main-view-container" style={isSideBarOpen ? {left: dragPosX, width: `calc(100% - ${dragPosX}px)`} : {left: '48px', width: `calc(100% - 48px)`}}>
          <EditorView editorFileTabs={editorFileTabs} isOpen={isEditorOpen} openFileInEditor={openFileInEditor} closeFileInEditor={closeFileInEditor}/>
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