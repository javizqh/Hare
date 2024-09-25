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
  PrimaryBar, SecondaryBar, Panel
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

export interface IHareView extends View{
  viewProvider: TreeViewProvider<any> | undefined;
}

export type ProviderResult<T> = T | undefined | null | PromiseLike<T | undefined | null>;

export interface TreeViewProvider<T> {
  // _onDidChangeTreeData: vscode.EventEmitter<T | undefined | null | void> = new vscode.EventEmitter<T | undefined | null | void>();
  // onDidChangeTreeData: vscode.Event<T | undefined | null | void> = this._onDidChangeTreeData.event;

  getChildren(element?: T): ProviderResult<T[]>;
  getTreeItem(element: T): TreeItem | PromiseLike<TreeItem>;
}

export enum TreeItemState {
  None, Collapsed, Expanded
}

export enum TreeItemSeectedState {
  Unselected, selected
}

}