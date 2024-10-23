import { useState, useEffect, useRef, memo } from 'react';
import { IHareView, ProviderResult } from '@hare-ide/hare';
import TreeItemComponent from './TreeItemComponent.tsx';
import { Procurator } from '../../../../helpers/Procurator.ts';

const procurator = Procurator.getInstance();

const CollapsableSection = memo(({data, parent} : {data:IHareView, parent:string}) => {
  const [open, isOpen] = useState<boolean>(false);
  const [children, setChildren] = useState<any>(null);
  const title = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (data.viewProvider) {
      Promise.resolve(data.viewProvider.getChildren())!.then((content:ProviderResult<any>) => {
        setChildren(content)
        title.current = procurator.context.substituteValue(data.title);
      })
    }
  }, []);

  const handleKeyDown = (e:any) => {
    if (! data.viewProvider) {
      return
    }
    console.log(e)
    switch (e.keyCode) {
      case 46:
        // Delete
        console.log("Delete",data.viewProvider.selected)
        break;
      case 113:
        // F2
        console.log(data.viewProvider.selected)
        break;
      default:
        break;
    }
  }

  const onFocus = () => {
    procurator.context.view = data.id;
  }

  const onLostFocus = () => {
    procurator.context.view = "";
  }

  return (
    <div id={data.id} className="sideBar-entry" style={{flexGrow: (open) ? 1 : 0 }} onFocus={() => onFocus()} onBlur={() => onLostFocus()}>
      <div className="sideBar-entry-title" onClick={() => isOpen(!open)}>
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="sideBar-entry-arrow" viewBox="0 0 24 24">
            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="sideBar-entry-arrow" viewBox="0 0 24 24">
            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
          </svg>
        )}
        {title.current &&
          <h2>{title.current}</h2>
        }
        {open &&
        <div className='sideBar-entry-menu'>
          {/* Input should be a list */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="sideBar-entry-arrow" viewBox="0 0 24 24">
            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
          </svg>
        </div>
        }
      </div>
      {open && 
        <div className="sideBar-entry-content-container" onKeyDown={(e:any) => handleKeyDown(e)}>
          {children !== null && children!.map((entry:any) => {
            return (
              <TreeItemComponent
                id={parent + "/" + data.id} // TODO: also add project name
                viewProvider={data.viewProvider!}
                item={entry}
                depth={0}
              />
            )})
          }
        </div>
      }
    </div>
  );
});

export default CollapsableSection;
