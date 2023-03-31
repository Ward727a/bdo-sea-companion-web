/**
 * @file CarrackInventory.tsx
 * @description This file contains the carrack inventory component. It's used to display the inventory of the carrack tracker. Each item is displayed in a {@link CarrackInventoryItem} component. Each item is sorted by the translation of the item name. Each item is unique to the boat type.
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.2
 */
import React, { useEffect } from "react";

import dataDict from "@src/typings/data";
import CarrackInventoryItem from "./CarrackInventoryItem";

import "./CarrackInventory.scss"
import tempHelper from "@common/temp";

type Props = {
    data: dataDict;
    boatType: string;
}

// function to sort the items by the translation of the item name
// Thanks to https://stackoverflow.com/a/4760279
function dynamicSort(property: any) {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a: any,b: any) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

/**
 * The carrack inventory component. It's used to display the inventory of the carrack tracker. Each item is displayed in a {@link CarrackInventoryItem} component. Each item is sorted by the translation of the item name. Each item is unique to the boat type.
 * @param props The props of the component: {@link Props}
 * @returns the react component to render, type: {@link React.FC}
 * @version 0.0.3
 * @since 0.0.2
 */
const CarrackInventory = (props: Props) => {

    // Create a state to store the content
    const content: Array<JSX.Element> = [];

    console.table(Object.keys(props.data.carrack.items[0]).sort());

    // Create a list of the items
    const orderedItems: any[] = Object.keys(props.data.carrack.items[0]).sort().reduce(
        (obj: any, key) => {

            if(key === "") {
                console.log("empty key");
                return obj;
            } else {
                obj[key] = [{data: props.data.carrack.items[0][key], keyT: props.data.lang.carrack[0].items[0][key][0].name[0]}];
                return obj;
            }
        },
        {}
    )

    // Create a list of the items with the translation of the name
    const nameList: any[] = [];
    
    // Add the items to the list
    Object.keys(orderedItems).forEach((key:any) => {
        nameList.push({value: orderedItems[key][0], keyT: props.data.lang.carrack[0].items[0][key][0].name[0], key: key});
    });

    // Sort the list by the translation of the name
    const nameListOrdered = nameList.sort(dynamicSort("keyT"));

    // Add the items to the content
    Object.keys(nameListOrdered).forEach((rootKey: any) => {

        // Get the main key of the item (not the translated name of the item)
        const key = nameListOrdered[rootKey].key;

        // Check if the item is trackable
        if(props.data.carrack.items[0][key][0].trackable !== undefined && props.data.carrack.items[0][key][0].trackable[0] === "1") return;

        // Check if the item is unique to the boat type
        // If the item is unique to the Galleass, check if the boat type is not Advance or Balance
        // If the item is unique to the Caravel, check if the boat type is not Volante or Valor
        if(key.includes('Galleass')){
            if(props.boatType.toLowerCase() === 'advance') return;
            if(props.boatType.toLowerCase() === 'balance') return;
        } else if(key.includes('Caravel')){
            if(props.boatType.toLowerCase() === 'volante') return;
            if(props.boatType.toLowerCase() === 'valor') return;
        }

        // Add the item to the content
        content.push(<CarrackInventoryItem key={key} data={props.data} index={key} boatType={props.boatType} />);
    });

    // Check if the inventory has a focus item (item to focus on)
    useEffect(() => {
        // We need to wait 10ms, so ALL the items are rendered
        setTimeout(() => {
            // if the name of the item is too long, change the font size to 12px, so it fits in the box
            document.querySelectorAll('.carrack-inventory-item-img p').forEach((p: HTMLParagraphElement) => {

                if(p.offsetHeight > 18) {
                    p.style.fontSize = '12px';
                } 
            });

            // Check if the inventory has a focus item (item to focus on)
            const hasFocusItem = tempHelper.getInstance().has('focusItem');

            // If the inventory has a focus item, focus on the item
            if(hasFocusItem) {

                // Get the focus item
                const focusItem = tempHelper.getInstance().get('focusItem');
                tempHelper.getInstance().delete('focusItem');

                // Focus on the item
                document.querySelectorAll('.carrack-inventory-item-img p').forEach((p: HTMLParagraphElement) => {

                    if(p.innerText.toLowerCase() === focusItem.toLowerCase()) {
                        const parent = p.parentElement.parentElement as HTMLDivElement;

                        const input = parent.querySelector('.carrack-inventory-item-qty p') as HTMLParagraphElement;

                        input.click();
                    }
                });

            }
        }, 10);
    }, []);

    // Return the content
    return (
        <div className="carrack-inventory">
            <div className="carrack-inventory-center">
                {content}
            </div>
        </div>
    );
};

export default CarrackInventory;