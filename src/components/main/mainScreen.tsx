import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import ActivityBar from './activityBar/ActivityBar';
import SideBar from './sideBar/SideBar';
import EditorContainer from './editorView/EditorContainer';

interface EditorTab {
  path: string;
  name: string;
  type: string;
  current: boolean;
  age: number; // Lowest == Newer
}

const MainScreen = () => {
  const [dragPosX, setDragPosX] = useState(348);
  const [isSideBarOpen, setSideBarOpenEditorOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<string>('');

  useEffect(() => {
    setSideBarOpenEditorOpen(currentMenu !== '');
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
    <div className="vertical-container">
      <div className="horiz-container">
        <ActivityBar setCurrentMenu={setCurrentMenu} currentMenu={currentMenu} />
        <SideBar currentMenu={currentMenu} dragPosX={dragPosX} />
        {isSideBarOpen && (
          <Draggable
            axis="x"
            onDrag={handleDrag}
            bounds={{ left: 48, right: 1000 }}
            position={{ x: dragPosX, y: 0 }}
          >
            <div
              id="sideBar-dragbar"
              className="dragbar dragbar-horiz"
              style={{ display: 'block' }}
            ></div>
          </Draggable>
        )}
        <div
          className="main-view-container"
          style={
            isSideBarOpen
              ? { left: dragPosX, width: `calc(100% - ${dragPosX}px)` }
              : { left: '48px', width: `calc(100% - 48px)` }
          }
        >
          <EditorContainer />
          <div id="editor-dragbar" className="dragbar dragbar-vert"></div>
          <div id="terminal-container" className="terminal-container">
            <div className="terminal-tab-container"></div>
          </div>
        </div>
      </div>
      <div className="status-bar"></div>
    </div>
  );
};

export default MainScreen;
