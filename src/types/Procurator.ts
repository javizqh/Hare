import {hare} from "../hare.d.ts";

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

class HareCommand implements hare.IHareCommand {
  id: string;
  title: string;
  icon: hare.IHareIcon | null;
  callback: Function | null;

  public constructor(
    id: string,
    title: string,
    icon: hare.IHareIcon | null = null,
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
  private containerViews: hare.IHareViewContainer;

  constructor() {
    this.containerViews = {primary_bar: [], panel: []};
  }

  public getContainerViews(viewPanel: hare.HareViewPanel) : hare.IHareViewContainers[] | [] {
    switch (viewPanel) {
      case hare.HareViewPanel.PrimaryBar:
        return this.containerViews.primary_bar;
      case hare.HareViewPanel.Panel:
        return this.containerViews.panel;
      default:
        //TODO: raise error
        break;
    }

    return [];
  }

  public registerContainerView(viewPanel: hare.HareViewPanel, viewContainer: hare.IHareViewContainers) {
    for (const panels of Object.values(this.containerViews) as hare.IHareViewContainers[]) {
      const found = panels.some((container: hare.IHareViewContainers) => {
        if (container.id === viewContainer.id) {
          return true;
        }
      });

      if (found) {
        return;
      }
    }

    switch (viewPanel) {
      case hare.HareViewPanel.PrimaryBar:
        if (viewContainer)
        this.containerViews.primary_bar.push(viewContainer);
        break;
      case hare.HareViewPanel.Panel:
        this.containerViews.panel.push(viewContainer);
        break;
      default:
        //TODO: raise error
        break;
    }
  }

  public getContainerView(viewContainerId: string): hare.IHareViewContainers | undefined {
    var views;
    for (const panels of Object.values(this.containerViews) as hare.IHareViewContainers[]) {
      const found = panels.some((container: hare.IHareViewContainers) => {
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

  public registerView(view: hare.View) {
    const viewContainerId = view.parentId;

    if (viewContainerId === undefined) {
      return;
    }

    //TODO: check if duplicate
    for (const panels of Object.values(this.containerViews) as hare.IHareViewContainers[]) {
      const duplicate = panels.some((container: hare.IHareViewContainers) => {
        const foundIn = container.views.some((searchView:hare.IHareView) => {
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

    for (const panels of Object.values(this.containerViews) as hare.IHareViewContainers[]) {
      const found = panels.some((container: hare.IHareViewContainers) => {
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

  public registerTreeViewProvider(id: string, treeViewProvider: hare.TreeViewProvider<any>) {
    for (const panels of Object.values(this.containerViews) as hare.IHareViewContainers[]) {
      const found = panels.some((container: hare.IHareViewContainers) => {
        const foundIn = container.views.some((view:hare.IHareView) => {
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

export class TreeItem {
		label: string;

		/**
		 * Optional id for the tree item that has to be unique across tree. The id is used to preserve the selection and expansion state of the tree item.
		 *
		 * If not provided, an id is generated using the tree item's label. **Note** that when labels change, ids will change and that selection and expansion state cannot be kept stable anymore.
		 */
		id?: string;

		/**
		 * The icon path or {@link ThemeIcon} for the tree item.
		 * When `falsy`, {@link ThemeIcon.Folder Folder Theme Icon} is assigned, if item is collapsible otherwise {@link ThemeIcon.File File Theme Icon}.
		 * When a file or folder {@link ThemeIcon} is specified, icon is derived from the current file icon theme for the specified theme icon using {@link TreeItem.resourceUri resourceUri} (if provided).
		 */
		iconPath?: string | hare.IHareIcon;

		/**
		 * A human-readable string which is rendered less prominent.
		 * When `true`, it is derived from {@link TreeItem.resourceUri resourceUri} and when `falsy`, it is not shown.
		 */
		description?: string | boolean;

		/**
		 * The tooltip text when you hover over this item.
		 */
		tooltip?: string;

		/**
		 * The {@link Command} that should be executed when the tree item is selected.
		 *
		 * Please use `vscode.open` or `vscode.diff` as command IDs when the tree item is opening
		 * something in the editor. Using these commands ensures that the resulting editor will
		 * appear consistent with how other built-in trees open editors.
		 */
		command?: hare.Command;

		/**
		 * {@link TreeItemCollapsibleState} of the tree item.
		 */
		collapsibleState: hare.TreeItemState;

		/**
		 * Context value of the tree item. This can be used to contribute item specific actions in the tree.
		 * For example, a tree item is given a context value as `folder`. When contributing actions to `view/item/context`
		 * using `menus` extension point, you can specify context value for key `viewItem` in `when` expression like `viewItem == folder`.
		 * ```json
		 * "contributes": {
		 *   "menus": {
		 *     "view/item/context": [
		 *       {
		 *         "command": "extension.deleteFolder",
		 *         "when": "viewItem == folder"
		 *       }
		 *     ]
		 *   }
		 * }
		 * ```
		 * This will show action `extension.deleteFolder` only for items with `contextValue` is `folder`.
		 */
		contextValue?: string;

		/**
		 * {@link TreeItemCheckboxState TreeItemCheckboxState} of the tree item.
		 * {@link TreeDataProvider.onDidChangeTreeData onDidChangeTreeData} should be fired when {@link TreeItem.checkboxState checkboxState} changes.
		 */
		slectedState?: hare.TreeItemSeectedState;

		/**
		 * @param label A human-readable string describing this item
		 * @param collapsibleState {@link TreeItemCollapsibleState} of the tree item. Default is {@link TreeItemCollapsibleState.None}
		 */
		constructor(label: string, collapsibleState: hare.TreeItemState = hare.TreeItemState.None) {
      this.label = label;
      this.collapsibleState = collapsibleState;
    };
}