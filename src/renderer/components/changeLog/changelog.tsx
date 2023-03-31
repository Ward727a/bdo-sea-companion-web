/**
 * @file changelog.tsx
 * @description This file contains the changelog component.
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.3
 */

import subEventHelper from "@common/subEvent";
import { changeLog } from "@src/typings/changelog";
import update from "@src/typings/update";
import React, { useEffect } from "react";

import "./changelog.scss";

type Props = {
    update: update;
    changelog: changeLog
}

/**
 * The changelog component, used to show the changelog
 * @param props The props of the component: {@link Props}
 * @returns the react component to render, type: {@link React.FC}
 */
const ChangeLog: React.FunctionComponent<Props> = (props: Props) => {

    const linkIcon = require("@assets/icons/linkChangelog.svg");

    // register the callback to show the page
    useEffect(()=>{
        if(props.update.firstLaunch[0] === "true"){
            document.getElementById("changelog-back").style.display = "flex";
            subEventHelper.getInstance().send('set-update', 'false');
        }

        const eventHelper = subEventHelper.getInstance();

        // If the app is updated, show the changelog for the first time
        eventHelper.registerCallback('rOpenUpdate', ()=>{
            
            document.getElementById("changelog-back").style.display = "flex";

            document.getElementById("changelog-back").style.opacity = "0";
            document.getElementById("changelog-back").style.transition = "opacity 0.3s";
            setTimeout(()=>{
                document.getElementById("changelog-back").style.opacity = "1";
            }, 10);
        }, "changelog");

    },[])

    // function to close the changelog
    const close = (e: React.MouseEvent) => {

        if(e.target !== e.currentTarget){
            return;
        }

        e.preventDefault();

        document.getElementById("changelog-back").style.transition = "opacity 0.3s";
        document.getElementById("changelog-back").style.opacity = "0";

        setTimeout(()=>{
            document.getElementById("changelog-back").style.display = "none";
        }, 300);
    }

    // Return the changelog component
    return (
        <div id="changelog-back" onClick={close}>
            <div id="changelog-container">
                <div className="changelog-header">
                    <h1>Changelog</h1>
                    <img src = {linkIcon} alt="link icon" onClick={()=>subEventHelper.getInstance().send('openLink', 'https://github.com/Makpptfox/BDO-Sea-Companion/tree/main/changelog')}/>
                </div>

                <div className="changelog-content">
                    <div className="changelog-content-header">
                        <h2>Version {props.changelog.version} - {props.changelog.date}</h2>
                    </div>
                    <div className="changelog-content-content">
                        <h3 style={{display: props.changelog.additions.length > 0 ? "block" : "none"}}>
                            Addition{props.changelog.additions.length > 1 ? "s" : ""}:
                        </h3>
                        <ul className="changelog-content-content-additions" style={{display: props.changelog.additions.length > 0 ? "block" : "none"}}>
                            {props.changelog.additions.map((addition, index)=>{
                                return (
                                    <li key={index}>{addition}</li>
                                )
                            })}
                        </ul>
                        <h3 style={{display: props.changelog.removals.length > 0 ? "block" : "none"}}>
                            Removal{props.changelog.removals.length > 1 ? "s" : ""}:
                        </h3>
                        <ul className="changelog-content-content-changes" style={{display: props.changelog.removals.length > 0 ? "block" : "none"}}>
                            {props.changelog.removals.map((change, index)=>{
                                return (
                                    <li key={index}>{change}</li>
                                )
                            })}
                        </ul>
                        <h3 style={{display: props.changelog.fixes.length > 0 ? "block" : "none"}}>
                            Fix{props.changelog.fixes.length > 1 ? "es" : ""}:
                        </h3>
                        <ul className="changelog-content-content-fixes" style={{display: props.changelog.fixes.length > 0 ? "block" : "none"}}>
                            {props.changelog.fixes.map((fix, index)=>{
                                return (
                                    <li key={index}>{fix}</li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="changelog-content-footer" style={{display: props.changelog.notes.length > 0 ? "block" : "none"}}>
                        <h3>Note{props.changelog.notes.length > 1 ? "s" : ""}:</h3>
                        <ul className="changelog-content-footer-notes">
                            {props.changelog.notes.map((note, index)=>{
                                return (
                                    <li key={index}>{note}</li>
                                )
                            }
                            )}
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default ChangeLog;