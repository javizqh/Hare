import {ExtensionContext, HareViewPanel, IHareCommand, IHareIcon, IHareIconPack, IHareIconRegex, IHareView, IHareViewContainer, IHareViewContainers, TreeItemState, TreeViewProvider, View} from "@hare-ide/hare"
import { executeBackend, load_extensions, readDir, readFile } from "../API2";
import { path } from "@tauri-apps/api";
import substituteDefault from "../assets/Icons";
import when from "./functions/when";

interface RustCommand {
  command: string,
  title: string,
  icon?: IHareIcon | string,
  category?: string,
  when?: string
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

interface RustKeybinding {
  command: string,
  key: string,
  mac?: string,
  when?: string,
}

//TODO: missing: capabilities, colors, icons(Do not make sense), submenus, customEditors, viewsWelcome, walkthroughs
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
  readonly keybindings?: RustKeybinding[];
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
  public context: ExecutionContext;
  public disposables: any; // Class that will manage things to be removed when deactivated
  public readDir: Function; // TODO: temporary

  public constructor(
    commands: CommandContext,
    window: WindowContext,
    subscriptions: SubscriptionsContext,
    project: ProjectContext,
    context: ExecutionContext,
    data: RustExtension,
  ) {
    this.commands = commands;
    this.window = window;
    this.subscriptions = subscriptions;
    this.project = project;
    this.context = context;
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
    this.window = new WindowContext(this.commands);
    this.subscriptions = new SubscriptionsContext();
    this.project = new ProjectContext();
    this.context = new ExecutionContext();

    this.context.projectName = "My project" //TODO: load when opening project

    this.loadExtensions();

    //TODO: tmp
    this.commands.createCommand(new HareCommand("hare.open", "Open"))
    this.commands.registerCommand("hare.open", hare_open, this.context);
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

        if (extension.commands) {
          extension.commands.forEach(cmd => {
            var addCmd = new HareCommand(
              cmd.command, cmd.title, cmd.icon, cmd.category, cmd.when
            )
            this.commands.createCommand(addCmd);
          })
        }

        if (extension.menus) {
          extension.menus.forEach(menuEntry => {
            this.window.registerMenu(menuEntry);
          })
        }

        if (extension.icon_packs) {
          extension.icon_packs.forEach(iconPack => {
            this.window.loadIconPack(iconPack, extension.root);
          })
        }

        this.extensions.push({
          extension: new ExtensionData(
            this.commands,
            this.window,
            this.subscriptions,
            this.project,
            this.context,
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
        this.commands.executeCommand("hare.open")
        break;
      default:
        break;
    }
  }

}

class HareCommand implements IHareCommand {
  id: string;
  title: string;
  icon?: IHareIcon | string;
  category?: string;
  when?: string; //TODO: maybe change this
  callback?: Function;

  args?: any;

  public constructor(
    id: string,
    title: string,
    icon?: IHareIcon | string,
    category?: string,
    when?: string,
  ) {
    this.id = id;
    this.title = title;
    this.icon = icon;
    this.category = category;
    this.when = when;
  }

  public registerCallback(callback: Function, thisArg?: any) {
    this.callback = callback
    this.args = thisArg;
  }

  public executeCallback(...rest: any[]): any {
    if (!this.callback) {
      return undefined
    }

    if (!this.when) {
      return this.callback(this.args, rest);
    }

    //TODO: check when
    return this.callback(rest);
  }

  public isId(checkId: string): boolean {
    return this.id === checkId;
  }

  public isInternal(): boolean {
    return this.id[0] === "_";
  }
  
}

function hare_open (...rest: any[]) {
  console.log(rest)
}

class CommandContext {
  /**This class will handle all of the command related features */

  private commands: HareCommand[] = [];

  constructor() {
  }

  /**
   * Registers the callback to the command to make it work
   *
   * @param id - Command id
   * @param callback - Command callback
   * @returns True if succesfull
   *
   */
  public registerCommand(id: string, callback:Function, thisArg?: any): boolean {
    var found = this.commands.some((cmd: HareCommand) => {
      if (cmd.isId(id)) {
        cmd.registerCallback(callback, thisArg)
        return true;
      }
    });

    return found;
  }

  public createCommand(cmdAdd: HareCommand): boolean {
    var found = this.commands.some((cmd: HareCommand) => {
      if (cmd.id == cmdAdd.id) {
        return true;
      }
    });

    if (!found) {
      this.commands.push(cmdAdd)
    }
    return !found;
  }

  public executeCommand(id: string,...rest: any[]): any {
    this.commands.forEach((cmd: HareCommand) => {
      if (cmd.isId(id)) {
        return cmd.executeCallback(rest)
      }
    });
    return undefined
  }

  public async executeBackendCommand(id: string, data: string): Promise<any> {
    return executeBackend(id, data);
  }

  public getCommand(id: string): HareCommand | undefined {
    let retVal: HareCommand | undefined;

    this.commands.some((cmd: HareCommand) => {
      if (cmd.isId(id)) {
        retVal = cmd
        return true
      }
    });

    return retVal;
  }
}

interface IHareGroup {
  id: string,
  position?: number,
}

function newGroup(str: string | undefined): IHareGroup | undefined {
  if (!str) {
    return undefined;
  }

  let group_raw = str.split(":");
  let pos = undefined;

  if (group_raw.length == 2) {
    pos = Number(group_raw[1])
  }

  return {id: group_raw[0], position: pos };
}

export interface IHareMenuEntry {
  command: HareCommand,
  when: string,
  group?: IHareGroup,
}

interface IHareMenu {
  id: string,
  entries: IHareMenuEntry[],
}

class WindowContext {
  /**This class will handle all of the window related features */
  private containerViews: IHareViewContainer;
  private menus: IHareMenu[] = [];
  private commandContext: CommandContext;
  private iconPacks: IconPack[] = [];
  private currentIconPack?: IconPack;


  constructor(commandContext: CommandContext) {
    this.containerViews = {primary_bar: [], panel: []};
    this.commandContext = commandContext;
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

  public registerMenu(menuEntry: RustMenu) {
    let cmd = this.commandContext.getCommand(menuEntry.command);
    if (!cmd) {return}

    let entry = {command: cmd, when: menuEntry.when, group: newGroup(menuEntry.group)}

    var found = this.menus.some(menu => {
      if (menu.id == menuEntry.parent) {
        menu.entries.push(entry)
        return true;
      }
    }); 

    if (!found) {
      this.menus.push({id: menuEntry.parent, entries: [entry]})
    }

    console.log(this.menus);
  }

  public getMenuEntries(id: string): IHareMenuEntry[] | undefined {
    let entries: IHareMenuEntry[] | undefined = undefined;

    this.menus.some(menu => {
      if (menu.id == id) {
        entries = menu.entries;
        return true;
      }
    }); 

    return entries;
  }

  public loadIconPack(pack: IHareIconPack, root:string) {
    readFile(pack.path).then((content:string) => {
      let json = JSON.parse(content);
      this.iconPacks.push({id: pack.id, title: pack.title, root:root, defaults: json.defaults, extra: json.contextValues})

      //TODO: load from settings
      this.currentIconPack = this.iconPacks[0]
    })

    //TODO: load icons only for current iconPack
  }

  public substituteIcon (value:string, ctx: string, name:string, state: TreeItemState) {
    let result = undefined;

    if (value.length > 0) {
      let regex = /\$\([^)]*\)/i;
      if (!regex.test(value)) {
        return value // It is an url
      }

      if (this.currentIconPack) {
        result = this.overwriteDefaultIcons(value, state);
      }

      if (!result) {
        result = substituteDefault(value, state);
      }

      return result
    }

    if (this.currentIconPack) {
      result = this.getIconPath(ctx, name, state);
    }

    if (result) {
      return result;
    }

    return substituteDefault(value, state); // Return Default Icon
  }

  private overwriteDefaultIcons (value:string, state:TreeItemState) {
    let substitute = value.slice(2, -1);
    let val = this.currentIconPack!.defaults[substitute];

    if (!val) {
      return undefined;
    }

    if (!this.currentIconPack) {
      return undefined
    }

    if (typeof val === 'string') {
      return this.currentIconPack.root + val;
    }

    for (let index = 0; index < val.length; index++) {
      const element = val[index];

      if (!element.when) {
        return this.currentIconPack.root + element.dark //TODO: change theme mode
      }

      const ctx = {state: (state === TreeItemState.Collapsed) ? "collapsed" : "expanded"};

      if (when(element.when, ctx)) {
        return this.currentIconPack.root + element.dark; //TODO: change theme mode
      }
      
    }
    return val
  }

  private getIconPath (ctx: string, name:string, state: TreeItemState) {
    let val = this.currentIconPack!.extra[ctx];

    if (!val) {
      return undefined;
    }

    if (!this.currentIconPack) {
      return undefined
    }

    if (typeof val === 'string') {
      return this.currentIconPack.root + val
    }

    if (val.regex) {  
      // Check first regex
      let regexIcon = undefined;
      let found = Object.entries(val.regex).some((element: any) => {
        let regex = new RegExp(element[0]);
        if (regex.test(name)) {
          for (let index = 0; index < element[1].length; index++) {
            const entry = element[1][index];

            if (!entry.when) {
              regexIcon = this.currentIconPack!.root + entry.dark; //TODO: change theme mode
              return true;
            }

            const context = {state: (state === TreeItemState.Collapsed) ? "collapsed" : "expanded"};

            if (when(entry.when, context)) {
              regexIcon = this.currentIconPack!.root + entry.dark; //TODO: change theme mode
              return true;
            }
          }
        }
      });

      if (found) {
        return regexIcon;
      }
    }

    // Regex not found return default
    for (let index = 0; index < val.default.length; index++) {
      const element = val.default[index];

      if (!element.when) {
        return this.currentIconPack.root + element.dark //TODO: change theme mode
      }

      const context = {state: (state === TreeItemState.Collapsed) ? "collapsed" : "expanded"};

      // console.log(element.when, context)
      if (when(element.when, context)) {
        return this.currentIconPack.root + element.dark; //TODO: change theme mode
      }
    }

    return val
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

interface IconPack {
  id: string,
  title: string,
  root: string,
  defaults: {[Key: string]: string | [IHareIcon]},
  extra: {[Key: string]: string | IHareIconRegex},
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

    ref.classList.add("selected")
  }

  public unselect() {
    // Unselect all other elements
    this.selected.forEach(element => {
      try {
        element.ref.classList.remove("selected")
      } catch (error) {}
    });
    this.selected = [];
    return;
  }
}

