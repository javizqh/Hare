export module hare {
  export interface IHareIcon {
    light: string;
    dark: string;
  }

  export interface IHareCommand {
    id: string;
    title: string;
    icon: IHareIcon | null;
    callback: Function | null;
  }

  export interface Command {
    command: string;
    title: string;
    tooltip?: string;
    arguments: any[];
  }

  export enum HareViewPanel {
    PrimaryBar,
    SecondaryBar,
    Panel,
  }

  export interface IHareViewContainer {
    primary_bar: IHareViewContainers[];
    // secondary_bar: IHareViewContainers[]; //TODO: maybe later
    panel: IHareViewContainers[];
  }

  export interface IHareViewContainers {
    id: string;
    icon: string; //TODO: should be svg
    title: string;
    views: IHareView[];
  }

  export interface View {
    id: string;
    parentId?: string;
    // icon: string; //TODO: should be svg
    title: string;
    when: string;
  }

  export interface IHareView extends View {
    viewProvider: TreeViewProvider<any> | undefined;
  }

  export type ProviderResult<T> =
    | T
    | undefined
    | null
    | PromiseLike<T | undefined | null>;

  export interface TreeViewProvider<T> {
    // _onDidChangeTreeData: vscode.EventEmitter<T | undefined | null | void> = new vscode.EventEmitter<T | undefined | null | void>();
    // onDidChangeTreeData: vscode.Event<T | undefined | null | void> = this._onDidChangeTreeData.event;

    getChildren(element?: T): ProviderResult<T[]>;
    getTreeItem(element: T): TreeItem | PromiseLike<TreeItem>;
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
    iconPath?: string | hare.IHareIcon; //TODO/2

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
    command?: hare.Command; //TODO

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
    selectedState?: hare.TreeItemSelectedState; //TODO

    /**
     * @param label A human-readable string describing this item
     * @param collapsibleState {@link TreeItemCollapsibleState} of the tree item. Default is {@link TreeItemCollapsibleState.None}
     */
    constructor(
      label: string,
      collapsibleState: hare.TreeItemState = hare.TreeItemState.None
    ){
      this.label = label;
      this.collapsibleState = collapsibleState;
      //FIX: This should be unique
      this.id = label;
      this.description = false;
    };
  }

  export enum TreeItemState {
    None,
    Collapsed,
    Expanded,
  }

  export enum TreeItemSelectedState {
    Unselected,
    selected,
  }
}
