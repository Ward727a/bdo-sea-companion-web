/**
 * @file lang_page.tsx
 * @description This file contains the language page component.
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.1
 */
import subEventHelper from "@common/subEvent";
import dataDict from "@src/typings/data";
import React, { useEffect } from "react";

import "./lang_page.scss";

type Props = {
    data: dataDict;
}

/**
 * The language page component, used to change the language of the app
 * @param props The props of the component: {@link Props}
 * @returns the react component to render, type: {@link React.FC}
 */
const LangPage: React.FunctionComponent<Props> = (props: Props) => {

    // if the page is shown or not
    const [show, setShow] = React.useState(false);
    let show_ = false;

    // register the callback to show the page
    useEffect(()=>{

        subEventHelper.getInstance().registerCallback('open_lang_page', (state?) => {
            show_ = state? state : !show_;

            setShow(state? state : show_);
        }, 'langPage');


        // if the app is launched for the first time, open the language page automatically
        if(props.data.settings.settings.chosenLang[0] === "false"){
            subEventHelper.getInstance().callEvent('open_lang_page', true);
            subEventHelper.getInstance().send('set-setting', {key: "chosenLang", value: "true"});
        }
        

        return(()=>{
            
            subEventHelper.getInstance().unregisterAllCallbacks("open_lang_page");
        })
    },[])
        
    useEffect(()=>{
        if(show){
            (document.getElementsByClassName("lang-page")[0] as HTMLDivElement).style.opacity = "0";
            (document.getElementsByClassName("lang-page")[0] as HTMLDivElement).style.transition = "opacity 0.3s";
            setTimeout(()=>{
                (document.getElementsByClassName("lang-page")[0] as HTMLDivElement).style.opacity = "1";
            }, 10);
        }
    }, [show])

    const closePage = () => {

        (document.getElementsByClassName("lang-page")[0] as HTMLDivElement).style.transition = "opacity 0.3s";
        (document.getElementsByClassName("lang-page")[0] as HTMLDivElement).style.opacity = "0";

        setTimeout(()=>{
            subEventHelper.getInstance().callEvent('open_lang_page', false);
        }, 300);
    }

    // if the page is not shown, return null
    if(!show){
        return null;
    }

    // function to change the language
    const changeLang = (lang: string) => {
        subEventHelper.getInstance().send('set-lang', lang);
        subEventHelper.getInstance().callEvent('open_lang_page', false);
    }

    // return the component
    return (
        <div className="lang-page" onClick={(e: React.MouseEvent)=>{if((e.target as HTMLElement).className === "lang-page"){closePage();}}}>
            <div className="lang-page-content">
                <div className="lang-page-title">{props.data.lang.language[0].selectLanguage[0]}</div>
                <div className="lang-page-content-list">
                    <div className="lang-page-content-item" onClick={()=>{changeLang("en")}}>
                        <div className="lang-page-content-item-icon"><img src={require("@assets/icons/lang_en.png")} alt="lang_en" height="16" draggable={false}/></div>
                        <div className="lang-page-content-item-text">English</div>
                    </div>
                    <div className="lang-page-content-item" onClick={()=>{changeLang("fr")}}>
                        <div className="lang-page-content-item-icon"><img src={require("@assets/icons/lang_fr.png")} alt="lang_fr" height="16" draggable={false}/></div>
                        <div className="lang-page-content-item-text">Français</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LangPage;