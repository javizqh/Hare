import React, { useState, useEffect, useRef } from 'react';

const TitleBar = ({title} : {title:string}) => {

    return (
      <div className="sideBar-title">
        <div className="sideBar-title-label">
          <h2>{title}</h2>
        </div>
      </div>
    );
};

export default TitleBar;
