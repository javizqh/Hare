import { memo, useRef, useEffect } from 'react';
import { Procurator, IHareMenuEntry } from '../../../helpers/Procurator.ts';
import { IHareCommand, IHareIcon } from '@hare-ide/hare';
import { readFile } from '../../../API2.tsx';

const procurator = Procurator.getInstance();

const Command = memo(({cmd} : {cmd: IHareCommand}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && cmd.icon) {
      let toLoad;
      if (cmd.icon.valueOf() instanceof Object) {
        //TODO: select proper theme
        var tmp = cmd.icon as IHareIcon;
        toLoad = tmp.dark;
      } else {
        toLoad = cmd.icon as string;
      }
      readFile(toLoad).then((content:string) => {
        // @ts-ignore
        ref.current.innerHTML = content;
      })
    }
  }, [])
  
  const clicked = (e:MouseEvent) => {
    procurator.commands.executeCommand(cmd.id);
    e.stopPropagation();
    procurator.context.select("", undefined, e)
  }

  return (
    <li id={cmd.id} className="command-icon has-tooltip" onClick={(e:any) => {clicked(e)}} title={cmd.title}>
        <div ref={ref} aria-hidden="true" />
        {/* <div className='tooltip'>{cmd.title}</div> */}
    </li>
  );
});

export default Command;
