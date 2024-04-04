import SettingItem from "./SettingItem";

const SettingsContainer = () => {
    return (
        <ul id="settings-container" className="settings-container">
            <SettingItem myId="accounts"/>
            <SettingItem myId="settings"/>
        </ul>
    );
};

export default SettingsContainer;
