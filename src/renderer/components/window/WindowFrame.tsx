/**
 * @file WindowFrame.tsx
 * @description This file contains the window frame component.
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.1
 */

import React, {useState} from "react";
import WindowControls from "./WindowControls";

import "./WindowFrame.scss"
import dataDict from '@src/typings/data';
import subEventHelper from "@common/subEvent";


type Props = {
    children: React.ReactNode;
    data: dataDict;
}

/**
 * The window frame component
 * @param Props the props of the component: {@link Props}
 * @returns the react component to render, type: {@link React.FC}
 */
const WindowFrame: React.FC<Props> = (props: Props) => {

    // title and icon of the window
    const [titleTag, setTitle] = useState("barter");
    const [_icon, setIcon] = useState("chest");

    const title = props.data.lang['pageTitle'][0][titleTag][0];

    const changeData = (page: string)=>{
    
        // Check the page and change the title and icon
        switch (page) {
            case 'barter':
                setTitle("barter");
                setIcon("chest");
                break;
            case 'carrack':
                setTitle("carrack");
                setIcon("anchor");
                break;
            default:
                setTitle("barter");
                setIcon("chest");
                break;
            }
    }

    subEventHelper.getInstance().registerCallback('pageChange', changeData, 'windowFrame');

    // icon and alt of the icon
    const alt = "icon "+_icon;
    const icon = require(`../../../../assets/icons/${_icon}.svg`);
    

    // Return the react component
    return (
        <div id='window-frame'>
            <div id='window-frame-header'>
                <div id='window-frame-header-title'>
                    <div id='window-frame-header-title-icon'>
                        <img src={icon} alt={alt} />
                    </div>
                    <div id='window-frame-header-title-text'>
                        <h3>{title}</h3>
                    </div>
                </div>
                <div id='window-frame-header-actions'>
                    
                    <WindowControls/>
                </div>
            </div>
            <div id='window-frame-content'>
                {props.children}
            </div>
        </div>
    );
}

// Export the component
export default WindowFrame;