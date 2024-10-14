import React, { useState, useEffect, useRef, useMemo } from 'react';
import {hare} from "../../../../hare.d.ts";
import TreeItem from './TreeItem.tsx';

const CollapsableSection = ({data, parent} : {data:hare.IHareView, parent:string}) => {
  const [open, isOpen] = useState<boolean>(false);
  const [children, setChildren] = useState<any>(null);

  useEffect(() => {
    data.viewProvider?.getChildren().then((content:hare.ProviderResult<any>) => {
      setChildren(content)
    })
  }, []);

  const handleKeyDown = (e:any) => {
    console.log(e)
    switch (e.keyCode) {
      case 46:
        // Delete
        console.log("Delete",data.viewProvider.selected)
        break;
      case 113:
        // F2
        console.log(data.viewProvider.selected)
        break;
      default:
        break;
    }
  }

  return (
    <div id={data.id} className="sideBar-entry" style={{flexGrow: (open) ? 1 : 0 }}>
      <div className="sideBar-entry-title" onClick={() => isOpen(!open)}>
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="sideBar-entry-arrow" viewBox="0 0 24 24">
            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="sideBar-entry-arrow" viewBox="0 0 24 24">
            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
          </svg>
        )}
        <h2>{data.title}</h2>
        {open &&
        <div className='sideBar-entry-menu'>
          {/* Input should be a list */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="sideBar-entry-arrow" viewBox="0 0 24 24">
            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
          </svg>
        </div>
        }
      </div>
      {open && 
        <div className="sideBar-entry-content-container" onKeyDown={(e:any) => handleKeyDown(e)}>
          {children !== null && children!.map((entry:any) => {
            return (
              <TreeItem
                id={parent + "/" + data.id} // TODO: also add project name
                viewProvider={data.viewProvider}
                item={entry}
                depth={0}
              />
            )})
          }
        </div>
      }
    </div>
  );
};

export default CollapsableSection;
