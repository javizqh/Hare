const EditorTab = ({tab, openFileInEditor, closeFileInEditor} : {tab:any, openFileInEditor:any, closeFileInEditor:any}) => {

	const handleClick = (tab:any) => {
		console.log("Open")
		tab.current =true;
		openFileInEditor(tab);
  }

	const handleClose = (tab:any) => {
		tab.current =false;
		closeFileInEditor(tab);
  }

	// Tab entry { tab icon (22x22px), tab name, tab changes (hover or selected (color white) tab close (20x20px + 2padd))}

	return (
		<div 
			className={(tab.current) ? "editor-tab-entry editor-tab-entry-selected" : "editor-tab-entry editor-tab-entry-unselected"}
			onClick={(e) => {if (e.currentTarget != e.target) return; handleClick(tab)}}>
			<div className="editor-tab-entry-icon"></div>
			<div className="editor-tab-entry-label">{tab.name}</div>
			<div className="editor-tab-entry-close" onClick={(e:any) => {e.stopPropagation(); handleClose(tab);}}>x</div>
		</div>
	);
};

export default EditorTab;
