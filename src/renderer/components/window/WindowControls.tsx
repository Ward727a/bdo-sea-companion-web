/**
 * @file WindowControls.tsx
 * @description This file contains the window controls component.
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.1
 */

import React, { useEffect } from "react";
import ControlButton from "./controlButton";
import subEventHelper from "@common/subEvent";
import tempHelper from '../../../common/temp';

/**
 * The window controls component
 * @returns the react component to render, type: {@link React.FC}
 */
const WindowControls = () => {

    // If the window is maximized
    const [maximized, setMaximized] = React.useState(false);

    // The language of the app
    const [lang, setLang] = React.useState(tempHelper.getInstance().has('lang') ? tempHelper.getInstance().get('lang') : 'en');

    // Register the callback for the maximized event
    subEventHelper.getInstance().registerCallback('app-maximize-reply', (maximize) => {

        setMaximized(maximize)

    }, 'windowControls');

    // Register the callback for the language change event
    useEffect(() => {
        subEventHelper.getInstance().registerCallback('set-lang', (lang) => {

            setLang(lang)
        }, 'windowControls');
    }, []);

    // Return the component
    return(
        <section className="window-controls">

            
            <ControlButton icon={"help"} onClick={function (): void {
                subEventHelper.getInstance().callEvent('rOpenNotice');
            } }/>
            <ControlButton icon={"lang_"+lang} onClick={function (): void {

                subEventHelper.getInstance().callEvent('open_lang_page');
            } }/>
            <ControlButton icon={"hBar"} onClick={function (): void {
                subEventHelper.getInstance().send('app-hide');
            } }/>
            <ControlButton icon={maximized? 'minimize' : 'maximize'} onClick={function (): void {

                subEventHelper.getInstance().send('app-maximize', {maximize: maximized});

            } }/>
            <ControlButton icon={"close"} onClick={function (): void {
                subEventHelper.getInstance().send('app-quit');
            } }/>

        </section>
    )

};

export default WindowControls;