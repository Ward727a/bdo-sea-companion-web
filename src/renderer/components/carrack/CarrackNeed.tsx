
import React, { useEffect } from 'react';

import dataDict from '@src/typings/data';

import './CarrackNeed.scss'
import subEventHelper from '@common/subEvent';
import tempHelper from '../../../common/temp';
import CarrackPercentage from './CarrackPercentage';

type Props = {
    data: dataDict;
    boatType : 'volante' | 'advance' | 'balance' | 'valor';
}

type item = {
    name: string;
    name_lang: string;
    desc_lang: string;
    image: string;
    barter: string;
    coin: string;
    daily: string;
    qty: number;

}

/**
 * Sorts an array of objects by a given property, thanks to {@link https://stackoverflow.com/a/4760279 Ege Özcan}!
 * @author Ege Özcan
 * @param property The property to sort by
 * @returns The sorting function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dynamicSort(property: any) {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (a: any,b: any) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

/**
 * The need component for the carrack page. This component is used to track the need of the carrack.
 * @param props The props of the component: {@link Props}
 * @returns the react component to render, type: {@link React.FC}
 * @since 0.0.2
 * @version 0.0.3
 * @license GPL-3.0
 */
const CarrackNeed  = (props: Props) => {
    // Props destructuring
    const { data, boatType } = props;
    
    // Get boat and item data from the data prop
    const boat = data.carrack.boat[0][boatType][0];
    const itemDict = data.carrack.items[0];
    
    // Get the need data for the selected boat type
    const need = boat.need[0];
    
    // Initialize the content state with a loading message
    const [content, setContent] = React.useState([<p key={"null"}>loading...</p>]);

    const [completionPercentage, setCompletionPercentage] = React.useState(0);

    // Initialize the checked state with the value from the temp helper
    const [checked, setChecked] = React.useState(tempHelper.getInstance().get('carrack-need-hide-completed'));
    
    // Get the current inventory data
    let inventory = data.save.inventory[0];
    
    // Import check and not-check icons
    const check = require('@assets/icons/check.svg');
    const not_check = require('@assets/icons/not-check.svg');

    // Import the checkbox-cross icon
    const icon = require(`../../../../assets/icons/checkbox-cross.svg`);

    // Register a callback to update the need data when the 'update-carrack-need' event is emitted
    useEffect(() => {


        let total = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let completed: any[] = [];
        // Register a callback to update the focus need when the 'focus-need' event is emitted
        subEventHelper.getInstance().registerCallback('focus-need', (itemName: string)=>{

            // Remove the focus class from the previously focused item
            if(tempHelper.getInstance().has('focusNeed')){
                const item = document.getElementById('item-'+tempHelper.getInstance().get('focusNeed')) as HTMLElement;
                if(item !== null){
                    item.classList.remove('focus');
                }
            }

            // If the item name is empty, return, it's used to remove the focus without setting a new one
            if(itemName == '') return;

            // Set the focus need in the temp helper
            tempHelper.getInstance().set('focusNeed', itemName);

            // Get the item element
            const item = document.getElementById('item-'+itemName) as HTMLElement;

            // Add the focus class to the item if it exists
            if(item !== null){
                item.classList.add('focus');
            }

        }, 'carrackNeed');
        
        // Register a callback to update the inventory data when the 'update-carrack-need' event is emitted
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        subEventHelper.getInstance().registerCallback('update-carrack-need', (data: any) => {

            // Update the inventory data
            inventory = ({...data});

            // Initialize an array to hold the total needed items
            const totalNeeded: Array<item> = []

            // Set the content state to an empty array
            setContent([]);

            // Initialize an array to hold the JSX elements for the content
            const contents: JSX.Element[] = [];

            // Create a copy of the need data and sort it by key
            const orederedNeed = Object.keys(need).sort().reduce(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (obj: any, key) => {
                    obj[key] = need[key];
                    return obj;
                },
                {}
            )

            // Initialize an array to hold the need names
            const nameList: Array<{value: string, keyT: string, boatKeyT: string, key: string, boatKey: string}> = [];

            // Iterate over each need type in the need data and add the need names to the name list
            Object.keys(orederedNeed).forEach((key) => {
                Object.keys(orederedNeed[key][0].need[0]).forEach((key2: string) => {
                    nameList.push({value: orederedNeed[key][0].need[0][key2], keyT: props.data.lang.carrack[0].items[0][key2][0].name[0], boatKeyT: props.data.lang.carrack[0].items[0][key][0].name[0], key: key2, boatKey: key});
                })
            });
            
            // Sort the name list by the need name and store it in a new variable
            const nameListOrdered = nameList.sort(dynamicSort("keyT"));

            // Initialize a boolean to check if the need type has been added to the content already, used to prevent duplicate need types
            let alreadyDone = false;
            // Iterate over each need type in the need data
            Object.keys(orederedNeed).forEach((key) => {
                // Check if the current need type has sub-needs
                if(need[key][0].need !== undefined){

                    if(alreadyDone) return;
                    // Iterate over each sub-need in the current need type
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Object.keys(nameListOrdered).forEach((rootKey: any) => {

                        const key2 = nameListOrdered[rootKey].key;
                        const key = nameListOrdered[rootKey].boatKey;

                        alreadyDone = true;
                        // Get the inventory data for the current sub-need
                        let inventoryHave =
                            inventory[key2] !== undefined ? parseInt(inventory[key2][0]) : 0;

                        // Calculate the total inventory needed for the current sub-need
                        const inventoryNeed =
                            parseInt(need[key][0].need[0][key2][0]) *
                            parseInt(need[key][0].quantity[0]);

                        if(inventoryHave > inventoryNeed) {
                            inventoryHave = inventoryNeed;
                        }

                        // Get the item data for the current sub-need
                        const info = itemDict[key2][0];

                        // If the total needed of the item exist, and is greater than the current inventory, add the item to the total needed array
                        if(totalNeeded.map((item) => item.name).includes(key2)) {
                            const index = totalNeeded.map((item) => item.name).indexOf(key2);
                            totalNeeded[index].qty += inventoryNeed;
                        } else {

                            // Create an item object for the current sub-need
                            const item: item = {
                                name: key2,
                                name_lang: props.data.lang.carrack[0].items[0][key2][0].name[0],
                                desc_lang: props.data.lang.carrack[0].items[0][key2][0].description? props.data.lang.carrack[0].items[0][key2][0].description[0] : props.data.lang.carrack[0].items[0][key2][0].name[0],
                                image: info.image[0],
                                barter: info.barter[0],
                                coin: info.coin[0],
                                daily: info.daily[0],
                                qty: inventoryNeed
                            }

                            // Add the item to the total needed array
                            totalNeeded.push(item);
                        }
                    });
                    } else {

                        // Get the inventory data for the current need type
                        if(itemDict[key] === undefined) {
                            itemDict[key] = [{
                                image: [""],
                                barter: ["0"],
                                coin: ["0"],
                                daily: ["0"]
                            }]
                        }

                        // Get the item data for the current need type
                        const info = itemDict[key][0];
                        
                        // If the total needed of the item exist, and is greater than the current inventory, add the item to the total needed array
                        if(totalNeeded.map((item) => item.name).includes(key)) {
                            const index = totalNeeded.map((item) => item.name).indexOf(key);
                            totalNeeded[index].qty += parseInt(need[key][0].quantity[0]);
                        } else {

                            // Create an item object for the current need type
                            const item: item = {
                                name: key,
                                name_lang: props.data.lang.carrack[0].items[0][key][0].name[0],
                                desc_lang: props.data.lang.carrack[0].items[0][key][0].description? props.data.lang.carrack[0].items[0][key][0].description[0] : props.data.lang.carrack[0].items[0][key][0].name[0],
                                image: info.image[0],
                                barter: info.barter[0],
                                coin: info.coin[0],
                                daily: info.daily[0],
                                qty: parseInt(need[key][0].quantity[0])
                            }

                            // Add the item to the total needed array
                            totalNeeded.push(item);
                        }
                    }
            });
            total = Object.keys(totalNeeded).length;
            // Create a JSX element for each of the total needed items
            totalNeeded.forEach((item) => {

                let havingQTY = 0;

                // Check if the current item is not in the inventory
                if(inventory[item.name] !== undefined) {
                    // Check if the current inventory is greater than the total needed
                    if(parseInt(inventory[item.name][0]) > item.qty) {
                        // Set the current inventory to the total needed
                        havingQTY = item.qty;
                    } else {
                        // Set the current inventory to the current inventory
                        havingQTY = parseInt(inventory[item.name][0]);
                    }
                }

                // Register a callback for the current item to open the detail
                subEventHelper.getInstance().registerCallback('rOpenCarrackNeed', (itemName: string) =>{

                    // Check if the current item is not the item that was clicked
                    if(itemName !== item.name) {
                        
                        // Get the detail element for the current item and the arrow element for the current item
                        const detail = document.querySelector(`.detail-${item.name}`);
                        const arrow = document.querySelector(`.arrow-${item.name}`);

                        // Check if the detail element exists
                        if(detail !== null) {
                            // Check if the detail element is not hidden
                            if(!detail.classList.contains("hidden")) {
                                // Hide the detail element and set the arrow to down
                                detail.classList.add("hidden");
                                arrow.textContent = "ᐯ";
                            }
                        }
                    }
                }, item.name);

                // If the total needed is less than or equal to 1, do not display the item (it's an component, so it's not needed to be displayed)
                if(item.qty <= 1) {

                    if(havingQTY >= 1){
                        if(!completed.includes(item.name)) completed.push(item.name);
                        setTimeout( ()=>{
                            subEventHelper.getInstance().callEvent('isDone', item.name, true);
                        }, 60);
                    } else {
                        completed = completed.filter((item2) => item2 !== item.name);
                        setTimeout( ()=>{
                            subEventHelper.getInstance().callEvent('isDone', item.name, false);
                        }, 60);
                    }

                    return;
                }

                // Set the class for the current item to be hidden if the user has the setting to hide completed items and the current item is completed
                let classS = '';

                // Check if the user has the setting to hide completed items and the current item is completed, and set the class to hidden
                if(tempHelper.getInstance().get('carrack-need-hide-completed') && havingQTY >= item.qty) classS = 'hidden';

                if(havingQTY >= item.qty){
                    setTimeout( ()=>{
                        subEventHelper.getInstance().callEvent('isDone', item.name, true);
                    }, 60);
                    if(!completed.includes(item.name)) completed.push(item.name);
                } else {
                    setTimeout( ()=>{
                        subEventHelper.getInstance().callEvent('isDone', item.name, false);
                    }, 60);
                    completed = completed.filter((item2) => item2 !== item.name);
                }
                // Add the current item to the contents array
                contents.push(
                    <div key={item.name} id={`item-${item.name}`} className={`total-needed-item ${havingQTY == item.qty? 'complete':''} ${classS}`} onClick={()=>{

                        // --------------------------------
                        // --- WHEN THE ITEM IS CLICKED ---
                        // --------------------------------

                        // Get the detail element for the current item and the arrow element for the current item
                        const detail = document.querySelector(`.detail-${item.name}`);
                        const arrow = document.querySelector(`.arrow-${item.name}`);

                        // Check if the detail element exists
                        if(detail !== null) {
                            // Check if the detail element is hidden
                            if(detail.classList.contains("hidden")) {
                                // Show the detail element and set the arrow to up
                                detail.classList.remove("hidden");
                                arrow.textContent = "ᐱ";

                                // Call the callback for the current item to close the detail of other items
                                subEventHelper.getInstance().callEvent('rOpenCarrackNeed', item.name);
                                
                            } else {
                                // Hide the detail element and set the arrow to down
                                detail.classList.add("hidden");
                                arrow.textContent = "ᐯ";
                            }
                        }
                    }}>
                        <div className='info-item'>
                        <p>{`${item.name_lang}`}</p><p>{havingQTY}/{`${item.qty}`}</p>
                        <p className={`arrow-${item.name}`}>ᐯ</p>
                        </div>
                        <div className={`detail-${item.name} hidden detail-item`}>
                            <div className='detail-daily'>
                                <p>{props.data.lang.carrack[0].totalNeeded[0].daily[0]}</p>
                                <img src={item.daily === "1" ? check : not_check} draggable={false}/> {/* If the item can be obtained daily, show the check image, else show the not check image */}
                            </div>
                            <div className='detail-coin'>
                                <p>{props.data.lang.carrack[0].totalNeeded[0].coin[0]}</p>
                                <img src={item.coin === "1" ? check : not_check} draggable={false}/> {/* If the item can be obtained by coin, show the check image, else show the not check image */}
                            </div>
                            <div className='detail-barter'>
                                <p>{props.data.lang.carrack[0].totalNeeded[0].barter[0]}</p>
                                <img src={item.barter === "1" ? check : not_check} draggable={false}/> {/* If the item can be obtained by barter, show the check image, else show the not check image */}
                            </div>
                        </div>
                    </div>
                );
            });

            // Set the content state with the JSX elements
            setContent(contents);
        
            setCompletionPercentage(Math.round((completed.length / total) * 100));
        }, 'CarrackNeed');

    
    return(()=>{
        // Unsubscribe from the inventory data
        subEventHelper.getInstance().unregisterAllCallbacks('update-carrack-need');
    });

    }, []); // The empty array ensures the effect only runs on mount
    
    
    // When the user is hovering the content, show the content advice
    const mouseHoverContent = () => {
        subEventHelper.getInstance().callEvent("rAdvice", props.data.lang.carrack[0].totalNeeded[0].totalNeededAdviceContent[0]);
    };

    // When the user is not hovering the content, hide the content advice
    const mouseOutContent = () => {
        subEventHelper.getInstance().callEvent("rAdvice", "");
    };

    // When the user is hovering the title, show the title advice
    const mouseHoverTitle = () => {
        subEventHelper.getInstance().callEvent("rAdvice", props.data.lang.carrack[0].totalNeeded[0].totalNeededAdviceTitle[0]);
    };

    // When the user is not hovering the title, hide the title advice
    const mouseOutTitle = () => {
        subEventHelper.getInstance().callEvent("rAdvice", "");
    };

    return (
        <div className="carrack-need">
            <div onMouseOver={mouseHoverTitle} onMouseOut={mouseOutTitle} className='carrack-need-title'>
                <label>
                    <input type='checkbox' checked={checked} onChange={() => {

                        // This checkbox is used to hide or show the items that are completed

                        // ------------------------------------
                        // --- WHEN THE CHECKBOX IS CLICKED ---
                        // ------------------------------------

                        // When the user clicks the checkbox, change the state of the checkbox and send the new state to the main process
                        setChecked(!checked)

                        // Send the new state to the main process to save it in the settings file
                        subEventHelper.getInstance().send('set-setting', {key: 'carrack-need-hide-completed', value: checked ? '0' : '1'})

                        // Set the new state in the tempHelper
                        tempHelper.getInstance().set('carrack-need-hide-completed', !checked ? true : false);

                        // Call the callback to hide or show the items that are completed
                        subEventHelper.getInstance().callEvent('update-carrack-need', data.save.inventory[0]);

                        }} />
                    <h3>{props.data.lang.carrack[0].totalNeeded[0].title[0]}</h3>
                    <div className='checkbox-border'>
                        <img className={`display-checkbox-${checked ? 'y' : 'n'}`} src={icon} draggable={false}/> {/* If the checkbox is checked, show the check image, else show the not check image */}
                    </div>
                </label>
            </div>
            <div className='carrack-need-content'  onMouseOver={mouseHoverContent} onMouseOut={mouseOutContent}>
            {content}
            </div>
            <div className='carrack-need-footer'>
                <CarrackPercentage percentage={completionPercentage}/>
            </div>
        </div>
    );
};


export default CarrackNeed;
