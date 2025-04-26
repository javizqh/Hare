import React, { useState, useEffect, useRef } from 'react';
import { readFile } from '../../../API2';
import EditorTab from './EditorTab';
import EditorEntry from './EditorEntry';

import { Procurator } from '../../../helpers/Procurator';
import { subscribe, unsubscribe } from '../../../helpers/events';
import { IHareIcon } from '@hare-ide/hare';
import { IHareEditorEntry, IHareEditorInstance } from '../../../helpers/editors/editor';

interface EditorTabFrame {
  preName: string;
  postName: string;
  title: string;
  icon: IHareIcon | undefined;
  onOpen: Function;
}

interface EditorInstaceFrame {
  init: Function;
  onCode: Function;
  onChange: Function;
  unload: Function;
}

const EditorInstace = ({ id }: { id: number }) => {
  const procurator = Procurator.getInstance();
  const [instance, setInstance] = useState<IHareEditorInstance | undefined>(undefined);
  const [code, setCode] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<IHareEditorEntry | undefined>(undefined);
  const [update, setUpdate] = useState<boolean>(false);

  const callback = () => {
    var instance = procurator.window.getFilesEditor(id);
    console.log('Updating instance', id, instance);
    if (instance === undefined) {
      return;
    }

    setInstance(instance);

    var current: IHareEditorEntry | undefined = undefined;

    for (let index = 0; index < instance.entries.length; index++) {
      const element = instance.entries[index];
      if (element.order === 0) {
        current = element;
        break;
      }
    }
    console.log(current);

    if (current === undefined) {
      setUpdate(true);
      return;
    }

    readFile(current.path).then((message: string) => {
      setCode(message);
      setCurrentFile(current);
      setUpdate(true);
    });
  };

  useEffect(() => {
    subscribe('fileEditor' + id + 'Update', callback);
    callback();
    return () => {
      unsubscribe('fileEditor' + id + 'Update', () => setInstance(undefined));
    };
  }, []);

  useEffect(() => {
    if (update) {
      console.log('FORCE UPDATE INST', id);
      setUpdate(false);
    }
  }, [update]);

  useEffect(() => {
    console.log('REALLY BAD');
  }, [id]);

  return (
    <div
      className={
        instance && instance.order === 0
          ? 'editor-instance'
          : 'editor-instance editor-instance-inactive'
      }
      id={'editor-instance-' + id}
    >
      {instance && instance.entries.length !== 0 && (
        <>
          <div className="editor-tab-container">
            {instance.entries.map((tab: IHareEditorEntry) => {
              return <EditorTab tab={tab} />;
            })}
          </div>
          <EditorEntry code={code} file={currentFile} />
        </>
      )}
    </div>
  );
};

export default EditorInstace;
