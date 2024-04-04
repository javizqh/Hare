import React from "react";
import Editor from '@monaco-editor/react';
import Draggable from 'react-draggable';
import ActivityBar from "./activityBar/ActivityBar";

import config from "./../../config/config.json";

let buttons = document.getElementsByClassName("action-item");
let last_dragbar_size:any = -1;

document.addEventListener("click", function(evt:any){
  if (document.getElementById("contextMenuActivityBar")!.style.visibility == "visible") {
    // hideMenu();
    return;
  }
  // Check to see if it was a button that was clicked
  if(evt.target!.classList.contains("action-item")){
    // Loop over all the buttons & remove the active class
    for (let button of buttons) button_clicked(evt.target, button); 
  }
});

function button_clicked(target:any, button:any) {
  if (target == button) {
    if (button.children.icon.classList.contains("active")) {
      if (document.getElementById("sideBar")!.style.display == "none") {
        document.body.style.setProperty("--sideBar-width", last_dragbar_size);
        document.getElementById("sideBar")!.style.display='block';
        document.getElementById("sideBar-dragbar")!.style.display='block';
      } else {
        last_dragbar_size = document.body.style.getPropertyValue("--sideBar-width");
        document.getElementById("sideBar")!.style.display='none';
        document.getElementById("sideBar-dragbar")!.style.display='none';
        document.body.style.setProperty("--sideBar-width", '0px');
      }
      button.children.icon.classList.remove("active");
      button.children[1].classList.remove("active");
    } else {
      if (last_dragbar_size < 0) last_dragbar_size = document.body.style.getPropertyValue("--sideBar-width");
      document.body.style.setProperty("--sideBar-width", last_dragbar_size);
      document.getElementById("sideBar")!.style.display='block';
      document.getElementById("sideBar-dragbar")!.style.display='block';
      button.children.icon.classList.add("active");
      button.children[1].classList.add("active");
    }
  } else {
    button.children.icon.classList.remove("active");
    button.children[1].classList.remove("active");
  }
}

class MainScreen extends React.Component {
    state = {
        deltaXyPos: {
        x: 348, 
        y: 0
        }
    };

    handleDrag = (e: any, data: any) => {
        // const { x, y } = this.state.deltaXyPos;
        data.node!.classList.add('resizing');
        let newX = e.x;

        if (newX < 48) newX = 48;
        else if (e.x > 1000) newX = 1000;

        this.setState({
            deltaXyPos: {
                    x: newX,
                    y: e.y,
            }
        });
    };

    render() {
        const buttons = config.activitiesButtons;
        const { deltaXyPos } = this.state;

        return (
        <>
        <div className = "vertical-container">
        <div className = "horiz-container">
          <ActivityBar buttons={buttons}></ActivityBar>
          <div id="sideBar" className="sideBar" style={{display: 'block', width: deltaXyPos.x - 48}}></div>
          <Draggable axis="x" onDrag={this.handleDrag} bounds={{left: 48, right: 1000}} position={{x: deltaXyPos.x , y:0}}>
            <div id = "sideBar-dragbar" className = "dragbar dragbar-horiz" style={{display: 'block'}}></div>
          </Draggable>
          <div className = "main-view-container" style={{left: deltaXyPos.x, width: `calc(100% - ${deltaXyPos.x}px)`}}>
            <div id="editor-container" className = "editor-container">
              <div id="files-in-editor" className="files-in-editor"></div>
              <div id="editor" className="editor">
              <Editor height="100%" theme="vs-dark" defaultLanguage="javascript" defaultValue="// some comment" />
              </div>
            </div>
            <div id = "editor-dragbar" className = "dragbar dragbar-vert"></div>
            <div id="terminal-container" className="terminal-container">
              <div className="terminal-tab-container"></div>
            </div>
            <svg id="splash-icon" className="splash-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" style={{display: 'none'}}>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"/>
            </svg>
          </div>
        </div>
        <div className="status-bar">
        </div>
      </div>
      </>
      );
    }
}

export default MainScreen;