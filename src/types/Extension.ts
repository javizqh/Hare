import { IHareIcon, IHareIconPack, IHareViewContainers, View } from "@hare-ide/hare";
import {readFile} from "../API2.tsx";
import { Procurator } from "./Procurator.ts";
interface RustCommand {
  command: string,
  title: string,
  icon?: IHareIcon,
  category?: string,
}

interface RustMenu {
  parent: string, // Which menu is the parent
  command: string,
  when: string,
  group?: string,
}

interface RustConfigurations {
  id: string,
  title: string,
  order?: number,
  properties: string,
}

export interface RustExtension {
  readonly root: string;
  readonly id: string;
  readonly version: string;
  readonly name: string;
  readonly description: string;
  readonly main?: string;
  readonly activation_events?: string[];
  readonly primary_bar_menus?: IHareViewContainers[];
  readonly panel_menus?: IHareViewContainers[];
  readonly views?: View[];
  readonly icon_packs?: IHareIconPack[];
  readonly commands?: RustCommand[];
  readonly menus?: RustMenu[];
  readonly configurations?: RustConfigurations[];
}

//TODO: check for activation events

export class Extension{

    private readonly root: string;
    private readonly id: string;
    private readonly version: string;
    private readonly name: string;
    private readonly main?: string;
    private readonly description: string;
    private source: Promise<any> | null = null;

    public constructor(data:RustExtension) {
      this.root = data.root;

      this.id = data.id;
      this.version = data.version;
      this.name = data.name;
      this.description = data.description;
      this.main = data.main;

      if (data.main) {
        this.activateExtension();
      }
    }

    private async activateExtension(): Promise<void> {
      readFile(this.root + "/" +this.main).then((content:string) => {
        this.source = this.doimport(content)
        // TODO: pass context
        var procurator = Procurator.getInstance();
        this.source.then(extension => extension.activate(procurator))
      })
    }

    private doimport (str:string) {
      const blob = new Blob([str], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      const module = import(/* @vite-ignore */ url)
      URL.revokeObjectURL(url) // GC objectURLs
      return module
    }

    public getId(): string {
      return this.id;
    }
}