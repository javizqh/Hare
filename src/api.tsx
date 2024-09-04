import React, {useEffect, useRef, useState } from "react";
import TitleBar from "./components/main/sideBar/sections/TitleBar";
import CollapsableSection from "./components/main/sideBar/sections/CollapsableSection";
import {Button} from "@hare-ide/hare"

export interface activityBarMenu {
  id: string,
  title: string,
  icon: string, // File
}

export const HareActivityBarMenu = ({currentMenuId, setCurrentMenuId, data} : {currentMenuId:string, setCurrentMenuId:Function, data:activityBarMenu}) => {
  const {id, title, icon} = data;
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = icon;
    }
  }, [])
  
  const clicked = (id:string) => {
    if (currentMenuId !== '') {
        setCurrentMenuId((id === currentMenuId) ? '' : id);
    } else {
        setCurrentMenuId(id);
    }
  }

  return (
    <li id={id} className="action-item" onClick={() => {clicked(id)}}>
        <div ref={ref} className={(currentMenuId === id) ? "inside-button icon active" : "inside-button icon"} aria-hidden="true" />
        <div className={(currentMenuId === id) ? "inside-button active-indicator active" : "inside-button active-indicator"}></div>
        <div className='inside-button hidden-element'>{title}</div>
    </li>
  )
}

export interface sideBarMenuEntry {
  id: string,
  title: string,
  when: string, // when
}

export interface sideBarMenu extends sideBarMenuEntry{
  activityBarMenuId: string, // Which menu is the parent
}

export const HareSideBar = ({data}:{data:sideBarMenu[]}) => {

  if (!data) {
    return null
  }
  
  return (
      <>
      <TitleBar title={data[0].activityBarMenuId}/>
      <div className="sideBar-content">
        {Object(data).map((entry:sideBarMenu) => {
            return (
              <CollapsableSection data={entry}>
              </CollapsableSection>
            )
        })}
      </div>
      </>
  );
};