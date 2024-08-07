import React, { useState, useEffect, useRef } from 'react';

const CollapsableSection = ({title, menu, children} : {title:string, menu:any, children:any}) => {
  const [open, isOpen] = useState<boolean>(false);

  return (
    <div className="sideBar-entry" style={{flexGrow: (open) ? 1 : 0 }}>
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
        <h2>{title}</h2>
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
        <div className="sideBar-entry-contents">
          {children}
        </div>
      }
    </div>
  );
};

export default CollapsableSection;
