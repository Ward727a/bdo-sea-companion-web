/**
 * @file CarrackInventoryItem.tsx
 * @description This file contains the carrack inventory item component. It's used to display the inventory of the carrack tracker. Each item is displayed in a {@link CarrackInventoryItem} component. Each item is unique to the boat type.
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.2
 */
import React, { useEffect } from 'react';

import dataDict from '@src/typings/data';
import subEventHelper from '@common/subEvent';

type Props = {
    data: dataDict;
    index: string;
    boatType: string;
}

/**
 * The carrack inventory item component. It's used to display the inventory of the carrack tracker. Each item is displayed in a {@link CarrackInventoryItem} component. Each item is unique to the boat type.
 * @param props The props of the component: {@link Props}
 * @returns the react component to render, type: {@link React.FC}
 * @version 0.0.3
 * @since 0.0.2
 */
const CarrackInventoryItem = (props: Props) => {

    // Create a state to store the content
    const [content, setContent] = React.useState<JSX.Element>(<></>);

    // Run the code when the component is mounted
    useEffect(() => {
        // Create a list of the items, it's contains: the image, the name and the quantity
        const item_qty = props.data.save.inventory[0][props.index]? props.data.save.inventory[0][props.index][0] : 0;
        const item_img_src = props.data.carrack.items[0][props.index][0].image[0];
        const item_name = props.data.lang.carrack[0].items[0][props.index][0].name[0];

        // Import the image, we use a then to wait for the image to be imported
        import(`@assets/images/items/${item_img_src}`).then((img) => {

            // Create the image element
            const item_img = img['default'];
            
            // Create a function to handle the click event, it's used to edit the quantity and to focus the item in the need list in the CarrackNeed.tsx component
            const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
                
                // Call the focus-need event to focus the item in the need list
                subEventHelper.getInstance().callEvent('focus-need', props.index);

                // Get the target element
                const target = e.target;
        
                // Create a variable to store the quantity element
                let qty = null;
        
                // If the target is a div, get the quantity element, else the target is the quantity element
                if (target instanceof HTMLDivElement) {
                    qty = target.querySelector('p');
                } else {
                    qty = target as HTMLParagraphElement;
                }
        
                // If the quantity element is an input, return
                if(qty instanceof HTMLInputElement) {
                    return;
                }
        
                // Create an input element and set the value to the quantity
                const input = document.createElement('input');
                input.type = 'number';
                input.value = qty?.innerText || '0';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                
                // If the quantity element exists, replace it with the input element and focus it
                if (qty) {
        
                    qty.replaceWith(input)
                    input.focus();
                    input.select();
                    input.addEventListener('input', (e: any)=>{
                        changeHandler(e);
                    })
                }
        
            }
        
            // Create a function to handle the blur event, it's used to save the quantity and to unfocus the item in the need list in the CarrackNeed.tsx component
            const blurHandler = (e: React.FocusEvent<HTMLDivElement>) => {

                // Get the target element
                const target = e.target;
        
                // Create a variable to store the input element
                let input = null;
        
                // If the target is a div, get the input element, else the target is the input element
                if (target instanceof HTMLDivElement) {
                    input = target.querySelector('input');
                } else {
                    input = target as HTMLInputElement;
                }
        
                // Create a paragraph element and set the value to the input value
                const qty = document.createElement('p');
                qty.innerText = parseInt(input?.value).toString() === 'NaN' ? '0' : parseInt(input?.value).toString();
        
                // If the input element exists, replace it with the paragraph element
                if (input) {
                    input.replaceWith(qty);
                }
                
                // Call the focus-need event to unfocus the item in the need list
                subEventHelper.getInstance().callEvent('focus-need', '');
            }
        
            // Create a function to handle the keydown event, it's used to save the quantity and to unfocus the item in the need list in the CarrackNeed.tsx component
            const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
                
                // Get the target element
                const target = e.target as HTMLInputElement;
                // Get the value of the input
                let value = target.value;
                
                // If key pressed is anyother than enter, escape or number keys, prevent the event
                if (e.key === 'Enter') {
                    // If the key pressed is enter, blur the input to execute the blur event
                    target.blur();
                } else if (e.key === 'Escape') {
                    // If the key pressed is escape, set the value to the quantity and blur the input to execute the blur event
                    target.value = item_qty.toString();
                    target.blur();
                } else if (e.key.match(/^[0-9]+$/) || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    // If the key pressed is a number, backspace, delete, arrow up or arrow down, set the value to the input value
                    if(e.key.match(/^[0-9]+$/)){
                        value = target.value;
                    } else if (e.key === 'Backspace' || e.key === 'Delete') {
                        // If the key pressed is backspace or delete, remove the last character of the value
                        value = value.slice(0, -1);
                    } else if (e.key === 'ArrowUp') {
                        // If the key pressed is arrow up, add 1 to the value
                        value = (parseInt(value) + 1).toString();
                    } else if (e.key === 'ArrowDown') {
                        // If the key pressed is arrow down, remove 1 to the value
                        value = (parseInt(value) - 1).toString();
                    }
                } else {
                    e.preventDefault();
                }
        
                // If the value is NaN, empty or negative, set the value to 0
                if(value === 'NaN' || value === '' || value.includes('-')){
                    value = '0';
                }
        
                // // Send the value to the CarrackInventory.tsx component
                // subEventHelper.getInstance().send('carrack-inventory-save-qty', props.index, parseInt(value))

                // // save the value in the save object
                // props.data.save.inventory[0] = props.data.save.inventory[0] || {};
                // props.data.save.inventory[0][props.index] = props.data.save.inventory[0][props.index] || ["0"];
                // props.data.save.inventory[0][props.index][0] = value;

                // // Call the update-carrack-need event to update the need list
                // subEventHelper.getInstance().callEvent('update-carrack-need', props.data.save.inventory[0])
            }

            const changeHandler = (e: InputEvent) =>{

                const target = e.target as HTMLInputElement;
                let value = target.value;
        
                // If the value is NaN, empty or negative, set the value to 0
                if(value === 'NaN' || value === '' || value.includes('-')){
                    value = '0';
                }
        
                // Send the value to the CarrackInventory.tsx component
                subEventHelper.getInstance().send('carrack-inventory-save-qty', props.index, parseInt(value))

                // save the value in the save object
                props.data.save.inventory[0] = props.data.save.inventory[0] || {};
                props.data.save.inventory[0][props.index] = props.data.save.inventory[0][props.index] || ["0"];
                props.data.save.inventory[0][props.index][0] = value;

                // Call the update-carrack-need event to update the need list
                subEventHelper.getInstance().callEvent('update-carrack-need', props.data.save.inventory[0])
            }
        
            // Create a function to handle the click event on the item, it's used to focus the item in the need list in the CarrackNeed.tsx component
            const clickHandlerItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{

                // Call the focus-need event to focus the item in the need list
                const input = e.currentTarget.querySelector('.carrack-inventory-item-qty') as HTMLDivElement;
                // Call the click event on the quantity element to execute the click event
                input.click();
            }
            subEventHelper.getInstance().registerEvent('isDone');
            // Register the callback to the isDone event
            subEventHelper.getInstance().registerCallback('isDone', (key: string, value: boolean) => {
                // If the key is the same as the item key, set the item as done
                if(key === props.index){
                    setIsDone(value);
                }
            }, props.index);

            // Creation of the function setIsDone
            const setIsDone = (isDone: boolean) => {

                // Set the done class to the item if it's done
                if(isDone){

                    document.querySelector('.item-' + props.index)?.classList.add('done');
                } else {
                    document.querySelector('.item-' + props.index)?.classList.remove('done');
                }
            }


            // Set the content of the component
            setContent(
                <div className={`carrack-inventory-item item-${props.index}`} onClick={clickHandlerItem}>
                    <div className="carrack-inventory-item-img">
                        <img src={item_img} alt={item_name + " image"} draggable={false}/>
                        <p>{item_name}</p>
                    </div>
                    <div className='carrack-inventory-item-qty' onClick={clickHandler} onBlur={blurHandler} onKeyDown={keyDownHandler} >
                        {/* Here, the qty need to be changed to an input when clicking on it */}
                        <p>{item_qty}</p>
                    </div>
                </div>
            );
        }).catch((err) => {
            // If an error occured, log it
            console.log(err);
        });
    }, []);

    // Return the content
    return (
        content
    );
};

export default CarrackInventoryItem;