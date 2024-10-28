import React, { useState, useEffect, useRef } from 'react';

const TitleBar = ({title} : {title:string}) => {

    return (
      <div className="title-container">
        <div className="title">
          <h2>{title}</h2>
        </div>
      </div>
    );
};

export default TitleBar;
