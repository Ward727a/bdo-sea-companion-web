/**
 * @file BarterCenterInput.tsx
 * @description Barter page center input component, it's used to switch between input and span.
 * 
 * @author Ward
 * @license GPL-3.0
 * @version 0.0.1
 * @since 0.0.1
 */

import React from "react";

type Props = {
    showInputEle: boolean;
    // data: dataDict;
    value: number;
    // setValue: (value: number) => void;
    handleChange: (event?: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (event?: React.FocusEvent<HTMLInputElement>) => void;
    handleDoubleClick: (event?: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
    limit: number;
}

/**
 * Barter Center Input Component, it's used to switch between input and span.
 * @param props The props of the component, type: {@link Props}
 * @returns The component, type: {@link React.FC}
 */
const ElementMaker: React.FC<Props> = (props: Props) => {
    
    const value = isNaN(props.value) ? 0 : props.value;
    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    return(
        <span className="input-center-item" >
            {
                props.showInputEle ? (
                    <input
                        type="number"
                        className="input-number-barter"
                        defaultValue={value}
                        onChange={props.handleChange}
                        onKeyDown={(e) => {

                            switch (e.key) {
                                case 'Enter':
                                    props.handleBlur();
                                    break;
                                case 'Escape':
                                    props.handleBlur();
                                    break;
                                case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
                                    break;
                                default:
                                    e.preventDefault();
                                    break;
                            }

                        }}
                        onKeyDownCapture={(e) => {
                            switch (e.key) {
                                
                                case 'ArrowUp':{
                                    e.preventDefault();
                                    
                                    const from = e.target as HTMLInputElement;
                                    const parent = from.parentElement.parentElement as HTMLElement;

                                    let keyToFocusTR = -1
                                    let keyToFocusTD = -1;

                                    parent.classList.add('old-focus');

                                    // Get the key of the element to focus
                                    Object.keys(parent.parentElement.parentElement.children).forEach((value, key) => {
                                        // Check if the element is empty; if it is, skip it
                                        if(parent.parentElement.parentElement.children[key].children.length === 0) return;

                                        // Check if the element is the one to focus
                                        if([...parent.parentElement.parentElement.children[key].children].filter((child, index) => {

                                            if(child.classList.contains('old-focus')){

                                                child.classList.remove('old-focus');

                                                keyToFocusTR = key;
                                                keyToFocusTD = index;
                                                return true;
                                            }
                                            return false;
                                        })) {
                                            return;
                                        }
                                    })

                                    // Check if the next element is the last one or not
                                    if(keyToFocusTR-1 <= -1) return;

                                    let key = keyToFocusTR-1;

                                    // Get the next element to focus with array method
                                    let nextIndex = parent.parentElement.parentElement.children[keyToFocusTR-1].children[keyToFocusTD].children[0].children[0] as HTMLSpanElement;

                                    while(nextIndex.parentElement.parentElement.parentElement.style.display === 'none'){
                                        key--;
                                        if(key <= -1) return;
                                        nextIndex = parent.parentElement.parentElement.children[key].children[keyToFocusTD].children[0].children[0] as HTMLSpanElement;
                                    }
                                    
                                    
                                    // Blur the current element and focus the next one
                                    from.blur();
                                    nextIndex.click();
                                    break;
                                }
                                case 'ArrowDown':{
                                    e.preventDefault();
                                    
                                    const from = e.target as HTMLInputElement;
                                    const parent = from.parentElement.parentElement as HTMLElement;

                                    let keyToFocusTR = -1
                                    let keyToFocusTD = -1;

                                    parent.classList.add('old-focus');

                                    // Get the key of the element to focus
                                    Object.keys(parent.parentElement.parentElement.children).forEach((value, key) => {
                                        // Check if the element is empty; if it is, skip it
                                        if(parent.parentElement.parentElement.children[key].children.length === 0) return;

                                        // Check if the element is the one to focus
                                        if([...parent.parentElement.parentElement.children[key].children].filter((child, index) => {

                                            if(child.classList.contains('old-focus')){

                                                child.classList.remove('old-focus');
                                                keyToFocusTR = key;
                                                keyToFocusTD = index;
                                                return true;
                                            }
                                            return false;
                                        })) {
                                            return;
                                        }
                                    })

                                    // Check if the next element is the last one or not
                                    if(keyToFocusTR === -1 || keyToFocusTR+1 >= parent.parentElement.parentElement.children.length) return;

                                    let key = keyToFocusTR+1;

                                    // Get the next element to focus
                                    let nextIndex = parent.parentElement.parentElement.children[keyToFocusTR+1].children[keyToFocusTD].children[0].children[0] as HTMLSpanElement;

                                    while(nextIndex.parentElement.parentElement.parentElement.style.display === 'none'){
                                        key++;
                                        if(key >= parent.parentElement.parentElement.children.length) return;
                                        nextIndex = parent.parentElement.parentElement.children[key].children[keyToFocusTD].children[0].children[0] as HTMLSpanElement;
                                    }

                                    console.trace(nextIndex.parentElement.parentElement.parentElement)

                                    // Blur the current element and focus the next one
                                    from.blur();
                                    nextIndex.click();
                                    break;
                                }
                                case 'ArrowLeft':{
                                    e.preventDefault();
                                    const from = e.target as HTMLInputElement;
                                    const parent = from.parentElement as HTMLElement;
                                    
                                    parent.classList.add('old-focus');

                                    // Get the key of the element to focus
                                    Object.keys(parent.parentElement.parentElement.children).forEach((value, key) => {
                                        // Check if the element is empty; if it is, skip it
                                        if(parent.parentElement.parentElement.children[key].children.length === 0) return;

                                        const child = parent.parentElement.parentElement.children[key].children[0] as HTMLElement;

                                        // Check if the element is the one to focus
                                        if(child.classList.contains('old-focus')){

                                            child.classList.remove('old-focus');

                                            // Check if the next element is the last one or not
                                            if(!parent.parentElement.parentElement.children[key - 1]) return;

                                            // Get the next element to focus
                                            let prev = parent.parentElement.parentElement.children[key - 1].children[0] as HTMLElement;

                                            if(!prev) return;

                                            if(prev.parentElement !== undefined && prev.parentElement.style.display === 'none'){
                                                if(!parent.parentElement.parentElement.children[key - 2]) return;
                                                prev = parent.parentElement.parentElement.children[key - 2].children[0] as HTMLElement;
                                                if(!prev) return;
                                                if(prev.parentElement && prev.parentElement.style.display === 'none'){
                                                    return;
                                                }
                                            }
                                            if(prev){
                                                const input = prev.children[0] as HTMLSpanElement;

                                                // Blur the current element and focus the next one
                                                input.click();
                                                from.blur();
                                            }
                                        }
                                    })
                                    break;
                                }
                                case 'ArrowRight':{
                                    e.preventDefault();
                                    
                                    const from = e.target as HTMLInputElement;
                                    const parent = from.parentElement as HTMLElement;
                                    
                                    parent.classList.add('old-focus');

                                    // Get the key of the element to focus
                                    Object.keys(parent.parentElement.parentElement.children).forEach((value, key) => {
                                        // Check if the element is empty; if it is, skip it
                                        if(parent.parentElement.parentElement.children[key].children.length === 0) return;

                                        const child = parent.parentElement.parentElement.children[key].children[0] as HTMLElement;

                                        // Check if the element is the one to focus
                                        if(child.classList.contains('old-focus')){
                                            child.classList.remove('old-focus');

                                            // Check if the next element is the last one or not
                                            if(!parent.parentElement.parentElement.children[key + 1]) return;

                                            // Get the next element to focus
                                            let prev = parent.parentElement.parentElement.children[key + 1].children[0] as HTMLElement;
                                            
                                            if(prev.parentElement && prev.parentElement.style.display === 'none'){
                                                if(!parent.parentElement.parentElement.children[key + 2]) return;
                                                prev = parent.parentElement.parentElement.children[key + 2].children[0] as HTMLElement;
                                                if(prev.parentElement && prev.parentElement.style.display === 'none'){
                                                    return;
                                                }
                                            }
                                            if(prev){
                                                const input = prev.children[0] as HTMLSpanElement;

                                                // Blur the current element and focus the next one
                                                input.click();
                                                from.blur();
                                            }
                                        }
                                    })
                                    break;
                                }
                                case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
                                    break;
                                default:
                                    e.preventDefault();
                                    break;
                            }
                        }}
                        onBlur={props.handleBlur}
                        autoFocus
                        onFocus={(e) => {
                            e.target.select();
                        }}
                    />
                ) : (
                <span
                    onClick={props.handleDoubleClick}
                    className="table-edit"
                >
                    {value}
                </span>
                )
            }
        </span>
    )
}

export default ElementMaker;