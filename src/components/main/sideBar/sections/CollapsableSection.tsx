import React, { useState, useEffect, useRef } from 'react';

const CollapsableSection = ({title, menu, children} : {title:string, menu:any, children:any}) => {
  const [open, isOpen] = useState<boolean>(true);

  return (
    <div className="sideBar-entry" style={{flexGrow: (open) ? 1 : 0 }}>
      <div className="sideBar-entry-title" onClick={() => isOpen(!open)}>
        <h2>{title}</h2>
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
