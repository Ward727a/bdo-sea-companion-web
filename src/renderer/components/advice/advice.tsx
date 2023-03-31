/**
 * @file advice.tsx
 * @description This file contains the advice component. It's used to display the advice of the application.
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.3
 */

import subEventHelper from "@common/subEvent";
import React, { useEffect } from "react";

import "./advice.scss"

type Props = {
    version: string
}

/**
 * The advice component, used to display the advice of the application.
 * @returns the react component to render, type: {@link React.FC}
 */
const Advice: React.FC<Props> = (props: Props) => {

    const [advice, setAdvice] = React.useState('v.'+props.version); // advice

    const [displayIcon, setDisplayIcon] = React.useState({border: '', filter: 'invert(98%) sepia(4%) saturate(2091%) hue-rotate(316deg) brightness(91%) contrast(96%)', borderRadius: '10%', backgroundColor: '', cursor: 'pointer'}); // display the icon

    // The black spirit icon
    const blackSpirit = require('@assets/images/Advice.png');
    const changeLog = require('@assets/icons/changelog.svg');

    const [icon, setIcon] = React.useState(changeLog);

    // Register the callback to get the advice
    useEffect(()=>{
        subEventHelper.getInstance().registerCallback('rAdvice', (advice: string) => {
            if(advice !== ''){
                setAdvice(advice);
            } else {
                setAdvice("v."+props.version)
            }
        }, 'Application');

        return(
            ()=>{
                subEventHelper.getInstance().unregisterAllCallbacks("rAdvice");
            }
        )
    }, [])

    const onClickChangelog = (e: MouseEvent):any => {
        e.preventDefault();
        const icon = e.currentTarget as HTMLImageElement;

        icon.style.transition = "transform 0.1s ease-in-out";
        icon.style.transform = "scale(0.8, 0.8)";
        
        const eventHelper = subEventHelper.getInstance();

        eventHelper.callEvent('rOpenUpdate');

        setTimeout(() => {
            icon.style.transform = "scale(1, 1)";
        }, 100);
    }

    // Display the icon if the advice is not empty
    useEffect(()=>{
        if(advice === "v."+props.version){

            const app = document.getElementById("app-advice");
            const paragraph = document.querySelector("#app-advice > p") as HTMLParagraphElement;
            const img = document.querySelector("#app-advice > img") as HTMLImageElement;

            app.style.display = "flex";
            app.style.alignContent = "center";

            paragraph.style.marginTop = "auto";
            paragraph.style.marginBottom = "auto";
            paragraph.style.color = "#afafaf";

            img.style.marginTop = "auto";
            img.style.marginBottom = "auto";

            img.onclick = onClickChangelog;

            setDisplayIcon({border: '', filter: 'invert(98%) sepia(4%) saturate(2091%) hue-rotate(316deg) brightness(91%) contrast(96%)', borderRadius: '10%', backgroundColor: '', cursor: 'pointer'});
            setIcon(changeLog);
        } else {

            const app = document.getElementById("app-advice");
            const paragraph = document.querySelector("#app-advice > p") as HTMLParagraphElement;
            const img = document.querySelector("#app-advice > img") as HTMLImageElement;

            app.style.display = "";

            paragraph.style.marginTop = "";
            paragraph.style.marginBottom = "";
            paragraph.style.color = "white";

            img.style.marginTop = "";
            img.style.marginBottom = "";
            
            img.onclick = null;

            setDisplayIcon(null);
            setIcon(blackSpirit);
        }
    }, [advice])


    // Return the component
    return (
        <div id="app-advice">
            <p>{advice}</p>
            <img src={icon} alt="Advice" width="auto" height="100%" id="adviceIcon" draggable={false} style={displayIcon}/>
        </div>
    );
};

export default Advice;