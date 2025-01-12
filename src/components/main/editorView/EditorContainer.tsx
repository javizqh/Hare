import React, { useState, useEffect, useRef } from 'react';
import { readFile } from '../../../API2';
import EditorTab from './EditorTab';

import CodeMirror from '@uiw/react-codemirror';
import { basicSetup, EditorView } from 'codemirror';
import { keymap } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, indentLess, indentMore, indentWithTab } from '@codemirror/commands';
import { python, pythonLanguage } from '@codemirror/lang-python';
import { acceptCompletion, CompletionContext, completionStatus } from '@codemirror/autocomplete';
import { vsCodeDark } from './theme';
import { IHareEditorContainer, IHareEditorEntry, Procurator } from '../../../helpers/Procurator';
import { subscribe, unsubscribe } from '../../../helpers/events';

const EditorContainer = ({}) => {
  const procurator = Procurator.getInstance();
  const [filesOpen, setFilesOpen] = useState<IHareEditorContainer | undefined>(undefined);
  const [code, setCode] = useState<string>('');
  const [update, setUpdate] = useState<boolean>(false);

  const editorRef = useRef<any>(null);

  const callback = () => {
    var fileOpen = procurator.window.getFilesEdit();
    console.log('Callback', fileOpen);
    setFilesOpen(fileOpen);

    var current = undefined;

    for (let index = 0; index < fileOpen.editors.length; index++) {
      const element = fileOpen.editors[index];
      if (element.order === 0) {
        current = element
        break;
      }

    }

    if (current === undefined) {
      setUpdate(true)
      return;
    }

    readFile(current.path).then((message: string) => {
      setCode(message);
      setUpdate(true)
    });
  };

  useEffect(() => {
    subscribe('fileEditUpdate', callback);

    // const startState = EditorState.create({
    // 	doc: code,
    // 	extensions: [
    // 		basicSetup,
    // 		keymap.of([{
    // 			key: 'Tab',
    // 			preventDefault: true,
    // 			shift: indentLess,
    // 			run: e => {
    // 				if (!completionStatus(e.state)) return indentMore(e);
    // 				return acceptCompletion(e);
    // 			},
    // 		},]),
    // 		oneDark,
    // 		python(),
    // 		pythonLanguage
    // 	],
    // });

    // const view = new EditorView({ state: startState, parent: editorRef.current });

    return () => {
      // view.destroy();
      unsubscribe('fileEditUpdate', () => setFilesOpen(undefined));
    };
  }, []);

  useEffect(() => {
    console.log("update");
    if (update) {
      setUpdate(false);
    }
  }, [update]);

  return (
    <div id="editor-container" className="editor-container">
      {filesOpen && filesOpen.editors.length !== 0 && (
        <>
          <div className="editor-tab-container">
            {filesOpen.editors.map((tab: IHareEditorEntry) => {
              return <EditorTab tab={tab} />;
            })}
          </div>
          <div id="editor" className="editor" ref={editorRef}>
            <CodeMirror
              value={code}
              theme={vsCodeDark}
              extensions={[
                basicSetup,
                keymap.of([
                  {
                    key: 'Tab',
                    preventDefault: true,
                    shift: indentLess,
                    run: (e) => {
                      if (!completionStatus(e.state)) return indentMore(e);
                      return acceptCompletion(e);
                    },
                  },
                ]),
                python(),
                pythonLanguage,
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EditorContainer;
