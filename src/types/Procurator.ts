import {HareViewPanel, IHareCommand, IHareIcon, IHareView, IHareViewContainer, IHareViewContainers, TreeViewProvider, View} from "@hare-ide/hare"
interface ExtensionContext {
  commands: CommandContext;
  window: WindowContext;
  subscriptions: SubscriptionsContext;
  project: ProjectContext;
  extension: any;
  disposables: any;
}

class ExtensionData implements ExtensionContext{
  public commands: CommandContext;
  public window: WindowContext;
  public subscriptions: SubscriptionsContext;
  public project: ProjectContext;
  public extension: any; // Instance of the extension
  public disposables: any; // Class that will manage things to be removed when deactivated
  public fs: any; // Handle all backend actions like file reading and more

  private constructor(
    commands: CommandContext,
    window: WindowContext,
    subscriptions: SubscriptionsContext,
    project: ProjectContext,
  ) {
    this.commands = commands;
    this.window = window;
    this.subscriptions = subscriptions;
    this.project = project;
  }

  // TODO: provide also useful func
  public getAbsolutePath (relativePath:string) {
    // Returns absolute path of path relative to the extension
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
  public subscriptions: SubscriptionsContext;
  public project: ProjectContext;

  private constructor() {
    this.commands = new CommandContext();
    this.window = new WindowContext();
    this.subscriptions = new SubscriptionsContext();
    this.project = new ProjectContext();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Procurator();
    return this.instance;
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
    return this.id.at(0) === "_";
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
    for (const panels of Object.values(this.containerViews) as IHareViewContainers[]) {
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
    for (const panels of Object.values(this.containerViews) as IHareViewContainers[]) {
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
    const viewContainerId = view.parentId;

    if (viewContainerId === undefined) {
      return;
    }

    //TODO: check if duplicate
    for (const panels of Object.values(this.containerViews) as IHareViewContainers[]) {
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

    for (const panels of Object.values(this.containerViews) as IHareViewContainers[]) {
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
    for (const panels of Object.values(this.containerViews) as IHareViewContainers[]) {
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
