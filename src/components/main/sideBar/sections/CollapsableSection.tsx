import React, { useState, useEffect, useRef, useMemo } from 'react';
import {hare} from "../../../../hare.d.ts";
import TreeItem from './TreeItem.tsx';

const CollapsableSection = ({data} : {data:hare.IHareView}) => {
  const [open, isOpen] = useState<boolean>(false);
  console.log(data.viewProvider?.getChildren())

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
      {open && data.viewProvider?.getChildren() &&
        <>
          {data.viewProvider.getChildren()!.map((entry:any) => {
            return (
              <TreeItem
                viewProvider={data.viewProvider}
                item={entry}
                depth={0}
              />
            )})
          }
        </>
      }
    </div>
  );
};

export default CollapsableSection;
