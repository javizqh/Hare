import {ExtensionContext, HareViewPanel, IHareCommand, IHareIcon, IHareIconPack, IHareView, IHareViewContainer, IHareViewContainers, TreeViewProvider, View} from "@hare-ide/hare"
import { load_extensions, readDir, readFile } from "../API2";
import { path } from "@tauri-apps/api";
import { RefObject } from "react";

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

interface ExtensionInstance {
  extension: ExtensionData,
  activationEvents?: string[], 
}

class ExtensionData implements ExtensionContext{
  public readonly root: string;
  public readonly id: string;
  public readonly version: string;
  public readonly name: string;
  public readonly main?: string;
  public readonly description: string;
  public source: Promise<any> | null = null;

  public commands: CommandContext;
  public window: WindowContext;
  public subscriptions: SubscriptionsContext;
  public project: ProjectContext;
  public extension: any; // Instance of the extension
  public disposables: any; // Class that will manage things to be removed when deactivated
  public readDir: Function; // TODO: temporary

  public constructor(
    commands: CommandContext,
    window: WindowContext,
    subscriptions: SubscriptionsContext,
    project: ProjectContext,
    data: RustExtension,
  ) {
    this.commands = commands;
    this.window = window;
    this.subscriptions = subscriptions;
    this.project = project;
    this.readDir = readDir; // TODO: temporary

    this.root = data.root;

    this.id = data.id;
    this.version = data.version;
    this.name = data.name;
    this.description = data.description;
    this.main = data.main;
  }

  public getAbsolutePath (relativePath:string): Promise<string> {
    // Returns absolute path of path relative to the extension
    return path.join(this.root, relativePath);
  }
}

export class Procurator{
  /** This class will manage all of the frontend and the commands 
    and subscriptions and everything else extensions related
    Singleton class
  */

  private static instance: Procurator;

  public commands: CommandContext;
  public window: WindowContext;
  public context: ExecutionContext; // This should be for view or viewItem for whens and handle selected things
  public subscriptions: SubscriptionsContext;
  public project: ProjectContext;
  public extensions: ExtensionInstance[] = [];

  private constructor() {
    this.commands = new CommandContext();
    this.window = new WindowContext();
    this.subscriptions = new SubscriptionsContext();
    this.project = new ProjectContext();
    this.context = new ExecutionContext();

    this.context.projectName = "My project" //TODO: load when opening project

    this.loadExtensions();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Procurator();
    return this.instance;
  }

  private async loadExtensions () {
    load_extensions().then((new_extensions:RustExtension[]) => {
      new_extensions.forEach(extension => {
        if (extension.primary_bar_menus) {
          extension.primary_bar_menus.forEach(viewContainer => {
              this.window.registerContainerView(HareViewPanel.PrimaryBar, viewContainer);
          })
        }

        if (extension.views) {
          extension.views.forEach(view => {
            this.window.registerView(view);
          })
        }

        this.extensions.push({
          extension: new ExtensionData(
            this.commands,
            this.window,
            this.subscriptions,
            this.project,
            extension),
          activationEvents: extension.activation_events
        })
      });
      //TODO: temporary
      this.activateExtensions();
    })
    .catch((error:any) => {
        console.error(error);
    });
  }

  private async activateExtensions() {
    this.extensions.forEach((ext: ExtensionInstance) => {
      if (ext.extension.main) {
        Procurator.activateExtension(ext.extension);
      }
    });
  }

  private static async activateExtension(ext: ExtensionData): Promise<void> {
    readFile(ext.root + "/" + ext.main).then((content:string) => {
      ext.source = Procurator.doimport(content)
      ext.source.then(extension => extension.activate(ext))
    })
  }

  private static doimport (str:string) {
    const blob = new Blob([str], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const module = import(/* @vite-ignore */ url)
    URL.revokeObjectURL(url) // GC objectURLs
    return module
  }

  public onKeyPress(e:any){
    //TODO: keybind and does not work if not something selected
    console.log(e)
    switch (e.keyCode) {
      case 46:
        // Delete
        break;
      case 113:
        // F2
        console.log("rename", this.context.selected)
        break;
      default:
        break;
    }
  }

}

class HareCommand implements IHareCommand {
  id: string;
  title: string;
  icon: IHareIcon | null;
  callback: Function | null;

  public constructor(
    id: string,
    title: string,
    icon: IHareIcon | null = null,
    callback: Function | null = null,
  ) {
    this.id = id;
    this.title = title;
    this.icon = icon;
    this.callback = callback;
  }

  public registerCallback(callback: Function, thisArg?: any) {
    this.callback = callback
  }

  public executeCallback(...rest: any[]): any {
    if (!this.callback) {
      return undefined
    }

    return this.callback(rest);
  }

  public isId(checkId: string): boolean {
    return this.id === checkId;
  }

  public isInternal(): boolean {
    return this.id[0] === "_";
  }
  
}

class CommandContext {
  /**This class will handle all of the command related features */

  private commands: HareCommand[] = [];

  constructor() {}

  /**
   * Registers the callback to the command to make it work
   *
   * @param id - Command id
   * @param callback - Command callback
   * @returns True if succesfull
   *
   */
  private registerCommand(id: string, callback:Function, thisArg?: any): boolean {
    this.commands.forEach((cmd: HareCommand) => {
      if (cmd.isId(id)) {
        cmd.registerCallback(callback, thisArg)
        return true;
      }
    });

    return false;
  }

  private executeCommand(id: string,...rest: any[]): any {
    this.commands.forEach((cmd: HareCommand) => {
      if (cmd.isId(id)) {
        return cmd.executeCallback(rest)
      }
    });
    return undefined
  }

  private getCommands(filterInternal: boolean): HareCommand[] {
    //TODO: maybe change internal filter to id.command filter
    let retVal: HareCommand[] = [];

    if (!filterInternal) {
      return this.commands
    }

    this.commands.forEach((cmd: HareCommand) => {
      if (!cmd.isInternal()) {
        retVal.push(cmd)
      }
    });

    return retVal;
  }
}

class WindowContext {
  /**This class will handle all of the window related features */
  private containerViews: IHareViewContainer;

  constructor() {
    this.containerViews = {primary_bar: [], panel: []};
  }

  public getContainerViews(viewPanel: HareViewPanel) : IHareViewContainers[] | [] {
    switch (viewPanel) {
      case HareViewPanel.PrimaryBar:
        return this.containerViews.primary_bar;
      case HareViewPanel.Panel:
        return this.containerViews.panel;
      default:
        //TODO: raise error
        break;
    }

    return [];
  }

  public registerContainerView(viewPanel: HareViewPanel, viewContainer: IHareViewContainers) {
    for (const panels of Object.values(this.containerViews) as IHareViewContainers[][]) {
      const found = panels.some((container: IHareViewContainers) => {
        if (container.id === viewContainer.id) {
          return true;
        }
      });

      if (found) {
        return;
      }
    }

    switch (viewPanel) {
      case HareViewPanel.PrimaryBar:
        if (viewContainer)
        this.containerViews.primary_bar.push(viewContainer);
        break;
      case HareViewPanel.Panel:
        this.containerViews.panel.push(viewContainer);
        break;
      default:
        //TODO: raise error
        break;
    }
  }

  public getContainerView(viewContainerId: string): IHareViewContainers | undefined {
    var views;
    for (const panels of Object.values(this.containerViews) as IHareViewContainers[][]) {
      const found = panels.some((container: IHareViewContainers) => {
        if (container.id === viewContainerId) {
          views = container;
          return true;
        }
      });

      if (found) {
        return views;
      }
    }

    return views;
  }

  public registerView(view: View) {
    const viewContainerId = view.parent;

    if (viewContainerId === undefined) {
      return;
    }

    //TODO: check if duplicate
    for (const panels of Object.values(this.containerViews) as IHareViewContainers[][]) {
      const duplicate = panels.some((container: IHareViewContainers) => {
        const foundIn = container.views.some((searchView:IHareView) => {
          if (searchView.id === view.id) {
            return true;
          }
        });
        
        if (foundIn) {
          return true;
        }
      });

      if (duplicate) {
        return;
      }
    }


    for (const panels of Object.values(this.containerViews) as IHareViewContainers[][]) {
      const found = panels.some((container: IHareViewContainers) => {
        if (container.id === viewContainerId) {
          // container.views.push({id:view.id, title:view.title, icon:view.icon, when:view.when, viewProvider:undefined})
          container.views.push({id:view.id, title:view.title, when:view.when, viewProvider:undefined})
          return true;
        }
      });

      if (found) {
        return;
      }
    }
  }

  public registerTreeViewProvider(id: string, treeViewProvider: TreeViewProvider<any>) {
    console.log("Registering")
    for (const panels of Object.values(this.containerViews) as IHareViewContainers[][]) {
      const found = panels.some((container: IHareViewContainers) => {
        const foundIn = container.views.some((view:IHareView) => {
          if (view.id === id) {
            view.viewProvider = treeViewProvider;
            return true;
          }
        });

        if (foundIn) {
          return true;
        }
      });

      if (found) {
        return;
      }
    }
  }
}

class SubscriptionsContext {
  /**This class will handle all of the event related features */

  constructor() {
    
  }
}

class ProjectContext {
  /**This class will handle all of the project and project config related features */

  constructor() {
    
  }
}

interface Selection {
  id: string,
  ref: HTMLDivElement
}

class ExecutionContext {
  /**This class will handle all of the context and menus selected during execution */

  public projectName: string = "";
  public view: string = "";
  public viewItem: string = "";
  public selected: Selection[] = [];

  constructor() {
    
  }

  public substituteValue (value:string) {
    let regex = /\$\([^)]*\)/i;
    if (!regex.test(value)) {
      return value
    }

    let substitute = value.slice(2, -1)

    switch (substitute) {
      case "projectName":
        return this.projectName;
      default:
        break;
    }

    return value
  }

  public select (id: string, ref: HTMLDivElement, e:MouseEvent) {
    if (e.ctrlKey) {
      // Append new id or remove it if found
      var duplicate = this.selected.find(item => item.id === id);
      if (duplicate) {
        // Remove Id
        this.selected = this.selected.filter(obj => obj.id !== id);
        try {
          ref.classList.remove("selected")
        } catch (error) {}
        return
      } else {
        this.selected.unshift({id, ref});
        ref.classList.add("selected")
      }
    } else {
      // Unselect all other elements
      this.selected.forEach(element => {
        try {
          element.ref.classList.remove("selected")
        } catch (error) {}
      });
      this.selected = [{id, ref}];
    }

    console.log(this.selected)
    ref.classList.add("selected")
  }

}

