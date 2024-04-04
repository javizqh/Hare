import { Parser } from 'html-to-react';

const ActionItem = ({ props }:any) => {
    const { id, icon, tipData, hidden } = props;

    let finalClass = "action-item";

    if (hidden) {
        finalClass += " hidden";
    }

    return (
        <li id={id} className={finalClass}>
            <svg id='icon' className="inside-button icon" aria-hidden="true" fill={icon.fill} viewBox={icon.viewBox}>
                {Parser().parse(icon.svg)}
            </svg>
            <div className='inside-button active-indicator'></div>
            <div className='inside-button hidden-element'>{tipData}</div>
        </li>
    );
};

export default ActionItem;
