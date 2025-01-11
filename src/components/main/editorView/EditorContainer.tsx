import React, { useState, useEffect, useRef } from "react";
import { readFile } from "../../../API2";
import EditorTab from "./EditorTab";

import CodeMirror from "@uiw/react-codemirror";
import { basicSetup, EditorView } from "codemirror";
import { keymap } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import {
  defaultKeymap,
  indentLess,
  indentMore,
  indentWithTab,
} from "@codemirror/commands";
import { python, pythonLanguage } from "@codemirror/lang-python";
import {
  acceptCompletion,
  CompletionContext,
  completionStatus,
} from "@codemirror/autocomplete";
import { vsCodeDark } from "./theme";
import {
  IHareEditorContainer,
  IHareEditorEntry,
  Procurator,
} from "../../../helpers/Procurator";
import { subscribe, unsubscribe } from "../../../helpers/events";

const EditorContainer = ({}) => {
  const procurator = Procurator.getInstance();
  const [filesOpen, setFilesOpen] = useState<IHareEditorContainer | undefined>(
    undefined
  );
  const [code, setCode] = useState<string>("");
  const [update, setUpdate] = useState<boolean>(false);

  const editorRef = useRef<any>(null);

  const callback = () => {
    console.log("Callback");
    var fileOpen = procurator.context.filesEdited;
    setFilesOpen(procurator.context.filesEdited);
    if (fileOpen === undefined) {
      return;
    }

    if (fileOpen.editors[0] === undefined) {
      return;
    }

    console.log("subscribed", "Inside");

    readFile(fileOpen.editors[0].path).then((message: any) => {
      setCode(message);
      console.log("subscribed", message);
      setUpdate(true);
    });
  };

  useEffect(() => {
    subscribe("fileEditUpdate", callback);

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
      unsubscribe("fileEditUpdate", () => setFilesOpen(undefined));
      console.log("unsubscribed", "Top");
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
                    key: "Tab",
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
