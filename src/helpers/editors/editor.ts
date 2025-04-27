import { IHareIcon } from '@hare-ide/hare';
import { publish } from '../events';

export enum EditorOrientation {
  NONE,
  VERTICAL,
  HORIZONTAL,
}

interface IHareEditor {
  id: string;
  displayName: string;
  on: string[]; //TODO: increase this to match more things than file patterns
}

export interface IHareEditorEntry {
  name: string;
  path: string;
  changes: number;
  icon?: IHareIcon;
  order: number;
  isPreview: boolean;
  extension: string;
  editor: IHareEditor;
}

export interface IHareEditorInstance {
  order: number;
  id: number;
  entries: IHareEditorEntry[];
}

export interface IHareEditorContainer {
  editors: (IHareEditorInstance | IHareEditorContainer)[];
  orientation: EditorOrientation;
  id: number;
}

export interface IHareEditorContainerEvents {
  instance: IHareEditorInstance | undefined;
  containers: IHareEditorContainer | undefined;
  index: number;
}

class EditorInstance implements IHareEditorInstance {
  static currentId: number = 0;

  order: number;
  id: number;
  entries: IHareEditorEntry[] = [];

  constructor(order: number = 0) {
    this.order = order;
    this.id = EditorInstance.currentId;
    EditorInstance.currentId += 1;
  }

  public older() {
    if (this.order === 0) {
      this.event();
    }
    this.order += 1;
  }

  public newer() {
    this.order -= 1;
    if (this.order === 0) {
      this.event();
    }
  }

  private event() {
    publish('fileEditor' + this.id + 'Update');
  }

  public add(name: string, extension: string, path: string, preview: boolean = false) {
    // [1,0,3,2]
    // Update 3 -> Add 1 to all others and reset to 0: DONE
    // [2,1,0,3]

    // [1,0,3,2]
    // Add one -> Add 1 to all others: DONE
    // [2,1,0',4,3]

    // [1,0,3,2*]
    // Remove preview and add one -> Iterate again removing 1 to all higher
    // [2,1,4,3*]
    // [2,1,4] Remove preview element
    // [2,1,3] Iterate again removing 1 to all higher
    // [2,1,0',3]
    var isInside = false;
    let new_array = [];
    let head = { index: 0, order: -1 };
    var reIterate = undefined;

    this.order = 0;

    for (let index = 0; index < this.entries.length; index++) {
      const element: IHareEditorEntry = this.entries[index];
      element.order += 1;
      if (element.path === path) {
        isInside = true;
        element.isPreview = false; // Remove preview from file
        element.order = 0;
      }

      if (!element.isPreview) {
        new_array.push(element); // Remove preview element
        if (element.order < head.order || head.order === -1) {
          head = { index: index, order: element.order };
        }
      } else {
        reIterate = element.order;
      }
    }

    if (isInside) {
      this.event();
      return;
    }

    if (reIterate !== undefined) {
      for (let index = 0; index < this.entries.length; index++) {
        const element = this.entries[index];
        if (element.order >= reIterate) {
          element.order -= 1;
        }
      }
    }

    var isPreview = true //TODO: search in settings
    if (preview) {
      isPreview = false
    }

    var newElement: IHareEditorEntry = {
      name: name,
      path: path,
      order: 0,
      changes: 0,
      isPreview: isPreview,
      extension: extension,
      editor: { id: '', displayName: '', on: [] },
    };

    new_array.splice(head.index + 1, 0, newElement);

    this.entries = new_array;
    this.event();
  }

  public update(selected: IHareEditorEntry) {
    if (selected.order === 0) {
      this.event();
      return;
    }

    for (let index = 0; index < this.entries.length; index++) {
      const element = this.entries[index];
      element.order += 1;
      if (element === selected) {
        element.order = 0;
      }
    }

    this.event();
  }

  public delete(selected: IHareEditorEntry) {
    this.entries = this.entries.filter((x) => x !== selected);

    for (let index = 0; index < this.entries.length; index++) {
      const element = this.entries[index];
      if (element.order > selected.order) {
        element.order -= 1;
      }
    }

    this.event();
  }

  public move(selected: IHareEditorEntry, index: number) {
    // let new_array = this.entries.filter((x) => x !== selected);

    // new_array.splice(index, 0, selected);

    // this.entries = new_array;
    // this.event();
  }
}

export class EditorContainer implements IHareEditorContainer {
  static currentId: number = 0;

  editors: (EditorInstance | EditorContainer)[] = [];
  orientation: EditorOrientation = EditorOrientation.NONE;
  id: number;

  private instances: EditorInstance[] = [];

  constructor(instance: EditorInstance | undefined = undefined) {
    if (instance !== undefined) {
      this.editors.push(instance);
    }

    this.id = EditorContainer.currentId;
    EditorContainer.currentId += 1;
  }

  public addEditorInstance(
    instanceId: number | undefined,
    neighbourId: number | undefined,
    orientation: EditorOrientation
  ) {
    // neighbourId -> Undefined == Rightmost/Top; -1 == Leftmost/Bottom
    var currentInstance: EditorInstance | undefined;
    for (const instance of this.instances) {
      instance.older();
      if (instance.id === instanceId) {
        currentInstance = instance;
      }
    }

    if (currentInstance === undefined || this.editors.length === 0 || instanceId === undefined) {
      const new_instance = new EditorInstance();
      this.editors.push(new_instance);
      this.orientation = orientation;
      this.instances = this.getEditorInstances();
      publish('hare.editor.container' + this.id + '.add', {
        instance: new_instance,
        container: [],
        index: this.editors.length -1
      });
      return;
    }

    const container = this.getInstanceContainer(instanceId);

    if (container === undefined) {
      return;
    }

    if (container.orientation === EditorOrientation.NONE) {
      // Only one instance in total
      const new_instance = new EditorInstance();
      container.orientation = orientation;
      var position = 0;
      if (neighbourId === undefined) {
        position = container.editors.push(new_instance) - 1;
      } else {
        container.editors.splice(neighbourId + 1, 0, new_instance);
      }
      this.instances = this.getEditorInstances();
      publish('hare.editor.container' + this.id + '.add', {
        instance: new_instance,
        container: [],
        index: position
      });
      return
    }

    if (container.orientation !== orientation) {
      //TODO: revisit order
      let new_instances = container.editors.filter((x) => x !== currentInstance);
      let new_container = new EditorContainer(currentInstance);
      new_container.addEditorInstance(instanceId, neighbourId, orientation);
      new_instances.unshift(new_container);
      container.editors = new_instances;

      this.instances = this.getEditorInstances();
      publish('hare.editor.container' + this.id + '.add', {
        instance: undefined,
        container: new_container,
        index: 0
      });
    }

    throw new Error("Why at the end");
  }

  public deleteEditorInstance(id: number, order: number) {
    var deleteInst = undefined
    for (const instance of this.instances) {
      if (id !== instance.id && instance.order > order) {
        instance.newer();
      } else if (id === instance.id) {
        deleteInst = instance
      }
    }

    this.deleteInstanceContainer(id);

    this.instances = this.getEditorInstances();

    publish('hare.editor.container' + this.id + '.delete', {
        instance: deleteInst,
        container: undefined,
        index: 0
    });
  }

  private getInstanceContainer(id: number): EditorContainer | undefined {
    for (let index = 0; index < this.editors.length; index++) {
      if (this.editors[index] instanceof EditorContainer) {
        // It is IHareEditorContainer
        var found = (this.editors[index] as EditorContainer).getInstanceContainer(id);
        if (found) {
          return found;
        }
      } else {
        var instance = this.editors[index] as EditorInstance;
        if (instance.id === id) {
          return this;
        }
      }
    }

    return undefined;
  }

  private deleteInstanceContainer(id: number): boolean {
    for (let index = 0; index < this.editors.length; index++) {
      if (this.editors[index] instanceof EditorContainer) {
        // It is IHareEditorContainer
        var found = (this.editors[index] as EditorContainer).deleteInstanceContainer(id);
        if (found) {
          if ((this.editors[index] as EditorContainer).editors.length === 0) {
            this.editors = this.editors.filter((x) => x !== this.editors[index]);
          }
          return true;
        }
      } else {
        var instance = this.editors[index] as EditorInstance;
        if (instance.id === id) {
          this.editors = this.editors.filter(
            (x) => (x instanceof EditorInstance && x.id !== id) || x instanceof EditorContainer
          );
          return true;
        }
      }
    }

    return false;
  }

  public getEditorInstances() {
    var instances: EditorInstance[] = [];

    for (let index = 0; index < this.editors.length; index++) {
      if (this.editors[index] instanceof EditorContainer) {
        // It is IHareEditorContainer
        instances.concat((this.editors[index] as EditorContainer).getEditorInstances());
      } else {
        instances.push(this.editors[index] as EditorInstance);
      }
    }

    instances.sort((a, b) => b.order - a.order);
    return instances;
  }

  public getContainer(id: number): EditorContainer | undefined {
    if (this.id === id) {
      return this
    }

    for (const instance of this.editors) {
      if (instance instanceof EditorContainer) {
        var found = instance.getContainer(id)
        if (found !== undefined) {
          return instance;
        }
      }
    }

    return undefined;
  }

  public getInstance(id: number): EditorInstance | undefined {
    var instances: EditorInstance[] = this.instances;

    for (const instance of instances) {
      if (instance.id === id) {
        return instance;
      }
    }

    return undefined;
  }

  public addFile(path: string, preview: boolean = false) {
    const name = path.split('\\').pop()!.split('/').pop();

    if (name === undefined) {
      return;
    }

    const extension = name.split('.').pop();

    if (extension === undefined) {
      return;
    }

    if (this.instances.length === 0) {
      this.addEditorInstance(undefined, undefined, EditorOrientation.VERTICAL);
    }

    //TODO: update order if this happens
    for (const instance of this.instances) {
      for (const entry of instance.entries) {
        if (entry.path === path) {
          return instance.add(name, extension, path, preview);
        }
      }
    }

    for (const instance of this.instances) {
      if (instance.order === 0) {
        return instance.add(name, extension, path, preview);
      }
    }
  }

  public addFileSide(
    path: string,
    instanceId: number | undefined,
    neighbourId: number | undefined,
    orientation: EditorOrientation
  ) {
    var preview = false;
    for (const instance of this.instances) {
      for (const entry of instance.entries) {
        if (entry.path === path) {
          preview = true
          this.removeFile(entry)
        }
      }
    }

    this.addEditorInstance(instanceId, neighbourId, orientation);

    this.addFile(path, preview);
  }

  public updateFileOrder(selected: IHareEditorEntry) {
    var found = false;

    for (const instance of this.instances) {
      instance.older();
      if (found) {
        continue;
      }
      for (let index = 0; index < instance.entries.length; index++) {
        if (instance.entries[index] === selected) {
          instance.order = 0;
          instance.update(selected);
          found = true;
        }
      }
    }
  }

  public moveFile(selected: IHareEditorEntry, index: number, startId: number, finalId: number) {
    if (finalId === startId) {
      for (const instance of this.instances) {
        if (instance.id === startId) {
          return instance.move(selected, index);
        }
      }
    } else {
      console.log("Moved", index, startId, finalId, this.instances)
      //BUG: it deletes itself when creating a new one after moving one
      this.removeFile(selected)
      var finalInstance = this.getInstance(finalId)

      if (finalInstance === undefined) {
        console.log("undefined")
        return
      }
      finalInstance.order = 0

      // this.addFile(selected.path)

      // for (const instance of this.instances) {
      //   instance.older();
      //   if (instance.id === finalId) {
      //     instance.order = 0
      //     // finalInstance = instance
      //     console.log(instance.entries)
      //   }
      // }
      // if (finalInstance === undefined) {
      //   return;
      // }

      const name = selected.path.split('\\').pop()!.split('/').pop();

      if (name === undefined) {
        return;
      }

      const extension = name.split('.').pop();

      if (extension === undefined) {
        return;
      }

      finalInstance.add(name, extension, selected.path, false);
    }
  }

  public removeFile(selected: IHareEditorEntry) {
    var found = undefined;

    for (const instance of this.instances) {
      instance.older()
      if (found !== undefined) {
        continue;
      }
      for (let index = 0; index < instance.entries.length; index++) {
        if (instance.entries[index] === selected) {
          instance.order = 0;
          instance.delete(selected);
          found = instance;
        }
      }
    }

    if (found && found.entries.length === 0) {
      this.deleteEditorInstance(found.id, found.order);
    }
  }
}
