import React, { useState, useEffect, useRef } from 'react';
import {readFile} from "../../../API2";
import EditorTab from './EditorTab';

import CodeMirror from "@uiw/react-codemirror";
import {basicSetup, EditorView} from "codemirror"
import {keymap} from "@codemirror/view"
import {EditorState, Compartment} from "@codemirror/state"
import { defaultKeymap, indentLess, indentMore, indentWithTab } from '@codemirror/commands';
import { python, pythonLanguage } from '@codemirror/lang-python';
import {acceptCompletion, CompletionContext, completionStatus} from "@codemirror/autocomplete";
import { oneDark } from './theme';

const EditorContainer = ({editorFileTabs, isOpen, openFileInEditor, closeFileInEditor} : {editorFileTabs:any, isOpen:boolean, openFileInEditor:any, closeFileInEditor:any}) => {

	const editorRef = useRef<any>(null);
	const [currentFile, setCurrentFile] = useState<any>("");
	const [code, setCode] = useState<any>("");
	const [language, setLanguage] = useState<any>("javascript");

  useEffect(() => {
    const startState = EditorState.create({
      doc: 'Hello World',
      extensions: [
        basicSetup,
        keymap.of([{
          key: 'Tab',
          preventDefault: true,
          shift: indentLess,
          run: e => {
            if (!completionStatus(e.state)) return indentMore(e);
            return acceptCompletion(e);
          },
        },]),
        oneDark,
				python(),
				pythonLanguage
      ],
    });

    const view = new EditorView({ state: startState, parent: editorRef.current });

    return () => {
      view.destroy();
    };
  }, []);

	// function myCompletions(context: CompletionContext) {
	// 	let word = context.matchBefore(/\w*/)
	// 	if (word.from == word.to && !context.explicit)
	// 		return null
	// 	return {
	// 		from: word.from,
	// 		options: [
	// 			{label: "match", type: "keyword"},
	// 			{label: "hello", type: "variable", info: "(World)"},
	// 			{label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro"}
	// 		]
	// 	}
	// }

	// function handleEditorDidMount(editor:any, monaco:any) {
	// 	// here is another way to get monaco instance
	// 	// you can also store it in `useRef` for further usage
	// 	// editorRef.current = monaco;
	// }

	// const handleClick = (tab:any) => {
	// 	tab.current =true;
	// 	openFileInEditor(tab);
  // }

	// useEffect(() => {
	// 	if (editorFileTabs.length !== 0) {
	// 		let match = editorFileTabs.find((element:any) => {
	// 			return element.current;
	// 		})
	// 		console.log(match);
	// 		setCurrentFile(match)
	// 		if (editorRef.current) {
	// 			// console.log(editorRef.current)//.setScrollPosition({scrollTop: 0});
	// 			// editorRef.current.revealLine(0);
	// 		}
	// 	}
  // }, [editorFileTabs]);

	// useEffect(() => {
	// 	if (currentFile !== "") {
	// 		console.log(currentFile);
	// 		readFile(currentFile.path).then((message:any) => {
	// 			setCode(message);
	// 		})
	// 		.catch((error:any) => {
	// 				console.error(error);
	// 		});
	// 		let newLanguage = 'javascript';
	// 		const extension = currentFile.path.split('.').pop();
	// 		if (['css', 'html', 'python', 'dart'].includes(extension)) {
	// 			newLanguage = extension;
	// 		}
	// 		if (extension === 'tsx') {
	// 			setLanguage("typescript");
	// 		} else {
	// 			setLanguage(newLanguage);
	// 		}
	// 	}
  // }, [currentFile]);

	return (
		<div id="editor-container" className = "editor-container">
			{(editorFileTabs.length !== 0) &&
			<>
				<div className="editor-tab-container">
				{ Object.entries(editorFileTabs).map((tab:any) => {
					return (
						<EditorTab tab={tab[1]} openFileInEditor={openFileInEditor} closeFileInEditor={closeFileInEditor}/>
					)
				})}
				</div>
				<div id="editor" className="editor" ref={editorRef}>
					{/* <CodeMirror
						value='Hello world'
						extensions={[
							basicSetup,
							// keymap.of([defaultKeymap, indentWithTab]),
							oneDark,
							cpp()
						]}
					/> */}
					{/* <Editor
						height="100%"
						theme="vs-dark"
						language={language}
						defaultValue=""
						value={code}
						onMount={handleEditorDidMount}/>
					<DiffEditor
						original={code}
						modified={"modifiedCode"}
						height="100%"
						theme="vs-dark"
						language="javascript"
					/> */}
				</div>
			</>
			}
		</div>
	)
};

export default EditorContainer;
