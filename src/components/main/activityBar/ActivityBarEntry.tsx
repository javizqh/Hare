import { IHareViewContainers } from "@hare-ide/hare";
import React, {useEffect} from "react";

const ActivityBarEntry = ({currentMenuId, setCurrentMenuId, data} : {currentMenuId:string, setCurrentMenuId:Function, data:IHareViewContainers}) => {
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
    <li id={id} className="action-item has-tooltip" onClick={() => {clicked(id)}}>
        <div ref={ref} className={(currentMenuId === id) ? "inside-button icon active" : "inside-button icon"} aria-hidden="true" />
        <div className={(currentMenuId === id) ? "inside-button active-indicator active" : "inside-button active-indicator"}></div>
        <div className='tooltip'>{title}</div>
    </li>
  );
};

export default ActivityBarEntry;