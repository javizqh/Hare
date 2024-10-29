import { IHareViewContainers } from "@hare-ide/hare";
import React, {useEffect} from "react";
import { readFile } from "../../../API2";

const ActivityBarEntry = ({currentMenuId, setCurrentMenuId, data} : {currentMenuId:string, setCurrentMenuId:Function, data:IHareViewContainers}) => {
  const {id, icon, title} = data;
  const ref = React.useRef(null);

  useEffect(() => {
    if (ref.current) {
      readFile(icon).then((content:string) => {
        // @ts-ignore
        ref.current.innerHTML = content;
      })
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
        <div ref={ref} className={(currentMenuId === id) ? "inside-button act-icon active" : "inside-button act-icon"} aria-hidden="true" />
        <div className={(currentMenuId === id) ? "inside-button active-indicator active" : "inside-button active-indicator"}></div>
        <div className='tooltip'>{title}</div>
    </li>
  );
};

export default ActivityBarEntry;