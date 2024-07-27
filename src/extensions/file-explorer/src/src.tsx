import React, { useState, useEffect, useRef } from 'react';
import FileTree, {TreeSaveStructure} from "./components/FileTree";

let savedTree:TreeSaveStructure|null = null;

const SideBar = ({HARE, EditorAPI, BaseComponents}:{HARE:any, EditorAPI:any, BaseComponents:any}) => {

    const [tree, setTree] = useState<any|TreeSaveStructure>(null);

    useEffect(() => {
        console.log(tree)
        if (tree === null) {
            if (savedTree) {
                setTree(savedTree);
                return;
            }
            HARE.readDir('/home/javier/Code/Tauri/hare/Hare').then((message:any) => {
                let newTree:TreeSaveStructure = {entry: message};
                setTree(newTree);
            })
            .catch((error:any) => {
                console.error(error);
            });
        }
    }, []);

    useEffect(() => {
        savedTree = tree;
    }, [tree]);

    return (
        <>
        {/* <TitleBar title="Explorer" menu="Collapsable menu toggle"/> */}
        <BaseComponents.TitleBar title="Explorer"/>
        <div className="sideBar-content">
            {/* <CollapsableSection title={Project Name} menu={Available Menu}> */}
            <BaseComponents.CollapsableSection title={"Hare"} menu={"a"}>
                {tree &&
                Object.entries(tree.entry).map((project) => {
                    return (
                        <FileTree HARE={HARE} node={project[1]} depth={0} EditorAPI={EditorAPI} tree={savedTree}/>
                    )
                })}
            </BaseComponents.CollapsableSection>
            <BaseComponents.CollapsableSection title={"Hare"} menu={"a"}>
                {tree &&
                Object.entries(tree.entry).map((project) => {
                    return (
                        <FileTree HARE={HARE} node={project[1]} depth={0} EditorAPI={EditorAPI} tree={savedTree}/>
                    )
                })}
            </BaseComponents.CollapsableSection>
        </div>
        </>
    );
};

export {SideBar};

