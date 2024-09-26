import React, {useEffect} from "react";
import {hare} from "../../../hare.d.ts";

const ActivityBarEntry = ({currentMenuId, setCurrentMenuId, data} : {currentMenuId:string, setCurrentMenuId:Function, data:hare.IHareViewContainers}) => {
  const {id, icon, title, views} = data;
  const ref = React.useRef(null);

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
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
  );
};

export default ActivityBarEntry;