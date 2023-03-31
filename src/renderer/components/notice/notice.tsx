/* eslint-disable react/no-unescaped-entities */
/**
 * @file notice.tsx
 * @description This file contains the notice component.
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.3
 */

import subEventHelper from "@common/subEvent";
import dataDict from "@src/typings/data";
import update from "@src/typings/update";
import React, { useEffect, useState } from "react";

import "./notice.scss";

type Props = {
    data: dataDict
}

/**
 * The notice component, used to show the notice
 * @param props The props of the component: {@link Props}
 * @returns the react component to render, type: {@link React.FC}
 */
const Notice = (props: Props) => {

    // function to close the notice
    const close = (e: React.MouseEvent) => {

        if(e.target !== e.currentTarget){
            return;
        }

        e.preventDefault();

        if(props.data.settings.settings.disclaimer[0] === "false"){
            subEventHelper.getInstance().send('set-setting', {key: "disclaimer", value: "true"});
        }

        document.getElementById("notice-back").style.transition = "opacity 0.3s";
        document.getElementById("notice-back").style.opacity = "0";

        setTimeout(()=>{
            document.getElementById("notice-back").style.display = "none";
        }, 300);
    }

    const [content, setContent] = useState<JSX.Element>(
        <div id="notice-back">
            <div id="notice-container">
                <div className="notice-header">
                    <h1>Disclaimer of Affiliation</h1>
                </div>

                <div className="notice-content">
                    <p>
                        We (Ward & Mâk) are two independent developers who have created this free software as an unofficial tool to help players of the game Black Desert Online (BDO). This software is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Pearl Abyss or Black Desert Online.
                    </p>
                    <p>
                        The official Pearl Abyss website can be found at https://www.pearlabyss.com.
                    </p>
                    <p>
                        The official Black Desert Online (BDO) website can be found at https://www.naeu.playblackdesert.com.
                    </p>
                    <p>
                        All information and names used in this software are trademarks or registered trademarks of their respective holders. The use of these trademarks does not imply any affiliation with or endorsement by them.
                    </p>
                    <p>
                        If you have any questions or concerns about this software, please contact us via Github at https://github.com/Makpptfox/BDO-Sea-Companion.
                    </p>
                </div>

                <button className="notice-button" onClick={close}>Yes, I understand</button>

            </div>

        </div>
    );

    // register the callback to show the page
    useEffect(()=>{
        if(props.data.settings.settings.disclaimer[0] === "false"){
            document.getElementById("notice-back").style.display = "flex";
        }

        const eventHelper = subEventHelper.getInstance();

        // If the app is updated, show the notice for the first time
        eventHelper.registerCallback('rOpenNotice', ()=>{
            
            document.getElementById("notice-back").style.display = "flex";

            document.getElementById("notice-back").style.opacity = "0";
            document.getElementById("notice-back").style.transition = "opacity 0.3s";
            setTimeout(()=>{
                document.getElementById("notice-back").style.opacity = "1";
            }, 10);
        }, "notice");

    },[])

    // Function to update the content
    useEffect(()=>{
        // Get the language
        const lang = props.data.settings.settings.lang[0];

        // Get the content
        switch(lang){
            case "en":
                setContent(
                    <div id="notice-back">
                        <div id="notice-container">
                            <div className="notice-header">
                                <h1>Disclaimer of Affiliation</h1>
                            </div>

                            <div className="notice-content">
                                <p>
                                    We (Ward & Mâk) are two independent developers who have created this free software as an unofficial tool to help players of the game Black Desert Online (BDO). This software is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Pearl Abyss or Black Desert Online.
                                </p>
                                <p>
                                    The official Pearl Abyss website can be found at https://www.pearlabyss.com.
                                </p>
                                <p>
                                    The official Black Desert Online (BDO) website can be found at https://www.naeu.playblackdesert.com.
                                </p>
                                <p>
                                    All information and names used in this software are trademarks or registered trademarks of their respective holders. The use of these trademarks does not imply any affiliation with or endorsement by them.
                                </p>
                                <p>
                                    If you have any questions or concerns about this software, please contact us via Github at https://github.com/Makpptfox/BDO-Sea-Companion.
                                </p>
                            </div>

                            <button className="notice-button" onClick={close}>Yes, I understand</button>

                        </div>

                    </div>
                )
            break;
            case "fr":
                setContent(
                    <div id="notice-back">
                    <div id="notice-container">
                        <div className="notice-header">
                            <h1>Avertissement de non-affiliation</h1>
                        </div>

                        <div className="notice-content">
                            <p>
                                Nous (Ward & Mâk) sommes deux développeurs indépendants qui avons créé ce logiciel gratuit en tant qu'outil non officiel pour aider les joueurs du jeu Black Desert Online (BDO). Ce logiciel n'est pas affilié, associé, autorisé, soutenu ou de quelque manière que ce soit officiellement connecté à Pearl Abyss ou à Black Desert Online.
                            </p>
                            <p>
                                Le site web officiel de Pearl Abyss peut être trouvé à l'adresse https://www.pearlabyss.com.
                            </p>
                            <p>
                                Le site web officiel de Black Desert Online (BDO) peut être trouvé à l'adresse https://www.naeu.playblackdesert.com.
                            </p>
                            <p>
                                Toutes les informations et noms utilisés dans ce logiciel sont des marques de commerce ou des marques déposées de leurs détenteurs respectifs. L'utilisation de ces marques de commerce n'implique aucune affiliation ou approbation de leur part.
                            </p>
                            <p>
                                Si vous avez des questions ou des préoccupations concernant ce logiciel, veuillez nous contacter via Github à l'adresse https://github.com/Makpptfox/BDO-Sea-Companion.
                            </p>
                        </div>

                        <button className="notice-button" onClick={close}>Oui, je comprends</button>

                    </div>

                </div>
                )
            break;
        }

    }, [])

    // Return the notice component
    return (
        content
    )
}

export default Notice;