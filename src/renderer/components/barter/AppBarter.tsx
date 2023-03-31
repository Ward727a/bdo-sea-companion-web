/**
 * @file AppBarter.tsx
 * @description Barter page main component.
 * @author Ward
 * @license GPL-3.0
 * @version 0.0.1
 * @since 0.0.1
 */

import React from "react";

import win_ from "@src/typings/win";
import dataDict from '@src/typings/data';

// Import the stylesheet
import './AppBarter.scss'
import BarterCenter from "./BarterCenter";
import BarterLeft from "./BarterLeft";
import BarterRight from "./BarterRight";
import BarterBottom from "./BarterBottom";
import subEventHelper from "@common/subEvent";

const win:win_ = window;

// Define the props
type Props = {

    data: dataDict;

}

/**
 * The main component for the barter page.
 * @param props The props for the component, type: {@link Props}
 * @returns The react component, type: {@link React.FC<Props>}
 */
const AppBarter:React.FC<Props> = (props: Props) => {

    // Check each item in the save data
    Object.keys(props.data.item).forEach((value:string) => {

        // If the item is not in the save data, add it
        if(props.data.save.items[0][value] == undefined) {
            props.data.save.items[0][value] = [{
                'qty': ['0'],
                'ancado': ['0'],
                'epheria': ['0'],
                'iliya': ['0']
            }];
        }

        // Send the item to the main process to be saved
        subEventHelper.getInstance().send('save-item', value, parseInt(props.data.save.items[0][value][0].ancado[0]), 'ancado')
        subEventHelper.getInstance().send('save-item', value, parseInt(props.data.save.items[0][value][0].epheria[0]), 'epheria')
        subEventHelper.getInstance().send('save-item', value, parseInt(props.data.save.items[0][value][0].iliya[0]), 'iliya')

    });

    // Send notification to main process to change page
    win.api.send('pageChange', 'barter');

    // Return the react component
    return(
        <div id='app-barter'>
            
            <div id='app-barter-content'>

                <BarterLeft data={props.data} />
                <BarterCenter data={props.data} />
                <BarterRight onClick={(tier: number, hide:boolean) => {

                    // -------------------------------------
                    // --- WHEN CLICK EVENT IS TRIGGERED ---
                    // -------------------------------------

                    // Loop through each element with the class 'tier-' + tier
                    Object.keys(document.getElementsByClassName('tier-' + tier)).forEach((value:string, index:number) => {

                        // Get the element
                        const element = document.getElementsByClassName('tier-' + tier)[index] as HTMLElement;

                        // If the element is hidden, show it, else hide it
                        if (hide) {
                            element.style.display = '';

                            // Send notification to main process to change setting
                            subEventHelper.getInstance().send('set-setting', {key: 'hideTier' + tier, value: false})
                        } else {
                            element.style.display = 'none';

                            // Send notification to main process to change setting
                            subEventHelper.getInstance().send('set-setting', {key: 'hideTier' + tier, value: true})
                        }
                    });
                }} />

            </div>

            <div id='app-barter-footer'>
                <BarterBottom data={props.data} />
            </div>
        
        </div>
    );
};

export default AppBarter;