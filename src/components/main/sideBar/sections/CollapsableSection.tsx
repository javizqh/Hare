import { useState, useEffect, useRef, memo } from 'react';
import { IHareView, ProviderResult } from '@hare-ide/hare';
import TreeItemComponent from './TreeItemComponent.tsx';
import { Procurator } from '../../../../helpers/Procurator.ts';
import MenuBar from './MenuBar.tsx';

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

  const onFocus = () => {
    procurator.context.view = data.id;
  }

  const onLostFocus = () => {
    procurator.context.view = "";
  }

  return (
    <div id={data.id} className="entry" style={{flexGrow: (open) ? 1 : 0 }} onFocus={() => onFocus()} onBlur={() => onLostFocus()}>
      <div className="title-container" onClick={() => isOpen(!open)}>
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="collapse-indicator" viewBox="0 0 24 24">
            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="collapse-indicator" viewBox="0 0 24 24">
            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
          </svg>
        )}
        {title.current &&
          <h2>{title.current}</h2>
        }
        {open &&
          <MenuBar menuId={"view/title"} context={{view: data.id}}/>
        }
      </div>
      {open && 
        <div className="content-container">
          {children !== null && children!.map((entry:any) => {
            return (
              <TreeItemComponent
                id={parent + "/" + data.id} // TODO: also add project name
                viewProvider={data.viewProvider!}
                item={entry}
                depth={0}
                context={{view: data.id}}
              />
            )})
          }
        </div>
      }
    </div>
  );
});

export default CollapsableSection;
