const SettingItem = (props:any) => {
    const { myId } = props;

    if (myId == "accounts") {
        return (
            <li id={myId} className="settings-item">
                <svg id="icon" className="inside-button icon"  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
                <div className="inside-button hidden-element">Accounts</div>
            </li>
        );
    }

    if (myId == "settings") {
        return (
            <li id={myId} className="settings-item">
                    <svg id="icon" className="inside-button icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"/>
                    </svg>
                    <div className="inside-button hidden-element">Manage Hare</div>
            </li>
        );    
    }

};

export default SettingItem;
