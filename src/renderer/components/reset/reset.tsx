/* eslint-disable react/no-unescaped-entities */
/**
 * @file reset.tsx
 * @description This file contains the reset component.
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.3
 */

import subEventHelper from "@common/subEvent";
import dataDict from "@src/typings/data";
import update from "@src/typings/update";
import React, { useEffect, useState } from "react";

import "./reset.scss";

type Props = {
    data: dataDict
}

/**
 * The reset component, used to show the reset
 * @param props The props of the component: {@link Props}
 * @returns the react component to render, type: {@link React.FC}
 */
const Reset: React.FC<Props> = (props: Props) => {

    const [content, setContent] = useState<JSX.Element>(
        <div className="reset-content">
            <p>loading</p>
        </div>);

    // function to close the reset
    const close = (e: React.MouseEvent) => {

        if(e.target !== e.currentTarget){
            return;
        }

        e.preventDefault();

        document.getElementById("reset-back").style.transition = "opacity 0.3s";
        document.getElementById("reset-back").style.opacity = "0";

        setTimeout(()=>{
            document.getElementById("reset-back").style.display = "none";
        }, 300);
    }
    // Get each text for each steps
    const text = [
        props.data.lang.reset[0].content[0].first[0],
        props.data.lang.reset[0].content[0].second[0],
        props.data.lang.reset[0].content[0].third[0]
    ]

    const confirm = [
        props.data.lang.reset[0].confirmation[0].first[0],
        props.data.lang.reset[0].confirmation[0].second[0],
        props.data.lang.reset[0].confirmation[0].third[0]
    ]

    const cancelation = [
        props.data.lang.reset[0].cancel[0].first[0],
        props.data.lang.reset[0].cancel[0].second[0],
        props.data.lang.reset[0].cancel[0].third[0]
    ]

    // register the callback to show the page
    useEffect(()=>{

        const eventHelper = subEventHelper.getInstance();

        // If the app is updated, show the reset window for the first time
        eventHelper.registerCallback('rOpenReset', ()=>{
        firstStep();
            
            document.getElementById("reset-back").style.display = "flex";

            document.getElementById("reset-back").style.opacity = "0";
            document.getElementById("reset-back").style.transition = "opacity 0.3s";
            setTimeout(()=>{
                document.getElementById("reset-back").style.opacity = "1";
            }, 10);
        }, "reset");


    },[])

    const firstStep = () => {

        // Set the content to the first step
        setContent(
            <span>
                <div className="reset-content">
                    <p>{text[0]}</p>
                </div>
                <div className="reset-buttons">
                    <button className="reset-confirm" onClick={secondStep}>{confirm[0]}</button>
                    <button className="reset-cancel" onClick={close}>{cancelation[0]}</button>
                </div>
            </span>
        )
    }

    const secondStep = () => {

        // Set the content to the second step
        setContent(
            <span>
                <div className="reset-content">
                    <p>{text[1]}</p>
                </div>
                <div className="reset-buttons">
                    <button className="reset-confirm" onClick={thirdStep}>{confirm[1]}</button>
                    <button className="reset-cancel" onClick={close}>{cancelation[1]}</button>
                </div>
            </span>
        )
    }

    const thirdStep = () => {

        // Set the content to the third step
        setContent(
            <span>
                <div className="reset-content">
                    <p>{text[2]}</p>
                </div>
                <div className="reset-buttons">
                    <button className="reset-confirm" onClick={resetApp}>{confirm[2]}</button>
                    <button className="reset-cancel" onClick={close}>{cancelation[2]}</button>
                </div>
            </span>
        )
    }

    const resetApp = () => {
        
        // Reset the app
        const eventHelper = subEventHelper.getInstance();
        eventHelper.send('sResetApp');
    }

    // Return the reset component
    return (
        <div id="reset-back">
        <div id="reset-container">
            <div className="reset-header">
                <h1>{props.data.lang.reset[0].title[0]}</h1>
            </div>

            {content}

        </div>

    </div>
    )
}

export default Reset;