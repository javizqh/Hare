import React, { useState, useEffect, useRef } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { basicSetup, EditorView } from 'codemirror';
import { keymap } from '@codemirror/view';
import { defaultKeymap, indentLess, indentMore, indentWithTab } from '@codemirror/commands';
import { python, pythonLanguage } from '@codemirror/lang-python';
import { acceptCompletion, CompletionContext, completionStatus } from '@codemirror/autocomplete';
import { vsCodeDark } from './theme';
import { Procurator } from '../../../helpers/Procurator';

import Markdown from "marked-react";
import { IHareEditorEntry } from '../../../helpers/editors/editor';

const EditorEntry = ({ code, file }: { code: string; file: IHareEditorEntry | undefined }) => {
  const procurator = Procurator.getInstance();

  const editorRef = useRef<any>(null);

  // useEffect(() => {
  //   // const startState = EditorState.create({
  //   // 	doc: code,
  //   // 	extensions: [
  //   // 		basicSetup,
  //   // 		keymap.of([{
  //   // 			key: 'Tab',
  //   // 			preventDefault: true,
  //   // 			shift: indentLess,
  //   // 			run: e => {
  //   // 				if (!completionStatus(e.state)) return indentMore(e);
  //   // 				return acceptCompletion(e);
  //   // 			},
  //   // 		},]),
  //   // 		oneDark,
  //   // 		python(),
  //   // 		pythonLanguage
  //   // 	],
  //   // });

  //   // const view = new EditorView({ state: startState, parent: editorRef.current });

  //   return () => {
  //     // view.destroy();
  //   };
  // }, []);

  useEffect(() => {
    console.log('update', file);
    if (file === undefined) {
      return;
    }

    if (file.name === 'README.md') {
    }
  }, [code, file]);

  return (
    <div id="editor" className="editor" ref={editorRef}>
      {file !== undefined && file.name === 'README.md' ? (
        <Markdown gfm={true}>{code}</Markdown>
      ) : (
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
      )}
    </div>
  );
};

export default EditorEntry;
