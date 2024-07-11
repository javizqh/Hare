import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {readFile} from "../../../API";

const EditorView = ({file, isOpen} : {file:any, isOpen:boolean}) => {

	const editorRef = useRef<any>(null);
	const [code, setCode] = useState<any>("");
	const [language, setLanguage] = useState<any>("javascript");

	function handleEditorDidMount(editor:any, monaco:any) {
		// here is another way to get monaco instance
		// you can also store it in `useRef` for further usage
		editorRef.current = monaco;
	}

    useEffect(() => {
      if (file !== "") {
        console.log(file);
        readFile(file).then((message:any) => {
          setCode(message);
        })
        .catch((error:any) => {
            console.error(error);
        });
        let newLanguage = 'javascript';
        const extension = file.split('.').pop();
        if (['css', 'html', 'python', 'dart'].includes(extension)) {
          newLanguage = extension;
        }
        setLanguage(newLanguage);
		if (editorRef.current) {
			// console.log(editorRef.current)//.setScrollPosition({scrollTop: 0});
		}
      }
  }, [file]);

	if (file !== "") {
		return (
			<div id="editor-container" className = "editor-container">
				<div id="files-in-editor" className="files-in-editor">{file}</div>
				<div id="editor" className="editor">
					<Editor height="100%" theme="vs-dark" language={language} defaultValue="// some comment" value={code} onMount={handleEditorDidMount}/>
				</div>
			</div>
		)
	} else {
		return (
			<div id="editor-container" className = "editor-container">
				<svg id="splash-icon" className="splash-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"/>
				</svg>
			</div>
		);
	}
};

export default EditorView;
