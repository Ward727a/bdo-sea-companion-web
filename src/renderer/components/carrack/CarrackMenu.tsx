/**
 * @file CarrackMenu.tsx
 * @description This file contains the component for the carrack menu. This menu is used to access the inventory and tracker.
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.2
 */
import React, { useEffect } from "react";

import dataDict from "@src/typings/data";

import "./CarrackMenu.scss"
import subEventHelper from "@common/subEvent";
import tempHelper from "@common/temp";

type Props = {
    data: dataDict;
    state: string;
    boatType: string;
    setState: (state: string) => void;
}

/**
 * The component for the carrack menu. This menu is used to access the inventory and tracker.
 * @param props The props of the component: {@link Props}
 * @returns the react component to render, type: {@link React.FC}
 * @version 0.0.3
 * @since 0.0.2
 */
const CarrackMenu = (props: Props) => {
    
    // Get the image of the carrack
    const [imageCarrack] = React.useState<string>(require('@assets/images/carrack/'+props.data.carrack.boat[0][props.boatType][0].image[0]));

    // Create a state to store the content
    const [content, setContent] = React.useState<JSX.Element>(<div><p>loading...</p></div> as JSX.Element);

    // Register the event to show the advice when the mouse is over the menu
    const mouseHover = () => {
        subEventHelper.getInstance().callEvent("rAdvice", props.data.lang.carrack[0].menu[0].carrackAdvice[0]);
    };

    // Register the event to hide the advice when the mouse is out of the menu
    const mouseOut = () => {
        subEventHelper.getInstance().callEvent("rAdvice", "");
    };
    
    // Register the useEffect to execute the callback when the component is mounted
    useEffect(() => {

        // Register the callback to focus the item
        subEventHelper.getInstance().registerCallback('focus-item', (itemName: string)=>{

            props.setState("inventory");

            tempHelper.getInstance().set('focusItem', itemName);

        }, 'carrackMenu');

        return () => {
            // Unregister the callback when the component is unmounted
            subEventHelper.getInstance().unregisterAllCallbacks('focus-item');
        }

    }, []);

    // Register the useEffect to execute the callback when the state is changed
    useEffect(() => {

        // Create the item
        const item = (
            <div className={`carrack-menu-item ${props.boatType}`} onClick={()=>{
                // Set the carrack type
                subEventHelper.getInstance().callEvent('returnCarrackType');
                // Delete the carrack type from the temp
                tempHelper.getInstance().delete('carrackType');
                // Hide the advice
                subEventHelper.getInstance().callEvent("rAdvice", "");
            }}>
                <img src={imageCarrack} alt="carrack" draggable={false}/>
                <p>{props.data.lang.carrack[0].type[0][props.boatType as 'advance'|'valor'|'balance'|'volante'][0]}</p>
            </div>
        )

        // Set the content
        setContent(
            <div className="carrack-menu" onMouseOver={mouseHover} onMouseOut={mouseOut}>
                <div className="carrack-menu-header">
                    <div className={`carrack-menu-button ${props.state === "inventory"? "select":""}`} onClick={() => props.setState("inventory")}>
                        <p>{props.data.lang.carrack[0].menu[0].inventory[0]}</p>
                    </div>
                    <div className={`carrack-menu-button ${props.state === "tracker"? "select":""}`} onClick={() => props.setState("tracker")}>
                        <p>{props.data.lang.carrack[0].menu[0].tracker[0]}</p>
                    </div>
                </div>
                <div className="carrack-menu-footer">
                    {item}
                </div>
            </div>
        );
    }, [props.state]);

    // Return the content
    return (
        content
    );
};

export default CarrackMenu;