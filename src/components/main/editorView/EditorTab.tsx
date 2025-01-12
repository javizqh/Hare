import { useEffect, useRef } from 'react';
import { readFile } from '../../../API2';
import { IHareEditorEntry, Procurator } from '../../../helpers/Procurator';

const EditorTab = ({ tab }: { tab: IHareEditorEntry }) => {
  const procurator = Procurator.getInstance();
  const ref = useRef<HTMLDivElement | null>(null);

  const handleClick = (tab: any) => {
    console.log('Open');
    procurator.window.updateFileEditOrder(tab);
  };

  const handleClose = (tab: any) => {
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
    <div
      className={
        tab.order === 0
          ? 'editor-tab-entry editor-tab-entry-selected'
          : 'editor-tab-entry editor-tab-entry-unselected'
      }
      onClick={(e) => {
        if (e.currentTarget != e.target) return;
        handleClick(tab);
      }}
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
          handleClose(tab);
        }}
      >
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
      </svg>
    </div>
  );
};

export default EditorTab;
