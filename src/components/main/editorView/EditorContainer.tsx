import { useState, useEffect, useRef } from 'react';

import { Procurator } from '../../../helpers/Procurator';
import { subscribe, unsubscribe } from '../../../helpers/events';
import { IHareIcon } from '@hare-ide/hare';
import {
  EditorOrientation,
  IHareEditorContainer,
  IHareEditorContainerEvents,
  IHareEditorInstance,
} from '../../../helpers/editors/editor';
import EditorInstace from './EditorInstance';

const EditorContainer = ({ id = 0 }: { id: number }) => {
  const procurator = Procurator.getInstance();
  const [type, setType] = useState<string>('editor-hor');
  const instancesRef = useRef<JSX.Element[]>([]);
  const [update, setUpdate] = useState<boolean>(false);

  const deleteInstance = (e: CustomEvent<IHareEditorContainerEvents>) => {
    var container = procurator.window.getEditorContainer(id);

    if (container === undefined || instancesRef.current === undefined) {
      return
    }

    console.log('Delete inst: ', e.detail.instance, e.detail.index);
    console.log('Delete cont: ', e.detail.containers);

    if (e.detail.instance !== undefined) {
      instancesRef.current =
        instancesRef.current.filter(a => (a.key?.includes('instance') && a.props.id !== e.detail.instance?.id) || a.key?.includes('container'))
      ;
    } else if (e.detail.containers) {
      instancesRef.current =
        instancesRef.current.filter(a => (a.key?.includes('container') && a.props.id !== e.detail.containers?.id) || a.key?.includes('instance'))
      ;
    }

    setUpdate(true);
  };

  const addInstance = (e: CustomEvent<IHareEditorContainerEvents>) => {
    var container = procurator.window.getEditorContainer(id);

    if (container === undefined || instancesRef.current === undefined) {
      return
    }
    console.log('Adding inst: ', e.detail.instance, e.detail.index);
    console.log('Adding cont: ', e.detail.containers);

    setType(container.orientation === EditorOrientation.HORIZONTAL ? 'editor-hor' : 'editor-ver');

    if (e.detail.instance) {
      for (const a of instancesRef.current) {
        if (a.key?.includes('container') && a.props.id === e.detail.containers?.id) {
          console.log("already inside")
          return;
        }
      }

      var new_array:JSX.Element[]  = []
      // BUG: it deletes the first one
      console.log(e.detail)
      if (e.detail.index === instancesRef.current.length) {
        new_array = [
          ...instancesRef.current,
          <EditorInstace id={e.detail.instance.id} key={'editor-instance-'+e.detail.instance.id} />,
        ];
      } else if (e.detail.index === 0) {
        new_array = [
          <EditorInstace id={e.detail.instance.id} key={'editor-instance-'+e.detail.instance.id} />,
          ...instancesRef.current,
        ];
      } else {
        new_array = [
          ...instancesRef.current.slice(0, e.detail.index),
          <EditorInstace id={e.detail.instance.id} key={'editor-instance-'+e.detail.instance.id} />,
          ...instancesRef.current.slice(e.detail.index),
        ];
      }
      instancesRef.current = new_array
    } else if (e.detail.containers) {
      const new_array = [
        ...instancesRef.current.slice(0, e.detail.index),
        <EditorContainer id={e.detail.containers.id} key={'editor-container-'+e.detail.containers.id} />,
        ...instancesRef.current.slice(e.detail.index),
      ];
      instancesRef.current = new_array
    }


    setUpdate(true);
  };

  useEffect(() => {
    subscribe('hare.editor.container' + id + '.add', addInstance);
    subscribe('hare.editor.container' + id + '.delete', deleteInstance);
    console.log("AAAAAAAAAAAAAA")

    var container = procurator.window.getEditorContainer(id);

    if (container !== undefined && instancesRef.current !== undefined) {
      setType(container.orientation === EditorOrientation.HORIZONTAL ? 'editor-hor' : 'editor-ver');
      for (const instance of container.editors) {
        if ('order' in instance) {
          instancesRef.current = [...instancesRef.current,<EditorInstace id={instance.id} key={'editor-instance-'+instance.id} />];
        } else {
          throw new Error("Container inside on load");
        }
      }
    }

    return () => {
      unsubscribe('hare.editor.container' + id + '.add', () => instancesRef.current = []);
      unsubscribe('hare.editor.container' + id + '.delete', () => instancesRef.current = []);
    };
  }, []);

  useEffect(() => {
    if (update) {
      console.log('FORCE UPDATE Cont');
      setUpdate(false);
    }
  }, [update]);

  return (
    <div id="editor-container" className={'editor-container ' + type}>
      {instancesRef.current && instancesRef.current.map((entry:any) => {
        return entry
      })}
    </div>
  );
};

export default EditorContainer;
