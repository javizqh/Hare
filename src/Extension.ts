import * as hare from "./api.tsx";

export interface RustExtension {
  readonly root: string;
  readonly id: string;
  readonly version: string;
  readonly name: string;
  readonly description: string;
  readonly main: string;
  readonly activity_bar_menus: hare.activityBarMenu[];
  readonly side_bar_menus: hare.sideBarMenu[];
}

export class Extension{

    private readonly root: string;
    private readonly id: string;
    private readonly version: string;
    private readonly name: string;
    private readonly description: string;
    private source: Promise<any> | null = null;
    private readonly activityBarMenus: hare.activityBarMenu[];
    private readonly sideBarMenus: hare.sideBarMenu[];

    public constructor(data:RustExtension) {
      console.log(data)
      this.root = data.root;

      this.id = data.id;
      this.version = data.version;
      this.name = data.name;
      this.description = data.description;
      this.activityBarMenus = data.activity_bar_menus;
      this.sideBarMenus = data.side_bar_menus;

      this.activateExtension(data.main);
    }

    private async activateExtension(file:string): Promise<void> {
      // TODO: pass context
      this.source = this.doimport(file)
      this.source.then(extension => extension.activate(" a"))
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

    public getActivityBar(): hare.activityBarMenu[] {
      return this.activityBarMenus;
    }

    public getSideBar(): hare.sideBarMenu[] {
      return this.sideBarMenus;
    }
}