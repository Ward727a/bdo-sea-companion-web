/**
 * @file BarterLeftSpecial.tsx
 * @description Barter page left special barter component, It's used to display the next special barter component, the input and result.
 * 
 * @author Ward
 * @license GPL-3.0
 * @version 0.0.1
 * @since 0.0.1
 */

import React from "react";

import "./BarterLeftSpecial.scss";
import dataDict from '@src/typings/data';
import subEventHelper from "@common/subEvent";

type Props = {
    data: dataDict;
};

/**
 * Barter page left special barter component, It's used to display the next special barter component, the input and result.
 * @param props The props of the component, type: {@link Props}
 * @returns The component, type: {@link React.FC}
 */
const BarterLeftSpecial:React.FC<Props> = (props: Props) => {

    // Create a state to store the count of the next special barter
    const [count, setCount] = React.useState(parseInt(props.data.save.misc[0].lastBarter[0])+250);

    // Each special barter need 250 normal barter
    // So we need to add 250 to the last special barter
    const countNewSpecialBarter = (_value: string)=>{

        // If value is empty, set count to 250
        if(_value === "") return setCount(250);
        
        // Convert value to integer
        const value = parseInt(_value);

        // If value is not a number, set count to 250
        if(isNaN(value)) return setCount(250);

        // If value is less than 0, set count to 0
        if(value < 0) return setCount(0);

        setCount(value + 250);

        subEventHelper.getInstance().send('save-misc', "lastBarter", String(value));

    }

    
    const mouseHover = () => {
        subEventHelper.getInstance().callEvent("rAdvice", props.data.lang.barter[0].left[0].specialBarterAdvice[0]);
    };

    const mouseOut = () => {
        subEventHelper.getInstance().callEvent("rAdvice", "");
    };

    return (
        <div className="barter-left-special" onMouseOver={mouseHover} onMouseOut={mouseOut}>
            <div className="InputSpecialBarter">
                <label htmlFor="LastSpecialBarter">{props.data.lang.barter[0].left[0].lastSpecialBarterAt[0]}</label>
                <input id="LastSpecialBarter" type="number" defaultValue={parseInt(props.data.save.misc[0].lastBarter[0])} onChange={(e)=>countNewSpecialBarter(e.target.value)} />
            </div>
            <div className="EstimatedNextSpecial">
                <p>{props.data.lang.barter[0].left[0].estimatedNext[0]}</p>
                <p className="countEstimated">{count}</p>
            </div>
        </div>
    );
};

export default BarterLeftSpecial;