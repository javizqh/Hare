import { useEffect, useRef } from 'react';
import { readFile } from '../../../API2';
import { Procurator } from '../../../helpers/Procurator';
import { IHareEditorEntry } from '../../../helpers/editors/editor';
import { useDrag } from 'react-dnd';

const EditorTab = ({ tab, instanceId }: { tab: IHareEditorEntry, instanceId:number }) => {
  const procurator = Procurator.getInstance();
  const ref = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "hare.editor.tab",
    item: { entry:tab, id:instanceId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = (e:MouseEvent, tab: IHareEditorEntry) => {
    console.log('Open');
    procurator.window.updateFileEditOrder(tab);
    if (selectRef.current) {
      procurator.context.select(tab.path, selectRef.current, e)
    }
  };

  const handleClose = (e:MouseEvent, tab: IHareEditorEntry) => {
    procurator.window.removeFileEdit(tab);
  };

  const loadIcon = () => {
    if (ref.current) {
      //TODO: icon packs
      //TODO: if no icon pack and default do not load from file
      const iconSVG = procurator.window.substituteIcon('', 'file', tab.name, 0);

      if (typeof iconSVG === 'string') {
        readFile(iconSVG).then((content: string) => {
          // @ts-ignore
          ref.current.innerHTML = content;
        });
      } else {
        ref.current.childNodes.forEach((element) => {
          ref.current!.removeChild(element);
        });
        ref.current.appendChild(iconSVG);
      }
    }
  };

  useEffect(() => {
    loadIcon();
  }, [tab]);

  // Tab entry { tab icon (22x22px), tab name, tab changes (hover or selected (color white) tab close (16x16px + 2padd))}

  return (
    <div ref={drag}>
    <div
      className={
        tab.order === 0
          ? 'editor-tab-entry editor-tab-entry-selected'
          : 'editor-tab-entry editor-tab-entry-unselected'
      }
      onClick={(e:any) => {
        if (e.currentTarget != e.target) return;
        handleClick(e,tab);
      }}
      ref={selectRef}
    >
      <div ref={ref} className="editor-tab-entry-icon" aria-hidden="true" />
      <div
        className={`editor-tab-entry-label ${
          tab.isPreview ? 'editor-tab-entry-label-preview' : ''
        }`}
      >
        {tab.name}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#ffffff"
        className={
          tab.order === 0
            ? 'editor-tab-entry-close'
            : 'editor-tab-entry-close editor-tab-entry-close-hidden'
        }
        viewBox="0 0 16 16"
        onClick={(e: any) => {
          e.stopPropagation();
          handleClose(e,tab);
        }}
      >
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
      </svg>
    </div>
    </div>
  );
};

export default EditorTab;
