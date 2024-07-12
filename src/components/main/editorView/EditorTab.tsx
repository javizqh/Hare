import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {readFile} from "../../../API";

const EditorTab = ({tab, openFileInEditor} : {tab:any, openFileInEditor:any}) => {

	const handleClick = (tab:any) => {
		tab.current =true;
		openFileInEditor(tab);
  }

	return (
		<div className={(tab.current) ? "editor-tab-entry editor-tab-entry-selected" : "editor-tab-entry editor-tab-entry-unselected"} onClick={() => {handleClick(tab)}}>{tab.name}</div>
	);
};

export default EditorTab;
