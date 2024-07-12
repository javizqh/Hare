import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {readFile} from "../../../API";
import EditorTab from './EditorTab';

const EditorView = ({editorFileTabs, isOpen, openFileInEditor, closeFileInEditor} : {editorFileTabs:any, isOpen:boolean, openFileInEditor:any, closeFileInEditor:any}) => {

	const editorRef = useRef<any>(null);
	const [currentFile, setCurrentFile] = useState<any>("");
	const [code, setCode] = useState<any>("");
	const [language, setLanguage] = useState<any>("javascript");

	function handleEditorDidMount(editor:any, monaco:any) {
		// here is another way to get monaco instance
		// you can also store it in `useRef` for further usage
		editorRef.current = monaco;
	}

	const handleClick = (tab:any) => {
		tab.current =true;
		openFileInEditor(tab);
  }

	useEffect(() => {
		if (editorFileTabs.length !== 0) {
			let match = editorFileTabs.find((element:any) => {
				return element.current;
			})
			console.log(match);
			setCurrentFile(match)
			if (editorRef.current) {
				// console.log(editorRef.current)//.setScrollPosition({scrollTop: 0});
			}
		}
  }, [editorFileTabs]);

	useEffect(() => {
		if (currentFile !== "") {
			console.log(currentFile);
			readFile(currentFile.path).then((message:any) => {
				setCode(message);
			})
			.catch((error:any) => {
					console.error(error);
			});
			let newLanguage = 'javascript';
			const extension = currentFile.path.split('.').pop();
			if (['css', 'html', 'python', 'dart'].includes(extension)) {
				newLanguage = extension;
			}
			setLanguage(newLanguage);
		}
  }, [currentFile]);

	if (editorFileTabs.length !== 0) {
		return (
			<div id="editor-container" className = "editor-container">
				<div className="editor-tab-container">
				{ Object.entries(editorFileTabs).map((tab:any) => {
					return (
						<EditorTab tab={tab[1]} openFileInEditor={openFileInEditor} closeFileInEditor={closeFileInEditor}/>
					)
				})}
				</div>
				<div id="editor" className="editor">
					<Editor height="100%" theme="vs-dark" language={language} defaultValue="// some comment" value={code} onMount={handleEditorDidMount}/>
				</div>
			</div>
		)
	} else {
		return (
			<div id="editor-container" className = "editor-container"/>
		);
	}
};

export default EditorView;
