/**
 * @file settingTier.tsx
 * @description Setting Tier Page Component for the setting pages. This component is used to toggle the view of the threshold for each city.
 * @description Iliya => Tier 5
 * @description Epheria => Tier 5
 * @description Ancado => Tier 1, 2, 3, 4, and 5
 * 
 * @author Ward
 * @version 1.0.0
 * @since 1.0.0
 * 
 * @license MIT
 * 
 * @requires react
 * @requires react-dom
 * @requires @common/subEvent
 * @requires @src/typings/data
 * @requires ./settingTier.scss
 */

import subEventHelper from "@common/subEvent";
import dataDict from "@src/typings/data";
import React, { useEffect } from "react";

import "./settingTier.scss";

type Props = {
    data: dataDict;
}

/**
 * Setting Tier Page Component
 * @param Props the props of the component: {@link Props}
 * @returns the react component to render, type: {@link React.FC}
 * @since 0.0.3
 */
const SettingTier: React.FunctionComponent<Props> = (props: Props) => {
    
    // show the page or not
    const [show, setShow] = React.useState(false);

    // the state of the toggle button
    const [_ignoreAncado, setIgnoreAncado] = React.useState(props.data.settings.settings.ignoreAncado[0] === "true");
    const [_ignoreIliya, setIgnoreIliya] = React.useState(props.data.settings.settings.ignoreIliya[0] === "true");
    const [_ignoreEpheria, setIgnoreEpheria] = React.useState(props.data.settings.settings.ignoreEpheria[0] === "true");

    // register the event to open the page
    let show_ = false;
    useEffect(()=>{

        subEventHelper.getInstance().registerCallback('open_setTier_page', (state?) => {
            show_ = state? state : !show_;

            setShow(state? state : show_);
        }, 'settingTierPage');

        return(()=>{
            
            subEventHelper.getInstance().unregisterAllCallbacks("open_setTier_page");
        })
    },[])

    

        
    useEffect(()=>{
        if(show){
            (document.getElementsByClassName("settingTier-page")[0] as HTMLDivElement).style.opacity = "0";
            (document.getElementsByClassName("settingTier-page")[0] as HTMLDivElement).style.transition = "opacity 0.3s";
            setTimeout(()=>{
                (document.getElementsByClassName("settingTier-page")[0] as HTMLDivElement).style.opacity = "1";
            }, 10);
        }
    }, [show])

    const closePage = () => {
        (document.getElementsByClassName("settingTier-page")[0] as HTMLDivElement).style.transition = "opacity 0.3s";
        (document.getElementsByClassName("settingTier-page")[0] as HTMLDivElement).style.opacity = "0";

        setTimeout(()=>{
            subEventHelper.getInstance().callEvent('open_setTier_page', false);
        }, 300);
    }

    // if the page is not shown, return null
    if(!show){
        return null;
    }
    
    // the function to change the state of the toggle button for each city
    const ignoreAncado = (state: boolean) => {
        subEventHelper.getInstance().send('set-setting', {key: "ignoreAncado", value: state});
        props.data.settings.settings.ignoreAncado[0] = state.toString();
        setIgnoreAncado(state);
        subEventHelper.getInstance().callEvent('rRefresh-itemList');
    }

    const ignoreIliya = (state: boolean) => {
        subEventHelper.getInstance().send('set-setting', {key: "ignoreIliya", value: state});
        props.data.settings.settings.ignoreIliya[0] = state.toString();
        setIgnoreIliya(state);
        subEventHelper.getInstance().callEvent('rRefresh-itemList');
    }

    const ignoreEpheria = (state: boolean) => {
        subEventHelper.getInstance().send('set-setting', {key: "ignoreEpheria", value: state});
        props.data.settings.settings.ignoreEpheria[0] = state.toString();
        setIgnoreEpheria(state);
        subEventHelper.getInstance().callEvent('rRefresh-itemList');
    }


    // return the component
    return (
        <div className="settingTier-page" onClick={(e: React.MouseEvent)=>{if(e.currentTarget === e.target){closePage();}}}>
            <div className="settingTier-page-content">
                <div className="settingTier-page-content-list">
                    <div className="settingTier-page-content-item">
                        <div className="settingTier-page-content-item-text">{props.data.lang.barter[0].filters[0].ignoreIliya[0]}</div>
                        <div className="settingTier-page-content-item-switch">
                            <label className="switch">
                                <input type="checkbox" checked={_ignoreIliya} onChange={(e)=>{ignoreIliya(e.target.checked)}}/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="settingTier-page-content-item">
                        <div className="settingTier-page-content-item-text">{props.data.lang.barter[0].filters[0].ignoreEpheria[0]}</div>
                        <div className="settingTier-page-content-item-switch">
                            <label className="switch">
                                <input type="checkbox" checked={_ignoreEpheria} onChange={(e)=>{ignoreEpheria(e.target.checked)}}/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="settingTier-page-content-item">
                        <div className="settingTier-page-content-item-text">{props.data.lang.barter[0].filters[0].ignoreAncado[0]}</div>
                        <div className="settingTier-page-content-item-switch">
                            <label className="switch">
                                <input type="checkbox" checked={_ignoreAncado} onChange={(e)=>{ignoreAncado(e.target.checked)}}/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingTier;