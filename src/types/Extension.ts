import { IHareViewContainers, View } from "@hare-ide/hare";
import * as API2 from "../API2.tsx";
import { Procurator } from "./Procurator.ts";

export interface RustExtension {
  readonly root: string;
  readonly id: string;
  readonly version: string;
  readonly name: string;
  readonly description: string;
  readonly main: string;
  readonly activity_bar_menus: IHareViewContainers[];
  readonly views: View[];
}

//TODO: check for activation events

export class Extension{

    private readonly root: string;
    private readonly id: string;
    private readonly version: string;
    private readonly name: string;
    private readonly description: string;
    private source: Promise<any> | null = null;

    public constructor(data:RustExtension) {
      this.root = data.root;

      this.id = data.id;
      this.version = data.version;
      this.name = data.name;
      this.description = data.description;

      this.activateExtension(data.main);
    }

    private async activateExtension(file:string): Promise<void> {
      // TODO: pass context
      this.source = this.doimport(file)
      var procurator = Procurator.getInstance();
      this.source.then(extension => extension.activate(procurator))
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